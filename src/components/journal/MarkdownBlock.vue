<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const props = defineProps<{
  content: string
}>()

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
})

const renderedHtml = computed(() => {
  if (!props.content) return ''

  const placeholders = new Map<string, string>()
  let counter = 0

  // 1. Temporarily protect code blocks and inline code from math matching
  let text = props.content.replace(/(```[\s\S]*?```|`[^`\n]+?`)/g, (match) => {
    const id = `@@CODE_TOKEN_${counter++}@@`
    placeholders.set(id, match)
    return id
  })

  // 2. Extract and pre-render block math: $$...$$
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
    const id = `@@MATH_BLOCK_${counter++}@@`
    try {
      const rendered = katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false,
        strict: false,
      })
      placeholders.set(id, `<div class="katex-display-wrapper">${rendered}</div>`)
    } catch {
      placeholders.set(id, match)
    }
    return `\n\n${id}\n\n`
  })

  // 3. Extract and pre-render inline math: $...$
  text = text.replace(/(^|[^\$])\$([^\$\n]+?)\$(?!\$)/g, (_match, prefix, math) => {
    const id = `@@MATH_INLINE_${counter++}@@`
    try {
      const rendered = katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
        strict: false,
      })
      placeholders.set(id, rendered)
    } catch {
      placeholders.set(id, `$${math}$`)
    }
    return `${prefix}${id}`
  })

  // 4. Restore code blocks before MarkdownIt parses markdown
  placeholders.forEach((val, id) => {
    if (id.startsWith('@@CODE_TOKEN_')) {
      text = text.replaceAll(id, val)
      placeholders.delete(id)
    }
  })

  // 5. Render markdown to HTML
  let html = md.render(text)

  // 6. Restore pre-rendered KaTeX HTML tokens
  placeholders.forEach((renderedMath, id) => {
    html = html.replace(`<p>${id}</p>`, renderedMath)
    html = html.replaceAll(id, renderedMath)
  })

  return html
})
</script>

<template>
  <div class="markdown-body" v-html="renderedHtml"></div>
</template>

<style>
/* Scoped or global styles for rich editorial typography */
.markdown-body {
  color: var(--article-body-color, var(--color-on-surface, #e5e2e1));
  font-family: var(--font-body, 'Inter', system-ui, sans-serif);
  font-size: 18px;
  line-height: 1.75;
  margin: 32px 0;
  letter-spacing: -0.01em;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
  font-family: var(--font-display, 'EB Garamond', Georgia, serif);
  color: var(--article-heading-color, var(--color-primary, #ffffff));
  font-weight: 500;
  line-height: 1.2;
  margin-top: 48px;
  margin-bottom: 20px;
}

.markdown-body h1 {
  font-size: 38px;
  letter-spacing: -0.02em;
}

.markdown-body h2 {
  font-size: 30px;
  letter-spacing: -0.015em;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-light, rgba(255, 255, 255, 0.05));
}

.markdown-body h3 {
  font-size: 24px;
}

.markdown-body h4 {
  font-size: 20px;
}

.markdown-body p {
  margin-bottom: 24px;
  color: var(--article-body-color, var(--color-on-surface, #e5e2e1));
}

.markdown-body strong {
  color: var(--article-heading-color, var(--color-primary, #ffffff));
  font-weight: 600;
}

.markdown-body em {
  font-style: italic;
  color: var(--color-on-surface-variant, #c4c7c8);
}

.markdown-body ul,
.markdown-body ol {
  margin: 20px 0 28px 24px;
  padding-left: 8px;
}

.markdown-body ul {
  list-style-type: disc;
}

.markdown-body ol {
  list-style-type: decimal;
}

.markdown-body li {
  margin-bottom: 10px;
  line-height: 1.65;
  color: var(--article-body-color, var(--color-on-surface, #e5e2e1));
}

.markdown-body blockquote {
  border-left: 3px solid var(--blockquote-border, var(--color-primary, #ffffff));
  padding: 18px 24px;
  margin: 32px 0;
  background: var(--blockquote-bg, var(--color-surface-container, rgba(32, 31, 31, 0.5)));
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: var(--blockquote-text, var(--color-on-surface-variant, #c4c7c8));
}

.markdown-body blockquote strong {
  color: var(--article-heading-color, var(--color-primary));
  font-weight: 600;
  font-style: normal;
}

.markdown-body blockquote p:last-child {
  margin-bottom: 0;
}

.markdown-body code {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 14px;
  background: var(--code-bg, rgba(255, 255, 255, 0.08));
  padding: 3px 7px;
  border-radius: 4px;
  color: var(--code-text, var(--color-primary, #ffffff));
  border: 1px solid var(--border-subtle);
}

.markdown-body pre {
  background: var(--color-surface-container-lowest, #0e0e0e);
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
  margin: 28px 0;
  color: var(--article-body-color, var(--color-on-surface));
}

.markdown-body pre code {
  background: transparent;
  padding: 0;
  border: none;
  font-size: 14px;
  line-height: 1.6;
  color: inherit;
}

.markdown-body a {
  color: var(--color-primary, #ffffff);
  text-decoration: underline;
  text-underline-offset: 4px;
  transition: opacity 0.2s ease;
}

.markdown-body a:hover {
  opacity: 0.8;
}

.markdown-body hr {
  border: 0;
  border-top: 1px solid var(--border-subtle);
  margin: 48px 0;
}

/* KaTeX formula enhancements */
.markdown-body .katex-display-wrapper,
.markdown-body .katex-block,
.markdown-body .katex-display {
  margin: 32px 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 16px 0;
  text-align: center;
}

.markdown-body .katex {
  font-size: 1.1em;
  color: var(--article-heading-color, var(--color-primary, #ffffff));
}
</style>

