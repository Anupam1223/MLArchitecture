import React, { useState, useEffect } from 'react';
import {
  Server,
  Cpu,
  HardDrive,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Layers,
  Box,
} from 'lucide-react';

/* ── shared ───────────────────────────────────────────────────────────────── */

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

function Stat({ label, value, sub, tone = 'text-white' }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-black/30 p-2 text-center">
      <div className="text-[9px] text-gray-500">{label}</div>
      <div className={`font-mono text-base font-bold ${tone}`}>{value}</div>
      {sub && <div className="text-[9px] text-gray-600">{sub}</div>}
    </div>
  );
}

/* ── 1. Scenario brief ────────────────────────────────────────────────────── */

const CONSTRAINTS = [
  { id: 'model', label: 'Model', value: 'Llama 3 70B', detail: 'Needs significant VRAM for training and inference' },
  { id: 'task', label: 'Task', value: 'Supervised fine-tuning', detail: 'SFT on a proprietary documentation dataset' },
  { id: 'data', label: 'Dataset', value: '500 GB', detail: 'Curated text and code documents' },
  { id: 'perf', label: 'Deadline', value: '< 48 hours', detail: 'Full fine-tuning run for frequent experimentation' },
  { id: 'team', label: 'Team', value: '3 engineers', detail: 'Will share this single server' },
  { id: 'budget', label: 'Budget', value: 'Substantial', detail: 'Justify high-cost parts; prioritise long-term value' },
];

export function ScenarioBriefVisualizer() {
  const [sel, setSel] = useState('model');
  const c = CONSTRAINTS.find((x) => x.id === sel);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-white mb-1">Mission Brief</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Every component choice must point back to one of these constraints. Click a card to see
          why it matters.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {CONSTRAINTS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setSel(x.id)}
            className={`rounded-xl border-2 p-3 text-left transition ${
              sel === x.id
                ? 'border-brand-orange bg-brand-orange/10'
                : 'border-gray-700 bg-gray-950 hover:border-gray-500'
            }`}
          >
            <div className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">
              {x.label}
            </div>
            <div className="text-sm font-bold text-white mt-0.5">{x.value}</div>
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto w-full rounded-xl border border-brand-orange/40 bg-gray-950 p-4 mb-3">
        <div className="text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          {c.label}
        </div>
        <div className="text-white font-bold text-lg mb-1">{c.value}</div>
        <p className="text-sm text-gray-300">{c.detail}</p>
      </div>

      <p className="text-sm text-gray-400 text-center max-w-2xl mx-auto">
        You are building an internal knowledge-base assistant. The specification sheet is the bridge
        between these needs and a rack that can actually run them.
      </p>
    </div>
  );
}

/* ── 2. Spec sheet template ───────────────────────────────────────────────── */

const SPEC_ROWS = [
  { cat: 'Compute', comp: 'GPU', qty: '#', ask: 'Model, VRAM, and quantity for the 70B fine-tune' },
  { cat: 'Compute', comp: 'CPU', qty: '1', ask: 'Must feed four GPUs without a PCIe bottleneck' },
  { cat: 'Platform', comp: 'Motherboard', qty: '1', ask: 'Socket, lane count, physical GPU spacing' },
  { cat: 'Platform', comp: 'Chassis', qty: '1', ask: 'Form factor, cooling, GPU length clearance' },
  { cat: 'Memory', comp: 'System RAM', qty: '#', ask: 'Buffer for 500 GB dataset preprocessing' },
  { cat: 'Storage', comp: 'Hot (NVMe)', qty: '#', ask: 'OS + active dataset, keep GPUs saturated' },
  { cat: 'Storage', comp: 'Cold (SATA)', qty: '#', ask: 'Checkpoints (>100 GB each) and backups' },
  { cat: 'Network', comp: 'NIC', qty: '1', ask: 'How fast to move 500 GB onto the box' },
  { cat: 'Power', comp: 'PSU', qty: '1', ask: 'Wattage + efficiency with headroom for spikes' },
];

const FILLED = {
  GPU: { spec: 'RTX 4090 24 GB', qty: '4', why: '96 GB total — enough for 4-bit + LoRA' },
  CPU: { spec: 'Threadripper 7960X', qty: '1', why: '24 cores + PCIe 5.0 lanes for 4× x16' },
  Motherboard: { spec: 'TRX50 / sTR5', qty: '1', why: 'Four spaced x16 slots from the CPU' },
  Chassis: { spec: '4U or full-tower', qty: '1', why: 'Fits four long GPUs + high-CFM fans' },
  'System RAM': { spec: '256 GB DDR5', qty: '1', why: 'Prevents disk-swapping the 500 GB dataset' },
  'Hot (NVMe)': { spec: '4 TB NVMe Gen4', qty: '1', why: 'OS + 500 GB active set, saturates GPUs' },
  'Cold (SATA)': { spec: '8 TB SATA SSD', qty: '1', why: 'Cheap capacity for 100 GB+ checkpoints' },
  NIC: { spec: '10 GbE', qty: '1', why: '500 GB in ~7 min, not >1 hour on 1 GbE' },
  PSU: { spec: '2000W 80+ Titanium', qty: '1', why: '4×450W GPUs + CPU with headroom' },
};

