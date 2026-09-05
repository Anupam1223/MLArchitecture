import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Cpu,
  HardDrive,
  AlertTriangle,
  Server,
  Zap,
} from 'lucide-react';

function StepBar({ step, total, playing, onPrev, onNext, onPlay, onReset }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={step === 0}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white text-xs font-semibold"
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>
      <button
        type="button"
        onClick={onPlay}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-semibold ${
          playing ? 'bg-brand-orange hover:bg-orange-500' : 'bg-brand-blue hover:bg-blue-600'
        }`}
      >
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        {playing ? 'Pause' : 'Auto-Play'}
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={step >= total - 1}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-gray-900 hover:bg-gray-200 text-xs font-bold"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Reset
      </button>
    </div>
  );
}

/** System RAM vs GPU VRAM — GPU can only compute on what is in VRAM */
export function RamVramVisualizer() {
  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll justify-center">
      <div className="text-center mb-5">
        <h3 className="text-xl font-semibold text-white">System RAM vs GPU VRAM</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full">
        <div className="rounded-2xl border-2 border-brand-blue/60 bg-brand-blue/5 p-5">
          <div className="flex items-center gap-2 text-brand-blue font-bold mb-3">
            <Cpu className="w-5 h-5" />
            System RAM
            <span className="text-[10px] font-normal opacity-70">(Random Access Memory)</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            The main memory of the server, directly accessible by the CPU. It holds the operating
            system, data preprocessing scripts, and entire datasets that are waiting to be fed to
            the accelerator.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-brand-green/60 bg-brand-green/5 p-5">
          <div className="flex items-center gap-2 text-brand-green font-bold mb-3">
            <Zap className="w-5 h-5" />
            GPU VRAM
            <span className="text-[10px] font-normal opacity-70">(Video RAM)</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            High-speed memory located directly on the GPU card. It is significantly faster than
            system RAM and is where all the action happens for accelerated deep learning. The GPU
            can only operate on data that is present in its own VRAM.
          </p>
        </div>
      </div>

      <p className="max-w-2xl mx-auto w-full text-center text-sm text-gray-400 mt-5">
        For GPU-accelerated workloads, VRAM is almost always the more significant constraint.
      </p>
    </div>
  );
}

const VRAM_LAYERS = [
  {
    id: 'params',
    label: 'Model Parameters (weights & biases)',
    color: 'bg-sky-300 text-sky-950',
    flex: 2,
    detail:
      'The trained (or training) weights. Size = #parameters × bytes per number (FP32 = 4 bytes).',
  },
  {
    id: 'grads',
    label: 'Gradients',
    color: 'bg-rose-300 text-rose-950',
    flex: 2,
    detail: 'One gradient per parameter from backprop. Almost always the same size as the weights.',
  },
  {
    id: 'optim',
    label: 'Optimizer States (Adam momentum + variance)',
    color: 'bg-emerald-300 text-emerald-950',
    flex: 4,
    detail: 'Adam keeps two extra FP32 states per parameter — often the fattest slice of VRAM.',
  },
  {
    id: 'acts',
    label: 'Activations (forward-pass cache)',
    color: 'bg-orange-300 text-orange-950',
    flex: 2.2,
    detail: 'Every layer’s output, kept for the backward pass. Grows with batch size and sequence length.',
  },
  {
    id: 'batch',
    label: 'Input Data Batch',
    color: 'bg-violet-300 text-violet-950',
    flex: 1,
    detail: 'The tokens / images in this step. Small vs the model, but it still has to fit.',
  },
];

export function VramStackVisualizer() {
  const [layer, setLayer] = useState('optim');
  const active = VRAM_LAYERS.find((l) => l.id === layer);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">GPU VRAM Allocation During Training</h3>
        <p className="text-gray-400 text-sm">Click a band. The stack is much taller than “the model file.”</p>
      </div>

      <div className="max-w-md mx-auto w-full rounded-2xl bg-white p-4 mb-3">
        <div className="flex flex-col gap-1.5 h-64">
          {VRAM_LAYERS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLayer(l.id)}
              style={{ flex: l.flex }}
              className={`rounded-lg ${l.color} text-[11px] md:text-xs font-bold px-3 flex items-center justify-center text-center leading-tight transition ${
                layer === l.id ? 'ring-2 ring-slate-900 scale-[1.01]' : 'opacity-85'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-sm text-gray-300 text-center">
        {active.detail}
      </div>
    </div>
  );
}

const MODELS = [
  { id: '1b', label: '1B', params: 1 },
  { id: '7b', label: '7B', params: 7 },
  { id: '13b', label: '13B', params: 13 },
  { id: '70b', label: '70B', params: 70 },
];

