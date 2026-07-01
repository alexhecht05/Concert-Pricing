import { useState } from 'react';
import CapabilityForm from './components/CapabilityForm';
import PricingResults from './components/PricingResults';
import { calculatePricing, type PricingInputs, type PricingResult } from './utils/calculatePricing';
import { DEFAULT_PART_ID } from './data/pricingData';

const DEFAULT_INPUTS: PricingInputs = {
  capabilities: {},
  partId: DEFAULT_PART_ID,
  discountPercent: 0,
};

export default function App() {
  const [inputs, setInputs] = useState<PricingInputs>(DEFAULT_INPUTS);
  const [result, setResult] = useState<PricingResult | null>(null);

  function handleCalculate() {
    setResult(calculatePricing(inputs));
  }

  function handleReset() {
    setResult(null);
  }

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <span style={styles.ibmBadge}>IBM</span>
          <div>
            <h1 style={styles.heading}>Concert Pricing Calculator</h1>
            <p style={styles.subheading}>
              Resource Unit sizing and list price estimator for IBM Concert (On-Prem, PID 5900BBE)
            </p>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={styles.main}>
        {result === null ? (
          <CapabilityForm
            inputs={inputs}
            onChange={setInputs}
            onCalculate={handleCalculate}
          />
        ) : (
          <PricingResults result={result} onReset={handleReset} />
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        <span>IBM Concert Pricing Calculator · For internal IBM seller use only</span>
      </footer>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f7f8fa',
  },
  header: {
    background: '#1f2328',
    color: '#ffffff',
    padding: '20px 24px',
  },
  headerInner: {
    maxWidth: 860,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  ibmBadge: {
    background: '#0f62fe',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: 22,
    letterSpacing: '0.05em',
    padding: '4px 10px',
    borderRadius: 4,
    flexShrink: 0,
  },
  heading: {
    fontSize: 20,
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.3,
  },
  subheading: {
    fontSize: 13,
    color: '#8b949e',
    margin: '2px 0 0',
  },
  main: {
    flex: 1,
    maxWidth: 860,
    width: '100%',
    margin: '32px auto',
    padding: '0 16px',
  },
  footer: {
    textAlign: 'center',
    padding: '16px',
    fontSize: 12,
    color: '#57606a',
    borderTop: '1px solid #e5e7eb',
    background: '#ffffff',
  },
};
