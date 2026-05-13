import { useState } from "react";
import "./Measures.css";

type MicTone = "amethyst" | "fern" | "amber";
type RowKey = "gad" | "phq" | "qol";
type HoverStyle = "top-right" | "popover";

type DotData = {
  left: number;
  bottom: number;
  value: number;
  date: string;
};

type LayerKind = "area" | "trend" | "main";

type SvgLayer = {
  src: string;
  kind: LayerKind;
  left: number;
  bottom: number;
  width: number;
  height: number;
  flip?: boolean;
};

type HoveredDot = {
  row: RowKey;
  idx: number;
  dot: DotData;
};

type ChartRowProps = {
  rowKey: RowKey;
  name: string;
  current: number;
  total: number;
  badgeLabel: string;
  tone: MicTone;
  layers: SvgLayer[];
  endDot?: { src: string; left: number; bottom: number };
  dotSrc: string;
  dots: DotData[];
  currentPos: { left: number; bottom: number };
  hasTarget: boolean;
  hoverStyle: HoverStyle;
  hoveredDotIdx: number | null;
  onDotEnter: (row: RowKey, idx: number, dot: DotData) => void;
  onDotLeave: () => void;
  onTargetEnter: (row: RowKey) => void;
  onTargetLeave: () => void;
};

function ChartRow(props: ChartRowProps) {
  const {
    name,
    current,
    total,
    badgeLabel,
    tone,
    layers,
    endDot,
    dotSrc,
    dots,
    currentPos,
    hasTarget,
    hoverStyle,
    hoveredDotIdx,
    rowKey,
    onDotEnter,
    onDotLeave,
    onTargetEnter,
    onTargetLeave,
  } = props;

  const active = hoveredDotIdx !== null ? dots[hoveredDotIdx] : null;

  return (
    <div className={`chart-row ${tone}`} data-row={rowKey}>
      <div className="data">
        <div className="data-row">
          <span className="name">{name}</span>
          <span className="score">
            <span className="score-current">{current}</span>
            <span className="score-total">/{total}</span>
          </span>
        </div>
        <span className={`mic-badge ${tone}`}>
          <span className="dot" />
          <span className="label">{badgeLabel}</span>
        </span>
      </div>
      <div className="graph">
        <div className="svg-clip">
          {layers.map((layer, i) => (
            <img
              key={i}
              className={`layer layer-${layer.kind}`}
              src={layer.src}
              alt=""
              style={{
                left: `${layer.left}px`,
                bottom: `${layer.bottom}px`,
                width: `${layer.width}px`,
                height: `${layer.height}px`,
                transform: layer.flip ? "scaleX(-1)" : undefined,
              }}
            />
          ))}
          {endDot && (
            <img
              className="end-dot"
              src={endDot.src}
              alt=""
              style={{
                left: `${endDot.left}px`,
                bottom: `${endDot.bottom}px`,
              }}
            />
          )}
        </div>

        {hoverStyle === "top-right" && active && (
          <span className="date-label">{active.date}</span>
        )}

        {dots.map((d, i) => (
          <span
            key={i}
            className={`dot-marker ${tone} ${hoverStyle}`}
            style={{ left: `${d.left}px`, bottom: `${d.bottom}px` }}
            onMouseEnter={() => onDotEnter(rowKey, i, d)}
            onMouseLeave={onDotLeave}
          >
            <img className="dot-img" src={dotSrc} alt="" />
            {hoverStyle === "top-right" && (
              <span className="dot-pill">{d.value}</span>
            )}
          </span>
        ))}

        <span
          className={`score-pill ${tone} current`}
          style={{
            left: `${currentPos.left}px`,
            bottom: `${currentPos.bottom}px`,
          }}
        >
          {current}
        </span>

        {hasTarget && (
          <span
            className="target"
            onMouseEnter={() => onTargetEnter(rowKey)}
            onMouseLeave={onTargetLeave}
          >
            Target
          </span>
        )}
      </div>
    </div>
  );
}

