import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Server,
  Zap,
  Wind,
  Gauge,
  Layers,
  RotateCcw,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
} from 'lucide-react';

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
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

/* ── 1. Three workload profiles ───────────────────────────────────────────── */

const WORKLOADS = {
  prep: {
    name: 'Data Preprocessing',
    tag: 'Frequently CPU-bound',
    accent: 'bg-brand-blue',
    ring: 'border-brand-blue',
    bars: [
      { k: 'CPU cores', v: 92, t: 'bg-brand-blue' },
      { k: 'System RAM', v: 85, t: 'bg-brand-blue' },
      { k: 'GPU compute', v: 12, t: 'bg-gray-600' },
      { k: 'VRAM', v: 8, t: 'bg-gray-600' },
      { k: 'Storage I/O', v: 95, t: 'bg-brand-orange' },
      { k: 'Interconnect', v: 30, t: 'bg-gray-600' },
    ],
    note: 'Cleaning, transformation, tokenization and augmentation. A pipeline that cannot feed the accelerator fast enough leaves your expensive GPUs idle. Needs strong multi-core CPUs, abundant system RAM, and fast storage I/O.',
  },
  train: {
    name: 'Model Training',
    tag: 'The most computationally demanding phase',
    accent: 'bg-brand-orange',
    ring: 'border-brand-orange',
    bars: [
      { k: 'CPU cores', v: 55, t: 'bg-gray-600' },
      { k: 'System RAM', v: 60, t: 'bg-gray-600' },
      { k: 'GPU compute', v: 100, t: 'bg-brand-orange' },
      { k: 'VRAM', v: 100, t: 'bg-brand-orange' },
      { k: 'Storage I/O', v: 80, t: 'bg-brand-orange' },
      { k: 'Interconnect', v: 95, t: 'bg-brand-orange' },
    ],
    note: 'Long-running, iterative, massively parallel, and hungry for data. Wants powerful GPUs with as much VRAM as possible, high-speed interconnects between GPUs for distributed jobs, and a pipeline that can sustain high throughput.',
  },
  infer: {
    name: 'Model Inference',
    tag: 'Low latency or high QPS',
    accent: 'bg-brand-green',
    ring: 'border-brand-green',
    bars: [
      { k: 'CPU cores', v: 45, t: 'bg-gray-600' },
      { k: 'System RAM', v: 35, t: 'bg-gray-600' },
      { k: 'GPU compute', v: 55, t: 'bg-brand-green' },
      { k: 'VRAM', v: 40, t: 'bg-brand-green' },
      { k: 'Storage I/O', v: 20, t: 'bg-gray-600' },
      { k: 'Interconnect', v: 35, t: 'bg-gray-600' },
    ],
    note: 'A single inference pass is far lighter than a training iteration, but the system must handle concurrent requests reliably. That can mean cost-effective GPUs with just enough VRAM — or even CPUs for models that do not parallelize well.',
  },
};

export function WorkloadProfileVisualizer() {
  const [pick, setPick] = useState('train');
  const w = WORKLOADS[pick];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Three Jobs, Three Resource Profiles</h3>
        <p className="text-gray-400 text-sm">
          A server tuned for training looks nothing like one serving a mobile app.
        </p>
      </div>

      <Tabs
        value={pick}
        onChange={setPick}
        accent={w.accent}
        options={[
          { id: 'prep', label: 'Data Preprocessing' },
          { id: 'train', label: 'Model Training' },
          { id: 'infer', label: 'Model Inference' },
        ]}
      />

      <div className={`max-w-lg mx-auto w-full rounded-2xl border-2 ${w.ring} bg-gray-950 p-4 mb-3`}>
        <div className="text-center mb-3">
          <div className="font-bold text-white">{w.name}</div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500">{w.tag}</div>
        </div>
        <div className="space-y-2.5">
          {w.bars.map((b) => (
            <Meter key={b.k} label={b.k} value={b.v} unit={`${b.v}%`} tone={b.t} />
          ))}
        </div>
      </div>

      <p className="max-w-lg mx-auto w-full text-sm text-gray-300 text-center">{w.note}</p>
      <p className="text-[11px] text-gray-500 text-center mt-3">
        Grey bars are the resources this workload does not care about — money spent there is wasted.
      </p>
    </div>
  );
}

/* ── 2. VRAM budget from the parameter count ──────────────────────────────── */

