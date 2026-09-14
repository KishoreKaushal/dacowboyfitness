/**
 * Thin fetch wrapper for the Curriq headless LMS API.
 * Base URL is configured via VITE_CURRIQ_API_URL (defaults to localhost in dev).
 */

const BASE_URL = (import.meta.env.VITE_CURRIQ_API_URL as string | undefined) ?? 'http://localhost:4100'

export interface VideoPlaybackResponse {
  playbackId: string
  token: string
  url: string
  expiresInSeconds: number
  accessMode: string
  contentType: string
}

/**
 * Mints a signed Mux playback token for the given asset.
 * Requires a Curriq read or write API key.
 */
export async function getVideoPlayback(
  assetId: string,
  apiKey: string,
): Promise<VideoPlaybackResponse> {
  const res = await fetch(`${BASE_URL}/v1/videos/${encodeURIComponent(assetId)}/playback`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: '{}',
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Curriq API error ${res.status}: ${body}`)
  }

  return res.json() as Promise<VideoPlaybackResponse>
}
