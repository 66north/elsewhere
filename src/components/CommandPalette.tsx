import { useState, useEffect, useRef } from 'preact/hooks';

interface Guide {
  slug: string;
  title: string;
  category: string;
}

interface Command {
  id: string;
  title: string;
  category: string;
  action: () => void;
  icon?: string;
}

export default function CommandPalette({ guides }: { guides: Guide[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build command list from guides
  const commands: Command[] = [
    // Navigation
    { id: 'nav-home', title: 'Home', category: 'Navigation', action: () => navigate('/elsewhere') },
    {
      id: 'nav-workshop',
      title: 'Workshop',
      category: 'Navigation',
      action: () => navigate('/elsewhere/workshop'),
    },
    { id: 'nav-journal', title: 'Journal', category: 'Navigation', action: () => navigate('/elsewhere/journal') },
    { id: 'nav-build', title: 'The Build', category: 'Navigation', action: () => navigate('/elsewhere/build') },
    { id: 'nav-about', title: 'About', category: 'Navigation', action: () => navigate('/elsewhere/about') },

    // Guides
    ...guides.map((guide) => ({
      id: `guide-${guide.slug}`,
      title: guide.title,
      category: guide.category,
      action: () => navigate(`/elsewhere/workshop/guides/${guide.slug}`),
    })),
  ];

  // Filter commands based on query
  const filtered = query
    ? commands.filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(query.toLowerCase()) ||
          cmd.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands.slice(0, 8); // Show first 8 when empty

  // Reset selection when filtered results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to toggle palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
        setQuery('');
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }

      // Arrow keys for navigation
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % filtered.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filtered[selectedIndex]) {
            filtered[selectedIndex].action();
            setIsOpen(false);
            setQuery('');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Listen for palette.open event from search bar
  useEffect(() => {
    const handlePaletteOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener('elsewhere.palette.open', handlePaletteOpen);
    return () => window.removeEventListener('elsewhere.palette.open', handlePaletteOpen);
  }, []);

  const navigate = (path: string) => {
    window.location.href = path;
  };

  // Group commands by category
  const grouped = new Map<string, Command[]>();
  filtered.forEach((cmd) => {
    if (!grouped.has(cmd.category)) {
      grouped.set(cmd.category, []);
    }
    grouped.get(cmd.category)!.push(cmd);
  });

  return (
    <>
      {isOpen && (
        <>
          <div class="palette-backdrop" onClick={() => setIsOpen(false)} />
          <div class="command-palette">
            <div class="palette-input-wrap">
              <span class="palette-icon">⌘</span>
              <input
                ref={inputRef}
                type="text"
                class="palette-input"
                placeholder="Search guides, navigate..."
                value={query}
                onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
              />
            </div>

            {filtered.length > 0 ? (
              <div class="palette-results">
                {Array.from(grouped.entries()).map(([category, cmds], categoryIdx) => (
                  <div key={category}>
                    {categoryIdx > 0 && <div class="palette-divider" />}
                    <div class="palette-group">
                      <div class="palette-group-label">{category}</div>
                      {cmds.map((cmd, idx) => {
                        const globalIdx = filtered.findIndex((c) => c.id === cmd.id);
                        const isSelected = globalIdx === selectedIndex;

                        return (
                          <button
                            key={cmd.id}
                            class={`palette-item ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => {
                              cmd.action();
                              setIsOpen(false);
                              setQuery('');
                            }}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                          >
                            <div class="palette-item-content">
                              <span class="palette-item-title">{cmd.title}</span>
                              {category !== 'Navigation' && (
                                <span class="palette-item-meta">{cmd.category}</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div class="palette-empty">
                <p>No results found for "{query}"</p>
              </div>
            )}

            <div class="palette-footer">
              <span class="palette-hint">
                <kbd>↑↓</kbd> Navigate <kbd>Enter</kbd> Select <kbd>Esc</kbd> Close
              </span>
            </div>
          </div>
        </>
      )}

      <style>{`
        .palette-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1999;
        }

        .command-palette {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2000;
          width: 90%;
          max-width: 500px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--bg-elev);
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          max-height: 60vh;
        }

        .palette-input-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          background: var(--bg);
        }

        .palette-icon {
          font-size: 16px;
          color: var(--fg-muted);
          flex-shrink: 0;
        }

        .palette-input {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--fg);
          font-size: 16px;
          font-family: inherit;
          outline: none;
        }

        .palette-input::placeholder {
          color: var(--fg-muted);
        }

        .palette-results {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
        }

        .palette-group {
          padding: 8px 0;
        }

        .palette-group-label {
          padding: 0 16px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--fg-soft);
          margin: 8px 0 4px;
        }

        .palette-divider {
          height: 1px;
          background: var(--border);
          margin: 8px 0;
        }

        .palette-item {
          display: block;
          width: 100%;
          padding: 10px 16px;
          border: none;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s;
        }

        .palette-item:hover,
        .palette-item.is-selected {
          background: var(--bg-sunken);
        }

        .palette-item-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .palette-item-title {
          font-size: 14px;
          color: var(--fg);
        }

        .palette-item-meta {
          font-size: 11px;
          color: var(--fg-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        .palette-empty {
          padding: 40px 20px;
          text-align: center;
          color: var(--fg-muted);
          font-size: 14px;
        }

        .palette-footer {
          padding: 12px 16px;
          border-top: 1px solid var(--border);
          background: var(--bg-sunken);
          font-size: 11px;
          color: var(--fg-muted);
          display: flex;
          justify-content: flex-end;
        }

        .palette-hint {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        kbd {
          padding: 2px 6px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 3px;
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          font-weight: 500;
        }

        /* Scrollbar styling */
        .palette-results::-webkit-scrollbar {
          width: 6px;
        }
        .palette-results::-webkit-scrollbar-track {
          background: transparent;
        }
        .palette-results::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }
        .palette-results::-webkit-scrollbar-thumb:hover {
          background: var(--border-strong);
        }
      `}</style>
    </>
  );
}
