import { useState, useEffect } from 'preact/hooks';

interface ServiceItem {
  label: string;
  intervalKm: number;
  applies: ('4M41' | '6G75' | 'both')[];
  guideSlug?: string;
}

const SERVICE_ITEMS: ServiceItem[] = [
  // 10,000 km
  { label: 'Engine oil & filter', intervalKm: 10000, applies: ['both'], guideSlug: 'oil-change' },
  { label: 'Inspect brake pads', intervalKm: 10000, applies: ['both'], guideSlug: 'brake-noise-and-feel' },
  { label: 'Check all fluid levels', intervalKm: 10000, applies: ['both'], guideSlug: 'fluid-capacities' },
  // 20,000 km
  { label: 'Air filter replacement', intervalKm: 20000, applies: ['both'], guideSlug: 'air-filter' },
  { label: 'Inspect tires — pressure & wear', intervalKm: 20000, applies: ['both'], guideSlug: 'tire-pressure-and-wear' },
  { label: 'Inspect wiper blades', intervalKm: 20000, applies: ['both'], guideSlug: 'wiper-blade-replacement' },
  // 40,000 km
  { label: 'Fuel filter (diesel)', intervalKm: 40000, applies: ['4M41'], guideSlug: 'fuel-filter-diesel' },
  { label: 'Transfer case fluid check', intervalKm: 40000, applies: ['both'], guideSlug: 'fluid-capacities' },
  { label: 'Inspect front/rear differential oil', intervalKm: 40000, applies: ['both'], guideSlug: 'differential-oil-change' },
  { label: 'Glow plug inspection (diesel)', intervalKm: 40000, applies: ['4M41'], guideSlug: 'glow-plugs' },
  // 60,000 km
  { label: 'Brake fluid flush', intervalKm: 60000, applies: ['both'], guideSlug: 'brake-fluid-flush' },
  { label: 'Front & rear differential oil change', intervalKm: 60000, applies: ['both'], guideSlug: 'differential-oil-change' },
  { label: 'Transfer case fluid change', intervalKm: 60000, applies: ['both'] },
  { label: 'Coolant check & top-up', intervalKm: 60000, applies: ['both'], guideSlug: 'coolant-flush' },
  // 80,000 km
  { label: 'Spark plug replacement (petrol)', intervalKm: 80000, applies: ['6G75'], guideSlug: 'spark-plugs' },
  { label: 'Valve clearance check (diesel)', intervalKm: 80000, applies: ['4M41'], guideSlug: '4m41-valve-clearance' },
  { label: 'Power steering fluid check', intervalKm: 80000, applies: ['both'], guideSlug: 'power-steering-problems' },
  // 90,000 km
  { label: 'Timing belt replacement', intervalKm: 90000, applies: ['both'], guideSlug: 'timing-belt' },
  // 100,000 km
  { label: 'EGR valve cleaning (diesel)', intervalKm: 100000, applies: ['4M41'], guideSlug: 'egr-valve-cleaning' },
  { label: 'Carbon removal — intake manifold (diesel)', intervalKm: 100000, applies: ['4M41'], guideSlug: '4m41-carbon-removal' },
  // 120,000 km
  { label: 'Automatic transmission fluid full flush', intervalKm: 120000, applies: ['both'], guideSlug: 'v5awf-atf-change' },
  { label: 'Full coolant flush', intervalKm: 120000, applies: ['both'], guideSlug: 'coolant-flush' },
];

type Status = 'overdue' | 'due' | 'soon' | 'ok';

interface TrackedItem extends ServiceItem {
  lastDoneAt: number;
  nextDueAt: number;
  remaining: number;
  status: Status;
}

function getStatus(remaining: number): Status {
  if (remaining <= 0) return 'overdue';
  if (remaining <= 2000) return 'due';
  if (remaining <= 10000) return 'soon';
  return 'ok';
}

const STATUS_LABELS: Record<Status, string> = {
  overdue: 'Overdue',
  due: 'Due now',
  soon: 'Coming up',
  ok: 'OK',
};

const BASE = '/elsewhere/workshop/guides/';