export function SpecSheetVisualizer() {
  const [filled, setFilled] = useState(false);
  const [focus, setFocus] = useState(null);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The Specification Sheet</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Not a shopping list — every row needs a justification tied to the scenario.
        </p>
      </div>

      <div className="max-w-3xl mx-auto w-full rounded-xl border border-gray-700 overflow-hidden mb-3">
        <div className="grid grid-cols-12 bg-gray-800 text-[9px] font-bold text-gray-300 uppercase tracking-wider">
          <div className="col-span-2 p-2">Category</div>
          <div className="col-span-3 p-2">Component</div>
          <div className="col-span-4 p-2">Specification</div>
          <div className="col-span-1 p-2 text-center">Qty</div>
          <div className="col-span-2 p-2">Why</div>
        </div>
        {SPEC_ROWS.map((r, i) => {
          const f = filled ? FILLED[r.comp] : null;
          const active = focus === r.comp;
          return (
            <button
              key={r.comp}
              type="button"
              onClick={() => setFocus(r.comp)}
              className={`grid grid-cols-12 w-full text-left border-t border-gray-800 text-[10px] transition ${
                active ? 'bg-brand-orange/10' : i % 2 ? 'bg-gray-950' : 'bg-gray-900'
              }`}
            >
              <div className="col-span-2 p-2 text-gray-500">{r.cat}</div>
              <div className="col-span-3 p-2 text-white font-semibold">{r.comp}</div>
              <div className={`col-span-4 p-2 ${f ? 'text-brand-green font-mono' : 'text-gray-600 italic'}`}>
                {f ? f.spec : 'Your choice & rationale'}
              </div>
              <div className="col-span-1 p-2 text-center font-mono text-gray-300">
                {f ? f.qty : r.qty}
              </div>
              <div className="col-span-2 p-2 text-gray-500 truncate">{f ? f.why : '…'}</div>
            </button>
          );
        })}
      </div>

      {focus && (
        <div className="max-w-3xl mx-auto w-full rounded-lg border border-gray-700 bg-black/40 p-3 mb-3 text-sm text-gray-300">
          <span className="text-brand-orange font-bold">{focus}: </span>
          {filled ? FILLED[focus].why : SPEC_ROWS.find((r) => r.comp === focus).ask}
        </div>
      )}

      <button
        type="button"
        onClick={() => setFilled((v) => !v)}
        className="max-w-3xl mx-auto w-full py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold"
      >
        {filled ? 'Clear the sheet (start empty)' : 'Reveal the worked-example answers'}
      </button>
    </div>
  );
}

/* ── 3. VRAM math for Llama 70B ───────────────────────────────────────────── */

const PRECISIONS = [
  { id: 'fp32', label: 'FP32', bytes: 4, note: 'Full precision — 70B × 4 bytes' },
  { id: 'fp16', label: 'FP16 / BF16', bytes: 2, note: 'Mixed precision — halves the footprint' },
  { id: 'q4', label: '4-bit + LoRA', bytes: 0.5, note: 'Quantized weights + small adapters' },
];

