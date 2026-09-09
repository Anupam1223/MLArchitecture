import React, { useState, useEffect, useRef } from 'react';
import {
  Network,
  Server,
  Cpu,
  Zap,
  Wind,
  Snowflake,
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

function Stat({ label, value, sub, tone = 'text-white' }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-black/30 p-2 text-center">
      <div className="text-[9px] text-gray-500">{label}</div>
      <div className={`font-mono text-base font-bold ${tone}`}>{value}</div>
      {sub && <div className="text-[9px] text-gray-600">{sub}</div>}
    </div>
  );
}

const fmtTime = (s) => {
  if (s < 0.001) return `${(s * 1e6).toFixed(0)} µs`;
  if (s < 1) return `${(s * 1000).toFixed(1)} ms`;
  if (s < 90) return `${s.toFixed(1)} s`;
  if (s < 5400) return `${(s / 60).toFixed(1)} min`;
  return `${(s / 3600).toFixed(1)} h`;
};

/* ── 1. An under-provisioned network throttles the GPUs ───────────────────── */

const NET_SPEEDS = [
  { id: 1, name: '1 GbE', note: 'standard office network' },
  { id: 10, name: '10 GbE', note: 'entry server networking' },
  { id: 25, name: '25 GbE', note: 'where AI clusters start' },
  { id: 100, name: '100 GbE', note: 'common for AI fabrics' },
  { id: 400, name: '400 GbE', note: 'large-scale training' },
];

export function NetworkBottleneckVisualizer() {
  const [speed, setSpeed] = useState(25);
  const [nodes, setNodes] = useState(4);

  const s = NET_SPEEDS.find((x) => x.id === speed);
  const gbPerStep = 2; // gradients exchanged per node per step
  const tCompute = 0.25;
  const tComm = (gbPerStep * 8) / speed;
  const tTotal = tCompute + tComm;
  const util = (tCompute / tTotal) * 100;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">
          The Cluster Runs at the Speed of Its Network
        </h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          GPUs depend entirely on the network to receive data and coordinate with other nodes.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full rounded-xl border border-cyan-900/50 bg-gray-950 p-2.5 mb-3 text-center">
        <span className="font-serif italic text-slate-100 text-sm">
          T<sub>total</sub> = T<sub>compute</sub> + T<sub>communication</sub>
        </span>
      </div>

      <Tabs
        value={speed}
        onChange={setSpeed}
        accent={speed <= 10 ? 'bg-brand-rose' : 'bg-brand-green'}
        options={NET_SPEEDS.map((x) => ({ id: x.id, label: x.name }))}
      />

      {/* cluster */}
      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="flex justify-center gap-2 flex-wrap mb-2">
          {Array.from({ length: nodes }).map((_, i) => (
            <div
              key={i}
              className={`rounded-lg border px-3 py-2 text-center ${
                util > 60
                  ? 'border-brand-green bg-brand-green/10'
                  : 'border-brand-rose bg-brand-rose/10'
              }`}
            >
              <Server
                className={`w-4 h-4 mx-auto ${util > 60 ? 'text-brand-green' : 'text-brand-rose'}`}
              />
              <div className="text-[9px] text-gray-400 mt-0.5">node {i + 1}</div>
              <div
                className={`text-[9px] font-mono font-bold ${
                  util > 60 ? 'text-brand-green' : 'text-brand-rose'
                }`}
              >
                {util > 60 ? 'busy' : 'waiting'}
              </div>
            </div>
          ))}
        </div>
        <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full bg-brand-blue"
            style={{
              width: '100%',
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(255,255,255,.8) 0 4px, transparent 4px 14px)',
              animation: `dashFlow ${Math.max(0.2, 4 / Math.sqrt(speed))}s linear infinite`,
            }}
          />
        </div>
        <div className="text-[9px] text-gray-600 text-center mt-1">
          {s.name} fabric · {s.note}
        </div>
      </div>

      {/* step breakdown */}
      <div className="max-w-2xl mx-auto w-full mb-3">
        <div className="h-10 rounded-lg overflow-hidden flex border border-gray-700">
          <div
            className="bg-brand-blue flex items-center justify-center transition-all duration-500"
            style={{ width: `${(tCompute / tTotal) * 100}%` }}
          >
            <span className="text-[10px] font-bold text-white px-1 truncate">compute 250 ms</span>
          </div>
          <div
            className="bg-brand-rose flex items-center justify-center transition-all duration-500"
            style={{ width: `${(tComm / tTotal) * 100}%` }}
          >
            <span className="text-[10px] font-bold text-white px-1 truncate">
              network {fmtTime(tComm)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full flex items-center gap-3 mb-3">
        <span className="text-[10px] text-gray-400 shrink-0">Nodes</span>
        <input
          type="range"
          min="2"
          max="6"
          value={nodes}
          onChange={(e) => setNodes(Number(e.target.value))}
          className="flex-1 accent-brand-blue"
        />
        <span className="font-mono text-xs text-white w-4 text-right">{nodes}</span>
      </div>

      <div className="max-w-2xl mx-auto w-full mb-3">
        <Meter
          label="GPU utilisation"
          value={util}
          unit={`${util.toFixed(0)}%`}
          tone={util > 70 ? 'bg-brand-green' : util > 40 ? 'bg-brand-orange' : 'bg-brand-rose'}
        />
      </div>

      <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto">
        {speed === 1 ? (
          <>
            <strong className="text-brand-rose">A standard 1 Gbps office network is wholly
            insufficient.</strong> Your GPUs would spend {(100 - util).toFixed(0)}% of every step
            idle, waiting for gradients.
          </>
        ) : speed < 25 ? (
          <>Better, but modern AI clusters typically <strong className="text-white">start at 25 Gbps</strong> and frequently use 100 Gbps or faster.</>
        ) : (
          <>
            <strong className="text-brand-green">The network has stopped being the bottleneck.</strong>{' '}
            Minimising the communication term is a significant part of infrastructure design.
          </>
        )}
      </p>
    </div>
  );
}

/* ── 2. Bandwidth and latency are different problems ──────────────────────── */

