import { ref } from 'vue'
import type { JournalEntry, JournalEntrySummary } from '../types/journal'

const BASE_URL = import.meta.env.VITE_JOURNAL_CONTENT_BASE_URL ?? '/content/journals'

// In-memory cache across navigation within the same session
const indexCache = ref<JournalEntrySummary[] | null>(null)
const entryCache = new Map<string, JournalEntry>()

export function useJournals() {
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  /**
   * Fetch all published journal entry summaries from index.json.
   */
  async function fetchPublishedJournals(): Promise<JournalEntrySummary[]> {
    if (indexCache.value) {
      return indexCache.value
    }

    isLoading.value = true
    error.value = null

    try {
      const res = await fetch(`${BASE_URL}/index.json`)
      if (!res.ok) {
        throw new Error(`Failed to load journal index (HTTP ${res.status})`)
      }
      const data = await res.json()
      const journals: JournalEntrySummary[] = data.journals || []
      indexCache.value = journals
      return journals
    } catch (err: any) {
      console.error('[useJournals] Failed to fetch journal index:', err)
      error.value = err?.message || 'Failed to load journals'
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch a single journal entry by its deterministic slug.
   */
  async function fetchJournalBySlug(slug: string): Promise<JournalEntry | null> {
    if (!slug) return null

    if (entryCache.has(slug)) {
      return entryCache.get(slug)!
    }

    isLoading.value = true
    error.value = null

    try {
      const res = await fetch(`${BASE_URL}/entries/${slug}.json`)
      if (res.status === 404) {
        error.value = `Journal not found: "${slug}"`
        return null
      }
      if (!res.ok) {
        throw new Error(`Failed to load journal "${slug}" (HTTP ${res.status})`)
      }
      const entry: JournalEntry = await res.json()
      entryCache.set(slug, entry)
      return entry
    } catch (err: any) {
      console.error(`[useJournals] Failed to fetch entry for "${slug}":`, err)
      error.value = err?.message || 'Failed to load journal'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    fetchJournalBySlug,
    fetchPublishedJournals
  }
}
