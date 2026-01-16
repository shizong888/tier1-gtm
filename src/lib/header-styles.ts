export const HEADER_STYLES = [
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'Deterministic execution theme with rotating geometric shapes',
  },
  {
    id: 'target-audience',
    name: 'Target Audience',
    description: 'Participant segments with expanding rings and converging lines',
  },
  {
    id: 'value-proposition',
    name: 'Value Proposition',
    description: 'Core advantages with pulsing grid and scan lines',
  },
  {
    id: 'expanding-reach',
    name: 'Expanding Reach',
    description: 'Ecosystem scaling with growing waves and orbital nodes',
  },
  {
    id: 'partnerships',
    name: 'Partnerships',
    description: 'Growth infrastructure with connecting shapes',
  },
  {
    id: 'token-incentives',
    name: 'Token Incentives',
    description: 'Economic alignment with animated bar chart',
  },
  {
    id: 'community-brand',
    name: 'Community & Brand',
    description: 'Strategic presence with expanding ripples',
  },
  {
    id: 'market-integrity',
    name: 'Market Integrity',
    description: 'Institutional standards with crosshair and scan',
  },
  {
    id: 'cex-to-onchain',
    name: 'CEX to On-Chain',
    description: 'The great migration with transition animation',
  },
  {
    id: 'first-1000',
    name: 'First 1,000 Participants',
    description: 'The foundation with clustering particles',
  },
  {
    id: 'network-effects',
    name: 'Network Effects',
    description: 'Compound growth with orbital systems and geometric moat',
  },
  {
    id: 'none',
    name: 'Simple Header',
    description: 'Clean minimal header without animations',
  },
] as const;

export type HeaderStyleId = typeof HEADER_STYLES[number]['id'];
