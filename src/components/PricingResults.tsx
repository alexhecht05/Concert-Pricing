import { type PricingResult } from '../utils/calculatePricing';

interface Props {
  result: PricingResult;
  onReset: () => void;
}

const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const TSHIRT_COLORS: Record<string, { bg: string; color: string }> = {
  xs: { bg: '#e5e7eb', color: '#1f2328' },
  s:  { bg: '#dbeafe', color: '#1e40af' },
  m:  { bg: '#ede9fe', color: '#5b21b6' },
  l:  { bg: '#d1fae5', color: '#065f46' },
};

export default function PricingResults({ result, onReset }: Props) {
  const sizeColor = result.tshirtSize
    ? (TSHIRT_COLORS[result.tshirtSize.id] ?? TSHIRT_COLORS['l'])
    : TSHIRT_COLORS['xs'];

  // ── Export: Copy to clipboard ──────────────────────────────────────────────
  function handleCopy() {
    const lines: string[] = [
      'IBM Concert Pricing Estimate',
      '════════════════════════════════════════',
      `Total Resource Units: ${result.totalRUs.toLocaleString()} RU`,
      `T-Shirt Size: ${result.tshirtSize?.label ?? 'Custom'}`,
      `License Type: ${result.partNumber} — ${result.partDescription}`,
      `Price per RU: ${USD.format(result.pricePerRU)}`,
      '',
      'Capability Breakdown:',
    ];
    for (const row of result.breakdown) {
      const qty =
        row.frameworks !== undefined
          ? `${row.frameworks} frameworks, ${row.quantity} apps`
          : `${row.quantity.toLocaleString()} ${row.quantity === 1 ? 'unit' : 'units'}`;
      lines.push(`  ${row.label} (${row.useCase}): ${qty} → ${row.rus} RU`);
    }
    lines.push('');
    lines.push(`List Price: ${USD.format(result.listPrice)}`);
    if (result.discountPercent > 0) {
      lines.push(`Discount: ${result.discountPercent}%`);
      lines.push(`Discounted Price: ${USD.format(result.discountedPrice)}`);
    }
    navigator.clipboard.writeText(lines.join('\n'));
  }

  // ── Export: Download CSV ───────────────────────────────────────────────────
  function handleDownloadCSV() {
    const rows: string[][] = [
      ['Capability', 'Use Case', 'Quantity', 'Frameworks', 'Resource Units'],
      ...result.breakdown.map((row) => [
        row.label,
        row.useCase,
        String(row.quantity),
        row.frameworks !== undefined ? String(row.frameworks) : '',
        String(row.rus),
      ]),
      [],
      ['Total RUs', String(result.totalRUs)],
      ['T-Shirt Size', result.tshirtSize?.label ?? 'Custom'],
      ['License Type', `${result.partNumber} — ${result.partDescription}`],
      ['Price per RU', String(result.pricePerRU)],
      ['List Price', String(result.listPrice)],
      ['Discount %', String(result.discountPercent)],
      ['Discounted Price', String(result.discountedPrice)],
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'concert-pricing-estimate.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={styles.container}>
      {/* Header row */}
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Pricing Estimate</h2>
        <button style={styles.resetBtn} onClick={onReset}>
          ← Recalculate
        </button>
      </div>

      {/* Summary cards */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Total Resource Units</div>
          <div style={styles.cardValue}>{result.totalRUs.toLocaleString()} RU</div>
        </div>

        {result.tshirtSize && (
          <div style={styles.card}>
            <div style={styles.cardLabel}>T-Shirt Size</div>
            <span
              style={{
                ...styles.badge,
                background: sizeColor.bg,
                color: sizeColor.color,
              }}
            >
              {result.tshirtSize.label}
            </span>
          </div>
        )}

        <div style={styles.card}>
          <div style={styles.cardLabel}>List Price</div>
          <div style={styles.cardValue}>{USD.format(result.listPrice)}</div>
        </div>

        {result.discountPercent > 0 && (
          <div style={{ ...styles.card, borderColor: '#3b82d4' }}>
            <div style={styles.cardLabel}>Discounted Price ({result.discountPercent}% off)</div>
            <div style={{ ...styles.cardValue, color: '#3b82d4' }}>
              {USD.format(result.discountedPrice)}
            </div>
          </div>
        )}
      </div>

      {/* T-shirt description */}
      {result.tshirtSize && (
        <div style={styles.section}>
          <div style={styles.sectionLabel}>At {result.tshirtSize.label} ({result.tshirtSize.rus.toLocaleString()} RU), clients can:</div>
          <ul style={styles.descList}>
            {result.tshirtSize.description.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Breakdown table */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Capability Breakdown</div>
        <table>
          <thead>
            <tr>
              <th>Capability</th>
              <th>Use Case</th>
              <th>Quantity</th>
              <th style={{ textAlign: 'right' }}>RUs</th>
            </tr>
          </thead>
          <tbody>
            {result.breakdown.map((row) => (
              <tr key={row.capabilityId}>
                <td>{row.label}</td>
                <td style={{ color: '#57606a' }}>{row.useCase}</td>
                <td>
                  {row.frameworks !== undefined
                    ? `${row.frameworks} frameworks, ${row.quantity} apps`
                    : `${row.quantity.toLocaleString()}`}
                </td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {row.rus}
                </td>
              </tr>
            ))}
            <tr style={{ fontWeight: 700, background: '#f7f8fa' }}>
              <td colSpan={3}>Total</td>
              <td style={{ textAlign: 'right' }}>{result.totalRUs.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pricing detail */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Pricing Detail</div>
        <table>
          <tbody>
            <tr>
              <td>License Type</td>
              <td>{result.partNumber} — {result.partDescription}</td>
            </tr>
            <tr>
              <td>Price per RU</td>
              <td>{USD.format(result.pricePerRU)}</td>
            </tr>
            <tr>
              <td>List Price ({result.totalRUs.toLocaleString()} RU × {USD.format(result.pricePerRU)})</td>
              <td style={{ fontWeight: 600 }}>{USD.format(result.listPrice)}</td>
            </tr>
            {result.discountPercent > 0 && (
              <tr>
                <td>Discounted Price ({result.discountPercent}% off)</td>
                <td style={{ fontWeight: 700, color: '#3b82d4' }}>{USD.format(result.discountedPrice)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Export actions */}
      <div style={styles.exportRow}>
        <button style={styles.exportBtn} onClick={handleCopy}>
          Copy to Clipboard
        </button>
        <button style={styles.exportBtn} onClick={handleDownloadCSV}>
          Download CSV
        </button>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1f2328',
    margin: 0,
  },
  resetBtn: {
    background: 'none',
    border: '1px solid #d0d7de',
    borderRadius: 6,
    padding: '6px 14px',
    fontSize: 13,
    color: '#57606a',
    cursor: 'pointer',
  },
  cards: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  card: {
    flex: '1 1 140px',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    color: '#57606a',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1f2328',
    fontVariantNumeric: 'tabular-nums',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 14px',
    borderRadius: 20,
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: '0.02em',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    color: '#57606a',
  },
  descList: {
    paddingLeft: 20,
    fontSize: 13,
    color: '#1f2328',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  exportRow: {
    display: 'flex',
    gap: 10,
    paddingTop: 4,
    borderTop: '1px solid #e5e7eb',
  },
  exportBtn: {
    padding: '8px 16px',
    background: '#f7f8fa',
    border: '1px solid #d0d7de',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    color: '#1f2328',
    cursor: 'pointer',
  },
};
