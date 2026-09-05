import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Zap,
  Coffee,
  ChefHat,
  Factory,
  Sparkles,
} from 'lucide-react';

function StepBar({ step, total, playing, onPrev, onNext, onPlay, onReset, playLabel = 'Auto-Play' }) {
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
        {playing ? 'Pause' : playLabel}
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

/** CPU few-fat-cores vs GPU many-SMs, with clickable feature callouts */
export function CpuGpuArchVisualizer() {
  const [side, setSide] = useState('both');
  const [feature, setFeature] = useState('control');

  const cpuFeatures = [
    {
      id: 'control',
      label: 'Complex Control',
      detail:
        'Branch predictors and speculative execution keep one thread fast — even through if-else and irregular code.',
    },
    {
      id: 'cache',
      label: 'Large Caches',
      detail: 'L1 / L2 / L3 hide DRAM latency so a single core rarely waits on memory.',
    },
    {
      id: 'cores',
      label: 'Few Powerful Cores',
      detail: 'Typically 4–64 fat cores. Each can run a whole program, not just a multiply.',
    },
  ];

  const gpuFeatures = [
    {
      id: 'simt',
      label: 'SIMT Parallelism',
      detail:
        'Single Instruction, Multiple Threads: thousands of cores execute the same math on different data.',
    },
    {
      id: 'hbm',
      label: 'High-Bandwidth Memory',
      detail: 'GDDR6 or HBM sits next to the die so the cores are not starved of matrix tiles.',
    },
    {
      id: 'simple',
      label: 'Simple Control',
      detail: 'Little branching hardware. Best when every core does the same op, over and over.',
    },
  ];

  const features = side === 'gpu' ? gpuFeatures : cpuFeatures;
  const active = features.find((f) => f.id === feature) || features[0];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Two Ways to Cut Silicon</h3>
        <p className="text-gray-400 text-sm">
          A CPU is a few master chefs. A GPU is a kitchen assembly line.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {[
          { id: 'cpu', label: 'CPU Close-up' },
          { id: 'both', label: 'Side by Side' },
          { id: 'gpu', label: 'GPU Close-up' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setSide(t.id);
              setFeature(t.id === 'gpu' ? 'simt' : 'control');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              side === t.id ? 'bg-brand-blue text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        className={`grid gap-3 max-w-3xl mx-auto w-full ${
          side === 'both' ? 'md:grid-cols-2' : 'grid-cols-1 max-w-xl'
        }`}
      >
        {(side === 'cpu' || side === 'both') && (
          <div className="rounded-2xl border border-brand-blue/40 bg-slate-50 p-4 text-slate-900">
            <div className="text-center text-sm font-bold text-indigo-700 mb-3">CPU Architecture</div>
            <div className="rounded-lg bg-indigo-200 text-indigo-900 text-center text-xs font-bold py-2 px-3 mb-3">
              Sophisticated Control & Cache
            </div>
            <div className="flex justify-center gap-2 mb-1">
              {['↓', '↓', '↓', '↓'].map((a, i) => (
                <span key={i} className="w-14 text-center text-indigo-400 text-xs">
                  {a}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['Core 1', 'Core 2', 'Core …', 'Core N'].map((c) => (
                <div
                  key={c}
                  className="rounded-lg bg-sky-300 text-sky-950 text-[10px] font-bold text-center py-4"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}

        {(side === 'gpu' || side === 'both') && (
          <div className="rounded-2xl border border-brand-green/40 bg-slate-50 p-4 text-slate-900">
            <div className="text-center text-sm font-bold text-emerald-700 mb-3">GPU Architecture</div>
            <div className="rounded-lg bg-emerald-200 text-emerald-900 text-center text-xs font-bold py-2 px-3 mb-3">
              High-Bandwidth Memory
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {['SM', 'SM', '…', 'SM'].map((c, i) => (
                <div key={`${c}-${i}`} className="flex flex-col items-center">
                  <span className="text-emerald-400 text-xs mb-1">↓</span>
                  <div className="w-full rounded-lg bg-emerald-400 text-emerald-950 text-[10px] font-bold text-center py-2">
                    {c === '…' ? '…' : 'Streaming Multiprocessor'}
                  </div>
                  <span className="text-gray-400 text-xs my-1">↓</span>
                  <div className="w-full rounded-lg bg-gray-200 text-gray-600 text-[10px] font-bold text-center py-1.5">
                    Cores
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {features.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFeature(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
              feature === f.id
                ? 'bg-brand-purple/20 border-brand-purple text-violet-200'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-3 max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-900/70 p-3 text-center text-sm text-gray-300">
        <Sparkles className="w-4 h-4 inline mr-1 text-brand-orange" />
        {active.detail}
      </div>
    </div>
  );
}

/** Sequential CPU vs parallel GPU on C = A · B */
export function ParallelMatmulVisualizer() {
  const A = [
    [2, 1],
    [0, 3],
  ];
  const B = [
    [4, 1],
    [2, 5],
  ];
  const C = [
    [10, 7],
    [6, 15],
  ];
  const cells = [
    { r: 0, c: 0, kTerms: ['2×4', '1×2'] },
    { r: 0, c: 1, kTerms: ['2×1', '1×5'] },
    { r: 1, c: 0, kTerms: ['0×4', '3×2'] },
    { r: 1, c: 1, kTerms: ['0×1', '3×5'] },
  ];

  const [mode, setMode] = useState('cpu');
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(false);

  const cpuDone = Math.min(tick, 4);
  const gpuDone = mode === 'gpu' && tick > 0 ? 4 : 0;
  const revealed = mode === 'gpu' ? gpuDone : cpuDone;
  const focus = mode === 'cpu' ? Math.min(tick, 3) : 0;

  useEffect(() => {
    if (!playing) return undefined;
    const t = setInterval(() => {
      setTick((x) => {
        const cap = mode === 'gpu' ? 1 : 4;
        if (x >= cap) {
          setPlaying(false);
          return x;
        }
        return x + 1;
      });
    }, mode === 'gpu' ? 700 : 900);
    return () => clearInterval(t);
  }, [playing, mode]);

  const cellDone = (i) => i < revealed;
  const cellActive = (i) => mode === 'cpu' && tick === i && tick < 4;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">C = A · B is Embarrassingly Parallel</h3>
        <p className="text-gray-400 text-sm">
          Every C<sub>ij</sub> is an independent dot product. Watch a CPU walk them vs a GPU fire all four.
        </p>
      </div>

      <div className="rounded-2xl border border-cyan-900/40 bg-gray-950 p-4 text-center mb-3">
        <div className="font-serif italic text-lg text-slate-100">
          output = activation(
          <span className="text-brand-rose">weights</span>
          <span className="text-gray-500"> · </span>
          <span className="text-brand-rose">inputs</span>
          <span className="text-gray-500"> + </span>
          bias)
        </div>
        <p className="text-[11px] text-gray-500 mt-2">
          The red piece is one giant matrix multiply. That is the workload GPUs were born for.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-3">
        {[
          { id: 'cpu', label: 'CPU — one cell at a time' },
          { id: 'gpu', label: 'GPU — all cells at once' },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id);
              setTick(0);
              setPlaying(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              mode === m.id
                ? m.id === 'gpu'
                  ? 'bg-brand-green text-white'
                  : 'bg-brand-blue text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-start justify-center gap-4 mb-3">
        {[
          { name: 'A  weights', mat: A, color: 'text-brand-rose' },
          { name: 'B  inputs', mat: B, color: 'text-sky-300' },
          { name: 'C  result', mat: C, color: 'text-brand-green', isC: true },
        ].map((block) => (
          <div key={block.name} className="text-center">
            <div className={`text-[10px] uppercase tracking-wider mb-1 font-bold ${block.color}`}>
              {block.name}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {block.mat.flat().map((v, i) => {
                const done = block.isC ? cellDone(i) : true;
                const active = block.isC && cellActive(i);
                return (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-lg border flex items-center justify-center font-mono text-sm font-bold transition-all ${
                      active
                        ? 'border-brand-orange bg-brand-orange/20 text-white scale-110 shadow-[0_0_12px_#f59e0b]'
                        : done
                          ? 'border-gray-600 bg-gray-900 text-white'
                          : 'border-gray-800 bg-gray-950 text-gray-600'
                    }`}
                  >
                    {block.isC ? (done ? v : '?') : v}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-lg mx-auto w-full rounded-xl border border-gray-700 bg-black/40 p-3 text-center text-sm">
        {mode === 'gpu' && tick > 0 ? (
          <p className="text-brand-green">
            All four C<sub>ij</sub> computed in one wave. No cell waits on another.
          </p>
        ) : mode === 'cpu' && tick < 4 ? (
          <p className="text-sky-200">
            Computing C[{cells[focus].r}][{cells[focus].c}] = {cells[focus].kTerms.join(' + ')} ={' '}
            <span className="text-white font-mono">{C[cells[focus].r][cells[focus].c]}</span>
          </p>
        ) : (
          <p className="text-gray-400">
            Press Auto-Play. CPU needs 4 steps. GPU needs 1. Scale that to a 4096×4096 layer.
          </p>
        )}
      </div>

      <StepBar
        step={tick}
        total={mode === 'gpu' ? 2 : 5}
        playing={playing}
        onPrev={() => {
          setPlaying(false);
          setTick((x) => Math.max(0, x - 1));
        }}
        onNext={() => {
          setPlaying(false);
          setTick((x) => Math.min(mode === 'gpu' ? 1 : 4, x + 1));
        }}
        onPlay={() => setPlaying((p) => !p)}
        onReset={() => {
          setTick(0);
          setPlaying(false);
        }}
      />
    </div>
  );
}

const COMPARE_ROWS = [
  {
    feature: 'Primary Design',
    cpu: 'Low latency, serial processing',
    gpu: 'High throughput, parallel processing',
    visual: 'A CPU finishes one hard thought fast. A GPU finishes a million easy thoughts together.',
  },
  {
    feature: 'Core Count',
    cpu: 'Low (4–64), but very powerful',
    gpu: 'High (thousands), but simpler',
    visual: 'Eight fat cores vs a wall of tiny ones — same silicon budget, different bet.',
  },
  {
    feature: 'Best Use in ML',
    cpu: 'Data prep, control flow, small-model inference',
    gpu: 'Training deep models, large-scale inference',
    visual: 'CPU gets the data ready and runs Python. GPU eats the matrices.',
  },
  {
    feature: 'Memory',
    cpu: 'Shares main system RAM',
    gpu: 'Own high-bandwidth VRAM (HBM / GDDR)',
    visual: 'GPU memory is a private highway. CPU memory is a city street.',
  },
  {
    feature: 'Strengths',
    cpu: 'Complex logic, branching, task switching',
    gpu: 'Repetitive arithmetic on large blocks',
    visual: 'if-else loves a CPU. A·B loves a GPU.',
  },
  {
    feature: 'Weaknesses',
    cpu: 'Poor at massively parallel math',
    gpu: 'Inefficient at serial tasks and messy logic',
    visual: 'Put the wrong job on the wrong chip and you pay in time and money.',
  },
];

export function ComparisonTableVisualizer() {
  const [row, setRow] = useState(0);
  const [winner, setWinner] = useState(null);

  const jobs = [
    { id: 'tokenize', label: 'Tokenize a corpus', pick: 'cpu' },
    { id: 'train', label: 'Train a 7B model', pick: 'gpu' },
    { id: 'ifelse', label: 'Python training loop', pick: 'cpu' },
    { id: 'matmul', label: '4096×4096 matmul', pick: 'gpu' },
  ];

  return (
    <div className="flex flex-col w-full h-full p-3 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Pick a Feature — See the Split</h3>
        <p className="text-gray-400 text-sm">Click any row. Then try the “who runs this job?” chips.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-700 mb-3">
        <table className="w-full text-left text-xs md:text-sm">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="px-3 py-2 font-bold">Feature</th>
              <th className="px-3 py-2 font-bold text-brand-blue">CPU</th>
              <th className="px-3 py-2 font-bold text-brand-green">GPU</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((r, i) => (
              <tr
                key={r.feature}
                onClick={() => setRow(i)}
                className={`cursor-pointer border-t border-gray-800 transition ${
                  i === row ? 'bg-brand-purple/15' : 'hover:bg-gray-900/80'
                }`}
              >
                <td className="px-3 py-2 font-semibold text-white">{r.feature}</td>
                <td className="px-3 py-2 text-gray-300">{r.cpu}</td>
                <td className="px-3 py-2 text-gray-300">{r.gpu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-brand-purple/40 bg-brand-purple/10 p-3 text-sm text-violet-100 mb-3">
        {COMPARE_ROWS[row].visual}
      </div>

      <div className="text-[10px] uppercase tracking-wider text-gray-500 text-center mb-2">
        Who should run this job?
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-2">
        {jobs.map((j) => (
          <button
            key={j.id}
            type="button"
            onClick={() => setWinner(j)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
              winner?.id === j.id
                ? 'border-brand-orange text-brand-orange bg-brand-orange/10'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {j.label}
          </button>
        ))}
      </div>
      {winner && (
        <div
          className={`text-center text-sm font-semibold ${
            winner.pick === 'cpu' ? 'text-brand-blue' : 'text-brand-green'
          }`}
        >
          {winner.pick === 'cpu' ? '→ CPU' : '→ GPU'} — {winner.label}
        </div>
      )}
    </div>
  );
}

/** Kitchen analogy: CPU appliance vs GPU line vs ASIC grinder */
export function AsicKitchenVisualizer() {
  const [pick, setPick] = useState('asic');

  const cards = [
    {
      id: 'cpu',
      icon: ChefHat,
      title: 'CPU — programmable kitchen',
      color: 'border-brand-blue text-brand-blue',
      glow: 'bg-brand-blue/10',
      body: 'Can cook anything: parse JSON, run Python, branch on if-else. Flexible, not the fastest at one recipe.',
    },
    {
      id: 'gpu',
      icon: Factory,
      title: 'GPU — assembly line',
      color: 'border-brand-green text-brand-green',
      glow: 'bg-brand-green/10',
      body: 'Thousands of cooks, one motion. Brilliant at repeating the same chop (matmul) across a mountain of onions.',
    },
    {
      id: 'asic',
      icon: Coffee,
      title: 'ASIC — coffee grinder',
      color: 'border-brand-orange text-brand-orange',
      glow: 'bg-brand-orange/10',
      body: 'Does one job: matrix-heavy AI math. Faster and lower watts than a GPU — cannot render a UI or run arbitrary Python.',
    },
  ];

  const active = cards.find((c) => c.id === pick);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-white mb-1">What Is an ASIC?</h3>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Application-Specific Integrated Circuit — silicon carved for one workload. Google’s TPU is the
          famous AI ASIC.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-3 max-w-3xl mx-auto w-full mb-4">
        {cards.map((c) => {
          const Icon = c.icon;
          const on = pick === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setPick(c.id)}
              className={`rounded-2xl border-2 p-4 text-left transition ${
                on ? `${c.color} ${c.glow} scale-[1.02]` : 'border-gray-700 bg-gray-900/50 text-gray-400'
              }`}
            >
              <Icon className={`w-8 h-8 mb-2 ${on ? '' : 'opacity-40'}`} />
              <div className="font-bold text-sm text-white mb-1">{c.title}</div>
              <div className="text-xs leading-relaxed">{c.body}</div>
            </button>
          );
        })}
      </div>

      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-4">
        <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Why Google built a TPU</div>
        <p className="text-sm text-gray-300">
          {active.id === 'asic' ? (
            <>
              A TPU is wired for TensorFlow / JAX ops. Its heart is a{' '}
              <strong className="text-white">systolic array</strong> of multiply-accumulate units — not a
              general CPU, not a graphics GPU.
            </>
          ) : (
            active.body
          )}
        </p>
      </div>
    </div>
  );
}

/** 2×2 output-stationary systolic array: W from left, X from top, MAC in each PE */
export function SystolicArrayVisualizer() {
  const W = [
    [2, 1],
    [0, 3],
  ];
  const X = [
    [4, 1],
    [2, 5],
  ];
  const Ctrue = [
    [10, 7],
    [6, 15],
  ];

  const frames = [
    {
      title: 'Load nothing yet',
      narrate: 'Two input streams: weights arrive from the left, activations from the top. Each PE will own one Cij.',
      pe: [
        [{ acc: 0, w: null, x: null, mac: null }, { acc: 0, w: null, x: null, mac: null }],
        [{ acc: 0, w: null, x: null, mac: null }, { acc: 0, w: null, x: null, mac: null }],
      ],
    },
    {
      title: 'Clock 1 — first pair meets at PE00',
      narrate: 'W₀₀=2 enters from the left. X₀₀=4 drops from the top. PE00 does 2 × 4 and keeps 8.',
      pe: [
        [{ acc: 8, w: 2, x: 4, mac: '2×4' }, { acc: 0, w: null, x: null, mac: null }],
        [{ acc: 0, w: null, x: null, mac: null }, { acc: 0, w: null, x: null, mac: null }],
      ],
    },
    {
      title: 'Clock 2 — the wave spreads',
      narrate:
        'W and X pass to neighbors. PE00 gets the next pair (1 and 2): 8 + 1×2 = 10. PE01 and PE10 start their first MAC.',
      pe: [
        [{ acc: 10, w: 1, x: 2, mac: '1×2' }, { acc: 2, w: 2, x: 1, mac: '2×1' }],
        [{ acc: 0, w: 0, x: 4, mac: '0×4' }, { acc: 0, w: null, x: null, mac: null }],
      ],
    },
    {
      title: 'Clock 3 — PE00 is done',
      narrate: 'C₀₀ = 10 is finished. PE01: 2 + 1×5 = 7. PE10: 0 + 3×2 = 6. PE11 starts 0×1.',
      pe: [
        [{ acc: 10, w: null, x: null, mac: 'done', done: true }, { acc: 7, w: 1, x: 5, mac: '1×5' }],
        [{ acc: 6, w: 3, x: 2, mac: '3×2' }, { acc: 0, w: 0, x: 1, mac: '0×1' }],
      ],
    },
    {
      title: 'Clock 4 — last MAC',
      narrate: 'PE11: 0 + 3×5 = 15. The whole C matrix is in the array. No extra trip to memory per multiply.',
      pe: [
        [{ acc: 10, w: null, x: null, mac: 'done', done: true }, { acc: 7, w: null, x: null, mac: 'done', done: true }],
        [{ acc: 6, w: null, x: null, mac: 'done', done: true }, { acc: 15, w: 3, x: 5, mac: '3×5' }],
      ],
    },
    {
      title: 'Result drains out',
      narrate: 'C lives in the PEs (output-stationary). Read it once. That is why systolic arrays crush memory traffic.',
      pe: [
        [{ acc: 10, w: null, x: null, mac: 'done', done: true }, { acc: 7, w: null, x: null, mac: 'done', done: true }],
        [{ acc: 6, w: null, x: null, mac: 'done', done: true }, { acc: 15, w: null, x: null, mac: 'done', done: true }],
      ],
    },
  ];

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [focus, setFocus] = useState({ r: 0, c: 0 });

  useEffect(() => {
    if (!playing) return undefined;
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= frames.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1400);
    return () => clearInterval(t);
  }, [playing]);

  const frame = frames[step];
  const cell = frame.pe[focus.r][focus.c];

  return (
    <div className="flex flex-col w-full h-full p-3 overflow-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">Systolic Array — the TPU Heartbeat</h3>
        <p className="text-gray-400 text-xs">
          Data pulses through neighbors like blood through the heart. Each PE only does MAC: acc += w × x
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-2">
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700">
          {frame.title}
        </span>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700">
          Step {step + 1} / {frames.length}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 mb-3">
        <div className="text-center">
          <div className="text-[10px] text-brand-rose font-bold mb-1">W from the side →</div>
          <div className="grid grid-cols-2 gap-1">
            {W.flat().map((v, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded bg-brand-rose/20 border border-brand-rose/40 text-brand-rose font-mono text-xs flex items-center justify-center"
              >
                {v}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="text-[10px] text-sky-300 font-bold text-center mb-1">X activations ↓</div>
          <div className="grid grid-cols-2 gap-2">
            {X[0].map((_, c) => (
              <div key={c} className="text-center text-[10px] text-sky-400 font-mono">
                {X[0][c]}, {X[1][c]}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {frame.pe.map((row, r) =>
              row.map((pe, c) => {
                const on = focus.r === r && focus.c === c;
                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => setFocus({ r, c })}
                    className={`w-[4.6rem] h-[4.6rem] rounded-xl border-2 flex flex-col items-center justify-center transition ${
                      pe.done
                        ? 'border-brand-green bg-brand-green/20 text-brand-green'
                        : pe.mac
                          ? 'border-brand-orange bg-brand-orange/15 text-white shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                          : 'border-sky-700 bg-sky-950/40 text-sky-200'
                    } ${on ? 'ring-2 ring-white/70' : ''}`}
                  >
                    <span className="text-[9px] uppercase tracking-wider opacity-70">PE{r}{c}</span>
                    <span className="font-mono text-sm font-bold">{pe.acc}</span>
                    <span className="text-[9px] font-mono text-gray-400">
                      {pe.mac && pe.mac !== 'done' ? pe.mac : pe.done ? 'C ready' : 'idle'}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="text-center">
          <div className="text-[10px] text-brand-green font-bold mb-1">C target</div>
          <div className="grid grid-cols-2 gap-1">
            {Ctrue.flat().map((v, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded bg-brand-green/15 border border-brand-green/40 text-brand-green font-mono text-xs flex items-center justify-center"
              >
                {v}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto w-full rounded-xl bg-gray-950 border border-gray-700 p-3 text-center mb-1">
        <div className="font-mono text-sm text-cyan-200 mb-1">
          acc ← acc + w × x
          {cell.mac && cell.mac !== 'done' ? (
            <span className="text-brand-orange">
              {'  '}({cell.w} × {cell.x} → acc = {cell.acc})
            </span>
          ) : null}
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">{frame.narrate}</p>
        <p className="text-[11px] text-gray-500 mt-1">
          Click a PE. Data is reused by neighbors instead of refetching from memory every multiply.
        </p>
      </div>

      <StepBar
        step={step}
        total={frames.length}
        playing={playing}
        onPrev={() => {
          setPlaying(false);
          setStep((s) => Math.max(0, s - 1));
        }}
        onNext={() => {
          setPlaying(false);
          setStep((s) => Math.min(frames.length - 1, s + 1));
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

const CHIPS = [
  {
    id: 'tpu',
    name: 'Google TPU',
    tag: 'Systolic array ASIC',
    color: 'border-brand-orange text-brand-orange',
    blurb:
      'Built for TensorFlow / JAX. A large 2D systolic array of MAC units. Not a GPU — it will not run arbitrary CUDA or a desktop OS.',
  },
  {
    id: 'trainium',
    name: 'AWS Trainium',
    tag: 'Training ASIC',
    color: 'border-brand-blue text-brand-blue',
    blurb: 'Amazon’s custom chip for training at cloud scale. Alternative to renting only NVIDIA GPUs.',
  },
  {
    id: 'inferentia',
    name: 'AWS Inferentia',
    tag: 'Inference ASIC',
    color: 'border-sky-400 text-sky-400',
    blurb: 'Sibling of Trainium, tuned for serving: high throughput, low cost per token / request.',
  },
  {
    id: 'cerebras',
    name: 'Cerebras',
    tag: 'Wafer-scale engine',
    color: 'border-brand-purple text-brand-purple',
    blurb: 'One giant chip the size of a wafer — keep a huge model on a single die to cut chip-to-chip hops.',
  },
  {
    id: 'sambanova',
    name: 'SambaNova',
    tag: 'Dataflow ASIC',
    color: 'border-fuchsia-400 text-fuchsia-400',
    blurb: 'Reconfigurable dataflow: the graph of the model is mapped onto the silicon, not a generic kernel launch.',
  },
  {
    id: 'groq',
    name: 'Groq',
    tag: 'Deterministic LPU',
    color: 'border-brand-green text-brand-green',
    blurb: 'Language Processing Unit — compiler-scheduled, no caches guessing. Famous for very low, predictable latency.',
  },
];

export function EcosystemVisualizer() {
  const [chip, setChip] = useState('tpu');
  const active = CHIPS.find((c) => c.id === chip);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">A Growing Accelerator Zoo</h3>
        <p className="text-gray-400 text-sm">Google started the AI-ASIC wave. Click a chip.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl mx-auto w-full mb-4">
        {CHIPS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setChip(c.id)}
            className={`rounded-xl border-2 p-3 text-left transition ${
              chip === c.id ? `${c.color} bg-white/5` : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            <div className="font-bold text-sm text-white">{c.name}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1 opacity-80">{c.tag}</div>
          </button>
        ))}
      </div>

      <div className={`max-w-xl mx-auto w-full rounded-2xl border-2 p-4 ${active.color} bg-gray-950`}>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5" />
          <span className="font-bold text-white">{active.name}</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{active.blurb}</p>
        <p className="text-xs text-gray-500 mt-3">
          Strategic fork: stay on GPUs (software, talent, flexibility) or bet on custom silicon (watts, cost at
          scale, lock-in).
        </p>
      </div>
    </div>
  );
}

const PROCESSORS = [
  {
    id: 'cpu',
    name: 'CPU',
    ppw: 1,
    flex: 10,
    bar: 'bg-sky-400',
    note: 'Highest flexibility, lowest parallel performance. Runs the OS, Python, and messy control flow.',
  },
  {
    id: 'gpu',
    name: 'GPU',
    ppw: 4.5,
    flex: 6,
    bar: 'bg-teal-400',
    note: 'The industry default: programmable enough for new models, fast enough for most training.',
  },
  {
    id: 'tpu',
    name: 'TPU / ASIC',
    ppw: 10,
    flex: 2,
    bar: 'bg-lime-400',
    note: 'Highest TOPS-per-watt on its pet ops (matmul in bfloat16 / INT8). Will not run arbitrary code.',
  },
];

export function FlexibilityTradeoffVisualizer() {
  const [pick, setPick] = useState('tpu');
  const [showChart, setShowChart] = useState(true);
  const active = PROCESSORS.find((p) => p.id === pick);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Performance per Watt vs Flexibility</h3>
        <p className="text-gray-400 text-sm">Specialization buys TOPS. It spends generality.</p>
      </div>

      <div className="flex justify-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setShowChart(true)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            showChart ? 'bg-brand-blue text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          TOPS / watt
        </button>
        <button
          type="button"
          onClick={() => setShowChart(false)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            !showChart ? 'bg-brand-blue text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          Flexibility slider
        </button>
      </div>

      {showChart ? (
        <div className="max-w-md mx-auto w-full rounded-2xl bg-white p-4 mb-3">
          <div className="text-center text-xs font-bold text-slate-700 mb-3">
            Relative Performance per Watt for AI Tasks
          </div>
          <div className="flex items-end justify-around h-44 border-b border-l border-slate-300 px-4">
            {PROCESSORS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPick(p.id)}
                className="flex flex-col items-center gap-1 w-16"
              >
                <span className="text-[10px] font-mono text-slate-500">{p.ppw}×</span>
                <div
                  className={`w-10 rounded-t ${p.bar} transition-all ${
                    pick === p.id ? 'ring-2 ring-slate-800' : 'opacity-80'
                  }`}
                  style={{ height: `${p.ppw * 12}px` }}
                />
                <span className="text-[11px] font-bold text-slate-800">{p.name}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 text-center mt-2">
            Normalized matrix-heavy AI work. Click a bar.
          </p>
        </div>
      ) : (
        <div className="max-w-md mx-auto w-full mb-3">
          <div className="relative h-3 rounded-full bg-gradient-to-r from-sky-400 via-teal-400 to-lime-400 mb-6">
            {PROCESSORS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPick(p.id)}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white ${
                  p.bar
                } ${pick === p.id ? 'scale-150' : ''}`}
                style={{ left: `${((10 - p.flex) / 8) * 100}%` }}
                title={p.name}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-500">
            <span>Flexible, general</span>
            <span>Specialized, efficient</span>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-2 mb-3">
        {PROCESSORS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPick(p.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              pick === p.id ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="max-w-xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-4 text-sm text-gray-300">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-4 h-4 text-gray-500" />
          <span className="font-bold text-white">{active.name}</span>
          <span className="text-[10px] font-mono text-gray-500">
            ~{active.ppw}× perf/W · flex {active.flex}/10
          </span>
        </div>
        <p>{active.note}</p>
        {pick === 'tpu' && (
          <p className="mt-2 text-xs">
            Optimized number formats:{' '}
            <span className="text-brand-rose font-mono font-bold">bfloat16</span> and{' '}
            <span className="text-brand-rose font-mono font-bold">INT8</span> — not full IEEE float64.
          </p>
        )}
      </div>
    </div>
  );
}