/** Walk the 7B × 4 bytes math; compare to A100 80GB */
export function SevenBMathVisualizer() {
  const [model, setModel] = useState('7b');
  const [bytes, setBytes] = useState(4);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const params = MODELS.find((m) => m.id === model).params;
  const weightGb = params * bytes;
  const gradGb = weightGb;
  const optimGb = 2 * weightGb;
  const totalGb = weightGb + gradGb + optimGb;
  const a100 = 80;
  const oom = totalGb > a100;

  const steps = [
    {
      title: 'Parameters',
      formula: `${params}B × ${bytes} bytes = ${weightGb} GB`,
      reveal: 'params',
    },
    {
      title: 'Gradients (same size)',
      formula: `${params}B × ${bytes} bytes = ${gradGb} GB`,
      reveal: 'grads',
    },
    {
      title: 'Adam states (×2)',
      formula: `2 × ${params}B × ${bytes} bytes = ${optimGb} GB`,
      reveal: 'optim',
    },
    {
      title: 'Add them up',
      formula: `${weightGb} + ${gradGb} + ${optimGb} = ${totalGb} GB`,
      reveal: 'total',
    },
  ];

  useEffect(() => {
    if (!playing) return undefined;
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1200);
    return () => clearInterval(t);
  }, [playing]);

  const shown = step;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">The 7B Homework, Live</h3>
        <p className="text-gray-400 text-sm">
          Change model size or precision, then step the formula. Activations are not even in this total.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-2">
        {MODELS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setModel(m.id);
              setStep(0);
              setPlaying(false);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold ${
              model === m.id ? 'bg-brand-purple text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {m.label}
          </button>
        ))}
        {[
          { b: 4, label: 'FP32 (4 B)' },
          { b: 2, label: 'FP16 (2 B)' },
        ].map((p) => (
          <button
            key={p.b}
            type="button"
            onClick={() => {
              setBytes(p.b);
              setStep(0);
              setPlaying(false);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold ${
              bytes === p.b ? 'bg-brand-orange text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="max-w-lg mx-auto w-full rounded-2xl border border-gray-700 bg-gray-950 p-4 mb-3 font-mono text-sm">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className={`py-1.5 ${i <= shown ? 'text-cyan-200' : 'text-gray-600'}`}
          >
            <span className="text-[10px] uppercase tracking-wider text-gray-500 mr-2">{s.title}</span>
            {i <= shown ? s.formula : '…'}
          </div>
        ))}
        {shown >= 3 && (
          <div className={`mt-2 text-center font-sans text-sm font-bold ${oom ? 'text-brand-rose' : 'text-brand-green'}`}>
            {oom ? (
              <span className="inline-flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {totalGb} GB &gt; A100 80 GB → OOM
              </span>
            ) : (
              `${totalGb} GB fits on an 80 GB A100 (still missing activations)`
            )}
          </div>
        )}
      </div>

      <div className="max-w-md mx-auto w-full mb-2">
        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
          <span>VRAM used (params+grads+Adam)</span>
          <span>A100 = 80 GB</span>
        </div>
        <div className="h-8 rounded-full bg-gray-900 border border-gray-700 overflow-hidden relative">
          <div
            className={`h-full ${oom ? 'bg-brand-rose' : 'bg-brand-green'}`}
            style={{ width: `${Math.min(100, (totalGb / a100) * 100)}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[11px] font-mono text-white">
            {totalGb} / 80 GB
          </div>
        </div>
      </div>

      <StepBar
        step={step}
        total={steps.length}
        playing={playing}
        onPrev={() => {
          setPlaying(false);
          setStep((s) => Math.max(0, s - 1));
        }}
        onNext={() => {
          setPlaying(false);
          setStep((s) => Math.min(steps.length - 1, s + 1));
        }}
        onPlay={() => setPlaying((p) => !p)}
        onReset={() => {
          setStep(0);
          setPlaying(false);
        }}
      />
    </div>
  );
}

/** Training stack vs inference (weights + activations only) */
export function InferenceMemoryVisualizer() {
  const [mode, setMode] = useState('train');
  const train = [
    { label: 'Weights 28 GB', h: 28, c: 'bg-sky-400' },
    { label: 'Gradients 28 GB', h: 28, c: 'bg-rose-400' },
    { label: 'Adam 56 GB', h: 56, c: 'bg-emerald-400' },
    { label: 'Activations ~8 GB', h: 8, c: 'bg-orange-400' },
  ];
  const infer = [
    { label: 'Weights 28 GB', h: 28, c: 'bg-sky-400' },
    { label: 'Activations (1 request) ~2 GB', h: 2, c: 'bg-orange-400' },
  ];
  const bars = mode === 'train' ? train : infer;
  const total = bars.reduce((s, b) => s + b.h, 0);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Same 7B Model, Two Footprints</h3>
        <p className="text-gray-400 text-sm">
          Inference drops gradients and optimizer states. 28 GB of weights can live on a GPU that
          could never train it.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {[
          { id: 'train', label: 'Training (~120 GB)' },
          { id: 'infer', label: 'Inference (~30 GB)' },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold ${
              mode === m.id ? 'bg-brand-blue text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex items-end justify-center gap-2 h-52 max-w-lg mx-auto w-full mb-3">
        {bars.map((b) => (
          <div key={b.label} className="flex-1 flex flex-col items-center justify-end h-full">
            <div
              className={`w-full max-w-[90px] rounded-t-lg ${b.c} transition-all duration-500`}
              style={{ height: `${(b.h / 120) * 100}%` }}
            />
            <div className="text-[10px] text-gray-400 text-center mt-1 leading-tight">{b.label}</div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-300">
        Total ≈ <span className="font-mono text-white font-bold">{total} GB</span>
        {mode === 'infer'
          ? ' — often fits an A100 40 GB or even a 24 GB card with a short sequence.'
          : ' — already past an 80 GB A100 before CUDA overhead.'}
      </div>
    </div>
  );
}

/** Idle GPU waiting on I/O; toggle throughput / latency / capacity */
export function StorageAttributesVisualizer() {
  const [attr, setAttr] = useState('throughput');
  const [starve, setStarve] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 400);
    return () => clearInterval(t);
  }, []);

  const attrs = [
    {
      id: 'throughput',
      label: 'Throughput',
      unit: 'MB/s or GB/s',
      detail:
        'How much data arrives per second. Huge image / video batches need a wide pipe so the GPU is not waiting.',
    },
    {
      id: 'latency',
      label: 'Latency',
      unit: 'μs or ms',
      detail:
        'Time to the first byte. Millions of tiny files: seek time adds up even if the pipe is wide.',
    },
    {
      id: 'capacity',
      label: 'Capacity',
      unit: 'TB → PB',
      detail: 'How much you can keep. Datasets range from a few GB to petabyte data lakes.',
    },
  ];
  const a = attrs.find((x) => x.id === attr);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Feed the GPU or Watch it Idle</h3>
        <p className="text-gray-400 text-sm">I/O is the silent tax on expensive accelerators.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto w-full mb-4">
        <div className="rounded-xl border border-gray-700 p-3">
          <div className="text-[10px] uppercase text-gray-500 mb-2">Storage → GPU</div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-8 h-8 text-gray-400" />
            <div className="flex-1 h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className={`h-full ${starve ? 'bg-brand-rose w-1/4' : 'bg-brand-green w-full'} transition-all`}
                style={starve ? { width: `${20 + (tick % 4) * 8}%` } : undefined}
              />
            </div>
            <div
              className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-[10px] font-bold ${
                starve
                  ? 'border-brand-rose text-brand-rose'
                  : 'border-brand-green text-brand-green'
              }`}
            >
              {starve ? 'IDLE GPU' : 'BUSY'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStarve((s) => !s)}
            className="mt-3 w-full py-1.5 rounded-lg bg-gray-800 text-xs font-bold text-white"
          >
            {starve ? 'Fix the I/O path' : 'Throttle storage (starve)'}
          </button>
        </div>

        <div className="rounded-xl border border-gray-700 p-3">
          <div className="flex gap-1 mb-3">
            {attrs.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setAttr(x.id)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold ${
                  attr === x.id ? 'bg-brand-blue text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="text-xs font-mono text-cyan-300 mb-1">{a.unit}</div>
          <p className="text-sm text-gray-300">{a.detail}</p>
        </div>
      </div>
    </div>
  );
}

/** NAS vs distributed FS vs object storage, scaled by number of reading nodes */
export function SharedStorageVisualizer() {
  const [mode, setMode] = useState('nas');
  const [clients, setClients] = useState(4);

  const NAS_TOTAL = 1000;
  const DFS_NODES = 4;
  const DFS_PER_NODE = 1000;
  const OBJ_PER_CLIENT = 400;

  const perClient =
    mode === 'nas'
      ? Math.round(NAS_TOTAL / clients)
      : mode === 'dfs'
        ? Math.round(Math.min(DFS_PER_NODE, (DFS_NODES * DFS_PER_NODE) / clients))
        : OBJ_PER_CLIENT;

  const notes = {
    nas: 'One NFS server on the LAN. Simple and shared — but every client divides the same pipe, and the box is a single point of failure.',
    dfs: 'Ceph / Lustre pool many servers into one namespace. A file is striped, so it is read from several disks in parallel: huge aggregate throughput, harder to operate.',
    obj: 'S3 / GCS / Azure Blob store flat objects (data + metadata + ID). Effectively unlimited and durable, but >20 ms away — stage a shard to local NVMe before the job.',
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">When One Disk Is Not Enough</h3>
        <p className="text-gray-400 text-sm">
          Add reading nodes and watch which design keeps feeding them.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-3 flex-wrap">
        {[
          { id: 'nas', label: 'NAS (NFS)' },
          { id: 'dfs', label: 'Distributed FS' },
          { id: 'obj', label: 'Object Storage' },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              mode === m.id ? 'bg-brand-orange text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="max-w-xl mx-auto w-full rounded-2xl border border-gray-700 bg-gray-950 p-4 mb-3">
        <div className="flex justify-center gap-1.5 mb-2 flex-wrap">
          {Array.from({ length: clients }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg bg-sky-300 text-sky-950 text-[10px] font-bold px-2 py-1.5"
            >
              GPU {i + 1}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-1 mb-2">
          {Array.from({ length: clients }).map((_, i) => (
            <div
              key={i}
              className={`w-0.5 h-6 ${
                mode === 'nas' ? 'bg-amber-400' : mode === 'dfs' ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
          ))}
        </div>

        {mode === 'nas' && (
          <div className="rounded-xl bg-amber-200 text-amber-950 text-center py-3 font-bold text-xs">
            Single NAS server · ~1 GB/s total
            <div className="text-[10px] font-normal mt-1">
              every client shares this one pipe · single point of failure
            </div>
          </div>
        )}

        {mode === 'dfs' && (
          <>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: DFS_NODES }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-emerald-200 text-emerald-950 text-[10px] font-bold text-center py-2"
                >
                  Node {i + 1}
                  <div className="font-mono font-normal">stripe {String.fromCharCode(65 + i)}</div>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-gray-400 text-center mt-2">
              one unified namespace · one file read in parallel from 4 disks
            </div>
          </>
        )}

        {mode === 'obj' && (
          <>
            <div className="rounded-xl bg-rose-200 text-rose-950 text-center py-3 font-bold text-xs">
              Cloud bucket · flat address space
              <div className="text-[10px] font-normal mt-1">
                object = data + metadata + unique ID
              </div>
            </div>
            <div className="text-[10px] text-gray-400 text-center mt-2">
              source of truth → copy the shard to local NVMe before training
            </div>
          </>
        )}
      </div>

      <div className="max-w-xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] text-gray-400 shrink-0">Reading nodes</span>
          <input
            type="range"
            min="1"
            max="8"
            value={clients}
            onChange={(e) => setClients(Number(e.target.value))}
            className="flex-1 accent-brand-orange"
          />
          <span className="font-mono text-xs text-white w-6 text-right">{clients}</span>
        </div>

        <div className="rounded-xl border border-gray-700 bg-black/40 p-3 mb-2">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Bandwidth each GPU actually gets</span>
            <span className="font-mono text-white">{perClient} MB/s</span>
          </div>
          <div className="h-3 rounded-full bg-gray-900 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                perClient < 300 ? 'bg-brand-rose' : perClient < 700 ? 'bg-brand-orange' : 'bg-brand-green'
              }`}
              style={{ width: `${Math.min(100, (perClient / 1000) * 100)}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-gray-300">{notes[mode]}</p>
      </div>
    </div>
  );
}

const LOCAL = [
  { id: 'hdd', name: 'HDD', thr: 180, lat: 95, note: 'Spinning rust. Cheap, huge, too slow for active training. Cold archive only.' },
  { id: 'sata', name: 'SATA SSD', thr: 550, lat: 28, note: 'No moving parts. Fine for small/medium datasets on one box.' },
  { id: 'nvme', name: 'NVMe SSD', thr: 7000, lat: 8, note: 'Talks PCIe. 7,000+ MB/s sequential. The default way to feed GPUs locally.' },
];

export function LocalStorageVisualizer() {
  const [pick, setPick] = useState('nvme');
  const p = LOCAL.find((x) => x.id === pick);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Local Storage: Speed at Your Fingertips</h3>
        <p className="text-gray-400 text-sm">Blue = throughput. Rose = latency (log-ish). Click a drive.</p>
      </div>

      <div className="max-w-md mx-auto w-full rounded-2xl bg-white p-4 mb-3">
        <div className="flex items-end justify-around h-44">
          {LOCAL.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setPick(d.id)}
              className="w-16 flex flex-col items-center justify-end h-full"
            >
              <div className="flex items-end gap-1 h-36">
                <div
                  className={`w-4 rounded-t ${pick === d.id ? 'bg-sky-500' : 'bg-sky-300'}`}
                  style={{ height: `${(d.thr / 7000) * 100}%` }}
                />
                <div
                  className={`w-4 rounded-t ${pick === d.id ? 'bg-rose-400' : 'bg-rose-200'}`}
                  style={{ height: `${d.lat}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-800 mt-1">{d.name}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-3 mt-2 text-[10px] text-slate-500">
          <span className="text-sky-600">■ throughput</span>
          <span className="text-rose-400">■ latency</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-sm text-gray-300 text-center">
        <span className="font-bold text-white">{p.name}: </span>
        {p.note}
      </div>
    </div>
  );
}

const MAP_NODES = {
  nvme: {
    name: 'NVMe SSD',
    zone: 'Local Machine',
    lat: '<100 μs',
    bw: '~7 GB/s',
    pill: 'bg-emerald-200 text-emerald-950',
    ring: 'ring-emerald-400',
    trip: 400,
    detail:
      'Attached straight to the PCIe bus inside the box. Lowest latency, highest throughput — this is where you stage the shard a training job is actively reading.',
  },
  sata: {
    name: 'SATA SSD',
    zone: 'Local Machine',
    lat: '<150 μs',
    bw: '~550 MB/s',
    pill: 'bg-lime-200 text-lime-950',
    ring: 'ring-lime-400',
    trip: 650,
    detail:
      'Also local flash, but stuck behind the older SATA interface. Still fine for small to medium datasets on a single workstation.',
  },
  nas: {
    name: 'NAS',
    zone: 'Local Network (LAN)',
    lat: '>1 ms',
    bw: '~1 GB/s',
    pill: 'bg-amber-200 text-amber-950',
    ring: 'ring-amber-400',
    trip: 1500,
    detail:
      'A dedicated file server reached over the LAN, usually via NFS. One copy of the dataset that a small cluster can share — and one box that becomes a bottleneck when every client reads at once.',
  },
  object: {
    name: 'Object Storage',
    zone: 'Cloud / WAN',
    lat: '>20 ms',
    bw: 'Variable',
    pill: 'bg-rose-200 text-rose-950',
    ring: 'ring-rose-400',
    trip: 2800,
    detail:
      'S3 / GCS / Azure Blob, reached over the internet. Effectively unlimited and durable, so it is the data lake of record — but far too slow for the training hot loop. Copy what you need down to local NVMe first.',
  },
};

function MapArrow({ dir, label, sub, active }) {
  const line = active ? 'bg-brand-orange' : 'bg-gray-600';
  const head = active ? 'border-b-brand-orange border-t-brand-orange' : 'border-b-gray-600 border-t-gray-600';
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center">
        {dir === 'up' && (
          <div className={`w-0 h-0 border-x-4 border-x-transparent border-b-[7px] ${head}`} />
        )}
        <div className={`w-0.5 h-10 ${line} transition-colors`} />
        {dir === 'down' && (
          <div className={`w-0 h-0 border-x-4 border-x-transparent border-t-[7px] ${head}`} />
        )}
      </div>
      <div className={`text-[10px] leading-tight ${active ? 'text-brand-orange' : 'text-gray-500'}`}>
        <div>{label}</div>
        <div>{sub}</div>
      </div>
    </div>
  );
}

/** Faithful, clickable version of the storage-hierarchy figure */
export function StorageMapVisualizer() {
  const [pick, setPick] = useState('nas');
  const [travelling, setTravelling] = useState(false);
  const node = MAP_NODES[pick];

  useEffect(() => {
    if (!travelling) return undefined;
    const t = setTimeout(() => setTravelling(false), node.trip);
    return () => clearTimeout(t);
  }, [travelling, node.trip]);

  const Pill = ({ id }) => {
    const n = MAP_NODES[id];
    return (
      <button
        type="button"
        onClick={() => {
          setPick(id);
          setTravelling(false);
        }}
        className={`rounded-xl px-4 py-3 text-xs font-bold transition ${n.pill} ${
          pick === id ? `ring-2 ${n.ring} scale-105` : 'opacity-80 hover:opacity-100'
        }`}
      >
        {n.name}
      </button>
    );
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The Hierarchy of Storage for AI</h3>
        <p className="text-gray-400 text-sm">
          Click a store, then send a read. The farther from compute, the longer the wait.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full">
        <div className="grid grid-cols-2 gap-3 mb-1">
          <div className="rounded-lg border border-gray-500 p-3 flex flex-col items-center gap-2">
            <span className="text-[10px] text-gray-400">Local Network (LAN)</span>
            <Pill id="nas" />
          </div>
          <div className="rounded-lg border border-gray-500 p-3 flex flex-col items-center gap-2">
            <span className="text-[10px] text-gray-400">Cloud / WAN</span>
            <Pill id="object" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex justify-center">
            <MapArrow dir="up" label=">1 ms" sub="~1 GB/s" active={pick === 'nas'} />
          </div>
          <div className="flex justify-center">
            <MapArrow dir="up" label=">20 ms" sub="Variable" active={pick === 'object'} />
          </div>
        </div>

        <div className="rounded-lg border border-gray-500 p-3">
          <div className="text-[10px] text-gray-400 text-center mb-2">Local Machine</div>
          <div className="flex justify-center">
            <div
              className={`rounded-xl px-5 py-3 text-xs font-bold bg-sky-300 text-sky-950 ${
                travelling ? 'animate-pulse' : ''
              }`}
            >
              Compute
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 my-1">
            <div className="flex justify-center">
              <MapArrow dir="down" label="<100 μs" sub="~7 GB/s" active={pick === 'nvme'} />
            </div>
            <div className="flex justify-center">
              <MapArrow dir="down" label="<150 μs" sub="~550 MB/s" active={pick === 'sata'} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex justify-center">
              <Pill id="nvme" />
            </div>
            <div className="flex justify-center">
              <Pill id="sata" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto w-full mt-3">
        <div className="h-2 rounded-full bg-gray-800 overflow-hidden mb-2">
          <div
            className="h-full bg-brand-orange rounded-full"
            style={{
              width: travelling ? '100%' : '0%',
              transition: travelling ? `width ${node.trip}ms linear` : 'none',
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-gray-400">
            <span className="font-bold text-white">{node.name}</span> · {node.zone} ·{' '}
            <span className="font-mono">{node.lat}</span> ·{' '}
            <span className="font-mono">{node.bw}</span>
          </div>
          <button
            type="button"
            onClick={() => setTravelling(true)}
            className="px-3 py-1.5 rounded-lg bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold shrink-0"
          >
            {travelling ? 'Fetching…' : 'Read a batch'}
          </button>
        </div>
        <p className="text-sm text-gray-300 mt-3">{node.detail}</p>
        <p className="text-[11px] text-gray-500 italic mt-3">
          Performance generally decreases as data moves further away from the compute core, trading
          speed for increased scale and shareability.
        </p>
      </div>
    </div>
  );
}

/** Bandwidth = pipe width, latency = pipe length */
export function BandwidthLatencyVisualizer() {
  const [bandwidth, setBandwidth] = useState('high');
  const [latency, setLatency] = useState('low');

  const speedSeconds = latency === 'low' ? 0.5 : 3;
  const laneCount = bandwidth === 'high' ? 8 : 2;

  return (
    <div className="flex flex-col w-full h-full p-4 relative justify-center items-center overflow-auto custom-scroll">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Networking: Bandwidth vs. Latency</h3>
        <p className="text-gray-400 text-sm max-w-xl">
          In distributed training, GPUs must constantly synchronize gradients. The network acts as a
          pipe. Bandwidth is the width of the pipe; latency is the length.
        </p>
      </div>

      <div className="flex gap-4 md:gap-8 mb-6 z-20 flex-wrap justify-center">
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
          <span className="block text-xs text-gray-400 uppercase font-bold mb-2 text-center">
            Bandwidth (Lanes)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setBandwidth('low')}
              className={`px-3 py-1 text-sm rounded ${
                bandwidth === 'low' ? 'bg-brand-blue text-white' : 'bg-gray-900 text-gray-400'
              }`}
            >
              Low (10 GbE)
            </button>
            <button
              type="button"
              onClick={() => setBandwidth('high')}
              className={`px-3 py-1 text-sm rounded ${
                bandwidth === 'high' ? 'bg-brand-blue text-white' : 'bg-gray-900 text-gray-400'
              }`}
            >
              High (400 GbE)
            </button>
          </div>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
          <span className="block text-xs text-gray-400 uppercase font-bold mb-2 text-center">
            Latency (Delay)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLatency('high')}
              className={`px-3 py-1 text-sm rounded ${
                latency === 'high' ? 'bg-brand-purple text-white' : 'bg-gray-900 text-gray-400'
              }`}
            >
              High (Cloud/TCP)
            </button>
            <button
              type="button"
              onClick={() => setLatency('low')}
              className={`px-3 py-1 text-sm rounded ${
                latency === 'low' ? 'bg-brand-purple text-white' : 'bg-gray-900 text-gray-400'
              }`}
            >
              Low (InfiniBand)
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl flex items-center justify-between px-4 md:px-8 relative h-48 bg-gray-900/50 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="flex flex-col items-center z-10 bg-gray-900 p-3 rounded-xl border border-brand-green shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Server className="w-8 h-8 text-brand-green mb-1" />
          <span className="font-bold text-xs text-white">GPU Node 1</span>
        </div>

        <div className="flex-1 h-full relative mx-4 flex flex-col justify-center overflow-hidden py-8">
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-y-2 border-gray-700 transition-all duration-500 bg-gray-800/30"
            style={{ height: bandwidth === 'high' ? '120px' : '40px' }}
          />

          <div
            className="relative w-full z-10 transition-all duration-500"
            style={{ height: bandwidth === 'high' ? '100px' : '20px' }}
          >
            {Array.from({ length: laneCount }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 h-2 bg-brand-cyan/80 rounded-full shadow-[0_0_8px_#06b6d4]"
                style={{
                  top: `${(i / Math.max(1, laneCount - 1)) * 100}%`,
                  width: '40px',
                  transform: 'translateY(-50%)',
                  animation: `packetMove ${speedSeconds}s linear infinite`,
                  animationDelay: `${((i * speedSeconds) / laneCount).toFixed(2)}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center z-10 bg-gray-900 p-3 rounded-xl border border-brand-green shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Server className="w-8 h-8 text-brand-green mb-1" />
          <span className="font-bold text-xs text-white">GPU Node 2</span>
        </div>
      </div>

      <div className="h-12 mt-5 text-center text-sm font-medium text-gray-400 max-w-xl">
        {bandwidth === 'low' &&
          latency === 'high' &&
          'Worst case: slow transfer of small amounts of data. Severe bottleneck.'}
        {bandwidth === 'high' &&
          latency === 'high' &&
          'Moves large files well, but synchronization steps (frequent small messages) will stall the GPUs.'}
        {bandwidth === 'low' &&
          latency === 'low' &&
          'Snappy syncs, but transferring model checkpoints or huge datasets takes forever.'}
        {bandwidth === 'high' && latency === 'low' && (
          <span className="text-brand-green">
            Ideal AI network (e.g. InfiniBand): massive data volumes move instantly.
          </span>
        )}
      </div>
    </div>
  );
}

/** 8-GPU gradient sync as a full mesh */
export function AllToAllVisualizer() {
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!syncing) return undefined;
    const t = setTimeout(() => setSyncing(false), 1600);
    return () => clearTimeout(t);
  }, [syncing]);

  const nodes = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll items-center justify-center">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">All-to-All Gradient Sync</h3>
        <p className="text-gray-400 text-sm max-w-lg">
          After every step each GPU holds one slice of the gradient. Nobody can start the next step
          until everybody has the averaged whole.
        </p>
      </div>

      <div className="relative w-64 h-64 mx-auto mb-3">
        {nodes.map((i) => {
          const ang = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + 42 * Math.cos(ang);
          const y = 50 + 42 * Math.sin(ang);
          return (
            <div
              key={i}
              className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-lg flex items-center justify-center text-[10px] font-bold border-2 z-10 transition-colors ${
                syncing
                  ? 'border-brand-orange bg-brand-orange/20 text-white'
                  : 'border-brand-green/50 bg-gray-900 text-gray-300'
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              G{i}
            </div>
          );
        })}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          {syncing &&
            nodes.flatMap((i) =>
              nodes
                .filter((j) => j > i)
                .map((j) => {
                  const ai = (i / 8) * Math.PI * 2 - Math.PI / 2;
                  const aj = (j / 8) * Math.PI * 2 - Math.PI / 2;
                  return (
                    <line
                      key={`${i}-${j}`}
                      x1={50 + 32 * Math.cos(ai)}
                      y1={50 + 32 * Math.sin(ai)}
                      x2={50 + 32 * Math.cos(aj)}
                      y2={50 + 32 * Math.sin(aj)}
                      stroke="#f59e0b"
                      strokeWidth="0.4"
                      opacity="0.7"
                    />
                  );
                })
            )}
        </svg>
      </div>

      <button
        type="button"
        onClick={() => setSyncing(true)}
        className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-orange-500 text-white text-xs font-bold"
      >
        Sync gradients (all-to-all)
      </button>
      <p className="text-[11px] text-gray-500 text-center mt-3 max-w-md">
        28 links light up for 8 GPUs. The slowest one holds up the entire cluster — that compounding
        delay is why AI clusters buy specialized fabrics.
      </p>
    </div>
  );
}

/** TCP/IP stack hops vs GPU-Direct RDMA */
export function RdmaVisualizer() {
  const [mode, setMode] = useState('tcp');
  const tcp = mode === 'tcp';
  const stroke = tcp ? '#3b82f6' : '#8b5cf6';

  return (
    <div className="flex flex-col w-full h-full p-4 relative justify-center items-center overflow-auto custom-scroll">
      <div className="text-center mb-4 z-20">
        <h3 className="text-xl font-semibold text-white mb-2">Bypassing the Bottleneck: RDMA</h3>
        <p className="text-gray-400 text-sm max-w-2xl">
          Traditional networking requires the CPU to handle data, resulting in latency. Remote
          Direct Memory Access (RDMA) allows network cards to read/write directly to GPU memory.
        </p>

        <div className="flex justify-center gap-3 mt-4 flex-wrap">
          <button
            type="button"
            onClick={() => setMode('tcp')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${
              tcp ? 'bg-gray-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400'
            }`}
          >
            Standard TCP/IP Stack
          </button>
          <button
            type="button"
            onClick={() => setMode('rdma')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${
              !tcp
                ? 'bg-brand-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                : 'bg-gray-800 text-brand-purple border border-brand-purple/30'
            }`}
          >
            RDMA (InfiniBand/RoCE)
          </button>
        </div>
      </div>

      <div className="flex w-full max-w-3xl justify-between items-stretch relative mt-4 px-2">
        <div className="w-32 md:w-40 flex flex-col gap-2 relative z-10">
          <div className="bg-brand-green/20 border-2 border-brand-green p-3 rounded-lg text-center">
            <span className="text-xs font-bold text-brand-green">GPU VRAM</span>
          </div>
          <div
            className={`border-2 p-3 rounded-lg text-center transition-all ${
              tcp ? 'bg-brand-blue/20 border-brand-blue' : 'bg-gray-800 border-gray-600 opacity-40'
            }`}
          >
            <span className="text-xs font-bold text-gray-300">System RAM & CPU</span>
          </div>
          <div className="bg-gray-800 border-2 border-gray-500 p-3 rounded-lg text-center">
            <span className="text-xs font-bold text-gray-300">NIC (Network Card)</span>
          </div>
        </div>

        <div className="flex-1 flex items-stretch mx-1 md:mx-3">
          <svg
            className="w-10 md:w-14 shrink-0 h-full"
            viewBox="0 0 56 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {tcp ? (
              <>
                <path
                  d="M 0 15 C 40 15, 40 50, 0 50"
                  fill="none"
                  stroke={stroke}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  vectorEffect="non-scaling-stroke"
                  className="animate-flow-dash"
                />
                <path
                  d="M 0 50 C 40 50, 40 85, 0 85"
                  fill="none"
                  stroke={stroke}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  vectorEffect="non-scaling-stroke"
                  className="animate-flow-dash"
                />
              </>
            ) : (
              <path
                d="M 0 15 C 52 15, 52 85, 0 85"
                fill="none"
                stroke={stroke}
                strokeWidth="3"
                strokeDasharray="6 6"
                vectorEffect="non-scaling-stroke"
                className="animate-flow-dash"
                style={{ animationDuration: '0.5s' }}
              />
            )}
          </svg>

          <div className="flex-1 relative">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <line
                x1="0"
                y1="85"
                x2="100"
                y2="85"
                stroke={tcp ? '#9ca3af' : stroke}
                strokeWidth={tcp ? 3 : 4}
                strokeDasharray={tcp ? '8 8' : '10 10'}
                vectorEffect="non-scaling-stroke"
                className="animate-flow-dash"
                style={{ animationDuration: tcp ? '1s' : '0.3s' }}
              />
            </svg>
          </div>

          <svg
            className="w-10 md:w-14 shrink-0 h-full"
            viewBox="0 0 56 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {tcp ? (
              <>
                <path
                  d="M 56 85 C 16 85, 16 50, 56 50"
                  fill="none"
                  stroke={stroke}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  vectorEffect="non-scaling-stroke"
                  className="animate-flow-dash"
                />
                <path
                  d="M 56 50 C 16 50, 16 15, 56 15"
                  fill="none"
                  stroke={stroke}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  vectorEffect="non-scaling-stroke"
                  className="animate-flow-dash"
                />
              </>
            ) : (
              <path
                d="M 56 85 C 4 85, 4 15, 56 15"
                fill="none"
                stroke={stroke}
                strokeWidth="3"
                strokeDasharray="6 6"
                vectorEffect="non-scaling-stroke"
                className="animate-flow-dash"
                style={{ animationDuration: '0.5s' }}
              />
            )}
          </svg>
        </div>

        <div className="w-32 md:w-40 flex flex-col gap-2 relative z-10">
          <div className="bg-brand-green/20 border-2 border-brand-green p-3 rounded-lg text-center">
            <span className="text-xs font-bold text-brand-green">GPU VRAM</span>
          </div>
          <div
            className={`border-2 p-3 rounded-lg text-center transition-all ${
              tcp ? 'bg-brand-blue/20 border-brand-blue' : 'bg-gray-800 border-gray-600 opacity-40'
            }`}
          >
            <span className="text-xs font-bold text-gray-300">System RAM & CPU</span>
          </div>
          <div className="bg-gray-800 border-2 border-gray-500 p-3 rounded-lg text-center">
            <span className="text-xs font-bold text-gray-300">NIC (Network Card)</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center max-w-xl text-sm">
        {tcp ? (
          <p className="text-gray-400">
            Data must be copied from VRAM to RAM, processed by the OS/CPU network stack, sent to the
            NIC, and then the reverse happens on the target node.{' '}
            <span className="text-brand-rose">High latency. CPU overhead.</span>
          </p>
        ) : (
          <p className="text-brand-purple font-medium">
            The NIC reaches directly into GPU VRAM (GPU-Direct RDMA) via the PCIe switch and sends it
            over the wire. The CPU is completely bypassed.
            <span className="text-white font-bold block">Ultra-low latency. Zero CPU overhead.</span>
          </p>
        )}
      </div>
    </div>
  );
}
