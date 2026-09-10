import React, { useState, useEffect } from 'react';
import {
  Cpu,
  HardDrive,
  Zap,
  AlertTriangle,
  CheckCircle,
  Server,
  Layers,
  Activity,
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

function Meter({ label, value, max = 100, color = 'bg-brand-orange', suffix = '%' }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
        <span>{label}</span>
        <span className="font-mono text-white">
          {typeof value === 'number' ? value.toFixed(value < 10 ? 1 : 0) : value}
          {suffix}
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
        <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ── 1. Training pillars + GPU tiers ──────────────────────────────────────── */

const GPU_TIERS = [
  {
    id: 'hp',
    name: 'High-Performance',
    chips: 'H100 · A100',
    tone: 'border-rose-400 bg-rose-500/10',
    accent: 'text-rose-300',
    features: ['Large HBM2e / HBM3', 'NVLink multi-GPU', 'Tensor Cores'],
    use: 'Train LLMs, diffusion, or complex CV from scratch',
    value: 'Weeks → days/hours of wall-clock time',
  },
  {
    id: 'gp',
    name: 'General / Inference',
    chips: 'A10G · L4 · T4',
    tone: 'border-sky-400 bg-sky-500/10',
    accent: 'text-sky-300',
    features: ['Balanced perf / cost', 'Lower power draw', 'Wide availability'],
    use: 'Smaller models, fine-tuning, cost-effective inference',
    value: 'Best price-performance for mid-size jobs',
  },
  {
    id: 'prev',
    name: 'Previous Generation',
    chips: 'V100 · P100',
    tone: 'border-amber-400 bg-amber-500/10',
    accent: 'text-amber-300',
    features: ['Still capable', 'Often discounted', 'Mature software stack'],
    use: 'Tight budgets or workloads that do not need cutting-edge silicon',
    value: 'Stretch the training dollar',
  },
];

export function TrainingPillarsVisualizer() {
  const [tier, setTier] = useState('hp');
  const t = GPU_TIERS.find((x) => x.id === tier);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The Training Balancing Act</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Pick a VM by balancing three pillars — then match a GPU tier to the job.
        </p>
      </div>

      <div className="max-w-3xl mx-auto w-full grid grid-cols-3 gap-2 mb-4">
        {[
          { icon: Zap, label: 'GPU', sub: 'FLOPS for matrix math' },
          { icon: Cpu, label: 'CPU', sub: 'Data loading & prep' },
          { icon: HardDrive, label: 'RAM', sub: 'Dataset & batch buffers' },
        ].map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-700 bg-gray-900/80 p-3 text-center"
          >
            <Icon className="w-5 h-5 mx-auto mb-1 text-brand-orange" />
            <div className="text-white font-bold text-sm">{label}</div>
            <div className="text-[10px] text-gray-400">{sub}</div>
          </div>
        ))}
      </div>

      <Tabs
        options={GPU_TIERS.map((x) => ({ id: x.id, label: x.name }))}
        value={tier}
        onChange={setTier}
        accent="bg-rose-600"
      />

      <div className={`max-w-xl mx-auto w-full rounded-2xl border p-4 ${t.tone}`}>
        <div className={`text-xs font-bold uppercase mb-1 ${t.accent}`}>{t.chips}</div>
        <ul className="text-sm text-gray-200 space-y-1 mb-3">
          {t.features.map((f) => (
            <li key={f}>• {f}</li>
          ))}
        </ul>
        <p className="text-sm text-white mb-1">
          <span className="text-gray-400">Use:</span> {t.use}
        </p>
        <p className="text-xs text-gray-400 italic">{t.value}</p>
      </div>
    </div>
  );
}

/* ── 2. VRAM calculator (Adam: 16 B/param) ────────────────────────────────── */

const GPU_CAP = [
  { id: 't4', name: 'T4', gb: 16 },
  { id: 'a10', name: 'A10G', gb: 24 },
  { id: 'a100', name: 'A100', gb: 80 },
  { id: 'h100', name: 'H100', gb: 80 },
];

