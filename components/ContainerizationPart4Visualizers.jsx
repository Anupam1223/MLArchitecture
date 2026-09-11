import React, { useState } from 'react';
import {
  Box,
  Zap,
  RefreshCw,
  Share2,
  Globe,
  Cpu,
  AlertTriangle,
  CheckCircle,
  User,
  Terminal,
} from 'lucide-react';

function Tabs({ options, value, onChange, accent = 'bg-sky-600' }) {
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

function Nav({ step, max, onBack, onNext, label }) {
  return (
    <div className="flex justify-center items-center gap-2 mt-3">
      <button
        type="button"
        disabled={step === 0}
        onClick={onBack}
        className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 disabled:opacity-30"
      >
        ← Back
      </button>
      <span className="text-[10px] text-gray-500 font-mono min-w-[4rem] text-center">
        {label || `${step + 1} / ${max + 1}`}
      </span>
      <button
        type="button"
        disabled={step >= max}
        onClick={onNext}
        className="px-3 py-1.5 rounded-lg bg-sky-600 text-xs font-bold text-white disabled:opacity-30"
      >
        Next →
      </button>
    </div>
  );
}

function Token({ children, tone = 'amber' }) {
  const map = {
    amber: 'bg-amber-400 text-amber-950 border-amber-200',
    sky: 'bg-sky-400 text-sky-950 border-sky-200',
    rose: 'bg-rose-400 text-rose-950 border-rose-200',
    emerald: 'bg-emerald-400 text-emerald-950 border-emerald-200',
    violet: 'bg-violet-400 text-violet-950 border-violet-200',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold border shadow ${map[tone]}`}
    >
      {children}
    </span>
  );
}

/* ── 1. Why Kubeflow: you are the glue vs Kubeflow is the glue ───────────── */

const STAGES = [
  { id: 'ingest', label: 'Ingest', short: 'raw data' },
  { id: 'prep', label: 'Preprocess', short: 'clean' },
  { id: 'train', label: 'Train', short: 'model' },
  { id: 'eval', label: 'Evaluate', short: 'score' },
  { id: 'deploy', label: 'Deploy', short: 'API' },
];

export function WhyKubeflowVisualizer() {
  const [mode, setMode] = useState('manual');
  const [tick, setTick] = useState(0);

  const broken = mode === 'manual' && (tick === 2 || tick === 3);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">You vs the orchestrator</h3>
        <p className="text-gray-400 text-sm">
          An ML project is five factories. Who carries the dataset between them?
        </p>
      </div>

      <Tabs
        options={[
          { id: 'manual', label: 'You + kubectl' },
          { id: 'kubeflow', label: 'Kubeflow Pipelines' },
        ]}
        value={mode}
        onChange={(id) => {
          setMode(id);
          setTick(0);
        }}
        accent={mode === 'manual' ? 'bg-rose-600' : 'bg-sky-600'}
      />

      <div className="max-w-xl mx-auto w-full">
        <div className="flex justify-center mb-3">
          <div className="rounded-2xl border border-violet-400/40 bg-violet-500/10 px-4 py-2 flex items-center gap-2">
            <User className="w-4 h-4 text-violet-300" />
            <span className="text-xs font-bold text-violet-100">ML engineer</span>
            {mode === 'manual' ? (
              <span className="text-[10px] text-rose-300 flex items-center gap-1">
                <Terminal className="w-3 h-3" /> typing kubectl for every hop
              </span>
            ) : (
              <span className="text-[10px] text-sky-300">writes one Python pipeline</span>
            )}
          </div>
        </div>

        {mode === 'manual' ? (
          <div className="relative rounded-2xl border border-rose-500/40 bg-rose-500/5 p-4">
            <div className="flex items-stretch justify-between gap-1">
              {STAGES.map((s, i) => {
                const here = tick === i;
                const dropped = broken && i === 3;
                return (
                  <div key={s.id} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-full rounded-xl border-2 px-1 py-3 text-center min-h-[4.5rem] flex flex-col items-center justify-center transition ${
                        dropped
                          ? 'border-rose-500 bg-rose-500/20 opacity-40'
                          : here
                            ? 'border-amber-400 bg-amber-500/20 scale-105'
                            : 'border-gray-600 bg-gray-900/80'
                      }`}
                    >
                      <Box className="w-4 h-4 text-gray-400 mb-1" />
                      <div className="text-[10px] font-bold text-white leading-tight">{s.label}</div>
                      {dropped && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-1" />}
                    </div>
                    {i < STAGES.length - 1 && (
                      <div className="hidden" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="relative h-10 mt-2">
              <div className="absolute inset-x-4 top-4 h-0.5 bg-rose-500/30" />
              {tick < 5 && (
                <div
                  className="absolute top-1 transition-all duration-500"
                  style={{ left: `calc(${(tick / 4) * 88}% + 4%)` }}
                >
                  <Token tone={broken ? 'rose' : 'amber'}>{broken ? 'LOST' : STAGES[tick].short}</Token>
                </div>
              )}
            </div>

            <p className="text-xs text-center text-rose-200 leading-relaxed mt-1">
              {broken
                ? 'Eval Pod crashed — you must kubectl again. The hand-off is you.'
                : 'Each hop is a separate apply. Miss one, the next stage has no input.'}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-sky-400/40 bg-sky-500/5 p-4 space-y-3">
            <div className="rounded-xl border-2 border-sky-400 bg-sky-500/15 px-3 py-2 text-center">
              <div className="text-sm font-bold text-sky-100">Kubeflow Pipelines</div>
              <div className="text-[10px] text-sky-200/80">the conveyor — not a replacement for Kubernetes</div>
            </div>

            <div className="flex items-stretch justify-between gap-1 relative">
              {STAGES.map((s, i) => {
                const here = tick === i;
                const done = tick > i;
                return (
                  <div
                    key={s.id}
                    className={`flex-1 rounded-xl border-2 px-1 py-3 text-center min-h-[4.5rem] flex flex-col items-center justify-center transition ${
                      here
                        ? 'border-sky-300 bg-sky-400 text-slate-900 scale-105 shadow-lg shadow-sky-500/20'
                        : done
                          ? 'border-emerald-400/50 bg-emerald-500/15'
                          : 'border-gray-600 bg-gray-900/80'
                    }`}
                  >
                    <Box className={`w-4 h-4 mb-1 ${here ? 'text-slate-800' : 'text-gray-400'}`} />
                    <div className={`text-[10px] font-bold leading-tight ${here ? 'text-slate-900' : 'text-white'}`}>
                      {s.label}
                    </div>
                    {done && <CheckCircle className="w-3 h-3 text-emerald-400 mt-1" />}
                  </div>
                );
              })}
            </div>

            <div className="relative h-8">
              <div className="absolute inset-x-4 top-3 h-0.5 bg-sky-400/50" />
              {tick < 5 && (
                <div
                  className="absolute top-0 transition-all duration-500"
                  style={{ left: `calc(${(tick / 4) * 88}% + 4%)` }}
                >
                  <Token tone="sky">{STAGES[tick].short}</Token>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-center text-[10px] text-violet-200">
              sits on Kubernetes — containers, GPUs, Services still do the running
            </div>
          </div>
        )}

        <Nav
          step={tick}
          max={4}
          onBack={() => setTick((t) => Math.max(0, t - 1))}
          onNext={() => setTick((t) => Math.min(4, t + 1))}
          label={STAGES[tick].label}
        />
      </div>
    </div>
  );
}

/* ── 2. Component = function with ports; DAG = wait vs parallel ──────────── */

export function KubeflowConceptsVisualizer() {
  const [view, setView] = useState('component');
  const [phase, setPhase] = useState(0);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">A pipeline is a graph of functions</h3>
        <p className="text-gray-400 text-sm">Each box is a container. Edges are data, not just arrows.</p>
      </div>

      <Tabs
        options={[
          { id: 'component', label: 'What is a component?' },
          { id: 'dag', label: 'What is a DAG?' },
        ]}
        value={view}
        onChange={(id) => {
          setView(id);
          setPhase(0);
        }}
        accent="bg-violet-600"
      />

      <div className="max-w-lg mx-auto w-full">
        {view === 'component' && (
          <div className="space-y-3">
            <p className="text-[11px] text-center text-gray-400">
              Think of a typed function: stuff goes in a port, work happens inside a container, stuff
              comes out a port.
            </p>

            <div className="flex items-center justify-center gap-2">
              <div
                className={`transition ${phase >= 1 ? 'opacity-100' : 'opacity-30'} flex flex-col items-center`}
              >
                <Token tone="amber">raw.csv</Token>
                <div className="text-[8px] text-gray-500 mt-1">input</div>
              </div>

              <div className="text-amber-400 font-bold text-lg">→</div>

              <div
                className={`relative rounded-2xl border-2 px-5 py-4 min-w-[10rem] text-center transition ${
                  phase >= 2
                    ? 'border-violet-300 bg-violet-500/30 shadow-lg shadow-violet-500/20'
                    : 'border-violet-400/50 bg-violet-500/10'
                }`}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-bold bg-violet-600 text-white px-1.5 py-0.5 rounded">
                  container
                </div>
                <Box className="w-6 h-6 mx-auto text-violet-200 mb-1" />
                <div className="text-xs font-bold text-white">preprocess_data</div>
                <div className="text-[9px] text-violet-200/80 mt-0.5">python:3.9 + pandas</div>
                {phase >= 2 && (
                  <div className="text-[9px] text-amber-200 mt-1 font-bold animate-pulse">working… dropna()</div>
                )}
              </div>

              <div className="text-emerald-400 font-bold text-lg">→</div>

              <div
                className={`transition ${phase >= 3 ? 'opacity-100 scale-110' : 'opacity-20'} flex flex-col items-center`}
              >
                <Token tone="emerald">dataset.parquet</Token>
                <div className="text-[8px] text-gray-500 mt-1">output</div>
              </div>
            </div>

            <p className="text-xs text-center text-gray-300 leading-relaxed">
              {phase === 0 && 'A component is one step — isolated like a function with typed I/O.'}
              {phase === 1 && 'Input arrives: a path to raw data (strongly typed).'}
              {phase === 2 && 'Inside its own container it cleans the data — its own Python & libraries.'}
              {phase === 3 && 'Output is an artifact. The next component can take this as an argument.'}
            </p>

            <Nav
              step={phase}
              max={3}
              onBack={() => setPhase((p) => Math.max(0, p - 1))}
              onNext={() => setPhase((p) => Math.min(3, p + 1))}
            />
          </div>
        )}

        {view === 'dag' && (
          <div className="space-y-3">
            <p className="text-[11px] text-center text-gray-400">
              Directed + Acyclic = arrows go one way, no loops. Independent branches can run at the
              same time.
            </p>

            <svg viewBox="0 0 360 260" className="w-full h-[240px]">
              <defs>
                <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#7dd3fc" />
                </marker>
              </defs>

              {/* ingest */}
              <rect x="130" y="8" width="100" height="36" rx="18" fill="#0ea5e9" />
              <text x="180" y="31" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">
                Ingest
              </text>

              <line x1="155" y1="44" x2="80" y2="78" stroke="#7dd3fc" strokeWidth="2" markerEnd="url(#arr)" />
              <line x1="205" y1="44" x2="280" y2="78" stroke="#7dd3fc" strokeWidth="2" markerEnd="url(#arr)" />

              {/* parallel */}
              <rect
                x="20"
                y="82"
                width="120"
                height="40"
                rx="18"
                fill={phase >= 1 ? '#38bdf8' : '#1e293b'}
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <text x="80" y="107" textAnchor="middle" fill={phase >= 1 ? '#0f172a' : '#e2e8f0'} fontSize="11" fontWeight="700">
                Preprocess
              </text>
              {phase >= 1 && phase < 2 && (
                <text x="80" y="138" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="700">
                  running
                </text>
              )}

              <rect
                x="220"
                y="82"
                width="120"
                height="40"
                rx="18"
                fill={phase >= 1 ? '#38bdf8' : '#1e293b'}
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <text x="280" y="107" textAnchor="middle" fill={phase >= 1 ? '#0f172a' : '#e2e8f0'} fontSize="11" fontWeight="700">
                Features
              </text>
              {phase >= 1 && phase < 2 && (
                <text x="280" y="138" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="700">
                  running ∥
                </text>
              )}

              <line x1="80" y1="122" x2="155" y2="168" stroke="#7dd3fc" strokeWidth="2" markerEnd="url(#arr)" />
              <line x1="280" y1="122" x2="205" y2="168" stroke="#7dd3fc" strokeWidth="2" markerEnd="url(#arr)" />

              <rect
                x="130"
                y="172"
                width="100"
                height="36"
                rx="18"
                fill={phase >= 2 ? '#34d399' : '#1e293b'}
                stroke="#34d399"
                strokeWidth="2"
              />
              <text x="180" y="195" textAnchor="middle" fill={phase >= 2 ? '#064e3b' : '#e2e8f0'} fontSize="12" fontWeight="700">
                Train
              </text>
              {phase < 2 && (
                <text x="180" y="228" textAnchor="middle" fill="#94a3b8" fontSize="9">
                  waits for both ↑
                </text>
              )}
              {phase >= 2 && (
                <text x="180" y="228" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="700">
                  dependencies met
                </text>
              )}
            </svg>

            <p className="text-xs text-center text-gray-300 leading-relaxed">
              {phase === 0 && 'Ingest finishes first. Two children are independent — they can start together.'}
              {phase === 1 && 'Preprocess and Features run in parallel. Train is blocked until both outputs exist.'}
              {phase === 2 && 'Train starts only when every incoming edge is satisfied. No cycles allowed.'}
            </p>

            <Nav
              step={phase}
              max={2}
              onBack={() => setPhase((p) => Math.max(0, p - 1))}
              onNext={() => setPhase((p) => Math.min(2, p + 1))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 3. Isolation: two containers, different stacks, artifact between them ─ */

export function ComponentsVisualizer() {
  const [phase, setPhase] = useState(0);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">Why each step is its own container</h3>
        <p className="text-gray-400 text-sm">
          Different Python, different libraries — they never share a process.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`rounded-2xl border-2 p-3 transition ${
              phase === 1 ? 'border-sky-300 bg-sky-500/20 scale-[1.02]' : 'border-sky-400/40 bg-sky-500/10'
            }`}
          >
            <div className="text-[9px] font-bold text-sky-300 uppercase mb-1">Container A</div>
            <div className="text-sm font-bold text-white mb-2">preprocess_data</div>
            <div className="space-y-1.5">
              <div className="rounded-lg bg-black/40 border border-sky-400/30 px-2 py-1.5 text-[10px]">
                <span className="text-gray-500">image </span>
                <span className="font-mono text-sky-200">python:3.9</span>
              </div>
              <div className="rounded-lg bg-black/40 border border-sky-400/30 px-2 py-1.5 text-[10px]">
                <span className="text-gray-500">libs </span>
                <span className="font-mono text-emerald-300">pandas==1.3.5</span>
              </div>
            </div>
            <div className="mt-2 flex justify-center gap-1">
              <span className="w-6 h-6 rounded bg-sky-700/50 border border-sky-400/40 text-[8px] flex items-center justify-center text-sky-100">
                3.9
              </span>
              <span className="w-6 h-6 rounded bg-emerald-700/40 border border-emerald-400/40 text-[8px] flex items-center justify-center text-emerald-100">
                pd
              </span>
            </div>
          </div>

          <div
            className={`rounded-2xl border-2 p-3 transition ${
              phase === 3 ? 'border-violet-300 bg-violet-500/20 scale-[1.02]' : 'border-violet-400/40 bg-violet-500/10'
            }`}
          >
            <div className="text-[9px] font-bold text-violet-300 uppercase mb-1">Container B</div>
            <div className="text-sm font-bold text-white mb-2">train_model</div>
            <div className="space-y-1.5">
              <div className="rounded-lg bg-black/40 border border-violet-400/30 px-2 py-1.5 text-[10px]">
                <span className="text-gray-500">image </span>
                <span className="font-mono text-violet-200">tensorflow:2.8</span>
              </div>
              <div className="rounded-lg bg-black/40 border border-violet-400/30 px-2 py-1.5 text-[10px]">
                <span className="text-gray-500">libs </span>
                <span className="font-mono text-amber-300">CUDA + TF</span>
              </div>
            </div>
            <div className="mt-2 flex justify-center gap-1">
              <span className="w-6 h-6 rounded bg-violet-700/50 border border-violet-400/40 text-[8px] flex items-center justify-center text-violet-100">
                3.8
              </span>
              <span className="w-6 h-6 rounded bg-amber-700/40 border border-amber-400/40 text-[8px] flex items-center justify-center text-amber-100">
                TF
              </span>
            </div>
          </div>
        </div>

        <div className="relative h-14 flex items-center justify-center">
          <div className="absolute inset-x-16 h-0.5 bg-gradient-to-r from-sky-400 to-violet-400" />
          <div
            className="absolute transition-all duration-500"
            style={{
              left: phase <= 1 ? '12%' : phase === 2 ? '42%' : '70%',
              opacity: phase === 0 ? 0.3 : 1,
            }}
          >
            <Token tone="emerald">Dataset artifact</Token>
          </div>
        </div>

        <p className="text-xs text-center text-gray-300 leading-relaxed min-h-[2.5rem]">
          {phase === 0 &&
            'One giant image would force one Python version. These two stacks would collide.'}
          {phase === 1 &&
            'Preprocess runs in python:3.9 + pandas — TensorFlow is not even installed here.'}
          {phase === 2 &&
            'The only thing that crosses the wall is an artifact (a Dataset path), not libraries.'}
          {phase === 3 &&
            'Train starts in tensorflow:2.8. Different Python is fine — they never share a container.'}
        </p>

        <Nav
          step={phase}
          max={3}
          onBack={() => setPhase((p) => Math.max(0, p - 1))}
          onNext={() => setPhase((p) => Math.min(3, p + 1))}
        />
      </div>
    </div>
  );
}

/* ── 4. Pipeline graph matching source diagram + moving artifacts ─────────── */

const GRAPH = [
  { id: 0, label: 'Ingest Data', artifact: 'raw files', y: 28 },
  { id: 1, label: 'Preprocess Data', artifact: 'processed path', y: 88 },
  { id: 2, label: 'Train Model', artifact: 'model.pkl', y: 148 },
  { id: 3, label: 'Evaluate Model', artifact: 'score', y: 208 },
  { id: 4, label: 'Deploy Model', artifact: 'live API', y: 278 },
];

export function PipelineGraphVisualizer() {
  const [step, setStep] = useState(0);
  const [pass, setPass] = useState(true);

  const maxStep = pass ? 4 : 3;
  const deployBlocked = !pass;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">The workflow is a graph</h3>
        <p className="text-gray-400 text-sm">
          Output of <span className="text-rose-300 font-mono">preprocess</span> becomes the argument to{' '}
          <span className="text-rose-300 font-mono">train</span>.
        </p>
      </div>

      <div className="max-w-md mx-auto w-full">
        <svg viewBox="0 0 280 330" className="w-full h-[300px]">
          {GRAPH.slice(0, -1).map((n, i) => {
            const next = GRAPH[i + 1];
            const dashed = i === 3;
            const lit = step > i;
            return (
              <g key={`e-${n.id}`}>
                <line
                  x1="140"
                  y1={n.y + 18}
                  x2="140"
                  y2={next.y - 18}
                  stroke={dashed ? '#fbbf24' : lit ? '#38bdf8' : '#475569'}
                  strokeWidth="2.5"
                  strokeDasharray={dashed ? '6 5' : undefined}
                  markerEnd="url(#garr)"
                />
                {step === i && (
                  <g>
                    <circle cx="140" cy={(n.y + next.y) / 2} r="4" fill="#fbbf24">
                      <animate attributeName="cy" from={n.y + 22} to={next.y - 22} dur="0.8s" fill="freeze" />
                    </circle>
                  </g>
                )}
              </g>
            );
          })}
          <defs>
            <marker id="garr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
            </marker>
          </defs>

          {GRAPH.map((n) => {
            const active = step === n.id;
            const done = step > n.id;
            const blocked = n.id === 4 && deployBlocked;
            return (
              <g key={n.id}>
                <rect
                  x="50"
                  y={n.y - 18}
                  width="180"
                  height="36"
                  rx="18"
                  fill={
                    blocked
                      ? '#1e293b'
                      : active
                        ? '#38bdf8'
                        : done
                          ? '#164e63'
                          : '#0f172a'
                  }
                  stroke={blocked ? '#64748b' : '#7dd3fc'}
                  strokeWidth="2"
                  strokeDasharray={n.id === 4 ? '6 4' : undefined}
                  opacity={blocked ? 0.4 : 1}
                />
                <text
                  x="140"
                  y={n.y + 5}
                  textAnchor="middle"
                  fill={active ? '#0f172a' : '#e2e8f0'}
                  fontSize="13"
                  fontWeight="700"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex justify-center mb-2">
          {step < 5 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500">carrying</span>
              <Token tone={step === 3 && !pass ? 'rose' : 'sky'}>
                {GRAPH[Math.min(step, 4)].artifact}
              </Token>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[10px] text-gray-400">Eval threshold</span>
          <button
            type="button"
            onClick={() => {
              setPass((p) => !p);
              setStep((s) => Math.min(s, 3));
            }}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
              pass ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {pass ? 'score PASS — dashed edge open' : 'score FAIL — deploy skipped'}
          </button>
        </div>

        <p className="text-[10px] text-center text-gray-500 italic leading-relaxed">
          Solid arrows = must-run dependency. Dashed = conditional (deploy only if eval is good).
        </p>

        <Nav
          step={step}
          max={maxStep}
          onBack={() => setStep((s) => Math.max(0, s - 1))}
          onNext={() => setStep((s) => Math.min(maxStep, s + 1))}
        />
      </div>
    </div>
  );
}

/* ── 5. Full @dsl.component Python + mapped visual ───────────────────────── */

const COMP_FOCUS = [
  {
    id: 'deco1',
    label: '1. Decorator + image',
    blurb:
      '@dsl.component turns the function into a reusable step. base_image and packages_to_install become the container that Kubernetes will run.',
  },
  {
    id: 'ports1',
    label: '2. Typed I/O',
    blurb:
      'raw_data_path is an input (str). processed_data is dsl.OutputPath("Dataset") — a typed output artifact the next step can consume.',
  },
  {
    id: 'body1',
    label: '3. Preprocess body',
    blurb:
      'Ordinary pandas code: load CSV, dropna, write the cleaned file to the output path. This runs inside python:3.9.',
  },
  {
    id: 'train',
    label: '4. Train component',
    blurb:
      'A second @dsl.component with a different image (TensorFlow). InputPath("Dataset") matches the previous output type. Output[Model] is the trained artifact.',
  },
];

function CodeHi({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full text-left rounded-md px-1.5 py-0.5 transition ${
        active ? 'bg-violet-500/25 ring-1 ring-violet-400/50' : 'hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

export function DslComponentVisualizer() {
  const [focus, setFocus] = useState('deco1');
  const f = COMP_FOCUS.find((x) => x.id === focus);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">Defining components in Python (kfp)</h3>
        <p className="text-gray-400 text-sm">
          Full two-step example — tap a highlighted region to map code → container.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 mb-3">
        {COMP_FOCUS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setFocus(x.id)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
              focus === x.id ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto w-full space-y-3">
        {(focus === 'deco1' || focus === 'ports1' || focus === 'body1') && (
          <div className="flex items-center justify-center gap-2 text-[10px]">
            <Token tone="amber">raw_data_path</Token>
            <span className="text-gray-500">→</span>
            <div className="rounded-lg border border-sky-400 bg-sky-500/15 px-3 py-1.5 font-bold text-sky-100">
              python:3.9 + pandas
            </div>
            <span className="text-gray-500">→</span>
            <Token tone="emerald">Dataset</Token>
          </div>
        )}
        {focus === 'train' && (
          <div className="flex items-center justify-center gap-2 text-[10px]">
            <Token tone="emerald">Dataset</Token>
            <span className="text-gray-500">→</span>
            <div className="rounded-lg border border-violet-400 bg-violet-500/15 px-3 py-1.5 font-bold text-violet-100">
              tensorflow:2.8.0
            </div>
            <span className="text-gray-500">→</span>
            <Token tone="violet">Model</Token>
          </div>
        )}

        <pre className="rounded-xl bg-black/85 border border-gray-700 p-4 font-mono text-[12px] md:text-[13px] leading-6 text-gray-300 overflow-x-auto whitespace-pre">
          <div className="text-gray-500">from kfp import dsl</div>
          <div className="text-gray-500">from kfp.compiler import Compiler</div>
          <div className="text-gray-500 mt-2"># Component 1: Preprocesses data</div>
          <CodeHi active={focus === 'deco1'} onClick={() => setFocus('deco1')}>
            <span className="text-rose-300">@dsl.component(</span>
            {'\n'}
            {'    '}base_image=<span className="text-emerald-300">&apos;python:3.9&apos;</span>,
            {'\n'}
            {'    '}packages_to_install=[<span className="text-emerald-300">&apos;pandas==1.3.5&apos;</span>]
            {'\n'}
            )
          </CodeHi>
          <div>def preprocess_data(</div>
          <CodeHi active={focus === 'ports1'} onClick={() => setFocus('ports1')}>
            {'    '}raw_data_path: str,
            {'\n'}
            {'    '}processed_data: dsl.OutputPath(<span className="text-rose-300">&apos;Dataset&apos;</span>)
          </CodeHi>
          <div>):</div>
          <CodeHi active={focus === 'body1'} onClick={() => setFocus('body1')}>
            {'    '}
            <span className="text-emerald-300">&quot;&quot;&quot;Loads raw data, cleans it, and saves it to an output path.&quot;&quot;&quot;</span>
            {'\n'}
            {'    '}import pandas as pd
            {'\n'}
            {'    '}df = pd.read_csv(raw_data_path)
            {'\n'}
            {'    '}
            <span className="text-gray-500"># Perform cleaning operations</span>
            {'\n'}
            {'    '}df_cleaned = df.dropna()
            {'\n'}
            {'    '}df_cleaned.to_csv(processed_data, index=False)
            {'\n'}
            {'    '}print(<span className="text-emerald-300">&quot;Data preprocessing complete.&quot;</span>)
          </CodeHi>
          <div className="text-gray-500 mt-2"># Component 2: Trains a model</div>
          <CodeHi active={focus === 'train'} onClick={() => setFocus('train')}>
            <span className="text-rose-300">@dsl.component(</span>
            {'\n'}
            {'    '}base_image=<span className="text-emerald-300">&apos;tensorflow/tensorflow:2.8.0&apos;</span>,{' '}
            <span className="text-gray-500"># Using a different image</span>
            {'\n'}
            )
            {'\n'}
            def train_model(
            {'\n'}
            {'    '}dataset: dsl.InputPath(<span className="text-rose-300">&apos;Dataset&apos;</span>),
            {'\n'}
            {'    '}model_output: dsl.Output[dsl.Model]
            {'\n'}
            ):
            {'\n'}
            {'    '}
            <span className="text-emerald-300">&quot;&quot;&quot;Loads processed data and trains a simple model.&quot;&quot;&quot;</span>
            {'\n'}
            {'    '}import pandas as pd
            {'\n'}
            {'    '}
            <span className="text-gray-500"># Placeholder for training logic</span>
            {'\n'}
            {'    '}df = pd.read_csv(dataset)
            {'\n'}
            {'    '}print(f<span className="text-emerald-300">&quot;Training model with data from {'{'}dataset{'}'}...&quot;</span>)
            {'\n'}
            {'\n'}
            {'    '}
            <span className="text-gray-500"># Save a dummy model file</span>
            {'\n'}
            {'    '}with open(model_output.path, &apos;w&apos;) as f:
            {'\n'}
            {'        '}f.write(<span className="text-emerald-300">&quot;This is a trained model artifact.&quot;</span>)
            {'\n'}
            {'    '}print(f<span className="text-emerald-300">&quot;Model saved to {'{'}model_output.path{'}'}&quot;</span>)
          </CodeHi>
        </pre>

        <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3">
          <div className="text-rose-300 font-bold text-xs mb-1">{f.label}</div>
          <p className="text-sm text-gray-200 leading-relaxed">{f.blurb}</p>
        </div>
      </div>
    </div>
  );
}

/* ── 6. Full @dsl.pipeline Python + wiring visual ─────────────────────────── */

const PIPE_FOCUS = [
  {
    id: 'header',
    label: '1. @dsl.pipeline',
    blurb:
      'Names the workflow. kfp compiles this function into static YAML that Kubernetes / Kubeflow can run.',
  },
  {
    id: 'prep',
    label: '2. Instantiate preprocess',
    blurb:
      'Calling preprocess_data(...) creates a task. data_url is a pipeline parameter — you pass it at run time.',
  },
  {
    id: 'wire',
    label: '3. Wire the output',
    blurb:
      'train_model(dataset=preprocess_task.outputs["processed_data"]) is the cable. Kubeflow infers: train waits until preprocess finishes.',
  },
  {
    id: 'gpu',
    label: '4. Resources on train only',
    blurb:
      'CPU, memory, and a T4 GPU attach only to train_task. Preprocess stays cheap — expensive hardware only where it is needed.',
  },
];

export function DslPipelineVisualizer() {
  const [focus, setFocus] = useState('header');
  const f = PIPE_FOCUS.find((x) => x.id === focus);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">Defining the pipeline in Python</h3>
        <p className="text-gray-400 text-sm">
          Full <span className="font-mono text-rose-300">@dsl.pipeline</span> — tap a region to see the
          wiring.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 mb-3">
        {PIPE_FOCUS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setFocus(x.id)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
              focus === x.id ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto w-full space-y-3">
        <div className="relative flex items-stretch justify-between gap-3 px-1">
          <div
            className={`flex-1 rounded-xl border-2 p-2 text-center transition ${
              focus === 'prep' ? 'border-sky-300 bg-sky-500/25' : 'border-sky-400/40 bg-sky-500/10'
            }`}
          >
            <div className="text-[9px] text-sky-300 font-bold">preprocess_task</div>
            <Token tone="emerald">processed_data</Token>
          </div>
          <div className="w-14 shrink-0 relative flex items-center">
            <div
              className={`w-full h-0.5 ${focus === 'wire' || focus === 'gpu' ? 'bg-emerald-400' : 'bg-gray-600'}`}
            />
          </div>
          <div
            className={`flex-1 rounded-xl border-2 p-2 text-center transition ${
              focus === 'gpu' ? 'border-emerald-400 bg-emerald-500/20' : 'border-violet-400/40 bg-violet-500/10'
            }`}
          >
            <div className="text-[9px] text-violet-200 font-bold">train_task</div>
            {focus === 'gpu' ? (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-200">
                <Zap className="w-3 h-3" /> T4 · 2 CPU · 4G
              </span>
            ) : (
              <Token tone="amber">dataset=…</Token>
            )}
          </div>
        </div>

        <pre className="rounded-xl bg-black/85 border border-gray-700 p-4 font-mono text-[12px] md:text-[13px] leading-6 text-gray-300 overflow-x-auto whitespace-pre">
          <div className="text-gray-500"># Define the pipeline structure</div>
          <CodeHi active={focus === 'header'} onClick={() => setFocus('header')}>
            <span className="text-rose-300">@dsl.pipeline(</span>
            {'\n'}
            {'    '}name=<span className="text-emerald-300">&apos;simple-training-pipeline&apos;</span>,
            {'\n'}
            {'    '}description=<span className="text-emerald-300">&apos;A demonstration pipeline that preprocesses data and trains a model.&apos;</span>
            {'\n'}
            )
          </CodeHi>
          <div>def my_first_pipeline(data_url: str):</div>
          <CodeHi active={focus === 'prep'} onClick={() => setFocus('prep')}>
            {'    '}
            <span className="text-gray-500"># Instantiate the first task</span>
            {'\n'}
            {'    '}preprocess_task = preprocess_data(raw_data_path=data_url)
          </CodeHi>
          <CodeHi active={focus === 'wire'} onClick={() => setFocus('wire')}>
            {'\n'}
            {'    '}
            <span className="text-gray-500"># The second task uses the output from the first task</span>
            {'\n'}
            {'    '}train_task = train_model(
            {'\n'}
            {'        '}dataset=preprocess_task.outputs[<span className="text-rose-300">&apos;processed_data&apos;</span>]
            {'\n'}
            {'    '})
          </CodeHi>
          <CodeHi active={focus === 'gpu'} onClick={() => setFocus('gpu')}>
            {'\n'}
            {'    '}
            <span className="text-gray-500"># You can also specify resource requests for a specific step</span>
            {'\n'}
            {'    '}train_task.set_cpu_limit(<span className="text-emerald-300">&apos;2&apos;</span>).set_memory_limit(
            <span className="text-emerald-300">&apos;4G&apos;</span>
            ).add_node_selector_constraint(
            {'\n'}
            {'        '}
            <span className="text-emerald-300">&apos;cloud.google.com/gke-accelerator&apos;</span>,{' '}
            <span className="text-emerald-300">&apos;NVIDIA_TESLA_T4&apos;</span>)
          </CodeHi>
        </pre>

        <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3">
          <div className="text-rose-300 font-bold text-xs mb-1">{f.label}</div>
          <p className="text-sm text-gray-200 leading-relaxed">{f.blurb}</p>
        </div>
      </div>
    </div>
  );
}

/* ── 7. Pillars as mini-scenes, not paragraphs ────────────────────────────── */

export function WhyKubeflowPillarsVisualizer() {
  const [active, setActive] = useState('repro');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">What you get for writing Python</h3>
        <p className="text-gray-400 text-sm">Kubeflow handles the Kubernetes grind. Tap a benefit.</p>
      </div>

      <Tabs
        options={[
          { id: 'repro', label: 'Reproducibility' },
          { id: 'reuse', label: 'Reusability' },
          { id: 'scale', label: 'Scale' },
          { id: 'port', label: 'Portability' },
        ]}
        value={active}
        onChange={setActive}
        accent="bg-sky-600"
      />

      <div className="max-w-lg mx-auto w-full">
        {active === 'repro' && (
          <div className="rounded-2xl border border-sky-400/40 bg-sky-500/10 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sky-200 text-xs font-bold">
              <RefreshCw className="w-4 h-4" /> Experiment ledger
            </div>
            <div className="space-y-1.5 font-mono text-[10px]">
              {[
                { run: 'run #12', tags: 'preprocess@v3  ·  train@v1  ·  acc=0.81' },
                { run: 'run #13', tags: 'preprocess@v3  ·  train@v2  ·  acc=0.87' },
                { run: 'run #14', tags: 'preprocess@v4  ·  train@v2  ·  acc=0.91', hi: true },
              ].map((r) => (
                <div
                  key={r.run}
                  className={`rounded-lg border px-3 py-2 flex justify-between gap-2 ${
                    r.hi ? 'border-emerald-400 bg-emerald-500/15 text-emerald-100' : 'border-gray-700 bg-black/40 text-gray-400'
                  }`}
                >
                  <span>{r.run}</span>
                  <span className="text-right">{r.tags}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-300 text-center">
              Every run stamps component versions, inputs, and artifacts — so you can replay #14.
            </p>
          </div>
        )}

        {active === 'reuse' && (
          <div className="rounded-2xl border border-violet-400/40 bg-violet-500/10 p-4 space-y-3">
            <div className="flex items-center gap-2 text-violet-200 text-xs font-bold">
              <Share2 className="w-4 h-4" /> One component, two pipelines
            </div>
            <div className="flex justify-center">
              <div className="rounded-xl border-2 border-violet-400 bg-violet-500/20 px-4 py-2 text-center">
                <Box className="w-5 h-5 mx-auto text-violet-200" />
                <div className="text-xs font-bold text-white">eval_model</div>
              </div>
            </div>
            <div className="flex justify-center text-violet-300 text-lg">↙  ↘</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-sky-400/40 bg-sky-500/10 p-2 text-center text-[10px] text-sky-100">
                fraud-detection pipeline
              </div>
              <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 p-2 text-center text-[10px] text-amber-100">
                recsys pipeline
              </div>
            </div>
            <p className="text-xs text-gray-300 text-center">
              Self-contained steps become a shared library — validation and eval reused across teams.
            </p>
          </div>
        )}

        {active === 'scale' && (
          <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold">
              <Cpu className="w-4 h-4" /> Kubernetes does the heavy lifting
            </div>
            <div className="flex items-end justify-center gap-3 h-24">
              <div className="w-14 rounded-t-lg bg-sky-500/30 border border-sky-400 h-10 flex items-end justify-center text-[8px] font-bold text-sky-100 pb-1">
                prep
              </div>
              <div className="flex gap-1 items-end">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 rounded-t-lg bg-emerald-500/40 border border-emerald-400 flex flex-col items-center justify-end pb-1"
                    style={{ height: 40 + i * 10 }}
                  >
                    <Zap className="w-3 h-3 text-emerald-200" />
                    <span className="text-[7px] text-emerald-100">GPU</span>
                  </div>
                ))}
              </div>
              <div className="w-14 rounded-t-lg bg-violet-500/30 border border-violet-400 h-12 flex items-end justify-center text-[8px] font-bold text-violet-100 pb-1">
                eval
              </div>
            </div>
            <p className="text-xs text-gray-300 text-center">
              Parallel workers + per-step CPU / RAM / GPU. Prep stays small; train fans out.
            </p>
          </div>
        )}

        {active === 'port' && (
          <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-200 text-xs font-bold">
              <Globe className="w-4 h-4" /> Compile once
            </div>
            <div className="flex justify-center">
              <div className="rounded-xl border-2 border-white/30 bg-black/40 px-4 py-2 text-center">
                <div className="font-mono text-[10px] text-rose-300">pipeline.yaml</div>
                <div className="text-[9px] text-gray-400">compiled from Python SDK</div>
              </div>
            </div>
            <div className="flex justify-center text-amber-300">↓ ↓ ↓</div>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
              <div className="rounded-lg border border-gray-500 bg-gray-800 py-3 text-gray-100">On-prem</div>
              <div className="rounded-lg border border-sky-400/50 bg-sky-500/15 py-3 text-sky-100">AWS / EKS</div>
              <div className="rounded-lg border border-emerald-400/50 bg-emerald-500/15 py-3 text-emerald-100">GCP / GKE</div>
            </div>
            <p className="text-xs text-gray-300 text-center">
              Same compiled pipeline on any compliant cluster — less vendor lock-in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
