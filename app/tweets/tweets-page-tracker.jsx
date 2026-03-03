"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function TweetsPageTracker({ tweetCount }) {
  useEffect(() => {
    posthog.capture("tweets_page_viewed", {
      tweet_count: tweetCount,
    });
  }, [tweetCount]);

  return null;
}
