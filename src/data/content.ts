export const siteConfig = {
  name: 'DaCowboy Fitness',
  tagline: 'First Principles Only',
  email: 'dacowboyclub@gmail.com',
  instagram: 'https://www.instagram.com/da.cowboy.fitness',
  instagramHandle: '@da.cowboy.fitness',
  bookingUrl: 'https://topmate.io/da_cowboy/2187494',
  copyright: '© 2026 DaCowboy Fitness. First Principles Only.',
}

export const heroContent = {
  quote: '"The society that separates its scholars from its warriors will have its thinking done by cowards and its fighting done by fools."',
  attribution: '— Thucydides',
  subtitle: 'Challenge conventional fitness through first principles. Understand your body before trying to change it.',
  primaryCta: 'Explore Courses',
  secondaryCta: 'BOOK 1:1 CALL',
}

export const cowboyWayContent = {
  heading: 'The Cowboy Way',
  paragraphs: [
    "Consider the horse. A rider who seeks only to command without understanding the animal's skeletal geometry, its nervous state, and its metabolic limits will eventually find themselves on the ground.",
    'Traditional fitness treats the body like a machine to be forced into submission through raw exertion. We believe in the cowboy\'s wisdom: true mastery begins with silent observation. We peel back the noise of modern "exercise" to rediscover the physics of biology.',
  ],
  principleLabel: 'Principles I',
  principleText: 'Observation precedes Action.',
}

export interface Course {
  title: string
  description: string
  image: string
  alt: string
}

export const courses: Course[] = [
  {
    title: 'Human Biology Foundations',
    description: 'Understanding the fundamental constraints of our evolutionary hardware.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDACa1M4FviHvhTdwZuGnaGH9PmncgG9fWITKS_EL0wB-85LCjQ1-NkTISJFrhA0uCl8kPzK4JdYTYlwIvRGJIVFgZ_CWShNodAcHPTCWY_LlVHNEHuJ7g1TWAq5UKji1QBi6pQQaQd-3dO3zsR88aUPZ3ddkLpPuuiDYS0jxIvqJJjZWm5V1fEJLqEaECDWHwKRsfZuf5c8uWDnc5eLFMIASvgl1UBlkIpQqy-PFSCisVXAdJt_zYBNI5lSfFKTIs3o26pvJUK22k',
    alt: 'Stylized micro-photography of human muscle fibers and connective tissue',
  },
  {
    title: 'Metabolic Flexibility',
    description: 'The art of shifting energy substrates efficiently and naturally.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChSubvxJrqVWUgSsiqvEOvezt8nlTF8TO8fWbsK-X84lCNdUzWrhBEHm6lCs9dBzaY1nUkpUy6wHLoebeOMB9VOOwp1_WBoylJfE9slBXxyeE0YRG6bmfRA33TekERsjh1wHf3Tg8TF5Ijfe94TQPY1pdA7L5PEcr-sn0Nv77QH8qFl5_RzPln6DXPe9bOSwGhIBZnU9M8aTmuptgg6TDBakYCBhp9XzCkfhIGSpkkdDHIreMjNgAUdtalTeMn05CpJ8CaQEZHt2I',
    alt: 'Minimalist data visualization of concentric glowing circles',
  },
  {
    title: 'Movement Before Muscle',
    description: 'Relearning the native patterns of the human kinetic chain.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOlHSPSKmZnnU_34VK5LG8ky206XyuVqE80J-rASZ55nMTmN2ibVOIHeFKetv1biX5fPMQIyVCUi_9Z9bmOqQnWPKmNRopwEgBOD9awACbRZhBIRF02vxJj2BxUXvamW-cmJ22LmDHFHwjD40XKkmNODg64xR_fG2kWfN051AIVx7KdlGYBo2CQoKaZ4MefSIohufAqpo3-RGJ1HSXHYM1iDy5w-Y22f5qbUSz1mp__tHhSCkYuC3Jj7DqrVNXMXcIbZwDvtnC2GU',
    alt: 'Long-exposure photograph of a human figure in motion',
  },
  {
    title: 'Understanding Strength',
    description: 'Deconstructing force production through a physical lens.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdssuPako78EV9OekDM_OHxl8C-vt3ThHn2sDJCltjrjwrjgYX5Ey21MHWy7UpI99rj0RBLUbTEmRfP1fu_utT1xT5yNDgq7M_3JVHKpCbLWbnZkhBJ-aAyZdG2iGImYeNq1mqRbJMZa1d5kSrQLwU4kUXrbeKwNUUfQDO0mNUJMmOWQMPxxQ6BXhHPIQYiLIA4Cu00vypL-mSY9yvAjMomQxESz1usxMmhQkGxNvRfXdfJs5As-ODlcC5JicX51FTfpfs16RHtVA',
    alt: 'Abstract representation of structural integrity and carbon-fiber patterns',
  },
]

export interface JournalEntry {
  issue: string
  title: string
}

export const journalEntries: JournalEntry[] = [
  { issue: 'Issue 001', title: 'Why Indoor Gyms Became the Default' },
  { issue: 'Issue 002', title: 'The Illusion of Slow Metabolism' },
  { issue: 'Issue 003', title: 'Why We Forgot How Humans Move' },
]

export const aboutContent = {
  heading: 'About',
  paragraphs: [
    "I'm Kaushal Kishore.",
    'DaCowboy Fitness is where I share the way I think about the human body.',
    'Everything here is built on first principles, biology, and analogies—not trends, dogma, or borrowed opinions.',
    "I don't believe people need another list of exercises or another meal plan.",
    'I believe they need a better mental model of the body they live in.',
    "That's what these courses are designed to build.",
  ],
  closingQuote: '"Teach a person how to think, not what to think."',
}

export const ctaContent = {
  heading: "Let's Talk",
  paragraphs: [
    'Your presence should speak about your skill before you ever have to.',
    "Most people who book a call with me have already spent time with my content. They understand how I think, what I believe, and what I'm trying to build before we ever speak.",
    "If you're completely new here, I recommend exploring the courses or spending some time with my Instagram content first. The conversation is far more valuable when we already speak the same language.",
  ],
  cta: 'BOOK 1:1 CALL',
}

export const images = {
  horse: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxpjoCvj2veGRkF3SMn355RkVX3RQlZyGX7P11STMyZa1gB9JtFMee99UFw6L4Tp8WD2-MdZL13RfPnGjsezbrWUr42fstWIpGuVUC-JusC-hBqEjZS_WMp9AKCgLxuongxnZj4W8dbeU1LufyV3-ckOB3dDKxT_1NeOLURbUlVoD8olXsP0_NEqqTFogI8LDsgOB2MlvbI5b-gYQJb7VFP_tjbzQzNxha8FcanGmMSEhHL2LPppglMX4rKHli6pbPQ3xGwL8IElc',
  horseAlt: "Minimalist high-contrast photograph of a horse's shoulder and neck",
}

export const navLinks = [
  { label: 'Philosophy', href: '#', active: false },
  { label: 'Courses', href: '#courses', active: false },
  { label: 'Journal', href: '#journal', active: false },
  { label: 'The Cowboy Way', href: '#cowboy-way', active: true },
  { label: 'About', href: '#about', active: false },
]
