import { ref } from 'vue'
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { JournalEntry, JournalEntrySummary } from '../types/journal'

export function useJournals() {
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  /**
   * Fetch a single journal entry by its deterministic slug.
   * Firestore-only: no mock fallback.
   */
  async function fetchJournalBySlug(slug: string): Promise<JournalEntry | null> {
    if (!slug) return null
    isLoading.value = true
    error.value = null

    try {
      const docRef = doc(db, 'journals', slug)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        error.value = `Journal not found: "${slug}"`
        return null
      }

      const data = docSnap.data()
      return {
        id: docSnap.id,
        slug: data.slug || docSnap.id,
        title: data.title || '',
        author: data.author || 'Kishore Kaushal',
        date: data.date || data.createdAt || new Date().toISOString(),
        published: data.published !== false,
        tags: data.tags || [],
        excerpt: data.excerpt || '',
        readTimeMinutes: data.readTimeMinutes || 3,
        coverImage: data.coverImage || undefined,
        blocks: data.blocks || [],
        relatedJournals: data.relatedJournals || []
      } as JournalEntry
    } catch (err: any) {
      console.error(`[useJournals] Firestore fetch failed for slug "${slug}":`, err)
      error.value = err?.message || 'Failed to load journal'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch all published journal entry summaries for index listing.
   * Firestore-only: no mock fallback.
   */
  async function fetchPublishedJournals(): Promise<JournalEntrySummary[]> {
    isLoading.value = true
    error.value = null

    try {
      const journalsCol = collection(db, 'journals')
      const q = query(journalsCol, orderBy('date', 'desc'))
      const snapshot = await getDocs(q)

      return snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data()
          return {
            id: docSnap.id,
            slug: data.slug || docSnap.id,
            title: data.title || 'Untitled',
            excerpt: data.excerpt || '',
            tags: data.tags || [],
            readTimeMinutes: data.readTimeMinutes || 3,
            date: data.date || data.createdAt || '',
            coverImage: data.coverImage?.src || (typeof data.coverImage === 'string' ? data.coverImage : undefined)
          } as JournalEntrySummary
        })
        .filter((j) => j.slug && j.title)
    } catch (err: any) {
      console.error('[useJournals] Firestore list fetch failed:', err)
      error.value = err?.message || 'Failed to load journals'
      return []
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
