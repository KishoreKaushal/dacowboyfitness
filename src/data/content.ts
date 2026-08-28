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

export interface Lesson {
  id: string
  title: string
  duration: string
  isCompleted?: boolean
  videoUrl?: string
  /** Curriq asset ID — when set, fetches a signed Mux playback token instead of using videoUrl */
  assetId?: string
  notes?: string
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  longDescription?: string
  image: string
  alt: string
  price: string
  duration: string
  lessonsCount: number
  isOwned: boolean
  completedLessonsCount?: number
  outcomes?: string[]
  lessons: Lesson[]
}

const SAMPLE_YOUTUBE_EMBED = 'https://www.youtube-nocookie.com/embed/yqWX86uT5jM'

export const courses: Course[] = [
  {
    id: '1',
    slug: 'human-biology-foundations',
    title: 'Human Biology Foundations',
    description: 'Understanding the fundamental constraints of our evolutionary hardware.',
    longDescription: 'A systematic breakdown of human physical architecture, connective tissue mechanics, and metabolic realities. This course equips you with an engineering mindset toward your own biology before pursuing advanced training goals.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDACa1M4FviHvhTdwZuGnaGH9PmncgG9fWITKS_EL0wB-85LCjQ1-NkTISJFrhA0uCl8kPzK4JdYTYlwIvRGJIVFgZ_CWShNodAcHPTCWY_LlVHNEHuJ7g1TWAq5UKji1QBi6pQQaQd-3dO3zsR88aUPZ3ddkLpPuuiDYS0jxIvqJJjZWm5V1fEJLqEaECDWHwKRsfZuf5c8uWDnc5eLFMIASvgl1UBlkIpQqy-PFSCisVXAdJt_zYBNI5lSfFKTIs3o26pvJUK22k',
    alt: 'Stylized micro-photography of human muscle fibers and connective tissue',
    price: '₹499',
    duration: '2.5 HRS',
    lessonsCount: 8,
    isOwned: false,
    outcomes: [
      'Deconstruct body mechanics through structural anatomy',
      'Identify tissue adaptation timelines vs muscular response',
      'Formulate personal movement baselines using first principles',
      'Eliminate arbitrary exercise selection from your regimen'
    ],
    lessons: [
      { id: 'l1', title: '01 · Evolutionary Constraints & Mechanical Reality', duration: '12:40', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED, notes: 'Focus on how bipedal evolution dictated hip and spinal loading patterns.' },
      { id: 'l2', title: '02 · Connective Tissue vs Muscular Hypertrophy', duration: '18:15', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED, notes: 'Tendons adapt on 3x longer timelines than muscular tissue.' },
      { id: 'l3', title: '03 · The Kinetic Chain & Energy Transfer', duration: '14:22', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED, notes: 'Force loss across joint instability.' },
      { id: 'l4', title: '04 · Spinal Engine & Rotational Mechanics', duration: '16:05', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED, notes: 'Primary propulsion mechanics.' },
      { id: 'l5', title: '05 · Foot Complex & Ground Reaction Force', duration: '20:10', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED, notes: 'The tripod foot foundation.' },
      { id: 'l6', title: '06 · Diaphragmatic Pressure & Core Integrity', duration: '15:45', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED, notes: 'Intra-abdominal pressure dynamics.' },
      { id: 'l7', title: '07 · Neuromuscular Efficiency & Fatigue', duration: '19:30', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED, notes: 'Central nervous system recovery.' },
      { id: 'l8', title: '08 · Synthesizing Your Personal Biology Model', duration: '21:00', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED, notes: 'Building a sustainable training protocol.' },
    ]
  },
  {
    id: '2',
    slug: 'metabolic-flexibility',
    title: 'Metabolic Flexibility',
    description: 'The art of shifting energy substrates efficiently and naturally.',
    longDescription: 'Learn how your cell mitochondria transition between lipid and glucose metabolism. Master energy management without rigid dogmatic diets.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChSubvxJrqVWUgSsiqvEOvezt8nlTF8TO8fWbsK-X84lCNdUzWrhBEHm6lCs9dBzaY1nUkpUy6wHLoebeOMB9VOOwp1_WBoylJfE9slBXxyeE0YRG6bmfRA33TekERsjh1wHf3Tg8TF5Ijfe94TQPY1pdA7L5PEcr-sn0Nv77QH8qFl5_RzPln6DXPe9bOSwGhIBZnU9M8aTmuptgg6TDBakYCBhp9XzCkfhIGSpkkdDHIreMjNgAUdtalTeMn05CpJ8CaQEZHt2I',
    alt: 'Minimalist data visualization of concentric glowing circles',
    price: '₹499',
    duration: '2.0 HRS',
    lessonsCount: 6,
    isOwned: true,
    completedLessonsCount: 3,
    outcomes: [
      'Understand mitochondrial substrate switching',
      'Optimize daily energy levels without artificial stimulants',
      'Measure and track metabolic response objectively'
    ],
    lessons: [
      { id: 'm1', title: '01 · Substrate Dynamics: Glycogen vs Free Fatty Acids', duration: '15:20', isCompleted: true, videoUrl: SAMPLE_YOUTUBE_EMBED, notes: 'Mitochondrial density and substrate preference.' },
      { id: 'm2', title: '02 · Insulin Sensitivity & Nutrient Partitioning', duration: '19:40', isCompleted: true, videoUrl: SAMPLE_YOUTUBE_EMBED, notes: 'Glucose transporter 4 (GLUT4) translocation during movement.' },
      { id: 'm3', title: '03 · Zone 2 Cardio & Mitochondrial Biogenesis', duration: '22:15', isCompleted: true, videoUrl: SAMPLE_YOUTUBE_EMBED, notes: 'Sample video demonstration embedded below for local playback testing.' },
      { id: 'm4', title: '04 · Fasting Physiology & Autophagy', duration: '17:50', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED, notes: 'Cellular cleanup mechanisms.' },
      { id: 'm5', title: '05 · Circadian Biology & Metabolic Timing', duration: '14:30', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED, notes: 'Light exposure and metabolic gene expression.' },
      { id: 'm6', title: '06 · Practical Nutrition Framework', duration: '18:10', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED, notes: 'Designing an adaptable daily fuel protocol.' },
    ]
  },
  {
    id: '3',
    slug: 'movement-before-muscle',
    title: 'Movement Before Muscle',
    description: 'Relearning the native patterns of the human kinetic chain.',
    longDescription: 'Prioritize joint health, range of motion, and articular control before overloading muscles with heavy resistance.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOlHSPSKmZnnU_34VK5LG8ky206XyuVqE80J-rASZ55nMTmN2ibVOIHeFKetv1biX5fPMQIyVCUi_9Z9bmOqQnWPKmNRopwEgBOD9awACbRZhBIRF02vxJj2BxUXvamW-cmJ22LmDHFHwjD40XKkmNODg64xR_fG2kWfN051AIVx7KdlGYBo2CQoKaZ4MefSIohufAqpo3-RGJ1HSXHYM1iDy5w-Y22f5qbUSz1mp__tHhSCkYuC3Jj7DqrVNXMXcIbZwDvtnC2GU',
    alt: 'Long-exposure photograph of a human figure in motion',
    price: '₹499',
    duration: '1.8 HRS',
    lessonsCount: 5,
    isOwned: false,
    outcomes: [
      'Master controlled articular rotations (CARs)',
      'Identify and fix kinetic chain leaks',
      'Build resilient joints before heavy resistance training'
    ],
    lessons: [
      { id: 'mb1', title: '01 · Articular Health & Synovial Fluid Distribution', duration: '14:00', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED },
      { id: 'mb2', title: '02 · Hip Capsule Mobility & Pelvic Alignment', duration: '18:30', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED },
      { id: 'mb3', title: '03 · Thoracic Mobility & Scapular Tracking', duration: '16:45', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED },
      { id: 'mb4', title: '04 · Ankle Dorsiflexion & Knee Lineage', duration: '15:20', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED },
      { id: 'mb5', title: '05 · Integration: Functional Movement Flows', duration: '20:10', isCompleted: false, videoUrl: SAMPLE_YOUTUBE_EMBED },
    ]
  },
  {
    id: '4',
    slug: 'understanding-strength',
    title: 'Understanding Strength',
    description: 'Deconstructing force production through a physical lens.',
    longDescription: 'Explore motor unit recruitment, rate of force development, and leverage mechanics. Learn how physical strength is generated from the inside out.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdssuPako78EV9OekDM_OHxl8C-vt3ThHn2sDJCltjrjwrjgYX5Ey21MHWy7UpI99rj0RBLUbTEmRfP1fu_utT1xT5yNDgq7M_3JVHKpCbLWbnZkhBJ-aAyZdG2iGImYeNq1mqRbJMZa1d5kSrQLwU4kUXrbeKwNUUfQDO0mNUJMmOWQMPxxQ6BXhHPIQYiLIA4Cu00vypL-mSY9yvAjMomQxESz1usxMmhQkGxNvRfXdfJs5As-ODlcC5JicX51FTfpfs16RHtVA',
    alt: 'Abstract representation of structural integrity and carbon-fiber patterns',
    price: '₹499',
    duration: '2.2 HRS',
    lessonsCount: 6,
    isOwned: true,
    completedLessonsCount: 6,
    outcomes: [
      'Deconstruct motor unit recruitment mechanics',
      'Optimize force vectors across compound movements',
      'Program strength progression without injury risk'
    ],
    lessons: [
      { id: 's1', title: '01 · Neural Drive & Motor Unit Recruitment', duration: '16:30', isCompleted: true, videoUrl: SAMPLE_YOUTUBE_EMBED },
      { id: 's2', title: '02 · Moment Arms & Biomechanical Leverage', duration: '19:15', isCompleted: true, videoUrl: SAMPLE_YOUTUBE_EMBED },
      { id: 's3', title: '03 · Rate of Force Development (RFD)', duration: '15:40', isCompleted: true, videoUrl: SAMPLE_YOUTUBE_EMBED },
      { id: 's4', title: '04 · Muscle Fiber Types & Adaptation Signals', duration: '18:20', isCompleted: true, videoUrl: SAMPLE_YOUTUBE_EMBED },
      { id: 's5', title: '05 · Structural Recovery & Supercompensation', duration: '17:10', isCompleted: true, videoUrl: SAMPLE_YOUTUBE_EMBED },
      { id: 's6', title: '06 · Long-term Strength Programming Architecture', duration: '22:00', isCompleted: true, videoUrl: SAMPLE_YOUTUBE_EMBED },
    ]
  },
  // ─── CURRIQ INTEGRATION TEST COURSE ────────────────────────────────────────
  {
    id: 'curriq-integration',
    slug: 'curriq-integration',
    title: 'Curriq Integration Course',
    description: 'End-to-end test course for the Curriq × Mux video pipeline.',
    longDescription: 'This course exists to validate the full Curriq video pipeline: upload → Mux encoding → signed playback token → rendered in dacowboyfitness. If this video plays, everything works.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDACa1M4FviHvhTdwZuGnaGH9PmncgG9fWITKS_EL0wB-85LCjQ1-NkTISJFrhA0uCl8kPzK4JdYTYlwIvRGJIVFgZ_CWShNodAcHPTCWY_LlVHNEHuJ7g1TWAq5UKji1QBi6pQQaQd-3dO3zsR88aUPZ3ddkLpPuuiDYS0jxIvqJJjZWm5V1fEJLqEaECDWHwKRsfZuf5c8uWDnc5eLFMIASvgl1UBlkIpQqy-PFSCisVXAdJt_zYBNI5lSfFKTIs3o26pvJUK22k',
    alt: 'Curriq integration test course thumbnail',
    price: '₹99',
    duration: '5 MIN',
    lessonsCount: 1,
    isOwned: false,
    completedLessonsCount: 0,
    outcomes: [
      'Validate Mux video upload and encoding pipeline',
      'Confirm signed JWT playback tokens are minted correctly',
      'Verify mux-player renders inside dacowboyfitness',
    ],
    lessons: [
      {
        id: 'ci-l1',
        title: '01 · Mux Pipeline Smoke Test',
        duration: '5:00',
        isCompleted: false,
        assetId: 'ast_223bdcfdce8d48fd851bbb5b',
        notes: 'If this video plays with audio/video intact, the Curriq → Mux integration is fully operational.',
      },
    ],
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
