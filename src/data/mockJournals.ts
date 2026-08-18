import type { JournalEntry, JournalEntrySummary } from '../types/journal'

const MOCK_JOURNALS: JournalEntry[] = [
  {
    id: 'advanced-biomechanical-waves',
    slug: 'advanced-biomechanical-waves',
    title: 'Advanced Biomechanical Waves & Force Vectors',
    author: 'Kishore Kaushal',
    date: '2026-08-17',
    published: true,
    tags: ['BIOMECHANICS', 'PHYSICS', 'TRAINING'],
    excerpt: 'Analyzing wave dynamics, rate of force development, and first-principles movement mechanics.',
    readTimeMinutes: 4,
    coverImage: {
      src: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
      alt: 'Biomechanics and athletic movement',
      caption: 'FIG 0. High-speed kinematics and ground reaction force vectors.',
    },
    blocks: [
      {
        id: 'block_1',
        type: 'markdown',
        content: `## Wave Dynamics in Biological Tissue
Musculoskeletal movement is not an instantaneous event; it propagates through kinetic chains as continuous mechanical energy transfers. The propagation of elastic strain energy through tendon structures can be described via the one-dimensional wave equation:

$$\\frac{\\partial^2 u}{\\partial t^2} = v^2 \\frac{\\partial^2 u}{\\partial x^2}$$

Where $v = \\sqrt{\\frac{E}{\\rho}}$ denotes the propagation velocity through muscle-tendon complexes, with $E$ representing Young's modulus and $\\rho$ representing tissue density.`,
      },
      {
        id: 'block_2',
        type: 'video',
        provider: 'youtube',
        src: 'https://youtu.be/8cG0P3cqNw8',
        caption: 'VID 1. Analysis of rotational dynamics and rate of force development.',
        aspectRatio: '16/9',
      },
      {
        id: 'block_3',
        type: 'markdown',
        content: `### Rate of Force Development (RFD)
In elite athletic training, absolute peak force is rarely reached within competitive window times (100–300 ms). Therefore, the time derivative of force determines true functional power:

$$\\text{RFD} = \\frac{dF}{dt}$$

When athletes optimize movement efficiency, the neuromuscular rate coding creates steep force-time curves rather than flat plateau distributions.`,
      },
      {
        id: 'block_4',
        type: 'image',
        src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
        alt: 'Vector kinematics and force curves',
        caption: 'FIG 2. Ground reaction force vector trajectory during explosive hip extension.',
      },
      {
        id: 'block_5',
        type: 'markdown',
        content: `## First Principles Summary
1. **Kinetic Energy Transfer:** Kinetic energy flows sequentially from proximal core drivers to distal extremities.
2. **Elastic Storage:** Fascial elasticity acts like non-linear biological springs governed by Hooke's Law with variable stiffness coefficients.
3. **First Principles Mindset:** Strip away training dogma and evaluate every exercise as pure mechanical work ($W = \\int \\mathbf{F} \\cdot d\\mathbf{r}$).`,
      },
    ],
    relatedJournals: [
      {
        id: 'the-architecture-of-resistance',
        slug: 'the-architecture-of-resistance',
        title: 'The Architecture of Resistance',
        excerpt: 'Understanding resistance as raw material for systemic fortification through the lens of structural engineering.',
        tags: ['BIOMECHANICS', 'THEORY'],
        readTimeMinutes: 5,
        date: '2026-08-17',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1etbjA6DIsmDG5uUCu_LYNAkiidZHjh03Su-OvVWAn8Yq3jWWGGG9-VXCg8g6nLMJVThf3wjhZOaIFXXL2ULvQjFFv8Qtdgvv28p84O0FPrlTjOi3ErQt3HfBv4bFNBck-QhTyBR4Zb9p6upYhC57ZGcruYRmG3f4sP7yZN-MEFX7Lc3QzHZXbk3QYzwTXGM-S-pyW_bguIDYZWkAF5LqpYZoK21-vElm--0buDt_H4YJ9gVzCPC',
      },
      {
        id: 'the-friction-interface',
        slug: 'the-friction-interface',
        title: 'The Friction Interface',
        excerpt: 'How the physics of grip strength and shear forces dictate barbell training efficiency.',
        tags: ['BIOMECHANICS', 'STRENGTH'],
        readTimeMinutes: 4,
        date: '2026-09-02',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1etbjA6DIsmDG5uUCu_LYNAkiidZHjh03Su-OvVWAn8Yq3jWWGGG9-VXCg8g6nLMJVThf3wjhZOaIFXXL2ULvQjFFv8Qtdgvv28p84O0FPrlTjOi3ErQt3HfBv4bFNBck-QhTyBR4Zb9p6upYhC57ZGcruYRmG3f4sP7yZN-MEFX7Lc3QzHZXbk3QYzwTXGM-S-pyW_bguIDYZWkAF5LqpYZoK21-vElm--0buDt_H4YJ9gVzCPC',
      },
    ],
  },
  {
    id: 'the-architecture-of-resistance',
    slug: 'the-architecture-of-resistance',
    title: 'The Architecture of Resistance',
    author: 'Kishore Kaushal',
    date: '2026-08-17',
    published: true,
    tags: ['BIOMECHANICS', 'THEORY'],
    excerpt: 'Understanding resistance as raw material for systemic fortification through the lens of structural engineering.',
    readTimeMinutes: 5,
    coverImage: {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1etbjA6DIsmDG5uUCu_LYNAkiidZHjh03Su-OvVWAn8Yq3jWWGGG9-VXCg8g6nLMJVThf3wjhZOaIFXXL2ULvQjFFv8Qtdgvv28p84O0FPrlTjOi3ErQt3HfBv4bFNBck-QhTyBR4Zb9p6upYhC57ZGcruYRmG3f4sP7yZN-MEFX7Lc3QzHZXbk3QYzwTXGM-S-pyW_bguIDYZWkAF5LqpYZoK21-vElm--0buDt_H4YJ9gVzCPC',
      alt: 'Structural alignment under load',
      caption: 'FIG 1. Structural alignment under load.',
    },
    blocks: [
      {
        id: 'block_1',
        type: 'markdown',
        content: `<p>The prevailing narrative surrounding physical training often reduces movement to mere biological mechanics—a crude pumping of pistons. However, a closer examination reveals a far more sophisticated reality. We are not simply engines; we are complex architectural structures adapting to applied stress.</p>
<p>When we consider the body through the lens of structural engineering, the concept of resistance transforms. It is no longer an adversary to be overcome, but rather the essential raw material required for systemic fortification.</p>`,
      },
      {
        id: 'block_2',
        type: 'markdown',
        content: `<h2>Force as Information</h2>
<p>In the context of the DaCowboy methodology, mechanical tension is viewed as a medium of communication. Every repetition sends a distinct signal to the nervous and musculoskeletal systems. The quality of this signal is paramount.</p>
<blockquote>"The barbell is an instrument of inquiry. The weight poses the question; the integrity of the form provides the answer."</blockquote>
<p>To optimize this signal, we must adhere to fundamental physical principles. The foundational equation remains inescapable:</p>
<div class="math-block">F = m · a</div>
<p>While simple, it dictates the parameters of our practice. Modulating mass (<em>m</em>) or acceleration (<em>a</em>) alters the force (<em>F</em>) vector applied to the biological structure.</p>`,
      },
      {
        id: 'block_4',
        type: 'markdown',
        content: `<h2>The Pillars of Alignment</h2>
<p>Structural integrity during load-bearing movements relies on specific anatomical anchor points. Failure to maintain these points distorts the force vector, diluting the signal and increasing the probability of structural compromise.</p>
<ul>
<li><strong>The Pelvic Floor:</strong> The foundation of the axial skeleton. Must remain neutral to transmit force efficiently.</li>
<li><strong>Thoracic Extension:</strong> Ensures the ribcage remains elevated, allowing for optimal diaphragmatic excursion and spinal stability.</li>
<li><strong>Scapular Retraction:</strong> The anchoring mechanism for the upper extremities, crucial for transferring load across the shoulder girdle.</li>
</ul>`,
      },
      {
        id: 'block_5',
        type: 'video',
        provider: 'youtube',
        src: 'https://www.youtube-nocookie.com/embed/yqWX86uT5jM',
        caption: 'VID 1. Scapular stabilization mechanics.',
        aspectRatio: '16/9',
      },
      {
        id: 'block_6',
        type: 'markdown',
        content: `<p>The academy's approach demands absolute precision. We do not chase fatigue; we cultivate capability through disciplined, architectural movement.</p>`,
      },
    ],
    relatedJournals: [
      {
        id: 'the-friction-interface',
        slug: 'the-friction-interface',
        title: 'The Friction Interface',
        excerpt: 'How the physics of grip strength and shear forces dictate barbell training efficiency.',
        tags: ['BIOMECHANICS', 'STRENGTH'],
        readTimeMinutes: 4,
        date: '2026-09-02',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1etbjA6DIsmDG5uUCu_LYNAkiidZHjh03Su-OvVWAn8Yq3jWWGGG9-VXCg8g6nLMJVThf3wjhZOaIFXXL2ULvQjFFv8Qtdgvv28p84O0FPrlTjOi3ErQt3HfBv4bFNBck-QhTyBR4Zb9p6upYhC57ZGcruYRmG3f4sP7yZN-MEFX7Lc3QzHZXbk3QYzwTXGM-S-pyW_bguIDYZWkAF5LqpYZoK21-vElm--0buDt_H4YJ9gVzCPC',
      },
      {
        id: 'load-distribution-models',
        slug: 'load-distribution-models',
        title: 'Load Distribution Models',
        excerpt: 'Applying structural engineering concepts to understand how spinal columns distribute mechanical forces.',
        tags: ['THEORY', 'BIOMECHANICS'],
        readTimeMinutes: 6,
        date: '2026-08-28',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC35HWUT9M2avizSqcZC-5Td5y3TfRGMQL8ORikGsORHq9aPLdIyrQROuCIQhGYt8Q2Poi3VfsrjShYrLpD6kM2nRFOVd9VJQiVujK4g_YCWJDTtD3VbOvK7rnzUG_4UiE0Kg7AkBgGbAbXiQbrf58UK93Ljx6mUOv3drRElBhPKnv5BefR9BhC-nhhcL9pjkgQai5ajR1GtyeS5wI6oN60mxJgt85BVNmEClby-JnNkkmsC0iKbrXJ',
      },
      {
        id: 'calculus-of-recovery',
        slug: 'calculus-of-recovery',
        title: 'Calculus of Recovery',
        excerpt: 'Modeling supercompensation through the lens of derivatives and rate-of-change mathematics.',
        tags: ['THEORY', 'METABOLICS'],
        readTimeMinutes: 7,
        date: '2026-08-12',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7-wzGwn4A8SGcF3fF1JHcVK0n3YDYMkHqH3S88wFRXYEN8OhrtVDjY7am7H6BxBF0d4A2QvZaxiIpw56_Wr-HP1SOT3zDqAiHBzdm1PiV3BZkk9VUpylFtDfh4inCzhvpQh5YW6JvvDHd-K6-PhcihVcie8OAcW3FhAOmqs9ktQQjQd5f2Bmo5y7DFx8PoMsvRYwaFwkd2X2jr_9GPa7yrR2RkBj1I5AR0ApDHDDjCM6GctaL7oXt',
      },
    ],
  },
  {
    id: 'the-friction-interface',
    slug: 'the-friction-interface',
    title: 'The Friction Interface',
    author: 'Kishore Kaushal',
    date: '2026-09-02',
    published: true,
    tags: ['BIOMECHANICS', 'STRENGTH'],
    excerpt: 'How the physics of grip strength and shear forces dictate barbell training efficiency.',
    readTimeMinutes: 4,
    coverImage: {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1etbjA6DIsmDG5uUCu_LYNAkiidZHjh03Su-OvVWAn8Yq3jWWGGG9-VXCg8g6nLMJVThf3wjhZOaIFXXL2ULvQjFFv8Qtdgvv28p84O0FPrlTjOi3ErQt3HfBv4bFNBck-QhTyBR4Zb9p6upYhC57ZGcruYRmG3f4sP7yZN-MEFX7Lc3QzHZXbk3QYzwTXGM-S-pyW_bguIDYZWkAF5LqpYZoK21-vElm--0buDt_H4YJ9gVzCPC',
      alt: 'Barbell knurling macro detail',
      caption: 'FIG 1. The knurling pattern — engineered friction.',
    },
    blocks: [
      {
        id: 'block_1',
        type: 'markdown',
        content: `<p>The barbell knurl is not decorative. It is a precision-engineered friction interface — a physical contract between the lifter's skin and the steel. This essay examines how the coefficient of friction, shear forces, and grip endurance fundamentally shape resistance training outcomes.</p>`,
      },
      {
        id: 'block_2',
        type: 'markdown',
        content: `<h2>The Physics of Grip</h2>
<p>Friction is governed by two variables: the normal force pressing surfaces together, and the coefficient of friction (μ) between those surfaces. In the context of the barbell, the knurling pattern manipulates μ by introducing micro-points of contact that increase surface area at the dermal level.</p>
<blockquote>"Grip is not a function of hand strength alone. It is the product of neural drive, skin-to-steel friction, and compressive architecture."</blockquote>`,
      },
      {
        id: 'block_3',
        type: 'markdown',
        content: `<h2>Training Implications</h2>
<p>When grip fails, the entire kinetic chain collapses. The signal from the barbell to the central nervous system degrades, and compensatory patterns emerge. Understanding the friction interface allows us to design training that respects — rather than ignores — this fundamental constraint.</p>`,
      },
    ],
    relatedJournals: [
      {
        id: 'the-architecture-of-resistance',
        slug: 'the-architecture-of-resistance',
        title: 'The Architecture of Resistance',
        excerpt: 'Understanding resistance as raw material for systemic fortification through the lens of structural engineering.',
        tags: ['BIOMECHANICS', 'THEORY'],
        readTimeMinutes: 5,
        date: '2026-08-17',
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1etbjA6DIsmDG5uUCu_LYNAkiidZHjh03Su-OvVWAn8Yq3jWWGGG9-VXCg8g6nLMJVThf3wjhZOaIFXXL2ULvQjFFv8Qtdgvv28p84O0FPrlTjOi3ErQt3HfBv4bFNBck-QhTyBR4Zb9p6upYhC57ZGcruYRmG3f4sP7yZN-MEFX7Lc3QzHZXbk3QYzwTXGM-S-pyW_bguIDYZWkAF5LqpYZoK21-vElm--0buDt_H4YJ9gVzCPC',
      },
      {
        id: 'load-distribution-models',
        slug: 'load-distribution-models',
        title: 'Load Distribution Models',
        excerpt: 'Applying structural engineering concepts to understand how spinal columns distribute mechanical forces.',
        tags: ['THEORY', 'BIOMECHANICS'],
        readTimeMinutes: 6,
        date: '2026-08-28',
      },
    ],
  },
  {
    id: 'load-distribution-models',
    slug: 'load-distribution-models',
    title: 'Load Distribution Models',
    author: 'Kishore Kaushal',
    date: '2026-08-28',
    published: true,
    tags: ['THEORY', 'BIOMECHANICS'],
    excerpt: 'Applying structural engineering concepts to understand how spinal columns distribute mechanical forces.',
    readTimeMinutes: 6,
    coverImage: {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC35HWUT9M2avizSqcZC-5Td5y3TfRGMQL8ORikGsORHq9aPLdIyrQROuCIQhGYt8Q2Poi3VfsrjShYrLpD6kM2nRFOVd9VJQiVujK4g_YCWJDTtD3VbOvK7rnzUG_4UiE0Kg7AkBgGbAbXiQbrf58UK93Ljx6mUOv3drRElBhPKnv5BefR9BhC-nhhcL9pjkgQai5ajR1GtyeS5wI6oN60mxJgt85BVNmEClby-JnNkkmsC0iKbrXJ',
      alt: 'Architectural column under load',
      caption: 'FIG 1. Brutalist load paths.',
    },
    blocks: [
      {
        id: 'block_1',
        type: 'markdown',
        content: `<p>The spinal column is not a single rigid pillar. It is a segmented, adaptive structure that redistributes compressive and shear forces across 33 vertebrae, each connected by viscoelastic intervertebral discs. Understanding these load paths is essential before prescribing any axial loading protocol.</p>`,
      },
      {
        id: 'block_2',
        type: 'markdown',
        content: `<h2>Compression vs. Shear</h2>
<p>Spinal injuries in resistance training almost never result from pure compression. The human spine can withstand extraordinary compressive loads. Failure occurs when shear forces — lateral displacement between vertebral segments — exceed the structural tolerance of the annulus fibrosus.</p>
<blockquote>"The spine does not fail from weight. It fails from misalignment under weight."</blockquote>`,
      },
      {
        id: 'block_3',
        type: 'image',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC35HWUT9M2avizSqcZC-5Td5y3TfRGMQL8ORikGsORHq9aPLdIyrQROuCIQhGYt8Q2Poi3VfsrjShYrLpD6kM2nRFOVd9VJQiVujK4g_YCWJDTtD3VbOvK7rnzUG_4UiE0Kg7AkBgGbAbXiQbrf58UK93Ljx6mUOv3drRElBhPKnv5BefR9BhC-nhhcL9pjkgQai5ajR1GtyeS5wI6oN60mxJgt85BVNmEClby-JnNkkmsC0iKbrXJ',
        alt: 'Load distribution diagram',
        caption: 'FIG 2. Force paths through segmental vertebral architecture.',
      },
    ],
    relatedJournals: [
      {
        id: 'the-architecture-of-resistance',
        slug: 'the-architecture-of-resistance',
        title: 'The Architecture of Resistance',
        excerpt: 'Understanding resistance as raw material for systemic fortification.',
        tags: ['BIOMECHANICS', 'THEORY'],
        readTimeMinutes: 5,
        date: '2026-08-17',
      },
      {
        id: 'calculus-of-recovery',
        slug: 'calculus-of-recovery',
        title: 'Calculus of Recovery',
        excerpt: 'Modeling supercompensation through the lens of derivatives and rate-of-change mathematics.',
        tags: ['THEORY', 'METABOLICS'],
        readTimeMinutes: 7,
        date: '2026-08-12',
      },
    ],
  },
  {
    id: 'calculus-of-recovery',
    slug: 'calculus-of-recovery',
    title: 'Calculus of Recovery',
    author: 'Kishore Kaushal',
    date: '2026-08-12',
    published: true,
    tags: ['THEORY', 'METABOLICS'],
    excerpt: 'Modeling supercompensation through the lens of derivatives and rate-of-change mathematics.',
    readTimeMinutes: 7,
    coverImage: {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7-wzGwn4A8SGcF3fF1JHcVK0n3YDYMkHqH3S88wFRXYEN8OhrtVDjY7am7H6BxBF0d4A2QvZaxiIpw56_Wr-HP1SOT3zDqAiHBzdm1PiV3BZkk9VUpylFtDfh4inCzhvpQh5YW6JvvDHd-K6-PhcihVcie8OAcW3FhAOmqs9ktQQjQd5f2Bmo5y7DFx8PoMsvRYwaFwkd2X2jr_9GPa7yrR2RkBj1I5AR0ApDHDDjCM6GctaL7oXt',
      alt: 'Mathematical equations in notebook',
      caption: 'FIG 1. Recovery as a mathematical function.',
    },
    blocks: [
      {
        id: 'block_1',
        type: 'markdown',
        content: `<p>Recovery is not simply "rest." It is an active biological process that follows predictable mathematical curves. By modeling fatigue and supercompensation as continuous functions, we can derive optimal training frequency from first principles rather than arbitrary schedules.</p>`,
      },
      {
        id: 'block_2',
        type: 'markdown',
        content: `<h2>The Supercompensation Curve</h2>
<p>After a training stimulus, the body's performance capacity drops below baseline (fatigue), then recovers and briefly exceeds it (supercompensation). The rate of force development recovery follows:</p>
<div class="math-block">RFD = dF / dt</div>
<div class="math-block">P(t) = P₀ · (1 − e<sup>−λt</sup>) + ΔP · e<sup>−μ(t − t₀)²</sup></div>`,
      },
      {
        id: 'block_3',
        type: 'markdown',
        content: `<h2>Practical Application</h2>
<p>The derivative of the recovery function tells us the instantaneous rate of adaptation. Training at the peak of the supercompensation window — where the derivative crosses zero — maximizes long-term progression without accumulating chronic fatigue.</p>
<ul>
<li><strong>Phase 1:</strong> Acute fatigue (0–24h). Performance drops. The derivative is negative.</li>
<li><strong>Phase 2:</strong> Recovery (24–72h). Performance climbs back to baseline. The derivative is positive and large.</li>
<li><strong>Phase 3:</strong> Supercompensation (48–96h). Performance exceeds baseline. The derivative approaches zero.</li>
<li><strong>Phase 4:</strong> Detraining (96h+). Without stimulus, performance returns to baseline. The derivative turns negative again.</li>
</ul>`,
      },
    ],
    relatedJournals: [
      {
        id: 'the-architecture-of-resistance',
        slug: 'the-architecture-of-resistance',
        title: 'The Architecture of Resistance',
        excerpt: 'Understanding resistance as raw material for systemic fortification.',
        tags: ['BIOMECHANICS', 'THEORY'],
        readTimeMinutes: 5,
        date: '2026-08-17',
      },
      {
        id: 'the-friction-interface',
        slug: 'the-friction-interface',
        title: 'The Friction Interface',
        excerpt: 'How the physics of grip strength and shear forces dictate barbell training efficiency.',
        tags: ['BIOMECHANICS', 'STRENGTH'],
        readTimeMinutes: 4,
        date: '2026-09-02',
      },
    ],
  },
]

export const mockJournals: JournalEntry[] = MOCK_JOURNALS

export function getAllJournals(): JournalEntrySummary[] {
  return MOCK_JOURNALS
    .filter((j) => j.published)
    .map((j) => ({
      id: j.id,
      slug: j.slug,
      title: j.title,
      excerpt: j.excerpt,
      tags: j.tags,
      readTimeMinutes: j.readTimeMinutes,
      date: j.date,
      coverImage: j.coverImage?.src,
    }))
}

export function getJournalBySlug(slug: string): JournalEntry | undefined {
  return MOCK_JOURNALS.find((j) => j.slug === slug)
}

export function getRelatedJournals(slug: string): JournalEntrySummary[] {
  const entry = getJournalBySlug(slug)
  return entry?.relatedJournals ?? []
}

/** All unique tags across all journal entries */
export function getAllTags(): string[] {
  const tags = new Set<string>()
  MOCK_JOURNALS.forEach((j) => j.tags.forEach((t) => tags.add(t)))
  return Array.from(tags)
}

/** Format date string to editorial format: AUG 17, 2026 */
export function formatJournalDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase()
    .replace(',', ',')
}
