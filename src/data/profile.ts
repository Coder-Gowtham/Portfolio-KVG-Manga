import type { Profile } from '../types/content'

/** Source: résumé "GOWTHAM_KV_RESUME_FULLSTACK" (23 Nov 2026) + Gowtham's answers. */
export const profile: Profile = {
  name: 'Gowtham KV',
  shortName: 'KVG',
  role: 'Full Stack Developer',
  headline: 'Full stack developer. React, Node.js, JavaScript.',
  intro:
    'I build both sides of a product: React interfaces and large JavaScript front ends, and the Node.js/Express APIs, workflows and SQL data layers behind them.',
  experienceYears: 4,
  experienceSince: '2022-05',
  expertise: ['Full-stack development', 'React.js', 'Node.js', 'JavaScript', 'REST APIs & microservices', 'SQL databases'],
  availability: 'Available for immediate joining',
  nextArc: {
    label: 'Next arc',
    title: 'AI integration',
    text: 'Training to become an AI integrator: wiring LLM features into real products, from prompts and structured outputs to background AI jobs that keep apps fast.',
  },
  location: 'Bilaspur, Chhattisgarh',
  employmentPreferences: 'Full-time, contract, freelance and collaborations; remote, hybrid or on-site, any role across the stack',
  email: 'gowthamkv.210@gmail.com',
  phone: '+91-7067277125',
  links: [
    {
      id: 'email',
      label: 'Email',
      href: 'mailto:gowthamkv.210@gmail.com',
      handle: 'gowthamkv.210@gmail.com',
      showOnRecruiter: true,
    },
    { id: 'phone', label: 'Phone', href: 'tel:+917067277125', handle: '+91 70672 77125', showOnRecruiter: true },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/gowtham-kv-9b0314173/',
      handle: 'in/gowtham-kv',
      showOnRecruiter: true,
    },
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com/Coder-Gowtham',
      handle: 'Coder-Gowtham',
      showOnRecruiter: true,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      href: 'https://www.instagram.com/gowtham_kv_/',
      handle: '@gowtham_kv_',
      showOnRecruiter: false,
    },
  ],
  resume: {
    href: '/resume/gowtham-kv-resume.pdf',
    fileName: 'gowtham-kv-resume.pdf',
    available: true,
  },
}
