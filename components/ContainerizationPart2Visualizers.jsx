import React, { useState, useEffect } from 'react';
import {
  Brain,
  Server,
  Box,
  AlertTriangle,
  CheckCircle,
  Globe,
  RefreshCw,
  FileCode,
} from 'lucide-react';

/* ── shared ───────────────────────────────────────────────────────────────── */

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

/* ── 1. Why orchestrate / scale pain ──────────────────────────────────────── */

export function K8sScaleProblemVisualizer() {
  const [mode, setMode] = useState('manual');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">From One Container to Hundreds</h3>
        <p className="text-gray-400 text-sm">Docker packages apps — Kubernetes runs the fleet.</p>
      </div>

      <Tabs
        options={[
          { id: 'manual', label: 'Manual Docker' },
          { id: 'k8s', label: 'Kubernetes' },
        ]}
        value={mode}
        onChange={setMode}
        accent={mode === 'k8s' ? 'bg-emerald-600' : 'bg-rose-600'}
      />

      <div className="max-w-lg mx-auto w-full">
        {mode === 'manual' ? (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4">
            <div className="flex flex-wrap justify-center gap-1.5 mb-3">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded bg-gray-800 border border-rose-400/30 flex items-center justify-center"
                  style={{ transform: `rotate(${(i % 5) - 2}deg)` }}
                >
                  <Box className="w-3.5 h-3.5 text-rose-300" />
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-rose-200">
              Hand-managing containers for distributed training or HA APIs — error-prone and slow.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4">
            <div className="flex justify-center mb-3">
              <div className="rounded-full bg-emerald-500/20 border border-emerald-400 px-4 py-2 flex items-center gap-2">
                <Brain className="w-5 h-5 text-emerald-300" />
                <span className="text-xs font-bold text-emerald-100">Kubernetes · cluster OS</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center"
                >
                  <Box className="w-3.5 h-3.5 text-emerald-300" />
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-emerald-200">
              Automates deploy, scale, and heal across a shared pool of machines.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 2. Why K8s fits ML (4 pillars) ───────────────────────────────────────── */

const PILLARS = [
  {
    id: 'scale',
    name: 'Scalability',
    detail:
      'Scale training replicas with one command. Autoscale inference Pods up on traffic, down when quiet.',
    demo: 'scale',
  },
  {
    id: 'res',
    name: 'Resources',
    detail:
      'Declare CPU / RAM / GPU requests & limits so critical jobs get GPUs and notebooks cannot starve the cluster.',
    demo: 'res',
  },
  {
    id: 'port',
    name: 'Portability',
    detail:
      'Declarative YAML defines pipelines, APIs, and dashboards — identical on-prem or AWS / GCP / Azure.',
    demo: 'port',
  },
  {
    id: 'heal',
    name: 'Self-healing',
    detail:
      'Watch health, restart failed containers, replace crashed replicas — critical for long jobs and live models.',
    demo: 'heal',
  },
];

export function WhyK8sMlVisualizer() {
  const [sel, setSel] = useState('scale');
  const [replicas, setReplicas] = useState(1);
  const [failed, setFailed] = useState(false);
  const p = PILLARS.find((x) => x.id === sel);

  useEffect(() => {
    if (sel !== 'heal') setFailed(false);
  }, [sel]);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Why Kubernetes Fits ML</h3>
        <p className="text-gray-400 text-sm">Four pillars — tap one to see it in action.</p>
      </div>

      <Tabs
        options={PILLARS.map((x) => ({ id: x.id, label: x.name }))}
        value={sel}
        onChange={setSel}
        accent="bg-violet-600"
      />

      <div className="max-w-md mx-auto w-full space-y-3">
        <p className="text-xs text-gray-300 text-center leading-relaxed">{p.detail}</p>

        {sel === 'scale' && (
          <div>
            <label className="text-[10px] text-gray-400">
              Inference replicas: <span className="text-white font-mono">{replicas}</span>
            </label>
            <input
              type="range"
              min={1}
              max={8}
              value={replicas}
              onChange={(e) => setReplicas(Number(e.target.value))}
              className="w-full accent-violet-500 mb-2"
            />
            <div className="flex flex-wrap gap-1.5 justify-center">
              {Array.from({ length: replicas }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-400/50 flex items-center justify-center"
                >
                  <Box className="w-4 h-4 text-violet-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        {sel === 'res' && (
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-3 space-y-2">
            <div className="text-[10px] text-gray-400 uppercase font-bold">GPU pool</div>
            <div className="h-6 rounded-full bg-gray-800 overflow-hidden flex">
              <div className="bg-emerald-500 w-[40%] flex items-center justify-center text-[9px] font-bold text-white">
                Training request
              </div>
              <div className="bg-amber-500/40 w-[25%] flex items-center justify-center text-[9px] text-amber-100">
                Notebook limit
              </div>
              <div className="flex-1 bg-gray-700" />
            </div>
            <p className="text-[10px] text-gray-500">Requests guarantee · limits cap noisy neighbors</p>
          </div>
        )}

        {sel === 'port' && (
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold">
            <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-2 py-3 text-amber-100">
              <FileCode className="w-4 h-4 mx-auto mb-1" />
              stack.yaml
            </div>
            <span className="text-gray-500">→</span>
            {['AWS', 'GCP', 'Azure', 'On-prem'].map((c) => (
              <div
                key={c}
                className="rounded-lg border border-sky-400/40 bg-sky-500/10 px-2 py-3 text-sky-100"
              >
                {c}
              </div>
            ))}
          </div>
        )}

        {sel === 'heal' && (
          <div className="space-y-2">
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3].map((i) => {
                const dead = failed && i === 1;
                return (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-lg border flex items-center justify-center transition ${
                      dead
                        ? 'border-rose-500 bg-rose-500/20 opacity-40'
                        : 'border-emerald-400 bg-emerald-500/15'
                    }`}
                  >
                    {dead ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setFailed((f) => !f)}
              className="w-full py-2 rounded-lg bg-rose-600 text-white text-xs font-bold"
            >
              {failed ? 'Controller replaced the Pod ✓' : 'Crash a Pod'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 3. Cluster abstraction diagram ───────────────────────────────────────── */

const ARCH_STEPS = [
  { id: 1, title: 'Apply', detail: 'ML Engineer sends YAML desired state to the Control Plane.' },
  { id: 2, title: 'Schedule', detail: 'Scheduler places Pods on Worker Nodes — GPUs where needed.' },
];

export function ClusterAbstractionVisualizer() {
  const [step, setStep] = useState(1);
  const glow = '#22d3ee';
  const dim = '#94a3b8';

  return (
    <div className="flex flex-col w-full h-full p-3 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-lg font-semibold text-white mb-0.5">The Kubernetes Cluster Abstraction</h3>
        <p className="text-gray-400 text-xs">Think cluster, not machines — declare state, let the brain schedule.</p>
      </div>

      <div className="flex justify-center gap-2 mb-2">
        {ARCH_STEPS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setStep(x.id)}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
              step === x.id ? 'bg-cyan-500 text-gray-950' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {x.id}. {x.title}
          </button>
        ))}
      </div>

      <div className="max-w-xl mx-auto w-full rounded-xl bg-white p-3 shadow-lg">
        <svg viewBox="0 0 480 340" className="w-full h-auto">
          <defs>
            <marker id="kGlow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
              <path d="M0,0 L5,3 L0,6 Z" fill={glow} />
            </marker>
            <marker id="kDim" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
              <path d="M0,0 L5,3 L0,6 Z" fill={dim} />
            </marker>
          </defs>

          {/* Engineer */}
          <ellipse
            cx="240"
            cy="28"
            rx="90"
            ry="16"
            fill={step === 1 ? '#86efac' : '#bbf7d0'}
            stroke={step === 1 ? glow : '#16a34a'}
            strokeWidth={step === 1 ? 2.5 : 1.2}
          />
          <text x="240" y="32" textAnchor="middle" fontSize="11" fontWeight="700" fill="#14532d">
            ML Engineer (YAML Config)
          </text>

          {/* Arrow 1 */}
          <line
            x1="240"
            y1="44"
            x2="240"
            y2="78"
            stroke={step === 1 ? glow : dim}
            strokeWidth={step === 1 ? 2.8 : 1.2}
            markerEnd={step === 1 ? 'url(#kGlow)' : 'url(#kDim)'}
            style={{ filter: step === 1 ? 'drop-shadow(0 0 4px #22d3ee)' : undefined }}
          />
          <text
            x="255"
            y="66"
            fontSize="10"
            fontWeight={step === 1 ? 700 : 500}
            fill={step === 1 ? glow : dim}
          >
            1. Apply Desired State
          </text>

          {/* Control Plane */}
          <rect
            x="120"
            y="82"
            width="240"
            height="70"
            rx="10"
            fill="none"
            stroke={step === 1 ? glow : '#94a3b8'}
            strokeDasharray="5 3"
            strokeWidth={step === 1 ? 2 : 1.2}
          />
          <text x="240" y="98" textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155">
            Control Plane (The Brain)
          </text>
          <rect x="175" y="108" width="130" height="32" rx="6" fill="#e2e8f0" stroke="#64748b" />
          <text x="240" y="122" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">
            Kubernetes API
          </text>
          <text x="240" y="134" textAnchor="middle" fontSize="8" fill="#475569">
            Scheduler · …
          </text>

          {/* Arrow 2 */}
          <line
            x1="180"
            y1="152"
            x2="100"
            y2="188"
            stroke={step === 2 ? glow : dim}
            strokeWidth={step === 2 ? 2.5 : 1}
            strokeDasharray="4 3"
            markerEnd={step === 2 ? 'url(#kGlow)' : 'url(#kDim)'}
          />
          <line
            x1="240"
            y1="152"
            x2="240"
            y2="188"
            stroke={step === 2 ? glow : dim}
            strokeWidth={step === 2 ? 2.5 : 1}
            strokeDasharray="4 3"
            markerEnd={step === 2 ? 'url(#kGlow)' : 'url(#kDim)'}
          />
          <line
            x1="300"
            y1="152"
            x2="380"
            y2="188"
            stroke={step === 2 ? glow : dim}
            strokeWidth={step === 2 ? 2.5 : 1}
            strokeDasharray="4 3"
            markerEnd={step === 2 ? 'url(#kGlow)' : 'url(#kDim)'}
          />
          <text
            x="310"
            y="172"
            fontSize="10"
            fontWeight={step === 2 ? 700 : 500}
            fill={step === 2 ? glow : dim}
          >
            2. Schedule Pods
          </text>

          {/* Resource pool */}
          <rect
            x="30"
            y="192"
            width="420"
            height="130"
            rx="10"
            fill="#f8fafc"
            stroke={step === 2 ? glow : '#cbd5e1'}
            strokeWidth={step === 2 ? 2 : 1.2}
          />
          <text x="44" y="210" fontSize="10" fontWeight="700" fill="#475569">
            Resource Pool (Worker Nodes)
          </text>

          {/* Nodes */}
          {[
            { x: 50, label: 'Node 1' },
            { x: 150, label: 'Node 2 (GPU)' },
            { x: 270, label: 'Node 3' },
          ].map((n) => (
            <g key={n.label}>
              <rect x={n.x} y="220" width="90" height="36" rx="6" fill="#e2e8f0" stroke="#64748b" />
              <text x={n.x + 45} y="242" textAnchor="middle" fontSize="9" fontWeight="700" fill="#334155">
                {n.label}
              </text>
            </g>
          ))}

          {/* Pods */}
          {[
            { x: 50, y: 270, label: 'Jupyter', fill: '#bae6fd' },
            { x: 150, y: 270, label: 'GPU Training', fill: '#e9d5ff' },
            { x: 270, y: 270, label: 'Model API', fill: '#bae6fd' },
            { x: 370, y: 270, label: 'Preprocess', fill: '#bae6fd' },
          ].map((pod) => (
            <g key={pod.label}>
              <rect
                x={pod.x}
                y={pod.y}
                width="88"
                height="36"
                rx="6"
                fill={pod.fill}
                stroke={step === 2 ? glow : '#64748b'}
                strokeWidth={step === 2 ? 1.8 : 1}
              />
              <text x={pod.x + 44} y={pod.y + 22} textAnchor="middle" fontSize="8" fontWeight="700" fill="#1e293b">
                Pod ({pod.label})
              </text>
            </g>
          ))}
        </svg>
      </div>

      <p className="max-w-xl mx-auto mt-2 text-xs text-center text-gray-300 bg-gray-900/80 rounded-lg p-2 border border-cyan-500/20">
        <strong className="text-cyan-300">
          {ARCH_STEPS[step - 1].id}. {ARCH_STEPS[step - 1].title}:
        </strong>{' '}
        {ARCH_STEPS[step - 1].detail}
      </p>
    </div>
  );
}

/* ── 4. High-level how it works ───────────────────────────────────────────── */

const COMPONENTS = [
  {
    id: 'cp',
    name: 'Control Plane',
    icon: Brain,
    detail:
      'The coordinating brain. Exposes the API, watches for new definitions, and makes global decisions like scheduling.',
  },
  {
    id: 'nodes',
    name: 'Nodes',
    icon: Server,
    detail:
      'Worker machines (physical or virtual). Each runs an agent that talks to the control plane and manages assigned containers.',
  },
  {
    id: 'pods',
    name: 'Pods',
    icon: Box,
    detail:
      'Smallest deployable unit. Encapsulates your container(s), storage, and a unique IP. Usually one main container per Pod.',
  },
];

export function HowK8sWorksVisualizer() {
  const [sel, setSel] = useState('cp');
  const c = COMPONENTS.find((x) => x.id === sel);
  const Icon = c.icon;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Declarative Desired State</h3>
        <p className="text-gray-400 text-sm">
          Declare “3 replicas of my model API, publicly reachable” — K8s converges reality to match.
        </p>
      </div>

      <div className="max-w-md mx-auto w-full rounded-xl border border-violet-500/30 bg-violet-500/10 p-3 mb-4 text-center">
        <FileCode className="w-5 h-5 mx-auto text-violet-300 mb-1" />
        <div className="text-xs text-violet-100 font-mono">
          desired: replicas=3 · expose=public
        </div>
        <div className="text-[10px] text-gray-400 mt-1">≠ imperative scripts · continuous reconcile</div>
      </div>

      <div className="max-w-md mx-auto w-full grid grid-cols-3 gap-2 mb-3">
        {COMPONENTS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setSel(x.id)}
            className={`rounded-xl border p-3 text-center transition ${
              sel === x.id
                ? 'border-sky-400 bg-sky-500/15'
                : 'border-gray-700 bg-gray-900 opacity-70'
            }`}
          >
            <x.icon className="w-5 h-5 mx-auto mb-1 text-sky-300" />
            <div className="text-[10px] font-bold text-white">{x.name}</div>
          </button>
        ))}
      </div>

      <div className="max-w-md mx-auto w-full rounded-xl border border-gray-700 bg-gray-900/80 p-4 flex gap-3">
        <Icon className="w-6 h-6 text-sky-300 shrink-0" />
        <p className="text-sm text-gray-300 leading-relaxed">{c.detail}</p>
      </div>
    </div>
  );
}

/* ── 5. Pods + sidecar ────────────────────────────────────────────────────── */

export function PodsVisualizer() {
  const [view, setView] = useState('sidecar'); // anatomy | sidecar | ephemeral
  const [alive, setAlive] = useState(true);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Pods — Atomic Unit of Deployment</h3>
        <p className="text-gray-400 text-sm">Containers + shared net/storage · often with a sidecar.</p>
      </div>

      <Tabs
        options={[
          { id: 'anatomy', label: 'Anatomy' },
          { id: 'sidecar', label: 'Sidecar (ML)' },
          { id: 'ephemeral', label: 'Ephemeral' },
        ]}
        value={view}
        onChange={setView}
        accent="bg-sky-600"
      />

      <div className="max-w-md mx-auto w-full">
        {view === 'anatomy' && (
          <div className="rounded-2xl border-2 border-dashed border-sky-400/50 bg-sky-500/5 p-4">
            <div className="text-[10px] font-bold text-sky-300 uppercase mb-3 text-center">Pod</div>
            <div className="rounded-xl bg-sky-500/20 border border-sky-400/40 p-3 text-center text-sm font-bold text-white mb-2">
              Main container
            </div>
            <div className="flex justify-center gap-3 text-[10px]">
              <div className="rounded-lg border border-gray-600 px-3 py-2 text-gray-300">Unique IP</div>
              <div className="rounded-lg border border-gray-600 px-3 py-2 text-gray-300">Volumes</div>
            </div>
          </div>
        )}

        {view === 'sidecar' && (
          <div className="rounded-2xl border-2 border-gray-400 bg-white p-4 text-gray-900">
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-2 text-center">Pod</div>
            <div className="space-y-2">
              <div className="rounded-lg bg-sky-200 border border-sky-400 px-3 py-3 text-center text-xs font-bold text-sky-950">
                Model-Serving Container
                <div className="font-normal text-[10px] mt-0.5 opacity-80">e.g. TensorFlow Serving</div>
              </div>
              <div className="rounded-lg bg-violet-200 border border-violet-400 px-3 py-3 text-center text-xs font-bold text-violet-950">
                Log-Forwarding Sidecar
                <div className="font-normal text-[10px] mt-0.5 opacity-80">Ships logs to collector</div>
              </div>
            </div>
            <p className="text-[10px] text-center text-gray-500 mt-3 italic">
              Shared network namespace · efficient local communication
            </p>
          </div>
        )}

        {view === 'ephemeral' && (
          <div className="space-y-3">
            <div
              className={`rounded-2xl border p-6 text-center transition ${
                alive
                  ? 'border-emerald-400 bg-emerald-500/10'
                  : 'border-rose-500 bg-rose-500/10 opacity-50'
              }`}
            >
              <Box className={`w-10 h-10 mx-auto mb-2 ${alive ? 'text-emerald-300' : 'text-rose-400'}`} />
              <div className="text-sm font-bold text-white">
                {alive ? 'Pod running · IP 10.0.1.42' : 'Pod gone · IP destroyed'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAlive((a) => !a)}
              className="w-full py-2 rounded-lg bg-rose-600 text-white text-xs font-bold"
            >
              {alive ? 'Simulate node failure / kill Pod' : 'Gone forever — use a Deployment'}
            </button>
            <p className="text-[10px] text-center text-gray-500">
              Don&apos;t manage Pods by hand for production — let a Deployment recreate them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 6. Deployments ───────────────────────────────────────────────────────── */

const DEPLOYMENT_YAML_FIELDS = [
  {
    id: 1,
    key: 'replicas',
    desc: 'Tells the Deployment to maintain three running instances of our Pod.',
  },
  {
    id: 2,
    key: 'selector',
    desc: 'Defines how the Deployment finds which Pods to manage. It looks for Pods with a label that matches app: inference-api.',
  },
  {
    id: 3,
    key: 'template',
    desc: 'A blueprint for the Pods that the Deployment will create. It contains its own metadata and spec.',
  },
  {
    id: 4,
    key: 'template.metadata.labels',
    desc: 'The labels applied to each Pod created by this Deployment. The selector must match these labels.',
  },
  {
    id: 5,
    key: 'template.spec.containers',
    desc: 'The list of containers to run inside the Pod. Here, we define a single container named model-server using a specific image version.',
  },
];

export function DeploymentsVisualizer() {
  const [tab, setTab] = useState('replicas');
  const [replicas, setReplicas] = useState(3);
  const [nodeDown, setNodeDown] = useState(false);
  const [rolling, setRolling] = useState(0); // 0..replicas converted
  const [yamlFocus, setYamlFocus] = useState(1);

  useEffect(() => {
    if (tab !== 'update') {
      setRolling(0);
    }
  }, [tab]);

  const startRoll = () => {
    setRolling(0);
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setRolling(i);
      if (i >= replicas) clearInterval(iv);
    }, 500);
  };

  const yamlLine = (n, content, comment) => {
    const active = yamlFocus === n;
    return (
      <button
        type="button"
        onClick={() => setYamlFocus(n)}
        className={`w-full text-left px-3 py-1 rounded-md transition ${
          active ? 'bg-violet-500/25 ring-1 ring-violet-400/60' : 'hover:bg-white/5'
        }`}
      >
        <span className="text-gray-200">{content}</span>
        {comment && (
          <span className={`ml-2 ${active ? 'text-rose-300' : 'text-gray-500'}`}>
            # {n}. {comment}
          </span>
        )}
      </button>
    );
  };

  const activeField = DEPLOYMENT_YAML_FIELDS.find((f) => f.id === yamlFocus);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Deployments: Application Lifecycles</h3>
        <p className="text-gray-400 text-sm">Maintain replicas · rolling updates · ReplicaSets under the hood.</p>
      </div>

      <Tabs
        options={[
          { id: 'replicas', label: 'Replicas' },
          { id: 'heal', label: 'Self-heal' },
          { id: 'update', label: 'Rolling update' },
          { id: 'yaml', label: 'YAML' },
        ]}
        value={tab}
        onChange={setTab}
        accent="bg-violet-600"
      />

      <div className={`mx-auto w-full ${tab === 'yaml' ? 'max-w-3xl' : 'max-w-md'}`}>
        {tab === 'replicas' && (
          <div>
            <label className="text-[10px] text-gray-400">
              replicas: <span className="font-mono text-white">{replicas}</span>
            </label>
            <input
              type="range"
              min={1}
              max={6}
              value={replicas}
              onChange={(e) => setReplicas(Number(e.target.value))}
              className="w-full accent-violet-500 mb-3"
            />
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: replicas }).map((_, i) => (
                <div
                  key={i}
                  className="w-14 h-14 rounded-xl border border-violet-400/50 bg-violet-500/15 flex flex-col items-center justify-center"
                >
                  <Box className="w-4 h-4 text-violet-300" />
                  <span className="text-[8px] text-gray-400 mt-0.5">Pod {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'heal' && (
          <div className="space-y-3">
            <div className="flex justify-center gap-3">
              {[0, 1, 2].map((i) => {
                const down = nodeDown && i === 1;
                return (
                  <div
                    key={i}
                    className={`rounded-xl border px-3 py-4 text-center w-24 transition ${
                      down
                        ? 'border-rose-500 bg-rose-500/20 opacity-40'
                        : 'border-emerald-400 bg-emerald-500/10'
                    }`}
                  >
                    <Server className={`w-5 h-5 mx-auto mb-1 ${down ? 'text-rose-400' : 'text-emerald-300'}`} />
                    <div className="text-[9px] text-gray-300">Node {i + 1}</div>
                    <div className="text-[9px] text-gray-500">{down ? 'down' : 'Pod OK'}</div>
                  </div>
                );
              })}
            </div>
            {nodeDown && (
              <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 p-2 text-center text-xs text-emerald-200 flex items-center justify-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Deployment scheduled replacement on Node 3
              </div>
            )}
            <button
              type="button"
              onClick={() => setNodeDown((n) => !n)}
              className="w-full py-2 rounded-lg bg-rose-600 text-white text-xs font-bold"
            >
              {nodeDown ? 'Reset cluster' : 'Fail Node 2'}
            </button>
          </div>
        )}

        {tab === 'update' && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: replicas }).map((_, i) => {
                const isNew = i < rolling;
                return (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-lg border flex items-center justify-center text-[9px] font-bold transition ${
                      isNew
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                        : 'border-sky-400 bg-sky-500/20 text-sky-200'
                    }`}
                  >
                    v1.{isNew ? '2' : '1'}
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={startRoll}
              className="w-full py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
            >
              Update image → rolling replace
            </button>
            <p className="text-[10px] text-center text-gray-500">
              Old Pods drain gradually — no full downtime.
            </p>
          </div>
        )}

        {tab === 'yaml' && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {DEPLOYMENT_YAML_FIELDS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setYamlFocus(f.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                    yamlFocus === f.id
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                  }`}
                >
                  {f.id}. {f.key.split('.').pop()}
                </button>
              ))}
            </div>

            <div className="rounded-xl bg-black/80 border border-gray-700 p-4 font-mono text-sm md:text-[15px] leading-7 overflow-x-auto">
              <div className="text-gray-500 mb-2"># deployment.yaml</div>
              <div className="text-gray-300 whitespace-pre">apiVersion: apps/v1</div>
              <div className="text-gray-300 whitespace-pre">kind: Deployment</div>
              <div className="text-gray-300 whitespace-pre">metadata:</div>
              <div className="text-gray-300 whitespace-pre">  name: inference-api-deployment</div>
              <div className="text-gray-300 whitespace-pre">spec:</div>
              {yamlLine(1, '  replicas: 3', 'We want 3 identical Pods running')}
              <div className="text-gray-300 whitespace-pre">  selector:</div>
              <div className="text-gray-300 whitespace-pre">    matchLabels:</div>
              {yamlLine(2, '      app: inference-api', 'The Deployment finds Pods with this label')}
              {yamlLine(3, '  template:', 'This is the blueprint for the Pods it creates')}
              <div className="text-gray-300 whitespace-pre">    metadata:</div>
              <div className="text-gray-300 whitespace-pre">      labels:</div>
              {yamlLine(4, '        app: inference-api', 'The Pods get this label')}
              <div className="text-gray-300 whitespace-pre">    spec:</div>
              <div className="text-gray-300 whitespace-pre">      containers:</div>
              <div className="text-gray-300 whitespace-pre">      - name: model-server</div>
              {yamlLine(5, '        image: your-repo/your-model-server:v1.2', 'The container image to run')}
              <div className="text-gray-300 whitespace-pre">        ports:</div>
              <div className="text-gray-300 whitespace-pre">        - containerPort: 8000</div>
            </div>

            {activeField && (
              <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3">
                <div className="text-rose-300 font-mono text-sm font-bold mb-1">
                  {activeField.id}. {activeField.key}
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">{activeField.desc}</p>
              </div>
            )}

            <ol className="space-y-2 text-sm text-gray-300 leading-relaxed">
              {DEPLOYMENT_YAML_FIELDS.map((f) => (
                <li key={f.id} className="flex gap-2">
                  <span className="text-rose-400 font-bold shrink-0">{f.id}.</span>
                  <span>
                    <span className="text-rose-300 font-mono font-semibold">{f.key}:</span> {f.desc}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 7. Services ──────────────────────────────────────────────────────────── */

const SERVICE_PODS = [
  { id: 0, label: 'app: model-server', ip: '10.0.1.10' },
  { id: 1, label: 'app: model-server', ip: '10.0.1.11' },
  { id: 2, label: 'app: model-server', ip: '10.0.1.12' },
];

export function ServicesVisualizer() {
  const [tab, setTab] = useState('what'); // what | clusterip | lb
  const [phase, setPhase] = useState(0); // 0 problem, 1 service appears, 2 load-balance
  const [podDead, setPodDead] = useState(false);
  const [trafficTarget, setTrafficTarget] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (tab === 'what') {
      setPhase(0);
      setPodDead(false);
    }
  }, [tab]);

  // Animate traffic hopping across healthy pods
  useEffect(() => {
    if (tab !== 'what' && tab !== 'lb' && tab !== 'clusterip') return undefined;
    if (tab === 'what' && phase < 2) return undefined;

    const iv = setInterval(() => {
      setTrafficTarget((t) => {
        const alive = [0, 1, 2].filter((i) => !(podDead && i === 1));
        if (alive.length === 0) return t;
        const idx = alive.indexOf(t);
        return alive[(idx + 1) % alive.length];
      });
      setPulse(true);
      setTimeout(() => setPulse(false), 350);
    }, 900);
    return () => clearInterval(iv);
  }, [tab, phase, podDead]);

  const healthyCount = podDead ? 2 : 3;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Services: Exposing Your Application</h3>
        <p className="text-gray-400 text-sm">
          Stable door to ephemeral Pods — then ClusterIP vs LoadBalancer.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'what', label: 'What is a Service?' },
          { id: 'clusterip', label: 'ClusterIP' },
          { id: 'lb', label: 'LoadBalancer' },
        ]}
        value={tab}
        onChange={setTab}
        accent="bg-amber-600"
      />

      <div className="max-w-2xl mx-auto w-full">
        {/* ── What is a Service ─────────────────────────────────────────── */}
        {tab === 'what' && (
          <div className="space-y-3">
            <div className="flex justify-center gap-1.5 flex-wrap">
              {[
                { id: 0, label: '1. The problem' },
                { id: 1, label: '2. Add a Service' },
                { id: 2, label: '3. Load-balance' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPhase(s.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                    phase === s.id
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-700 bg-gray-950/60 p-4">
              {/* Client */}
              <div className="flex justify-center mb-4">
                <div className="rounded-xl border border-violet-400/50 bg-violet-500/15 px-4 py-2 text-center">
                  <div className="text-xs font-bold text-violet-100">Client / API caller</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {phase === 0
                      ? 'Trying to dial Pod IPs directly…'
                      : 'Calls a fixed Service DNS / IP'}
                  </div>
                </div>
              </div>

              {/* Middle: broken links vs Service hub */}
              {phase === 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-center gap-6 text-[10px] text-rose-400 font-bold">
                    <span className="flex flex-col items-center gap-1">
                      <span className="opacity-60">╳ broken</span>
                      <span className="h-6 w-px bg-rose-500/50" />
                    </span>
                    <span className="flex flex-col items-center gap-1">
                      <span className="opacity-60">╳ stale IP</span>
                      <span className="h-6 w-px bg-rose-500/50" />
                    </span>
                    <span className="flex flex-col items-center gap-1">
                      <span className="opacity-60">╳ which Pod?</span>
                      <span className="h-6 w-px bg-rose-500/50" />
                    </span>
                  </div>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {SERVICE_PODS.map((p, i) => {
                      const dead = i === 1;
                      return (
                        <div
                          key={p.id}
                          className={`rounded-xl border px-3 py-3 w-[7.5rem] text-center transition ${
                            dead
                              ? 'border-rose-500 bg-rose-500/15 opacity-50'
                              : 'border-sky-400/40 bg-sky-500/10'
                          }`}
                        >
                          <Box className={`w-4 h-4 mx-auto mb-1 ${dead ? 'text-rose-400' : 'text-sky-300'}`} />
                          <div className="text-[10px] font-bold text-white">Inference Pod</div>
                          <div className="text-[9px] font-mono text-gray-500 mt-0.5">
                            {dead ? 'IP gone forever' : p.ip}
                          </div>
                          {dead && (
                            <div className="text-[8px] text-rose-300 mt-1 flex items-center justify-center gap-0.5">
                              <AlertTriangle className="w-3 h-3" /> recreated later ≠ same IP
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-center text-xs text-rose-200/90 leading-relaxed max-w-md mx-auto">
                    Deployments keep Pods alive, but each Pod’s IP is ephemeral. Dialing Pod IPs
                    directly breaks whenever a Pod is replaced.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <div className="h-5 w-px bg-amber-400/60" />
                  </div>
                  <div className="mx-auto max-w-sm rounded-xl border-2 border-amber-400 bg-amber-500/15 px-4 py-3 text-center relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-[9px] font-bold text-white whitespace-nowrap">
                      Service — stable endpoint
                    </div>
                    <div className="text-sm font-bold text-amber-100 mt-1">model-api.svc.cluster.local</div>
                    <div className="font-mono text-xs text-amber-200/80 mt-0.5">10.96.0.50 (never changes)</div>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[10px] text-amber-100 border border-amber-400/40">
                      selector: <span className="font-mono text-rose-300">app: model-server</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className={`h-5 w-0.5 transition ${
                            phase >= 2 && trafficTarget === i
                              ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                              : 'bg-gray-600'
                          }`}
                        />
                        <div
                          className={`text-[9px] mb-0.5 transition ${
                            phase >= 2 && trafficTarget === i ? 'text-amber-300 font-bold' : 'text-transparent'
                          }`}
                        >
                          ▾ traffic
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-2 flex-wrap">
                    {SERVICE_PODS.map((p, i) => {
                      const hit = phase >= 2 && trafficTarget === i;
                      return (
                        <div
                          key={p.id}
                          className={`rounded-xl border px-3 py-3 w-[7.5rem] text-center transition ${
                            hit
                              ? 'border-amber-400 bg-amber-500/20 scale-105 shadow-lg shadow-amber-500/20'
                              : 'border-sky-400/40 bg-sky-500/10'
                          }`}
                        >
                          <Box className={`w-4 h-4 mx-auto mb-1 ${hit ? 'text-amber-300' : 'text-sky-300'}`} />
                          <div className="text-[10px] font-bold text-white">Pod {i + 1}</div>
                          <div className="text-[8px] font-mono text-rose-300/90 mt-0.5">{p.label}</div>
                          <div className="text-[9px] font-mono text-gray-500">{p.ip}</div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-center text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
                    {phase === 1 ? (
                      <>
                        The Service owns a <strong className="text-white">persistent IP + DNS name</strong>.
                        It finds Pods via matching <strong className="text-rose-300">labels</strong> — the
                        same idea Deployments use.
                      </>
                    ) : (
                      <>
                        Incoming requests hit the Service, which{' '}
                        <strong className="text-amber-300">load-balances</strong> across healthy Pods.
                        Watch the amber pulse hop between replicas.
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-2">
              <button
                type="button"
                disabled={phase === 0}
                onClick={() => setPhase((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 disabled:opacity-30"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={phase === 2}
                onClick={() => setPhase((p) => Math.min(2, p + 1))}
                className="px-3 py-1.5 rounded-lg bg-amber-600 text-xs font-bold text-white disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── ClusterIP ─────────────────────────────────────────────────── */}
        {tab === 'clusterip' && (
          <div className="space-y-3">
            <div className="rounded-2xl border-2 border-dashed border-sky-400/45 p-4 relative">
              <div className="text-[10px] font-bold text-sky-300 uppercase tracking-wider mb-3">
                Cluster boundary
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2">
                <div className="rounded-xl border border-violet-400/50 bg-violet-500/20 px-4 py-3 text-center min-w-[7rem]">
                  <div className="text-xs font-bold text-violet-100">Frontend Pod</div>
                  <div className="text-[9px] text-gray-400 mt-0.5">web UI / gateway</div>
                </div>

                <div className="text-amber-400 font-bold text-lg md:rotate-0 rotate-90">→</div>

                <div className="rounded-xl border-2 border-amber-400 bg-amber-500/15 px-4 py-3 text-center min-w-[9rem] relative">
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded">
                    ClusterIP
                  </div>
                  <div className="text-xs font-bold text-amber-100 mt-0.5">inference-svc</div>
                  <div className="font-mono text-[10px] text-amber-200/80">10.96.12.8</div>
                  <div className="text-[8px] text-gray-400 mt-1">internal only</div>
                </div>

                <div className="text-amber-400 font-bold text-lg md:rotate-0 rotate-90">→</div>

                <div className="flex flex-col gap-1.5">
                  {[0, 1, 2].map((i) => {
                    const hit = trafficTarget === i && pulse;
                    return (
                      <div
                        key={i}
                        className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold transition ${
                          hit
                            ? 'border-amber-400 bg-amber-500/25 text-amber-100'
                            : 'border-sky-400/40 bg-sky-500/15 text-sky-100'
                        }`}
                      >
                        Inference Pod {i + 1}
                        <span className="ml-2 font-mono text-[8px] text-gray-500 font-normal">
                          app: model-server
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-sky-500/10 border border-sky-400/30 px-3 py-2">
                <CheckCircle className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                <p className="text-xs text-sky-100/90 leading-relaxed">
                  <strong className="text-white">ClusterIP</strong> is the default. The Service IP is
                  reachable <em>only inside</em> the cluster — ideal when a frontend Pod calls a
                  backend inference API. Nothing from the public internet can hit this address.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-100">
                ✓ Inside cluster
              </div>
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-200">
                ✗ Public internet blocked
              </div>
            </div>
          </div>
        )}

        {/* ── LoadBalancer ──────────────────────────────────────────────── */}
        {tab === 'lb' && (
          <div className="space-y-3">
            {/* External world */}
            <div className="flex justify-center">
              <div
                className={`rounded-xl border px-4 py-2 flex items-center gap-2 transition ${
                  pulse ? 'border-emerald-400 bg-emerald-500/20' : 'border-emerald-400/40 bg-emerald-500/10'
                }`}
              >
                <Globe className="w-4 h-4 text-emerald-300" />
                <div>
                  <div className="text-xs font-bold text-emerald-100">External user / Internet</div>
                  <div className="text-[9px] text-gray-400">HTTPS request to public IP</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center text-amber-400 text-sm font-bold">↓</div>

            <div className="relative rounded-2xl border-2 border-dashed border-sky-400/45 p-4 pt-5">
              <div className="absolute -top-2.5 left-4 px-2 bg-gray-950 text-[10px] font-bold text-sky-300 uppercase tracking-wider">
                Cluster boundary
              </div>

              {/* LB straddling concept */}
              <div className="mx-auto max-w-xs rounded-xl border-2 border-amber-400 bg-amber-500/15 px-4 py-3 text-center mb-3 relative">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded whitespace-nowrap">
                  LoadBalancer Service
                </div>
                <div className="text-sm font-bold text-amber-100 mt-0.5">inference-api-lb</div>
                <div className="font-mono text-xs text-amber-200">203.0.113.10</div>
                <div className="text-[9px] text-gray-400 mt-1">
                  Cloud LB (AWS / GCP / Azure) → cluster Pods
                </div>
                <div className="mt-2 inline-flex rounded-full bg-black/30 border border-amber-400/40 px-2 py-0.5 text-[9px] text-rose-300 font-mono">
                  selector: app=model-server
                </div>
              </div>

              <div className="text-center text-[10px] text-gray-500 mb-2">
                routes to healthy Pods · Deployment keeps {healthyCount} replicas
              </div>

              <div className="flex justify-center gap-2 flex-wrap">
                {SERVICE_PODS.map((p, i) => {
                  const dead = podDead && i === 1;
                  const hit = !dead && trafficTarget === i;
                  return (
                    <div
                      key={p.id}
                      className={`rounded-xl border px-3 py-3 w-[7rem] text-center transition ${
                        dead
                          ? 'border-rose-500 bg-rose-500/20 opacity-40'
                          : hit
                            ? 'border-amber-400 bg-amber-500/20 scale-105'
                            : 'border-sky-400/50 bg-sky-500/15'
                      }`}
                    >
                      <Box className={`w-4 h-4 mx-auto mb-1 ${dead ? 'text-rose-400' : hit ? 'text-amber-300' : 'text-sky-300'}`} />
                      <div className="text-[10px] font-bold text-white">Pod {i + 1}</div>
                      <div className="text-[8px] font-mono text-gray-500">
                        {dead ? 'IP gone' : p.ip}
                      </div>
                      {hit && !dead && (
                        <div className="text-[8px] text-amber-300 font-bold mt-1">← request</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPodDead((d) => !d)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
            >
              {podDead
                ? '✓ External IP still 203.0.113.10 — traffic skips dead Pod'
                : 'Kill Pod 2 (simulate recreate / IP churn)'}
            </button>

            <div className="rounded-lg bg-amber-500/10 border border-amber-400/30 px-3 py-2 text-xs text-gray-300 leading-relaxed">
              An external request hits the stable{' '}
              <strong className="text-amber-200">LoadBalancer IP</strong>; the Service routes to a
              Pod matching its label selector. The Deployment keeps the desired number of Pods
              running — even if one dies and gets a new IP.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
