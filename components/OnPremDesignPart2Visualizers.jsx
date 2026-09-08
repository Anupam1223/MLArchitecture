import React, { useState, useEffect, useRef } from 'react';
import {
  HardDrive,
  Shield,
  Layers,
  Archive,
  Flame,
  Play,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

/* ── shared helpers ───────────────────────────────────────────────────────── */

function Tabs({ options, value, onChange, accent = 'bg-brand-blue' }) {
  return (
    <div className="flex justify-center gap-2 mb-3 flex-wrap">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            value === o.id ? `${accent} text-white` : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Meter({ label, value, unit, tone = 'bg-brand-blue' }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="font-mono text-white">{unit}</span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-900 overflow-hidden">
        <div
          className={`h-full ${tone} rounded-full transition-all duration-500`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function polyPath(pts) {
  return pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
}

function polyPoint(pts, t) {
  const segs = [];
  let total = 0;
  for (let i = 1; i < pts.length; i += 1) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    segs.push(d);
    total += d;
  }
  let target = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < segs.length; i += 1) {
    if (target <= segs[i] || i === segs.length - 1) {
      const r = segs[i] === 0 ? 0 : Math.min(1, target / segs[i]);
      return [
        pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r,
        pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r,
      ];
    }
    target -= segs[i];
  }
  return pts[pts.length - 1];
}

/* ── 1. Why the interconnect decides your step time ───────────────────────── */

const LINKS = [
  { id: 'p3', name: 'PCIe 3.0 x16', bw: 32, kind: 'pcie' },
  { id: 'p4', name: 'PCIe 4.0 x16', bw: 64, kind: 'pcie' },
  { id: 'p5', name: 'PCIe 5.0 x16', bw: 128, kind: 'pcie' },
  { id: 'n3', name: 'NVLink 3rd Gen', bw: 600, kind: 'nvlink' },
  { id: 'n4', name: 'NVLink 4th Gen', bw: 900, kind: 'nvlink' },
];

export function InterconnectImpactVisualizer() {
  const [link, setLink] = useState('p4');
  const [exchangeGB, setExchangeGB] = useState(28);

  const l = LINKS.find((x) => x.id === link);
  const tCompute = 250; // ms, held fixed
  const tComm = (exchangeGB / l.bw) * 1000;
  const tTotal = tCompute + tComm;
  const util = (tCompute / tTotal) * 100;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-white mb-1">
          The Interconnect Is Half of Your Step Time
        </h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Compute is fixed by your GPU. Everything else in the bar is the wire between them.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full rounded-xl border border-cyan-900/50 bg-gray-950 p-3 mb-4 text-center">
        <span className="font-serif italic text-slate-100">
          T<sub>total</sub> = T<sub>compute</sub> + T<sub>communication</sub>
        </span>
      </div>

      <Tabs
        value={link}
        onChange={setLink}
        accent={l.kind === 'nvlink' ? 'bg-brand-green' : 'bg-brand-blue'}
        options={LINKS.map((x) => ({ id: x.id, label: x.name }))}
      />

      <div className="max-w-2xl mx-auto w-full mb-3">
        <div className="h-12 rounded-lg overflow-hidden flex border border-gray-700">
          <div
            className="bg-brand-blue flex items-center justify-center transition-all duration-500"
            style={{ width: `${(tCompute / tTotal) * 100}%` }}
          >
            <span className="text-[10px] font-bold text-white px-1 truncate">
              compute {tCompute} ms
            </span>
          </div>
          <div
            className={`flex items-center justify-center transition-all duration-500 ${
              l.kind === 'nvlink' ? 'bg-brand-green' : 'bg-brand-rose'
            }`}
            style={{ width: `${(tComm / tTotal) * 100}%` }}
          >
            <span className="text-[10px] font-bold text-white px-1 truncate">
              comm {tComm.toFixed(0)} ms
            </span>
          </div>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
          <span>0 ms</span>
          <span className="text-white">step = {tTotal.toFixed(0)} ms</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 shrink-0 w-32">Data exchanged / step</span>
          <input
            type="range"
            min="2"
            max="60"
            value={exchangeGB}
            onChange={(e) => setExchangeGB(Number(e.target.value))}
            className="flex-1 accent-brand-purple"
          />
          <span className="font-mono text-xs text-white w-12 text-right">{exchangeGB} GB</span>
        </div>

        <Meter
          label="GPU utilisation (fraction of the step actually computing)"
          value={util}
          unit={`${util.toFixed(0)}%`}
          tone={util > 70 ? 'bg-brand-green' : util > 40 ? 'bg-brand-orange' : 'bg-brand-rose'}
        />
        <Meter
          label="Link bandwidth"
          value={(l.bw / 900) * 100}
          unit={`${l.bw} GB/s`}
          tone={l.kind === 'nvlink' ? 'bg-brand-green' : 'bg-brand-blue'}
        />
      </div>

      <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto">
        {util > 70 ? (
          <>
            <strong className="text-brand-green">Communication is nearly free.</strong> The GPUs
            spend their time computing, which is what you paid for.
          </>
        ) : (
          <>
            <strong className="text-brand-rose">The wire is now the job.</strong> Your expensive
            accelerators are idle for {(100 - util).toFixed(0)}% of every step, waiting on data.
          </>
        )}
      </p>
    </div>
  );
}

/* ── 2. The PCIe detour through the CPU ───────────────────────────────────── */

const DETOUR = [
  [70, 170],
  [70, 120],
  [200, 120],
  [200, 70],
  [200, 120],
  [330, 120],
  [330, 170],
];
const P2P = [
  [70, 170],
  [70, 120],
  [200, 120],
  [330, 120],
  [330, 170],
];

export function PcieDetourVisualizer() {
  const [p2p, setP2p] = useState(false);
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const raf = useRef(null);

  const pts = p2p ? P2P : DETOUR;
  const dur = p2p ? 1200 : 2200;

  useEffect(() => {
    if (!running) return undefined;
    const start = performance.now();
    const step = (now) => {
      const pct = (now - start) / dur;
      if (pct >= 1) {
        setT(1);
        setRunning(false);
        return;
      }
      setT(pct);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [running, dur]);

  const [px, py] = polyPoint(pts, t);
  const hops = p2p ? 2 : 4;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">GPU 1 → CPU → GPU 2</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          On a plain PCIe bus, two GPUs cannot talk to each other. They talk <em>through</em> the
          CPU.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full bg-gray-950 border border-gray-700 rounded-xl p-2 mb-3">
        <svg viewBox="0 0 400 220" className="w-full">
          {/* wires */}
          <path
            d={polyPath([
              [70, 170],
              [70, 120],
              [200, 120],
              [200, 70],
            ])}
            stroke="#334155"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={polyPath([
              [330, 170],
              [330, 120],
              [200, 120],
              [200, 70],
            ])}
            stroke="#334155"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />

          {/* active route */}
          <path
            d={polyPath(pts)}
            stroke={p2p ? '#f59e0b' : '#3b82f6'}
            strokeWidth="3"
            fill="none"
            strokeDasharray="8 8"
            className="animate-flow-dash"
            strokeLinecap="round"
          />

          {/* CPU */}
          <rect x="150" y="30" width="100" height="40" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          <text x="200" y="55" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="bold">
            CPU
          </text>

          {/* bus label */}
          <text x="200" y="112" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
            PCIe bus
          </text>

          {/* GPUs */}
          <rect x="20" y="170" width="100" height="40" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
          <text x="70" y="195" textAnchor="middle" fill="#93c5fd" fontSize="13" fontWeight="bold">
            GPU 1
          </text>
          <rect x="280" y="170" width="100" height="40" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
          <text x="330" y="195" textAnchor="middle" fill="#93c5fd" fontSize="13" fontWeight="bold">
            GPU 2
          </text>

          {/* packet */}
          {t > 0 && t < 1 && (
            <circle cx={px} cy={py} r="7" fill={p2p ? '#f59e0b' : '#60a5fa'}>
              <animate attributeName="r" values="6;8;6" dur="0.6s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>
      </div>

      <div className="max-w-2xl mx-auto w-full flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => {
            setT(0);
            setRunning(true);
          }}
          className="flex-1 py-2 rounded-lg bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" /> Send an update from GPU 1 to GPU 2
        </button>
        <button
          type="button"
          onClick={() => {
            setP2p((v) => !v);
            setT(0);
            setRunning(false);
          }}
          className={`px-3 py-2 rounded-lg text-xs font-bold border ${
            p2p
              ? 'bg-brand-orange border-brand-orange text-white'
              : 'bg-gray-800 border-gray-600 text-gray-400'
          }`}
        >
          PCIe P2P: {p2p ? 'on' : 'off'}
        </button>
      </div>

      <div className="max-w-2xl mx-auto w-full grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-lg border border-gray-700 bg-black/30 p-2 text-center">
          <div className="text-[10px] text-gray-500">Bus traversals</div>
          <div className="font-mono text-lg text-white">{hops}</div>
        </div>
        <div className="rounded-lg border border-gray-700 bg-black/30 p-2 text-center">
          <div className="text-[10px] text-gray-500">CPU involved</div>
          <div className={`font-mono text-lg ${p2p ? 'text-brand-green' : 'text-brand-rose'}`}>
            {p2p ? 'no' : 'yes'}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto">
        {p2p ? (
          <>
            <strong className="text-brand-orange">PCIe Peer-to-Peer</strong> can enable more direct
            transfers, but performance is inconsistent and depends heavily on the motherboard’s
            topology.
          </>
        ) : (
          <>
            The default path is{' '}
            <span className="font-mono text-xs text-white">
              GPU 1 → PCIe bus → CPU → PCIe bus → GPU 2
            </span>
            . This indirect route adds latency and consumes the limited PCIe bandwidth connected to
            the CPU.
          </>
        )}
      </p>
    </div>
  );
}

/* ── 3. PCIe bandwidth = lanes × generation ───────────────────────────────── */

const GENS = [
  { id: '3.0', perLane: 2 },
  { id: '4.0', perLane: 4 },
  { id: '5.0', perLane: 8 },
];
const LANES = [4, 8, 16];

export function PcieBandwidthVisualizer() {
  const [gen, setGen] = useState('4.0');
  const [lanes, setLanes] = useState(16);
  const [devices, setDevices] = useState(3);

  const g = GENS.find((x) => x.id === gen);
  const bw = g.perLane * lanes;
  const cpuBudget = 128;
  const demand = devices * bw;
  const saturated = demand > cpuBudget;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-white mb-1">Two Numbers Set PCIe Bandwidth</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          The generation sets the speed per lane. The slot sets how many lanes you get.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full bg-gray-800/80 border border-gray-600 rounded-xl p-4 text-center mb-4">
        <div className="text-sm text-gray-400 mb-2">Theoretical bidirectional bandwidth</div>
        <div className="text-lg md:text-xl font-mono flex items-center justify-center flex-wrap gap-2 text-white">
          <span className="bg-brand-purple/20 text-brand-purple px-2 py-1 rounded">
            x{lanes} lanes
          </span>
          ×
          <span className="bg-brand-blue/20 text-brand-blue px-2 py-1 rounded">
            {g.perLane} GB/s per lane (PCIe {gen})
          </span>
          =
          <span className="bg-brand-green/20 text-brand-green px-2 py-1 rounded font-bold">
            {bw} GB/s
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="block text-xs text-gray-400 mb-2">PCIe generation</span>
          <div className="flex gap-2">
            {GENS.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setGen(x.id)}
                className={`flex-1 py-1.5 text-xs rounded border ${
                  gen === x.id
                    ? 'bg-brand-blue border-brand-blue text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-400'
                }`}
              >
                {x.id}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="block text-xs text-gray-400 mb-2">Slot width</span>
          <div className="flex gap-2">
            {LANES.map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => setLanes(x)}
                className={`flex-1 py-1.5 text-xs rounded border ${
                  lanes === x
                    ? 'bg-brand-purple border-brand-purple text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-400'
                }`}
              >
                x{x}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* lane visual */}
      <div className="max-w-2xl mx-auto w-full mb-4">
        <div className="flex gap-1 h-10">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-all ${
                i < lanes ? 'bg-brand-purple' : 'bg-gray-800'
              }`}
              style={{ opacity: i < lanes ? 0.4 + (g.perLane / 8) * 0.6 : 1 }}
            />
          ))}
        </div>
        <div className="text-[10px] text-gray-500 text-center mt-1">
          16 physical lanes · brighter = faster generation
        </div>
      </div>

      {/* sharing */}
      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] text-gray-400 shrink-0">Devices at this width</span>
          <input
            type="range"
            min="1"
            max="6"
            value={devices}
            onChange={(e) => setDevices(Number(e.target.value))}
            className="flex-1 accent-brand-orange"
          />
          <span className="font-mono text-xs text-white w-4 text-right">{devices}</span>
        </div>
        <Meter
          label={`Demand vs the CPU's shared budget (${cpuBudget} GB/s)`}
          value={(demand / cpuBudget) * 100}
          unit={`${demand} GB/s`}
          tone={saturated ? 'bg-brand-rose' : 'bg-brand-green'}
        />
      </div>

      <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto">
        A PCIe 4.0 x16 slot offers 64 GB/s and PCIe 5.0 doubles that to 128 GB/s. Impressive — but
        that bandwidth is <strong className="text-white">shared among all devices</strong> connected
        to the CPU, and{' '}
        {saturated ? (
          <span className="text-brand-rose font-bold">
            at {devices} devices it is already saturated during intense multi-GPU sync.
          </span>
        ) : (
          <span>it saturates quickly during intense multi-GPU synchronization.</span>
        )}
      </p>
    </div>
  );
}

/* ── 4. PCIe path vs NVLink path ──────────────────────────────────────────── */

const PCIE_ROUTE = [
  [80, 150],
  [80, 105],
  [150, 105],
  [150, 60],
  [150, 105],
  [220, 105],
  [220, 150],
];
const NV_ROUTE = [
  [80, 172],
  [220, 172],
];

function RoutePanel({ title, tone, children }) {
  return (
    <div className={`flex-1 border-2 border-dashed rounded-xl p-2 ${tone}`}>
      <div className="text-[11px] text-center text-gray-300 font-semibold mb-1">{title}</div>
      {children}
    </div>
  );
}

export function NvlinkPathVisualizer() {
  const [t, setT] = useState({ pcie: 0, nv: 0 });
  const [running, setRunning] = useState(false);
  const raf = useRef(null);

  const PCIE_MS = 2600;
  const NV_MS = 620;

  useEffect(() => {
    if (!running) return undefined;
    const start = performance.now();
    const step = (now) => {
      const e = now - start;
      const p = Math.min(1, e / PCIE_MS);
      const n = Math.min(1, e / NV_MS);
      setT({ pcie: p, nv: n });
      if (p >= 1) {
        setRunning(false);
        return;
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [running]);

  const [ax, ay] = polyPoint(PCIE_ROUTE, t.pcie);
  const [bx, by] = polyPoint(NV_ROUTE, t.nv);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">A Private Highway Between GPUs</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Same two GPUs, same payload. One route goes through the CPU; the other does not.
        </p>
      </div>

      <div className="max-w-3xl mx-auto w-full flex gap-3 mb-3">
        <RoutePanel title="PCIe Communication Path" tone="border-gray-600 bg-gray-950/60">
          <svg viewBox="0 0 300 200" className="w-full">
            <path
              d={polyPath([
                [80, 150],
                [80, 105],
                [150, 105],
                [150, 60],
              ])}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
            />
            <path
              d={polyPath([
                [220, 150],
                [220, 105],
                [150, 105],
                [150, 60],
              ])}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
            />
            <text x="42" y="128" fill="#94a3b8" fontSize="9">
              PCIe x16
            </text>
            <text x="232" y="128" fill="#94a3b8" fontSize="9">
              PCIe x16
            </text>

            <rect x="110" y="25" width="80" height="35" rx="4" fill="#e5e7eb" stroke="#6b7280" />
            <text x="150" y="47" textAnchor="middle" fill="#111827" fontSize="12" fontWeight="600">
              CPU
            </text>

            <rect x="30" y="150" width="100" height="38" rx="4" fill="#e5e7eb" stroke="#6b7280" />
            <text x="80" y="174" textAnchor="middle" fill="#111827" fontSize="12" fontWeight="600">
              GPU1
            </text>
            <rect x="170" y="150" width="100" height="38" rx="4" fill="#e5e7eb" stroke="#6b7280" />
            <text x="220" y="174" textAnchor="middle" fill="#111827" fontSize="12" fontWeight="600">
              GPU2
            </text>

            {t.pcie > 0 && t.pcie < 1 && <circle cx={ax} cy={ay} r="6" fill="#2563eb" />}
          </svg>
        </RoutePanel>

        <RoutePanel title="NVLink Communication Path" tone="border-green-800 bg-green-950/20">
          <svg viewBox="0 0 300 200" className="w-full">
            <path
              d={polyPath([
                [80, 150],
                [80, 105],
                [150, 105],
                [150, 60],
              ])}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
            />
            <path
              d={polyPath([
                [220, 150],
                [220, 105],
                [150, 105],
                [150, 60],
              ])}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
            />
            <text x="42" y="128" fill="#94a3b8" fontSize="9">
              PCIe x16
            </text>
            <text x="232" y="128" fill="#94a3b8" fontSize="9">
              PCIe x16
            </text>

            <rect x="110" y="25" width="80" height="35" rx="4" fill="#e5e7eb" stroke="#6b7280" />
            <text x="150" y="47" textAnchor="middle" fill="#111827" fontSize="12" fontWeight="600">
              CPU
            </text>

            <rect x="30" y="150" width="100" height="38" rx="4" fill="#e5e7eb" stroke="#6b7280" />
            <text x="80" y="170" textAnchor="middle" fill="#111827" fontSize="12" fontWeight="600">
              GPU3
            </text>
            <rect x="170" y="150" width="100" height="38" rx="4" fill="#e5e7eb" stroke="#6b7280" />
            <text x="220" y="170" textAnchor="middle" fill="#111827" fontSize="12" fontWeight="600">
              GPU4
            </text>

            {/* NVLink bridge */}
            <path d="M 80 172 L 220 172" stroke="#22c55e" strokeWidth="4" fill="none" />
            <path d="M 88 166 L 80 172 L 88 178" stroke="#22c55e" strokeWidth="3" fill="none" />
            <path d="M 212 166 L 220 172 L 212 178" stroke="#22c55e" strokeWidth="3" fill="none" />

            {t.nv > 0 && t.nv < 1 && <circle cx={bx} cy={by} r="6" fill="#16a34a" />}
          </svg>
        </RoutePanel>
      </div>

      <div className="max-w-3xl mx-auto w-full flex gap-2 items-center mb-3">
        <button
          type="button"
          onClick={() => {
            setT({ pcie: 0, nv: 0 });
            setRunning(true);
          }}
          className="flex-1 py-2 rounded-lg bg-brand-green hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" /> Race the same gradient exchange
        </button>
        <div className="rounded-lg border border-gray-700 bg-black/40 px-3 py-2 font-mono text-[11px]">
          <span className="text-blue-400">PCIe {(t.pcie * PCIE_MS).toFixed(0)} ms</span>
          <span className="text-gray-600 mx-2">|</span>
          <span className="text-green-400">NVLink {(t.nv * NV_MS).toFixed(0)} ms</span>
        </div>
      </div>

      <p className="text-sm text-gray-300 text-center max-w-3xl mx-auto">
        In a PCIe-only setup, communication between GPUs is arbitrated by the CPU. With an{' '}
        <strong className="text-brand-green">NVLink bridge</strong>, GPUs gain a direct,
        high-bandwidth connection — which also frees the PCIe bus for the CPU and storage.
      </p>
    </div>
  );
}

/* ── 5. Bandwidth comparison chart ────────────────────────────────────────── */

const BW_BARS = [
  { name: 'PCIe 4.0 x16', v: 64, kind: 'pcie' },
  { name: 'PCIe 5.0 x16', v: 128, kind: 'pcie' },
  { name: 'NVLink (3rd Gen)', v: 600, kind: 'nv' },
  { name: 'NVLink (4th Gen)', v: 900, kind: 'nv' },
];

export function BandwidthChartVisualizer() {
  const [scale, setScale] = useState('linear');
  const [sel, setSel] = useState('NVLink (4th Gen)');

  const max = 950;
  const hOf = (v) =>
    scale === 'linear' ? (v / max) * 100 : (Math.log10(v) / Math.log10(max)) * 100;

  const picked = BW_BARS.find((b) => b.name === sel);
  const vsP5 = (picked.v / 128).toFixed(1);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">
          GPU Interconnect Bidirectional Bandwidth
        </h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          The difference between these technologies is not subtle.
        </p>
      </div>

      <Tabs
        value={scale}
        onChange={setScale}
        accent="bg-brand-purple"
        options={[
          { id: 'linear', label: 'Linear scale' },
          { id: 'log', label: 'Log scale' },
        ]}
      />

      <div className="max-w-2xl mx-auto w-full bg-white rounded-xl p-4 mb-3">
        <div className="text-center text-slate-800 text-sm font-semibold mb-3">
          Bandwidth (GB/s)
        </div>
        <div className="flex items-end gap-3 h-52 border-l border-b border-slate-300 pl-2 pb-0 relative">
          {scale === 'linear' &&
            [200, 400, 600, 800].map((tick) => (
              <div
                key={tick}
                className="absolute left-0 right-0 border-t border-slate-200 flex items-center"
                style={{ bottom: `${(tick / max) * 100}%` }}
              >
                <span className="text-[9px] text-slate-500 -ml-7 bg-white pr-1">{tick}</span>
              </div>
            ))}
          {BW_BARS.map((b) => (
            <button
              key={b.name}
              type="button"
              onClick={() => setSel(b.name)}
              className="flex-1 h-full flex flex-col justify-end items-center group relative z-10"
            >
              <span className="text-[10px] font-bold text-slate-700 mb-1">{b.v}</span>
              <div
                className={`w-full transition-all duration-500 ${
                  b.kind === 'nv' ? 'bg-emerald-500' : 'bg-sky-500'
                } ${sel === b.name ? 'ring-2 ring-offset-1 ring-slate-800' : 'opacity-85'}`}
                style={{ height: `${hOf(b.v)}%` }}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-3 mt-2 pl-2">
          {BW_BARS.map((b) => (
            <div key={b.name} className="flex-1 text-[9px] text-slate-600 text-center leading-tight">
              {b.name}
            </div>
          ))}
        </div>
        <div className="text-center text-[10px] text-slate-500 mt-2">Interconnect Technology</div>
      </div>

      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-center mb-3">
        <span className="text-white font-bold">{picked.name}</span>
        <span className="text-gray-500"> · </span>
        <span className="font-mono text-brand-green">{picked.v} GB/s</span>
        <span className="text-gray-500"> · </span>
        <span className="text-gray-300">{vsP5}× PCIe 5.0 x16</span>
      </div>

      <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto">
        The 900 GB/s of 4th generation NVLink (used with H100 GPUs) is over{' '}
        <strong className="text-white">7 times</strong> that of PCIe 5.0. Note these NVLink figures
        are for a fully-connected set of GPUs in a high-end node like an HGX system, using multiple
        links per GPU.
        {scale === 'linear' && (
          <span className="block text-xs text-gray-500 mt-2">
            On a linear axis the two PCIe bars are almost invisible — switch to log scale to see them
            properly.
          </span>
        )}
      </p>
    </div>
  );
}

/* ── 6. Is NVLink worth it? ───────────────────────────────────────────────── */

export function NvlinkDecisionVisualizer() {
  const [workload, setWorkload] = useState('single-model');
  const [count, setCount] = useState('multi');
  const [gpuClass, setGpuClass] = useState('datacenter');

  const blocked = gpuClass === 'consumer';
  const needed = workload === 'single-model';
  const specialPlatform = count === 'many';

  let verdict;
  if (blocked) {
    verdict = {
      tone: 'rose',
      title: 'NVLink is not available',
      body: 'NVLink is a feature of high-end, data-center-class NVIDIA GPUs like the A100 and H100 series. It is not available on most consumer-grade GeForce cards.',
    };
  } else if (needed) {
    verdict = {
      tone: 'green',
      title: 'NVLink is practically a necessity',
      body: `Accelerating a single large model across multiple GPUs means constant exchange. The gains from reducing T_communication will far outweigh the hardware cost by shortening training cycles and improving GPU utilisation.${
        specialPlatform
          ? ' With more than two GPUs you will need a specialised server platform, such as an NVIDIA-Certified System.'
          : ' With two GPUs, check that the motherboard spaces its PCIe slots correctly for the rigid bridge.'
      }`,
    };
  } else {
    verdict = {
      tone: 'orange',
      title: 'PCIe is the cost-effective choice',
      body: 'For single-GPU jobs or distributed tasks with very infrequent communication, the additional expense of NVLink may not be justified. A system with multiple PCIe 4.0 or 5.0 slots runs many independent experiments in parallel for less money.',
    };
  }

  const TONE = {
    green: 'border-brand-green bg-brand-green/10 text-brand-green',
    orange: 'border-brand-orange bg-brand-orange/10 text-brand-orange',
    rose: 'border-brand-rose bg-brand-rose/10 text-brand-rose',
  };

  const Q = ({ label, value, onChange, options }) => (
    <div>
      <span className="block text-[11px] text-gray-400 mb-1.5">{label}</span>
      <div className="flex gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`flex-1 py-2 px-2 text-[11px] rounded border leading-tight ${
              value === o.id
                ? 'bg-brand-blue border-brand-blue text-white'
                : 'bg-gray-800 border-gray-600 text-gray-400'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-white mb-1">Is NVLink Worth the Money?</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Balance upfront capital expenditure against the needs of your most demanding workload.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full space-y-3 mb-4">
        <Q
          label="Workload dependence — what are you mostly running?"
          value={workload}
          onChange={setWorkload}
          options={[
            { id: 'single-model', label: 'One large model across GPUs' },
            { id: 'independent', label: 'Many independent experiments' },
          ]}
        />
        <Q
          label="Requirement for scale — how many GPUs?"
          value={count}
          onChange={setCount}
          options={[
            { id: 'multi', label: '2 GPUs' },
            { id: 'many', label: 'More than 2' },
          ]}
        />
        <Q
          label="Hardware compatibility — which cards?"
          value={gpuClass}
          onChange={setGpuClass}
          options={[
            { id: 'datacenter', label: 'Data-center (A100 / H100)' },
            { id: 'consumer', label: 'Consumer GeForce' },
          ]}
        />
      </div>

      <div className={`max-w-2xl mx-auto w-full rounded-xl border-2 p-4 ${TONE[verdict.tone]}`}>
        <div className="font-bold mb-1 flex items-center gap-2">
          {verdict.tone === 'green' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          {verdict.title}
        </div>
        <p className="text-sm text-gray-300">{verdict.body}</p>
      </div>
    </div>
  );
}

/* ── 7. The shift to NVMe ─────────────────────────────────────────────────── */

const DRIVES = [
  { id: 'hdd', name: 'HDD (7200 RPM)', read: 150, tone: 'bg-gray-500', bar: '#6b7280' },
  { id: 'sata', name: 'SATA SSD', read: 550, tone: 'bg-brand-blue', bar: '#3b82f6' },
  { id: 'nvme', name: 'NVMe SSD (Gen4)', read: 7000, tone: 'bg-brand-green', bar: '#22c55e' },
];

export function NvmeShiftVisualizer() {
  const [datasetGB, setDatasetGB] = useState(100);

  const secondsFor = (mbps) => (datasetGB * 1024) / mbps;
  const fmt = (s) =>
    s > 90 ? `${(s / 60).toFixed(1)} min` : `${s.toFixed(0)} s`;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-white mb-1">The SATA Ceiling</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          SATA was designed for mechanical drives. NVMe rides the same PCIe bus as your GPUs.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full space-y-3 mb-4">
        {DRIVES.map((d) => {
          const s = secondsFor(d.read);
          return (
            <div key={d.id} className="rounded-xl border border-gray-700 bg-gray-950 p-3">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-bold text-white">{d.name}</span>
                <span className="font-mono text-xs text-gray-400">
                  ~{d.read.toLocaleString()} MB/s
                </span>
              </div>
              {/* pipe */}
              <div className="h-6 rounded-full bg-gray-900 border border-gray-700 overflow-hidden relative">
                <div
                  className={`h-full ${d.tone} relative overflow-hidden`}
                  style={{ width: `${(d.read / 7000) * 100}%` }}
                >
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(90deg, rgba(255,255,255,.9) 0 6px, transparent 6px 18px)',
                      animation: `dashFlow ${d.id === 'hdd' ? '3s' : d.id === 'sata' ? '1.4s' : '0.4s'} linear infinite`,
                    }}
                  />
                </div>
              </div>
              <div className="text-right text-[11px] font-mono mt-1 text-gray-300">
                {datasetGB} GB in <span className="text-white font-bold">{fmt(s)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-2xl mx-auto w-full flex items-center gap-3 mb-4">
        <span className="text-[10px] text-gray-400 shrink-0">Dataset to load</span>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={datasetGB}
          onChange={(e) => setDatasetGB(Number(e.target.value))}
          className="flex-1 accent-brand-green"
        />
        <span className="font-mono text-xs text-white w-14 text-right">{datasetGB} GB</span>
      </div>

      <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto">
        The SATA interface is limited to a theoretical maximum of about{' '}
        <strong className="text-white">600 MB/s</strong>. NVMe drives connect directly to the PCIe
        bus, slashing latency and opening a much wider pipe — a single PCIe 4.0 NVMe drive delivers
        over <strong className="text-brand-green">7,000 MB/s</strong>, more than ten times a SATA
        SSD.
      </p>
    </div>
  );
}

/* ── 8. Bandwidth vs IOPS vs latency ──────────────────────────────────────── */

const STORAGE_TABLE = [
  { metric: 'Sequential Read', hdd: '~150 MB/s', sata: '~550 MB/s', nvme: '~7,000 MB/s' },
  { metric: 'Sequential Write', hdd: '~120 MB/s', sata: '~520 MB/s', nvme: '~5,000 MB/s' },
  { metric: 'Random Read IOPS', hdd: '~100', sata: '~95,000', nvme: '~1,000,000' },
  { metric: 'Latency', hdd: '5-10 ms', sata: '70-100 µs', nvme: '< 20 µs' },
];

const JOBS = {
  checkpoint: {
    label: 'Load a 50 GB checkpoint',
    bound: 'Bandwidth-bound',
    // seconds
    times: { hdd: (50 * 1024) / 150, sata: (50 * 1024) / 550, nvme: (50 * 1024) / 7000 },
    note: 'One enormous sequential read. Only megabytes per second matter here — this is what "bandwidth" buys you.',
  },
  smallfiles: {
    label: 'Read 1,000,000 small files',
    bound: 'IOPS-bound',
    times: { hdd: 1000000 / 100, sata: 1000000 / 95000, nvme: 1000000 / 1000000 },
    note: 'A million separate operations. Sequential speed is irrelevant; the drive’s ability to service requests per second is everything.',
  },
};

export function StorageMetricsVisualizer() {
  const [job, setJob] = useState('smallfiles');
  const [run, setRun] = useState(0);

  const j = JOBS[job];
  const slowest = Math.max(...Object.values(j.times));

  const fmt = (s) => {
    if (s >= 3600) return `${(s / 3600).toFixed(1)} h`;
    if (s >= 90) return `${(s / 60).toFixed(1)} min`;
    if (s >= 1) return `${s.toFixed(1)} s`;
    return `${(s * 1000).toFixed(0)} ms`;
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Bandwidth Is Not Speed</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Two metrics matter when selecting drives, and different jobs care about different ones.
        </p>
      </div>

      {/* table */}
      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 overflow-hidden mb-4">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="text-left p-2 font-semibold">Storage Metric</th>
              <th className="text-left p-2 font-semibold">HDD (7200 RPM)</th>
              <th className="text-left p-2 font-semibold">SATA SSD</th>
              <th className="text-left p-2 font-semibold">NVMe SSD (Gen4)</th>
            </tr>
          </thead>
          <tbody>
            {STORAGE_TABLE.map((r, i) => {
              const highlight =
                (job === 'checkpoint' && r.metric === 'Sequential Read') ||
                (job === 'smallfiles' && r.metric === 'Random Read IOPS');
              return (
                <tr
                  key={r.metric}
                  className={`${i % 2 ? 'bg-gray-950' : 'bg-gray-900'} ${
                    highlight ? 'ring-1 ring-inset ring-brand-orange' : ''
                  }`}
                >
                  <td className="p-2 text-gray-300 font-medium">{r.metric}</td>
                  <td className="p-2 text-gray-500 font-mono">{r.hdd}</td>
                  <td className="p-2 text-gray-400 font-mono">{r.sata}</td>
                  <td className="p-2 text-brand-green font-mono font-bold">{r.nvme}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Tabs
        value={job}
        onChange={(v) => {
          setJob(v);
          setRun((r) => r + 1);
        }}
        accent="bg-brand-orange"
        options={Object.entries(JOBS).map(([id, v]) => ({ id, label: v.label }))}
      />

      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="text-[10px] uppercase tracking-wider text-brand-orange font-bold mb-2">
          {j.bound}
        </div>
        <div className="space-y-2">
          {DRIVES.map((d) => {
            const s = j.times[d.id];
            return (
              <div key={d.id}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-gray-400">{d.name}</span>
                  <span className="font-mono text-white">{fmt(s)}</span>
                </div>
                <div className="h-3 rounded-full bg-gray-900 overflow-hidden">
                  <div
                    key={`${run}-${d.id}`}
                    className={`h-full ${d.tone} rounded-full`}
                    style={{
                      width: `${(s / slowest) * 100}%`,
                      transition: 'width 900ms ease-out',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-[9px] text-gray-600 mt-2 text-right">longer bar = slower</div>
      </div>

      <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto">{j.note}</p>
    </div>
  );
}

/* ── 9. RAID 0 striping ───────────────────────────────────────────────────── */

const BLOCK_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export function Raid0Visualizer() {
  const [drives, setDrives] = useState(2);
  const [failed, setFailed] = useState(false);

  const perDrive = 7000;
  const total = drives * perDrive;
  const contents = Array.from({ length: drives }, (_, d) =>
    BLOCK_LETTERS.slice(0, 8).filter((_, i) => i % drives === d),
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">RAID 0: Striping for Speed</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          A file is broken into chunks and each chunk is written to a different drive
          simultaneously.
        </p>
      </div>

      {/* data blocks */}
      <div className="flex justify-center gap-1 mb-1">
        {BLOCK_LETTERS.slice(0, 4).map((b) => (
          <div
            key={b}
            className="w-8 h-8 rounded border border-slate-500 bg-slate-700 flex items-center justify-center text-xs font-bold text-white"
          >
            {b}
          </div>
        ))}
      </div>
      <div className="text-center text-gray-600 text-lg leading-none">↓</div>

      {/* controller */}
      <div className="flex justify-center mb-1">
        <div className="px-6 py-1.5 rounded-full bg-yellow-200 border border-yellow-400 text-yellow-950 text-xs font-bold">
          RAID Controller
        </div>
      </div>
      <div className="text-center text-gray-600 text-lg leading-none mb-1">↓</div>

      {/* drives */}
      <div className="flex justify-center gap-3 mb-4 flex-wrap">
        {contents.map((blocks, i) => (
          <div
            key={i}
            className={`w-28 rounded-xl border-2 p-3 text-center transition-colors ${
              failed
                ? 'border-rose-500 bg-rose-950/40'
                : 'border-sky-400 bg-sky-200/90'
            }`}
          >
            <HardDrive
              className={`w-5 h-5 mx-auto mb-1 ${failed ? 'text-rose-400' : 'text-sky-900'}`}
            />
            <div className={`text-[11px] font-bold ${failed ? 'text-rose-300' : 'text-sky-950'}`}>
              NVMe Drive {i + 1}
            </div>
            <div
              className={`text-[10px] font-mono ${failed ? 'text-rose-400' : 'text-sky-800'}`}
            >
              [{blocks.join(', ')}]
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto w-full flex items-center gap-3 mb-3">
        <span className="text-[10px] text-gray-400 shrink-0">Drives in array</span>
        <input
          type="range"
          min="2"
          max="6"
          value={drives}
          onChange={(e) => {
            setDrives(Number(e.target.value));
            setFailed(false);
          }}
          className="flex-1 accent-brand-green"
        />
        <span className="font-mono text-xs text-white w-4 text-right">{drives}</span>
      </div>

      <div className="max-w-2xl mx-auto w-full grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-lg border border-gray-700 bg-black/30 p-2 text-center">
          <div className="text-[10px] text-gray-500">Theoretical read speed</div>
          <div className="font-mono text-lg text-brand-green">
            {total.toLocaleString()} MB/s
          </div>
          <div className="text-[9px] text-gray-600">
            {drives} × {perDrive.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border border-gray-700 bg-black/30 p-2 text-center">
          <div className="text-[10px] text-gray-500">Usable capacity</div>
          <div className="font-mono text-lg text-white">100%</div>
          <div className="text-[9px] text-gray-600">no parity, no mirror</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setFailed((f) => !f)}
          className={`flex-1 py-2 rounded-lg text-xs font-bold ${
            failed ? 'bg-gray-700 text-gray-200' : 'bg-brand-rose text-white hover:bg-rose-600'
          }`}
        >
          {failed ? 'Replace the drive' : 'Fail one drive'}
        </button>
      </div>

      <p className="text-sm text-center max-w-2xl mx-auto">
        {failed ? (
          <span className="text-brand-rose font-bold flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> All data on the entire array is lost. Every file
            was split across every drive.
          </span>
        ) : (
          <span className="text-gray-300">
            Four NVMe drives at 7,000 MB/s each could theoretically approach{' '}
            <strong className="text-white">28,000 MB/s</strong>. The trade-off is zero redundancy,
            so RAID 0 belongs on scratch space that is backed up elsewhere or can be regenerated.
          </span>
        )}
      </p>
    </div>
  );
}

/* ── 10. RAID 10 stripe of mirrors ────────────────────────────────────────── */

export function Raid10Visualizer() {
  const [sets, setSets] = useState(2);
  const [down, setDown] = useState([]); // drive keys like "0-0"

  const toggle = (k) =>
    setDown((d) => (d.includes(k) ? d.filter((x) => x !== k) : [...d, k]));

  const setBlocks = (i) => BLOCK_LETTERS.slice(0, sets * 2).filter((_, k) => k % sets === i);

  // a set is lost only when BOTH of its drives are down
  const lostSets = Array.from({ length: sets }, (_, i) =>
    down.includes(`${i}-0`) && down.includes(`${i}-1`),
  );
  const arrayLost = lostSets.some(Boolean);

  const rawTB = sets * 2 * 2;
  const usableTB = rawTB / 2;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">
          RAID 10: Stripe of Mirrors
        </h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Mirror pairs first (RAID 1), then stripe across the pairs (RAID 0). Click any drive to
          fail it.
        </p>
      </div>

      <div className="flex justify-center mb-1">
        <div className="px-4 py-1.5 rounded bg-slate-700 border border-slate-500 text-xs font-bold text-white">
          Data (A, B, C, D)
        </div>
      </div>
      <div className="text-center text-gray-600 text-lg leading-none">↓</div>
      <div className="flex justify-center mb-1">
        <div className="px-6 py-1.5 rounded-full bg-yellow-200 border border-yellow-400 text-yellow-950 text-xs font-bold">
          RAID Controller
        </div>
      </div>
      <div className="text-center text-gray-600 text-lg leading-none mb-2">↓</div>

      <div className="flex justify-center gap-4 mb-4 flex-wrap">
        {Array.from({ length: sets }).map((_, i) => (
          <div
            key={i}
            className={`rounded-xl border p-2 ${
              lostSets[i] ? 'border-rose-500 bg-rose-950/30' : 'border-gray-600 bg-gray-950'
            }`}
          >
            <div className="text-[10px] text-gray-400 text-center mb-2">Mirror Set {i + 1}</div>
            <div className="flex flex-col items-center gap-1">
              {[0, 1].map((k) => {
                const key = `${i}-${k}`;
                const isDown = down.includes(key);
                return (
                  <React.Fragment key={key}>
                    {k === 1 && (
                      <div className="flex flex-col items-center">
                        <div className="h-4 border-l-2 border-dashed border-rose-500" />
                        <span className="text-[8px] text-rose-400">mirrored</span>
                        <div className="h-4 border-l-2 border-dashed border-rose-500" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      className={`w-24 rounded-lg border-2 py-2 text-center transition-colors ${
                        isDown
                          ? 'border-rose-600 bg-rose-950/60'
                          : 'border-emerald-400 bg-emerald-200/90'
                      }`}
                    >
                      <div
                        className={`text-[11px] font-bold ${
                          isDown ? 'text-rose-400 line-through' : 'text-emerald-950'
                        }`}
                      >
                        Drive {i * 2 + k + 1}
                      </div>
                      <div
                        className={`text-[10px] font-mono ${
                          isDown ? 'text-rose-500' : 'text-emerald-800'
                        }`}
                      >
                        [{setBlocks(i).join(', ')}]
                      </div>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto w-full flex items-center gap-3 mb-3">
        <span className="text-[10px] text-gray-400 shrink-0">Mirror sets</span>
        <input
          type="range"
          min="2"
          max="3"
          value={sets}
          onChange={(e) => {
            setSets(Number(e.target.value));
            setDown([]);
          }}
          className="flex-1 accent-brand-green"
        />
        <span className="font-mono text-xs text-white w-16 text-right">{sets * 2} drives</span>
      </div>

      <div className="max-w-2xl mx-auto w-full grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-lg border border-gray-700 bg-black/30 p-2 text-center">
          <div className="text-[10px] text-gray-500">Usable capacity</div>
          <div className="font-mono text-lg text-brand-orange">
            {usableTB} TB / {rawTB} TB
          </div>
          <div className="text-[9px] text-gray-600">only 50% of raw storage</div>
        </div>
        <div className="rounded-lg border border-gray-700 bg-black/30 p-2 text-center">
          <div className="text-[10px] text-gray-500">Array status</div>
          <div
            className={`font-mono text-lg ${arrayLost ? 'text-brand-rose' : 'text-brand-green'}`}
          >
            {arrayLost ? 'DATA LOST' : down.length ? 'degraded' : 'healthy'}
          </div>
          <div className="text-[9px] text-gray-600">{down.length} drive(s) down</div>
        </div>
      </div>

      <p className="text-sm text-center max-w-2xl mx-auto">
        {arrayLost ? (
          <span className="text-brand-rose font-bold flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Both halves of a mirror failed — that stripe is
            gone, and with it the array.
          </span>
        ) : down.length ? (
          <span className="text-brand-green font-bold flex items-center justify-center gap-1.5">
            <Shield className="w-4 h-4" /> Still running. If one drive in a mirrored pair fails, the
            system continues without data loss.
          </span>
        ) : (
          <span className="text-gray-300">
            You get the read performance of RAID 0 plus complete redundancy. The downside is cost:
            four 2 TB drives yield only <strong className="text-white">4 TB usable</strong>.
          </span>
        )}
      </p>
    </div>
  );
}

/* ── 11. The tiered storage strategy ──────────────────────────────────────── */

const TIER_HW = {
  os: {
    name: 'OS and System Drive',
    icon: Layers,
    accent: 'text-brand-blue',
    border: 'border-brand-blue',
    chip: 'bg-brand-blue',
    hardware: '1 × 1 TB NVMe, or 2 × SATA SSD in RAID 1',
    raid: 'RAID 1',
    capacityTB: 1,
    speed: 550,
    costPerTB: 90,
    holds: 'Operating system, drivers, CUDA, Python environments',
    priority: 'Reliability over raw speed — it never feeds the GPUs.',
  },
  hot: {
    name: 'High-Performance "Hot" Tier',
    icon: Flame,
    accent: 'text-brand-orange',
    border: 'border-brand-orange',
    chip: 'bg-brand-orange',
    hardware: '4 × 4 TB high-endurance NVMe SSD in RAID 0',
    raid: 'RAID 0',
    capacityTB: 16,
    speed: 28000,
    costPerTB: 80,
    holds: 'The active dataset and training scratch space',
    priority: 'No redundancy — everything here must be ephemeral or backed up.',
  },
  archive: {
    name: 'Warm / Cold Archive Tier',
    icon: Archive,
    accent: 'text-brand-purple',
    border: 'border-brand-purple',
    chip: 'bg-brand-purple',
    hardware: '8 × 16 TB HDD in RAID 6 on a NAS',
    raid: 'RAID 6',
    capacityTB: 96,
    speed: 900,
    costPerTB: 16,
    holds: 'Inactive projects, raw data, and backups',
    priority: 'Survives two drive failures; cheap enough to hold everything.',
  },
};

const MB_PER_TB = 1024 * 1024;

function fmtHours(h) {
  if (h < 1 / 60) return `${(h * 3600).toFixed(0)} s`;
  if (h < 1) return `${(h * 60).toFixed(0)} min`;
  if (h < 48) return `${h.toFixed(1)} h`;
  return `${(h / 24).toFixed(1)} days`;
}

export function TieredStorageVisualizer() {
  const [datasetTB, setDatasetTB] = useState(8);
  const [epochs, setEpochs] = useState(40);
  const [phase, setPhase] = useState('idle'); // idle | staging | training | done
  const [progress, setProgress] = useState(0);
  const [epochsRun, setEpochsRun] = useState(0);

  const hot = TIER_HW.hot;
  const archive = TIER_HW.archive;

  const stageHours = (datasetTB * MB_PER_TB) / archive.speed / 3600;
  const epochHotHours = (datasetTB * MB_PER_TB) / hot.speed / 3600;
  const epochArchiveHours = stageHours;

  const stagedTotal = stageHours + epochs * epochHotHours;
  const directTotal = epochs * epochArchiveHours;
  const saved = directTotal - stagedTotal;
  const speedup = directTotal / stagedTotal;

  const fits = datasetTB <= hot.capacityTB;

  // animation
  useEffect(() => {
    if (phase !== 'staging') return undefined;
    setProgress(0);
    const start = performance.now();
    const id = setInterval(() => {
      const pct = ((performance.now() - start) / 1800) * 100;
      if (pct >= 100) {
        setProgress(100);
        setPhase('training');
        clearInterval(id);
      } else setProgress(pct);
    }, 30);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'training') return undefined;
    setEpochsRun(0);
    const id = setInterval(() => {
      setEpochsRun((e) => {
        if (e + 1 >= epochs) {
          clearInterval(id);
          setPhase('done');
          return epochs;
        }
        return e + 1;
      });
    }, Math.max(30, 1600 / epochs));
    return () => clearInterval(id);
  }, [phase, epochs]);

  const reset = () => {
    setPhase('idle');
    setProgress(0);
    setEpochsRun(0);
  };

  const TierCard = ({ t, active, note }) => {
    const Icon = t.icon;
    return (
      <div
        className={`rounded-xl border-2 p-3 transition-all ${
          active ? `${t.border} bg-gray-900` : 'border-gray-700 bg-gray-950'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-7 h-7 rounded-lg ${t.chip} flex items-center justify-center shrink-0`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-white leading-tight">{t.name}</div>
            <div className="text-[10px] text-gray-500">{t.hardware}</div>
          </div>
          <span
            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-gray-600 ${t.accent}`}
          >
            {t.raid}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded bg-black/40 py-1">
            <div className="text-[9px] text-gray-500">usable</div>
            <div className="font-mono text-sm text-white">{t.capacityTB} TB</div>
          </div>
          <div className="rounded bg-black/40 py-1">
            <div className="text-[9px] text-gray-500">read</div>
            <div className={`font-mono text-sm ${t.accent}`}>
              {t.speed.toLocaleString()}
              <span className="text-[9px] text-gray-500"> MB/s</span>
            </div>
          </div>
          <div className="rounded bg-black/40 py-1">
            <div className="text-[9px] text-gray-500">cost</div>
            <div className="font-mono text-sm text-white">${t.costPerTB}<span className="text-[9px] text-gray-500">/TB</span></div>
          </div>
        </div>

        <div className="text-[11px] text-gray-400 mt-2">{t.holds}</div>
        {note && <div className={`text-[10px] mt-1 ${t.accent}`}>{note}</div>}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Three Tiers, One Data Path</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          The same 96 TB on NVMe would cost ${(96 * hot.costPerTB).toLocaleString()} instead of $
          {(96 * archive.costPerTB).toLocaleString()}. That is why you tier.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full space-y-2 mb-4">
        {/* GPU */}
        <div
          className={`rounded-xl border-2 p-2 text-center transition-all ${
            phase === 'training' || phase === 'done'
              ? 'border-brand-green bg-brand-green/10'
              : 'border-gray-700 bg-gray-950'
          }`}
        >
          <span className="text-sm font-bold text-white">GPUs</span>
          <span className="text-[11px] text-gray-400"> — need a batch every few milliseconds</span>
        </div>

        {/* hot <-> GPU link */}
        <div className="flex items-center justify-center gap-2 text-[10px]">
          <span className="text-gray-600">↑</span>
          <span
            className={
              phase === 'training' ? 'text-brand-green font-bold' : 'text-gray-600'
            }
          >
            read every epoch · {fmtHours(epochHotHours)} per pass
          </span>
          {phase === 'training' && (
            <span className="font-mono text-brand-green">
              epoch {epochsRun}/{epochs}
            </span>
          )}
        </div>

        <TierCard
          t={hot}
          active={phase === 'training' || phase === 'done' || phase === 'staging'}
          note={
            fits
              ? `Holds the ${datasetTB} TB working set with ${hot.capacityTB - datasetTB} TB to spare`
              : `${datasetTB} TB will NOT fit — shard the dataset or grow the array`
          }
        />

        {/* staging link */}
        <div className="px-2">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className={phase === 'staging' ? 'text-brand-purple font-bold' : 'text-gray-600'}>
              ↑ staged once before the job · {fmtHours(stageHours)}
            </span>
            <span className="font-mono text-gray-600">{archive.speed} MB/s</span>
          </div>
          <div className="h-2 rounded-full bg-gray-900 overflow-hidden">
            <div
              className="h-full bg-brand-purple rounded-full"
              style={{
                width: `${phase === 'idle' ? 0 : phase === 'staging' ? progress : 100}%`,
                transition: 'width 60ms linear',
              }}
            />
          </div>
        </div>

        <TierCard t={archive} active={phase === 'staging'} note="The persistent source of truth" />

        {/* OS drive, off the data path */}
        <div className="pt-1">
          <div className="text-[10px] text-gray-600 text-center mb-1">
            — not in the data path —
          </div>
          <TierCard t={TIER_HW.os} active={false} />
        </div>
      </div>

      {/* controls */}
      <div className="max-w-2xl mx-auto w-full grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 shrink-0">Dataset</span>
          <input
            type="range"
            min="1"
            max="24"
            value={datasetTB}
            onChange={(e) => {
              setDatasetTB(Number(e.target.value));
              reset();
            }}
            className="flex-1 accent-brand-orange"
          />
          <span className="font-mono text-xs text-white w-10 text-right">{datasetTB} TB</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 shrink-0">Epochs</span>
          <input
            type="range"
            min="1"
            max="100"
            value={epochs}
            onChange={(e) => {
              setEpochs(Number(e.target.value));
              reset();
            }}
            className="flex-1 accent-brand-green"
          />
          <span className="font-mono text-xs text-white w-8 text-right">{epochs}</span>
        </div>
      </div>

      {/* the payoff */}
      <div className="max-w-2xl mx-auto w-full grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-xl border border-brand-rose/60 bg-brand-rose/5 p-2.5 text-center">
          <div className="text-[10px] text-gray-400 mb-0.5">Train straight off the archive</div>
          <div className="font-mono text-lg text-brand-rose font-bold">
            {fmtHours(directTotal)}
          </div>
          <div className="text-[9px] text-gray-600">
            {epochs} × {fmtHours(epochArchiveHours)}
          </div>
        </div>
        <div className="rounded-xl border border-brand-green/60 bg-brand-green/5 p-2.5 text-center">
          <div className="text-[10px] text-gray-400 mb-0.5">Stage once, then train hot</div>
          <div className="font-mono text-lg text-brand-green font-bold">
            {fmtHours(stagedTotal)}
          </div>
          <div className="text-[9px] text-gray-600">
            {fmtHours(stageHours)} + {epochs} × {fmtHours(epochHotHours)}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setPhase('staging')}
          disabled={phase === 'staging' || phase === 'training'}
          className="flex-1 py-2 rounded-lg bg-brand-purple hover:bg-purple-600 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" />
          {phase === 'staging'
            ? 'Staging from archive…'
            : phase === 'training'
              ? `Training · epoch ${epochsRun}/${epochs}`
              : 'Run a training job'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
        >
          Reset
        </button>
      </div>

      <p className="text-sm text-center max-w-2xl mx-auto">
        {!fits ? (
          <span className="text-brand-rose flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> The working set exceeds the hot tier. This is
            exactly the number that tells you to add NVMe drives.
          </span>
        ) : epochs <= 1 ? (
          <span className="text-gray-300">
            At a single epoch, staging buys you almost nothing — you read the data once either way.
            The hot tier only pays off through <strong className="text-white">reuse</strong>.
          </span>
        ) : (
          <span className="text-gray-300">
            One slow copy from the archive, then {epochs} fast passes. That is{' '}
            <strong className="text-brand-green">{speedup.toFixed(1)}× faster</strong> and saves{' '}
            <strong className="text-white">{fmtHours(saved)}</strong> of GPUs sitting idle.
          </span>
        )}
      </p>
    </div>
  );
}


/* ── 12. Every RAID level side by side ────────────────────────────────────── */

const RAID_LEVELS = {
  '0': {
    label: 'RAID 0',
    nick: 'Striping',
    min: 2,
    max: 6,
    tolerate: 'none',
    usable: (n) => n,
    read: (n) => n,
    write: (n) => n,
    usedFor: 'The hot tier — training scratch space on NVMe.',
    idea: 'Every block goes to a different drive. Nothing is duplicated, so speed and capacity are maximal and a single failure destroys everything.',
  },
  '1': {
    label: 'RAID 1',
    nick: 'Mirroring',
    min: 2,
    max: 4,
    tolerate: 'all but one drive',
    usable: () => 1,
    read: (n) => n,
    write: () => 1,
    usedFor: 'The OS and system drive, where reliability beats raw speed.',
    idea: 'Every drive holds an identical copy. You only ever get the capacity of one drive, but the array survives until the last copy dies.',
  },
  '5': {
    label: 'RAID 5',
    nick: 'Striping + distributed parity',
    min: 3,
    max: 6,
    tolerate: 'any 1 drive',
    usable: (n) => n - 1,
    read: (n) => n - 1,
    write: (n) => Math.max(1, n / 4),
    usedFor: 'The warm/cold archive NAS — good capacity with one drive of protection.',
    idea: 'One drive per stripe stores a parity block instead of data. Lose any single drive and the missing block is recomputed from the survivors.',
  },
  '6': {
    label: 'RAID 6',
    nick: 'Double distributed parity',
    min: 4,
    max: 6,
    tolerate: 'any 2 drives',
    usable: (n) => n - 2,
    read: (n) => n - 2,
    write: (n) => Math.max(1, n / 6),
    usedFor: 'Large archives, where a second drive often fails during the long rebuild after the first.',
    idea: 'Two parity blocks per stripe (P and Q) instead of one. You sacrifice a second drive of capacity to survive a second failure.',
  },
  '10': {
    label: 'RAID 10',
    nick: 'Stripe of mirrors',
    min: 4,
    max: 6,
    tolerate: '1 per mirror pair',
    usable: (n) => n / 2,
    read: (n) => n,
    write: (n) => n / 2,
    usedFor: 'Valuable models and unique datasets needing speed and safety.',
    idea: 'Mirror pairs first, then stripe across the pairs. No parity maths, so writes stay fast — but you pay half your capacity for it.',
  },
};

const RAID_ORDER = ['0', '1', '5', '6', '10'];

function buildRaidLayout(level, n, stripes = 3) {
  const rows = [];
  let next = 0;
  const L = () => String.fromCharCode(65 + (next++ % 26));

  for (let s = 0; s < stripes; s += 1) {
    const row = new Array(n).fill(null);
    if (level === '0') {
      for (let d = 0; d < n; d += 1) row[d] = { t: 'data', v: L() };
    } else if (level === '1') {
      const v = L();
      for (let d = 0; d < n; d += 1) row[d] = { t: d === 0 ? 'data' : 'mirror', v };
    } else if (level === '5') {
      const p = (n - 1 - (s % n) + n) % n;
      for (let d = 0; d < n; d += 1) {
        row[d] = d === p ? { t: 'parity', v: `P${s + 1}` } : { t: 'data', v: L() };
      }
    } else if (level === '6') {
      const p = (n - 1 - (s % n) + n) % n;
      const q = (n - 2 - (s % n) + n) % n;
      for (let d = 0; d < n; d += 1) {
        if (d === p) row[d] = { t: 'parity', v: `P${s + 1}` };
        else if (d === q) row[d] = { t: 'parity2', v: `Q${s + 1}` };
        else row[d] = { t: 'data', v: L() };
      }
    } else {
      for (let d = 0; d < n; d += 2) {
        const v = L();
        row[d] = { t: 'data', v };
        row[d + 1] = { t: 'mirror', v };
      }
    }
    rows.push(row);
  }
  return rows;
}

const CELL_STYLE = {
  data: 'bg-sky-500/20 border-sky-500/60 text-sky-300',
  mirror: 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300',
  parity: 'bg-amber-500/20 border-amber-500/60 text-amber-300',
  parity2: 'bg-fuchsia-500/20 border-fuchsia-500/60 text-fuchsia-300',
};

const XOR_WORDS = ['1101', '0110', '0011'];
const xorAll = (words) =>
  words[0]
    .split('')
    .map((_, i) => words.reduce((acc, w) => acc ^ Number(w[i]), 0))
    .join('');

export function RaidLevelsVisualizer() {
  const [level, setLevel] = useState('5');
  const [drives, setDrives] = useState(4);
  const [failed, setFailed] = useState([]);

  const cfg = RAID_LEVELS[level];
  const n = Math.min(Math.max(drives, cfg.min), cfg.max);
  const nEven = level === '10' ? (n % 2 ? n - 1 : n) : n;

  const layout = buildRaidLayout(level, nEven);

  const pick = (lv) => {
    setLevel(lv);
    const c = RAID_LEVELS[lv];
    let d = Math.min(Math.max(drives, c.min), c.max);
    if (lv === '10' && d % 2) d -= 1;
    setDrives(d);
    setFailed([]);
  };

  const toggleDrive = (i) =>
    setFailed((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]));

  let lost = false;
  if (level === '0') lost = failed.length >= 1;
  else if (level === '1') lost = failed.length >= nEven;
  else if (level === '5') lost = failed.length >= 2;
  else if (level === '6') lost = failed.length >= 3;
  else {
    for (let p = 0; p < nEven; p += 2) {
      if (failed.includes(p) && failed.includes(p + 1)) lost = true;
    }
  }
  const degraded = !lost && failed.length > 0;

  const usable = cfg.usable(nEven);
  const parity = xorAll(XOR_WORDS);
  const missingIdx = 1;
  const recovered = xorAll([XOR_WORDS[0], XOR_WORDS[2], parity]);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The RAID Levels, Side by Side</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Every level trades the same three things against each other: speed, usable capacity, and
          how many drives may die.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-3 flex-wrap">
        {RAID_ORDER.map((lv) => (
          <button
            key={lv}
            type="button"
            onClick={() => pick(lv)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              level === lv ? 'bg-brand-purple text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {RAID_LEVELS[lv].label}
          </button>
        ))}
      </div>

      {/* drive grid */}
      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="text-[10px] text-gray-500 mb-2 text-center">
          {cfg.nick} · click a drive to fail it
        </div>
        <div className="flex gap-2">
          {Array.from({ length: nEven }).map((_, d) => {
            const isDown = failed.includes(d);
            return (
              <div key={d} className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleDrive(d)}
                  className={`w-full rounded-t-md border px-1 py-1 text-[9px] font-bold truncate transition-colors ${
                    isDown
                      ? 'bg-rose-950/70 border-rose-600 text-rose-400 line-through'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Drive {d + 1}
                </button>
                <div
                  className={`border border-t-0 rounded-b-md p-1 space-y-1 ${
                    isDown ? 'border-rose-700 bg-rose-950/20' : 'border-gray-700'
                  }`}
                >
                  {layout.map((row, s) => {
                    const cell = row[d];
                    return (
                      <div
                        key={s}
                        className={`rounded border text-[10px] font-mono text-center py-1 ${
                          isDown ? 'opacity-25 ' : ''
                        }${CELL_STYLE[cell.t]}`}
                      >
                        {cell.v}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-3 mt-2 text-[9px] text-gray-500 flex-wrap">
          <span className="text-sky-400">data</span>
          {(level === '1' || level === '10') && <span className="text-emerald-400">mirror copy</span>}
          {(level === '5' || level === '6') && <span className="text-amber-400">parity P</span>}
          {level === '6' && <span className="text-fuchsia-400">parity Q</span>}
        </div>
      </div>

      {/* status */}
      <div
        className={`max-w-2xl mx-auto w-full rounded-lg border p-2.5 mb-3 text-sm text-center ${
          lost
            ? 'border-brand-rose bg-brand-rose/10 text-brand-rose'
            : degraded
              ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
              : 'border-brand-green bg-brand-green/10 text-brand-green'
        }`}
      >
        {lost ? (
          <span className="flex items-center justify-center gap-1.5 font-bold">
            <AlertTriangle className="w-4 h-4" /> Array lost — {cfg.label} tolerates {cfg.tolerate}.
          </span>
        ) : degraded ? (
          <span className="flex items-center justify-center gap-1.5 font-bold">
            <Shield className="w-4 h-4" /> Degraded but running — every block is still recoverable.
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1.5 font-bold">
            <CheckCircle className="w-4 h-4" /> Healthy · tolerates {cfg.tolerate}
          </span>
        )}
      </div>

      {/* parity maths */}
      {(level === '5' || level === '6') && (
        <div className="max-w-2xl mx-auto w-full rounded-xl border border-amber-900/60 bg-gray-950 p-3 mb-3">
          <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold mb-2">
            What a parity block actually is
          </div>
          <div className="font-mono text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sky-300 w-6">A</span>
              <span className="text-white tracking-[0.3em]">{XOR_WORDS[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sky-300 w-6">B</span>
              <span className="text-white tracking-[0.3em]">{XOR_WORDS[1]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sky-300 w-6">C</span>
              <span className="text-white tracking-[0.3em]">{XOR_WORDS[2]}</span>
            </div>
            <div className="border-t border-gray-700 pt-1 flex items-center gap-2">
              <span className="text-amber-300 w-6">P</span>
              <span className="text-amber-300 tracking-[0.3em]">{parity}</span>
              <span className="text-gray-500 text-[10px]">= A ⊕ B ⊕ C</span>
            </div>
          </div>
          <div className="text-[11px] text-gray-400 mt-2">
            Lose drive <span className="text-white font-bold">B</span> and nothing is gone. XOR the
            survivors back together:
          </div>
          <div className="font-mono text-xs mt-1 flex items-center gap-2 flex-wrap">
            <span className="text-gray-400">A ⊕ C ⊕ P =</span>
            <span className="text-emerald-300 tracking-[0.3em]">{recovered}</span>
            <span className="text-gray-500">
              = B {recovered === XOR_WORDS[missingIdx] ? '✓' : ''}
            </span>
          </div>
          {level === '6' && (
            <div className="text-[11px] text-gray-400 mt-2">
              RAID 6 stores a second, independently computed block{' '}
              <span className="text-fuchsia-300 font-bold">Q</span> alongside P, which is what lets it
              solve for <em>two</em> unknown drives instead of one.
            </div>
          )}
        </div>
      )}

      {/* controls + meters */}
      <div className="max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="rounded-xl border border-gray-700 bg-gray-950 p-3 flex flex-col justify-center gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-400 shrink-0">Drives</span>
            <input
              type="range"
              min={cfg.min}
              max={cfg.max}
              step={level === '10' ? 2 : 1}
              value={nEven}
              onChange={(e) => {
                setDrives(Number(e.target.value));
                setFailed([]);
              }}
              className="flex-1 accent-brand-purple"
            />
            <span className="font-mono text-xs text-white w-4 text-right">{nEven}</span>
          </div>
          <div className="text-[10px] text-gray-500">
            Minimum for {cfg.label}: {cfg.min} drives
          </div>
          <button
            type="button"
            onClick={() => setFailed([])}
            className="py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold"
          >
            Replace all failed drives
          </button>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-950 p-3 space-y-2.5">
          <Meter
            label="Usable capacity"
            value={(usable / nEven) * 100}
            unit={`${usable} of ${nEven} drives`}
            tone="bg-brand-blue"
          />
          <Meter
            label="Read speed"
            value={(cfg.read(nEven) / nEven) * 100}
            unit={`~${cfg.read(nEven).toFixed(0)}× one drive`}
            tone="bg-brand-green"
          />
          <Meter
            label="Write speed"
            value={(cfg.write(nEven) / nEven) * 100}
            unit={`~${cfg.write(nEven).toFixed(1)}× one drive`}
            tone="bg-brand-orange"
          />
        </div>
      </div>

      <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto mb-2">{cfg.idea}</p>
      <p className="text-[11px] text-center max-w-2xl mx-auto text-gray-500">
        <span className="text-brand-purple font-bold">Used in this build for:</span> {cfg.usedFor}
      </p>
    </div>
  );
}
