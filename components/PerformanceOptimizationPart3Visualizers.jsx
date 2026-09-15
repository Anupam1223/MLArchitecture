import React, { useState } from 'react';
import { HardDrive, Cpu, Zap, Database, Files, AlertTriangle, CheckCircle } from 'lucide-react';

/* ── shared helpers ───────────────────────────────────────────────────────── */

function Tabs({ options, value, onChange, accent = 'bg-rose-600' }) {
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
        className="px-4 py-1.5 rounded-lg bg-rose-600 text-xs font-bold text-white disabled:opacity-30"
      >
        {label} →
      </button>
    </div>
  );
}

function py(code) {
  const out = [];
  const re =
    /(#[^\n]*)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|\b(import|from|as|with|for|in|if|else|def|class|break|return|True|False|None|print|enumerate|zip|range|pass)\b|\b(\d[\d_]*)\b/g;
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
              className={`block w-full text-left rounded-md px-1.5 transition border-l-2 ${
                focus === b.id
                  ? 'bg-rose-500/20 ring-1 ring-rose-400/60 border-rose-400'
                  : 'border-transparent hover:bg-white/5'
              }`}
            >
              <pre className="whitespace-pre text-gray-300">{py(b.text)}</pre>
            </button>
          ) : (
            <pre key={`s${i}`} className="whitespace-pre px-1.5 text-gray-300 border-l-2 border-transparent">
              {py(b.text)}
            </pre>
          ),
        )}
      </div>
    </div>
  );
}

