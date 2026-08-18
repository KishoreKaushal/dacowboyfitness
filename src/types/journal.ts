export type JournalBlockType = 'markdown' | 'video' | 'image'

export interface BaseBlock {
  id: string
  type: JournalBlockType
}

export interface MarkdownBlockData extends BaseBlock {
  type: 'markdown'
  content: string
}

export interface VideoBlockData extends BaseBlock {
  type: 'video'
  provider: 'youtube' | 'vimeo' | 'html5'
  src: string
  caption?: string
  aspectRatio?: string
}

export interface ImageBlockData extends BaseBlock {
  type: 'image'
  src: string
  alt?: string
  caption?: string
  aspectRatio?: string
}

export type JournalBlock = MarkdownBlockData | VideoBlockData | ImageBlockData

export interface JournalEntrySummary {
  id: string
  slug: string
  title: string
  excerpt: string
  tags: string[]
  readTimeMinutes: number
  date: string
  coverImage?: string
}

export interface JournalEntry {
  id: string
  slug: string
  title: string
  author: string
  date: string
  published: boolean
  tags: string[]
  excerpt: string
  readTimeMinutes: number
  coverImage?: {
    src: string
    alt?: string
    caption?: string
  }
  blocks: JournalBlock[]
  relatedJournals: JournalEntrySummary[]
}
