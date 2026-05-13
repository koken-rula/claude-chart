import { useState } from "react";
import { Measures } from "./Measures";

export function App() {
  const [showBase, setShowBase] = useState(true);

  return (
    <main className="page">
      <section className="card-stack">
        <h3 className="direction-label">Direction 1</h3>
        <Measures hoverStyle="top-right" />
      </section>

      <section className="card-stack">
        <h3 className="direction-label">Direction 2</h3>
        <Measures hoverStyle="popover" showBase={showBase} />
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={showBase}
            onChange={(e) => setShowBase(e.target.checked)}
          />
          <span className="toggle-switch" aria-hidden />
          <span className="toggle-label">Show base</span>
        </label>
      </section>
    </main>
  );
}
