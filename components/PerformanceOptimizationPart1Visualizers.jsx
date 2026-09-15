import React, { useState } from 'react';
import { Cpu, HardDrive, Network, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

/* ── shared helpers ───────────────────────────────────────────────────────── */

function Tabs({ options, value, onChange, accent = 'bg-cyan-600' }) {
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

function Nav({ step, max, onBack, onNext, label = 'Next' }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-3">
      <button
        type="button"
        disabled={step === 0}
        onClick={onBack}
        className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 disabled:opacity-30"
      >
        ← Back
      </button>
      <span className="text-[11px] text-gray-500 font-mono">
        {step + 1} / {max + 1}
      </span>
      <button
        type="button"
        disabled={step === max}
        onClick={onNext}
        className="px-4 py-1.5 rounded-lg bg-cyan-600 text-xs font-bold text-white disabled:opacity-30"
      >
        {label} →
      </button>
    </div>
  );
}

/* very small python highlighter for the code listings */
function py(code) {
  const out = [];
  const re =
    /(#[^\n]*)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|\b(import|from|as|with|for|in|if|else|def|class|break|return|True|False|None|print|enumerate|zip|range)\b|\b(\d+)\b/g;
  let last = 0;
  let m;
  let k = 0;
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) out.push(code.slice(last, m.index));
    let cls = 'text-sky-300';
    if (m[1]) cls = 'text-gray-500 italic';
    else if (m[2] || m[3]) cls = 'text-emerald-400';
    else if (m[4]) cls = 'text-violet-400';
    else if (m[5]) cls = 'text-orange-300';
    out.push(
      <span key={`t${k++}`} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  out.push(code.slice(last));
  return out;
}

function CodeBlocks({ blocks, focus, setFocus, file }) {
  return (
    <div className="rounded-2xl bg-black/85 border border-gray-700 overflow-auto custom-scroll">
      <div className="px-3 py-1.5 border-b border-gray-800 text-[10px] font-mono text-gray-500 sticky top-0 bg-black/90">
        {file}
      </div>
      <div className="p-2 font-mono text-[12px] leading-6">
        {blocks.map((b, i) =>
          b.id ? (
            <button
              key={b.id}
              type="button"
              onMouseEnter={() => setFocus(b.id)}
              onFocus={() => setFocus(b.id)}
              onClick={() => setFocus(b.id)}
              className={`block w-full text-left rounded-md px-1.5 transition ${
                focus === b.id ? 'bg-cyan-500/20 ring-1 ring-cyan-400/60' : 'hover:bg-white/5'
              }`}
            >
              <pre className="whitespace-pre text-gray-300">{py(b.text)}</pre>
            </button>
          ) : (
            <pre key={`s${i}`} className="whitespace-pre px-1.5 text-gray-300">
              {py(b.text)}
            </pre>
          ),
        )}
      </div>
    </div>
  );
}

function NoteBox({ children, tone = 'cyan' }) {
  const map = {
    cyan: 'border-cyan-400/40 bg-cyan-500/10',
    amber: 'border-amber-400/40 bg-amber-500/10',
    rose: 'border-rose-400/40 bg-rose-500/10',
    emerald: 'border-emerald-400/40 bg-emerald-500/10',
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm text-gray-200 leading-relaxed ${map[tone]}`}>
      {children}
    </div>
  );
}

/* ── 1. Why profile first ─────────────────────────────────────────────────── */

const BASE = { io: 20, cpu: 180, gpu: 60 };

const UPGRADES = {
  none: { label: 'No change', io: 20, cpu: 180, gpu: 60, cost: '$0' },
  gpu: { label: 'Buy a 2× faster GPU', io: 20, cpu: 180, gpu: 30, cost: '$15,000' },
  ssd: { label: 'Buy an NVMe SSD', io: 8, cpu: 180, gpu: 60, cost: '$400' },
  cpu: { label: 'Add DataLoader workers', io: 20, cpu: 45, gpu: 60, cost: '$0' },
};

export function WhyProfileVisualizer() {
  const [pick, setPick] = useState('none');
  const u = UPGRADES[pick];
  const baseTotal = BASE.io + BASE.cpu + BASE.gpu;
  const total = u.io + u.cpu + u.gpu;
  const speedup = baseTotal / total;

  const seg = (v, cls, label) => (
    <div
      className={`h-9 flex items-center justify-center text-[10px] font-bold text-white/90 ${cls} transition-all duration-500`}
      style={{ width: `${(v / baseTotal) * 100}%` }}
    >
      {v >= 25 ? `${label} ${v}ms` : ''}
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Guesswork vs. measurement</h3>
        <p className="text-gray-400 text-sm">
          One training step, broken into where the time actually goes. Spend money and see what happens.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        {Object.entries(UPGRADES).map(([k, v]) => (
          <button
            key={k}
            type="button"
            onClick={() => setPick(k)}
            className={`rounded-xl border px-2 py-2 text-[11px] font-bold transition ${
              pick === k
                ? 'border-cyan-400 bg-cyan-500/20 text-white'
                : 'border-gray-700 bg-gray-900/60 text-gray-400 hover:border-gray-500'
            }`}
          >
            {v.label}
            <div className="text-[9px] font-normal text-gray-500 mt-0.5">{v.cost}</div>
          </button>
        ))}
      </div>

      <div className="space-y-3 max-w-2xl w-full mx-auto">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Before</div>
          <div className="flex rounded-lg overflow-hidden border border-gray-700">
            {seg(BASE.io, 'bg-rose-600/70', 'read')}
            {seg(BASE.cpu, 'bg-amber-600/80', 'CPU preprocess')}
            {seg(BASE.gpu, 'bg-emerald-600/80', 'GPU')}
          </div>
          <div className="text-[10px] text-gray-500 mt-1 font-mono">{baseTotal} ms / step</div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider text-cyan-400 mb-1">After — {u.label}</div>
          <div className="flex rounded-lg overflow-hidden border border-cyan-500/40">
            {seg(u.io, 'bg-rose-600/70', 'read')}
            {seg(u.cpu, 'bg-amber-600/80', 'CPU preprocess')}
            {seg(u.gpu, 'bg-emerald-600/80', 'GPU')}
          </div>
          <div className="text-[10px] text-gray-400 mt-1 font-mono">
            {total} ms / step ·{' '}
            <span className={speedup > 1.5 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {speedup.toFixed(2)}× faster
            </span>
          </div>
        </div>

        <NoteBox tone={pick === 'cpu' ? 'emerald' : pick === 'none' ? 'cyan' : 'rose'}>
          {pick === 'none' && (
            <>
              The GPU is busy for only <strong className="text-white">60 of 260 ms</strong>. It spends
              77% of every step waiting. Which component would you upgrade?
            </>
          )}
          {pick === 'gpu' && (
            <>
              <strong className="text-white">$15,000 bought you 1.13×.</strong> You doubled the speed of
              the component that was never the problem. This is the most expensive mistake in ML
              infrastructure.
            </>
          )}
          {pick === 'ssd' && (
            <>
              Barely moved. Reading was already only 20 ms — the storage was never the constraint
              either.
            </>
          )}
          {pick === 'cpu' && (
            <>
              <strong className="text-white">Free, and 2.1× faster.</strong> More DataLoader workers
              parallelise the preprocessing that was starving the GPU. Profiling found this in minutes;
              guessing would have cost $15,000.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}

/* ── 2. The four bottleneck types ─────────────────────────────────────────── */

const KINDS = {
  cpu: {
    label: 'CPU-bound',
    icon: Cpu,
    slow: 1,
    symptom: 'GPU-Util low and jumpy, one or more CPU cores pegged at 100%.',
    cause: 'Heavy preprocessing / augmentation in Python before data reaches the GPU.',
    fix: 'More DataLoader workers, cheaper transforms, cache or pre-compute, move augmentation to GPU.',
  },
  gpu: {
    label: 'GPU-bound',
    icon: Zap,
    slow: 2,
    symptom: 'GPU-Util pinned above 90%, CPU comfortable.',
    cause: 'The accelerator is genuinely doing the heavy lifting — this is the healthy state.',
    fix: 'Still improvable: mixed precision, larger batch, fused kernels, a more efficient architecture.',
  },
  io: {
    label: 'I/O-bound',
    icon: HardDrive,
    slow: 0,
    symptom: 'Both CPU and GPU utilisation low; iostat shows the disk saturated.',
    cause: 'Millions of small files, a slow network filesystem, or a spinning disk.',
    fix: 'Pack into shards (TFRecord / WebDataset), local NVMe cache, prefetch, bigger read buffers.',
  },
  net: {
    label: 'Network-bound',
    icon: Network,
    slow: 3,
    symptom: 'GPUs idle in bursts at the end of every step, all nodes stalling together.',
    cause: 'Gradient all-reduce is slower than the compute it overlaps with.',
    fix: 'Faster interconnect (NVLink / InfiniBand), gradient compression, larger batches per step.',
  },
};

const STATIONS = [
  { name: 'Storage', sub: 'read files', icon: HardDrive },
  { name: 'CPU', sub: 'decode + augment', icon: Cpu },
  { name: 'GPU', sub: 'fwd + bwd', icon: Zap },
  { name: 'Network', sub: 'all-reduce', icon: Network },
];

export function BottleneckTypesVisualizer() {
  const [kind, setKind] = useState('cpu');
  const k = KINDS[kind];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The assembly line</h3>
        <p className="text-gray-400 text-sm">
          The whole line runs at the speed of its slowest station. Pick which one is slow.
        </p>
      </div>

      <Tabs
        options={Object.entries(KINDS).map(([id, v]) => ({ id, label: v.label }))}
        value={kind}
        onChange={setKind}
      />

      <div className="flex items-stretch justify-center gap-1 mb-4 flex-wrap">
        {STATIONS.map((s, i) => {
          const isSlow = i === k.slow;
          const starved = i > k.slow;
          const Icon = s.icon;
          return (
            <React.Fragment key={s.name}>
              <div
                className={`rounded-xl border-2 px-3 py-3 w-[104px] text-center transition ${
                  isSlow
                    ? 'border-rose-400 bg-rose-500/20 animate-pulse'
                    : starved
                      ? 'border-gray-700 bg-gray-900/50 opacity-50'
                      : 'border-emerald-400/50 bg-emerald-500/10'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mx-auto mb-1 ${
                    isSlow ? 'text-rose-300' : starved ? 'text-gray-600' : 'text-emerald-300'
                  }`}
                />
                <div className="text-[11px] font-bold text-white">{s.name}</div>
                <div className="text-[9px] text-gray-500 leading-tight">{s.sub}</div>
                <div
                  className={`mt-1 text-[9px] font-bold ${
                    isSlow ? 'text-rose-300' : starved ? 'text-gray-500' : 'text-emerald-300'
                  }`}
                >
                  {isSlow ? 'SATURATED' : starved ? 'STARVED / IDLE' : 'keeping up'}
                </div>
                {/* queue building in front of the slow station */}
                <div className="h-3 flex items-end justify-center gap-0.5 mt-1">
                  {isSlow &&
                    [0, 1, 2, 3].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    ))}
                </div>
              </div>
              {i < STATIONS.length - 1 && (
                <div className="self-center text-gray-600 text-lg px-0.5">→</div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-4xl w-full mx-auto">
        <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3">
          <div className="text-[10px] font-bold uppercase text-rose-300 mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> What you observe
          </div>
          <p className="text-xs text-gray-200 leading-relaxed">{k.symptom}</p>
        </div>
        <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-3">
          <div className="text-[10px] font-bold uppercase text-amber-300 mb-1">Why it happens</div>
          <p className="text-xs text-gray-200 leading-relaxed">{k.cause}</p>
        </div>
        <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-3">
          <div className="text-[10px] font-bold uppercase text-emerald-300 mb-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> What to do
          </div>
          <p className="text-xs text-gray-200 leading-relaxed">{k.fix}</p>
        </div>
      </div>
    </div>
  );
}

/* ── 3. Step 1: high-level system monitoring ──────────────────────────────── */

const SCENARIOS = {
  gpu: {
    label: 'Scenario A',
    util: 97,
    mem: '21,338MiB / 24,564MiB',
    power: '312W / 350W',
    cores: [38, 41, 35, 44, 30, 39, 33, 36],
    verdict: 'GPU-bound — healthy. Optimise the model, not the pipeline.',
    tone: 'emerald',
  },
  cpu: {
    label: 'Scenario B',
    util: 18,
    mem: '9,102MiB / 24,564MiB',
    power: '96W / 350W',
    cores: [100, 99, 100, 97, 12, 9, 14, 11],
    verdict: 'CPU-bound — the DataLoader cannot keep up. GPU is starving.',
    tone: 'rose',
  },
  io: {
    label: 'Scenario C',
    util: 6,
    mem: '8,740MiB / 24,564MiB',
    power: '71W / 350W',
    cores: [9, 12, 7, 10, 8, 6, 11, 9],
    verdict: 'Both idle — suspect I/O. Go check iostat / dstat for disk wait.',
    tone: 'amber',
  },
};

export function SystemMonitorVisualizer() {
  const [sc, setSc] = useState('gpu');
  const s = SCENARIOS[sc];
  const tone = {
    emerald: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200',
    rose: 'border-rose-400/50 bg-rose-500/10 text-rose-200',
    amber: 'border-amber-400/50 bg-amber-500/10 text-amber-200',
  }[s.tone];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Step 1: watch the system</h3>
        <p className="text-gray-400 text-sm">
          Two terminals, thirty seconds, and you already know where to look.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'gpu', label: 'Scenario A' },
          { id: 'cpu', label: 'Scenario B' },
          { id: 'io', label: 'Scenario C' },
        ]}
        value={sc}
        onChange={setSc}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0">
        {/* nvidia-smi */}
        <div className="rounded-2xl bg-black/85 border border-gray-700 p-3 font-mono text-[11px] overflow-x-auto">
          <div className="text-emerald-400 mb-2">$ watch -n 1 nvidia-smi</div>
          <pre className="whitespace-pre text-gray-400 leading-5">{`+-----------------------------------------------+
| NVIDIA-SMI 550.54    Driver Version: 550.54   |
|-----------------------+-----------------------|
| GPU  Name             | Memory-Usage          |`}</pre>
          <pre className="whitespace-pre text-gray-300 leading-5">{`|   0  RTX 4090        | ${s.mem.padEnd(21)}|`}</pre>
          <pre className="whitespace-pre text-gray-400 leading-5">{`|   ${s.power.padEnd(14)}    |                       |
+-----------------------+-----------------------+`}</pre>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
              <span>GPU-Util</span>
              <span
                className={`font-bold ${
                  s.util > 90 ? 'text-emerald-400' : s.util > 40 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {s.util}%
              </span>
            </div>
            <div className="h-4 rounded bg-gray-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  s.util > 90 ? 'bg-emerald-500' : s.util > 40 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${s.util}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1.5 font-sans leading-relaxed">
              Consistently &gt;90% means GPU-bound. Low or wildly fluctuating means the bottleneck is
              somewhere else.
            </p>
          </div>
        </div>

        {/* htop */}
        <div className="rounded-2xl bg-black/85 border border-gray-700 p-3 font-mono text-[11px]">
          <div className="text-emerald-400 mb-2">$ htop</div>
          <div className="space-y-1">
            {s.cores.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-gray-500 w-6">{i}</span>
                <div className="flex-1 h-3 rounded-sm bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      c > 90 ? 'bg-rose-500' : c > 50 ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${c}%` }}
                  />
                </div>
                <span className={`w-9 text-right ${c > 90 ? 'text-rose-400 font-bold' : 'text-gray-500'}`}>
                  {c}%
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-2 font-sans leading-relaxed">
            Cores pegged at 100% while GPU-Util is low is strong evidence your Python data loader is the
            constraint.
          </p>
        </div>
      </div>

      <div className={`rounded-xl border px-4 py-3 mt-3 text-sm font-medium ${tone}`}>{s.verdict}</div>
    </div>
  );
}

/* ── 4. Diagnostic decision tree ──────────────────────────────────────────── */

export function DiagnosticFlowVisualizer() {
  const [path, setPath] = useState([]); // e.g. ['high'] or ['low','cpuhigh']
  const at = path.length;
  const result =
    path[0] === 'high'
      ? 'gpu'
      : path[1] === 'cpuhigh'
        ? 'cpu'
        : path[1] === 'cpulow'
          ? 'io'
          : null;

  const nodeCls = (on, base) =>
    on ? `${base} opacity-100` : 'border-gray-700 bg-gray-900/60 text-gray-500 opacity-60';

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The diagnostic flow</h3>
        <p className="text-gray-400 text-sm">Answer what your monitors show. Walk to the verdict.</p>
      </div>

      <div className="flex-1 flex flex-col items-center gap-1.5">
        <div className="rounded-xl border-2 border-cyan-400 bg-cyan-500/20 px-5 py-2 text-sm font-bold text-white">
          Run workload &amp; monitor
        </div>
        <div className="text-gray-600">↓</div>

        <div
          className={`rounded-xl border-2 px-5 py-2 text-sm font-bold transition ${nodeCls(
            true,
            'border-sky-400 bg-sky-500/20 text-white',
          )}`}
        >
          Check GPU-Util <span className="font-mono text-[11px] text-sky-300">(nvidia-smi)</span>
        </div>

        {at === 0 && (
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setPath(['low'])}
              className="px-4 py-2 rounded-xl border border-amber-400/60 bg-amber-500/15 text-xs font-bold text-amber-200 hover:bg-amber-500/25"
            >
              &lt; 50% — low
            </button>
            <button
              type="button"
              onClick={() => setPath(['high'])}
              className="px-4 py-2 rounded-xl border border-emerald-400/60 bg-emerald-500/15 text-xs font-bold text-emerald-200 hover:bg-emerald-500/25"
            >
              &gt; 90% — high
            </button>
          </div>
        )}

        {path[0] === 'high' && (
          <>
            <div className="text-emerald-500 text-xs font-mono">↓ &gt; 90%</div>
            <div className="rounded-full border-2 border-emerald-400 bg-emerald-500/25 px-8 py-3 text-sm font-bold text-emerald-100">
              Likely GPU-bound
            </div>
          </>
        )}

        {path[0] === 'low' && (
          <>
            <div className="text-amber-500 text-xs font-mono">↓ &lt; 50%</div>
            <div
              className={`rounded-xl border-2 px-5 py-2 text-sm font-bold transition ${nodeCls(
                true,
                'border-sky-400 bg-sky-500/20 text-white',
              )}`}
            >
              Check CPU-Util <span className="font-mono text-[11px] text-sky-300">(htop)</span>
            </div>
            {at === 1 && (
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setPath(['low', 'cpulow'])}
                  className="px-4 py-2 rounded-xl border border-rose-400/60 bg-rose-500/15 text-xs font-bold text-rose-200 hover:bg-rose-500/25"
                >
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => setPath(['low', 'cpuhigh'])}
                  className="px-4 py-2 rounded-xl border border-amber-400/60 bg-amber-500/15 text-xs font-bold text-amber-200 hover:bg-amber-500/25"
                >
                  High
                </button>
              </div>
            )}
            {path[1] === 'cpulow' && (
              <>
                <div className="text-rose-500 text-xs font-mono">↓ low</div>
                <div className="rounded-full border-2 border-rose-400 bg-rose-500/25 px-8 py-3 text-sm font-bold text-rose-100">
                  Likely I/O or network bound
                </div>
              </>
            )}
            {path[1] === 'cpuhigh' && (
              <>
                <div className="text-amber-500 text-xs font-mono">↓ high</div>
                <div className="rounded-full border-2 border-amber-400 bg-amber-500/25 px-8 py-3 text-sm font-bold text-amber-100">
                  Likely CPU-bound
                </div>
              </>
            )}
          </>
        )}
      </div>

      {result && (
        <div className="mt-3">
          <NoteBox tone={result === 'gpu' ? 'emerald' : result === 'cpu' ? 'amber' : 'rose'}>
            {result === 'gpu' && (
              <>
                The accelerator is the busy component — exactly what you paid for. Move on to model-level
                optimisation: mixed precision, batch size, kernel efficiency.
              </>
            )}
            {result === 'cpu' && (
              <>
                Cores saturated while the GPU waits. Attack the input pipeline first:{' '}
                <span className="font-mono text-xs">num_workers</span>,{' '}
                <span className="font-mono text-xs">pin_memory</span>, cheaper augmentation, caching.
              </>
            )}
            {result === 'io' && (
              <>
                Nobody is busy, so everyone is waiting on data arriving. Confirm with{' '}
                <span className="font-mono text-xs">iostat</span> or{' '}
                <span className="font-mono text-xs">dstat</span>, then fix storage layout — shard small
                files, cache locally, prefetch.
              </>
            )}
          </NoteBox>
          <button
            type="button"
            onClick={() => setPath([])}
            className="mt-2 mx-auto block px-4 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 hover:text-white"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}

/* ── 5. PyTorch profiler ──────────────────────────────────────────────────── */

const TORCH_BLOCKS = [
  { id: 'imp', text: `import torch\nfrom torch.profiler import profile, record_function, ProfilerActivity` },
  { id: null, text: `` },
  { id: null, text: `# ... model, data_loader, optimizer setup ...` },
  { id: null, text: `` },
  {
    id: 'ctx',
    text: `with profile(activities=[ProfilerActivity.CPU, ProfilerActivity.CUDA], record_shapes=True) as prof:`,
  },
  { id: 'rec', text: `    with record_function("model_training"):` },
  { id: 'loop', text: `        for step, batch in enumerate(data_loader):\n            inputs, labels = batch\n            inputs = inputs.to("cuda")\n            labels = labels.to("cuda")` },
  { id: null, text: `` },
  { id: 'fwd', text: `            outputs = model(inputs)\n            loss = loss_fn(outputs, labels)` },
  { id: null, text: `` },
  { id: 'bwd', text: `            optimizer.zero_grad()\n            loss.backward()\n            optimizer.step()` },
  { id: 'brk', text: `            if step >= 10: # Profile a few steps\n                break` },
  { id: null, text: `` },
  { id: 'print', text: `print(prof.key_averages().table(sort_by="cuda_time_total", row_limit=10))` },
];

const TORCH_NOTES = {
  imp: 'ProfilerActivity lets you trace CPU and CUDA separately — that separation is what reveals a starving GPU.',
  ctx: 'The context manager is the whole API. record_shapes=True also captures tensor shapes so you can spot oddly small batches.',
  rec: 'record_function adds a named label to the trace. Wrap your data loading, forward, and backward separately and the trace becomes readable.',
  loop: 'The .to("cuda") copies show up in the trace as memcpy. If these dominate, use pin_memory=True and non_blocking=True.',
  fwd: 'Forward pass. In the output table these appear as aten:: kernels with large cuda_time_total.',
  bwd: 'Backward is usually ~2× the forward cost. If it is much more, check for unfused ops or fp32 where fp16 would do.',
  brk: 'Profile 10 steps, not 10 epochs. Traces get huge fast, and the first step is always unrepresentative (warm-up, cuDNN autotune).',
  print: 'sort_by="cuda_time_total" puts the most expensive GPU operation at the top — that is your optimisation target.',
};

export function TorchProfilerVisualizer() {
  const [tab, setTab] = useState('code');
  const [focus, setFocus] = useState('ctx');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Step 2: the PyTorch profiler</h3>
        <p className="text-gray-400 text-sm">Tap any block of the script to learn what it buys you.</p>
      </div>

      <Tabs
        options={[
          { id: 'code', label: 'Instrument the loop' },
          { id: 'out', label: 'Profiler output' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'code' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-3 min-h-0">
          <CodeBlocks blocks={TORCH_BLOCKS} focus={focus} setFocus={setFocus} file="profile_train.py" />
          <div className="flex flex-col gap-2 min-h-0">
            <NoteBox>{TORCH_NOTES[focus]}</NoteBox>
            <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3 text-xs text-gray-400 leading-relaxed">
              <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Why a context manager</div>
              The profiler only records inside the <span className="font-mono text-cyan-300">with</span>{' '}
              block, so you pay the overhead for a handful of steps and keep the rest of training at full
              speed.
            </div>
          </div>
        </div>
      )}

      {tab === 'out' && (
        <div className="flex-1 overflow-auto custom-scroll">
          <pre className="rounded-2xl bg-black/85 border border-gray-700 p-3 font-mono text-[11px] leading-6 text-gray-300 whitespace-pre overflow-x-auto">{`-------------------------------  ------------  ------------  ------------
Name                               Self CUDA     CUDA total    # of Calls
-------------------------------  ------------  ------------  ------------
model_training                        0.000us      1.482s               1
aten::conv2d                         412.3ms      623.1ms             530
aten::cudnn_convolution_backward     388.7ms      511.4ms             530
aten::batch_norm                      91.2ms      142.8ms             530
aten::relu_                           38.4ms       38.4ms             530
aten::add_                            21.9ms       21.9ms            1060
aten::copy_                          164.5ms      164.5ms              22
-------------------------------  ------------  ------------  ------------
Self CPU time total: 3.940s
Self CUDA time total: 1.482s`}</pre>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <NoteBox tone="rose">
              <strong className="text-white">CPU 3.94s vs CUDA 1.48s.</strong> The GPU finished its work
              in under half the wall-clock time of the step. Two-thirds of this run is the GPU waiting.
            </NoteBox>
            <NoteBox tone="amber">
              <strong className="text-white">aten::copy_ — 164ms over 22 calls.</strong> Host-to-device
              transfers this expensive usually mean unpinned memory or per-sample transfers.
            </NoteBox>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 6. TensorFlow profiler ───────────────────────────────────────────────── */

const TF_BLOCKS = [
  { id: 'imp', text: `import tensorflow as tf` },
  { id: null, text: `` },
  { id: null, text: `# ... model, dataset, optimizer setup ...` },
  { id: null, text: `` },
  { id: 'logdir', text: `logdir = "logs/profile/"` },
  { id: 'ctx', text: `with tf.profiler.experimental.Profile(logdir):` },
  { id: 'loop', text: `    for step, (x_batch, y_batch) in enumerate(dataset.take(10)):` },
  { id: 'tape', text: `        with tf.GradientTape() as tape:\n            logits = model(x_batch, training=True)\n            loss_value = loss_fn(y_batch, logits)` },
  { id: 'grad', text: `        grads = tape.gradient(loss_value, model.trainable_weights)\n        optimizer.apply_gradients(zip(grads, model.trainable_weights))` },
  { id: null, text: `` },
  { id: 'tb', text: `# To view the profile, launch TensorBoard:\n# tensorboard --logdir logs/profile/` },
];

const TF_NOTES = {
  imp: 'TensorFlow ships the profiler inside the framework — no extra package, and it writes straight into a TensorBoard log directory.',
  logdir: 'Everything the profiler captures lands in this directory as trace files. Point TensorBoard at it afterwards.',
  ctx: 'tf.profiler.experimental.Profile is the equivalent of torch.profiler: tracing is on inside the block and off outside it.',
  loop: 'dataset.take(10) limits the trace to ten steps. Same reasoning as PyTorch — traces are huge and the first steps are warm-up.',
  tape: 'GradientTape records the forward pass so gradients can be replayed. In the trace this shows as your forward kernels.',
  grad: 'apply_gradients is the optimiser step. Watch for it serialising behind a slow all-reduce in multi-GPU runs.',
  tb: 'TensorBoard gains a "Profile" tab: op-level statistics, an input-pipeline analyser, and the Trace Viewer showing CPU and GPU side by side.',
};

export function TfProfilerVisualizer() {
  const [tab, setTab] = useState('code');
  const [focus, setFocus] = useState('ctx');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The TensorFlow profiler</h3>
        <p className="text-gray-400 text-sm">Same idea, wired directly into TensorBoard.</p>
      </div>

      <Tabs
        options={[
          { id: 'code', label: 'Instrument the loop' },
          { id: 'tb', label: 'What TensorBoard shows' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'code' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-3 min-h-0">
          <CodeBlocks blocks={TF_BLOCKS} focus={focus} setFocus={setFocus} file="profile_train_tf.py" />
          <div className="flex flex-col gap-2 min-h-0">
            <NoteBox>{TF_NOTES[focus]}</NoteBox>
            <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3 text-xs text-gray-400 leading-relaxed">
              <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Launch it</div>
              <span className="font-mono text-cyan-300">tensorboard --logdir logs/profile/</span> then open
              the Profile tab.
            </div>
          </div>
        </div>
      )}

      {tab === 'tb' && (
        <div className="flex-1 overflow-auto custom-scroll">
          <div className="rounded-2xl border border-gray-700 bg-gray-900/70 overflow-hidden">
            <div className="flex gap-4 px-4 py-2 bg-gray-800/80 border-b border-gray-700 text-[11px]">
              <span className="text-gray-500">Scalars</span>
              <span className="text-gray-500">Graphs</span>
              <span className="text-orange-400 font-bold border-b-2 border-orange-400 pb-1">Profile</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-[10px] uppercase tracking-wider text-gray-500">Trace Viewer</div>
              <div className="space-y-2">
                {[
                  { row: '/device:CPU:0', blocks: [[2, 14], [30, 14], [58, 14]], color: 'bg-sky-500' },
                  { row: '/device:GPU:0 · compute', blocks: [[16, 12], [44, 12], [72, 12]], color: 'bg-emerald-500' },
                  { row: '/device:GPU:0 · memcpy', blocks: [[14, 2], [42, 2], [70, 2]], color: 'bg-amber-500' },
                ].map((r) => (
                  <div key={r.row} className="flex items-center gap-2">
                    <span className="w-40 text-[10px] font-mono text-gray-400 shrink-0">{r.row}</span>
                    <div className="relative flex-1 h-6 rounded bg-gray-800">
                      {r.blocks.map(([l, w], i) => (
                        <div
                          key={i}
                          className={`absolute top-1 bottom-1 rounded-sm ${r.color}`}
                          style={{ left: `${l}%`, width: `${w}%` }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  ['Step time', '84.2 ms'],
                  ['Device compute', '31.6 %'],
                  ['Input pipeline', '58.9 %'],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2">
                    <div className="text-[9px] uppercase text-gray-500">{k}</div>
                    <div className="text-sm font-bold text-white">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <NoteBox tone="rose">
            Input pipeline eating 59% of step time with the GPU rows mostly empty is the classic
            CPU-bound signature — before touching the model, fix the{' '}
            <span className="font-mono text-xs">tf.data</span> pipeline.
          </NoteBox>
        </div>
      )}
    </div>
  );
}

/* ── 7. Reading the trace ─────────────────────────────────────────────────── */

const TRACES = {
  ideal: {
    label: 'Ideal (GPU-bound)',
    cpu: [[0, 8], [10, 8], [20, 8], [30, 8], [40, 8], [50, 8], [60, 8], [70, 8], [80, 8], [90, 8]],
    gpu: [[2, 9], [12, 9], [22, 9], [32, 9], [42, 9], [52, 9], [62, 9], [72, 9], [82, 9], [92, 8]],
    idle: 8,
    verdict:
      'The GPU row is packed with kernels, gaps are tiny, and the CPU is working just ahead of it preparing the next batch. This is a healthy, GPU-bound workload.',
    tone: 'emerald',
  },
  cpubound: {
    label: 'CPU-bound',
    cpu: [[0, 22], [26, 22], [52, 22], [78, 20]],
    gpu: [[22, 4], [48, 4], [74, 4], [96, 3]],
    idle: 85,
    verdict:
      'Huge gaps on the GPU row. During every gap the CPU row is busy inside your DataLoader or augmentation functions. The GPU is waiting for the CPU to finish.',
    tone: 'rose',
  },
  iobound: {
    label: 'I/O-bound',
    cpu: [[0, 3], [33, 3], [66, 3]],
    gpu: [[4, 4], [37, 4], [70, 4]],
    idle: 88,
    verdict:
      'Both rows are nearly empty — nobody is computing. The CPU sits in a wait state. Switch to iostat or dstat to confirm the system is blocked on disk reads.',
    tone: 'amber',
  },
};

export function TraceReadingVisualizer() {
  const [mode, setMode] = useState('ideal');
  const t = TRACES[mode];

  const row = (blocks, color, label) => (
    <div className="flex items-center gap-2">
      <span className="w-24 text-[10px] font-mono text-gray-400 shrink-0">{label}</span>
      <div className="relative flex-1 h-10 rounded-lg bg-gray-800/80 border border-gray-700 overflow-hidden">
        {blocks.map(([l, w], i) => (
          <div
            key={i}
            className={`absolute top-1 bottom-1 rounded-sm ${color} transition-all duration-500`}
            style={{ left: `${l}%`, width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Reading the signs</h3>
        <p className="text-gray-400 text-sm">
          You are not reading numbers — you are reading the <em>shape</em> of the gaps.
        </p>
      </div>

      <Tabs
        options={Object.entries(TRACES).map(([id, v]) => ({ id, label: v.label }))}
        value={mode}
        onChange={setMode}
      />

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 space-y-3">
        <div className="text-[10px] uppercase tracking-wider text-gray-500">
          Trace view · one training step, left to right
        </div>
        {row(t.cpu, 'bg-sky-500', 'CPU')}
        {row(t.gpu, 'bg-emerald-500', 'GPU kernels')}
        <div className="flex items-center gap-2">
          <span className="w-24" />
          <div className="flex-1 flex justify-between text-[9px] font-mono text-gray-600">
            {[0, 25, 50, 75, 100].map((n) => (
              <span key={n}>{n}ms</span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <span className="text-[10px] text-gray-400">GPU idle time</span>
          <div className="flex-1 h-3 rounded bg-gray-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                t.idle < 20 ? 'bg-emerald-500' : t.idle < 60 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${t.idle}%` }}
            />
          </div>
          <span
            className={`text-xs font-bold ${
              t.idle < 20 ? 'text-emerald-400' : t.idle < 60 ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {t.idle}%
          </span>
        </div>

        <div className="flex gap-4 text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 rounded-sm bg-sky-500" /> CPU / data loading
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 rounded-sm bg-emerald-500" /> CUDA kernel execution
          </span>
        </div>
      </div>

      <div className="mt-3">
        <NoteBox tone={t.tone}>{t.verdict}</NoteBox>
      </div>
    </div>
  );
}

/* ── 8. Distributed training: the communication tax ───────────────────────── */

const SCALE = [1, 2, 4, 8, 16];

export function DistributedIntroVisualizer() {
  const [n, setN] = useState(1);
  const compute = 1000 / n;
  const comm = n === 1 ? 0 : 40 * Math.log2(n);
  const total = compute + comm;
  const speedup = 1000 / total;
  const eff = (speedup / n) * 100;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Why distribution is not free</h3>
        <p className="text-gray-400 text-sm">
          Add GPUs and compute shrinks — but synchronisation grows. Drag through the scale.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {SCALE.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setN(s)}
            className={`w-14 py-2 rounded-xl text-xs font-bold transition ${
              n === s ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {s} GPU{s > 1 ? 's' : ''}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-1.5 flex-wrap mb-4">
        {Array.from({ length: n }).map((_, i) => (
          <div
            key={i}
            className="w-11 h-11 rounded-lg border-2 border-emerald-400/60 bg-emerald-500/15 flex items-center justify-center"
          >
            <Zap className="w-4 h-4 text-emerald-300" />
          </div>
        ))}
      </div>

      <div className="max-w-2xl w-full mx-auto space-y-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            Wall-clock time per step
          </div>
          <div className="flex rounded-lg overflow-hidden border border-gray-700 h-10">
            <div
              className="bg-emerald-600/80 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500"
              style={{ width: `${(compute / 1000) * 100}%` }}
            >
              {compute > 120 ? `compute ${compute.toFixed(0)}ms` : ''}
            </div>
            <div
              className="bg-rose-600/80 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500"
              style={{ width: `${(comm / 1000) * 100}%` }}
            >
              {comm > 90 ? `all-reduce ${comm.toFixed(0)}ms` : ''}
            </div>
          </div>
          <div className="text-[10px] text-gray-500 mt-1 font-mono">
            compute {compute.toFixed(0)}ms + communication {comm.toFixed(0)}ms = {total.toFixed(0)}ms
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            ['Ideal speedup', `${n.toFixed(0)}×`, 'text-gray-400'],
            ['Real speedup', `${speedup.toFixed(1)}×`, 'text-cyan-300'],
            [
              'Scaling efficiency',
              `${eff.toFixed(0)}%`,
              eff > 80 ? 'text-emerald-400' : eff > 60 ? 'text-amber-400' : 'text-rose-400',
            ],
          ].map(([k, v, cls]) => (
            <div key={k} className="rounded-xl border border-gray-700 bg-gray-900/60 px-3 py-2 text-center">
              <div className="text-[9px] uppercase text-gray-500">{k}</div>
              <div className={`text-lg font-bold ${cls}`}>{v}</div>
            </div>
          ))}
        </div>

        <NoteBox tone={eff > 80 ? 'emerald' : eff > 60 ? 'amber' : 'rose'}>
          {n === 1 && 'A single GPU has no synchronisation cost at all — every millisecond is useful work.'}
          {n > 1 && eff > 80 && (
            <>
              Communication is still small relative to compute, so you keep most of the theoretical
              speedup. This is the regime you want to stay in.
            </>
          )}
          {n > 1 && eff <= 80 && (
            <>
              The all-reduce is now a serious tax: you are paying for {n} GPUs and getting{' '}
              {speedup.toFixed(1)}× . The fix is either more work per GPU (bigger batch) or a faster
              interconnect — NVLink inside a node, InfiniBand between nodes.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}

/* ── 9. Data parallelism ──────────────────────────────────────────────────── */

const DP_STEPS = [
  {
    title: 'Replicate',
    note: 'The complete model is copied into the memory of every participating GPU. All replicas start with identical weights.',
  },
  {
    title: 'Split',
    note: 'One large global batch — say 256 samples — is divided into mini-batches, one per GPU. Each GPU sees different data.',
  },
  {
    title: 'Compute',
    note: 'Each GPU independently runs a forward pass and a backward pass on its own slice. Right now every GPU holds different gradients.',
  },
  {
    title: 'Synchronize (All-Reduce)',
    note: 'The critical step. An All-Reduce sums the gradients from every GPU and hands the same total back to all of them. This is where the network cost lives.',
  },
  {
    title: 'Update',
    note: 'Every GPU applies the identical averaged gradient to its own copy of the weights. Same start, same update, so the replicas stay in lockstep.',
  },
];

export function DataParallelVisualizer() {
  const [step, setStep] = useState(0);
  const gpus = [0, 1, 2];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">
          Data parallelism: one model, many data slices
        </h3>
        <p className="text-gray-400 text-sm">One training step, five stages. Step through it.</p>
      </div>

      <div className="flex justify-center gap-1.5 mb-3 flex-wrap">
        {DP_STEPS.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setStep(i)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
              step === i
                ? 'bg-cyan-500 text-white'
                : step > i
                  ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40'
                  : 'bg-gray-800 text-gray-500 border border-gray-700'
            }`}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      <div className="flex-1 rounded-2xl border border-gray-700 bg-gray-950/70 p-4 flex flex-col items-center justify-between gap-2">
        {/* global batch */}
        <div
          className={`rounded-xl border-2 px-6 py-2 text-center transition ${
            step === 1 ? 'border-sky-300 bg-sky-500/25' : 'border-sky-400/50 bg-sky-500/10'
          }`}
        >
          <div className="text-xs font-bold text-sky-100">Global batch</div>
          <div className="text-[10px] text-sky-300/80">256 samples</div>
        </div>

        <div className={`text-lg ${step >= 1 ? 'text-sky-400' : 'text-gray-700'}`}>↓ split ↓</div>

        {/* per-GPU columns */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-xl">
          {gpus.map((g) => (
            <div key={g} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-full rounded-lg border px-2 py-1 text-center text-[10px] font-mono transition ${
                  step >= 1 ? 'border-sky-400/60 bg-sky-500/15 text-sky-200' : 'border-gray-800 text-gray-700'
                }`}
              >
                mini-batch {g}
              </div>
              <div className={`text-xs ${step >= 2 ? 'text-gray-500' : 'text-gray-800'}`}>↓</div>
              <div
                className={`w-full rounded-xl border-2 px-2 py-2 text-center transition ${
                  step === 0
                    ? 'border-violet-300 bg-violet-500/25'
                    : step === 2
                      ? 'border-emerald-300 bg-emerald-500/25'
                      : 'border-emerald-400/40 bg-emerald-500/10'
                }`}
              >
                <div className="text-[11px] font-bold text-white">GPU {g}</div>
                <div className="text-[9px] text-violet-200">model replica</div>
                {step === 2 && <div className="text-[9px] text-emerald-300 font-bold mt-0.5">fwd + bwd</div>}
              </div>
              <div className={`text-xs ${step >= 3 ? 'text-amber-400' : 'text-gray-800'}`}>↓</div>
              <div
                className={`w-full rounded-lg border px-2 py-1 text-center text-[10px] font-mono transition ${
                  step >= 3
                    ? 'border-amber-400/70 bg-amber-500/20 text-amber-200'
                    : 'border-gray-800 text-gray-700'
                }`}
              >
                grads {g}
              </div>
            </div>
          ))}
        </div>

        {/* all-reduce */}
        <div
          className={`rounded-full border-2 px-8 py-3 text-center transition ${
            step === 3
              ? 'border-rose-300 bg-rose-500/30 scale-105'
              : step > 3
                ? 'border-rose-400/50 bg-rose-500/15'
                : 'border-gray-800 bg-gray-900/50'
          }`}
        >
          <div className={`text-sm font-bold ${step >= 3 ? 'text-rose-100' : 'text-gray-700'}`}>
            All-Reduce
          </div>
          <div className={`text-[10px] ${step >= 3 ? 'text-rose-300' : 'text-gray-800'}`}>
            sum gradients · broadcast back
          </div>
        </div>

        <div
          className={`text-[11px] font-bold transition ${
            step === 4 ? 'text-emerald-300' : 'text-gray-700'
          }`}
        >
          ↑ every GPU applies the same averaged gradient — replicas stay identical ↑
        </div>
      </div>

      <div className="mt-3">
        <NoteBox tone={step === 3 ? 'rose' : 'cyan'}>
          <strong className="text-white">
            {step + 1}. {DP_STEPS[step].title}.
          </strong>{' '}
          {DP_STEPS[step].note}
        </NoteBox>
      </div>

      <Nav
        step={step}
        max={DP_STEPS.length - 1}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(DP_STEPS.length - 1, s + 1))}
      />
    </div>
  );
}

/* ── 10. Model parallelism + the pipeline bubble ──────────────────────────── */

const MP_STEPS = [
  { title: 'Partition', note: 'Layers 1–12 are placed on GPU 0, layers 13–24 on GPU 1. Neither GPU holds the whole model — that is the entire point.' },
  { title: 'Forward on GPU 0', note: 'The batch enters GPU 0, which computes activations for its half and ships them across the link to GPU 1.' },
  { title: 'Forward on GPU 1', note: 'GPU 1 continues from those activations through layers 13–24 and produces the output and loss. GPU 0 is now idle.' },
  { title: 'Backward on GPU 1', note: 'Gradients start at the loss and flow back through layers 13–24, then cross the link to GPU 0.' },
  { title: 'Backward on GPU 0', note: 'GPU 0 finishes the backward pass for layers 1–12. Notice: at no point were both GPUs computing at the same time.' },
];

export function ModelParallelVisualizer() {
  const [tab, setTab] = useState('pass');
  const [step, setStep] = useState(0);
  const [micro, setMicro] = useState(false);

  const active = (g) => {
    if (step === 0) return false;
    if (step === 1) return g === 0;
    if (step === 2) return g === 1;
    if (step === 3) return g === 1;
    return g === 0;
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">
          Model parallelism: one model, split across GPUs
        </h3>
        <p className="text-gray-400 text-sm">
          For models too large to fit on one device — and the idle time it creates.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'pass', label: 'A single pass' },
          { id: 'bubble', label: 'The pipeline bubble' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'pass' && (
        <>
          <div className="flex-1 rounded-2xl border border-gray-700 bg-gray-950/70 p-4 flex flex-col items-center justify-center gap-1.5">
            <div
              className={`rounded-lg border px-5 py-1.5 text-xs font-bold transition ${
                step >= 1 ? 'border-sky-400 bg-sky-500/20 text-sky-100' : 'border-gray-700 text-gray-500'
              }`}
            >
              Input batch
            </div>
            <div className={`text-lg ${step >= 1 ? 'text-sky-400' : 'text-gray-700'}`}>↓</div>

            <div
              className={`rounded-xl border-2 px-8 py-3 text-center transition ${
                active(0) ? 'border-violet-300 bg-violet-500/30 scale-105' : 'border-violet-400/40 bg-violet-500/10'
              }`}
            >
              <div className="text-sm font-bold text-white">GPU 0</div>
              <div className="text-[10px] text-violet-200">layers 1–12</div>
              <div className={`text-[9px] font-bold mt-0.5 ${active(0) ? 'text-emerald-300' : 'text-gray-600'}`}>
                {active(0) ? 'computing' : 'idle'}
              </div>
            </div>

            <div className="flex items-center gap-6 py-0.5">
              <span className={`text-[10px] font-mono ${step === 2 ? 'text-sky-300 font-bold' : 'text-gray-600'}`}>
                activations ↓
              </span>
              <span className={`text-[10px] font-mono ${step === 4 ? 'text-rose-300 font-bold' : 'text-gray-600'}`}>
                ↑ gradients
              </span>
            </div>

            <div
              className={`rounded-xl border-2 px-8 py-3 text-center transition ${
                active(1) ? 'border-violet-300 bg-violet-500/30 scale-105' : 'border-violet-400/40 bg-violet-500/10'
              }`}
            >
              <div className="text-sm font-bold text-white">GPU 1</div>
              <div className="text-[10px] text-violet-200">layers 13–24</div>
              <div className={`text-[9px] font-bold mt-0.5 ${active(1) ? 'text-emerald-300' : 'text-gray-600'}`}>
                {active(1) ? 'computing' : 'idle'}
              </div>
            </div>

            <div className={`text-lg ${step >= 2 ? 'text-sky-400' : 'text-gray-700'}`}>↓</div>
            <div
              className={`rounded-lg border px-5 py-1.5 text-xs font-bold transition ${
                step >= 2 ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100' : 'border-gray-700 text-gray-500'
              }`}
            >
              Output / loss
            </div>
          </div>

          <div className="mt-3">
            <NoteBox tone="cyan">
              <strong className="text-white">
                {step + 1}. {MP_STEPS[step].title}.
              </strong>{' '}
              {MP_STEPS[step].note}
            </NoteBox>
          </div>

          <Nav
            step={step}
            max={MP_STEPS.length - 1}
            onBack={() => setStep((s) => Math.max(0, s - 1))}
            onNext={() => setStep((s) => Math.min(MP_STEPS.length - 1, s + 1))}
          />
        </>
      )}

      {tab === 'bubble' && (
        <>
          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-wider text-gray-500">
                GPU occupancy over one step
              </span>
              <button
                type="button"
                onClick={() => setMicro((m) => !m)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition ${
                  micro ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300'
                }`}
              >
                {micro ? 'Micro-batching: ON' : 'Micro-batching: OFF'}
              </button>
            </div>

            {[
              { g: 'GPU 0', naive: [[0, 22], [66, 22]], piped: [[0, 11], [12, 11], [24, 11], [56, 11], [68, 11], [80, 11]] },
              { g: 'GPU 1', naive: [[24, 22], [46, 20]], piped: [[12, 11], [24, 11], [36, 11], [44, 11], [56, 11], [68, 11]] },
            ].map((r) => {
              const blocks = micro ? r.piped : r.naive;
              return (
                <div key={r.g} className="flex items-center gap-2 mb-2">
                  <span className="w-14 text-[10px] font-mono text-gray-400">{r.g}</span>
                  <div className="relative flex-1 h-10 rounded-lg bg-rose-950/40 border border-gray-700 overflow-hidden">
                    {blocks.map(([l, w], i) => (
                      <div
                        key={i}
                        className="absolute top-1 bottom-1 rounded-sm bg-violet-500 transition-all duration-500"
                        style={{ left: `${l}%`, width: `${w}%` }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="flex gap-4 text-[10px] text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded-sm bg-violet-500" /> computing
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded-sm bg-rose-950 border border-gray-700" /> pipeline bubble
                (idle)
              </span>
            </div>
          </div>

          <div className="mt-3">
            <NoteBox tone={micro ? 'emerald' : 'rose'}>
              {micro ? (
                <>
                  Splitting the batch into <strong className="text-white">micro-batches</strong> lets GPU 0
                  start the next micro-batch while GPU 1 works on the previous one. The bubble shrinks and
                  both devices stay busy. This is what GPipe and similar pipeline-parallel schemes do.
                </>
              ) : (
                <>
                  Naive model parallelism wastes half your hardware: while GPU 1 computes, GPU 0 sits idle,
                  and vice versa. That dead space is the{' '}
                  <strong className="text-white">pipeline bubble</strong>. Turn micro-batching on.
                </>
              )}
            </NoteBox>
          </div>
        </>
      )}
    </div>
  );
}

/* ── 11. Choosing a strategy ──────────────────────────────────────────────── */

const MODELS = [
  { id: 'resnet', label: 'ResNet-50', params: '25M', need: 4 },
  { id: 'bert', label: 'BERT-large', params: '340M', need: 14 },
  { id: 'llm', label: 'LLM · 70B params', params: '70B', need: 560 },
];

export function StrategyChoiceVisualizer() {
  const [m, setM] = useState('resnet');
  const [gpuMem, setGpuMem] = useState(24);
  const model = MODELS.find((x) => x.id === m);
  const fits = model.need <= gpuMem;
  const strategy = fits ? 'data' : model.need > gpuMem * 8 ? 'hybrid' : 'model';

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Making the choice</h3>
        <p className="text-gray-400 text-sm">
          One question decides it: does the model fit in a single GPU&apos;s memory?
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-2">
        {MODELS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setM(x.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              m === x.id ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-2 mb-4">
        {[16, 24, 80].map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGpuMem(g)}
            className={`px-3 py-1 rounded-lg text-[11px] font-mono transition ${
              gpuMem === g ? 'bg-gray-200 text-gray-900 font-bold' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {g} GB GPU
          </button>
        ))}
      </div>

      <div className="max-w-xl w-full mx-auto space-y-3">
        <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>
              {model.label} · {model.params} params · ~{model.need} GB to train
            </span>
            <span className="font-mono">{gpuMem} GB available</span>
          </div>
          <div className="relative h-8 rounded-lg bg-gray-800 overflow-hidden border border-gray-700">
            <div
              className={`h-full transition-all duration-500 ${fits ? 'bg-emerald-600' : 'bg-rose-600'}`}
              style={{ width: `${Math.min(100, (model.need / gpuMem) * 100)}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
              {fits ? 'fits on one GPU' : `overflows by ${(model.need - gpuMem).toFixed(0)} GB`}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'data', title: 'Data parallel', sub: 'default choice' },
            { id: 'model', title: 'Model parallel', sub: 'memory constraint' },
            { id: 'hybrid', title: 'Hybrid', sub: 'frontier scale' },
          ].map((s) => (
            <div
              key={s.id}
              className={`rounded-xl border-2 p-3 text-center transition ${
                strategy === s.id
                  ? 'border-cyan-400 bg-cyan-500/20'
                  : 'border-gray-700 bg-gray-900/50 opacity-50'
              }`}
            >
              <div className="text-xs font-bold text-white">{s.title}</div>
              <div className="text-[9px] text-gray-400">{s.sub}</div>
            </div>
          ))}
        </div>

        <NoteBox tone={strategy === 'data' ? 'emerald' : strategy === 'model' ? 'amber' : 'rose'}>
          {strategy === 'data' && (
            <>
              The model fits, so replicate it and split the data. Data parallelism is simpler, has better
              hardware utilisation, and is the default for almost every job.
            </>
          )}
          {strategy === 'model' && (
            <>
              It does not fit, so you have no choice — split the layers across devices. Remember this is a
              solution to a <strong className="text-white">memory</strong> problem, not a speed one; you
              accept the pipeline bubble to make training possible at all.
            </>
          )}
          {strategy === 'hybrid' && (
            <>
              Frontier scale. <strong className="text-white">Hybrid parallelism</strong>: split the model
              across the GPUs inside one server node, then replicate that whole multi-GPU unit across many
              nodes with data parallelism.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}

/* ── 12. Frameworks ───────────────────────────────────────────────────────── */

const DDP_BLOCKS = [
  { id: 'imp', text: `import os\nimport torch\nimport torch.distributed as dist\nfrom torch.nn.parallel import DistributedDataParallel as DDP` },
  { id: null, text: `` },
  { id: 'init', text: `dist.init_process_group(backend="nccl")\nlocal_rank = int(os.environ["LOCAL_RANK"])\ntorch.cuda.set_device(local_rank)` },
  { id: null, text: `` },
  { id: 'wrap', text: `model = MyModel().to(local_rank)\nmodel = DDP(model, device_ids=[local_rank])` },
  { id: null, text: `` },
  { id: 'sampler', text: `sampler = torch.utils.data.distributed.DistributedSampler(dataset)\nloader = DataLoader(dataset, batch_size=64, sampler=sampler)` },
  { id: null, text: `` },
  { id: 'loop', text: `for x, y in loader:\n    loss = loss_fn(model(x.cuda()), y.cuda())\n    loss.backward()   # all-reduce happens here, automatically\n    optimizer.step()\n    optimizer.zero_grad()` },
];

const DDP_NOTES = {
  imp: 'NCCL is NVIDIA’s collective communications library — it is what actually performs the All-Reduce over NVLink or the network.',
  init: 'Every process joins a process group and claims one GPU. Launched with torchrun, one process per GPU.',
  wrap: 'This single wrap is the whole feature. DDP registers hooks on the backward pass that all-reduce gradients as they are produced.',
  sampler: 'DistributedSampler makes sure each rank sees a different slice — this is the "split" step of data parallelism.',
  loop: 'The training loop is unchanged. loss.backward() triggers the gradient synchronisation invisibly, overlapped with the backward computation.',
};

const TFD_BLOCKS = [
  { id: 'imp', text: `import tensorflow as tf` },
  { id: null, text: `` },
  { id: 'strategy', text: `strategy = tf.distribute.MirroredStrategy()\nprint("Devices:", strategy.num_replicas_in_sync)` },
  { id: null, text: `` },
  { id: 'scope', text: `with strategy.scope():\n    model = build_model()\n    model.compile(optimizer="adam",\n                  loss="sparse_categorical_crossentropy",\n                  metrics=["accuracy"])` },
  { id: null, text: `` },
  { id: 'fit', text: `model.fit(train_dataset, epochs=10)` },
  { id: null, text: `` },
  { id: 'multi', text: `# Across several machines instead of one:\n# strategy = tf.distribute.MultiWorkerMirroredStrategy()` },
];

const TFD_NOTES = {
  imp: 'Distribution lives in tf.distribute — no separate launcher script needed for the single-machine case.',
  strategy: 'MirroredStrategy replicates variables onto every GPU on this machine and keeps them in sync with All-Reduce.',
  scope: 'Anything created inside strategy.scope() becomes a mirrored variable. Building the model here is the whole requirement.',
  fit: 'model.fit is untouched. TensorFlow shards each batch across replicas and aggregates gradients for you.',
  multi: 'Swap in MultiWorkerMirroredStrategy and the same code spans several machines, coordinated through the TF_CONFIG environment variable.',
};

export function FrameworksVisualizer() {
  const [tab, setTab] = useState('torch');
  const [focus, setFocus] = useState('wrap');

  const isTorch = tab === 'torch';
  const blocks = isTorch ? DDP_BLOCKS : TFD_BLOCKS;
  const notes = isTorch ? DDP_NOTES : TFD_NOTES;
  const note = notes[focus] || notes[isTorch ? 'wrap' : 'strategy'];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Let the framework do it</h3>
        <p className="text-gray-400 text-sm">
          Single-GPU script to distributed, in a handful of lines. Tap any block.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'torch', label: 'PyTorch DDP' },
          { id: 'tf', label: 'tf.distribute' },
        ]}
        value={tab}
        onChange={(v) => {
          setTab(v);
          setFocus(v === 'torch' ? 'wrap' : 'strategy');
        }}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-3 min-h-0">
        <CodeBlocks
          blocks={blocks}
          focus={focus}
          setFocus={setFocus}
          file={isTorch ? 'train_ddp.py' : 'train_mirrored.py'}
        />
        <div className="flex flex-col gap-2 min-h-0">
          <NoteBox>{note}</NoteBox>
          <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3 text-xs text-gray-400 leading-relaxed">
            <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Launch it</div>
            <span className="font-mono text-cyan-300 break-all">
              {isTorch ? 'torchrun --nproc_per_node=4 train_ddp.py' : 'python train_mirrored.py'}
            </span>
          </div>
          <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-3 text-xs text-gray-200 leading-relaxed">
            Both APIs implement the same five stages you stepped through: replicate, split, compute,
            all-reduce, update. You are not learning a new algorithm — only a new wrapper around it.
          </div>
        </div>
      </div>
    </div>
  );
}
