import Anthropic from '@anthropic-ai/sdk'
import { queryTweets } from '../../lib/vector'
import { buildSystemPrompt, selectModel } from '../../lib/prompts'
import PostHogClient from '../../posthog'

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts)/i,
  /you\s+are\s+(now|no\s+longer)/i,
  /act\s+as\s+(a|an|if)/i,
  /pretend\s+(to\s+be|you('re|\s+are))/i,
  /reveal\s+(your|the)\s+(system|original)\s+prompt/i,
  /execute\s+(this\s+)?(code|command|script)/i,
]

function isInjectionAttempt(text) {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text))
}

export async function POST(request) {
  // Kill switch
  if (process.env.CHAT_ENABLED === 'false') {
    return Response.json(
      { error: 'Chat is currently unavailable.' },
      { status: 503 }
    )
  }

  const posthog = PostHogClient()
  const distinctId =
    request.headers.get('x-posthog-distinct-id') || 'server_anonymous'

  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Messages required.' }, { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]

    // Input length guard
    if (lastMessage.content && lastMessage.content.length > 500) {
      return Response.json(
        { error: 'Message too long. Keep it under 500 characters.' },
        { status: 400 }
      )
    }

    // Prompt injection short-circuit
    if (isInjectionAttempt(lastMessage.content || '')) {
      return Response.json({
        role: 'assistant',
        content: "Yeah, that's not gonna work. What do you actually want to know?",
      })
    }

    // Truncate to last 6 turns (12 messages: 6 user + 6 assistant)
    let truncatedMessages = messages.slice(-12).map((m) => ({
      role: m.role,
      content: m.content,
    }))
    // Claude requires first message to be user role
    if (truncatedMessages[0]?.role !== 'user') {
      truncatedMessages = truncatedMessages.slice(1)
    }

    // Retrieve relevant tweets
    const tweets = await queryTweets(lastMessage.content, 15)

    // Build prompt
    const systemPrompt = buildSystemPrompt(tweets)
    const model = selectModel(truncatedMessages)

    // Stream from Claude
    const anthropic = new Anthropic()
    const stream = anthropic.messages.stream({
      model,
      max_tokens: 300,
      system: systemPrompt,
      messages: truncatedMessages,
    })

    posthog.capture({
      distinctId,
      event: 'chat_message_sent',
      properties: {
        model,
        tweet_count: tweets.length,
        message_length: lastMessage.content?.length || 0,
        turn_count: messages.length,
        source: 'api',
      },
    })

    // Convert Anthropic SDK stream to ReadableStream for the client
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta?.type === 'text_delta'
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              )
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } catch (streamError) {
          console.error('[chat] Stream error:', streamError?.message)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: '\n\n[error: something went wrong]' })}\n\n`)
          )
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[chat] Error:', error?.message, error?.stack)

    posthog.capture({
      distinctId,
      event: 'chat_error',
      properties: {
        error_message: error?.message || 'Unknown error',
        source: 'api',
      },
    })

    return Response.json(
      { error: 'Something went wrong.', debug: error?.message },
      { status: 500 }
    )
  }
}
