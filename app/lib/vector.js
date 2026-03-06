import { Index } from '@upstash/vector'

let vectorIndex = null

export function getVectorIndex() {
  if (!vectorIndex) {
    vectorIndex = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    })
  }
  return vectorIndex
}

export async function queryTweets(text, topK = 15) {
  const index = getVectorIndex()
  const results = await index.query({
    data: text,
    topK,
    includeMetadata: true,
  })
  return results
    .filter((r) => r.score > 0.5)
    .map((r) => ({
      text: r.metadata?.text || '',
      date: r.metadata?.date || '',
      score: r.score,
    }))
}