export function VramCalculatorVisualizer() {
  const [paramsB, setParamsB] = useState(7);
  const [gpu, setGpu] = useState('a100');
  const g = GPU_CAP.find((x) => x.id === gpu);

  const weights = paramsB * 4; // GB (approx: B params × 4 bytes)
  const grads = paramsB * 4;
  const opt = paramsB * 8;
  const total = weights + grads + opt; // = paramsB * 16
  const fits = total <= g.gb;
  const fillPct = Math.min(100, (total / g.gb) * 100);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">VRAM: The Real Constraint</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          With Adam, each parameter needs ~16 bytes — often before activations are counted.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full space-y-4">
        <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-4">
          <div className="font-mono text-center text-sm text-brand-orange mb-3">
            mem ≈ params × (4<sub>w</sub> + 4<sub>g</sub> + 8<sub>opt</sub>) = params × 16 bytes
          </div>
          <label className="block text-xs text-gray-400 mb-2">
            Model size: <span className="text-white font-mono">{paramsB}B</span> parameters
          </label>
          <input
            type="range"
            min={1}
            max={70}
            step={1}
            value={paramsB}
            onChange={(e) => setParamsB(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>1B</span>
            <span>70B</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Weights', val: weights, c: 'bg-sky-500' },
            { label: 'Gradients', val: grads, c: 'bg-violet-500' },
            { label: 'Adam states', val: opt, c: 'bg-brand-orange' },
          ].map((b) => (
            <div key={b.label} className="rounded-lg border border-gray-700 bg-gray-900 p-2">
              <div className={`h-1.5 rounded ${b.c} mb-2`} />
              <div className="text-[10px] text-gray-400">{b.label}</div>
              <div className="text-white font-mono text-sm">{b.val.toFixed(0)} GB</div>
              <div className="text-[10px] text-gray-500">
                {b.label === 'Adam states' ? '8 B/param' : '4 B/param'}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-4">
          <div className="flex justify-between items-end mb-2">
            <div>
              <div className="text-xs text-gray-400">Total (excl. activations)</div>
              <div className="text-2xl font-bold text-white font-mono">~{total.toFixed(0)} GB</div>
            </div>
            <Tabs
              options={GPU_CAP.map((x) => ({ id: x.id, label: `${x.name}` }))}
              value={gpu}
              onChange={setGpu}
              accent="bg-brand-orange"
            />
          </div>
          <div className="h-8 rounded-lg bg-gray-800 overflow-hidden relative border border-gray-700">
            <div
              className={`h-full transition-all duration-400 ${fits ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${fillPct}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
              {g.name} · {g.gb} GB HBM
            </div>
          </div>
          <p className={`mt-2 text-sm flex items-center gap-2 ${fits ? 'text-emerald-300' : 'text-rose-300'}`}>
            {fits ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {fits
              ? `Fits on ${g.name} (still need room for activations / batch).`
              : `Overflow — need multi-GPU, sharding, or a larger accelerator.`}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">
            Example: 7B × 16 B ≈ 112 GB — beyond a single 16 GB card without tricks.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 3. CPU / RAM bottleneck simulator ────────────────────────────────────── */

export function BottleneckFeedVisualizer() {
  const [vcpu, setVcpu] = useState(4);
  const [ram, setRam] = useState(16);

  const cpuFeed = Math.min(100, (vcpu / 8) * 100);
  const ramOk = ram >= 48;
  const util = Math.min(cpuFeed, ramOk ? 100 : 55);
  const starved = util < 90;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Keep the GPU Fed</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Under 90% GPU util usually means a CPU or I/O bottleneck — not a weak accelerator.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full space-y-4">
        <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-4 space-y-3">
          <label className="block text-xs text-gray-400">
            vCPUs for data pipeline:{' '}
            <span className="text-white font-mono">{vcpu}</span>
            <span className="text-gray-500"> (ref: ~8 vCPU / T4)</span>
          </label>
          <input
            type="range"
            min={1}
            max={16}
            value={vcpu}
            onChange={(e) => setVcpu(Number(e.target.value))}
            className="w-full accent-sky-500"
          />
          <label className="block text-xs text-gray-400">
            System RAM:{' '}
            <span className="text-white font-mono">{ram} GB</span>
            <span className="text-gray-500"> (ref: ~61 GB / T4)</span>
          </label>
          <input
            type="range"
            min={8}
            max={128}
            step={8}
            value={ram}
            onChange={(e) => setRam(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
        </div>

        <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wide">
          {['Storage', 'RAM', 'vCPU prep', 'GPU'].map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={`flex-1 rounded-lg border px-2 py-3 text-center ${
                  s === 'GPU'
                    ? starved
                      ? 'border-rose-500/60 bg-rose-500/10 text-rose-200'
                      : 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'
                    : s === 'vCPU prep' && cpuFeed < 90
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-200'
                      : s === 'RAM' && !ramOk
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-200'
                        : 'border-gray-700 bg-gray-900 text-gray-300'
                }`}
              >
                {s}
              </div>
              {i < 3 && <span className="text-gray-600">→</span>}
            </React.Fragment>
          ))}
        </div>

        <Meter label="GPU utilization" value={util} color={starved ? 'bg-rose-500' : 'bg-emerald-500'} />
        <Meter label="Data feed rate (vs GPU)" value={Math.min(cpuFeed, ramOk ? 100 : 60)} color="bg-sky-500" />

        <div
          className={`rounded-xl border p-3 text-sm ${
            starved
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-100'
              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
          }`}
        >
          {starved ? (
            <>
              <strong>Bottleneck:</strong>{' '}
              {!ramOk
                ? 'Dataset spills to disk → I/O starves the GPU.'
                : 'Too few vCPUs for load / augment / batch — GPU waits idle.'}
            </>
          ) : (
            <>
              <strong>Balanced:</strong> Pipeline keeps pace. Cloud ratios (e.g. 8 vCPU + 61 GB per
              T4) exist for this reason.
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 4. Instance name decoder ─────────────────────────────────────────────── */

const NAMES = [
  {
    id: 'aws',
    cloud: 'AWS',
    full: 'p4d.24xlarge',
    parts: [
      { token: 'p', meaning: 'Accelerated computing (GPU family)' },
      { token: '4', meaning: 'Generation 4' },
      { token: 'd', meaning: 'Local NVMe SSD included' },
      { token: '24xlarge', meaning: 'Size → 96 vCPUs in this family' },
    ],
  },
  {
    id: 'gcp',
    cloud: 'GCP',
    full: 'a2-highgpu-1g',
    parts: [
      { token: 'a2', meaning: 'Accelerator-optimized (A100)' },
      { token: 'highgpu', meaning: 'GPU-to-CPU ratio preset' },
      { token: '1g', meaning: 'One GPU attached' },
    ],
  },
  {
    id: 'azure',
    cloud: 'Azure',
    full: 'Standard_ND96asr_v4',
    parts: [
      { token: 'ND', meaning: 'GPU family for AI / HPC' },
      { token: '96', meaning: '96 vCPUs' },
      { token: 'a', meaning: 'AMD CPU' },
      { token: 's', meaning: 'Premium storage capable' },
      { token: 'r', meaning: 'RDMA networking' },
      { token: 'v4', meaning: 'Version 4 of the type' },
    ],
  },
];

export function InstanceNameDecoderVisualizer() {
  const [cloud, setCloud] = useState('aws');
  const [partIdx, setPartIdx] = useState(0);
  const n = NAMES.find((x) => x.id === cloud);
  const part = n.parts[partIdx] || n.parts[0];

  useEffect(() => setPartIdx(0), [cloud]);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Decoding Instance Names</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Family, generation, size, storage, and networking are encoded in the name. Tap each segment.
        </p>
      </div>

      <Tabs
        options={NAMES.map((x) => ({ id: x.id, label: x.cloud }))}
        value={cloud}
        onChange={setCloud}
      />

      <div className="max-w-xl mx-auto w-full">
        <div className="flex flex-wrap justify-center gap-1 mb-4 font-mono text-lg">
          {n.parts.map((p, i) => (
            <button
              key={p.token}
              type="button"
              onClick={() => setPartIdx(i)}
              className={`px-2.5 py-1.5 rounded-lg border transition ${
                i === partIdx
                  ? 'border-brand-orange bg-brand-orange/20 text-brand-orange'
                  : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500'
              }`}
            >
              {p.token}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-700 bg-gray-900/80 p-5 text-center">
          <div className="text-xs text-gray-500 mb-1">{n.full}</div>
          <div className="text-3xl font-mono font-bold text-brand-orange mb-2">{part.token}</div>
          <p className="text-gray-200 text-sm">{part.meaning}</p>
        </div>
      </div>
    </div>
  );
}

/* ── 5. Training VM decision flow ─────────────────────────────────────────── */

export function TrainingDecisionVisualizer() {
  const [model, setModel] = useState(null);
  const [data, setData] = useState(null);

  const gpu =
    model === 'small' ? 'Cost-effective: NVIDIA A10G / T4' : model === 'large' ? 'High-performance: A100 / H100' : null;
  const cpu =
    data === 'heavy' ? 'High vCPU count' : data === 'simple' ? 'Standard vCPU count' : null;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Training VM Decision Flow</h3>
        <p className="text-gray-400 text-sm">Model size drives GPU; data pipeline drives CPU / RAM.</p>
      </div>

      <div className="max-w-2xl mx-auto w-full space-y-3">
        <div className="rounded-full mx-auto w-fit px-4 py-2 bg-sky-200 text-sky-950 text-xs font-bold">
          Define Training Workload
        </div>

        <div className="rounded-2xl border border-gray-600 bg-gray-100/95 text-gray-900 p-4 space-y-4">
          <div>
            <div className="text-xs font-bold uppercase text-gray-500 mb-2">Model size &amp; batch size?</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setModel('small')}
                className={`rounded-xl border-2 p-3 text-left text-sm ${
                  model === 'small' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-white'
                }`}
              >
                <div className="font-bold text-emerald-800">Small (e.g. ResNet)</div>
                <div className="text-xs text-gray-600">&lt; 24 GB VRAM</div>
              </button>
              <button
                type="button"
                onClick={() => setModel('large')}
                className={`rounded-xl border-2 p-3 text-left text-sm ${
                  model === 'large' ? 'border-rose-500 bg-rose-50' : 'border-gray-300 bg-white'
                }`}
              >
                <div className="font-bold text-rose-800">Large (e.g. LLM)</div>
                <div className="text-xs text-gray-600">&gt; 40 GB VRAM</div>
              </button>
            </div>
            {gpu && (
              <div className="mt-2 text-sm font-semibold text-center rounded-lg bg-gray-900 text-white py-2">
                → Select GPU: {gpu}
              </div>
            )}
          </div>

          <div>
            <div className="text-xs font-bold uppercase text-gray-500 mb-2">Data pipeline complexity?</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setData('heavy')}
                className={`rounded-xl border-2 p-3 text-left text-sm ${
                  data === 'heavy' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white'
                }`}
              >
                <div className="font-bold text-orange-800">Heavy augmentation</div>
                <div className="text-xs text-gray-600">Image / video pipelines</div>
              </button>
              <button
                type="button"
                onClick={() => setData('simple')}
                className={`rounded-xl border-2 p-3 text-left text-sm ${
                  data === 'simple' ? 'border-sky-500 bg-sky-50' : 'border-gray-300 bg-white'
                }`}
              >
                <div className="font-bold text-sky-800">Simple loading</div>
                <div className="text-xs text-gray-600">Tabular / light prep</div>
              </button>
            </div>
            {cpu && (
              <div className="mt-2 text-sm font-semibold text-center rounded-lg bg-gray-900 text-white py-2">
                → Select vCPU / RAM: {cpu}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-3 text-xs text-gray-300">
          <span className="text-gray-500 font-bold uppercase">Examples · </span>
          AWS <span className="text-rose-300 font-mono">p4 / g5</span> · GCP{' '}
          <span className="text-rose-300 font-mono">a2 / g2</span> · Azure{' '}
          <span className="text-rose-300 font-mono">ND / NC</span>
        </div>
      </div>
    </div>
  );
}

/* ── 6. Networking + storage ──────────────────────────────────────────────── */

export function NetStorageVisualizer() {
  const [mode, setMode] = useState('net');
  const [fast, setFast] = useState(true);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Networking &amp; Storage</h3>
        <p className="text-gray-400 text-sm">Distributed jobs need fabric bandwidth; training caches love local NVMe.</p>
      </div>

      <Tabs
        options={[
          { id: 'net', label: 'Networking' },
          { id: 'io', label: 'Local Storage' },
          { id: 'balance', label: 'System Balance' },
        ]}
        value={mode}
        onChange={setMode}
      />

      <div className="max-w-xl mx-auto w-full">
        {mode === 'net' && (
          <div className="space-y-3">
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setFast(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${!fast ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                Standard NIC
              </button>
              <button
                type="button"
                onClick={() => setFast(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${fast ? 'bg-brand-orange text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                EFA / RDMA
              </button>
            </div>
            <div className="flex justify-center gap-6 py-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative">
                  <div className="w-16 h-20 rounded-lg border border-gray-600 bg-gray-900 flex flex-col items-center justify-center">
                    <Server className="w-5 h-5 text-sky-400 mb-1" />
                    <span className="text-[10px] text-gray-400">Node {i + 1}</span>
                  </div>
                  {i < 2 && (
                    <div
                      className={`absolute top-1/2 left-full w-6 h-0.5 -translate-y-1/2 ${
                        fast ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-center text-gray-300">
              {fast
                ? 'High bandwidth + low latency — look for AWS EFA or Azure RDMA-capable families.'
                : 'Standard networking bottlenecks all-reduce and multi-node training.'}
            </p>
          </div>
        )}

        {mode === 'io' && (
          <div className="space-y-3">
            <div className="flex justify-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setFast(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${!fast ? 'bg-rose-600 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                Network disk
              </button>
              <button
                type="button"
                onClick={() => setFast(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${fast ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                Local NVMe
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold">
              {['Object store', fast ? 'Local NVMe' : 'Network disk', 'GPU'].map((s, i) => (
                <React.Fragment key={s}>
                  <div
                    className={`rounded-lg border px-3 py-4 ${
                      s.includes('Network')
                        ? 'border-rose-500/50 bg-rose-500/10 text-rose-200'
                        : s.includes('NVMe')
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                          : 'border-gray-700 bg-gray-900 text-gray-300'
                    }`}
                  >
                    {s}
                  </div>
                  {i < 2 && (
                    <span className={fast ? 'text-emerald-400' : 'text-rose-400'}>
                      {fast ? '⟶' : '⟶ slow'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-sm text-center text-gray-300">
              Local NVMe caches subsets from object storage and avoids I/O bottlenecks that leave GPUs idle.
            </p>
          </div>
        )}

        {mode === 'balance' && (
          <div className="rounded-2xl border border-gray-700 bg-gray-900/80 p-5 text-center space-y-3">
            <Activity className="w-8 h-8 mx-auto text-brand-orange" />
            <p className="text-white text-sm">
              Selecting a training instance is a <strong>system design</strong> exercise — GPU, CPU, RAM,
              and I/O must work in harmony.
            </p>
            <p className="text-xs text-gray-400">
              An overpowered GPU with a starved CPU or slow disk wastes budget. Analyze the workload
              first, then pick the balanced instance for price-performance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 7. Inference CPU default ─────────────────────────────────────────────── */

export function InferenceCpuVisualizer() {
  const [sel, setSel] = useState('cpu');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Inference ≠ Training Hardware</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Training is a finite job; inference is 24/7 — latency and cost-per-prediction dominate.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full grid grid-cols-2 gap-2 mb-4">
        {[
          {
            id: 'cpu',
            title: 'CPU default',
            body: 'Best for sklearn, XGBoost, small nets — one request at a time, low latency, low idle cost.',
          },
          {
            id: 'gpu',
            title: 'Multi-GPU waste',
            body: 'Great for training batches; often idle and expensive for single real-time predictions.',
          },
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSel(c.id)}
            className={`rounded-xl border p-3 text-left ${
              sel === c.id
                ? c.id === 'cpu'
                  ? 'border-emerald-400 bg-emerald-500/10'
                  : 'border-rose-400 bg-rose-500/10'
                : 'border-gray-700 bg-gray-900/60'
            }`}
          >
            <div className="text-sm font-bold text-white mb-1">{c.title}</div>
            <div className="text-xs text-gray-400">{c.body}</div>
          </button>
        ))}
      </div>

      <div className="max-w-xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-900/80 p-4 space-y-2">
        <div className="text-xs font-bold uppercase text-emerald-400">Choose CPU when</div>
        <ul className="text-sm text-gray-300 space-y-1.5">
          <li>• Latency is critical and batching is not possible</li>
          <li>• Traffic is low to moderate (scale out horizontally)</li>
          <li>• Model is not GPU-saturating (trees, linear, small NNs)</li>
        </ul>
        <p className="text-xs text-gray-400 pt-2">
          General: AWS <span className="font-mono text-rose-300">m5</span> / GCP{' '}
          <span className="font-mono text-rose-300">e2</span> · Compute-opt:{' '}
          <span className="font-mono text-rose-300">c5</span> /{' '}
          <span className="font-mono text-rose-300">c2</span>
        </p>
      </div>
    </div>
  );
}

/* ── 8. Batching: latency vs throughput ───────────────────────────────────── */

export function BatchingVisualizer() {
  const [batch, setBatch] = useState(1);
  const [mode, setMode] = useState('serial');

  const util = mode === 'serial' ? 12 : Math.min(98, 15 + batch * 10);
  const throughput = mode === 'serial' ? 8 : 8 * Math.sqrt(batch) * 1.8;
  const latency = mode === 'serial' ? 12 : 12 + batch * 1.4;
  const cost = mode === 'serial' ? 1 : 1 / Math.sqrt(batch);

  useEffect(() => {
    if (mode === 'serial') setBatch(1);
  }, [mode]);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Batching Turns Latency → Throughput</h3>
        <p className="text-gray-400 text-sm">
          One-at-a-time underuses a GPU. Batch requests (app logic or Triton) to cut cost/inference.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'serial', label: 'Serial' },
          { id: 'batch', label: 'Batched' },
        ]}
        value={mode}
        onChange={setMode}
        accent="bg-emerald-600"
      />

      <div className="max-w-xl mx-auto w-full space-y-4">
        <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-3">
          <div className="flex gap-1 mb-2 h-8 items-end">
            {Array.from({ length: mode === 'serial' ? 4 : batch }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t ${mode === 'serial' ? 'bg-sky-500/40 h-3' : 'bg-emerald-500 h-full'} transition-all`}
                style={mode === 'serial' ? { height: `${30 + (i % 3) * 20}%` } : undefined}
              />
            ))}
          </div>
          <div className="text-[10px] text-center text-gray-500">
            {mode === 'serial' ? 'Requests enter one-by-one' : `Batch buffer · size ${batch}`}
          </div>
        </div>

        {mode === 'batch' && (
          <div>
            <label className="text-xs text-gray-400">
              Batch size: <span className="text-white font-mono">{batch}</span>
            </label>
            <input
              type="range"
              min={2}
              max={16}
              value={batch}
              onChange={(e) => setBatch(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        )}

        <div className="space-y-2">
          <Meter label="GPU utilization" value={util} color="bg-emerald-500" />
          <Meter label="Throughput (rel.)" value={throughput} max={50} color="bg-sky-500" suffix="" />
          <Meter label="Single-request latency (ms)" value={latency} max={40} color="bg-amber-500" suffix=" ms" />
          <Meter label="Cost / inference (rel.)" value={cost * 100} max={100} color="bg-rose-500" suffix="" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {[
            { name: 'T4', note: 'g4dn · n1+T4' },
            { name: 'L4', note: 'Video / genAI' },
            { name: 'A10G', note: 'g5 · larger' },
          ].map((g) => (
            <div key={g.name} className="rounded-lg border border-gray-700 bg-gray-900 p-2">
              <div className="font-bold text-white">{g.name}</div>
              <div className="text-gray-500 font-mono text-[10px]">{g.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 9. Inference decision flow ───────────────────────────────────────────── */

export function InferenceDecisionVisualizer() {
  const [size, setSize] = useState(null);
  const [traffic, setTraffic] = useState(null);
  const [latency, setLatency] = useState(null);

  let result = null;
  if (size === 'large' || traffic === 'high') {
    result = { label: 'Use GPU Instance', detail: 'e.g. T4 / L4', tone: 'bg-rose-200 text-rose-950' };
  } else if (size === 'small' && traffic === 'low' && latency === 'strict') {
    result = {
      label: 'Use CPU Instance',
      detail: 'General purpose — low latency, no batch wait',
      tone: 'bg-emerald-200 text-emerald-950',
    };
  } else if (size === 'small' && traffic === 'low' && latency === 'batch') {
    result = {
      label: 'Use GPU Instance',
      detail: 'Batching OK · T4 / L4',
      tone: 'bg-rose-200 text-rose-950',
    };
  }

  const showAsic = result?.label.includes('GPU');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Inference Instance Decision Flow</h3>
        <p className="text-gray-400 text-sm">
          Model size → traffic → latency. GPU choice hinges on whether you can batch.
        </p>
      </div>

      <div className="max-w-lg mx-auto w-full space-y-3">
        <div className="rounded-full mx-auto w-fit px-4 py-2 bg-sky-200 text-sky-950 text-xs font-bold">
          Start: Define Inference Requirements
        </div>

        <StepChoice
          title="Model size (e.g. > 1 GB)?"
          options={[
            { id: 'large', label: 'Large' },
            { id: 'small', label: 'Small' },
          ]}
          value={size}
          onChange={(v) => {
            setSize(v);
            setTraffic(null);
            setLatency(null);
          }}
        />

        {size === 'small' && (
          <StepChoice
            title="Traffic volume?"
            options={[
              { id: 'high', label: 'High' },
              { id: 'low', label: 'Low–Medium' },
            ]}
            value={traffic}
            onChange={(v) => {
              setTraffic(v);
              setLatency(null);
            }}
          />
        )}

        {size === 'small' && traffic === 'low' && (
          <StepChoice
            title="Stringent latency (e.g. < 100 ms)?"
            options={[
              { id: 'strict', label: 'Yes → CPU' },
              { id: 'batch', label: 'No — batching OK' },
            ]}
            value={latency}
            onChange={setLatency}
          />
        )}

        {result && (
          <div className={`rounded-xl p-4 text-center ${result.tone}`}>
            <div className="font-bold text-sm">{result.label}</div>
            <div className="text-xs mt-1">{result.detail}</div>
          </div>
        )}

        {result && <AsicHint show={showAsic} />}

        <div className="rounded-xl border border-violet-400/40 bg-violet-500/10 p-3 text-center text-xs text-violet-100">
          Optimize: Quantize · Batch requests · Autoscale
        </div>
      </div>
    </div>
  );
}

function StepChoice({ title, options, value, onChange }) {
  return (
    <div className="rounded-xl border border-gray-600 bg-gray-200/90 p-3">
      <div className="text-xs font-bold text-gray-700 mb-2">{title}</div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-lg border-2 py-2 text-xs font-bold ${
              value === o.id ? 'border-gray-900 bg-white text-gray-900' : 'border-gray-300 bg-gray-100 text-gray-600'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AsicHint({ show }) {
  const [open, setOpen] = useState(false);
  if (!show) return null;
  return (
    <div className="text-center">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-xs text-orange-300 underline"
      >
        {open ? 'Hide' : 'Show'} ASIC cost-efficiency path
      </button>
      {open && (
        <div className="mt-2 rounded-xl bg-orange-200 text-orange-950 p-3 text-sm font-semibold">
          Use Specialized ASIC (e.g. Inferentia, TPU)
        </div>
      )}
    </div>
  );
}

/* ── 10. ASICs + optimization toolkit ─────────────────────────────────────── */

export function AsicOptimizeVisualizer() {
  const [tab, setTab] = useState('asic');
  const [bits, setBits] = useState(32);
  const [traffic, setTraffic] = useState(40);
  const instances = Math.max(1, Math.ceil(traffic / 25));

  const memFactor = bits === 32 ? 1 : bits === 16 ? 0.5 : 0.25;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">ASICs &amp; Serving Optimizations</h3>
        <p className="text-gray-400 text-sm">Compile once for cheaper inference — or right-size, quantize, autoscale.</p>
      </div>

      <Tabs
        options={[
          { id: 'asic', label: 'ASICs' },
          { id: 'quant', label: 'Quantize' },
          { id: 'scale', label: 'Autoscale' },
          { id: 'serverless', label: 'Serverless' },
        ]}
        value={tab}
        onChange={setTab}
        accent="bg-orange-600"
      />

      <div className="max-w-xl mx-auto w-full">
        {tab === 'asic' && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-bold">
              {['Model', 'Neuron / convert', 'ASIC binary'].map((s, i) => (
                <React.Fragment key={s}>
                  <div className="rounded-lg border border-orange-500/40 bg-orange-500/10 text-orange-100 px-3 py-3">
                    {s}
                  </div>
                  {i < 2 && <span className="text-gray-500">→</span>}
                </React.Fragment>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border border-gray-700 bg-gray-900 p-3">
                <div className="font-bold text-white">AWS Inferentia</div>
                <div className="text-xs text-gray-400 mt-1">
                  <span className="font-mono text-rose-300">inf1 / inf2</span> · Neuron SDK compile
                </div>
              </div>
              <div className="rounded-xl border border-gray-700 bg-gray-900 p-3">
                <div className="font-bold text-white">GCP TPUs</div>
                <div className="text-xs text-gray-400 mt-1">
                  <span className="font-mono text-rose-300">v4 / v5e</span> · model conversion
                </div>
              </div>
            </div>
            <p className="text-xs text-amber-200/90 border border-amber-500/30 rounded-lg p-2">
              Trade-off: lowest cost/inference at scale, but engineering overhead and less flexible
              architecture support than GPUs.
            </p>
          </div>
        )}

        {tab === 'quant' && (
          <div className="space-y-3">
            <Tabs
              options={[
                { id: 32, label: 'FP32' },
                { id: 16, label: 'FP16' },
                { id: 8, label: 'INT8' },
              ]}
              value={bits}
              onChange={setBits}
              accent="bg-violet-600"
            />
            <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
              <div className="text-xs text-gray-400 mb-2">Relative model footprint</div>
              <div className="h-10 rounded-lg bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-violet-500 transition-all duration-300 flex items-center justify-end pr-2 text-xs font-bold text-white"
                  style={{ width: `${memFactor * 100}%` }}
                >
                  {(memFactor * 100).toFixed(0)}%
                </div>
              </div>
              <p className="text-sm text-gray-300 mt-3">
                Quantization (FP32 → INT8) shrinks size and speeds inference; pruning removes redundant
                weights. Pair with right-sizing for cost control.
              </p>
            </div>
          </div>
        )}

        {tab === 'scale' && (
          <div className="space-y-3">
            <label className="text-xs text-gray-400">
              Traffic load: <span className="text-white font-mono">{traffic}%</span>
            </label>
            <input
              type="range"
              min={5}
              max={100}
              value={traffic}
              onChange={(e) => setTraffic(Number(e.target.value))}
              className="w-full accent-sky-500"
            />
            <div className="flex items-end gap-1 h-24">
              {Array.from({ length: 12 }).map((_, i) => {
                const h = 20 + Math.sin(i + traffic / 20) * 30 + traffic * 0.3;
                const on = i < instances;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t ${on ? 'bg-sky-500' : 'bg-gray-800'}`}
                    style={{ height: `${Math.min(100, h)}%` }}
                  />
                );
              })}
            </div>
            <p className="text-sm text-center text-gray-300">
              Active instances ≈ <span className="text-white font-mono">{instances}</span> — autoscale on
              CPU util or request count so you do not pay for idle peaks all day.
            </p>
          </div>
        )}

        {tab === 'serverless' && (
          <div className="rounded-2xl border border-gray-700 bg-gray-900/80 p-5 space-y-2 text-sm text-gray-300">
            <Layers className="w-6 h-6 text-brand-orange" />
            <p>
              For <strong className="text-white">infrequent or unpredictable</strong> traffic: AWS
              Lambda, Cloud Run, Azure Functions — no idle servers, pay per invocation.
            </p>
            <p className="text-xs text-gray-500">
              Ideal when you would otherwise over-provision a always-on instance for rare spikes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 11. Comparison matrix ────────────────────────────────────────────────── */

const MATRIX = [
  {
    id: 'cpu',
    name: 'CPU',
    best: 'Low–medium traffic, latency-sensitive, classic ML',
    trade: 'Simplicity & low idle cost',
    ex: 'AWS m · GCP e2/n2 · Azure DSv4',
  },
  {
    id: 'gpu',
    name: 'GPU',
    best: 'High throughput, large DL models, batchable traffic',
    trade: 'Throughput & peak performance',
    ex: 'g4dn/g5 · n1+T4/L4',
  },
  {
    id: 'asic',
    name: 'ASIC',
    best: 'Very high volume, stable workloads',
    trade: 'Lowest $/inference at scale',
    ex: 'inf series · TPU instances',
  },
  {
    id: 'svl',
    name: 'Serverless',
    best: 'Infrequent or unpredictable traffic',
    trade: 'Pay-per-use, zero idle',
    ex: 'Lambda · Cloud Run · Functions',
  },
];

export function InferenceMatrixVisualizer() {
  const [sel, setSel] = useState('cpu');
  const row = MATRIX.find((m) => m.id === sel);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Inference Infrastructure Matrix</h3>
        <p className="text-gray-400 text-sm">Tap a category — match traffic pattern to the right cost curve.</p>
      </div>

      <div className="max-w-2xl mx-auto w-full grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {MATRIX.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSel(m.id)}
            className={`rounded-xl border py-3 text-sm font-bold ${
              sel === m.id
                ? 'border-brand-orange bg-brand-orange/20 text-white'
                : 'border-gray-700 bg-gray-900 text-gray-400'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="max-w-xl mx-auto w-full rounded-2xl border border-gray-700 bg-gray-900/80 p-5 space-y-3">
        <div>
          <div className="text-[10px] uppercase text-gray-500 font-bold">Best for</div>
          <p className="text-white text-sm">{row.best}</p>
        </div>
        <div>
          <div className="text-[10px] uppercase text-gray-500 font-bold">Main trade-off</div>
          <p className="text-brand-orange text-sm">{row.trade}</p>
        </div>
        <div>
          <div className="text-[10px] uppercase text-gray-500 font-bold">Examples</div>
          <p className="font-mono text-rose-300 text-xs">{row.ex}</p>
        </div>
      </div>
    </div>
  );
}
