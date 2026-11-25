/** Ways to work together, as manga quest types. Shown on Home (final panel) and Contact. */
export const quests = [
  { id: 'full-time', tag: 'Main quest', title: 'Full-time role' },
  { id: 'contract', tag: 'Side quest', title: 'Contract role' },
  { id: 'freelance', tag: 'Bounty', title: 'Freelance project' },
  { id: 'collab', tag: 'Co-op', title: 'Collaboration' },
] as const

export type QuestId = (typeof quests)[number]['id']

/** Subject line the Contact form starts with when a quest is picked. */
export const questSubject = (id: QuestId) => {
  const q = quests.find((x) => x.id === id)!
  return `${q.title}: `
}