export function LlamaVramVisualizer() {
  const [prec, setPrec] = useState('q4');
  const [gpus, setGpus] = useState(4);

  const p = PRECISIONS.find((x) => x.id === prec);
  const needGB = 70 * p.bytes; // billion params × bytes = GB
  const haveGB = gpus * 24;
  const fits = haveGB >= needGB;
  const fill = Math.min(100, (needGB / Math.max(haveGB, needGB, 1)) * 100);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Does 4× 4090 Fit a 70B Model?</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          VRAM ≈ parameters × bytes per parameter. Precision is the knob that decides the build.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full rounded-xl border border-cyan-900/50 bg-gray-950 p-3 mb-3 text-center">
        <div className="font-serif italic text-slate-100 text-sm mb-1">
          VRAM ≈ 70B × {p.bytes} bytes = <span className="text-brand-orange font-bold">{needGB} GB</span>
        </div>
        <div className="text-[10px] text-gray-500">{p.note}</div>
      </div>

      <Tabs
        value={prec}
        onChange={setPrec}
        accent="bg-brand-purple"
        options={PRECISIONS.map((x) => ({ id: x.id, label: x.label }))}
      />

      {/* bucket visual */}
      <div className="max-w-xl mx-auto w-full mb-3">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-gray-400">Model needs {needGB} GB</span>
          <span className="text-gray-400">
            {gpus}× 4090 = {haveGB} GB
          </span>
        </div>
        <div className="h-14 rounded-xl border-2 border-gray-600 bg-gray-950 relative overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${fits ? 'bg-brand-green/70' : 'bg-brand-rose/70'}`}
            style={{ width: `${fill}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-white">
            {fits ? `${haveGB - needGB} GB headroom` : `${needGB - haveGB} GB short`}
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto w-full flex items-center gap-3 mb-3">
        <span className="text-[10px] text-gray-400 shrink-0">RTX 4090 count</span>
        <input
          type="range"
          min="1"
          max="8"
          value={gpus}
          onChange={(e) => setGpus(Number(e.target.value))}
          className="flex-1 accent-brand-green"
        />
        <span className="font-mono text-xs text-white w-4 text-right">{gpus}</span>
      </div>

      <div className="max-w-xl mx-auto w-full grid grid-cols-3 gap-2 mb-3">
        <Stat label="FP32 need" value="280 GB" sub="won't fit" tone="text-brand-rose" />
        <Stat label="FP16 need" value="140 GB" sub="still over 96 GB" tone="text-brand-orange" />
        <Stat label="4-bit + LoRA" value="35 GB" sub="fits in 96 GB" tone="text-brand-green" />
      </div>

      <p className="text-sm text-center max-w-xl mx-auto">
        {fits ? (
          <span className="text-brand-green flex items-center justify-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> Four 4090s are enough — because quantization and LoRA
            shrink the working set, not because 96 GB holds a full-precision 70B.
          </span>
        ) : (
          <span className="text-brand-rose flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> At this precision the model does not fit. Either
            add GPUs, drop precision, or move to A100/H100 class cards.
          </span>
        )}
      </p>
    </div>
  );
}

/* ── 4. Architecture diagram ──────────────────────────────────────────────── */

export function ArchitectureDiagramVisualizer() {
  const [sel, setSel] = useState('cpu');

  const DETAILS = {
    cpu: {
      title: 'AMD Threadripper 7960X',
      body: '24 cores for the data pipeline and OS. The critical feature is PCIe 5.0 lane count — enough for four dedicated x16 links to the GPUs plus an x4 NVMe path.',
    },
    gpu: {
      title: '4× RTX 4090 24 GB',
      body: '96 GB pooled VRAM. Cards talk over PCIe 4.0 (no NVLink on consumer 4090s). Chosen for performance-per-dollar versus A100 on this budget.',
    },
    nvme: {
      title: '4 TB NVMe (hot)',
      body: 'Active dataset and OS. Gen4 NVMe keeps the GPUs saturated while reading the 500 GB corpus.',
    },
    sata: {
      title: '8 TB SATA SSD (cold)',
      body: 'Checkpoints for a 70B model can exceed 100 GB each. SATA is cheap capacity that is still far faster than HDD.',
    },
    ram: {
      title: '256 GB DDR5',
      body: 'Data loaders stage chunks in RAM before shipping them to the GPUs. Too little RAM forces disk swapping and destroys throughput.',
    },
  };

  const d = DETAILS[sel];

  const Chip = ({ id, children, cls }) => (
    <button
      type="button"
      onClick={() => setSel(id)}
      className={`rounded-lg border-2 px-2 py-2 text-[10px] font-bold transition ${
        sel === id ? cls : 'border-gray-600 bg-gray-900 text-gray-400'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Proposed Server Architecture</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Click any block — the CPU fans out dedicated high-bandwidth lanes to every GPU and the
          NVMe.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-white p-4 mb-3">
        {/* CPU + RAM */}
        <div className="flex justify-center gap-2 mb-2">
          <Chip id="cpu" cls="border-sky-500 bg-sky-100 text-sky-900">
            Threadripper · 24c · PCIe 5.0
          </Chip>
          <Chip id="ram" cls="border-indigo-500 bg-indigo-100 text-indigo-900">
            256 GB DDR5
          </Chip>
        </div>

        {/* lanes */}
        <svg viewBox="0 0 400 50" className="w-full h-10">
          {[50, 150, 250, 350].map((x, i) => (
            <g key={x}>
              <path
                d={`M 200 0 L 200 18 L ${x} 18 L ${x} 50`}
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="animate-flow-dash"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
              <text x={x} y="32" textAnchor="middle" fill="#166534" fontSize="8">
                PCIe x16
              </text>
            </g>
          ))}
        </svg>

        {/* GPUs */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[1, 2, 3, 4].map((n) => (
            <Chip key={n} id="gpu" cls="border-emerald-500 bg-emerald-100 text-emerald-900">
              GPU {n}
              <div className="font-normal text-[8px]">RTX 4090 24GB</div>
            </Chip>
          ))}
        </div>

        {/* storage */}
        <div className="flex justify-center gap-3">
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-amber-700 mb-0.5">PCIe x4</span>
            <Chip id="nvme" cls="border-amber-500 bg-amber-100 text-amber-900">
              4 TB NVMe
              <div className="font-normal text-[8px]">active dataset</div>
            </Chip>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-orange-700 mb-0.5">SATA</span>
            <Chip id="sata" cls="border-orange-500 bg-orange-100 text-orange-900">
              8 TB SATA SSD
              <div className="font-normal text-[8px]">checkpoints</div>
            </Chip>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3">
        <div className="text-xs font-bold text-white mb-1">{d.title}</div>
        <p className="text-sm text-gray-300">{d.body}</p>
      </div>
    </div>
  );
}

/* ── 5. Platform & RAM (disk swap) ────────────────────────────────────────── */

export function PlatformRamVisualizer() {
  const [ramGB, setRamGB] = useState(256);
  const datasetGB = 500;
  const workingSet = 180; // chunk held in RAM at once

  const swaps = ramGB < workingSet + 64; // OS + users need ~64 GB
  const buffer = Math.max(0, ramGB - 64);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Platform, Chassis, and RAM</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          TRX50 + 4U for the silicon. 256 GB DDR5 so the 500 GB dataset never forces a disk swap.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-xl border border-gray-700 bg-gray-950 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-brand-blue" />
            <span className="text-xs font-bold text-white">Motherboard</span>
          </div>
          <div className="text-[11px] text-brand-green font-mono">TRX50 · sTR5</div>
          <p className="text-[10px] text-gray-400 mt-1">
            Four physically spaced x16 slots so dual/triple-slot 4090s actually fit.
          </p>
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-950 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Box className="w-4 h-4 text-brand-purple" />
            <span className="text-xs font-bold text-white">Chassis</span>
          </div>
          <div className="text-[11px] text-brand-green font-mono">4U rack / full-tower</div>
          <p className="text-[10px] text-gray-400 mt-1">
            Length clearance for four long GPUs plus high-CFM front-to-back airflow.
          </p>
        </div>
      </div>

      {/* RAM vs dataset */}
      <div className="max-w-xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="text-[10px] text-gray-500 mb-2 text-center">
          Data path: disk → RAM buffer → GPU
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg border border-amber-600 bg-amber-950/30 p-2 text-center">
            <HardDrive className="w-4 h-4 mx-auto text-amber-400" />
            <div className="text-[9px] text-gray-400 mt-0.5">Dataset</div>
            <div className="font-mono text-xs text-white">{datasetGB} GB</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
          <div
            className={`flex-1 rounded-lg border-2 p-2 text-center ${
              swaps ? 'border-brand-rose bg-brand-rose/10' : 'border-brand-green bg-brand-green/10'
            }`}
          >
            <Cpu className={`w-4 h-4 mx-auto ${swaps ? 'text-brand-rose' : 'text-brand-green'}`} />
            <div className="text-[9px] text-gray-400 mt-0.5">RAM buffer</div>
            <div className="font-mono text-xs text-white">{ramGB} GB</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
          <div className="flex-1 rounded-lg border border-sky-600 bg-sky-950/30 p-2 text-center">
            <Server className="w-4 h-4 mx-auto text-sky-400" />
            <div className="text-[9px] text-gray-400 mt-0.5">GPUs</div>
            <div className="font-mono text-xs text-white">batches</div>
          </div>
        </div>

        {swaps && (
          <div className="mt-2 text-[10px] text-brand-rose text-center font-bold flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Buffer too small — OS starts swapping to disk
          </div>
        )}
      </div>

      <div className="max-w-xl mx-auto w-full flex items-center gap-3 mb-3">
        <span className="text-[10px] text-gray-400 shrink-0">System RAM</span>
        <input
          type="range"
          min="64"
          max="512"
          step="64"
          value={ramGB}
          onChange={(e) => setRamGB(Number(e.target.value))}
          className="flex-1 accent-brand-green"
        />
        <span className="font-mono text-xs text-white w-14 text-right">{ramGB} GB</span>
      </div>

      <p className="text-sm text-gray-300 text-center max-w-xl mx-auto">
        With ~64 GB reserved for the OS and three concurrent users, a {ramGB} GB machine leaves{' '}
        <strong className="text-white">{buffer} GB</strong> for staging. The worked example picks{' '}
        <strong className="text-brand-green">256 GB</strong> so the loaders never spill back to disk.
      </p>
    </div>
  );
}

/* ── 6. Storage, network, power ───────────────────────────────────────────── */

export function StorageNetPowerVisualizer() {
  const [view, setView] = useState('net');
  const [gpus, setGpus] = useState(4);

  const transfer1g = (500 * 8) / 1; // seconds
  const transfer10g = (500 * 8) / 10;
  const gpuW = gpus * 450;
  const cpuW = 300;
  const otherW = 200;
  const draw = gpuW + cpuW + otherW;
  const psu = 2000;
  const ok = draw < psu * 0.9;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Storage, Network, and Power</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Three supporting decisions that keep the four 4090s busy and alive.
        </p>
      </div>

      <Tabs
        value={view}
        onChange={setView}
        accent="bg-brand-orange"
        options={[
          { id: 'storage', label: 'Storage tiers' },
          { id: 'net', label: '1 GbE vs 10 GbE' },
          { id: 'psu', label: 'PSU headroom' },
        ]}
      />

      {view === 'storage' && (
        <>
          <div className="max-w-xl mx-auto w-full grid grid-cols-2 gap-3 mb-3">
            <div className="rounded-xl border-2 border-amber-500 bg-amber-950/20 p-3">
              <div className="text-[10px] text-amber-400 font-bold uppercase">Hot</div>
              <div className="text-white font-bold">4 TB NVMe Gen4</div>
              <p className="text-[11px] text-gray-400 mt-1">
                OS + software + 500 GB active dataset. High read speed saturates the GPUs.
              </p>
            </div>
            <div className="rounded-xl border-2 border-orange-600 bg-orange-950/20 p-3">
              <div className="text-[10px] text-orange-400 font-bold uppercase">Cold</div>
              <div className="text-white font-bold">8 TB SATA SSD</div>
              <p className="text-[11px] text-gray-400 mt-1">
                Checkpoints for a 70B model can exceed 100 GB each. Cheap, still far faster than HDD.
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-300 text-center max-w-xl mx-auto">
            Same tier idea as Part 2 — NVMe for the working set, SATA for what you keep.
          </p>
        </>
      )}

      {view === 'net' && (
        <>
          <div className="max-w-xl mx-auto w-full space-y-3 mb-3">
            {[
              { name: '1 GbE', s: transfer1g, tone: 'bg-brand-rose' },
              { name: '10 GbE', s: transfer10g, tone: 'bg-brand-green' },
            ].map((x) => (
              <div key={x.name}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-400">500 GB over {x.name}</span>
                  <span className="font-mono text-white">
                    {x.s >= 60 ? `${(x.s / 60).toFixed(0)} min` : `${x.s.toFixed(0)} s`}
                  </span>
                </div>
                <div className="h-4 rounded-full bg-gray-900 overflow-hidden">
                  <div
                    className={`h-full ${x.tone}`}
                    style={{ width: `${(x.s / transfer1g) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-300 text-center max-w-xl mx-auto">
            Standard 1 GbE takes over an hour. <strong className="text-brand-green">10 GbE</strong>{' '}
            is a 10× speedup — worth it when three engineers keep reloading the corpus.
          </p>
        </>
      )}

      {view === 'psu' && (
        <>
          <div className="max-w-xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3 font-mono text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">{gpus} × 450W (4090)</span>
              <span className="text-sky-300">{gpuW} W</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">CPU under load</span>
              <span className="text-fuchsia-300">{cpuW} W</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Board, RAM, storage, fans</span>
              <span className="text-amber-300">{otherW} W</span>
            </div>
            <div className="flex justify-between border-t border-gray-700 pt-1 font-bold">
              <span className="text-white">Peak draw</span>
              <span className={ok ? 'text-brand-green' : 'text-brand-rose'}>{draw} W</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>PSU rating</span>
              <span>2000 W 80+ Titanium</span>
            </div>
          </div>

          <div className="max-w-xl mx-auto w-full flex items-center gap-3 mb-3">
            <span className="text-[10px] text-gray-400 shrink-0">GPUs</span>
            <input
              type="range"
              min="1"
              max="4"
              value={gpus}
              onChange={(e) => setGpus(Number(e.target.value))}
              className="flex-1 accent-brand-orange"
            />
            <span className="font-mono text-xs text-white w-4 text-right">{gpus}</span>
          </div>

          <p className="text-sm text-center max-w-xl mx-auto">
            {ok ? (
              <span className="text-brand-green">
                {psu - draw} W of headroom for power spikes during a 48-hour run. Titanium efficiency
                also cuts heat and electricity cost.
              </span>
            ) : (
              <span className="text-brand-rose">Over the PSU rating — need a bigger supply or fewer GPUs.</span>
            )}
          </p>
        </>
      )}
    </div>
  );
}

/* ── 7. Practice scenario (YOLO) ──────────────────────────────────────────── */

const YOLO_QS = [
  {
    id: 'gpus',
    q: 'Will you still need four GPUs?',
    options: [
      { id: 'four', label: 'Keep 4× 4090', ok: false, why: 'Overkill for YOLOv8 — burns budget on idle silicon.' },
      { id: 'one', label: '1× mid/high GPU', ok: true, why: 'Object detection fine-tunes and serves well on a single strong GPU. Inference <30 ms is the priority.' },
    ],
  },
  {
    id: 'mem',
    q: 'Is system RAM or VRAM more important here?',
    options: [
      { id: 'vram', label: 'Max VRAM', ok: false, why: 'YOLOv8 is not a 70B LLM — VRAM needs are modest. The 2 TB image set stresses storage and RAM staging.' },
      { id: 'ram', label: 'RAM + fast storage', ok: true, why: '2 TB of images means IOPS and a solid RAM buffer matter more than enormous VRAM.' },
    ],
  },
  {
    id: 'psu',
    q: 'How does 24/7 inference change the PSU?',
    options: [
      { id: 'big', label: '2000W Titanium anyway', ok: false, why: 'You are not powering four 450W cards. Efficiency still matters, but wattage can drop.' },
      { id: 'eff', label: 'Smaller, high-efficiency PSU', ok: true, why: '24/7 cost is electricity. A right-sized Platinum/Titanium PSU at high load efficiency wins.' },
    ],
  },
];

export function PracticeScenarioVisualizer() {
  const [answers, setAnswers] = useState({});
  const done = YOLO_QS.every((q) => answers[q.id]);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Your Turn: YOLOv8 QC Server</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Real-time object detection, 2 TB of images, &lt;30 ms/frame, moderate budget, 24/7 inference.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full space-y-3 mb-3">
        {YOLO_QS.map((q) => (
          <div key={q.id} className="rounded-xl border border-gray-700 bg-gray-950 p-3">
            <div className="text-xs font-bold text-white mb-2">{q.q}</div>
            <div className="flex gap-2 mb-2">
              {q.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                  className={`flex-1 py-2 text-[11px] rounded-lg border font-bold ${
                    answers[q.id] === o.id
                      ? o.ok
                        ? 'bg-brand-green border-brand-green text-white'
                        : 'bg-brand-rose border-brand-rose text-white'
                      : 'bg-gray-900 border-gray-600 text-gray-400'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {answers[q.id] && (
              <p className="text-[11px] text-gray-300">
                {q.options.find((o) => o.id === answers[q.id]).why}
              </p>
            )}
          </div>
        ))}
      </div>

      {done && (
        <div className="max-w-xl mx-auto w-full rounded-xl border border-brand-green/50 bg-brand-green/10 p-3 text-sm text-gray-200">
          <div className="font-bold text-brand-green mb-1 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> A different sheet entirely
          </div>
          One strong inference GPU, emphasis on NVMe IOPS for millions of images, enough RAM to
          stage batches, and a right-sized efficient PSU for continuous duty — not a four-GPU LLM
          box.
        </div>
      )}
    </div>
  );
}

/* ── 8. Pre-flight compatibility ──────────────────────────────────────────── */

export function PreflightVisualizer() {
  const [gpuWidth, setGpuWidth] = useState(3); // slots occupied
  const [connectors, setConnectors] = useState(2); // per GPU
  const [gpus, setGpus] = useState(4);

  // dual-slot can often do 4 if spaced; triple-slot maybe 2
  const canFit = gpuWidth <= 2 ? gpus <= 4 : gpus <= 2;
  const needConnectors = gpus * connectors;
  const psuHas = 8;
  const connOk = needConnectors <= psuHas;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Pre-Flight Compatibility Check</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Before you open a single box — socket, spacing, length, and connectors.
        </p>
      </div>

      {/* checklist */}
      <div className="max-w-xl mx-auto w-full space-y-2 mb-3 text-[11px]">
        {[
          { ok: true, t: 'CPU socket matches motherboard (sTR5 ↔ TRX50)' },
          { ok: canFit, t: `${gpus}× ${gpuWidth}-slot GPUs in a 4-slot board` },
          { ok: true, t: 'Chassis clears GPU length and cooler height' },
          { ok: connOk, t: `PSU has ${needConnectors} PCIe power connectors (has ${psuHas})` },
        ].map((x, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
              x.ok ? 'border-brand-green/40 bg-brand-green/5' : 'border-brand-rose/40 bg-brand-rose/5'
            }`}
          >
            {x.ok ? (
              <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-brand-rose shrink-0" />
            )}
            <span className={x.ok ? 'text-gray-300' : 'text-brand-rose'}>{x.t}</span>
          </div>
        ))}
      </div>

      {/* slot spacing visual */}
      <div className="max-w-xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="text-[10px] text-gray-500 mb-2">Motherboard slot map</div>
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => {
            const occupied = i < gpus;
            const blocked = gpuWidth >= 3 && i > 0 && i < gpus * 2 && i % 2 === 1;
            return (
              <div
                key={i}
                className={`flex-1 h-12 rounded border-2 flex items-center justify-center text-[9px] font-bold ${
                  occupied && !blocked
                    ? 'border-brand-green bg-brand-green/20 text-brand-green'
                    : blocked
                      ? 'border-gray-700 bg-gray-900 text-gray-600'
                      : 'border-dashed border-gray-600 text-gray-600'
                }`}
              >
                {occupied && !blocked ? `GPU` : blocked ? 'blocked' : 'x16'}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-xl mx-auto w-full space-y-2 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 w-24 shrink-0">GPU width</span>
          <input
            type="range"
            min="2"
            max="3"
            value={gpuWidth}
            onChange={(e) => setGpuWidth(Number(e.target.value))}
            className="flex-1 accent-brand-blue"
          />
          <span className="font-mono text-xs text-white w-16 text-right">{gpuWidth}-slot</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 w-24 shrink-0">GPU count</span>
          <input
            type="range"
            min="1"
            max="4"
            value={gpus}
            onChange={(e) => setGpus(Number(e.target.value))}
            className="flex-1 accent-brand-green"
          />
          <span className="font-mono text-xs text-white w-16 text-right">{gpus}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 w-24 shrink-0">Power plugs / GPU</span>
          <input
            type="range"
            min="1"
            max="3"
            value={connectors}
            onChange={(e) => setConnectors(Number(e.target.value))}
            className="flex-1 accent-brand-orange"
          />
          <span className="font-mono text-xs text-white w-16 text-right">
            {connectors}× 8-pin
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-300 text-center max-w-xl mx-auto">
        Four physical x16 slots do not guarantee four triple-width cards. And four GPUs with two
        8-pin plugs each need <strong className="text-white">eight dedicated connectors</strong> on
        the PSU.
      </p>
    </div>
  );
}

/* ── 9. Assembly workflow ─────────────────────────────────────────────────── */

const ASSEMBLY = [
  { id: 1, title: 'Prepare motherboard', detail: 'Install CPU, RAM, and M.2 drives while the board is on a bench — far easier than inside the case.' },
  { id: 2, title: 'Install motherboard in chassis', detail: 'Seat on standoffs, screw down, route the front-panel cables.' },
  { id: 3, title: 'Install PSU and cooling', detail: 'Mount the PSU, then the CPU cooler or AIO radiator (240/360 mm mounts).' },
  { id: 4, title: 'Install GPUs', detail: 'Seat each card firmly, one by one. Connect NVLink bridges only after the cards are secured.' },
  { id: 5, title: 'Connect storage and power cables', detail: 'Cable management is thermal management — messy cables block front-to-back airflow and throttle GPUs.' },
  { id: 6, title: 'BIOS / UEFI configuration', detail: 'Above 4G Decoding, Resizable BAR, and forced PCIe Gen — covered on the next slide.' },
  { id: 7, title: 'OS & driver installation', detail: 'Ubuntu Server LTS, then proprietary NVIDIA drivers with CUDA.' },
  { id: 8, title: 'System verification', detail: 'Run nvidia-smi and confirm every GPU appears with the expected VRAM.' },
];

export function AssemblyFlowVisualizer() {
  const [step, setStep] = useState(0);
  const s = ASSEMBLY[step];
  const done = step >= ASSEMBLY.length;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Assembly Workflow</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Order matters — install the fiddly parts on the bench before the board goes in the case.
        </p>
      </div>

      <div className="max-w-md mx-auto w-full mb-3">
        <div className="rounded-full bg-brand-green/20 border border-brand-green text-brand-green text-[11px] font-bold text-center py-2 mb-2">
          Start: Components Acquired
        </div>

        {ASSEMBLY.slice(0, Math.min(step + 1, ASSEMBLY.length)).map((x, i) => (
          <div key={x.id}>
            <div className="text-center text-gray-600 text-xs">↓</div>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`w-full rounded-xl border-2 px-3 py-2 text-left text-xs transition ${
                i === step
                  ? 'border-brand-orange bg-brand-orange/10 text-white'
                  : 'border-gray-700 bg-gray-900 text-gray-400'
              }`}
            >
              <span className="font-bold">{x.id}. {x.title}</span>
            </button>
          </div>
        ))}

        {done && (
          <>
            <div className="text-center text-gray-600 text-xs">↓</div>
            <div className="rounded-full bg-brand-green text-gray-950 text-[11px] font-bold text-center py-2">
              Bare-Metal Server Ready
            </div>
          </>
        )}
      </div>

      {!done && (
        <div className="max-w-md mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
          <div className="text-xs font-bold text-white mb-1">
            Step {s.id}: {s.title}
          </div>
          <p className="text-sm text-gray-300">{s.detail}</p>
        </div>
      )}

      <div className="max-w-md mx-auto w-full flex gap-2">
        <button
          type="button"
          onClick={() => setStep((x) => Math.max(0, x - 1))}
          disabled={step === 0}
          className="flex-1 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-bold disabled:opacity-30"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep((x) => Math.min(ASSEMBLY.length, x + 1))}
          disabled={done}
          className="flex-1 py-2 rounded-lg bg-brand-blue text-white text-xs font-bold disabled:opacity-30 flex items-center justify-center gap-1"
        >
          {done ? 'Done' : 'Next step'} <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── 10. BIOS + nvidia-smi ────────────────────────────────────────────────── */

export function BiosDriverVisualizer() {
  const [above4g, setAbove4g] = useState(true);
  const [rebar, setRebar] = useState(true);
  const [gen, setGen] = useState(4);
  const [showSmi, setShowSmi] = useState(false);

  const gpusVisible = above4g ? 4 : 1;
  const barChunk = rebar ? 'full VRAM' : '256 MB chunks';

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">BIOS, Drivers, and nvidia-smi</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Three firmware toggles decide whether all four GPUs even appear. Then verify with one
          command.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full space-y-2 mb-3">
        <button
          type="button"
          onClick={() => setAbove4g((v) => !v)}
          className={`w-full rounded-xl border-2 p-3 text-left ${
            above4g ? 'border-brand-green bg-brand-green/10' : 'border-brand-rose bg-brand-rose/10'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white">Above 4G Decoding</span>
            <span className={`text-[10px] font-mono font-bold ${above4g ? 'text-brand-green' : 'text-brand-rose'}`}>
              {above4g ? 'ENABLED' : 'OFF'}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Lets a 64-bit OS address the huge memory maps of multiple GPUs. Off → often only one GPU
            visible.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setRebar((v) => !v)}
          className={`w-full rounded-xl border-2 p-3 text-left ${
            rebar ? 'border-brand-green bg-brand-green/10' : 'border-gray-700 bg-gray-950'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white">Resizable BAR</span>
            <span className={`text-[10px] font-mono font-bold ${rebar ? 'text-brand-green' : 'text-gray-500'}`}>
              {rebar ? 'ENABLED' : 'OFF'}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            CPU sees the {barChunk} of each GPU instead of 256 MB windows — a real throughput win.
          </p>
        </button>

        <div className="w-full rounded-xl border-2 border-gray-700 bg-gray-950 p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-white">PCIe Link Speed</span>
            <span className="text-[10px] font-mono text-brand-blue">Gen {gen}.0</span>
          </div>
          <div className="flex gap-2">
            {[3, 4, 5].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGen(g)}
                className={`flex-1 py-1.5 text-[11px] rounded border font-bold ${
                  gen === g
                    ? 'bg-brand-blue border-brand-blue text-white'
                    : 'bg-gray-900 border-gray-600 text-gray-400'
                }`}
              >
                Gen {g}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Force the highest generation your board and cards support — auto-negotiate can quietly
            drop you a generation.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto w-full grid grid-cols-2 gap-2 mb-3">
        <Stat
          label="GPUs visible to OS"
          value={`${gpusVisible} / 4`}
          tone={above4g ? 'text-brand-green' : 'text-brand-rose'}
        />
        <Stat label="CPU→VRAM access" value={barChunk} tone={rebar ? 'text-brand-green' : 'text-brand-orange'} />
      </div>

      <button
        type="button"
        onClick={() => setShowSmi(true)}
        className="max-w-xl mx-auto w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-brand-green font-mono text-xs font-bold mb-2"
      >
        $ nvidia-smi
      </button>

      {showSmi && (
        <div className="max-w-xl mx-auto w-full rounded-lg border border-gray-600 bg-black p-3 font-mono text-[9px] text-green-400 overflow-x-auto">
          <div className="text-gray-500 mb-1">
            Driver Version: 535.104.05 · CUDA Version: 12.2
          </div>
          <div className="border border-gray-700 mb-1" />
          {Array.from({ length: gpusVisible }).map((_, i) => (
            <div key={i} className="mb-1">
              | {i} | NVIDIA GeForce RTX 4090 | 32% | 42C | P0 | 45W / 450W |{' '}
              {rebar ? '12MiB' : '12MiB'} / 24564MiB | 0% |
            </div>
          ))}
          {!above4g && (
            <div className="text-brand-rose mt-2">
              # warning: only GPU 0 enumerated — enable Above 4G Decoding
            </div>
          )}
        </div>
      )}
    </div>
  );
}