export function VramBudgetVisualizer() {
  const [params, setParams] = useState(7); // Billions
  const [precision, setPrecision] = useState(4); // 4 bytes (FP32)
  const [optimizer, setOptimizer] = useState('adam'); // adam (2 states), sgd (0 extra)

  const weightBytes = precision;
  const gradBytes = precision;
  const optBytes = optimizer === 'adam' ? precision * 2 : 0;

  const memoryWeights = params * weightBytes;
  const memoryGrads = params * gradBytes;
  const memoryOpt = params * optBytes;
  const totalMemory = memoryWeights + memoryGrads + memoryOpt;

  const gpus = [
    { name: 'RTX 4090', vram: 24 },
    { name: 'RTX 6000 Ada', vram: 48 },
    { name: 'A100', vram: 80 },
  ];

  return (
    <div className="flex flex-col w-full h-full p-4 relative overflow-y-auto custom-scroll">
      <div className="text-center mb-6 shrink-0">
        <h3 className="text-xl font-semibold text-white mb-2">The VRAM Equation</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Model size is the single most important factor driving GPU selection. Let&apos;s calculate
          the <i>minimum</i> VRAM footprint for training.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl mx-auto">
        {/* Controls */}
        <div className="w-full lg:w-1/3 bg-gray-900 rounded-xl border border-gray-700 p-6 flex flex-col justify-between shadow-xl shrink-0">
          <div>
            <label className="block text-sm text-gray-300 font-bold mb-4">
              Model Parameters: <span className="text-brand-blue text-lg">{params} Billion</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={params}
              onChange={(e) => setParams(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-blue mb-8"
            />

            <div className="mb-6">
              <span className="block text-sm text-gray-400 mb-2">
                Data Precision (Weights &amp; Gradients)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPrecision(4)}
                  className={`flex-1 py-1.5 text-xs rounded border ${
                    precision === 4
                      ? 'bg-brand-blue border-brand-blue text-white'
                      : 'bg-gray-800 border-gray-600 text-gray-400'
                  }`}
                >
                  32-bit (4 Bytes)
                </button>
                <button
                  type="button"
                  onClick={() => setPrecision(2)}
                  className={`flex-1 py-1.5 text-xs rounded border ${
                    precision === 2
                      ? 'bg-brand-blue border-brand-blue text-white'
                      : 'bg-gray-800 border-gray-600 text-gray-400'
                  }`}
                >
                  16-bit (2 Bytes)
                </button>
              </div>
            </div>

            <div>
              <span className="block text-sm text-gray-400 mb-2">Optimizer Choice</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOptimizer('adam')}
                  className={`flex-1 py-1.5 text-xs rounded border ${
                    optimizer === 'adam'
                      ? 'bg-brand-orange border-brand-orange text-white'
                      : 'bg-gray-800 border-gray-600 text-gray-400'
                  }`}
                >
                  Adam (2 States)
                </button>
                <button
                  type="button"
                  onClick={() => setOptimizer('sgd')}
                  className={`flex-1 py-1.5 text-xs rounded border ${
                    optimizer === 'sgd'
                      ? 'bg-brand-orange border-brand-orange text-white'
                      : 'bg-gray-800 border-gray-600 text-gray-400'
                  }`}
                >
                  SGD (0 States)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="w-full lg:w-2/3 flex flex-col items-center">
          {/* The Formula */}
          <div className="bg-gray-800/80 border border-gray-600 rounded-xl p-4 w-full text-center mb-8 shadow-lg">
            <div className="text-sm text-gray-400 mb-2">Mathematical Estimation for Training VRAM</div>
            <div className="text-lg md:text-xl font-mono flex items-center justify-center flex-wrap gap-2 text-white">
              VRAM<sub>min</sub> ≈
              <span className="bg-brand-blue/20 text-brand-blue px-2 py-1 rounded">
                (P × {weightBytes})
              </span>{' '}
              +
              <span className="bg-brand-purple/20 text-brand-purple px-2 py-1 rounded">
                (P × {gradBytes})
              </span>{' '}
              +
              <span className="bg-brand-orange/20 text-brand-orange px-2 py-1 rounded">
                (P × {optBytes})
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-2">Where P = Number of Parameters</div>
          </div>

          {/* Bar Chart & Results */}
          <div className="w-full flex flex-col items-center flex-1">
            <div className="text-4xl font-extrabold text-white mb-6">
              {totalMemory} GB
              <span className="text-sm font-normal text-gray-400 uppercase tracking-widest block text-center mt-1">
                Required
              </span>
            </div>

            {/* Stacked Bar */}
            <div className="w-full h-12 bg-gray-900 rounded-full overflow-hidden flex border border-gray-700 shadow-inner relative">
              <div
                className="h-full bg-brand-blue flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={{ width: `${(memoryWeights / totalMemory) * 100}%` }}
              />
              <div
                className="h-full bg-brand-purple flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={{ width: `${(memoryGrads / totalMemory) * 100}%` }}
              />
              {memoryOpt > 0 && (
                <div
                  className="h-full bg-brand-orange flex items-center justify-center text-xs font-bold text-gray-900 transition-all duration-300"
                  style={{ width: `${(memoryOpt / totalMemory) * 100}%` }}
                />
              )}
            </div>

            {/* Legend */}
            <div className="flex justify-between w-full mt-4 px-2 text-sm flex-wrap gap-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-brand-blue rounded" />
                <span className="text-gray-300">Weights ({memoryWeights}GB)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-brand-purple rounded" />
                <span className="text-gray-300">Gradients ({memoryGrads}GB)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-brand-orange rounded" />
                <span className="text-gray-300">Optimizer ({memoryOpt}GB)</span>
              </div>
            </div>

            {/* GPU Comparison */}
            <div className="w-full mt-8 border-t border-gray-800 pt-6">
              <div className="text-xs text-gray-500 uppercase font-bold mb-3">
                Hardware Compatibility Check
              </div>
              <div className="flex gap-4">
                {gpus.map((gpu) => (
                  <div
                    key={gpu.name}
                    className={`flex-1 p-3 rounded-lg border flex flex-col items-center justify-center text-center transition-colors ${
                      totalMemory > gpu.vram
                        ? 'bg-red-950/30 border-red-900/50 text-gray-500 opacity-60'
                        : 'bg-green-900/20 border-green-700 text-white shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    }`}
                  >
                    <span className="font-bold text-sm block mb-1">{gpu.name}</span>
                    <span className="text-xs font-mono">{gpu.vram} GB</span>
                    {totalMemory > gpu.vram ? (
                      <span className="text-[10px] text-red-400 mt-2 font-bold uppercase tracking-wider block">
                        OOM Error
                      </span>
                    ) : (
                      <span className="text-[10px] text-green-400 mt-2 font-bold uppercase tracking-wider block">
                        Fits
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {totalMemory > 80 && (
                <p className="text-xs text-brand-orange mt-4 text-center">
                  Note: This model exceeds a single A100. You will need a multi-GPU solution (e.g.,
                  Tensor Parallelism).
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ── 3. Computational load (FLOPs) ────────────────────────────────────────── */

const MODELS = [
  { id: 'resnet', name: 'ResNet-50', density: 'Relatively light', cost: 1, note: 'A convolutional vision model. Cheap per iteration — a mid-tier GPU keeps up comfortably.' },
  { id: 'bert', name: 'BERT-base', density: 'Moderate', cost: 6, note: 'A small Transformer. Dense matmuls, but the parameter count stays modest.' },
  { id: 'llama7', name: 'Llama-class 7B', density: 'Computationally dense', cost: 90, note: 'A large Transformer. Every token touches billions of parameters in both directions.' },
  { id: 'big', name: 'Dense 70B', density: 'Extremely dense', cost: 900, note: 'Now a single iteration is a serious job. This is where GPU tier stops being optional.' },
];

const GPU_TIERS = [
  { id: 'entry', name: 'Entry GPU', tflops: 1 },
  { id: 'mid', name: 'Datacenter GPU', tflops: 3.2 },
  { id: 'flag', name: 'Flagship GPU', tflops: 9 },
];

export function FlopsLoadVisualizer() {
  const [model, setModel] = useState('llama7');
  const [tier, setTier] = useState('mid');
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const m = MODELS.find((x) => x.id === model);
  const g = GPU_TIERS.find((x) => x.id === tier);
  const iterMs = Math.round((m.cost / g.tflops) * 40);

  useEffect(() => {
    if (!running) return undefined;
    setProgress(0);
    const start = Date.now();
    const dur = Math.min(4000, iterMs);
    const t = setInterval(() => {
      const pct = ((Date.now() - start) / dur) * 100;
      if (pct >= 100) {
        setProgress(100);
        setRunning(false);
      } else {
        setProgress(pct);
      }
    }, 40);
    return () => clearInterval(t);
  }, [running, iterMs]);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Computational Load (FLOPs)</h3>
        <p className="text-gray-400 text-sm">
          FLOPs per forward + backward pass decide how fast a GPU finishes one iteration.
        </p>
      </div>

      <Tabs
        value={model}
        onChange={(v) => {
          setModel(v);
          setRunning(false);
          setProgress(0);
        }}
        accent="bg-brand-purple"
        options={MODELS.map((x) => ({ id: x.id, label: x.name }))}
      />

      <div className="max-w-lg mx-auto w-full mb-3">
        <div className="text-[10px] text-gray-500 mb-1">Relative FLOPs per iteration (log scale)</div>
        <div className="space-y-1.5">
          {MODELS.map((x) => (
            <div key={x.id} className="flex items-center gap-2">
              <span
                className={`text-[10px] w-24 shrink-0 ${
                  x.id === model ? 'text-white font-bold' : 'text-gray-500'
                }`}
              >
                {x.name}
              </span>
              <div className="flex-1 h-4 rounded bg-gray-900 overflow-hidden">
                <div
                  className={`h-full rounded ${x.id === model ? 'bg-brand-purple' : 'bg-gray-700'}`}
                  style={{ width: `${(Math.log10(x.cost * 10) / Math.log10(9000)) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-3 flex-wrap">
        {GPU_TIERS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => {
              setTier(x.id);
              setRunning(false);
              setProgress(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              tier === x.id ? 'bg-brand-green text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div className="max-w-lg mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>One training iteration</span>
          <span className="font-mono text-white">
            {iterMs < 1000 ? `${iterMs} ms` : `${(iterMs / 1000).toFixed(1)} s`}
          </span>
        </div>
        <div className="h-3 rounded-full bg-gray-900 overflow-hidden mb-2">
          <div
            className="h-full bg-brand-orange rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          type="button"
          onClick={() => setRunning(true)}
          className="w-full py-1.5 rounded-lg bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
        >
          {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {running ? 'Running…' : 'Run one iteration'}
        </button>
      </div>

      <p className="text-sm text-gray-300 text-center max-w-lg mx-auto">{m.note}</p>
      <p className="text-[11px] text-gray-500 text-center mt-2">
        Illustrative ratios, not benchmarks. You rarely compute this exactly — you just need to know
        whether your model is dense or light so you pick the right GPU tier.
      </p>
    </div>
  );
}

/* ── 4. Dataset and I/O patterns ──────────────────────────────────────────── */

const DATASETS = [
  {
    id: 'video',
    name: 'High-res video',
    shape: '12k files × 2 GB',
    capacity: 92,
    capacityLabel: 'petabyte scale',
    throughput: 96,
    iops: 18,
    bottleneck: 'throughput',
    note: 'A few enormous sequential files. You need raw gigabytes per second — the strength of NVMe SSDs in a RAID configuration.',
  },
  {
    id: 'images',
    name: 'Millions of small images',
    shape: '50M files × 120 KB',
    capacity: 45,
    capacityLabel: 'terabytes',
    throughput: 32,
    iops: 98,
    bottleneck: 'iops',
    note: 'Each read is tiny, so the ability to serve many separate requests per second (IOPS) becomes the bottleneck rather than raw throughput. High-IOPS NVMe is critical here.',
  },
  {
    id: 'text',
    name: 'Tokenized text shards',
    shape: '4k files × 500 MB',
    capacity: 30,
    capacityLabel: 'terabytes',
    throughput: 58,
    iops: 34,
    bottleneck: 'balanced',
    note: 'Pre-sharded text streams well. Neither metric dominates — capacity planning is the simpler question.',
  },
];

export function DatasetIoVisualizer() {
  const [pick, setPick] = useState('images');
  const [tick, setTick] = useState(0);
  const d = DATASETS.find((x) => x.id === pick);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 300);
    return () => clearInterval(t);
  }, []);

  const blocks = d.id === 'video' ? 3 : d.id === 'text' ? 8 : 40;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Your Dataset Picks Your Drives</h3>
        <p className="text-gray-400 text-sm">Capacity, throughput, and IOPS are three different problems.</p>
      </div>

      <Tabs
        value={pick}
        onChange={setPick}
        accent="bg-brand-orange"
        options={DATASETS.map((x) => ({ id: x.id, label: x.name }))}
      />

      <div className="max-w-lg mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="text-[10px] text-gray-500 mb-2">
          Read pattern · {d.shape}
        </div>
        <div className="flex flex-wrap gap-1 h-14 content-start">
          {Array.from({ length: blocks }).map((_, i) => (
            <div
              key={i}
              className={`rounded-sm transition-colors duration-200 ${
                i === tick % blocks ? 'bg-brand-orange' : 'bg-sky-800/60'
              }`}
              style={{
                width: d.id === 'video' ? '32%' : d.id === 'text' ? '11%' : '8px',
                height: d.id === 'images' ? '8px' : '18px',
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto w-full space-y-2.5 mb-3">
        <Meter
          label="Storage capacity"
          value={d.capacity}
          unit={d.capacityLabel}
          tone="bg-brand-blue"
        />
        <Meter
          label="I/O throughput (GB/s)"
          value={d.throughput}
          unit={d.bottleneck === 'throughput' ? 'BOTTLENECK' : 'ok'}
          tone={d.bottleneck === 'throughput' ? 'bg-brand-rose' : 'bg-brand-green'}
        />
        <Meter
          label="IOPS (requests per second)"
          value={d.iops}
          unit={d.bottleneck === 'iops' ? 'BOTTLENECK' : 'ok'}
          tone={d.bottleneck === 'iops' ? 'bg-brand-rose' : 'bg-brand-green'}
        />
      </div>

      <p className="text-sm text-gray-300 text-center max-w-lg mx-auto">{d.note}</p>
    </div>
  );
}

/* ── 5. Scaling goals: T_total = T_compute + T_communication ──────────────── */

export function ScalingGoalsVisualizer() {
  const [view, setView] = useState('training');
  const [gpus, setGpus] = useState(8);

  const soloHours = 720;
  const commPerGpu = 0.5;
  const tCompute = soloHours / gpus;
  const tComm = commPerGpu * (gpus - 1);
  const tTotal = tCompute + tComm;

  const best = Math.round(Math.sqrt(soloHours / commPerGpu));
  const curve = [1, 2, 4, 8, 16, 32, 38, 48, 64];
  const maxTotal = Math.max(...curve.map((n) => soloHours / n + commPerGpu * (n - 1)));

  const [target, setTarget] = useState('latency');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Define What “Fast Enough” Means</h3>
        <p className="text-gray-400 text-sm">More GPUs cut compute time — and add communication time.</p>
      </div>

      <Tabs
        value={view}
        onChange={setView}
        accent="bg-brand-purple"
        options={[
          { id: 'training', label: 'Training time' },
          { id: 'inference', label: 'Inference targets' },
        ]}
      />

      {view === 'training' ? (
        <>
          <div className="max-w-lg mx-auto w-full rounded-2xl border border-cyan-900/50 bg-gray-950 p-3 mb-3 text-center">
            <div className="font-serif italic text-slate-100">
              T<sub>total</sub> = T<sub>compute</sub> + T<sub>communication</sub>
            </div>
          </div>

          <div className="max-w-lg mx-auto w-full mb-3">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] text-gray-400 shrink-0">GPUs</span>
              <input
                type="range"
                min="1"
                max="64"
                value={gpus}
                onChange={(e) => setGpus(Number(e.target.value))}
                className="flex-1 accent-brand-purple"
              />
              <span className="font-mono text-xs text-white w-8 text-right">{gpus}</span>
            </div>

            <div className="h-9 rounded-lg overflow-hidden flex border border-gray-700 mb-2">
              <div
                className="bg-brand-blue flex items-center justify-center transition-all duration-300"
                style={{ width: `${(tCompute / tTotal) * 100}%` }}
              >
                <span className="text-[9px] font-bold text-white truncate px-1">
                  compute {tCompute.toFixed(0)}h
                </span>
              </div>
              <div
                className="bg-brand-rose flex items-center justify-center transition-all duration-300"
                style={{ width: `${(tComm / tTotal) * 100}%` }}
              >
                <span className="text-[9px] font-bold text-white truncate px-1">
                  comm {tComm.toFixed(0)}h
                </span>
              </div>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-400">Time to solution: </span>
              <span className="font-mono font-bold text-white">
                {(tTotal / 24).toFixed(1)} days
              </span>
              <span className="text-gray-500"> ({tTotal.toFixed(0)} h)</span>
            </div>
          </div>

          <div className="max-w-lg mx-auto w-full mb-2">
            <div className="text-[10px] text-gray-500 mb-1">T_total across cluster sizes</div>
            <div className="flex items-end gap-1 h-24">
              {curve.map((n) => {
                const v = soloHours / n + commPerGpu * (n - 1);
                const isBest = n === 38;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setGpus(n)}
                    className="flex-1 flex flex-col items-center justify-end h-full"
                  >
                    <div
                      className={`w-full rounded-t transition-all ${
                        isBest ? 'bg-brand-green' : n === gpus ? 'bg-brand-purple' : 'bg-gray-700'
                      }`}
                      style={{ height: `${(v / maxTotal) * 100}%` }}
                    />
                    <span className="text-[8px] text-gray-500 mt-0.5">{n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-gray-400 text-center max-w-lg mx-auto">
            Compute falls as 1/N, but communication grows with N. Past roughly{' '}
            <span className="text-brand-green font-bold">{best} GPUs</span> here, adding hardware
            makes the job <em>slower</em>. That is why time-to-solution is a design input, not an
            afterthought.
          </p>
        </>
      ) : (
        <>
          <div className="flex justify-center gap-2 mb-3">
            {[
              { id: 'latency', label: 'Lowest latency (1 user)' },
              { id: 'qps', label: 'Highest QPS (many users)' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setTarget(o.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  target === o.id ? 'bg-brand-green text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="max-w-lg mx-auto w-full rounded-2xl border border-gray-700 bg-gray-950 p-4 mb-3">
            {target === 'latency' ? (
              <div className="text-center">
                <div className="inline-flex flex-col items-center rounded-xl border-2 border-brand-green bg-brand-green/10 px-8 py-5">
                  <Server className="w-8 h-8 text-brand-green mb-1" />
                  <span className="text-xs font-bold text-white">1 × powerful GPU</span>
                </div>
                <div className="mt-3 font-mono text-sm text-brand-green">~12 ms per request</div>
                <div className="text-[11px] text-gray-500">throughput ≈ 80 QPS</div>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex justify-center gap-2 flex-wrap">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg border-2 border-brand-blue bg-brand-blue/10 px-3 py-3"
                    >
                      <Server className="w-5 h-5 text-brand-blue" />
                    </div>
                  ))}
                </div>
                <div className="mt-3 font-mono text-sm text-brand-blue">~45 ms per request</div>
                <div className="text-[11px] text-gray-500">throughput ≈ 540 QPS</div>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-300 text-center max-w-lg mx-auto">
            {target === 'latency'
              ? 'A low-latency requirement for a large model demands one powerful, dedicated GPU. You are buying response time, not volume.'
              : 'A high-QPS target for a smaller model is better served by many replicas across cheaper GPUs — or even CPU cores. Each request is slower; the fleet serves far more of them.'}
          </p>
        </>
      )}
    </div>
  );
}

/* ── 6. The workload-profile decision flow ────────────────────────────────── */

const FLOW = [
  {
    q: 'What is the primary workload?',
    choices: [
      {
        label: 'Training',
        reqs: ['High FLOPs (GPU)', 'Large VRAM', 'Fast interconnects'],
        tone: 'rose',
      },
      {
        label: 'Inference',
        reqs: ['Low latency or high QPS', 'VRAM > model size', 'CPU or GPU options'],
        tone: 'green',
      },
    ],
  },
  {
    q: "What is the model's scale? (Parameters, architecture)",
    choices: [
      {
        label: 'Large (>10B params)',
        reqs: ['Max VRAM per GPU', 'Multi-GPU support (NVLink)', 'Potential model parallelism'],
        tone: 'rose',
      },
      {
        label: 'Small / Medium',
        reqs: ['Standard VRAM sufficient', 'Focus on compute per dollar'],
        tone: 'green',
      },
    ],
  },
  {
    q: 'Analyze dataset (size, format, I/O pattern)',
    choices: [
      {
        label: 'Continue',
        reqs: ['Capacity (TB/PB)', 'High bandwidth (NVMe)', 'High IOPS for small files'],
        tone: 'orange',
      },
    ],
  },
  {
    q: 'Define performance targets (training time, latency, QPS)',
    choices: [
      {
        label: 'Fast training',
        reqs: ['Multiple high-end GPUs', 'High-speed networking'],
        tone: 'rose',
      },
      {
        label: 'Low-latency inference',
        reqs: ['Fast single GPU / CPU', 'Optimized software stack'],
        tone: 'green',
      },
    ],
  },
];

const TONES = {
  rose: 'border-rose-400 bg-rose-200 text-rose-950',
  green: 'border-lime-400 bg-lime-200 text-lime-950',
  orange: 'border-orange-400 bg-orange-200 text-orange-950',
};

export function WorkloadFlowVisualizer() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState([]);

  const done = step >= FLOW.length;
  const node = done ? null : FLOW[step];

  const choose = (c) => {
    setPicked((p) => [...p, c]);
    setStep((s) => s + 1);
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Build Your Workload Profile</h3>
        <p className="text-gray-400 text-sm">
          Answer four questions and the hardware specification writes itself.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full">
        <div className="rounded-full bg-sky-300 text-sky-950 text-xs font-bold text-center py-2 mb-2">
          Start: Define AI Application
        </div>

        {picked.map((c, i) => (
          <div key={i} className="mb-2">
            <div className="text-center text-gray-600 text-xs">↓ {c.label}</div>
            <div className={`rounded-xl border-2 p-2 text-[11px] ${TONES[c.tone]}`}>
              <span className="font-bold">Requirement: </span>
              {c.reqs.join(' · ')}
            </div>
          </div>
        ))}

        {!done && (
          <>
            <div className="text-center text-gray-600 text-xs mb-2">↓</div>
            <div className="rounded-xl border-2 border-indigo-400 bg-indigo-200 text-indigo-950 text-xs font-bold text-center py-3 px-3 mb-2">
              {node.q}
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              {node.choices.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => choose(c)}
                  className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold border border-gray-600"
                >
                  {c.label} <ChevronRight className="w-3 h-3 inline" />
                </button>
              ))}
            </div>
          </>
        )}

        {done && (
          <div className="rounded-xl bg-teal-200 text-teal-950 text-center py-3 px-3 font-bold text-xs mb-3">
            Develop Hardware Specification Sheet
            <div className="font-normal text-[10px] mt-0.5">(CPU, GPU, RAM, Storage, Network)</div>
          </div>
        )}

        {(picked.length > 0 || done) && (
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setPicked([]);
            }}
            className="mx-auto mt-3 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Start over
          </button>
        )}
      </div>
    </div>
  );
}

/* ── 7. Server chassis ────────────────────────────────────────────────────── */

const FORM_FACTORS = [
  { id: '1u', name: '1U', maxGpu: 2, psuBays: 2, fanBays: 2, cool: 40, height: 74 },
  { id: '2u', name: '2U', maxGpu: 4, psuBays: 3, fanBays: 3, cool: 70, height: 106 },
  { id: '4u', name: '4U', maxGpu: 8, psuBays: 4, fanBays: 3, cool: 100, height: 150 },
];

export function ChassisVisualizer() {
  const [form, setForm] = useState('4u');
  const [gpus, setGpus] = useState(4);
  const [redundant, setRedundant] = useState(true);
  const [gpuWidth, setGpuWidth] = useState(2);

  const f = FORM_FACTORS.find((x) => x.id === form);
  const slotCapacity = Math.floor((gpuWidth === 2 ? 8 : 6) / gpuWidth);
  const seated = Math.min(gpus, f.maxGpu, slotCapacity);
  const overflow = gpus > seated;

  const watts = 400 + gpus * 350;
  const psuTotal = redundant ? 2 * 2000 : 3000;
  const overPower = watts > psuTotal;

  const heat = Math.min(100, (gpus / f.maxGpu) * (100 / f.cool) * 78);
  const hot = heat > 80;

  return (
    <div className="flex flex-col w-full h-full p-4 relative overflow-y-auto custom-scroll items-center">
      <div className="text-center mb-4 shrink-0">
        <h3 className="text-xl font-semibold text-white mb-2">Inside the Rack: Chassis Anatomy</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          The chassis is not a box. It is the thermal, structural, and power design that decides how
          many GPUs you can actually run.
        </p>

        <div className="flex justify-center gap-3 mt-4 flex-wrap">
          {FORM_FACTORS.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setForm(x.id)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                form === x.id
                  ? 'bg-blue-900/50 text-blue-300 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              {x.name} Chassis
            </button>
          ))}
        </div>
      </div>

      {/* Chassis diagram */}
      <div className="w-full max-w-4xl bg-gray-950 border-2 border-gray-600 rounded-2xl p-3 shadow-2xl relative">
        <div className="border border-gray-700 rounded-xl p-3 flex gap-3 items-stretch">
          {/* PSU bay */}
          <div className="w-[19%] shrink-0 border border-gray-700 rounded-lg p-2 flex flex-col">
            <div className="text-[11px] font-bold text-gray-300 text-center mb-2 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-brand-orange" />
              {redundant ? 'Redundant PSUs' : 'Single PSU'}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {Array.from({ length: f.psuBays }).map((_, i) => {
                const active = redundant ? i < 2 : i === 0;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-md border transition-colors ${
                      active
                        ? overPower
                          ? 'bg-rose-900/40 border-rose-600'
                          : 'bg-slate-700 border-slate-500'
                        : 'bg-slate-800/40 border-slate-700 border-dashed'
                    }`}
                  />
                );
              })}
            </div>
            <div className="text-[9px] font-mono text-center mt-2 text-gray-500">{psuTotal} W</div>
          </div>

          {/* Motherboard region */}
          <div className="flex-1 border border-blue-800 rounded-lg p-3 relative">
            <div className="text-[11px] font-bold text-blue-400 mb-2">
              Motherboard (Extended ATX)
            </div>

            <div className="flex gap-4 items-start mb-3" style={{ height: `${f.height * 0.42}px` }}>
              {/* CPU socket */}
              <div className="w-[22%] h-full rounded-md bg-slate-700 border border-slate-500 flex items-center justify-center">
                <span className="text-[9px] font-mono text-slate-300">CPU</span>
              </div>
              {/* DIMM slots */}
              <div className="flex gap-1 h-full items-stretch">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-1.5 rounded-sm bg-slate-600" />
                ))}
              </div>
              <span className="text-[9px] font-mono text-gray-600 self-center">DIMM ×8</span>
            </div>

            {/* PCIe slots */}
            <div className="flex gap-2" style={{ height: `${f.height * 0.5}px` }}>
              {Array.from({ length: 4 }).map((_, i) => {
                const filled = i < seated;
                const blocked = !filled && i < gpus;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-md border flex flex-col items-center justify-center transition-all ${
                      filled
                        ? 'bg-green-900/25 border-green-600 shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                        : blocked
                          ? 'bg-rose-900/25 border-rose-700 border-dashed'
                          : 'bg-gray-900/60 border-gray-700 border-dashed'
                    }`}
                  >
                    <span
                      className={`text-[11px] font-bold ${
                        filled ? 'text-green-400' : blocked ? 'text-rose-400' : 'text-gray-600'
                      }`}
                    >
                      {filled ? `GPU ${i + 1}` : blocked ? 'no room' : 'PCIe x16'}
                    </span>
                    {filled && (
                      <span className="text-[8px] font-mono text-green-600/80 mt-0.5">
                        {gpuWidth}-slot
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Airflow intake */}
          <div className="w-[16%] shrink-0 border border-cyan-800 rounded-lg p-2 flex flex-col">
            <div className="text-[11px] font-bold text-cyan-400 text-center mb-2 flex items-center justify-center gap-1">
              <Wind className={`w-3 h-3 ${hot ? 'text-rose-400' : 'text-cyan-400'}`} />
              Airflow
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {Array.from({ length: f.fanBays }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-md border flex items-center justify-center ${
                    hot ? 'bg-rose-900/30 border-rose-700' : 'bg-slate-700 border-slate-500'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full border-2 border-dashed animate-spin ${
                      hot ? 'border-rose-400' : 'border-cyan-400'
                    }`}
                    style={{ animationDuration: hot ? '0.5s' : '1.4s' }}
                  />
                </div>
              ))}
            </div>
            <div className="text-[9px] font-mono text-center mt-2 text-gray-500">front → back</div>
          </div>
        </div>

        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-600 px-4 py-1 rounded font-mono text-xs text-gray-300 whitespace-nowrap">
          Standard {f.name} AI Server Layout
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-4xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 shrink-0 w-20">GPUs</span>
            <input
              type="range"
              min="1"
              max="8"
              value={gpus}
              onChange={(e) => setGpus(Number(e.target.value))}
              className="flex-1 accent-brand-green"
            />
            <span className="font-mono text-sm text-white w-4 text-right">{gpus}</span>
          </div>
          <div className="flex gap-2">
            {[
              { id: 2, label: 'Double-width' },
              { id: 3, label: 'Triple-width' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setGpuWidth(o.id)}
                className={`flex-1 py-1.5 text-xs rounded border ${
                  gpuWidth === o.id
                    ? 'bg-brand-blue border-brand-blue text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-400'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setRedundant((r) => !r)}
            className={`w-full py-1.5 text-xs rounded border ${
              redundant
                ? 'bg-brand-orange border-brand-orange text-white'
                : 'bg-gray-800 border-gray-600 text-gray-400'
            }`}
          >
            {redundant ? 'Redundant PSUs (2 × 2000 W)' : 'Single PSU (3000 W)'}
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3 justify-center flex flex-col">
          <Meter
            label="Thermal load"
            value={heat}
            unit={hot ? 'throttling risk' : 'within envelope'}
            tone={hot ? 'bg-brand-rose' : 'bg-brand-orange'}
          />
          <Meter
            label={`Power draw vs supply (${psuTotal} W)`}
            value={(watts / psuTotal) * 100}
            unit={`${watts} W`}
            tone={overPower ? 'bg-brand-rose' : 'bg-brand-green'}
          />
          <Meter
            label="GPU bays used"
            value={(seated / f.maxGpu) * 100}
            unit={`${seated} / ${f.maxGpu}`}
            tone="bg-brand-blue"
          />
        </div>
      </div>

      <div className="mt-6 text-center text-sm max-w-2xl">
        {overflow ? (
          <p className="text-gray-400">
            <strong className="text-red-400">Physical limit:</strong> only {seated} of {gpus} cards
            are seated. A {f.name} chassis holds {f.maxGpu} double-width GPUs, and{' '}
            {gpuWidth}-slot coolers eat the neighbouring slot. Full-length cards also need strong
            mounting brackets to prevent sagging.
          </p>
        ) : overPower ? (
          <p className="text-gray-400">
            <strong className="text-red-400">Power limit:</strong> {watts} W exceeds the{' '}
            {psuTotal} W supply. Four high-end GPUs alone can demand 3000 W or more — this is why
            server chassis take multiple PSUs.
          </p>
        ) : hot ? (
          <p className="text-gray-400">
            <strong className="text-brand-orange">Thermal limit:</strong> this density needs the
            vertical space and high-static-pressure fans of a taller chassis to push air through
            dense GPU heatsinks.
          </p>
        ) : (
          <p className="text-gray-400">
            <strong className="text-green-400">Balanced build:</strong> the cards fit, the front-to-
            back airflow path stays clear, and the PSUs carry the load with a spare unit for
            failover.
          </p>
        )}
      </div>
    </div>
  );
}


/* ── 8. PCIe lanes: consumer vs server ────────────────────────────────────── */

export function PcieLaneVisualizer() {
  const [archType, setArchType] = useState('server');

  const consumer = archType === 'consumer';

  return (
    <div className="flex flex-col w-full h-full p-4 relative overflow-y-auto custom-scroll items-center">
      <div className="text-center mb-4 z-20 shrink-0">
        <h3 className="text-xl font-semibold text-white mb-2">
          The Conductor of the Orchestra: CPU &amp; PCIe
        </h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          While GPUs do the heavy lifting, the CPU orchestrates data movement. For multi-GPU
          servers, the most critical CPU feature is its <strong>PCIe lane count</strong>.
        </p>

        <div className="flex justify-center gap-4 mt-5 flex-wrap">
          <button
            type="button"
            onClick={() => setArchType('consumer')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              consumer
                ? 'bg-red-900/50 text-red-400 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Consumer Platform (Core i9 / Ryzen)
          </button>
          <button
            type="button"
            onClick={() => setArchType('server')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              !consumer
                ? 'bg-green-900/50 text-green-400 border border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Server/HEDT Platform (Xeon / EPYC)
          </button>
        </div>
      </div>

      {/* Diagram */}
      <div className="w-full max-w-4xl bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        {consumer ? (
          <div className="bg-red-950/40 border-2 border-red-800/50 rounded-2xl p-5 relative">
            <div className="flex justify-center relative z-20">
              <div className="bg-gray-800 border-2 border-red-500 rounded-xl px-8 py-3 text-center shadow-lg">
                <h4 className="font-bold text-white text-lg">CPU</h4>
                <span className="text-red-400 text-xs font-mono font-bold">
                  (20-24 PCIe Lanes)
                </span>
              </div>
            </div>

            <svg
              viewBox="0 0 600 60"
              preserveAspectRatio="none"
              className="w-full h-[60px] relative z-10"
              style={{ pointerEvents: 'none' }}
            >
              <path
                d="M 300 0 L 300 20 L 100 20 L 100 60"
                stroke="#ef4444"
                strokeWidth="4"
                fill="none"
                strokeDasharray="8 8"
                className="animate-flow-dash"
              />
              <path
                d="M 300 0 L 300 60"
                stroke="#ef4444"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
                className="animate-flow-dash-slow"
              />
              <path
                d="M 300 0 L 300 20 L 500 20 L 500 60"
                stroke="#ef4444"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
                className="animate-flow-dash-slow"
              />
            </svg>

            <div className="grid grid-cols-3 gap-4 relative z-20">
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-mono text-red-400 mb-2 font-bold bg-gray-900 px-2 py-1 rounded">
                  x16 Lanes
                </div>
                <div className="bg-gray-800 border border-gray-600 rounded p-3 text-center w-full text-sm">
                  GPU 1
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-mono text-gray-400 mb-2 bg-gray-900 px-2 py-1 rounded">
                  x4 Lanes
                </div>
                <div className="bg-gray-800 border border-gray-600 rounded p-3 text-center w-full text-sm">
                  NVMe SSD
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-mono text-gray-400 mb-2 bg-gray-900 px-2 py-1 rounded">
                  x4 DMI Link
                </div>
                <div className="bg-gray-800 border border-gray-600 rounded p-3 text-center w-full text-brand-orange font-bold text-sm">
                  Chipset
                </div>
              </div>
            </div>

            <svg
              viewBox="0 0 600 50"
              preserveAspectRatio="none"
              className="w-full h-[50px] relative z-10"
              style={{ pointerEvents: 'none' }}
            >
              <path
                d="M 500 0 L 500 25 L 300 25 L 300 50"
                stroke="#eab308"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
                className="animate-flow-dash-slow"
              />
            </svg>

            <div className="grid grid-cols-3 gap-4 relative z-20">
              <div />
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-mono text-brand-orange mb-2 font-bold bg-gray-900 px-2 py-1 rounded text-center">
                  x8 Lanes (Shared bottleneck)
                </div>
                <div className="bg-gray-800 border border-brand-orange shadow-[0_0_10px_rgba(245,158,11,0.2)] rounded p-3 text-center w-full text-sm">
                  GPU 2
                </div>
              </div>
              <div />
            </div>
          </div>
        ) : (
          <div className="bg-green-950/20 border-2 border-green-800/50 rounded-2xl p-5 relative">
            <div className="flex justify-center relative z-20">
              <div className="bg-gray-800 border-2 border-green-500 rounded-xl px-10 py-3 text-center shadow-lg">
                <h4 className="font-bold text-white text-lg">Server CPU</h4>
                <span className="text-green-400 text-xs font-mono font-bold">
                  (64-128+ PCIe Lanes)
                </span>
              </div>
            </div>

            <svg
              viewBox="0 0 800 70"
              preserveAspectRatio="none"
              className="w-full h-[70px] relative z-10"
              style={{ pointerEvents: 'none' }}
            >
              {[100, 300, 500, 700].map((x, i) => (
                <path
                  key={x}
                  d={`M 400 0 L 400 25 L ${x} 25 L ${x} 70`}
                  stroke="#22c55e"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="8 8"
                  className="animate-flow-dash"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </svg>

            <div className="grid grid-cols-4 gap-3 relative z-20">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex flex-col items-center">
                  <div className="text-[10px] font-mono text-green-400 mb-2 font-bold bg-gray-900 px-2 py-1 rounded shadow text-center">
                    x16 Lanes Direct
                  </div>
                  <div className="bg-gray-800 border-2 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)] rounded p-3 text-center w-full font-bold text-sm">
                    GPU {num}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-sm max-w-2xl">
        {consumer ? (
          <p className="text-gray-400">
            <strong className="text-red-400">The Bottleneck:</strong> A consumer CPU has limited
            PCIe lanes. Adding a second GPU forces it to share bandwidth through the motherboard
            chipset (dropping to x8 speeds), cutting data transfer rates in half.
          </p>
        ) : (
          <p className="text-gray-400">
            <strong className="text-green-400">The Solution:</strong> Server-grade platforms provide
            enough direct PCIe lanes for 4 or even 8 GPUs to run at full x16 bandwidth
            simultaneously, ensuring no GPU starves for data.
          </p>
        )}
      </div>
    </div>
  );
}

/* ── 9. Slot configuration, spacing, and memory ───────────────────────────── */

export function SlotSpacingVisualizer() {
  const [width, setWidth] = useState(2);
  const [board, setBoard] = useState('server');
  const [gpus, setGpus] = useState(3);

  const SLOTS = 7;
  const x16Positions = [0, 2, 4, 6];
  const laneMap = board === 'server' ? [16, 16, 16, 16] : [16, 8, 8, 4];

  const placed = [];
  let cursor = 0;
  for (let i = 0; i < gpus; i += 1) {
    const start = x16Positions.find((p) => p >= cursor);
    if (start === undefined || start + width > SLOTS) {
      placed.push({ idx: i, fits: false, start: null });
    } else {
      placed.push({ idx: i, fits: true, start, lanes: laneMap[x16Positions.indexOf(start)] ?? 4 });
      cursor = start + width;
    }
  }
  const fitted = placed.filter((p) => p.fits);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Slots, Spacing, and Lane Splits</h3>
        <p className="text-gray-400 text-sm">
          Four physical x16 slots does not mean four GPUs at x16.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-3 flex-wrap">
        {[
          { id: 2, label: 'Double-width GPU' },
          { id: 3, label: 'Triple-width GPU' },
        ].map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setWidth(o.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              width === o.id ? 'bg-brand-orange text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {o.label}
          </button>
        ))}
        {[
          { id: 'consumer', label: 'x16/x8/x8/x4 board' },
          { id: 'server', label: 'x16/x16/x16/x16 board' },
        ].map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setBoard(o.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              board === o.id ? 'bg-brand-blue text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="max-w-lg mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="text-[10px] text-gray-500 mb-2">Motherboard · 7 slot positions</div>
        <div className="space-y-1">
          {Array.from({ length: SLOTS }).map((_, s) => {
            const owner = fitted.find((p) => s >= p.start && s < p.start + width);
            const isX16 = x16Positions.includes(s);
            return (
              <div key={s} className="flex items-center gap-2">
                <span className="text-[8px] font-mono text-gray-600 w-8 shrink-0">
                  {isX16 ? 'x16' : '—'}
                </span>
                <div
                  className={`flex-1 h-5 rounded flex items-center px-2 text-[9px] font-bold ${
                    owner
                      ? 'bg-brand-green/25 border border-brand-green text-brand-green'
                      : isX16
                        ? 'bg-gray-900 border border-gray-700 text-gray-600'
                        : 'bg-gray-900/50 border border-gray-800 text-gray-700'
                  }`}
                >
                  {owner
                    ? owner.start === s
                      ? `GPU ${owner.idx + 1} · running at x${owner.lanes}`
                      : 'blocked by cooler'
                    : isX16
                      ? 'free x16 slot'
                      : 'spacer'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-lg mx-auto w-full flex items-center gap-3 mb-3">
        <span className="text-[10px] text-gray-400 shrink-0">GPUs wanted</span>
        <input
          type="range"
          min="1"
          max="4"
          value={gpus}
          onChange={(e) => setGpus(Number(e.target.value))}
          className="flex-1 accent-brand-green"
        />
        <span className="font-mono text-xs text-white w-4 text-right">{gpus}</span>
      </div>

      <div className="max-w-lg mx-auto w-full text-sm text-center mb-2">
        {fitted.length < gpus ? (
          <p className="text-brand-rose flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Only {fitted.length} of {gpus} fit — a{' '}
            {width}-slot cooler covers the neighbouring slot.
          </p>
        ) : (
          <p className="text-brand-green flex items-center justify-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> All {gpus} fit
            {board === 'consumer' ? ' — but not all at x16.' : ' at full x16.'}
          </p>
        )}
      </div>

      <div className="max-w-lg mx-auto w-full rounded-lg border border-gray-700 bg-black/30 p-2.5 text-[11px] text-gray-400 flex items-start gap-2">
        <Layers className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
        <span>
          Also check <span className="text-white font-semibold">memory support</span>: maximum RAM and
          DIMM slot count. The GPU has its own VRAM, but system RAM is what stages and preprocesses
          very large datasets.
        </span>
      </div>
    </div>
  );
}

/* ── 10. The CPU as conductor ─────────────────────────────────────────────── */

const CPUS = [
  { id: 'i9', name: 'Core i9', lanes: 20, cores: 24, tier: 'Consumer' },
  { id: 'r9', name: 'Ryzen 9', lanes: 24, cores: 16, tier: 'Consumer' },
  { id: 'xeon', name: 'Xeon W', lanes: 64, cores: 24, tier: 'Server' },
  { id: 'tr', name: 'Threadripper', lanes: 88, cores: 32, tier: 'HEDT' },
  { id: 'epyc', name: 'EPYC', lanes: 128, cores: 64, tier: 'Server' },
];

export function CpuConductorVisualizer() {
  const [cpu, setCpu] = useState('tr');
  const [gpus, setGpus] = useState(4);
  const [cores, setCores] = useState(32);

  const c = CPUS.find((x) => x.id === cpu);
  const needed = gpus * 16 + 4;
  const enough = c.lanes >= needed;

  const supply = cores * 0.32;
  const demand = gpus * 1.6;
  const util = Math.min(100, (supply / demand) * 100);
  const wasteful = supply > demand * 1.8;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The CPU: Conductor, Not Soloist</h3>
        <p className="text-gray-400 text-sm">Lanes first, cores second, clock speed last.</p>
      </div>

      <Tabs
        value={cpu}
        onChange={setCpu}
        accent="bg-brand-purple"
        options={CPUS.map((x) => ({ id: x.id, label: x.name }))}
      />

      <div className="max-w-lg mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-4 h-4 text-brand-purple" />
          <span className="text-xs font-bold text-white">{c.name}</span>
          <span className="text-[9px] uppercase tracking-wider text-gray-500">{c.tier}</span>
          <span className="ml-auto font-mono text-[10px] text-gray-400">
            {c.lanes} lanes · {c.cores} cores
          </span>
        </div>

        <div className="flex gap-0.5 mb-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-6 rounded-sm flex items-center justify-center text-[8px] font-bold ${
                i < gpus
                  ? c.lanes >= (i + 1) * 16 + 4
                    ? 'bg-brand-green/30 text-brand-green border border-brand-green/50'
                    : 'bg-brand-rose/30 text-brand-rose border border-brand-rose/50'
                  : 'bg-gray-900 text-gray-700 border border-gray-800'
              }`}
            >
              {i < gpus ? (c.lanes >= (i + 1) * 16 + 4 ? 'x16' : 'x8') : '—'}
            </div>
          ))}
        </div>

        <Meter
          label={`Lane budget · ${needed} needed for ${gpus} GPUs + NVMe`}
          value={(needed / c.lanes) * 100}
          unit={enough ? `${c.lanes - needed} spare` : 'over budget'}
          tone={enough ? 'bg-brand-green' : 'bg-brand-rose'}
        />
      </div>

      <div className="max-w-lg mx-auto w-full space-y-2.5 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 shrink-0 w-20">GPUs</span>
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
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 shrink-0 w-20">CPU cores</span>
          <input
            type="range"
            min="4"
            max="64"
            step="4"
            value={cores}
            onChange={(e) => setCores(Number(e.target.value))}
            className="flex-1 accent-brand-blue"
          />
          <span className="font-mono text-xs text-white w-4 text-right">{cores}</span>
        </div>

        <Meter
          label="GPU utilisation from the data pipeline"
          value={util}
          unit={`${util.toFixed(0)}%`}
          tone={util < 70 ? 'bg-brand-rose' : 'bg-brand-green'}
        />
      </div>

      <div className="max-w-lg mx-auto w-full text-sm text-center">
        {!enough ? (
          <p className="text-brand-rose flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Not enough lanes — GPUs drop to x8 and lose half
            their motherboard bandwidth.
          </p>
        ) : util < 70 ? (
          <p className="text-brand-rose flex items-center justify-center gap-1.5">
            <Gauge className="w-4 h-4" /> Too few cores: preprocessing cannot keep up, so your
            accelerators sit idle burning electricity.
          </p>
        ) : wasteful ? (
          <p className="text-brand-orange flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> GPUs are fed, but this much CPU for {gpus} GPUs is
            wasted capital expenditure.
          </p>
        ) : (
          <p className="text-brand-green flex items-center justify-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> Balanced: enough lanes for full bandwidth, enough
            cores to keep every GPU fed.
          </p>
        )}
      </div>
    </div>
  );
}
