// Fake candidate + job data for the hiring platform mock.
// Avatars use DiceBear's beam style (deterministic from seed, no external deps required at runtime — they hit DiceBear CDN).

const AVATAR = (seed) => `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ede9fe,e0f2fe,dcfce7,fef3c7`;

window.CANDIDATES = [
  {
    id: 'c1',
    name: 'Maya Chen',
    headline: 'Senior Frontend Engineer · React · TypeScript',
    field: 'Engineering',
    location: 'San Francisco, CA',
    experience: 6,
    verifiedHours: 1247,
    sessionsCount: 312,
    lastActive: '2 days ago',
    rating: 4.9,
    skills: [
      { name: 'React', rating: 96, hours: 480 },
      { name: 'TypeScript', rating: 94, hours: 410 },
      { name: 'Next.js', rating: 88, hours: 220 },
      { name: 'Tailwind CSS', rating: 85, hours: 180 },
      { name: 'Node.js', rating: 72, hours: 95 },
    ],
    topSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js'],
    reports: [
      { title: 'Rebuilt design system component library', date: 'Jun 4, 2026', summary: 'Refactored 38 components into a tokenized system. Migrated 4 product surfaces. 0 visual regressions across Chromatic suite.' },
      { title: 'Shipped multi-tenant dashboard', date: 'May 22, 2026', summary: 'Built tenant switcher, role-gated routes, and audit log views. Reduced p95 dashboard load from 2.1s to 640ms.' },
      { title: 'Auth flow redesign + a11y pass', date: 'May 10, 2026', summary: 'WCAG AA across login/signup. Added passkey support. Conversion lifted 17% in A/B.' },
    ],
  },
  {
    id: 'c2',
    name: 'Diego Alvarez',
    headline: 'Full-stack Engineer · Go · Postgres',
    field: 'Engineering',
    location: 'Mexico City, MX',
    experience: 4,
    verifiedHours: 892,
    sessionsCount: 241,
    lastActive: '5 hours ago',
    rating: 4.8,
    skills: [
      { name: 'Go', rating: 92, hours: 340 },
      { name: 'PostgreSQL', rating: 90, hours: 280 },
      { name: 'Docker', rating: 82, hours: 140 },
      { name: 'gRPC', rating: 78, hours: 95 },
      { name: 'React', rating: 65, hours: 75 },
    ],
    topSkills: ['Go', 'PostgreSQL', 'Docker', 'gRPC', 'React'],
    reports: [
      { title: 'Built payments reconciliation pipeline', date: 'Jun 6, 2026', summary: 'Event-sourced reconciliation across Stripe + ACH. Closed a $40k/mo leak from orphaned refunds.' },
      { title: 'Migrated monolith → 4 services', date: 'May 18, 2026', summary: 'Carved out billing, identity, notifications, and search. Zero-downtime cutover via shadow writes.' },
    ],
  },
  {
    id: 'c3',
    name: 'Priya Iyer',
    headline: 'Product Designer · Systems-first',
    field: 'Design',
    location: 'Bangalore, IN',
    experience: 7,
    verifiedHours: 1518,
    sessionsCount: 402,
    lastActive: '1 day ago',
    rating: 4.95,
    skills: [
      { name: 'Figma', rating: 98, hours: 720 },
      { name: 'Design Systems', rating: 95, hours: 410 },
      { name: 'Prototyping', rating: 88, hours: 220 },
      { name: 'User Research', rating: 80, hours: 110 },
      { name: 'Webflow', rating: 70, hours: 58 },
    ],
    topSkills: ['Figma', 'Design Systems', 'Prototyping', 'Research', 'Webflow'],
    reports: [
      { title: 'Mobile app onboarding redesign', date: 'Jun 2, 2026', summary: 'Cut activation drop-off by 31%. Shipped a 4-step flow with progressive disclosure and skip-able tutorials.' },
      { title: 'Design system v3 launch', date: 'May 14, 2026', summary: 'Token unification across iOS, Android, web. 240 components. Adopted by 6 product teams in week 1.' },
    ],
  },
  {
    id: 'c4',
    name: 'Jamal Roberts',
    headline: 'Data Engineer · Snowflake · dbt',
    field: 'Data',
    location: 'Atlanta, GA',
    experience: 5,
    verifiedHours: 1083,
    sessionsCount: 268,
    lastActive: '4 hours ago',
    rating: 4.85,
    skills: [
      { name: 'Snowflake', rating: 94, hours: 420 },
      { name: 'dbt', rating: 92, hours: 310 },
      { name: 'Airflow', rating: 84, hours: 180 },
      { name: 'Python', rating: 88, hours: 220 },
      { name: 'SQL', rating: 96, hours: 510 },
    ],
    topSkills: ['Snowflake', 'dbt', 'Airflow', 'Python', 'SQL'],
    reports: [
      { title: 'Revenue attribution warehouse rebuild', date: 'Jun 5, 2026', summary: 'Replaced legacy attribution layer. 400+ dbt models. Cut nightly run time from 6h to 47m.' },
      { title: 'Realtime CDC pipeline', date: 'May 20, 2026', summary: 'Debezium → Kafka → Snowflake streams. Replaced batch ETL for the 3 highest-volume tables.' },
    ],
  },
  {
    id: 'c5',
    name: 'Sofia Kowalski',
    headline: 'iOS Engineer · Swift · SwiftUI',
    field: 'Mobile',
    location: 'Warsaw, PL',
    experience: 8,
    verifiedHours: 1832,
    sessionsCount: 461,
    lastActive: '3 days ago',
    rating: 4.92,
    skills: [
      { name: 'Swift', rating: 97, hours: 820 },
      { name: 'SwiftUI', rating: 92, hours: 410 },
      { name: 'Combine', rating: 85, hours: 180 },
      { name: 'XCTest', rating: 80, hours: 140 },
      { name: 'CoreData', rating: 78, hours: 110 },
    ],
    topSkills: ['Swift', 'SwiftUI', 'Combine', 'XCTest', 'CoreData'],
    reports: [
      { title: 'Offline-first sync layer', date: 'Jun 1, 2026', summary: 'CRDT-based conflict resolution. Shipped to 1.2M users with 0.02% crash rate.' },
    ],
  },
  {
    id: 'c6',
    name: 'Ade Okafor',
    headline: 'Growth Marketer · B2B SaaS',
    field: 'Marketing',
    location: 'Lagos, NG',
    experience: 4,
    verifiedHours: 776,
    sessionsCount: 198,
    lastActive: '1 hour ago',
    rating: 4.7,
    skills: [
      { name: 'Paid Acquisition', rating: 90, hours: 280 },
      { name: 'SEO', rating: 85, hours: 210 },
      { name: 'Lifecycle Email', rating: 88, hours: 180 },
      { name: 'Webflow', rating: 75, hours: 80 },
      { name: 'Analytics', rating: 82, hours: 130 },
    ],
    topSkills: ['Paid Ads', 'SEO', 'Lifecycle', 'Webflow', 'Analytics'],
    reports: [
      { title: 'Q2 paid funnel rebuild', date: 'May 30, 2026', summary: 'Cut CAC 38% across LinkedIn + Google. New LP system lifted MQL conversion to 11.2%.' },
    ],
  },
  {
    id: 'c7',
    name: 'Lena Bauer',
    headline: 'ML Engineer · LLM applications',
    field: 'AI/ML',
    location: 'Berlin, DE',
    experience: 5,
    verifiedHours: 1102,
    sessionsCount: 287,
    lastActive: '6 hours ago',
    rating: 4.93,
    skills: [
      { name: 'PyTorch', rating: 92, hours: 380 },
      { name: 'LLM Fine-tuning', rating: 90, hours: 290 },
      { name: 'RAG', rating: 95, hours: 240 },
      { name: 'Python', rating: 96, hours: 510 },
      { name: 'vLLM', rating: 82, hours: 120 },
    ],
    topSkills: ['PyTorch', 'LLM Tuning', 'RAG', 'Python', 'vLLM'],
    reports: [
      { title: 'Internal RAG copilot', date: 'Jun 7, 2026', summary: 'Retrieval over 240k docs with hybrid BM25 + embeddings. 78% top-1 accuracy on eval set.' },
    ],
  },
  {
    id: 'c8',
    name: 'Noah Pereira',
    headline: 'DevOps · Kubernetes · Terraform',
    field: 'Infrastructure',
    location: 'Lisbon, PT',
    experience: 6,
    verifiedHours: 1340,
    sessionsCount: 351,
    lastActive: '12 hours ago',
    rating: 4.88,
    skills: [
      { name: 'Kubernetes', rating: 94, hours: 520 },
      { name: 'Terraform', rating: 92, hours: 380 },
      { name: 'AWS', rating: 90, hours: 410 },
      { name: 'Prometheus', rating: 84, hours: 180 },
      { name: 'Go', rating: 75, hours: 110 },
    ],
    topSkills: ['Kubernetes', 'Terraform', 'AWS', 'Prometheus', 'Go'],
    reports: [
      { title: 'Multi-region failover', date: 'May 27, 2026', summary: 'Active-active across us-east + eu-west. RPO 5s, RTO under 90s. Tested with full region drill.' },
    ],
  },
  {
    id: 'c9',
    name: 'Hannah Park',
    headline: 'Product Manager · Marketplace',
    field: 'Product',
    location: 'Seoul, KR',
    experience: 7,
    verifiedHours: 1421,
    sessionsCount: 376,
    lastActive: '2 hours ago',
    rating: 4.9,
    skills: [
      { name: 'Roadmapping', rating: 92, hours: 410 },
      { name: 'Experimentation', rating: 88, hours: 280 },
      { name: 'SQL', rating: 80, hours: 180 },
      { name: 'User Interviews', rating: 90, hours: 220 },
    ],
    topSkills: ['Roadmaps', 'Experiments', 'SQL', 'Interviews'],
    reports: [
      { title: 'Seller onboarding overhaul', date: 'May 31, 2026', summary: 'Cut time-to-first-listing from 4.2 days to 11 hrs. Lifted seller retention at d30 by 22%.' },
    ],
  },
  {
    id: 'c10',
    name: 'Ravi Singh',
    headline: 'Security Engineer · AppSec',
    field: 'Security',
    location: 'Toronto, CA',
    experience: 6,
    verifiedHours: 1268,
    sessionsCount: 304,
    lastActive: '1 day ago',
    rating: 4.91,
    skills: [
      { name: 'Threat Modeling', rating: 94, hours: 280 },
      { name: 'OWASP Top 10', rating: 96, hours: 320 },
      { name: 'Python', rating: 82, hours: 180 },
      { name: 'Burp Suite', rating: 88, hours: 210 },
    ],
    topSkills: ['Threat Modeling', 'AppSec', 'Python', 'Burp', 'IAM'],
    reports: [
      { title: 'SOC2 Type II readiness', date: 'May 25, 2026', summary: 'Closed 47 findings across 4 services. Shipped continuous evidence collection via Vanta integration.' },
    ],
  },
  {
    id: 'c11',
    name: 'Emma Wright',
    headline: 'Copywriter · B2B + Brand',
    field: 'Marketing',
    location: 'London, UK',
    experience: 5,
    verifiedHours: 921,
    sessionsCount: 234,
    lastActive: '3 hours ago',
    rating: 4.86,
    skills: [
      { name: 'Long-form', rating: 92, hours: 380 },
      { name: 'Landing Pages', rating: 90, hours: 280 },
      { name: 'Email', rating: 85, hours: 180 },
      { name: 'Brand Voice', rating: 88, hours: 110 },
    ],
    topSkills: ['Long-form', 'Landing', 'Email', 'Brand', 'SEO'],
    reports: [
      { title: 'Brand voice guidelines + rollout', date: 'May 28, 2026', summary: 'Re-wrote 32 product surfaces. Lifted free-trial signup CTR by 19%.' },
    ],
  },
  {
    id: 'c12',
    name: 'Tomas Aalto',
    headline: 'Android Engineer · Kotlin · Compose',
    field: 'Mobile',
    location: 'Helsinki, FI',
    experience: 6,
    verifiedHours: 1178,
    sessionsCount: 296,
    lastActive: '8 hours ago',
    rating: 4.87,
    skills: [
      { name: 'Kotlin', rating: 95, hours: 560 },
      { name: 'Jetpack Compose', rating: 92, hours: 380 },
      { name: 'Coroutines', rating: 88, hours: 240 },
      { name: 'Room', rating: 80, hours: 110 },
    ],
    topSkills: ['Kotlin', 'Compose', 'Coroutines', 'Room', 'Hilt'],
    reports: [
      { title: 'Rebuilt video player surface', date: 'Jun 3, 2026', summary: 'Compose-first migration. Saved 240KB binary and cut frame drops 65% on mid-tier devices.' },
    ],
  },
].map(c => ({ ...c, avatar: AVATAR(c.name) }));