export default function MaintenanceTracker() {
  const [mileage, setMileage] = useState('');
  const [lastService, setLastService] = useState('');
  const [engine, setEngine] = useState<'4M41' | '6G75' | ''>('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    try {
      const garage = JSON.parse(localStorage.getItem('elsewhere.garage') || 'null');
      if (garage?.engine === '4M41' || garage?.engine === '6G75') {
        setEngine(garage.engine);
      }
      const saved = JSON.parse(localStorage.getItem('elsewhere.maintenance') || 'null');
      if (saved?.mileage) setMileage(String(saved.mileage));
      if (saved?.lastService) setLastService(String(saved.lastService));
    } catch (_) {}
  }, []);

  function save() {
    try {
      localStorage.setItem('elsewhere.maintenance', JSON.stringify({
        mileage: parseInt(mileage) || 0,
        lastService: parseInt(lastService) || 0,
      }));
    } catch (_) {}
    setApplied(true);
  }

  const currentMileage = parseInt(mileage) || 0;
  const lastServiceMileage = parseInt(lastService) || 0;

  const relevantItems = SERVICE_ITEMS.filter((item) => {
    if (!engine) return true;
    return item.applies.includes('both' as never) || item.applies.includes(engine);
  });

  const tracked: TrackedItem[] = relevantItems.map((item) => {
    const completedCycles = Math.floor(lastServiceMileage / item.intervalKm);
    const lastDoneAt = completedCycles * item.intervalKm;
    const nextDueAt = (completedCycles + 1) * item.intervalKm;
    const remaining = nextDueAt - currentMileage;
    return { ...item, lastDoneAt, nextDueAt, remaining, status: getStatus(remaining) };
  });

  const overdue = tracked.filter((i) => i.status === 'overdue');
  const due = tracked.filter((i) => i.status === 'due');
  const soon = tracked.filter((i) => i.status === 'soon');
  const ok = tracked.filter((i) => i.status === 'ok');

  return (
    <div class="tracker">
      <div class="tracker-inputs">
        <div class="input-group">
          <label htmlFor="current-mileage">Current odometer (km)</label>
          <input
            id="current-mileage"
            type="number"
            class="tracker-input"
            placeholder="e.g. 142000"
            value={mileage}
            onInput={(e) => { setMileage((e.target as HTMLInputElement).value); setApplied(false); }}
          />
        </div>
        <div class="input-group">
          <label htmlFor="last-service">Last full service at (km)</label>
          <input
            id="last-service"
            type="number"
            class="tracker-input"
            placeholder="e.g. 140000"
            value={lastService}
            onInput={(e) => { setLastService((e.target as HTMLInputElement).value); setApplied(false); }}
          />
        </div>
        <div class="input-group">
          <label htmlFor="engine-select">Engine</label>
          <select
            id="engine-select"
            class="tracker-input tracker-select"
            value={engine}
            onChange={(e) => setEngine((e.target as HTMLSelectElement).value as '4M41' | '6G75' | '')}
          >
            <option value="">Both / Unknown</option>
            <option value="4M41">4M41 (3.2L Diesel)</option>
            <option value="6G75">6G75 (3.8L Petrol)</option>
          </select>
        </div>
        <button class="tracker-btn" type="button" onClick={save} disabled={!mileage}>
          Show what's due
        </button>
      </div>

      {applied && currentMileage > 0 && (
        <div class="tracker-results">
          {overdue.length > 0 && (
            <div class="result-group">
              <h3 class="result-heading result-overdue">Overdue ({overdue.length})</h3>
              <ul class="result-list">
                {overdue.map((item) => (
                  <ServiceRow key={item.label} item={item} />
                ))}
              </ul>
            </div>
          )}
          {due.length > 0 && (
            <div class="result-group">
              <h3 class="result-heading result-due">Due now ({due.length})</h3>
              <ul class="result-list">
                {due.map((item) => (
                  <ServiceRow key={item.label} item={item} />
                ))}
              </ul>
            </div>
          )}
          {soon.length > 0 && (
            <div class="result-group">
              <h3 class="result-heading result-soon">Coming up within 10,000 km ({soon.length})</h3>
              <ul class="result-list">
                {soon.map((item) => (
                  <ServiceRow key={item.label} item={item} />
                ))}
              </ul>
            </div>
          )}
          {ok.length > 0 && (
            <details class="ok-details">
              <summary class="ok-summary">All other items OK ({ok.length})</summary>
              <ul class="result-list">
                {ok.map((item) => (
                  <ServiceRow key={item.label} item={item} />
                ))}
              </ul>
            </details>
          )}
          {overdue.length === 0 && due.length === 0 && soon.length === 0 && (
            <p class="all-ok">Everything looks up to date. Next service items appear as you approach their interval.</p>
          )}
        </div>
      )}

      <style>{`
        .tracker { display: flex; flex-direction: column; gap: 24px; }

        .tracker-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 12px;
          align-items: end;
          padding: 20px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--bg-elev);
        }

        @media (max-width: 700px) {
          .tracker-inputs { grid-template-columns: 1fr 1fr; }
          .tracker-btn { grid-column: span 2; }
        }

        @media (max-width: 480px) {
          .tracker-inputs { grid-template-columns: 1fr; }
          .tracker-btn { grid-column: 1; }
        }

        .input-group { display: flex; flex-direction: column; gap: 6px; }

        .input-group label {
          font-size: 12px;
          font-weight: 500;
          color: var(--fg-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .tracker-input {
          padding: 9px 12px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--bg-sunken);
          color: var(--fg);
          font-size: 14px;
          font-family: inherit;
        }

        .tracker-input:focus {
          outline: none;
          border-color: var(--accent);
        }

        .tracker-select { appearance: auto; }

        .tracker-btn {
          padding: 9px 20px;
          border: 1px solid var(--accent);
          border-radius: var(--radius-sm);
          background: var(--accent);
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.12s;
          white-space: nowrap;
        }

        .tracker-btn:hover:not(:disabled) { opacity: 0.85; }
        .tracker-btn:disabled { opacity: 0.4; cursor: default; }

        .tracker-results { display: flex; flex-direction: column; gap: 20px; }

        .result-group { }

        .result-heading {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
          padding: 6px 10px;
          border-radius: 4px;
        }

        .result-overdue { background: oklch(0.8 0.12 10); color: oklch(0.3 0.1 10); }
        .result-due { background: oklch(0.82 0.12 70); color: oklch(0.35 0.1 70); }
        .result-soon { background: oklch(0.85 0.12 150); color: oklch(0.35 0.1 150); }

        .result-list {
          list-style: none;
          margin: 0;
          padding: 0;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .result-list li:not(:last-child) {
          border-bottom: 1px solid var(--border);
        }

        .ok-details summary { cursor: pointer; }

        .ok-summary {
          font-size: 13px;
          color: var(--fg-muted);
          padding: 8px 0;
          font-weight: 500;
          list-style: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ok-summary::before { content: '▶'; font-size: 9px; }
        details[open] .ok-summary::before { content: '▼'; }

        .ok-details .result-list { margin-top: 8px; }

        .all-ok {
          font-size: 14px;
          color: var(--fg-muted);
          padding: 20px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--bg-elev);
        }
      `}</style>
    </div>
  );
}