function NoteBox({ children, tone = 'rose' }) {
  const map = {
    rose: 'border-rose-400/40 bg-rose-500/10',
    amber: 'border-amber-400/40 bg-amber-500/10',
    emerald: 'border-emerald-400/40 bg-emerald-500/10',
    sky: 'border-sky-400/40 bg-sky-500/10',
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm text-gray-200 leading-relaxed ${map[tone]}`}>
      {children}
    </div>
  );
}

/* ── 1. GPU starvation ────────────────────────────────────────────────────── */

export function GpuStarvationVisualizer() {
  const [feed, setFeed] = useState(3); // batches/sec the CPU can prepare
  const capacity = 10; // batches/sec the GPU can consume
  const served = Math.min(feed, capacity);
  const util = Math.round((served / capacity) * 100);
  const starving = feed < capacity;
  const wastedPct = 100 - util;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">GPU starvation</h3>
        <p className="text-gray-400 text-sm">
          A powerful GPU is only as fast as the data you can feed it. Change the feed rate.
        </p>
      </div>

      <div className="flex items-stretch justify-center gap-3 mb-4">
        {/* CPU kitchen */}
        <div className="rounded-2xl border-2 border-sky-400/50 bg-sky-500/10 p-3 w-40 text-center">
          <Cpu className="w-6 h-6 mx-auto text-sky-300 mb-1" />
          <div className="text-xs font-bold text-white">CPU pipeline</div>
          <div className="text-[10px] text-gray-400 mb-2">read · decode · augment</div>
          <div className="text-2xl font-bold font-mono text-sky-300">{feed}</div>
          <div className="text-[9px] text-gray-500">batches / sec</div>
        </div>

        {/* the belt */}
        <div className="flex flex-col justify-center w-40">
          <div className="relative h-10 rounded-lg bg-gray-800/70 border border-gray-700 overflow-hidden flex items-center">
            {Array.from({ length: Math.min(6, Math.round(feed / 1.8)) }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded bg-emerald-400 mx-1 shrink-0"
                style={{ opacity: 1 - i * 0.12 }}
              />
            ))}
            {feed < 3 && (
              <span className="absolute inset-0 flex items-center justify-center text-[10px] text-rose-400 font-bold">
                belt nearly empty
              </span>
            )}
          </div>
          <div className="text-center text-[9px] text-gray-500 mt-1">batches in flight</div>
        </div>

        {/* GPU */}
        <div
          className={`rounded-2xl border-2 p-3 w-40 text-center transition ${
            starving ? 'border-rose-500 bg-rose-500/15' : 'border-emerald-400 bg-emerald-500/15'
          }`}
        >
          <Zap className={`w-6 h-6 mx-auto mb-1 ${starving ? 'text-rose-300' : 'text-emerald-300'}`} />
          <div className="text-xs font-bold text-white">GPU</div>
          <div className="text-[10px] text-gray-400 mb-2">can eat {capacity} / sec</div>
          <div className={`text-2xl font-bold font-mono ${starving ? 'text-rose-300' : 'text-emerald-300'}`}>
            {util}%
          </div>
          <div className="text-[9px] text-gray-500">utilisation</div>
        </div>
      </div>

      <div className="max-w-xl w-full mx-auto">
        <input
          type="range"
          min={1}
          max={16}
          step={1}
          value={feed}
          onChange={(e) => setFeed(parseInt(e.target.value, 10))}
          className="w-full accent-rose-500"
        />
        <div className="flex justify-between text-[9px] text-gray-600 mt-0.5">
          <span>slow pipeline</span>
          <span>fast pipeline</span>
        </div>

        {/* wasted capacity bar */}
        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            Where your GPU-hour goes
          </div>
          <div className="flex h-9 rounded-lg overflow-hidden border border-gray-700">
            <div
              className="bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300"
              style={{ width: `${util}%` }}
            >
              {util > 18 ? 'training' : ''}
            </div>
            <div
              className="bg-rose-900/70 flex items-center justify-center text-[10px] font-bold text-rose-300 transition-all duration-300"
              style={{ width: `${wastedPct}%` }}
            >
              {wastedPct > 22 ? 'idle — waiting for data' : ''}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <NoteBox tone={util >= 95 ? 'emerald' : util >= 60 ? 'amber' : 'rose'}>
            {util >= 95 ? (
              <>
                <strong className="text-white">The GPU is saturated.</strong> The pipeline keeps up, so
                every second of expensive compute is doing useful work. Pushing the feed rate higher buys
                nothing — the bottleneck has moved to the GPU, which is exactly where you want it.
              </>
            ) : (
              <>
                <strong className="text-white">{wastedPct}% of your GPU is doing nothing.</strong> It
                finishes a batch and sits waiting for the next one. You are paying full price for the
                accelerator and using {util}% of it. This is GPU starvation, and it is a data-pipeline
                problem, not a compute problem.
              </>
            )}
          </NoteBox>
        </div>
      </div>
    </div>
  );
}

/* ── 2. Sequential vs overlapped pipeline ─────────────────────────────────── */

const T_MAX = 16;
const NAIVE = {
  cpu: [0, 4, 8, 12].map((s, i) => ({ s, d: 2, label: `prep B${i + 1}` })),
  gpu: [2, 6, 10, 14].map((s, i) => ({ s, d: 2, label: `train B${i + 1}` })),
  total: 16,
};
const OVERLAP = {
  cpu: [0, 2, 4, 6].map((s, i) => ({ s, d: 2, label: `prep B${i + 1}` })),
  gpu: [2, 4, 6, 8].map((s, i) => ({ s, d: 2, label: `train B${i + 1}` })),
  total: 10,
};

function TraceRow({ label, blocks, color, t, total }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="w-12 text-[10px] font-mono text-gray-400 shrink-0">{label}</span>
      <div className="relative flex-1 h-9 rounded-lg bg-rose-950/40 border border-gray-700 overflow-hidden">
        {blocks.map((b) => {
          const done = t >= b.s + b.d;
          const active = t > b.s && t < b.s + b.d;
          return (
            <div
              key={b.s}
              className={`absolute top-1 bottom-1 rounded-sm flex items-center justify-center text-[9px] font-bold text-white transition-all duration-200 ${
                active ? `${color} ring-2 ring-white/70` : done ? color : 'bg-gray-800/70 text-gray-600'
              }`}
              style={{ left: `${(b.s / T_MAX) * 100}%`, width: `${(b.d / T_MAX) * 100}%` }}
            >
              {b.label}
            </div>
          );
        })}
        {/* cursor */}
        <div
          className="absolute inset-y-0 w-0.5 bg-white/90 transition-all duration-200"
          style={{ left: `${(Math.min(t, total) / T_MAX) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function PipelineOverlapVisualizer() {
  const [t, setT] = useState(0);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Taking turns vs. working together</h3>
        <p className="text-gray-400 text-sm">
          Four batches, same hardware. Advance the clock and compare the two timelines.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-rose-500/40 bg-gray-950/70 p-3">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[11px] font-bold text-rose-300">Naive sequential pipeline</span>
            <span className="text-[10px] font-mono text-gray-500">
              finishes at t = {NAIVE.total} · GPU idle 50%
            </span>
          </div>
          <TraceRow label="CPU" blocks={NAIVE.cpu} color="bg-sky-600" t={t} total={NAIVE.total} />
          <TraceRow label="GPU" blocks={NAIVE.gpu} color="bg-emerald-600" t={t} total={NAIVE.total} />
          <p className="text-[10px] text-gray-500 mt-1">
            The CPU prepares, hands over, then stops. The GPU trains, then stops. Neither is ever busy at
            the same time as the other.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/40 bg-gray-950/70 p-3">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-300">Optimized parallel pipeline</span>
            <span className="text-[10px] font-mono text-gray-500">
              finishes at t = {OVERLAP.total} · GPU idle 20%
            </span>
          </div>
          <TraceRow label="CPU" blocks={OVERLAP.cpu} color="bg-sky-600" t={t} total={OVERLAP.total} />
          <TraceRow label="GPU" blocks={OVERLAP.gpu} color="bg-emerald-600" t={t} total={OVERLAP.total} />
          <p className="text-[10px] text-gray-500 mt-1">
            While the GPU trains on batch N, the CPU is already preparing batch N+1. Same work, stacked
            instead of queued.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => setT(0)}
          className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300"
        >
          Reset
        </button>
        <span className="text-xs font-mono text-gray-400">t = {t}</span>
        <button
          type="button"
          disabled={t >= T_MAX}
          onClick={() => setT((v) => Math.min(T_MAX, v + 1))}
          className="px-4 py-1.5 rounded-lg bg-rose-600 text-xs font-bold text-white disabled:opacity-30"
        >
          Advance clock →
        </button>
      </div>

      <div className="mt-3">
        <NoteBox tone={t >= OVERLAP.total ? 'emerald' : 'rose'}>
          {t < OVERLAP.total ? (
            <>
              Watch the white cursors. In the top timeline one row is always empty — that empty space is
              an idle, expensive GPU.
            </>
          ) : (
            <>
              <strong className="text-white">
                The parallel pipeline finished at t={OVERLAP.total} while the naive one still has{' '}
                {NAIVE.total - OVERLAP.total} to go — a 1.6× speedup with no new hardware.
              </strong>{' '}
              Nothing got faster individually; the work was simply overlapped. Every technique in this
              part is a way of achieving this one picture.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}

/* ── 3. Common pipeline bottlenecks ───────────────────────────────────────── */

const CULPRITS = {
  io: {
    label: 'I/O bound',
    stage: 0,
    icon: HardDrive,
    what: 'Thousands of small files, or slow network storage. The overhead of opening, reading and closing each file adds up.',
    tell: 'Both CPU and GPU utilisation low; iostat shows the disk or network saturated.',
    fix: 'Pack the data into a few large binary files — TFRecord, WebDataset, Parquet — and read them sequentially.',
  },
  cpu: {
    label: 'CPU bound',
    stage: 1,
    icon: Cpu,
    what: 'The transformations are genuinely expensive. Complex image augmentation or text tokenization can take longer than the GPU needs to train on the batch.',
    tell: 'Several CPU cores pinned at 100% while GPU-Util sits low.',
    fix: 'More worker processes, cheaper augmentations, or move the augmentation onto the GPU.',
  },
  slow: {
    label: 'Inefficient transforms',
    stage: 1,
    icon: AlertTriangle,
    what: 'Pure Python loops and non-vectorized operations. The work itself is small, but done one element at a time in the interpreter.',
    tell: 'One core at 100%, adding workers barely helps, and the operation looks trivial on paper.',
    fix: 'Rewrite with vectorized NumPy / tf / torch operations — often a 50× win for the same logic.',
  },
};

const STAGES = [
  { name: 'Storage', sub: 'open · read · close', icon: HardDrive },
  { name: 'Transform', sub: 'decode · augment', icon: Cpu },
  { name: 'To GPU', sub: 'host → device copy', icon: Zap },
];

export function PipelineBottlenecksVisualizer() {
  const [c, setC] = useState('io');
  const cur = CULPRITS[c];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Where pipelines actually break</h3>
        <p className="text-gray-400 text-sm">Three common culprits, three different fixes.</p>
      </div>

      <Tabs
        options={Object.entries(CULPRITS).map(([id, v]) => ({ id, label: v.label }))}
        value={c}
        onChange={setC}
      />

      <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
        {STAGES.map((s, i) => {
          const bad = i === cur.stage;
          const Icon = s.icon;
          return (
            <React.Fragment key={s.name}>
              <div
                className={`rounded-xl border-2 px-4 py-3 w-[128px] text-center transition ${
                  bad ? 'border-rose-400 bg-rose-500/20 animate-pulse' : 'border-gray-700 bg-gray-900/60'
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1 ${bad ? 'text-rose-300' : 'text-gray-500'}`} />
                <div className="text-[11px] font-bold text-white">{s.name}</div>
                <div className="text-[9px] text-gray-500">{s.sub}</div>
              </div>
              {i < STAGES.length - 1 && <span className="text-gray-600 text-lg">→</span>}
            </React.Fragment>
          );
        })}
        <span className="text-gray-600 text-lg">→</span>
        <div className="rounded-xl border-2 border-gray-700 bg-gray-900/60 px-4 py-3 w-[110px] text-center opacity-60">
          <Zap className="w-5 h-5 mx-auto mb-1 text-gray-600" />
          <div className="text-[11px] font-bold text-gray-400">GPU</div>
          <div className="text-[9px] text-rose-400">waiting</div>
        </div>
      </div>

      {c === 'slow' && (
        <div className="max-w-md mx-auto w-full mb-3 rounded-xl border border-gray-700 bg-gray-950/70 p-3">
          <div className="text-[10px] uppercase text-gray-500 mb-2">same logic, two implementations</div>
          {[
            ['python for-loop', 100, 'bg-rose-500'],
            ['vectorized numpy', 2, 'bg-emerald-500'],
          ].map(([k, w, col]) => (
            <div key={k} className="flex items-center gap-2 mb-1.5">
              <span className="w-28 text-[10px] font-mono text-gray-400">{k}</span>
              <div className="flex-1 h-4 rounded bg-gray-800 overflow-hidden">
                <div className={`h-full ${col}`} style={{ width: `${w}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-4xl w-full mx-auto">
        <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3">
          <div className="text-[10px] font-bold uppercase text-gray-400 mb-1">What it is</div>
          <p className="text-xs text-gray-200 leading-relaxed">{cur.what}</p>
        </div>
        <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-3">
          <div className="text-[10px] font-bold uppercase text-amber-300 mb-1">How you spot it</div>
          <p className="text-xs text-gray-200 leading-relaxed">{cur.tell}</p>
        </div>
        <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-3">
          <div className="text-[10px] font-bold uppercase text-emerald-300 mb-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> The fix
          </div>
          <p className="text-xs text-gray-200 leading-relaxed">{cur.fix}</p>
        </div>
      </div>
    </div>
  );
}

/* ── 4. Parallel workers ──────────────────────────────────────────────────── */

const WORKER_BLOCKS = [
  { id: null, text: `# PyTorch: Using multiple workers for parallel data loading` },
  { id: 'imp', text: `from torch.utils.data import DataLoader` },
  { id: null, text: `` },
  { id: 'nw', text: `# On Linux, a good starting point is to set num_workers to the number of CPU cores.\n# Be cautious on Windows, as process spawning has more overhead.\ntrain_loader = DataLoader(\n    train_dataset,\n    batch_size=128,\n    shuffle=True,\n    num_workers=8,` },
  { id: 'pin', text: `    pin_memory=True # Speeds up CPU-to-GPU data transfer\n)` },
  { id: null, text: `` },
  { id: null, text: `# TensorFlow: Using parallel calls for map transformations` },
  { id: 'tf', text: `AUTOTUNE = tf.data.AUTOTUNE\n\ndataset = tf.data.TFRecordDataset(filenames)\ndataset = dataset.map(parse_and_preprocess_function, num_parallel_calls=AUTOTUNE)` },
];

const WORKER_NOTES = {
  imp: 'The DataLoader is the only thing standing between your dataset and the training loop — and by default it does all its work in the main process.',
  nw: 'num_workers > 0 spawns that many separate Python processes, each loading and preprocessing batches in the background. This is the single most direct fix for both I/O and CPU bottlenecks, because it sidesteps the GIL entirely.',
  pin: 'pin_memory stages batches in page-locked memory, which lets the GPU pull them over asynchronously instead of waiting on a regular pageable copy.',
  tf: 'AUTOTUNE lets TensorFlow measure your pipeline at runtime and pick the parallelism level itself, adjusting as conditions change. Prefer it over a hard-coded number.',
};

export function WorkersVisualizer() {
  const [tab, setTab] = useState('scene');
  const [w, setW] = useState(0);
  const [focus, setFocus] = useState('nw');
  const cores = 8;
  const effective = w === 0 ? 1 : Math.min(w, cores) + Math.max(0, w - cores) * 0.15;
  const penalty = w > cores ? (w - cores) * 0.18 : 0;
  const throughput = Math.max(0.8, effective - penalty);
  const util = Math.min(100, Math.round((throughput / 8) * 100));

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Parallelize with multiple workers</h3>
        <p className="text-gray-400 text-sm">More processes preparing data, none of them blocking training.</p>
      </div>

      <Tabs
        options={[
          { id: 'scene', label: 'Add workers' },
          { id: 'code', label: 'The code' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'scene' && (
        <div className="flex-1 overflow-y-auto custom-scroll">
          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
              worker processes ({cores} CPU cores available)
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[76px] items-start">
              {w === 0 ? (
                <div className="rounded-lg border-2 border-rose-500 bg-rose-500/15 px-3 py-3 text-center">
                  <div className="text-[11px] font-bold text-rose-200">main process only</div>
                  <div className="text-[9px] text-gray-400">
                    loading blocks the training loop on every batch
                  </div>
                </div>
              ) : (
                Array.from({ length: w }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-[68px] rounded-lg border-2 px-1 py-2 text-center ${
                      i < cores
                        ? 'border-emerald-400/60 bg-emerald-500/15'
                        : 'border-amber-400/60 bg-amber-500/15'
                    }`}
                  >
                    <Cpu
                      className={`w-4 h-4 mx-auto ${i < cores ? 'text-emerald-300' : 'text-amber-300'}`}
                    />
                    <div className="text-[9px] font-mono text-gray-300 mt-0.5">w{i}</div>
                    {i >= cores && <div className="text-[8px] text-amber-400">no core</div>}
                  </div>
                ))
              )}
            </div>

            <input
              type="range"
              min={0}
              max={14}
              step={1}
              value={w}
              onChange={(e) => setW(parseInt(e.target.value, 10))}
              className="w-full mt-4 accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
              <span>num_workers = {w}</span>
              <span>{cores} cores</span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>resulting GPU utilisation</span>
                <span
                  className={`font-bold ${
                    util > 90 ? 'text-emerald-400' : util > 50 ? 'text-amber-400' : 'text-rose-400'
                  }`}
                >
                  {util}%
                </span>
              </div>
              <div className="h-5 rounded bg-gray-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    util > 90 ? 'bg-emerald-500' : util > 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${util}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <NoteBox tone={w === 0 ? 'rose' : w > cores ? 'amber' : util > 90 ? 'emerald' : 'sky'}>
              {w === 0 && (
                <>
                  <strong className="text-white">num_workers=0 is the default.</strong> Data loading
                  happens inside the training loop, so the GPU waits through every single read and
                  transform.
                </>
              )}
              {w > 0 && w <= cores && util <= 90 && (
                <>
                  Each worker is a separate OS process with its own Python interpreter, so they genuinely
                  run in parallel. Keep adding.
                </>
              )}
              {w > 0 && w <= cores && util > 90 && (
                <>
                  <strong className="text-white">The GPU is now saturated.</strong> A good starting point
                  is one worker per CPU core — then measure, because the right number depends on how heavy
                  your transforms are.
                </>
              )}
              {w > cores && (
                <>
                  <strong className="text-white">Past the core count it gets worse, not better.</strong>{' '}
                  Extra processes fight over the same cores, add context-switching overhead, and each one
                  costs memory. More workers is not automatically faster.
                </>
              )}
            </NoteBox>
          </div>
        </div>
      )}

      {tab === 'code' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-3 min-h-0">
          <CodeBlocks blocks={WORKER_BLOCKS} focus={focus} setFocus={setFocus} file="parallel_loading.py" />
          <div className="min-h-0 overflow-auto custom-scroll">
            <NoteBox>{WORKER_NOTES[focus]}</NoteBox>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 5. Prefetch ──────────────────────────────────────────────────────────── */

const PREFETCH_BLOCKS = [
  { id: null, text: `# TensorFlow: Add prefetching to the end of the pipeline` },
  { id: 'batch', text: `dataset = dataset.batch(128)` },
  { id: 'pf', text: `dataset = dataset.prefetch(buffer_size=AUTOTUNE) # Prefetch a few batches` },
  { id: null, text: `` },
  { id: 'loop', text: `# Now, when the model requests a batch, it's likely already available.\nfor batch in dataset:\n    # Training step...\n    pass` },
  { id: null, text: `` },
  { id: 'torch', text: `# PyTorch: a DataLoader with num_workers > 0 already prefetches.\n# pin_memory=True stages batches for faster async transfer.\nloader = DataLoader(ds, batch_size=128, num_workers=8, pin_memory=True)` },
];

const PREFETCH_NOTES = {
  batch: 'Batching happens before prefetching, so the buffer holds ready-to-consume batches rather than loose samples.',
  pf: 'This one line decouples production from consumption. While the GPU trains on batch N, the input pipeline is already building batch N+1 into a small buffer.',
  loop: 'The training loop is unchanged. The difference is that the batch it asks for usually already exists, so the request returns immediately instead of triggering work.',
  torch: 'PyTorch does not have a separate prefetch() call — worker processes are already running ahead of the loop. pin_memory is the extra piece that makes the final hop to the GPU asynchronous.',
};

export function PrefetchVisualizer() {
  const [on, setOn] = useState(false);
  const [tab, setTab] = useState('scene');
  const [focus, setFocus] = useState('pf');
  const [step, setStep] = useState(0);

  const bufferFill = on ? Math.min(3, step + 1) : 0;
  const gpuWaiting = !on && step % 2 === 0;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Prefetch: keep a batch ready</h3>
        <p className="text-gray-400 text-sm">A small buffer between the producer and the consumer.</p>
      </div>

      <Tabs
        options={[
          { id: 'scene', label: 'The buffer' },
          { id: 'code', label: 'The code' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'scene' && (
        <div className="flex-1 overflow-y-auto custom-scroll">
          <div className="flex justify-center mb-3">
            <button
              type="button"
              onClick={() => {
                setOn((v) => !v);
                setStep(0);
              }}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
                on ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-200'
              }`}
            >
              prefetch: {on ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
            <div className="flex items-center justify-between gap-3">
              {/* producer */}
              <div className="rounded-xl border-2 border-sky-400/50 bg-sky-500/10 p-3 w-32 text-center">
                <Cpu className="w-5 h-5 mx-auto text-sky-300 mb-1" />
                <div className="text-[11px] font-bold text-white">CPU produces</div>
                <div className="text-[9px] text-gray-400">
                  {on ? `building batch ${step + 2}` : `building batch ${step + 1}`}
                </div>
              </div>

              {/* buffer */}
              <div className="flex-1">
                <div className="text-[10px] uppercase text-gray-500 text-center mb-1">
                  prefetch buffer
                </div>
                <div className="flex justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                        i < bufferFill
                          ? 'border-emerald-400 bg-emerald-500/25 text-emerald-100'
                          : 'border-dashed border-gray-700 text-gray-700'
                      }`}
                    >
                      {i < bufferFill ? 'ready' : 'empty'}
                    </div>
                  ))}
                </div>
                <div className="text-center text-[9px] text-gray-500 mt-1">
                  {on ? 'always a batch waiting' : 'no buffer — the GPU asks, then waits'}
                </div>
              </div>

              {/* consumer */}
              <div
                className={`rounded-xl border-2 p-3 w-32 text-center transition ${
                  gpuWaiting ? 'border-rose-500 bg-rose-500/15' : 'border-emerald-400 bg-emerald-500/15'
                }`}
              >
                <Zap
                  className={`w-5 h-5 mx-auto mb-1 ${gpuWaiting ? 'text-rose-300' : 'text-emerald-300'}`}
                />
                <div className="text-[11px] font-bold text-white">GPU consumes</div>
                <div className={`text-[9px] font-bold ${gpuWaiting ? 'text-rose-300' : 'text-emerald-300'}`}>
                  {gpuWaiting ? 'IDLE — waiting' : `training batch ${step + 1}`}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-xs font-bold text-white"
              >
                Next batch →
              </button>
            </div>
          </div>

          <div className="mt-3">
            <NoteBox tone={on ? 'emerald' : 'rose'}>
              {on ? (
                <>
                  <strong className="text-white">The buffer absorbs the timing mismatch.</strong> The CPU
                  runs ahead building batch N+1 while the GPU trains on batch N, so a request for data is
                  answered instantly. This alone can almost completely eliminate GPU starvation — as long
                  as the pipeline can keep up on average.
                </>
              ) : (
                <>
                  <strong className="text-white">Without a buffer, work is strictly serial.</strong> The
                  GPU asks for a batch, and only then does the CPU start making it. Turn prefetch on and
                  step through again.
                </>
              )}
            </NoteBox>
          </div>
        </div>
      )}

      {tab === 'code' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-3 min-h-0">
          <CodeBlocks blocks={PREFETCH_BLOCKS} focus={focus} setFocus={setFocus} file="prefetch.py" />
          <div className="min-h-0 overflow-auto custom-scroll">
            <NoteBox>{PREFETCH_NOTES[focus]}</NoteBox>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 6. Cache ─────────────────────────────────────────────────────────────── */

const CACHE_BLOCKS = [
  { id: null, text: `# TensorFlow: Caching a dataset in memory` },
  { id: 'src', text: `dataset = tf.data.TFRecordDataset(filenames)\ndataset = dataset.map(parse_and_preprocess_function, num_parallel_calls=AUTOTUNE)` },
  { id: null, text: `` },
  { id: 'cache', text: `# IMPORTANT: Cache *before* shuffling and batching for effective training.\n# This caches the individual, preprocessed items.\ndataset = dataset.cache()` },
  { id: null, text: `` },
  { id: 'after', text: `# Now apply operations that should be different each epoch.\ndataset = dataset.shuffle(buffer_size=10000)\ndataset = dataset.batch(128)\ndataset = dataset.prefetch(buffer_size=AUTOTUNE)` },
];

const CACHE_NOTES = {
  src: 'Reading and parsing is the expensive part, and it produces the same result every epoch — which is exactly what makes it cacheable.',
  cache: 'cache() memorises whatever the pipeline has produced up to this point. Placed here, it stores parsed, preprocessed individual items.',
  after: 'Shuffle and batch come after the cache on purpose. If you cached after shuffling, every epoch would replay the identical shuffle order and you would lose the randomness that training depends on.',
};

export function CacheVisualizer() {
  const [tab, setTab] = useState('scene');
  const [epoch, setEpoch] = useState(1);
  const [dsGb, setDsGb] = useState(3);
  const [focus, setFocus] = useState('cache');
  const ramGb = 16;
  const fits = dsGb <= ramGb * 0.6;

  if (tab === 'code') {
    return (
      <div className="flex flex-col w-full h-full p-4 overflow-hidden">
        <div className="text-center mb-3">
          <h3 className="text-xl font-semibold text-white mb-1">Cache the dataset in memory</h3>
          <p className="text-gray-400 text-sm">Placement in the chain is the whole trick.</p>
        </div>

        <Tabs
          options={[
            { id: 'scene', label: 'Run the epochs' },
            { id: 'code', label: 'The code' },
          ]}
          value={tab}
          onChange={setTab}
        />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-3 min-h-0">
          <CodeBlocks blocks={CACHE_BLOCKS} focus={focus} setFocus={setFocus} file="cache_pipeline.py" />
          <div className="flex flex-col gap-2 min-h-0 overflow-auto custom-scroll">
            <NoteBox>{CACHE_NOTES[focus]}</NoteBox>
            <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-3 text-xs text-gray-200 leading-relaxed">
              <div className="text-[10px] font-bold uppercase text-amber-300 mb-1">Warning</div>
              Be mindful of your available RAM. Attempting to cache a dataset larger than available memory
              will cause your system to slow down dramatically or crash. Use this technique only when
              appropriate.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Cache the dataset in memory</h3>
        <p className="text-gray-400 text-sm">Pay the disk cost once, then never again.</p>
      </div>

      <Tabs
        options={[
          { id: 'scene', label: 'Run the epochs' },
          { id: 'code', label: 'The code' },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className={`rounded-xl border-2 p-3 w-32 text-center transition ${
              epoch === 1 || !fits ? 'border-rose-400 bg-rose-500/15' : 'border-gray-700 opacity-40'
            }`}
          >
            <HardDrive
              className={`w-5 h-5 mx-auto mb-1 ${epoch === 1 || !fits ? 'text-rose-300' : 'text-gray-600'}`}
            />
            <div className="text-[11px] font-bold text-white">Disk</div>
            <div className="text-[9px] text-gray-400">
              {epoch === 1 || !fits ? 'reading + parsing' : 'untouched'}
            </div>
          </div>

          <span className="text-gray-600 text-lg">→</span>

          <div
            className={`rounded-xl border-2 p-3 w-36 text-center transition ${
              epoch > 1 && fits ? 'border-emerald-400 bg-emerald-500/20' : 'border-gray-700 bg-gray-900/60'
            }`}
          >
            <Database
              className={`w-5 h-5 mx-auto mb-1 ${epoch > 1 && fits ? 'text-emerald-300' : 'text-gray-500'}`}
            />
            <div className="text-[11px] font-bold text-white">RAM cache</div>
            <div className="text-[9px] text-gray-400">
              {epoch === 1 ? 'filling…' : fits ? 'serving everything' : 'overflowed'}
            </div>
          </div>

          <span className="text-gray-600 text-lg">→</span>

          <div className="rounded-xl border-2 border-sky-400/50 bg-sky-500/10 p-3 w-28 text-center">
            <Zap className="w-5 h-5 mx-auto mb-1 text-sky-300" />
            <div className="text-[11px] font-bold text-white">Training</div>
          </div>
        </div>

        {/* epoch times */}
        <div className="space-y-1.5">
          {[1, 2, 3, 4].map((e) => {
            const t = e === 1 || !fits ? 100 : 14;
            const shown = e <= epoch;
            return (
              <div key={e} className="flex items-center gap-2">
                <span className="w-14 text-[10px] font-mono text-gray-400">epoch {e}</span>
                <div className="flex-1 h-5 rounded bg-gray-800 overflow-hidden">
                  {shown && (
                    <div
                      className={`h-full transition-all duration-500 flex items-center justify-end pr-2 text-[9px] font-bold text-white ${
                        t > 50 ? 'bg-rose-600' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${t}%` }}
                    >
                      {t}s
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => setEpoch(1)}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300"
          >
            Reset
          </button>
          <button
            type="button"
            disabled={epoch >= 4}
            onClick={() => setEpoch((e) => Math.min(4, e + 1))}
            className="px-4 py-1.5 rounded-lg bg-rose-600 text-xs font-bold text-white disabled:opacity-30"
          >
            Run next epoch →
          </button>
        </div>
      </div>

      {/* RAM guard */}
      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-3 mt-3">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>dataset size</span>
          <span className="font-mono">
            {dsGb} GB of {ramGb} GB RAM
          </span>
        </div>
        <div className="h-5 rounded bg-gray-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${fits ? 'bg-emerald-500' : 'bg-rose-500'}`}
            style={{ width: `${(dsGb / ramGb) * 100}%` }}
          />
        </div>
        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={dsGb}
          onChange={(e) => setDsGb(parseInt(e.target.value, 10))}
          className="w-full mt-2 accent-rose-500"
        />
      </div>

      <div className="mt-3">
        <NoteBox tone={!fits ? 'rose' : epoch === 1 ? 'sky' : 'emerald'}>
          {!fits ? (
            <>
              <strong className="text-white">Do not cache this one.</strong> Attempting to cache a dataset
              larger than available memory will push the machine into swap and slow everything down
              dramatically, or crash it outright. Caching is for datasets up to a few gigabytes.
            </>
          ) : epoch === 1 ? (
            <>
              The first epoch still pays full price — data is read from disk, parsed and transformed. The
              result is kept in memory as it goes.
            </>
          ) : (
            <>
              <strong className="text-white">Every epoch after the first reads from RAM.</strong> Disk I/O
              and the initial preprocessing are bypassed completely, which is why epoch 2 onward takes a
              fraction of the time.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}

/* ── 7. Efficient data formats ────────────────────────────────────────────── */

export function DataFormatsVisualizer() {
  const [sharded, setSharded] = useState(false);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">How the data sits on disk</h3>
        <p className="text-gray-400 text-sm">
          A million tiny files is a million round trips to the filesystem.
        </p>
      </div>

      <div className="flex justify-center mb-3">
        <button
          type="button"
          onClick={() => setSharded((v) => !v)}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
            sharded ? 'bg-emerald-600 text-white' : 'bg-rose-700 text-white'
          }`}
        >
          {sharded ? '1,000 TFRecord shards' : '1,000,000 individual JPEGs'} — tap to switch
        </button>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
        <div className="flex flex-wrap justify-center gap-1 mb-3 min-h-[68px] items-center">
          {sharded
            ? [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-14 flex-1 max-w-[180px] rounded-lg border-2 border-emerald-400 bg-emerald-500/15 flex flex-col items-center justify-center"
                >
                  <Database className="w-4 h-4 text-emerald-300" />
                  <span className="text-[9px] font-mono text-emerald-200 mt-0.5">shard-000{i}</span>
                </div>
              ))
            : Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded border border-rose-400/50 bg-rose-500/15 flex items-center justify-center"
                >
                  <Files className="w-3 h-3 text-rose-300" />
                </div>
              ))}
        </div>

        <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
          time spent reading one batch
        </div>
        <div className="flex h-9 rounded-lg overflow-hidden border border-gray-700">
          <div
            className="bg-rose-600 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500"
            style={{ width: sharded ? '6%' : '78%' }}
          >
            {!sharded && 'open / seek / close overhead'}
          </div>
          <div
            className="bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500"
            style={{ width: sharded ? '94%' : '22%' }}
          >
            {sharded ? 'actual sequential data read' : 'data'}
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-2">
          {sharded
            ? 'Almost all the time now goes to moving real bytes, read sequentially.'
            : 'Most of the time is filesystem bookkeeping, repeated once per image.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
        {[
          ['TFRecord', 'TensorFlow', 'A sequence of binary records. Streams large datasets from disk without loading the file into memory.'],
          ['WebDataset', 'PyTorch', 'Plain tar archives. Efficient streaming and shuffling, well suited to distributed training.'],
          ['HDF5 / Parquet', 'tabular', 'Column-oriented. Excellent when you need very fast reads of specific columns.'],
        ].map(([n, tag, d]) => (
          <div key={n} className="rounded-xl border border-gray-700 bg-gray-900/60 p-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold text-white">{n}</span>
              <span className="text-[9px] text-rose-300 uppercase">{tag}</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed mt-1">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <NoteBox tone={sharded ? 'emerald' : 'rose'}>
          {sharded ? (
            <>
              <strong className="text-white">Fewer, larger, contiguous files.</strong> The filesystem is
              consulted a thousand times instead of a million, and reads become sequential — which matters
              enormously on network storage, where each round trip also carries latency.
            </>
          ) : (
            <>
              Every image costs an open, a read and a close before a single useful byte arrives. Multiply
              that by a million per epoch and the overhead dwarfs the data itself.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}

/* ── 8. The complete pipeline ─────────────────────────────────────────────── */

const FULL_BLOCKS = [
  { id: 'head', text: `import tensorflow as tf\n\nAUTOTUNE = tf.data.AUTOTUNE\n\ndef build_efficient_pipeline(filenames, batch_size):` },
  { id: 's1', text: `    # 1. Create a dataset from a performant file format like TFRecord.\n    dataset = tf.data.TFRecordDataset(filenames)` },
  { id: 's2', text: `    # 2. Use .cache() for small datasets that fit in memory.\n    #    This should come early in the pipeline.\n    dataset = dataset.cache()` },
  { id: 's3', text: `    # 3. Shuffle the data. A large buffer size is important for randomness.\n    dataset = dataset.shuffle(buffer_size=10_000, reshuffle_each_iteration=True)` },
  { id: 's4', text: `    # 4. Apply preprocessing in parallel.\n    dataset = dataset.map(parse_and_preprocess_function, num_parallel_calls=AUTOTUNE)` },
  { id: 's5', text: `    # 5. Batch the data.\n    dataset = dataset.batch(batch_size)` },
  { id: 's6', text: `    # 6. Prefetch to overlap CPU/GPU work. This should be the last step.\n    dataset = dataset.prefetch(buffer_size=AUTOTUNE)` },
  { id: null, text: `` },
  { id: null, text: `    return dataset` },
  { id: null, text: `` },
  { id: 'use', text: `# Usage:\ntrain_pipeline = build_efficient_pipeline(train_files, batch_size=256)\n\n# The model will now be fed data with minimal delay.\nmodel.fit(train_pipeline, epochs=10)` },
];

const FULL_NOTES = {
  head: 'AUTOTUNE appears throughout: it lets the runtime measure the pipeline and pick parallelism and buffer sizes itself, adapting as conditions change.',
  s1: 'Start from a format built for streaming. Everything downstream inherits whatever read performance you choose here.',
  s2: 'Cache early, so the expensive read and parse happen once. Only do this if the dataset comfortably fits in RAM.',
  s3: 'Shuffle after the cache, never before — otherwise every epoch replays the identical order. A large buffer matters: a small one only shuffles within a narrow window.',
  s4: 'Parallel map spreads the transform across cores. Placing it after shuffle keeps the cached items raw and reusable.',
  s5: 'Batch once the per-item work is done, so the buffer downstream holds whole batches.',
  s6: 'Prefetch must be last. Its job is to hide the entire upstream pipeline behind the GPU step, and it can only do that if everything else is upstream of it.',
};

export function FullPipelineVisualizer() {
  const [focus, setFocus] = useState('s6');
  const order = ['s1', 's2', 's3', 's4', 's5', 's6'];
  const names = ['read', 'cache', 'shuffle', 'map', 'batch', 'prefetch'];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">A complete optimized pipeline</h3>
        <p className="text-gray-400 text-sm">Six operations — and the order is part of the design.</p>
      </div>

      <div className="flex items-center justify-center gap-1 mb-3 flex-wrap">
        {order.map((id, i) => (
          <React.Fragment key={id}>
            <button
              type="button"
              onClick={() => setFocus(id)}
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition ${
                focus === id ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {i + 1}. {names[i]}
            </button>
            {i < order.length - 1 && <span className="text-gray-600 text-xs">→</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3 min-h-0">
        <CodeBlocks blocks={FULL_BLOCKS} focus={focus} setFocus={setFocus} file="input_pipeline.py" />
        <div className="flex flex-col gap-2 min-h-0 overflow-auto custom-scroll">
          <NoteBox>{FULL_NOTES[focus]}</NoteBox>
          <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-3 text-xs text-gray-200 leading-relaxed">
            <div className="text-[10px] font-bold uppercase text-amber-300 mb-1">Two ordering traps</div>
            <p className="mb-1">
              <strong className="text-white">cache after shuffle</strong> — the shuffle result gets
              memorised, so every epoch sees the same order.
            </p>
            <p>
              <strong className="text-white">prefetch not last</strong> — anything added after it runs
              outside the overlap and reintroduces the stall.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 9. nvidia-smi and htop ───────────────────────────────────────────────── */

const SMI_FIELDS = {
  util: {
    label: 'GPU-Util',
    note: 'The most important metric for training. The percentage of time one or more kernels were executing on the GPU over the last second. For a well-optimized workload this should be consistently above 90%. Fluctuating wildly or staying low means the GPU is waiting for data.',
  },
  mem: {
    label: 'Memory-Usage',
    note: 'How much VRAM is in use. Close to capacity means you risk out-of-memory errors — a different problem, usually solved by reducing batch size or using mixed precision. Note that high memory usage says nothing about whether the GPU is busy.',
  },
  pwr: {
    label: 'Pwr:Usage/Cap',
    note: 'Current power draw against the maximum. High draw is another sign the GPU is genuinely working hard. A card sitting near idle wattage during training is a strong starvation signal.',
  },
};

export function SmiMonitorVisualizer() {
  const [f, setF] = useState('util');

  const Field = ({ id, children }) => (
    <button
      type="button"
      onMouseEnter={() => setF(id)}
      onClick={() => setF(id)}
      className={`rounded px-1 transition ${
        f === id ? 'bg-rose-500/40 text-white font-bold' : 'hover:bg-white/10 text-gray-300'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Reading nvidia-smi</h3>
        <p className="text-gray-400 text-sm">Tap a field in the output to learn what it tells you.</p>
      </div>

      <div className="rounded-2xl bg-black/85 border border-gray-700 p-3 font-mono text-[11px] overflow-x-auto">
        <div className="text-emerald-400 mb-2">$ watch -n 1 nvidia-smi</div>
        <pre className="whitespace-pre text-gray-500 leading-5">{`+-----------------------------------------------------------------------------+
| NVIDIA-SMI 515.65.01    Driver Version: 515.65.01    CUDA Version: 11.7     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |`}</pre>
        <div className="flex gap-1 text-gray-500 leading-5">
          <span>| Fan Temp Perf </span>
          <Field id="pwr">Pwr:Usage/Cap</Field>
          <span>| </span>
          <Field id="mem">Memory-Usage</Field>
          <span> | </span>
          <Field id="util">GPU-Util</Field>
          <span> Compute M. |</span>
        </div>
        <pre className="whitespace-pre text-gray-500 leading-5">{`|===============================+======================+======================|`}</pre>
        <div className="flex gap-1 text-gray-300 leading-5">
          <span>| 0 NVIDIA A100-SXM.. On | 00000000:00:04.0 Off |</span>
        </div>
        <div className="flex gap-1 leading-5">
          <span className="text-gray-300">| N/A 38C P0 </span>
          <Field id="pwr">59W / 400W</Field>
          <span className="text-gray-300">| </span>
          <Field id="mem">1540MiB / 40960MiB</Field>
          <span className="text-gray-300"> | </span>
          <Field id="util">95%</Field>
          <span className="text-gray-300"> Default |</span>
        </div>
        <pre className="whitespace-pre text-gray-500 leading-5">{`+-------------------------------+----------------------+----------------------+`}</pre>
      </div>

      <div className="mt-3">
        <NoteBox>
          <strong className="text-white">{SMI_FIELDS[f].label}.</strong> {SMI_FIELDS[f].note}
        </NoteBox>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <div className="rounded-2xl bg-black/85 border border-gray-700 p-3">
          <div className="text-emerald-400 font-mono text-[11px] mb-2">$ htop</div>
          <div className="space-y-1">
            {[100, 99, 100, 97, 12, 9, 14, 11].map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-gray-500 w-5 font-mono text-[10px]">{i}</span>
                <div className="flex-1 h-3 rounded-sm bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full ${c > 90 ? 'bg-rose-500' : 'bg-emerald-600'}`}
                    style={{ width: `${c}%` }}
                  />
                </div>
                <span
                  className={`w-9 text-right font-mono text-[10px] ${
                    c > 90 ? 'text-rose-400 font-bold' : 'text-gray-500'
                  }`}
                >
                  {c}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3 text-xs text-gray-300 leading-relaxed">
          <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Reading them together</div>
          <p className="mb-2">
            Four cores pinned at 100% while GPU-Util is low is the signature of a CPU-bound input pipeline
            — image augmentation or tokenization running ahead of the GPU.
          </p>
          <p>
            If <span className="font-mono text-rose-300">nvidia-smi</span> shows low GPU-Util, your
            investigation should go straight to the data pipeline, not the model.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 10. PyTorch profiler ─────────────────────────────────────────────────── */

const TORCH3_BLOCKS = [
  { id: 'imp', text: `import torch\nimport torchvision.models as models\nfrom torch.profiler import profile, record_function, ProfilerActivity` },
  { id: null, text: `` },
  { id: 'setup', text: `model = models.resnet18().cuda()\ninputs = torch.randn(16, 3, 224, 224).cuda()` },
  { id: null, text: `` },
  { id: 'ctx', text: `with profile(\n    activities=[ProfilerActivity.CPU, ProfilerActivity.CUDA],\n    record_shapes=True,\n    with_stack=True\n) as prof:` },
  { id: 'rec', text: `    with record_function("model_inference"):\n        model(inputs)` },
  { id: null, text: `` },
  { id: 'table', text: `# Print a summary to the console\nprint(prof.key_averages().table(sort_by="cuda_time_total", row_limit=10))` },
  { id: null, text: `` },
  { id: 'trace', text: `# For a more detailed view, export to TensorBoard\n# prof.export_chrome_trace("trace.json")` },
];

const TORCH3_NOTES = {
  imp: 'Listing CPU and CUDA as separate activities is what lets the trace show you the gap between them — the gap is the whole point.',
  setup: 'A fixed input tensor keeps the measurement clean. In a real run you would wrap a few steps of the training loop instead.',
  ctx: 'record_shapes captures tensor shapes, useful for spotting unexpectedly small batches. with_stack attributes each operation back to the Python line that created it, so you can find the offending code rather than just the kernel name.',
  rec: 'record_function puts a named label around a region. Label your data loading, forward and backward separately and the trace becomes readable at a glance.',
  table: 'key_averages().table() lists operations with CPU and GPU time for each. Sorting by cuda_time_total puts your most expensive GPU operation on top.',
  trace: 'export_chrome_trace writes a timeline you can open in chrome://tracing or TensorBoard. That view is where idle gaps become visible — a table can never show you a gap.',
};

export function TorchProfiler3Visualizer() {
  const [tab, setTab] = useState('code');
  const [focus, setFocus] = useState('ctx');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Granular analysis: torch.profiler</h3>
        <p className="text-gray-400 text-sm">
          nvidia-smi tells you <em>if</em> the GPU is busy. This tells you <em>what</em> it is doing.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'code', label: 'Instrument it' },
          { id: 'out', label: 'The table it prints' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'code' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-3 min-h-0">
          <CodeBlocks blocks={TORCH3_BLOCKS} focus={focus} setFocus={setFocus} file="profile_resnet.py" />
          <div className="min-h-0 overflow-auto custom-scroll">
            <NoteBox>{TORCH3_NOTES[focus]}</NoteBox>
          </div>
        </div>
      )}

      {tab === 'out' && (
        <div className="flex-1 overflow-auto custom-scroll">
          <pre className="rounded-2xl bg-black/85 border border-gray-700 p-3 font-mono text-[11px] leading-6 text-gray-300 whitespace-pre overflow-x-auto">{`---------------------------  ------------  ------------  ------------
Name                            Self CUDA    CUDA total    # of Calls
---------------------------  ------------  ------------  ------------
model_inference                   0.000us       21.42ms             1
aten::conv2d                      9.812ms       14.03ms            20
aten::batch_norm                  3.104ms        5.22ms            20
aten::max_pool2d                  1.442ms        1.44ms             1
aten::relu_                       0.981ms        0.98ms            17
aten::add_                        0.377ms        0.38ms             8
aten::linear                      0.112ms        0.34ms             1
---------------------------  ------------  ------------  ------------
Self CPU time total: 64.27ms
Self CUDA time total: 21.42ms`}</pre>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <NoteBox tone="rose">
              <strong className="text-white">CPU 64ms, CUDA 21ms.</strong> The GPU did its work in a third
              of the wall-clock time. Two-thirds of this run is the GPU waiting on the host.
            </NoteBox>
            <NoteBox tone="sky">
              <strong className="text-white">Convolutions dominate the GPU side</strong> — expected for a
              ResNet. When the top entry is a copy or a reduction instead, you have found something worth
              fixing.
            </NoteBox>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 11. TensorBoard profiler ─────────────────────────────────────────────── */

const TB_BLOCKS = [
  { id: 'imp', text: `import tensorflow as tf\n\n# ... model and data setup ...` },
  { id: null, text: `` },
  { id: 'cb', text: `# Create a TensorBoard callback\nlog_dir = "logs/profile/"\ntensorboard_callback = tf.keras.callbacks.TensorBoard(\n    log_dir=log_dir,\n    profile_batch='10,20' # Profile batches 10 through 20\n)` },
  { id: null, text: `` },
  { id: 'fit', text: `model.fit(\n    train_dataset,\n    epochs=5,\n    callbacks=[tensorboard_callback]\n)` },
];

const TB_NOTES = {
  imp: 'Nothing extra to install — the profiler is part of TensorFlow and writes into a TensorBoard log directory.',
  cb: "profile_batch='10,20' is the important detail. Batch 0 is always unrepresentative because of graph tracing and cuDNN autotuning, and profiling every batch would produce an unusable trace. A window in the middle of a run is what you want.",
  fit: 'The callback slots into a normal fit() call. Training proceeds as usual and the profiler records only inside the chosen window.',
};

const TB_TOOLS = {
  overview: {
    label: 'Overview Page',
    body: 'summary',
  },
  trace: {
    label: 'Trace Viewer',
    body: 'trace',
  },
  input: {
    label: 'Input Pipeline Analyzer',
    body: 'input',
  },
};

export function TensorBoardProfilerVisualizer() {
  const [tab, setTab] = useState('code');
  const [focus, setFocus] = useState('cb');
  const [tool, setTool] = useState('overview');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Profiling in TensorFlow</h3>
        <p className="text-gray-400 text-sm">A callback during fit(), then three tools in TensorBoard.</p>
      </div>

      <Tabs
        options={[
          { id: 'code', label: 'The callback' },
          { id: 'tools', label: 'The three tools' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'code' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-3 min-h-0">
          <CodeBlocks blocks={TB_BLOCKS} focus={focus} setFocus={setFocus} file="profile_callback.py" />
          <div className="min-h-0 overflow-auto custom-scroll">
            <NoteBox>{TB_NOTES[focus]}</NoteBox>
          </div>
        </div>
      )}

      {tab === 'tools' && (
        <div className="flex-1 overflow-auto custom-scroll">
          <div className="rounded-2xl border border-gray-700 bg-gray-900/70 overflow-hidden">
            <div className="flex gap-1 px-3 py-2 bg-gray-800/80 border-b border-gray-700">
              {Object.entries(TB_TOOLS).map(([id, v]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTool(id)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                    tool === id ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            <div className="p-4">
              {tool === 'overview' && (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-3">
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
                  <div className="rounded-lg border border-rose-400/50 bg-rose-500/15 px-3 py-2 text-xs text-rose-100">
                    ⚠ Your program is <strong>HIGHLY input-bound</strong> — 58.9% of the step is spent
                    waiting for data.
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                    The Overview Page gives a high-level summary and recommendations, and will often tell
                    you outright that the program is input-bound.
                  </p>
                </>
              )}

              {tool === 'trace' && (
                <>
                  <div className="space-y-2">
                    {[
                      { row: 'CPU · tf_data', blocks: [[2, 22], [30, 22], [58, 22]], color: 'bg-sky-500' },
                      { row: 'GPU · compute', blocks: [[24, 5], [52, 5], [80, 5]], color: 'bg-emerald-500' },
                    ].map((r) => (
                      <div key={r.row} className="flex items-center gap-2">
                        <span className="w-28 text-[10px] font-mono text-gray-400 shrink-0">{r.row}</span>
                        <div className="relative flex-1 h-7 rounded bg-gray-800">
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
                  <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                    Like the PyTorch trace, a timeline of every operation on CPU and GPU. The empty
                    stretches on the GPU row are the wasted capacity.
                  </p>
                </>
              )}

              {tool === 'input' && (
                <>
                  <div className="space-y-1.5">
                    {[
                      ['Reading files', 41, 'bg-rose-500'],
                      ['Preprocessing (map)', 34, 'bg-amber-500'],
                      ['Enqueuing to device', 9, 'bg-sky-500'],
                      ['Other', 16, 'bg-gray-600'],
                    ].map(([k, v, c]) => (
                      <div key={k} className="flex items-center gap-2">
                        <span className="w-36 text-[10px] text-gray-400 shrink-0">{k}</span>
                        <div className="flex-1 h-4 rounded bg-gray-800 overflow-hidden">
                          <div className={`h-full ${c}`} style={{ width: `${v}%` }} />
                        </div>
                        <span className="w-8 text-right text-[10px] font-mono text-gray-400">{v}%</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                    This one analyses the <span className="font-mono">tf.data</span> pipeline specifically
                    and attributes the wait to a stage — here, file reading. That points straight at a file
                    format change.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 12. Capstone: heal the trace ─────────────────────────────────────────── */

export function TraceHealVisualizer() {
  const [workers, setWorkers] = useState(false);
  const [cache, setCache] = useState(false);
  const [prefetch, setPrefetch] = useState(false);

  const read = cache ? 2 : 30;
  const prep = workers ? 15 : 60;
  const transfer = 10;
  const cpu = read + prep + transfer;
  const gpu = 40;
  const total = prefetch ? Math.max(cpu, gpu) : cpu + gpu;
  const idle = prefetch ? Math.max(0, total - gpu) : cpu;
  const idlePct = Math.round((idle / total) * 100);
  const speedup = 140 / total;

  const SCALE = 140;
  const cpuBlocks = prefetch
    ? [{ s: 0, d: cpu, label: 'prep N+1' }]
    : [{ s: 0, d: cpu, label: 'read · prep · copy' }];
  const gpuBlocks = prefetch
    ? [{ s: 0, d: gpu, label: 'train N' }]
    : [{ s: cpu, d: gpu, label: 'train' }];

  const Toggle = ({ on, set, label, sub }) => (
    <button
      type="button"
      onClick={() => set((v) => !v)}
      className={`flex-1 rounded-xl border-2 px-3 py-2 text-left transition ${
        on ? 'border-emerald-400 bg-emerald-500/20' : 'border-gray-700 bg-gray-900/60'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`w-3.5 h-3.5 rounded-full ${on ? 'bg-emerald-400' : 'bg-gray-700'}`}
        />
        <span className="text-[11px] font-bold text-white">{label}</span>
      </div>
      <div className="text-[9px] text-gray-400 mt-0.5">{sub}</div>
    </button>
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Heal the trace</h3>
        <p className="text-gray-400 text-sm">
          Switch on each technique and watch the idle gaps close for real.
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <Toggle on={workers} set={setWorkers} label="num_workers=8" sub="parallel preprocessing" />
        <Toggle on={cache} set={setCache} label=".cache()" sub="skip disk after epoch 1" />
        <Toggle on={prefetch} set={setPrefetch} label=".prefetch()" sub="overlap CPU with GPU" />
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
          one training step · same scale in both states
        </div>

        {[
          { label: 'CPU', blocks: cpuBlocks, color: 'bg-sky-600' },
          { label: 'GPU', blocks: gpuBlocks, color: 'bg-emerald-600' },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-2 mb-2">
            <span className="w-10 text-[10px] font-mono text-gray-400 shrink-0">{r.label}</span>
            <div className="relative flex-1 h-10 rounded-lg bg-rose-950/40 border border-gray-700 overflow-hidden">
              {r.blocks.map((b) => (
                <div
                  key={b.label}
                  className={`absolute top-1 bottom-1 rounded-sm ${r.color} flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500`}
                  style={{ left: `${(b.s / SCALE) * 100}%`, width: `${(b.d / SCALE) * 100}%` }}
                >
                  {b.d > 22 ? b.label : ''}
                </div>
              ))}
              {/* end-of-step marker */}
              <div
                className="absolute inset-y-0 w-0.5 bg-white/70 transition-all duration-500"
                style={{ left: `${(total / SCALE) * 100}%` }}
              />
            </div>
          </div>
        ))}
        <div className="flex justify-between text-[9px] font-mono text-gray-600 pl-12">
          <span>0 ms</span>
          <span>140 ms</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            ['Step time', `${total} ms`, 'text-white'],
            [
              'GPU idle',
              `${idlePct}%`,
              idlePct < 15 ? 'text-emerald-400' : idlePct < 45 ? 'text-amber-400' : 'text-rose-400',
            ],
            ['Speedup', `${speedup.toFixed(2)}×`, speedup > 2 ? 'text-emerald-400' : 'text-gray-300'],
          ].map(([k, v, cls]) => (
            <div key={k} className="rounded-xl border border-gray-700 bg-gray-900/60 px-3 py-2 text-center">
              <div className="text-[9px] uppercase text-gray-500">{k}</div>
              <div className={`text-lg font-bold ${cls}`}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <NoteBox tone={idlePct === 0 ? 'emerald' : idlePct < 45 ? 'amber' : 'rose'}>
          {!workers && !cache && !prefetch && (
            <>
              <strong className="text-white">The baseline.</strong> Read, preprocess, copy, then train —
              strictly one after another. The GPU is idle for 71% of every step.
            </>
          )}
          {(workers || cache) && !prefetch && (
            <>
              The CPU side got shorter, so the step got shorter — but the GPU is still waiting through all
              of it, because the work is still serial. Shortening the wait is not the same as removing it.
            </>
          )}
          {prefetch && (workers || cache) && idlePct > 0 && (
            <>
              <strong className="text-white">Now the two rows overlap.</strong> The step takes as long as
              the slower of the two, not their sum. There is still a little idle time — the CPU side is
              not quite fast enough to hide completely.
            </>
          )}
          {prefetch && idlePct === 0 && (
            <>
              <strong className="text-white">Zero idle time, {speedup.toFixed(1)}× faster.</strong> The
              entire input pipeline now hides behind the GPU step. The bottleneck has moved to the GPU,
              which is where you want it — from here, optimising the model is finally worth your time.
            </>
          )}
          {prefetch && !workers && !cache && (
            <>
              Prefetch alone overlaps the two, but the CPU side is still slower than the GPU step, so the
              GPU keeps waiting. Overlap only helps if the producer can roughly keep up — turn on the
              other two.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}
