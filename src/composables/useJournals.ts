import { ref } from 'vue'
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { JournalEntry, JournalEntrySummary } from '../types/journal'
import { mockJournals } from '../data/mockJournals'

export function useJournals() {
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  /**
   * Fetch a single journal entry by its deterministic slug
   */
  async function fetchJournalBySlug(slug: string): Promise<JournalEntry | null> {
    if (!slug) return null
    isLoading.value = true
    error.value = null

    try {
      // 1. Attempt to fetch from Firestore
      const docRef = doc(db, 'journals', slug)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
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
      }

      // 2. Fallback to local mock data if not yet seeded in Firestore
      const localMatch = mockJournals.find((j: JournalEntry) => j.slug === slug)
      if (localMatch) {
        return localMatch
      }

      return null
    } catch (err: any) {
      console.warn(`[useJournals] Firestore fetch failed for slug "${slug}", falling back to mock data:`, err)
      const localMatch = mockJournals.find((j: JournalEntry) => j.slug === slug)
      return localMatch || null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch all published journal entry summaries for index listing
   */
  async function fetchPublishedJournals(): Promise<JournalEntrySummary[]> {
    isLoading.value = true
    error.value = null

    try {
      const journalsCol = collection(db, 'journals')
      const q = query(journalsCol, orderBy('date', 'desc'))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
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
          .filter((j) => j.slug)
      }

      // Fallback to local mock data if Firestore has no entries
      return mockJournals.map((j: JournalEntry) => ({
        id: j.id,
        slug: j.slug,
        title: j.title,
        excerpt: j.excerpt,
        tags: j.tags,
        readTimeMinutes: j.readTimeMinutes,
        date: j.date,
        coverImage: j.coverImage?.src
      }))
    } catch (err: any) {
      console.warn('[useJournals] Firestore list fetch failed, falling back to mock data:', err)
      return mockJournals.map((j: JournalEntry) => ({
        id: j.id,
        slug: j.slug,
        title: j.title,
        excerpt: j.excerpt,
        tags: j.tags,
        readTimeMinutes: j.readTimeMinutes,
        date: j.date,
        coverImage: j.coverImage?.src
      }))
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
