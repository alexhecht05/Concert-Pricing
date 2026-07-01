// ─── Capabilities ────────────────────────────────────────────────────────────

export type UseCase = 'Protect' | 'Resilience' | 'Workflows' | 'Observe' | 'Optimize';

export interface Capability {
  id: string;
  label: string;
  useCase: UseCase;
  description: string;
  /** RUs per primary unit (apps, servers, workflows, certs, etc.) */
  ruPerUnit: number;
  unitLabel: string;
  /** For Compliance only: additional RUs per framework (primary unit = apps) */
  ruPerFramework?: number;
  /** For Compliance only: unit label for the secondary input (frameworks) */
  frameworkLabel?: string;
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'vulnerability',
    label: 'Vulnerability Management',
    useCase: 'Protect',
    description: 'Detect application vulnerabilities for customers to address',
    ruPerUnit: 3,
    unitLabel: 'Applications',
  },
  {
    id: 'certificate',
    label: 'Certificate Health',
    useCase: 'Protect',
    description: 'Manage and Rotate Security/Identity Certificates',
    ruPerUnit: 0.1, // 1 RU per 10 certs → 0.1 RU/cert (ceiling applied in calc)
    unitLabel: 'Certificates',
  },
  {
    id: 'compliance',
    label: 'Compliance Management',
    useCase: 'Protect',
    description: 'Automate application compliance against standard or custom frameworks',
    ruPerUnit: 2,        // 2 RU per application the framework is applied to
    unitLabel: 'Applications',
    ruPerFramework: 3,   // 3 RU per framework
    frameworkLabel: 'Frameworks',
  },
  {
    id: 'securecoder',
    label: 'Secure Coder (Add-On)',
    useCase: 'Protect',
    description: 'Security plug-in for IDEs — scanning and remediation guidance (includes Value Radar)',
    ruPerUnit: 1,
    unitLabel: 'Applications',
  },
  {
    id: 'resilience',
    label: 'Resilience Posture Assessment',
    useCase: 'Resilience',
    description: 'Provides a resilience posture for an application',
    ruPerUnit: 5,
    unitLabel: 'Applications',
  },
  {
    id: 'workflows',
    label: 'Concert Workflows',
    useCase: 'Workflows',
    description: 'Automate series of events for vulnerability or security gap remediation',
    ruPerUnit: 5,
    unitLabel: 'Deployed Workflows',
  },
  {
    id: 'apm_essentials',
    label: 'Essentials App Performance Mgmt',
    useCase: 'Observe',
    description: 'Application observability powered by Instana Essentials',
    ruPerUnit: 1 / 7, // 1 RU per 7 managed virtual servers
    unitLabel: 'Managed Virtual Servers',
  },
  {
    id: 'apm_standard',
    label: 'Standard App Performance Mgmt',
    useCase: 'Observe',
    description: 'Application observability powered by Instana Standard',
    ruPerUnit: 1 / 2, // 1 RU per 2 managed virtual servers
    unitLabel: 'Managed Virtual Servers',
  },
  {
    id: 'optimization',
    label: 'Optimization',
    useCase: 'Optimize',
    description: 'Performance & Cost optimization powered by Turbonomic',
    ruPerUnit: 1 / 5, // 1 RU per 5 managed virtual servers
    unitLabel: 'Managed Virtual Servers',
  },
];

// ─── T-Shirt Sizes ────────────────────────────────────────────────────────────

export interface TshirtSize {
  id: string;
  label: string;
  rus: number;
  /** Human-readable summary of what clients can do at this tier */
  description: string[];
}

export const TSHIRT_SIZES: TshirtSize[] = [
  {
    id: 'xs',
    label: 'XSmall',
    rus: 200,
    description: [
      'CVE vulnerabilities for 6 applications',
      'Resilience posture for 2 applications',
      'Certificate health for 60 certificates',
      '12 deployed workflows',
    ],
  },
  {
    id: 's',
    label: 'Small',
    rus: 500,
    description: [
      'CVE vulnerabilities for 15 applications',
      'Resilience posture for 5 applications',
      'Certificate health for 150 certificates',
      '32 deployed workflows',
    ],
  },
  {
    id: 'm',
    label: 'Medium',
    rus: 1000,
    description: [
      'CVE vulnerabilities for 30 applications',
      'Resilience posture for 10 applications',
      'Certificate health for 300 certificates',
      '64 deployed workflows',
    ],
  },
  {
    id: 'l',
    label: 'Large',
    rus: 1500,
    description: [
      'CVE vulnerabilities for 45 applications',
      'Resilience posture for 15 applications',
      'Certificate health for 450 certificates',
      '96 deployed workflows',
    ],
  },
];

// ─── Parts & Pricing (On-Prem, PID 5900BBE) ──────────────────────────────────

export interface Part {
  partNumber: string;
  description: string;
  /** List price per Resource Unit (USD) */
  pricePerRU: number;
}

export const PARTS: Part[] = [
  {
    partNumber: 'D0MK4ZX',
    description: 'License + SW Subscription & Support',
    pricePerRU: 6360,
  },
  {
    partNumber: 'E0MK2ZX',
    description: 'Annual SW Subscription & Support Renewal',
    pricePerRU: 1270,
  },
  {
    partNumber: 'D0MK6ZX',
    description: 'SW Subscription & Support Reinstatement',
    pricePerRU: 3820,
  },
  {
    partNumber: 'D0MK5ZX',
    description: 'Monthly License',
    pricePerRU: 265,
  },
  {
    partNumber: 'D0MK3ZX',
    description: 'Subscription License',
    pricePerRU: 212,
  },
  {
    partNumber: 'X0MK2ZX',
    description: 'Extended Support 12 Months',
    pricePerRU: 254,
  },
  {
    partNumber: 'X0MK3ZX',
    description: 'Extended Support Subscription License',
    pricePerRU: 42.40,
  },
  {
    partNumber: 'Z0MK2ZX',
    description: 'Advanced Support 12 Months',
    pricePerRU: 382,
  },
  {
    partNumber: 'Z0MK3ZX',
    description: 'Advanced Support Subscription License',
    pricePerRU: 31.80,
  },
];

export const DEFAULT_PART_ID = 'D0MK4ZX';