function ServiceRow({ item }: { item: TrackedItem }) {
  const isOk = item.status === 'ok';
  const kmText = item.remaining <= 0
    ? `${Math.abs(item.remaining).toLocaleString()} km overdue`
    : `in ${item.remaining.toLocaleString()} km (at ${item.nextDueAt.toLocaleString()} km)`;

  return (
    <li class={`service-row ${isOk ? 'row-ok' : ''}`}>
      <div class="row-main">
        {item.guideSlug ? (
          <a href={BASE + item.guideSlug} class="row-label">{item.label}</a>
        ) : (
          <span class="row-label">{item.label}</span>
        )}
        <span class={`status-dot dot-${item.status}`} title={STATUS_LABELS[item.status]} />
      </div>
      <span class="row-km">{kmText} · every {item.intervalKm.toLocaleString()} km</span>

      <style>{`
        .service-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 12px 16px;
          background: var(--bg-elev);
          transition: background 0.1s;
        }

        .service-row:hover { background: var(--bg-sunken); }

        .row-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .row-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--fg);
          text-decoration: none;
        }

        a.row-label:hover { color: var(--accent); text-decoration: underline; }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dot-overdue { background: oklch(0.55 0.2 10); }
        .dot-due { background: oklch(0.65 0.18 70); }
        .dot-soon { background: oklch(0.6 0.18 150); }
        .dot-ok { background: var(--border-strong); }

        .row-km {
          font-size: 12px;
          color: var(--fg-muted);
          font-family: 'Geist Mono', monospace;
        }

        .row-ok .row-label { color: var(--fg-muted); }
      `}</style>
    </li>
  );
}