export function BandwidthLatencyVisualizer() {
  const [bwGbps, setBwGbps] = useState(100);
  const [latencyUs, setLatencyUs] = useState(200);
  const [tick, setTick] = useState(0);

  // pipe geometry from the two independent knobs
  const lanes = Math.max(1, Math.min(8, Math.round(1 + (bwGbps / 400) * 7)));
  const pipeW = Math.round(90 + (latencyUs / 2000) * 210); // longer = higher latency
  const pipeH = Math.round(18 + lanes * 10); // wider = higher bandwidth
  const travelMs = Math.max(400, Math.min(3200, latencyUs * 2.2));

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 80);
    return () => clearInterval(id);
  }, []);

  const datasetGB = 500;
  const messages = 10000;
  const bulkSeconds = (datasetGB * 8) / bwGbps + (messages / 1000) * (latencyUs / 1e6);
  const syncSeconds = messages * (latencyUs / 1e6) + (0.02 * 8) / bwGbps;

  // animated packet positions along the pipe (0..1)
  const packetCols = Math.max(2, Math.ceil(pipeW / 36));
  const packets = [];
  for (let col = 0; col < packetCols; col += 1) {
    for (let lane = 0; lane < lanes; lane += 1) {
      const phase = ((tick * 80) / travelMs + col / packetCols + lane * 0.07) % 1;
      packets.push({ lane, phase, key: `${col}-${lane}` });
    }
  }

  const Dot = ({ className = 'w-2.5 h-2.5' }) => (
    <div className={`${className} rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.7)]`} />
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-yellow-300 mb-1">Latency vs. Bandwidth</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Think of the network as a pipe. <strong className="text-white">Width</strong> is how much
          data fits at once. <strong className="text-white">Length</strong> is how long one packet
          takes to arrive.
        </p>
      </div>

      {/* live interactive pipe */}
      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-[#0b1220] p-4 mb-3">
        <div className="flex items-center justify-center gap-3">
          {/* bandwidth (width) label */}
          <div className="flex flex-col items-center shrink-0 w-16">
            <span className="text-[9px] text-gray-300 text-center leading-tight mb-1">
              Bandwidth
              <br />
              <span className="text-sky-400">(rate)</span>
            </span>
            <div className="flex flex-col items-center text-white text-xs leading-none">
              <span>▲</span>
              <div
                className="w-0.5 bg-white/70 transition-all duration-300"
                style={{ height: `${Math.max(12, pipeH - 8)}px` }}
              />
              <span>▼</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center min-w-0">
            {/* latency (length) label */}
            <div className="flex items-center gap-1 mb-2 w-full justify-center">
              <span className="text-white text-xs">◀</span>
              <div
                className="h-0.5 bg-white/70 transition-all duration-300"
                style={{ width: `${Math.max(60, pipeW * 0.7)}px` }}
              />
              <span className="text-white text-xs">▶</span>
            </div>
            <div className="text-[9px] text-gray-300 mb-2">
              Latency <span className="text-yellow-300">(time)</span>
            </div>

            {/* the pipe */}
            <div className="flex items-center gap-2 w-full justify-center">
              <div
                className="relative rounded-md border-2 border-emerald-500 bg-yellow-400/90 overflow-hidden transition-all duration-300 shrink-0"
                style={{ width: `${pipeW}px`, height: `${pipeH}px`, maxWidth: '100%' }}
              >
                {packets.map((p) => (
                  <div
                    key={p.key}
                    className="absolute w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm"
                    style={{
                      left: `${p.phase * 92}%`,
                      top: `${((p.lane + 0.5) / lanes) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
              </div>
              <div
                className="transition-all duration-300 text-sky-400 leading-none"
                style={{
                  fontSize: `${Math.max(14, 10 + lanes * 3)}px`,
                  filter: 'drop-shadow(0 0 4px rgba(56,189,248,0.5))',
                }}
              >
                ▶
              </div>
            </div>

            <div className="flex gap-4 mt-2 text-[10px] font-mono">
              <span className="text-sky-400">{lanes} lane{lanes > 1 ? 's' : ''} · {bwGbps} Gbps</span>
              <span className="text-yellow-300">
                {latencyUs >= 1000 ? `${(latencyUs / 1000).toFixed(1)} ms` : `${latencyUs} µs`} travel
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* sliders */}
      <div className="max-w-2xl mx-auto w-full space-y-2.5 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-sky-400 shrink-0 w-24 font-bold">Bandwidth (width)</span>
          <input
            type="range"
            min="1"
            max="400"
            value={bwGbps}
            onChange={(e) => setBwGbps(Number(e.target.value))}
            className="flex-1 accent-sky-400"
          />
          <span className="font-mono text-xs text-white w-16 text-right">{bwGbps} Gbps</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-yellow-300 shrink-0 w-24 font-bold">Latency (length)</span>
          <input
            type="range"
            min="1"
            max="2000"
            value={latencyUs}
            onChange={(e) => setLatencyUs(Number(e.target.value))}
            className="flex-1 accent-yellow-400"
          />
          <span className="font-mono text-xs text-white w-16 text-right">
            {latencyUs >= 1000 ? `${(latencyUs / 1000).toFixed(1)} ms` : `${latencyUs} µs`}
          </span>
        </div>
      </div>

      {/* two textbook extremes from the reference figure */}
      <div className="max-w-2xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div className="rounded-xl border border-emerald-700/50 bg-[#0b1220] p-3">
          <div className="flex items-center justify-center gap-2 mb-2 h-16">
            <div className="relative w-16 h-14 rounded-md border-2 border-emerald-500 bg-yellow-400/90 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1.5"
                  style={{ top: `${6 + i * 11}%` }}
                >
                  <Dot className="w-2 h-2" />
                </div>
              ))}
            </div>
            <span className="text-3xl text-sky-400 leading-none">▶</span>
          </div>
          <div className="text-center text-[11px] font-bold text-white">Low Latency, High BW</div>
          <div className="text-center text-[10px] text-gray-400 mt-0.5">
            Short, fat pipe — many packets side-by-side, arrive fast
          </div>
        </div>

        <div className="rounded-xl border border-rose-800/40 bg-[#0b1220] p-3">
          <div className="flex items-center justify-center gap-2 mb-2 h-16">
            <svg viewBox="0 0 120 56" className="w-28 h-14">
              <path
                d="M 4 10 L 28 10 L 28 28 L 56 28 L 56 10 L 84 10 L 84 42 L 112 42"
                fill="none"
                stroke="#facc15"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="4" cy="10" r="4" fill="#38bdf8" />
              <path d="M 112 42 L 118 42" stroke="#38bdf8" strokeWidth="3" />
              <path d="M 114 38 L 120 42 L 114 46" fill="#38bdf8" />
            </svg>
          </div>
          <div className="text-center text-[11px] font-bold text-white">High Latency, Low BW</div>
          <div className="text-center text-[10px] text-gray-400 mt-0.5">
            Long, winding path — one packet, takes forever to arrive
          </div>
        </div>
      </div>

      {/* what each axis actually costs you */}
      <div className="max-w-2xl mx-auto w-full grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-xl border border-sky-700/50 bg-sky-950/30 p-2.5 text-center">
          <div className="text-[10px] text-gray-400">500 GB dataset transfer</div>
          <div className="font-mono text-lg text-white font-bold">{fmtTime(bulkSeconds)}</div>
          <div className="text-[9px] text-sky-400">driven by bandwidth (width)</div>
        </div>
        <div className="rounded-xl border border-yellow-700/50 bg-yellow-950/20 p-2.5 text-center">
          <div className="text-[10px] text-gray-400">10k gradient sync messages</div>
          <div className="font-mono text-lg text-white font-bold">{fmtTime(syncSeconds)}</div>
          <div className="text-[9px] text-yellow-300">driven by latency (length)</div>
        </div>
      </div>

      <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto">
        These are independent. A fat pipe still has high latency if it is long — and a short pipe
        still starves a bulk transfer if it is narrow. That is why AI clusters buy both: 100 Gbps{' '}
        <em>and</em> microsecond fabrics.
      </p>
    </div>
  );
}

/* ── 3. RDMA vs the TCP/IP stack ──────────────────────────────────────────── */

const TCP_STEPS = [
  { label: 'User Application (Server A)', kind: 'app' },
  { label: 'copy', kind: 'edge', cpu: 18 },
  { label: 'Kernel Buffer', kind: 'node' },
  { label: 'network transfer', kind: 'edge', cpu: 12 },
  { label: 'Kernel Buffer', kind: 'node' },
  { label: 'copy', kind: 'edge', cpu: 18 },
  { label: 'User Application (Server B)', kind: 'app' },
];

export function RdmaPathVisualizer() {
  const [step, setStep] = useState(-1);
  const [rdmaStep, setRdmaStep] = useState(-1);
  const timer = useRef(null);

  const run = () => {
    clearInterval(timer.current);
    setStep(0);
    setRdmaStep(0);
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      setStep(i);
      if (i === 1) setRdmaStep(1);
      if (i === 2) setRdmaStep(2);
      if (i >= TCP_STEPS.length - 1) clearInterval(timer.current);
    }, 550);
  };

  useEffect(() => () => clearInterval(timer.current), []);

  const cpuBurn = TCP_STEPS.slice(0, Math.max(0, step + 1)).reduce(
    (a, s) => a + (s.cpu || 0),
    0,
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">RDMA: Skipping the Kernel</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Same message, same two servers. One route copies it four times; the other never touches the
          CPU.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full flex gap-3 mb-3">
        {/* TCP/IP */}
        <div className="flex-1 rounded-xl border-2 border-rose-800/60 bg-rose-950/20 p-2">
          <div className="text-[11px] text-rose-300 text-center font-semibold mb-2">
            Standard TCP/IP Path
          </div>
          <div className="space-y-0.5">
            {TCP_STEPS.map((s, i) => {
              const active = step === i;
              const done = step > i;
              if (s.kind === 'edge') {
                return (
                  <div key={i} className="text-center">
                    <div
                      className={`text-[9px] ${
                        active ? 'text-rose-300 font-bold' : done ? 'text-gray-500' : 'text-gray-600'
                      }`}
                    >
                      ↓ {s.label}
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className={`rounded-full border text-center py-1.5 text-[10px] font-semibold transition-all ${
                    active
                      ? 'border-rose-400 bg-rose-400/30 text-white scale-105'
                      : done
                        ? 'border-rose-800 bg-rose-900/30 text-rose-300'
                        : 'border-gray-700 bg-gray-900 text-gray-500'
                  }`}
                >
                  {s.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* RDMA */}
        <div className="flex-1 rounded-xl border-2 border-green-800/60 bg-green-950/20 p-2 flex flex-col">
          <div className="text-[11px] text-green-300 text-center font-semibold mb-2">
            RDMA Path
          </div>
          <div className="space-y-0.5">
            <div
              className={`rounded-full border text-center py-1.5 text-[10px] font-semibold ${
                rdmaStep >= 0
                  ? 'border-green-400 bg-green-400/30 text-white'
                  : 'border-gray-700 bg-gray-900 text-gray-500'
              }`}
            >
              User Application (Server A)
            </div>
            <div
              className={`text-[9px] text-center ${
                rdmaStep === 1 ? 'text-green-300 font-bold' : 'text-gray-600'
              }`}
            >
              ↓ direct memory access
            </div>
            <div
              className={`rounded-full border text-center py-1.5 text-[10px] font-semibold ${
                rdmaStep >= 2
                  ? 'border-green-400 bg-green-400/30 text-white'
                  : 'border-gray-700 bg-gray-900 text-gray-500'
              }`}
            >
              User Application (Server B)
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-[10px] text-green-400/70 text-center px-2">
              no kernel buffers
              <br />
              no memory copies
              <br />
              no CPU involvement
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full grid grid-cols-2 gap-2 mb-3">
        <Stat
          label="CPU cycles burned (TCP/IP)"
          value={`${cpuBurn}%`}
          sub="copies + stack processing"
          tone="text-brand-rose"
        />
        <Stat label="CPU cycles burned (RDMA)" value="0%" sub="NIC writes memory directly" tone="text-brand-green" />
      </div>

      <button
        type="button"
        onClick={run}
        className="max-w-2xl mx-auto w-full py-2 rounded-lg bg-brand-green hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 mb-3"
      >
        <Play className="w-3.5 h-3.5" /> Send a message from Server A to Server B
      </button>

      <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto">
        RDMA lets the network interface card of one server access the main memory of another
        directly, without involving either operating system or CPU. It is a native feature of{' '}
        <strong className="text-white">InfiniBand</strong> and is also available over Ethernet
        through <strong className="text-white">RoCE</strong>.
      </p>
    </div>
  );
}

/* ── 4. Star vs leaf-spine topology ───────────────────────────────────────── */

export function TopologyVisualizer() {
  const [topo, setTopo] = useState('leaf');
  const [nodes, setNodes] = useState(4);
  const [spines, setSpines] = useState(2);
  const [failed, setFailed] = useState(false);

  const perNode = 100; // Gbps
  const switchCapacity = 400;
  const starDemand = nodes * perNode;
  const starOversub = starDemand > switchCapacity;
  const leafAggregate = spines * 2 * perNode;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Network Topologies</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          How you physically wire the switches decides both performance and what happens when one
          dies.
        </p>
      </div>

      <Tabs
        value={topo}
        onChange={(v) => {
          setTopo(v);
          setFailed(false);
        }}
        accent={topo === 'star' ? 'bg-brand-blue' : 'bg-brand-purple'}
        options={[
          { id: 'star', label: 'Star (small cluster)' },
          { id: 'leaf', label: 'Leaf-Spine (large cluster)' },
        ]}
      />

      <div className="max-w-2xl mx-auto w-full bg-white rounded-xl p-3 mb-3">
        {topo === 'star' ? (
          <svg viewBox="0 0 420 190" className="w-full">
            <text x="210" y="14" textAnchor="middle" fill="#1e40af" fontSize="11">
              Star Topology (Small Cluster)
            </text>
            {Array.from({ length: nodes }).map((_, i) => {
              const x = 40 + (i * 340) / Math.max(1, nodes - 1);
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={70}
                    x2={210}
                    y2={140}
                    stroke={failed ? '#dc2626' : '#334155'}
                    strokeWidth="1.5"
                    strokeDasharray={failed ? '4 4' : '0'}
                  />
                  <rect
                    x={x - 38}
                    y={40}
                    width="76"
                    height="30"
                    rx="14"
                    fill="#dbeafe"
                    stroke="#3b82f6"
                  />
                  <text x={x} y={59} textAnchor="middle" fill="#1e293b" fontSize="10">
                    GPU Node {i + 1}
                  </text>
                </g>
              );
            })}
            <rect
              x="145"
              y="140"
              width="130"
              height="32"
              rx="6"
              fill={failed ? '#fecaca' : '#dbeafe'}
              stroke={failed ? '#dc2626' : '#3b82f6'}
              strokeWidth="2"
            />
            <text x="210" y="160" textAnchor="middle" fill="#1e293b" fontSize="11">
              {failed ? 'Central Switch ✕' : 'Central Switch'}
            </text>
          </svg>
        ) : (
          <svg viewBox="0 0 420 210" className="w-full">
            <text x="210" y="14" textAnchor="middle" fill="#a21caf" fontSize="11">
              Leaf-Spine Topology (Large Cluster)
            </text>
            {/* spine to leaf links */}
            {Array.from({ length: spines }).map((_, sIdx) =>
              [0, 1].map((lIdx) => {
                const sx = 110 + (sIdx * 200) / Math.max(1, spines - 1 || 1);
                const lx = lIdx === 0 ? 120 : 300;
                const dead = failed && sIdx === 0;
                return (
                  <line
                    key={`${sIdx}-${lIdx}`}
                    x1={sx}
                    y1={58}
                    x2={lx}
                    y2={108}
                    stroke={dead ? '#dc2626' : '#334155'}
                    strokeWidth="1.5"
                    strokeDasharray={dead ? '4 4' : '0'}
                  />
                );
              }),
            )}
            {/* leaf to node */}
            {[0, 1].map((lIdx) =>
              [0, 1].map((nIdx) => {
                const lx = lIdx === 0 ? 120 : 300;
                const nx = 60 + lIdx * 180 + nIdx * 90;
                return (
                  <line
                    key={`n-${lIdx}-${nIdx}`}
                    x1={lx}
                    y1={130}
                    x2={nx}
                    y2={165}
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                );
              }),
            )}
            {/* spines */}
            {Array.from({ length: spines }).map((_, sIdx) => {
              const sx = 110 + (sIdx * 200) / Math.max(1, spines - 1 || 1);
              const dead = failed && sIdx === 0;
              return (
                <g key={sIdx}>
                  <rect
                    x={sx - 48}
                    y={30}
                    width="96"
                    height="28"
                    rx="6"
                    fill={dead ? '#fecaca' : '#f5d0fe'}
                    stroke={dead ? '#dc2626' : '#a21caf'}
                    strokeWidth={dead ? 2 : 1}
                  />
                  <text x={sx} y={48} textAnchor="middle" fill="#1e293b" fontSize="10">
                    Spine {sIdx + 1}
                    {dead ? ' ✕' : ''}
                  </text>
                </g>
              );
            })}
            {/* leaves */}
            {[0, 1].map((lIdx) => (
              <g key={lIdx}>
                <rect
                  x={(lIdx === 0 ? 120 : 300) - 48}
                  y={102}
                  width="96"
                  height="28"
                  rx="6"
                  fill="#ddd6fe"
                  stroke="#7c3aed"
                />
                <text
                  x={lIdx === 0 ? 120 : 300}
                  y={120}
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="10"
                >
                  Leaf Switch {lIdx + 1}
                </text>
              </g>
            ))}
            {/* nodes */}
            {[0, 1].map((lIdx) =>
              [0, 1].map((nIdx) => {
                const nx = 60 + lIdx * 180 + nIdx * 90;
                return (
                  <g key={`gn-${lIdx}-${nIdx}`}>
                    <rect
                      x={nx - 40}
                      y={165}
                      width="80"
                      height="28"
                      rx="6"
                      fill="#e5e7eb"
                      stroke="#6b7280"
                    />
                    <text x={nx} y={183} textAnchor="middle" fill="#1e293b" fontSize="9">
                      GPU Node {lIdx * 2 + nIdx + 1}
                    </text>
                  </g>
                );
              }),
            )}
          </svg>
        )}
      </div>

      {topo === 'star' ? (
        <>
          <div className="max-w-2xl mx-auto w-full flex items-center gap-3 mb-3">
            <span className="text-[10px] text-gray-400 shrink-0">Servers</span>
            <input
              type="range"
              min="2"
              max="6"
              value={nodes}
              onChange={(e) => setNodes(Number(e.target.value))}
              className="flex-1 accent-brand-blue"
            />
            <span className="font-mono text-xs text-white w-4 text-right">{nodes}</span>
          </div>
          <div className="max-w-2xl mx-auto w-full mb-3">
            <Meter
              label={`Central switch load (${switchCapacity} Gbps backplane)`}
              value={(starDemand / switchCapacity) * 100}
              unit={`${starDemand} Gbps`}
              tone={starOversub ? 'bg-brand-rose' : 'bg-brand-green'}
            />
          </div>
        </>
      ) : (
        <>
          <div className="max-w-2xl mx-auto w-full flex items-center gap-3 mb-3">
            <span className="text-[10px] text-gray-400 shrink-0">Spine switches</span>
            <input
              type="range"
              min="1"
              max="3"
              value={spines}
              onChange={(e) => setSpines(Number(e.target.value))}
              className="flex-1 accent-brand-purple"
            />
            <span className="font-mono text-xs text-white w-4 text-right">{spines}</span>
          </div>
          <div className="max-w-2xl mx-auto w-full grid grid-cols-2 gap-2 mb-3">
            <Stat
              label="Aggregate bandwidth"
              value={`${leafAggregate} Gbps`}
              sub="scales linearly with spines"
              tone="text-brand-purple"
            />
            <Stat label="Hops between any two nodes" value="leaf → spine → leaf" sub="predictable latency" />
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setFailed((f) => !f)}
        className={`max-w-2xl mx-auto w-full py-2 rounded-lg text-xs font-bold mb-3 ${
          failed ? 'bg-gray-700 text-gray-200' : 'bg-brand-rose text-white hover:bg-rose-600'
        }`}
      >
        {failed
          ? 'Restore the switch'
          : topo === 'star'
            ? 'Fail the central switch'
            : 'Fail Spine Switch 1'}
      </button>

      <p className="text-sm text-center max-w-2xl mx-auto">
        {topo === 'star' ? (
          failed ? (
            <span className="text-brand-rose font-bold flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> The entire cluster is down. The central switch is
              a single point of failure.
            </span>
          ) : (
            <span className="text-gray-300">
              For two to four servers, a star is often sufficient — every server connects to one
              high-performance switch. It is straightforward to manage, but that switch{' '}
              {starOversub ? (
                <strong className="text-brand-rose">is now a performance bottleneck</strong>
              ) : (
                'becomes a bottleneck as the cluster grows'
              )}
              .
            </span>
          )
        ) : failed ? (
          <span className="text-brand-green font-bold flex items-center justify-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> Still fully connected — traffic simply reroutes over
            the remaining spine. That is the point of multiple paths.
          </span>
        ) : (
          <span className="text-gray-300">
            Servers connect to leaf switches, and{' '}
            <strong className="text-white">every leaf connects to every spine</strong>. Traffic
            between any two nodes traverses exactly one leaf and one spine, giving predictable, low
            latency — and aggregate bandwidth scales linearly as you add spines.
          </span>
        )}
      </p>
    </div>
  );
}

/* ── 5. Planning the network: NICs, switches, cabling ─────────────────────── */

const NIC_OPTIONS = [
  { id: 25, label: '25 GbE' },
  { id: 100, label: '100 GbE' },
  { id: 400, label: '400 GbE' },
];

export function NetworkPlanningVisualizer() {
  const [nic, setNic] = useState(100);
  const [rdma, setRdma] = useState('roce');
  const [ports, setPorts] = useState(16);
  const [backplane, setBackplane] = useState(3200);
  const [metres, setMetres] = useState(3);

  const needed = ports * nic;
  const nonBlocking = backplane >= needed;
  const cable = metres <= 7 ? 'Direct Attach Copper (DAC)' : 'Fibre optic';

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">
          The Network Is a First-Class Component
        </h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Spec it alongside the CPU and GPU, not after them.
        </p>
      </div>

      {/* NIC */}
      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <Network className="w-4 h-4 text-brand-blue" />
          <span className="text-xs font-bold text-white">Network Interface Cards</span>
        </div>
        <div className="flex gap-2 mb-2">
          {NIC_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setNic(o.id)}
              className={`flex-1 py-1.5 text-xs rounded border ${
                nic === o.id
                  ? 'bg-brand-blue border-brand-blue text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-400'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {[
            { id: 'ib', label: 'InfiniBand' },
            { id: 'roce', label: 'RoCE' },
            { id: 'none', label: 'No RDMA' },
          ].map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setRdma(o.id)}
              className={`flex-1 py-1.5 text-[11px] rounded border ${
                rdma === o.id
                  ? o.id === 'none'
                    ? 'bg-brand-rose border-brand-rose text-white'
                    : 'bg-brand-green border-brand-green text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-400'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="text-[10px] mt-2">
          {rdma === 'none' ? (
            <span className="text-brand-rose">
              Without RDMA every transfer pays kernel copies and CPU time.
            </span>
          ) : (
            <span className="text-brand-green">
              RDMA supported — required for distributed training at speed.
            </span>
          )}
        </div>
      </div>

      {/* Switch */}
      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <Server className="w-4 h-4 text-brand-purple" />
          <span className="text-xs font-bold text-white">Switch</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] text-gray-400 shrink-0 w-16">Ports</span>
          <input
            type="range"
            min="4"
            max="48"
            step="4"
            value={ports}
            onChange={(e) => setPorts(Number(e.target.value))}
            className="flex-1 accent-brand-purple"
          />
          <span className="font-mono text-xs text-white w-6 text-right">{ports}</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] text-gray-400 shrink-0 w-16">Backplane</span>
          <input
            type="range"
            min="400"
            max="12800"
            step="400"
            value={backplane}
            onChange={(e) => setBackplane(Number(e.target.value))}
            className="flex-1 accent-brand-green"
          />
          <span className="font-mono text-xs text-white w-20 text-right">{backplane} Gbps</span>
        </div>
        <Meter
          label={`Line rate on all ports needs ${ports} × ${nic} = ${needed} Gbps`}
          value={(needed / backplane) * 100}
          unit={nonBlocking ? 'non-blocking' : 'oversubscribed'}
          tone={nonBlocking ? 'bg-brand-green' : 'bg-brand-rose'}
        />
      </div>

      {/* Cabling */}
      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-brand-orange" />
          <span className="text-xs font-bold text-white">Cabling</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 shrink-0 w-16">Run length</span>
          <input
            type="range"
            min="1"
            max="60"
            value={metres}
            onChange={(e) => setMetres(Number(e.target.value))}
            className="flex-1 accent-brand-orange"
          />
          <span className="font-mono text-xs text-white w-12 text-right">{metres} m</span>
        </div>
        <div className="text-[11px] mt-2 text-center">
          <span className="text-gray-400">Use </span>
          <span className="text-brand-orange font-bold">{cable}</span>
          <span className="text-gray-500">
            {' '}
            — {metres <= 7 ? 'short in-rack connection' : 'longer inter-rack run'}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto">
        A <strong className="text-white">non-blocking</strong> switch can handle traffic from all
        ports at line rate simultaneously without dropping packets.{' '}
        {nonBlocking
          ? 'This configuration can.'
          : 'This one cannot — under full load it will drop packets and stall your slowest worker.'}
      </p>
    </div>
  );
}

/* ── 6. Separation of storage and compute traffic ─────────────────────────── */

export function TrafficSeparationVisualizer() {
  const [mode, setMode] = useState('shared');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(Array(40).fill(20));

  useEffect(() => {
    const id = setInterval(() => {
      setHistory((h) => {
        const base = 20;
        const spike = loading && mode === 'shared' ? 70 + Math.random() * 25 : 0;
        const jitter = Math.random() * 6;
        return [...h.slice(1), base + spike + jitter];
      });
    }, 120);
    return () => clearInterval(id);
  }, [loading, mode]);

  const current = history[history.length - 1];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Keep Storage Off the Compute Fabric</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          A bulk dataset load and a latency-sensitive gradient exchange should not share a wire.
        </p>
      </div>

      <Tabs
        value={mode}
        onChange={setMode}
        accent={mode === 'shared' ? 'bg-brand-rose' : 'bg-brand-green'}
        options={[
          { id: 'shared', label: 'One shared network' },
          { id: 'separate', label: 'Two physical networks' },
          { id: 'vlan', label: 'VLAN segmentation' },
        ]}
      />

      {/* wiring */}
      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <div className="rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-center">
            <Server className="w-4 h-4 mx-auto text-gray-400" />
            <div className="text-gray-400 mt-0.5">Storage</div>
          </div>

          <div className="flex-1 space-y-1.5">
            <div>
              <div className="text-[9px] text-brand-blue mb-0.5">storage traffic (bulk)</div>
              <div className="h-2 rounded-full bg-gray-900 overflow-hidden">
                <div
                  className="h-full bg-brand-blue"
                  style={{
                    width: loading ? '100%' : '8%',
                    transition: 'width 400ms',
                  }}
                />
              </div>
            </div>
            <div>
              <div className="text-[9px] text-brand-purple mb-0.5">
                gradient traffic (latency-sensitive)
                {mode !== 'shared' && (
                  <span className="text-brand-green"> · isolated</span>
                )}
              </div>
              <div className="h-2 rounded-full bg-gray-900 overflow-hidden">
                <div
                  className={`h-full ${
                    loading && mode === 'shared' ? 'bg-brand-rose' : 'bg-brand-purple'
                  }`}
                  style={{ width: '35%', transition: 'width 400ms' }}
                />
              </div>
            </div>
            <div className="text-[9px] text-center text-gray-600">
              {mode === 'shared'
                ? 'one physical fabric carrying both'
                : mode === 'separate'
                  ? 'two separate physical fabrics'
                  : 'one fabric, logically segmented by VLAN'}
            </div>
          </div>

          <div className="rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-center">
            <Cpu className="w-4 h-4 mx-auto text-gray-400" />
            <div className="text-gray-400 mt-0.5">GPU nodes</div>
          </div>
        </div>
      </div>

      {/* latency graph */}
      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-gray-400">Gradient exchange latency</span>
          <span
            className={`font-mono font-bold ${
              current > 60 ? 'text-brand-rose' : 'text-brand-green'
            }`}
          >
            {current.toFixed(0)} µs
          </span>
        </div>
        <div className="flex items-end gap-px h-20">
          {history.map((v, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t ${v > 60 ? 'bg-brand-rose' : 'bg-brand-green'}`}
              style={{ height: `${Math.min(100, v)}%` }}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setLoading((l) => !l)}
        className={`max-w-2xl mx-auto w-full py-2 rounded-lg text-xs font-bold mb-3 ${
          loading ? 'bg-gray-700 text-gray-200' : 'bg-brand-blue text-white hover:bg-blue-600'
        }`}
      >
        {loading ? 'Stop the dataset load' : 'Start a large dataset load'}
      </button>

      <p className="text-sm text-center max-w-2xl mx-auto">
        {loading && mode === 'shared' ? (
          <span className="text-brand-rose flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> The bulk transfer is starving the gradient
            exchange. Every worker now waits on the slowest link.
          </span>
        ) : (
          <span className="text-gray-300">
            {mode === 'shared'
              ? 'Start the load and watch the latency trace. Large data-loading operations interfere with latency-sensitive gradient exchanges.'
              : mode === 'separate'
                ? 'Two separate physical networks — one for storage, one for the compute fabric. The gradient trace stays flat no matter what storage is doing.'
                : 'Where physical separation is not feasible, VLANs logically segment the traffic — a viable alternative that keeps the classes from colliding.'}
          </span>
        )}
      </p>
    </div>
  );
}

/* ── 7. Calculating power consumption ─────────────────────────────────────── */

const PSU_RATINGS = [
  { id: 0.8, label: '80 Plus (80%)' },
  { id: 0.9, label: 'Platinum (90%)' },
  { id: 0.94, label: 'Titanium (94%)' },
];

const POWER_PRESETS = [
  {
    id: 'article',
    label: 'Article example',
    note: '4× A100 + 2× EPYC',
    gpus: 4,
    gpuTdp: 400,
    cpus: 2,
    cpuTdp: 200,
    other: 200,
  },
  {
    id: 'dense',
    label: 'Dense node',
    note: '8× A100 + 2× EPYC',
    gpus: 8,
    gpuTdp: 400,
    cpus: 2,
    cpuTdp: 200,
    other: 250,
  },
  {
    id: 'single',
    label: 'Single GPU',
    note: '1× A100 workstation',
    gpus: 1,
    gpuTdp: 400,
    cpus: 1,
    cpuTdp: 200,
    other: 150,
  },
];

export function PowerBudgetVisualizer() {
  const [preset, setPreset] = useState('article');
  const [step, setStep] = useState(1); // 1 = sum TDPs, 2 = apply efficiency
  const [eff, setEff] = useState(0.9);

  const cfg = POWER_PRESETS.find((p) => p.id === preset);
  const gpuW = cfg.gpus * cfg.gpuTdp;
  const cpuW = cfg.cpus * cfg.cpuTdp;
  const other = cfg.other;
  const dc = gpuW + cpuW + other;
  const wall = Math.round(dc / eff);
  const lost = wall - dc;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Two Steps to Wall Power</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          First add up what the silicon needs (DC). Then account for the PSU waste to get what the
          wall must supply (AC).
        </p>
      </div>

      {/* step tabs — only two, calm */}
      <div className="max-w-xl mx-auto w-full flex gap-2 mb-4">
        {[
          { id: 1, label: '① Sum the TDPs' },
          { id: 2, label: '② Divide by PSU efficiency' },
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(s.id)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
              step === s.id
                ? 'bg-brand-orange border-brand-orange text-white'
                : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* preset picker — one choice, not five sliders */}
      <div className="max-w-xl mx-auto w-full mb-4">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1.5 text-center">
          Pick a server
        </div>
        <div className="flex gap-2">
          {POWER_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreset(p.id)}
              className={`flex-1 rounded-xl border px-2 py-2 text-center transition ${
                preset === p.id
                  ? 'border-sky-400 bg-sky-950/40'
                  : 'border-gray-700 bg-gray-950 hover:border-gray-500'
              }`}
            >
              <div className="text-[11px] font-bold text-white leading-tight">{p.label}</div>
              <div className="text-[9px] text-gray-500 mt-0.5">{p.note}</div>
            </button>
          ))}
        </div>
      </div>

      {step === 1 ? (
        <>
          {/* three contribution cards */}
          <div className="max-w-xl mx-auto w-full grid grid-cols-3 gap-2 mb-3">
            <div className="rounded-xl border border-sky-600/50 bg-sky-950/30 p-3 text-center">
              <div className="text-[10px] text-sky-400 font-bold mb-1">GPUs</div>
              <div className="font-mono text-xs text-gray-400">
                {cfg.gpus} × {cfg.gpuTdp}W
              </div>
              <div className="font-mono text-xl font-bold text-sky-300 mt-1">{gpuW}W</div>
              <div className="flex justify-center gap-0.5 mt-2 flex-wrap">
                {Array.from({ length: cfg.gpus }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-sm bg-sky-500" />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-fuchsia-600/50 bg-fuchsia-950/30 p-3 text-center">
              <div className="text-[10px] text-fuchsia-400 font-bold mb-1">CPUs</div>
              <div className="font-mono text-xs text-gray-400">
                {cfg.cpus} × {cfg.cpuTdp}W
              </div>
              <div className="font-mono text-xl font-bold text-fuchsia-300 mt-1">{cpuW}W</div>
              <div className="flex justify-center gap-0.5 mt-2">
                {Array.from({ length: cfg.cpus }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-sm bg-fuchsia-500" />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-amber-600/50 bg-amber-950/30 p-3 text-center">
              <div className="text-[10px] text-amber-400 font-bold mb-1">Rest</div>
              <div className="font-mono text-xs text-gray-400">board · RAM · fans</div>
              <div className="font-mono text-xl font-bold text-amber-300 mt-1">{other}W</div>
              <div className="text-[9px] text-gray-500 mt-2">fixed estimate</div>
            </div>
          </div>

          <div className="max-w-xl mx-auto w-full text-center text-gray-500 text-lg mb-1">+</div>

          <div className="max-w-xl mx-auto w-full rounded-xl border-2 border-white/20 bg-gray-950 p-4 text-center mb-3">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
              DC power the components need
            </div>
            <div className="font-mono text-3xl font-extrabold text-white">{dc} W</div>
            <div className="font-mono text-[11px] text-gray-500 mt-1">
              {gpuW} + {cpuW} + {other} = {dc}
            </div>
          </div>

          <p className="text-sm text-gray-300 text-center max-w-xl mx-auto mb-3">
            TDP is a reliable estimate for sustained load. For the article&apos;s common AI server
            that is{' '}
            <span className="font-mono text-white">
              4 × 400 + 2 × 200 + 200 = 2200 W
            </span>
            . This is still <em>not</em> what the wall must supply.
          </p>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="max-w-xl mx-auto w-full py-2.5 rounded-xl bg-brand-orange hover:bg-amber-600 text-white text-xs font-bold"
          >
            Next: account for PSU waste →
          </button>
        </>
      ) : (
        <>
          {/* step 2: efficiency */}
          <div className="max-w-xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-4 mb-3">
            <div className="text-center mb-3">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                Components need (DC)
              </div>
              <div className="font-mono text-2xl font-bold text-white">{dc} W</div>
            </div>

            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px flex-1 bg-gray-700" />
              <span className="text-[11px] text-gray-400 font-mono">÷ efficiency</span>
              <div className="h-px flex-1 bg-gray-700" />
            </div>

            <div className="flex gap-2 mb-4">
              {PSU_RATINGS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setEff(r.id)}
                  className={`flex-1 py-2 text-[11px] rounded-lg border font-bold ${
                    eff === r.id
                      ? 'bg-brand-green border-brand-green text-white'
                      : 'bg-gray-900 border-gray-600 text-gray-400'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="rounded-xl border-2 border-brand-orange/60 bg-brand-orange/10 p-4 text-center">
              <div className="text-[10px] text-brand-orange uppercase tracking-wider font-bold mb-1">
                Wall must supply (AC)
              </div>
              <div className="font-mono text-4xl font-extrabold text-brand-orange">{wall} W</div>
              <div className="font-mono text-[11px] text-gray-400 mt-1">
                {dc} ÷ {eff.toFixed(2)} ≈ {wall}
              </div>
            </div>
          </div>

          {/* visual: DC vs waste */}
          <div className="max-w-xl mx-auto w-full mb-3">
            <div className="h-12 rounded-xl overflow-hidden flex border border-gray-700">
              <div
                className="bg-sky-500 flex items-center justify-center transition-all duration-500"
                style={{ width: `${(dc / wall) * 100}%` }}
              >
                <span className="text-[10px] font-bold text-white px-2 truncate">
                  useful {dc}W
                </span>
              </div>
              <div
                className="bg-gray-600 flex items-center justify-center transition-all duration-500"
                style={{ width: `${(lost / wall) * 100}%` }}
              >
                <span className="text-[10px] font-bold text-gray-200 px-2 truncate">
                  wasted {lost}W
                </span>
              </div>
            </div>
            <div className="flex justify-between text-[9px] text-gray-500 mt-1 px-1">
              <span>reaches the silicon</span>
              <span>lost as heat in the PSU</span>
            </div>
          </div>

          <p className="text-sm text-gray-300 text-center max-w-xl mx-auto mb-2">
            <strong className="text-brand-orange">{wall} W</strong> is the number you plan
            electrical circuits around — not the {dc} W. At {(eff * 100).toFixed(0)}% efficiency the
            PSU burns <strong className="text-white">{lost} W</strong> just converting AC → DC.
          </p>
          <p className="text-[11px] text-gray-500 text-center max-w-xl mx-auto mb-3">
            For production systems, use <strong className="text-gray-300">redundant PSUs</strong> so
            one can carry the full load if the other fails mid-training.
          </p>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="max-w-xl mx-auto w-full py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
          >
            ← Back to the TDP sum
          </button>
        </>
      )}
    </div>
  );
}

/* ── 8. Circuits and the 80% rule ─────────────────────────────────────────── */

const CIRCUITS = [
  { id: '120-15', v: 120, a: 15, where: 'Typical household outlet' },
  { id: '120-20', v: 120, a: 20, where: 'Heavy-duty household circuit' },
  { id: '208-20', v: 208, a: 20, where: 'Server room / data centre' },
  { id: '208-30', v: 208, a: 30, where: 'Dedicated rack circuit' },
  { id: '240-30', v: 240, a: 30, where: 'High-power dedicated feed' },
];

export function CircuitVisualizer() {
  const [pick, setPick] = useState('208-20');
  const [draw, setDraw] = useState(2444);

  const c = CIRCUITS.find((x) => x.id === pick);
  const capacity = c.v * c.a * 0.8;
  const trips = draw > capacity;
  const headroom = capacity - draw;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The 80% Rule</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          You may only draw 80% of a breaker&apos;s rating continuously. That single factor decides
          your outlet.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full rounded-xl border border-cyan-900/50 bg-gray-950 p-3 mb-3 text-center">
        <div className="font-serif italic text-slate-100 text-sm mb-1">
          {c.v}V × {c.a}A × 0.80 = {capacity.toLocaleString()}W
        </div>
        <div className="text-[10px] text-gray-500">maximum safe continuous draw</div>
      </div>

      <Tabs
        value={pick}
        onChange={setPick}
        accent="bg-brand-orange"
        options={CIRCUITS.map((x) => ({ id: x.id, label: `${x.v}V / ${x.a}A` }))}
      />

      {/* breaker */}
      <div
        className={`max-w-2xl mx-auto w-full rounded-xl border-2 p-4 mb-3 text-center transition-colors ${
          trips ? 'border-brand-rose bg-brand-rose/10' : 'border-brand-green bg-brand-green/5'
        }`}
      >
        <Zap
          className={`w-8 h-8 mx-auto mb-2 ${trips ? 'text-brand-rose animate-pulse' : 'text-brand-green'}`}
        />
        <div className={`font-bold text-lg ${trips ? 'text-brand-rose' : 'text-brand-green'}`}>
          {trips ? 'BREAKER TRIPS' : 'WITHIN LIMITS'}
        </div>
        <div className="text-[11px] text-gray-400 mt-1">{c.where}</div>
      </div>

      <div className="max-w-2xl mx-auto w-full mb-3">
        <Meter
          label={`Server draw vs circuit capacity`}
          value={(draw / capacity) * 100}
          unit={`${draw} W of ${capacity.toLocaleString()} W`}
          tone={trips ? 'bg-brand-rose' : 'bg-brand-green'}
        />
      </div>

      <div className="max-w-2xl mx-auto w-full flex items-center gap-3 mb-3">
        <span className="text-[10px] text-gray-400 shrink-0">Server draw</span>
        <input
          type="range"
          min="500"
          max="6000"
          step="50"
          value={draw}
          onChange={(e) => setDraw(Number(e.target.value))}
          className="flex-1 accent-brand-rose"
        />
        <span className="font-mono text-xs text-white w-14 text-right">{draw} W</span>
      </div>

      <p className="text-sm text-center max-w-2xl mx-auto">
        {trips ? (
          <span className="text-brand-rose">
            A {draw} W server would immediately trip this breaker. This is why data centres and
            dedicated server rooms use{' '}
            <strong className="text-white">higher-voltage circuits, typically 208V or 240V</strong>.
          </span>
        ) : (
          <span className="text-gray-300">
            Safe, with <strong className="text-brand-green">{Math.round(headroom)} W</strong> of
            margin. In a rack, this feeds a{' '}
            <strong className="text-white">PDU (Power Distribution Unit)</strong> — a rack-mounted
            power strip that distributes a high-amperage circuit to multiple servers.
          </span>
        )}
      </p>
    </div>
  );
}

/* ── 9. Power flow from wall to heat ──────────────────────────────────────── */

export function PowerFlowVisualizer() {
  const [eff, setEff] = useState(0.9);
  const [flow, setFlow] = useState(false);

  const dc = 2200;
  const wall = Math.round(dc / eff);
  const available = 3328;
  const btu = Math.round(wall * 3.412);

  const Box = ({ children, cls }) => (
    <div className={`rounded-lg border-2 px-3 py-2 text-center text-[11px] font-semibold ${cls}`}>
      {children}
    </div>
  );

  const Arrow = ({ label, on }) => (
    <div className="flex flex-col items-center py-0.5">
      <div className={`w-0.5 h-4 ${on ? 'bg-brand-orange animate-pulse' : 'bg-gray-700'}`} />
      <span className={`text-[9px] ${on ? 'text-brand-orange' : 'text-gray-600'}`}>{label}</span>
      <div className={`w-0.5 h-4 ${on ? 'bg-brand-orange animate-pulse' : 'bg-gray-700'}`} />
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">From Wall Outlet to Waste Heat</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Every watt that enters the rack leaves it as heat somebody has to remove.
        </p>
      </div>

      <div className="max-w-md mx-auto w-full mb-3">
        <div className="flex gap-2 items-start mb-1">
          <div className="flex-1">
            <Box cls="border-yellow-500 bg-yellow-200 text-yellow-950">
              High-Power Wall Outlet
              <div className="text-[9px] font-normal">(208V / 30A)</div>
            </Box>
          </div>
          <div className="w-28">
            <Box cls="border-indigo-400 bg-indigo-200 text-indigo-950">
              Dedicated AC Unit
              <div className="text-[9px] font-normal">cool air</div>
            </Box>
          </div>
        </div>

        <Arrow label={`${available} W available`} on={flow} />

        <div className="rounded-xl border border-gray-600 bg-gray-900/50 p-2">
          <div className="text-[9px] text-gray-500 text-center mb-1">Server Rack</div>
          <Box cls="border-sky-400 bg-sky-200 text-sky-950">PDU (Power Distribution Unit)</Box>

          <Arrow label={`${wall} W draw`} on={flow} />

          <div className="rounded-lg border border-gray-600 bg-gray-950/60 p-2">
            <div className="text-[9px] text-gray-500 text-center mb-1">AI Server</div>
            <Box cls="border-emerald-400 bg-emerald-200 text-emerald-950">
              Redundant PSUs
              <div className="text-[9px] font-normal">AC to DC · {(eff * 100).toFixed(0)}% efficient</div>
            </Box>

            <Arrow label={`${dc} W delivered`} on={flow} />

            <div className="flex gap-1">
              {['CPUs', 'GPUs', 'Other'].map((c) => (
                <div
                  key={c}
                  className="flex-1 rounded border-2 border-rose-400 bg-rose-200 text-rose-950 text-[10px] font-semibold text-center py-1.5"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center py-1">
          <div className="h-4 border-l-2 border-dashed border-rose-500" />
          <span className="text-[9px] text-rose-400">~{btu.toLocaleString()} BTU/hr</span>
          <div className="h-4 border-l-2 border-dashed border-rose-500" />
        </div>
        <div className="rounded-full border-2 border-dashed border-gray-500 text-center py-2 text-[11px] text-gray-300">
          Heat Dissipation
        </div>
      </div>

      <div className="max-w-md mx-auto w-full flex gap-2 mb-3">
        {PSU_RATINGS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setEff(r.id)}
            className={`flex-1 py-1.5 text-[10px] rounded border ${
              eff === r.id
                ? 'bg-brand-green border-brand-green text-white'
                : 'bg-gray-800 border-gray-600 text-gray-400'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setFlow((f) => !f)}
        className="max-w-md mx-auto w-full py-2 rounded-lg bg-brand-orange hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 mb-3"
      >
        <Play className="w-3.5 h-3.5" /> {flow ? 'Stop' : 'Energise the rack'}
      </button>

      <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto">
        The wall supplies {available} W, the server pulls {wall} W, the PSUs deliver {dc} W to the
        silicon — and essentially all of it comes back out as{' '}
        <strong className="text-brand-rose">{btu.toLocaleString()} BTU/hr</strong> of heat that the
        AC unit must carry away.
      </p>
    </div>
  );
}

/* ── 10. Watts to BTU and sizing the AC ───────────────────────────────────── */

const AC_SIZES = [8000, 10000, 12000, 14000, 18000, 24000];

export function BtuVisualizer() {
  const [watts, setWatts] = useState(2444);

  const btu = watts * 3.412;
  const heater = 5000;
  const recommended = AC_SIZES.find((s) => s >= btu * 1.15) || 36000;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Watts In, BTUs Out</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          The laws of thermodynamics are unforgiving: nearly all the electricity a server consumes
          becomes heat.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full rounded-xl border border-cyan-900/50 bg-gray-950 p-3 mb-3 text-center space-y-1">
        <div className="font-serif italic text-slate-100 text-sm">1 W ≈ 3.412 BTU/hr</div>
        <div className="font-serif italic text-slate-100">
          {watts} W × 3.412 BTU/hr ≈{' '}
          <span className="text-brand-rose font-bold">{Math.round(btu).toLocaleString()} BTU/hr</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full flex items-center gap-3 mb-4">
        <span className="text-[10px] text-gray-400 shrink-0">Wall draw</span>
        <input
          type="range"
          min="500"
          max="6000"
          step="50"
          value={watts}
          onChange={(e) => setWatts(Number(e.target.value))}
          className="flex-1 accent-brand-rose"
        />
        <span className="font-mono text-xs text-white w-14 text-right">{watts} W</span>
      </div>

      {/* comparison */}
      <div className="max-w-2xl mx-auto w-full space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-gray-400">Small personal space heater</span>
            <span className="font-mono text-gray-300">~5,000 BTU/hr</span>
          </div>
          <div className="h-6 rounded bg-gray-900 overflow-hidden">
            <div
              className="h-full bg-gray-600 flex items-center"
              style={{ width: `${(heater / Math.max(btu, heater)) * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-brand-rose font-bold">Your AI server</span>
            <span className="font-mono text-brand-rose">
              {Math.round(btu).toLocaleString()} BTU/hr
            </span>
          </div>
          <div className="h-6 rounded bg-gray-900 overflow-hidden">
            <div
              className="h-full bg-brand-rose flex items-center"
              style={{ width: `${(btu / Math.max(btu, heater)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* AC sizing */}
      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Snowflake className="w-4 h-4 text-brand-blue" />
          <span className="text-xs font-bold text-white">Air-conditioner sizing</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {AC_SIZES.map((s) => (
            <div
              key={s}
              className={`flex-1 min-w-[60px] rounded border py-1.5 text-center text-[10px] font-mono ${
                s === recommended
                  ? 'border-brand-green bg-brand-green/15 text-brand-green font-bold'
                  : s < btu
                    ? 'border-brand-rose/40 bg-brand-rose/5 text-gray-600'
                    : 'border-gray-700 bg-gray-900 text-gray-500'
              }`}
            >
              {(s / 1000).toFixed(0)}k
            </div>
          ))}
        </div>
        <div className="text-[11px] text-center mt-2 text-gray-400">
          Pick at least{' '}
          <span className="text-brand-green font-bold">
            {recommended.toLocaleString()} BTU/hr
          </span>{' '}
          for a safe margin
        </div>
      </div>

      <p className="text-sm text-gray-300 text-center max-w-2xl mx-auto">
        A standard office HVAC system is not designed to handle this kind of concentrated heat load.
        Placing such a server in a small, unventilated room will quickly raise the ambient
        temperature to levels that cause hardware to throttle or shut down entirely.
      </p>
    </div>
  );
}

/* ── 11. Server-level cooling: airflow and CFM ────────────────────────────── */

export function ServerAirflowVisualizer() {
  const [cfm, setCfm] = useState(120);
  const [blocked, setBlocked] = useState(false);

  const effective = blocked ? cfm * 0.35 : cfm;
  const temp = Math.max(28, 95 - effective * 0.32);
  const throttling = temp > 80;
  const db = Math.round(35 + cfm * 0.22);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Server-Level Cooling</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Chassis are engineered for one airflow pattern: front to back. Obstruct it and nothing else
          matters.
        </p>
      </div>

      {/* chassis */}
      <div className="max-w-2xl mx-auto w-full rounded-xl border-2 border-gray-600 bg-gray-950 p-3 mb-3">
        <div className="flex items-stretch gap-2">
          {/* intake */}
          <div
            className={`w-16 rounded-lg border-2 flex flex-col items-center justify-center ${
              blocked ? 'border-rose-600 bg-rose-950/40' : 'border-cyan-500 bg-cyan-950/40'
            }`}
          >
            <Snowflake className={`w-4 h-4 ${blocked ? 'text-rose-400' : 'text-cyan-400'}`} />
            <span className="text-[8px] text-gray-400 mt-1 text-center leading-tight">
              {blocked ? 'blocked' : 'cool air in'}
            </span>
          </div>

          {/* flow */}
          <div className="flex-1 flex flex-col justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className={`h-full ${blocked ? 'bg-rose-500' : 'bg-cyan-400'}`}
                  style={{
                    width: '100%',
                    backgroundImage:
                      'repeating-linear-gradient(90deg, rgba(255,255,255,.85) 0 5px, transparent 5px 16px)',
                    animation: `dashFlow ${Math.max(0.25, 40 / effective)}s linear infinite`,
                  }}
                />
              </div>
            ))}
            <div className="flex gap-1 mt-1">
              {['CPU', 'GPU', 'GPU', 'GPU', 'GPU'].map((c, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded text-[8px] text-center py-1.5 border ${
                    throttling
                      ? 'border-rose-600 bg-rose-900/40 text-rose-300'
                      : 'border-gray-600 bg-gray-800 text-gray-300'
                  }`}
                >
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* exhaust */}
          <div className="w-16 rounded-lg border-2 border-orange-500 bg-orange-950/40 flex flex-col items-center justify-center">
            <Wind className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: `${Math.max(0.3, 60 / cfm)}s` }} />
            <span className="text-[8px] text-gray-400 mt-1 text-center leading-tight">hot exhaust</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full flex items-center gap-3 mb-3">
        <span className="text-[10px] text-gray-400 shrink-0">Fan speed</span>
        <input
          type="range"
          min="40"
          max="250"
          value={cfm}
          onChange={(e) => setCfm(Number(e.target.value))}
          className="flex-1 accent-brand-blue"
        />
        <span className="font-mono text-xs text-white w-16 text-right">{cfm} CFM</span>
      </div>

      <div className="max-w-2xl mx-auto w-full grid grid-cols-3 gap-2 mb-3">
        <Stat
          label="Component temp"
          value={`${temp.toFixed(0)} °C`}
          sub={throttling ? 'throttling' : 'nominal'}
          tone={throttling ? 'text-brand-rose' : 'text-brand-green'}
        />
        <Stat label="Effective airflow" value={`${effective.toFixed(0)} CFM`} sub="cubic feet/min" />
        <Stat
          label="Noise"
          value={`${db} dB`}
          sub={db > 70 ? 'far louder than a desktop' : 'tolerable'}
          tone={db > 70 ? 'text-brand-orange' : 'text-white'}
        />
      </div>

      <button
        type="button"
        onClick={() => setBlocked((b) => !b)}
        className={`max-w-2xl mx-auto w-full py-2 rounded-lg text-xs font-bold mb-3 ${
          blocked ? 'bg-gray-700 text-gray-200' : 'bg-brand-rose text-white hover:bg-rose-600'
        }`}
      >
        {blocked ? 'Clear the front vents' : 'Obstruct the front vents'}
      </button>

      <p className="text-sm text-center max-w-2xl mx-auto">
        {blocked ? (
          <span className="text-brand-rose flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Airflow collapses to a third. It is important not
            to obstruct these vents — no fan can compensate.
          </span>
        ) : (
          <span className="text-gray-300">
            Cool air is drawn in from the front, passes over the components, and hot exhaust is
            expelled out the back. High-power servers use high-speed, high-pressure fans measured in{' '}
            <strong className="text-white">CFM</strong> that are much louder than those in a desktop
            PC.
          </span>
        )}
      </p>
    </div>
  );
}

/* ── 12. Room-level cooling and hot aisle / cold aisle ────────────────────── */

export function HotColdAisleVisualizer() {
  const [layout, setLayout] = useState('aisle');

  const good = layout === 'aisle';
  const intakeTemp = good ? 20 : 38;
  const exhaustTemp = good ? 42 : 58;

  const Rack = ({ flip, label }) => (
    <div className="flex-1 rounded-lg border-2 border-gray-600 bg-gray-900 p-1.5">
      <div className="text-[8px] text-gray-500 text-center mb-1">{label}</div>
      <div className={`flex ${flip ? 'flex-row-reverse' : 'flex-row'} gap-1 items-stretch`}>
        <div className="w-4 rounded bg-cyan-500/30 border border-cyan-500 flex items-center justify-center">
          <span className="text-[7px] text-cyan-300 rotate-90 whitespace-nowrap">in</span>
        </div>
        <div className="flex-1 space-y-0.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-3 rounded bg-gray-700 border border-gray-600" />
          ))}
        </div>
        <div className="w-4 rounded bg-orange-500/30 border border-orange-500 flex items-center justify-center">
          <span className="text-[7px] text-orange-300 rotate-90 whitespace-nowrap">out</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Room-Level Cooling</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Which way the racks face changes the temperature of the air your servers actually breathe.
        </p>
      </div>

      <Tabs
        value={layout}
        onChange={setLayout}
        accent={good ? 'bg-brand-green' : 'bg-brand-rose'}
        options={[
          { id: 'same', label: 'All racks facing the same way' },
          { id: 'aisle', label: 'Hot aisle / cold aisle' },
        ]}
      />

      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="flex gap-3 items-stretch">
          <Rack flip={false} label="Rack Row 1" />
          <div className="w-20 flex flex-col items-center justify-center">
            <div
              className={`text-[9px] font-bold ${good ? 'text-orange-400' : 'text-rose-400'}`}
            >
              {good ? 'HOT AISLE' : 'MIXED'}
            </div>
            <div className="text-[8px] text-gray-500 text-center leading-tight mt-0.5">
              {good ? 'exhaust meets exhaust' : 'row 2 inhales row 1’s exhaust'}
            </div>
            <div
              className={`w-full h-1 rounded-full mt-1 ${good ? 'bg-orange-500' : 'bg-rose-600'}`}
            />
          </div>
          <Rack flip={good} label="Rack Row 2" />
        </div>

        <div className="flex gap-3 mt-2">
          <div className="flex-1 text-center text-[9px] text-cyan-400">cold aisle</div>
          <div className="w-20" />
          <div className="flex-1 text-center text-[9px]">
            <span className={good ? 'text-cyan-400' : 'text-rose-400'}>
              {good ? 'cold aisle' : 'hot intake'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full grid grid-cols-2 gap-2 mb-3">
        <Stat
          label="Row 2 intake temperature"
          value={`${intakeTemp} °C`}
          sub={good ? 'drawing from the cold aisle' : 'recirculated exhaust'}
          tone={good ? 'text-brand-green' : 'text-brand-rose'}
        />
        <Stat
          label="Row 2 exhaust temperature"
          value={`${exhaustTemp} °C`}
          sub={good ? 'within design envelope' : 'compounding each row'}
          tone={good ? 'text-brand-orange' : 'text-brand-rose'}
        />
      </div>

      <div className="max-w-2xl mx-auto w-full rounded-lg border border-gray-700 bg-black/30 p-2.5 mb-3 flex items-start gap-2">
        <Snowflake className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
        <span className="text-[11px] text-gray-400">
          For even a single AI server, a dedicated portable AC unit or a{' '}
          <span className="text-white font-semibold">mini-split</span> system is often necessary.
          These are rated in BTU/hr — an 8,339 BTU/hr server wants a unit rated for at least{' '}
          <span className="text-brand-green font-semibold">10,000 BTU/hr</span>.
        </span>
      </div>

      <p className="text-sm text-center max-w-2xl mx-auto">
        {good ? (
          <span className="text-brand-green flex items-center justify-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> All fronts face one aisle and all backs the other, so
            no server inhales its neighbour’s exhaust.
          </span>
        ) : (
          <span className="text-brand-rose flex items-center justify-center gap-1.5">
            <Flame className="w-4 h-4" /> Row 2 is breathing {intakeTemp} °C exhaust from Row 1.
            Every additional row compounds the problem.
          </span>
        )}
      </p>
    </div>
  );
}
