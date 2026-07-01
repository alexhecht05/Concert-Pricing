import { CAPABILITIES, PARTS, type UseCase } from '../data/pricingData';
import { type CapabilityInputMap, type PricingInputs } from '../utils/calculatePricing';

interface Props {
  inputs: PricingInputs;
  onChange: (inputs: PricingInputs) => void;
  onCalculate: () => void;
}

const USE_CASE_ORDER: UseCase[] = ['Protect', 'Resilience', 'Workflows', 'Observe', 'Optimize'];

export default function CapabilityForm({ inputs, onChange, onCalculate }: Props) {
  function setCapability(id: string, patch: Partial<CapabilityInputMap[string]>) {
    onChange({
      ...inputs,
      capabilities: {
        ...inputs.capabilities,
        [id]: { ...inputs.capabilities[id], ...patch },
      },
    });
  }

  function toggleEnabled(id: string, checked: boolean) {
    setCapability(id, { enabled: checked, quantity: checked ? (inputs.capabilities[id]?.quantity || 1) : 0 });
  }

  const grouped = USE_CASE_ORDER.map((uc) => ({
    useCase: uc,
    capabilities: CAPABILITIES.filter((c) => c.useCase === uc),
  }));

  return (
    <div style={styles.form}>
      <h2 style={styles.sectionTitle}>Configure Capabilities</h2>

      {grouped.map(({ useCase, capabilities }) => (
        <div key={useCase} style={styles.group}>
          <div style={styles.groupHeader}>{useCase}</div>
          {capabilities.map((cap) => {
            const input = inputs.capabilities[cap.id] ?? { enabled: false, quantity: 0 };
            return (
              <div key={cap.id} style={styles.row}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={input.enabled}
                    onChange={(e) => toggleEnabled(cap.id, e.target.checked)}
                    style={styles.checkbox}
                  />
                  <span style={styles.capLabel}>{cap.label}</span>
                </label>
                <span style={{ ...styles.desc, ...(input.enabled ? {} : styles.muted) }}>
                  {cap.description}
                </span>
                {input.enabled && (
                  <div style={styles.inputs}>
                    {cap.id === 'compliance' && (
                      <label style={styles.inputLabel}>
                        <span># {cap.frameworkLabel}</span>
                        <input
                          type="number"
                          min={0}
                          value={input.frameworks ?? 1}
                          onChange={(e) =>
                            setCapability(cap.id, { frameworks: Math.max(0, Number(e.target.value)) })
                          }
                          style={styles.numberInput}
                        />
                      </label>
                    )}
                    <label style={styles.inputLabel}>
                      <span># {cap.unitLabel}</span>
                      <input
                        type="number"
                        min={0}
                        value={input.quantity}
                        onChange={(e) =>
                          setCapability(cap.id, { quantity: Math.max(0, Number(e.target.value)) })
                        }
                        style={styles.numberInput}
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Pricing options */}
      <div style={styles.pricingSection}>
        <h2 style={styles.sectionTitle}>Pricing Options</h2>

        <div style={styles.optionRow}>
          <label style={styles.optionLabel} htmlFor="partSelect">
            License Type
          </label>
          <select
            id="partSelect"
            value={inputs.partId}
            onChange={(e) => onChange({ ...inputs, partId: e.target.value })}
            style={styles.select}
          >
            {PARTS.map((p) => (
              <option key={p.partNumber} value={p.partNumber}>
                {p.partNumber} — {p.description} (${p.pricePerRU.toLocaleString()}/RU)
              </option>
            ))}
          </select>
        </div>

        <div style={styles.optionRow}>
          <label style={styles.optionLabel} htmlFor="discountInput">
            Account Discount (%)
          </label>
          <input
            id="discountInput"
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={inputs.discountPercent}
            onChange={(e) =>
              onChange({
                ...inputs,
                discountPercent: Math.min(100, Math.max(0, Number(e.target.value))),
              })
            }
            style={{ ...styles.numberInput, width: 90 }}
          />
        </div>
      </div>

      <button style={styles.calcButton} onClick={onCalculate}>
        Calculate Pricing →
      </button>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  form: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#1f2328',
    marginBottom: 12,
    marginTop: 0,
  },
  group: {
    marginBottom: 20,
  },
  groupHeader: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#7c5cd8',
    marginBottom: 6,
    paddingBottom: 4,
    borderBottom: '1px solid #e5e7eb',
  },
  row: {
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
  },
  checkbox: {
    width: 16,
    height: 16,
    flexShrink: 0,
    accentColor: '#3b82d4',
    cursor: 'pointer',
  },
  capLabel: {
    fontWeight: 600,
    fontSize: 14,
    color: '#1f2328',
  },
  desc: {
    fontSize: 13,
    color: '#57606a',
    paddingLeft: 24,
  },
  muted: {
    opacity: 0.5,
  },
  inputs: {
    paddingLeft: 24,
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
    marginTop: 6,
  },
  inputLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    fontSize: 12,
    color: '#57606a',
    fontWeight: 500,
  },
  numberInput: {
    width: 110,
    padding: '5px 8px',
    border: '1px solid #d0d7de',
    borderRadius: 6,
    fontSize: 14,
    color: '#1f2328',
    background: '#ffffff',
  },
  pricingSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTop: '2px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  optionRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#1f2328',
  },
  select: {
    padding: '6px 10px',
    border: '1px solid #d0d7de',
    borderRadius: 6,
    fontSize: 13,
    color: '#1f2328',
    background: '#ffffff',
    maxWidth: 480,
  },
  calcButton: {
    marginTop: 24,
    padding: '12px 24px',
    background: '#3b82d4',
    color: '#ffffff',
    border: 'none',
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
};
