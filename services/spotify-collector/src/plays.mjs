export function toSecond(ts) {
  return ts.slice(0, 19) + 'Z'
}

export function dedupeKey(play) {
  const identity =
    play.track_uri || `${play.track || ''}|||${play.artist || ''}`
  return `${toSecond(play.ts)}|${identity}`
}

export function fromArchive(raw) {
  return {
    ts: raw.ts,
    track_uri: raw.spotify_track_uri || null,
    track: raw.master_metadata_track_name || null,
    artist: raw.master_metadata_album_artist_name || null,
    album: raw.master_metadata_album_album_name || null,
    ms_played: raw.ms_played || 0,
    duration_ms: null,
    source: 'archive',
  }
}

// played_at marks the end of a play. The gap to the previous play's end
// bounds the time this play could have run, so a skip counts as its real
// length. A pause between plays can only inflate a play up to its duration.
export function fromRecentlyPlayed(items, previousTs) {
  const sorted = [...items]
    .filter((it) => it.track && it.played_at)
    .sort((a, b) => a.played_at.localeCompare(b.played_at))
  const plays = []
  let prev = previousTs ? Date.parse(previousTs) : null
  for (const it of sorted) {
    const end = Date.parse(it.played_at)
    const duration = it.track.duration_ms || 0
    const gap = prev == null ? duration : Math.max(0, end - prev)
    plays.push({
      ts: it.played_at,
      track_uri: it.track.uri || null,
      track: it.track.name || null,
      artist: it.track.artists?.[0]?.name || null,
      album: it.track.album?.name || null,
      ms_played: Math.min(duration, gap),
      duration_ms: duration,
      source: 'api',
    })
    prev = end
  }
  return plays
}
