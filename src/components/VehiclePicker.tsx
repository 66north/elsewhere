import { useState, useEffect } from 'preact/hooks';

interface Garage {
  gen?: string;
  engine?: string;
  year?: number;
}

export default function VehiclePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [garage, setGarage] = useState<Garage | null>(null);
  const [selectedGen, setSelectedGen] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');

  // Load garage from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('elsewhere.garage');
      const data = stored ? JSON.parse(stored) : null;
      setGarage(data);
      if (data?.gen) setSelectedGen(data.gen);
      if (data?.engine) setSelectedEngine(data.engine);
    } catch (e) {
      // Silently fail
    }
  }, []);

  const handleSave = () => {
    const newGarage: Garage = {};
    if (selectedGen) newGarage.gen = selectedGen;
    if (selectedEngine) newGarage.engine = selectedEngine;

    try {
      localStorage.setItem('elsewhere.garage', JSON.stringify(newGarage));
      setGarage(newGarage);
      setIsOpen(false);

      // Dispatch custom event for other components to update
      window.dispatchEvent(
        new CustomEvent('elsewhere.garage.change', { detail: newGarage })
      );
    } catch (e) {
      // Silently fail
    }
  };

  const handleClear = () => {
    try {
      localStorage.removeItem('elsewhere.garage');
      setGarage(null);
      setSelectedGen('');
      setSelectedEngine('');

      window.dispatchEvent(
        new CustomEvent('elsewhere.garage.change', { detail: null })
      );
    } catch (e) {
      // Silently fail
    }
  };

  const displayLabel = garage?.gen ? `${garage.gen}${garage.engine ? ' · ' + garage.engine : ''}` : 'Pick vehicle';

  return (
    <>
      <button
        type="button"
        class="btn btn-sm vehicle-picker-btn"
        aria-label="Vehicle picker"
        onClick={() => setIsOpen(true)}
      >
        <span class="mono veh-label">My Garage</span>
        <span class="mono veh-value">{displayLabel}</span>
      </button>

      {isOpen && (
        <>
          <div class="modal-backdrop" onClick={() => setIsOpen(false)} />
          <dialog class="vehicle-picker-modal" open>
            <div class="modal-header">
              <h2>My Pajero</h2>
              <button
                type="button"
                class="btn btn-ghost btn-icon"
                aria-label="Close"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div class="modal-content">
              <div class="form-group">
                <label htmlFor="gen-select">Generation</label>
                <select
                  id="gen-select"
                  value={selectedGen}
                  onChange={(e) => setSelectedGen((e.target as HTMLSelectElement).value)}
                  class="input"
                >
                  <option value="">Select generation</option>
                  <option value="Gen 2">Gen 2 (1990–1999)</option>
                  <option value="Gen 3">Gen 3 (1999–2006)</option>
                  <option value="Gen 4">Gen 4 (2006–2015)</option>
                </select>
              </div>

              <div class="form-group">
                <label htmlFor="engine-select">Engine</label>
                <select
                  id="engine-select"
                  value={selectedEngine}
                  onChange={(e) => setSelectedEngine((e.target as HTMLSelectElement).value)}
                  class="input"
                >
                  <option value="">Select engine</option>
                  <option value="4M40">4M40 (2.5L Diesel)</option>
                  <option value="4M41">4M41 (3.2L Diesel)</option>
                  <option value="6G72">6G72 (3.0L Petrol)</option>
                  <option value="6G74">6G74 (3.5L Petrol)</option>
                  <option value="6G75">6G75 (3.8L Petrol)</option>
                </select>
              </div>

              <p class="modal-note">
                Your selection is saved locally and used to filter compatible guides.
              </p>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-ghost"
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </dialog>
        </>
      )}

      <style>{`
        .vehicle-picker-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .veh-label {
          font-size: 10px;
          opacity: 0.6;
        }

        .veh-value {
          font-size: 12px;
          font-weight: 500;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .vehicle-picker-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          width: 90%;
          max-width: 400px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--bg-elev);
          padding: 0;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          color: var(--fg);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid var(--border);
        }

        .modal-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .modal-content {
          padding: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .form-group:last-of-type {
          margin-bottom: 24px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 500;
          color: var(--fg);
        }

        .input {
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--bg-sunken);
          color: var(--fg);
          font-size: 14px;
          font-family: inherit;
        }

        .input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 2px var(--accent);
          opacity: 0.1;
        }

        .modal-note {
          font-size: 12px;
          color: var(--fg-muted);
          margin: 0;
          line-height: 1.5;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          padding: 16px 20px;
          border-top: 1px solid var(--border);
        }

        .btn-primary {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }

        .btn-primary:hover {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
}