const ROW_OFFSETS: Record<RowKey, number> = {
  gad: 0,
  phq: 74,
  qol: 148,
};

// Card-relative geometry (in px). Used to position the popover at the card
// level so it can extend beyond .progress-chart's overflow:hidden.
const CHART_TOP_IN_CARD = 58; // padding-top 20 + header 25 + gap 12 + border 1
const GRAPH_LEFT_IN_CARD = 156; // padding 20 + progress border 1 + data 134 + graph border 1
const POPOVER_GAP = 5;
const POPOVER_HEIGHT = 38;

type MeasuresProps = {
  hoverStyle?: HoverStyle;
};

export function Measures({ hoverStyle = "top-right" }: MeasuresProps) {
  const [hoveredTarget, setHoveredTarget] = useState<RowKey | null>(null);
  const [hoveredDot, setHoveredDot] = useState<HoveredDot | null>(null);

  const handleDotEnter = (row: RowKey, idx: number, dot: DotData) =>
    setHoveredDot({ row, idx, dot });
  const handleDotLeave = () => setHoveredDot(null);
  const idxForRow = (row: RowKey) =>
    hoveredDot?.row === row ? hoveredDot.idx : null;

  return (
    <div className="measures-card">
      <header className="measures-header">
        <h2 className="measures-title">Measures</h2>
        <a className="measures-latest" href="#">
          Latest from Apr 20, 2026
        </a>
      </header>

      <div className="progress-chart">
        <ChartRow
          rowKey="gad"
          name="GAD-7"
          current={10}
          total={27}
          badgeLabel="Mild"
          tone="amethyst"
          layers={[
            {
              src: "/assets/gad-area.svg",
              kind: "area",
              left: -1,
              bottom: 0,
              width: 203,
              height: 50,
            },
            {
              src: "/assets/gad-line.svg",
              kind: "trend",
              left: -1,
              bottom: 12,
              width: 216.5,
              height: 35.99,
            },
            {
              src: "/assets/gad-line2.svg",
              kind: "main",
              left: -0.5,
              bottom: 13.5,
              width: 195,
              height: 36,
            },
          ]}
          endDot={{ src: "/assets/gad-end-dot.svg", left: 213, bottom: 12 }}
          dotSrc="/assets/gad-dot.svg"
          dots={[
            { left: 3, bottom: 44, value: 14, date: "Dec 22" },
            { left: 30, bottom: 31, value: 12, date: "Jan 5" },
            { left: 57, bottom: 24, value: 11, date: "Jan 19" },
            { left: 84, bottom: 24, value: 11, date: "Feb 2" },
            { left: 111, bottom: 26, value: 11, date: "Feb 16" },
            { left: 138, bottom: 25, value: 11, date: "Mar 2" },
            { left: 165, bottom: 18, value: 10, date: "Mar 16" },
          ]}
          currentPos={{ left: 186, bottom: 6 }}
          hasTarget
          hoverStyle={hoverStyle}
          hoveredDotIdx={idxForRow("gad")}
          onDotEnter={handleDotEnter}
          onDotLeave={handleDotLeave}
          onTargetEnter={setHoveredTarget}
          onTargetLeave={() => setHoveredTarget(null)}
        />
        <ChartRow
          rowKey="phq"
          name="PHQ-9"
          current={5}
          total={27}
          badgeLabel="Mild"
          tone="fern"
          layers={[
            {
              src: "/assets/phq-area.svg",
              kind: "area",
              left: -1,
              bottom: 0,
              width: 203,
              height: 50,
            },
            {
              src: "/assets/phq-line.svg",
              kind: "trend",
              left: -1,
              bottom: 12,
              width: 216.5,
              height: 35.99,
            },
            {
              src: "/assets/phq-line2.svg",
              kind: "main",
              left: -0.5,
              bottom: 13.5,
              width: 195,
              height: 36,
            },
          ]}
          endDot={{ src: "/assets/phq-end-dot.svg", left: 213, bottom: 12 }}
          dotSrc="/assets/phq-dot.svg"
          dots={[
            { left: 3, bottom: 44, value: 10, date: "Dec 22" },
            { left: 30, bottom: 31, value: 8, date: "Jan 5" },
            { left: 57, bottom: 24, value: 7, date: "Jan 19" },
            { left: 84, bottom: 24, value: 7, date: "Feb 2" },
            { left: 111, bottom: 26, value: 7, date: "Feb 16" },
            { left: 138, bottom: 25, value: 6, date: "Mar 2" },
            { left: 165, bottom: 18, value: 5, date: "Mar 16" },
          ]}
          currentPos={{ left: 186, bottom: 6 }}
          hasTarget
          hoverStyle={hoverStyle}
          hoveredDotIdx={idxForRow("phq")}
          onDotEnter={handleDotEnter}
          onDotLeave={handleDotLeave}
          onTargetEnter={setHoveredTarget}
          onTargetLeave={() => setHoveredTarget(null)}
        />
        <ChartRow
          rowKey="qol"
          name="QoL"
          current={8}
          total={12}
          badgeLabel="Balanced"
          tone="amber"
          layers={[
            {
              src: "/assets/qol-area.svg",
              kind: "area",
              left: 0,
              bottom: 0,
              width: 198,
              height: 42,
              flip: true,
            },
            {
              src: "/assets/qol-line.svg",
              kind: "main",
              left: -1,
              bottom: 17,
              width: 187,
              height: 21.5,
              flip: true,
            },
          ]}
          dotSrc="/assets/qol-dot.svg"
          dots={[
            { left: 3, bottom: 19, value: 3, date: "Dec 22" },
            { left: 26, bottom: 19, value: 3, date: "Jan 5" },
            { left: 53, bottom: 17, value: 3, date: "Jan 19" },
            { left: 80, bottom: 17, value: 4, date: "Feb 2" },
            { left: 107, bottom: 19, value: 4, date: "Feb 16" },
            { left: 134, bottom: 25, value: 5, date: "Mar 2" },
            { left: 161, bottom: 31, value: 7, date: "Mar 16" },
          ]}
          currentPos={{ left: 182, bottom: 32 }}
          hasTarget={false}
          hoverStyle={hoverStyle}
          hoveredDotIdx={idxForRow("qol")}
          onDotEnter={handleDotEnter}
          onDotLeave={handleDotLeave}
          onTargetEnter={setHoveredTarget}
          onTargetLeave={() => setHoveredTarget(null)}
        />
      </div>

      {hoverStyle === "popover" && hoveredDot && (
        <div
          className="dot-popover"
          style={{
            left: `${GRAPH_LEFT_IN_CARD + hoveredDot.dot.left + 2.5}px`,
            top: `${
              CHART_TOP_IN_CARD +
              ROW_OFFSETS[hoveredDot.row] +
              (74 - hoveredDot.dot.bottom - 5) -
              POPOVER_GAP -
              POPOVER_HEIGHT
            }px`,
          }}
        >
          <span className="dot-popover-date">{hoveredDot.dot.date}</span>
          <span className="dot-popover-value">{hoveredDot.dot.value}</span>
        </div>
      )}

      {hoveredTarget && (
        <div
          className="target-tooltip"
          style={{ top: `${ROW_OFFSETS[hoveredTarget] + 132}px` }}
          onMouseEnter={() => setHoveredTarget(hoveredTarget)}
          onMouseLeave={() => setHoveredTarget(null)}
          role="tooltip"
        >
          <p className="title">Clinical progress target: 7</p>
          <p className="description">
            Average trend for Kaiser NCAL clients progressing with similar
            baseline.
          </p>
          <a className="link" href="#">
            Learn more
          </a>
        </div>
      )}

      <button className="kaiser-row" type="button">
        <span className="name">Kaiser NCAL metrics</span>
        <span className="pill">Measures: 85%</span>
        <span className="pill">On track</span>
        <span className="chevron">
          <img src="/assets/chevron.svg" alt="" />
        </span>
      </button>
    </div>
  );
}