window.JOBS = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    company: 'Acme Robotics',
    location: 'San Francisco / Remote',
    posted: '4 days ago',
    matches: 14,
    interestSent: 6,
    requiredSkills: ['React', 'TypeScript', 'Design Systems'],
    description: 'Building the operator dashboard for our humanoid fleet. You will own the design system and lead the frontend architecture decisions.',
  },
  {
    id: 'j2',
    title: 'Staff Data Engineer',
    company: 'Acme Robotics',
    location: 'Remote',
    posted: '1 week ago',
    matches: 9,
    interestSent: 3,
    requiredSkills: ['Snowflake', 'dbt', 'Python'],
    description: 'Lead the data platform that ingests telemetry from our fleet at 12B events/day. Define the modeling layer, lead 2 ICs.',
  },
  {
    id: 'j3',
    title: 'Product Designer',
    company: 'Acme Robotics',
    location: 'San Francisco',
    posted: '2 days ago',
    matches: 11,
    interestSent: 4,
    requiredSkills: ['Figma', 'Design Systems', 'Prototyping'],
    description: 'Shape the operator and customer-facing UX. Partner with hardware on the physical/digital interface for ground stations.',
  },
];

// Score candidates against a job's required skills
window.scoreCandidate = function(candidate, job) {
  const reqs = job.requiredSkills.map(s => s.toLowerCase());
  let total = 0;
  let matched = 0;
  candidate.skills.forEach(skill => {
    if (reqs.some(r => skill.name.toLowerCase().includes(r) || r.includes(skill.name.toLowerCase()))) {
      total += skill.rating;
      matched++;
    }
  });
  if (matched === 0) return 0;
  const skillScore = total / matched; // 0..100
  // Boost by verified hours (saturates)
  const hoursBoost = Math.min(candidate.verifiedHours / 1500, 1) * 8;
  return Math.min(99, Math.round(skillScore * 0.92 + hoursBoost));
};

window.matchesForJob = function(jobId) {
  const job = window.JOBS.find(j => j.id === jobId);
  if (!job) return [];
  return window.CANDIDATES
    .map(c => ({ candidate: c, score: window.scoreCandidate(c, job) }))
    .filter(m => m.score > 30)
    .sort((a, b) => b.score - a.score);
};
