import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Server,
  Cpu,
  Database,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Layers,
  Zap,
  Code,
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

/* ── 1. Big Three overview ────────────────────────────────────────────────── */

const PROVIDERS = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    short: 'AWS',
    tone: 'border-sky-400 bg-sky-100 text-sky-950',
    chip: 'bg-sky-500',
    claim: 'Largest share · longest track record',
    points: [
      'End-to-end managed platform: SageMaker',
      'Raw GPU VMs: EC2 P-series & G-series',
      'Custom silicon: Trainium (train) & Inferentia (serve)',
      'Data lake default: Amazon S3',
    ],
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    short: 'GCP',
    tone: 'border-emerald-400 bg-emerald-100 text-emerald-950',
    chip: 'bg-emerald-500',
    claim: 'Research DNA · TensorFlow & Transformers',
    points: [
      'Unified managed platform: Vertex AI',
      'Custom ASICs: Tensor Processing Units (TPUs)',
      'Also NVIDIA GPUs via Compute Engine',
      'Data: Cloud Storage + BigQuery',
    ],
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    short: 'Azure',
    tone: 'border-violet-400 bg-violet-100 text-violet-950',
    chip: 'bg-violet-500',
    claim: 'Enterprise foothold · Microsoft stack',
    points: [
      'Hub: Azure Machine Learning',
      'Code-first SDK and low-code Designer',
      'GPU VMs: NC-series & ND-series',
      'Data: Blob Storage + Databricks',
    ],
  },
];

export function BigThreeVisualizer() {
  const [sel, setSel] = useState('aws');
  const p = PROVIDERS.find((x) => x.id === sel);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-white mb-1">The Big Three</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          AWS, GCP, and Azure all cover the fundamentals — but each has a different centre of gravity.
          Tap a provider.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full grid grid-cols-3 gap-2 mb-4">
        {PROVIDERS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setSel(x.id)}
            className={`rounded-xl border-2 px-2 py-3 text-center transition ${
              sel === x.id ? x.tone : 'border-gray-700 bg-gray-950 text-gray-400'
            }`}
          >
            <div className="text-sm font-bold">{x.short}</div>
          </button>
        ))}
      </div>

      <div className={`max-w-2xl mx-auto w-full rounded-2xl border-2 p-4 mb-3 ${p.tone}`}>
        <div className="font-bold text-lg mb-0.5">{p.name}</div>
        <div className="text-[11px] opacity-70 mb-3">{p.claim}</div>
        <ul className="space-y-2">
          {p.points.map((line) => (
            <li key={line} className="flex items-start gap-2 text-sm">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${p.chip}`} />
              {line}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-gray-400 text-center max-w-2xl mx-auto">
        Success in the cloud starts with knowing each platform’s philosophy, flagship service, and
        specialised hardware — not just the logo.
      </p>
    </div>
  );
}

/* ── 2. AWS stack ─────────────────────────────────────────────────────────── */

const SAGE_STEPS = [
  { id: 'label', label: 'Data labeling' },
  { id: 'feat', label: 'Feature engineering' },
  { id: 'build', label: 'Build (notebooks)' },
  { id: 'train', label: 'Train' },
  { id: 'deploy', label: 'One-click deploy' },
];

export function AwsStackVisualizer() {
  const [step, setStep] = useState('train');
  const [compute, setCompute] = useState('p');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">AWS for AI</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          SageMaker as the managed roof, EC2 and custom silicon as the floors, S3 as the foundation.
        </p>
      </div>

      {/* SageMaker lifecycle */}
      <div className="max-w-2xl mx-auto w-full mb-3">
        <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider mb-2 text-center">
          Amazon SageMaker · end-to-end
        </div>
        <div className="flex items-center gap-1">
          {SAGE_STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                type="button"
                onClick={() => setStep(s.id)}
                className={`flex-1 rounded-lg border px-1 py-2 text-[9px] font-bold leading-tight transition ${
                  step === s.id
                    ? 'border-sky-400 bg-sky-500 text-white'
                    : 'border-gray-700 bg-gray-900 text-gray-400'
                }`}
              >
                {s.label}
              </button>
              {i < SAGE_STEPS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-gray-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* EC2 families */}
      <div className="max-w-2xl mx-auto w-full mb-3">
        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 text-center">
          EC2 GPU families
        </div>
        <Tabs
          value={compute}
          onChange={setCompute}
          accent="bg-brand-orange"
          options={[
            { id: 'p', label: 'P-series (train hard)' },
            { id: 'g', label: 'G-series (cost / infer)' },
            { id: 'custom', label: 'Trainium & Inferentia' },
          ]}
        />
        <div className="rounded-xl border border-gray-700 bg-gray-950 p-3 text-sm text-gray-300">
          {compute === 'p' && (
            <>
              <strong className="text-white">P-series</strong> — high-performance NVIDIA GPUs (e.g.
              A100) for large-scale distributed training. Buy when the job is FLOPs-bound.
            </>
          )}
          {compute === 'g' && (
            <>
              <strong className="text-white">G-series</strong> — cost-effective GPUs for graphics and
              smaller training / inference jobs. Buy when the bill matters more than peak throughput.
            </>
          )}
          {compute === 'custom' && (
            <>
              <strong className="text-brand-orange">Trainium</strong> is purpose-built for training
              cost; <strong className="text-brand-orange">Inferentia</strong> for low-latency
              serving. Both plug into SageMaker and common frameworks.
            </>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full rounded-xl border border-amber-700/40 bg-amber-950/20 p-3 flex items-center gap-3">
        <Database className="w-5 h-5 text-amber-400 shrink-0" />
        <div>
          <div className="text-xs font-bold text-white">Amazon S3</div>
          <div className="text-[11px] text-gray-400">
            The default data lake for AWS AI workloads — object storage under almost every pipeline.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 3. GCP stack ─────────────────────────────────────────────────────────── */

export function GcpStackVisualizer() {
  const [hw, setHw] = useState('tpu');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">GCP for AI</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Research roots (TensorFlow, Transformers) show up as purpose-built services and silicon.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full rounded-xl border-2 border-emerald-500 bg-emerald-100 text-emerald-950 p-4 mb-3 text-center">
        <div className="text-xs font-bold uppercase tracking-wider opacity-70">Managed platform</div>
        <div className="text-xl font-extrabold">Vertex AI</div>
        <div className="text-[11px] mt-1 opacity-80">
          Data · training · MLOps (tracking & serving) in one environment
        </div>
      </div>

      <Tabs
        value={hw}
        onChange={setHw}
        accent="bg-brand-orange"
        options={[
          { id: 'tpu', label: 'TPUs (Google ASIC)' },
          { id: 'gpu', label: 'NVIDIA GPUs' },
        ]}
      />

      <div className="max-w-xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-4 mb-3">
        {hw === 'tpu' ? (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-200 text-orange-950 px-4 py-2 text-sm font-bold mb-3">
              <Cpu className="w-4 h-4" /> Tensor Processing Unit
            </div>
            <p className="text-sm text-gray-300">
              An ASIC tuned for matrix math. For large TensorFlow / JAX training jobs, TPUs often win
              on <strong className="text-white">performance per dollar</strong> versus GPUs.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-200 text-sky-950 px-4 py-2 text-sm font-bold mb-3">
              <Zap className="w-4 h-4" /> Compute Engine + NVIDIA
            </div>
            <p className="text-sm text-gray-300">
              Prefer CUDA ecosystems, PyTorch defaults, or multi-vendor portability? Attach NVIDIA
              GPUs to ordinary Compute Engine VMs.
            </p>
          </div>
        )}
      </div>

      <div className="max-w-xl mx-auto w-full grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-gray-700 bg-gray-950 p-3">
          <Database className="w-4 h-4 text-emerald-400 mb-1" />
          <div className="text-xs font-bold text-white">Cloud Storage</div>
          <div className="text-[10px] text-gray-400">Scalable object store for datasets</div>
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-950 p-3">
          <Layers className="w-4 h-4 text-emerald-400 mb-1" />
          <div className="text-xs font-bold text-white">BigQuery</div>
          <div className="text-[10px] text-gray-400">Serverless warehouse for prep</div>
        </div>
      </div>
    </div>
  );
}

/* ── 4. Azure stack ───────────────────────────────────────────────────────── */

export function AzureStackVisualizer() {
  const [style, setStyle] = useState('sdk');
  const [series, setSeries] = useState('nd');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Azure for AI</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Enterprise gravity, plus two ways to build: code-first or low-code.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full rounded-xl border-2 border-violet-400 bg-violet-100 text-violet-950 p-4 mb-3 text-center">
        <div className="text-xs font-bold uppercase tracking-wider opacity-70">Managed platform</div>
        <div className="text-xl font-extrabold">Azure Machine Learning</div>
      </div>

      <Tabs
        value={style}
        onChange={setStyle}
        accent="bg-violet-600"
        options={[
          { id: 'sdk', label: 'Python SDK (code-first)' },
          { id: 'designer', label: 'Visual Designer (low-code)' },
        ]}
      />

      <div className="max-w-xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3 text-sm text-gray-300 text-center">
        {style === 'sdk' ? (
          <>
            <Code className="w-5 h-5 mx-auto text-violet-400 mb-1" />
            Full control via the Python SDK — preferred by ML engineers who live in notebooks and
            CI pipelines.
          </>
        ) : (
          <>
            <Box className="w-5 h-5 mx-auto text-violet-400 mb-1" />
            Drag-and-drop Designer for building and deploying models with less code — useful when
            bridging data scientists and business users.
          </>
        )}
      </div>

      <div className="max-w-xl mx-auto w-full mb-3">
        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 text-center">
          GPU-enabled VMs
        </div>
        <Tabs
          value={series}
          onChange={setSeries}
          accent="bg-brand-orange"
          options={[
            { id: 'nc', label: 'NC-series' },
            { id: 'nd', label: 'ND-series' },
          ]}
        />
        <div className="rounded-xl border border-gray-700 bg-gray-950 p-3 text-sm text-gray-300">
          {series === 'nc' ? (
            <>
              <strong className="text-white">NC-series</strong> — compute-intensive and HPC
              workloads on modern NVIDIA GPUs. General accelerated compute.
            </>
          ) : (
            <>
              <strong className="text-white">ND-series</strong> — deep learning training with
              high-end GPUs and fast interconnects for distributed jobs.
            </>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto w-full grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-gray-700 bg-gray-950 p-3">
          <div className="text-xs font-bold text-white">Azure Blob Storage</div>
          <div className="text-[10px] text-gray-400">Scalable object storage</div>
        </div>
        <div className="rounded-xl border border-gray-700 bg-gray-950 p-3">
          <div className="text-xs font-bold text-white">Azure Databricks</div>
          <div className="text-[10px] text-gray-400">Large-scale data + tight AML link</div>
        </div>
      </div>
    </div>
  );
}

/* ── 5. Comparing service stacks diagram ──────────────────────────────────── */

const STACKS = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    head: 'bg-sky-200 text-sky-950 border-sky-400',
    platform: { name: 'Amazon SageMaker', cls: 'bg-teal-300 text-teal-950 border-teal-500' },
    hardware: { name: 'Trainium & Inferentia', cls: 'bg-orange-200 text-orange-950 border-orange-400' },
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    head: 'bg-emerald-200 text-emerald-950 border-emerald-400',
    platform: { name: 'Vertex AI', cls: 'bg-lime-300 text-lime-950 border-lime-500' },
    hardware: { name: 'Tensor Processing Units (TPUs)', cls: 'bg-orange-200 text-orange-950 border-orange-400' },
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    head: 'bg-violet-200 text-violet-950 border-violet-400',
    platform: { name: 'Azure Machine Learning', cls: 'bg-indigo-200 text-indigo-950 border-indigo-400' },
    hardware: null,
  },
];

export function ServiceStacksVisualizer() {
  const [sel, setSel] = useState('aws');
  const s = STACKS.find((x) => x.id === sel);

  const blurbs = {
    aws: 'Breadth-first: a full managed ML suite plus custom train/serve silicon.',
    gcp: 'Research-first: unified Vertex AI plus TPUs that shine on matrix-heavy jobs.',
    azure: 'Enterprise-first: Azure ML as the hub; GPU IaaS without a public custom ASIC brand in this stack view.',
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Comparing the AI Service Stacks</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Same fundamental pieces — different philosophies. Click a cloud.
        </p>
      </div>

      <div className="max-w-3xl mx-auto w-full grid grid-cols-3 gap-3 mb-3">
        {STACKS.map((col) => (
          <button
            key={col.id}
            type="button"
            onClick={() => setSel(col.id)}
            className={`rounded-xl border-2 p-2 text-center transition ${
              sel === col.id ? 'border-white/40 bg-white/5' : 'border-transparent opacity-70'
            }`}
          >
            <div className={`rounded-full border px-2 py-2 text-[10px] font-bold mb-2 ${col.head}`}>
              {col.name}
            </div>
            <div className="text-gray-500 text-xs mb-1">↓</div>
            <div className={`rounded-full border px-2 py-2 text-[10px] font-bold mb-1 ${col.platform.cls}`}>
              {col.platform.name}
            </div>
            {col.hardware ? (
              <>
                <div className="text-gray-500 text-xs mb-1">↓</div>
                <div className={`rounded-full border px-2 py-2 text-[10px] font-bold ${col.hardware.cls}`}>
                  {col.hardware.name}
                </div>
              </>
            ) : (
              <div className="mt-3 text-[9px] text-gray-500 italic">no custom ASIC called out</div>
            )}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-sm text-gray-300 text-center">
        <strong className="text-white">{s.name}: </strong>
        {blurbs[sel]}
      </div>
      <p className="text-[11px] text-gray-500 text-center max-w-2xl mx-auto mt-2 italic">
        Each provides a comprehensive managed platform; AWS and GCP also ship their own AI
        accelerators.
      </p>
    </div>
  );
}

/* ── 6. IaaS workflow ─────────────────────────────────────────────────────── */

const IAAS_STEPS = [
  {
    id: 1,
    title: 'Provision a VM',
    detail:
      'Pick EC2 / Compute Engine / Azure VM. Choose CPU, RAM, and which GPUs — you are ordering bare metal in the cloud.',
  },
  {
    id: 2,
    title: 'Configure the environment',
    detail:
      'SSH in and act as sysadmin: OS, NVIDIA drivers, CUDA, Python, PyTorch/TensorFlow versions — all on you.',
  },
  {
    id: 3,
    title: 'Manage data and code',
    detail: 'Copy datasets into cloud storage or local disks, keep your repo and secrets under control.',
  },
  {
    id: 4,
    title: 'Execute the workload',
    detail: 'Launch training or inference from the CLI or your own automation. Nothing tears itself down for you.',
  },
];

export function IaasWorkflowVisualizer() {
  const [step, setStep] = useState(0);
  const s = IAAS_STEPS[step];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">IaaS: Leasing Bare Metal in the Cloud</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Raw compute, storage, and networking. Everything above virtualization is your job.
        </p>
      </div>

      <div className="max-w-md mx-auto w-full mb-3">
        {IAAS_STEPS.map((x, i) => (
          <div key={x.id}>
            {i > 0 && <div className="text-center text-gray-600 text-xs">↓</div>}
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`w-full rounded-xl border-2 px-3 py-2 text-left text-xs font-bold transition ${
                i === step
                  ? 'border-brand-orange bg-brand-orange/10 text-white'
                  : 'border-gray-700 bg-gray-900 text-gray-400'
              }`}
            >
              {x.id}. {x.title}
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-md mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3">
        <p className="text-sm text-gray-300">{s.detail}</p>
      </div>

      <div className="max-w-md mx-auto w-full grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-brand-green/40 bg-brand-green/10 p-3">
          <div className="text-[10px] text-brand-green font-bold uppercase mb-1">Advantage</div>
          <div className="text-xs text-gray-200">Ultimate control — custom stacks, odd libraries, proprietary binaries.</div>
        </div>
        <div className="rounded-xl border border-brand-rose/40 bg-brand-rose/10 p-3">
          <div className="text-[10px] text-brand-rose font-bold uppercase mb-1">Cost</div>
          <div className="text-xs text-gray-200">High ops overhead — patches, drivers, slower time-to-first-experiment.</div>
        </div>
      </div>
    </div>
  );
}

/* ── 7. Managed services workflow ─────────────────────────────────────────── */

const MANAGED_STEPS = [
  {
    id: 1,
    title: 'Define a job',
    detail: 'Training job or endpoint via UI, SDK, or config file — not a hand-built VM.',
  },
  {
    id: 2,
    title: 'Specify resources',
    detail: 'Still pick instance type and count (e.g. ml.g4dn.xlarge) — but you never SSH into them.',
  },
  {
    id: 3,
    title: 'Provide script or container',
    detail: 'Point at code or a Docker image. The platform provisions, runs, and tears down.',
  },
  {
    id: 4,
    title: 'Leverage integrated tools',
    detail: 'Built-in HPO, experiment tracking, one-click deploy, and auto-scaling.',
  },
];

export function ManagedWorkflowVisualizer() {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    if (!busy) return undefined;
    setPhase('provision');
    const t1 = setTimeout(() => setPhase('run'), 900);
    const t2 = setTimeout(() => setPhase('teardown'), 2000);
    const t3 = setTimeout(() => {
      setPhase('done');
      setBusy(false);
    }, 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [busy]);

  const s = MANAGED_STEPS[step];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Managed AI: An Integrated Platform</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          SageMaker, Vertex AI, Azure ML — infrastructure abstracted; lifecycle tools bundled.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full flex gap-1 mb-3">
        {MANAGED_STEPS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setStep(i)}
            className={`flex-1 rounded-lg border px-1 py-2 text-[9px] font-bold leading-tight ${
              step === i
                ? 'border-brand-green bg-brand-green text-white'
                : 'border-gray-700 bg-gray-900 text-gray-400'
            }`}
          >
            {x.id}. {x.title}
          </button>
        ))}
      </div>

      <div className="max-w-xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3 mb-3 text-sm text-gray-300">
        {s.detail}
      </div>

      {/* provision animation */}
      <div className="max-w-xl mx-auto w-full rounded-xl border border-gray-700 bg-black/40 p-3 mb-3">
        <div className="text-[10px] text-gray-500 mb-2 text-center">What the platform does for you</div>
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
          {['provision', 'run', 'teardown'].map((p) => (
            <div
              key={p}
              className={`flex-1 rounded-lg border py-3 text-center capitalize transition ${
                phase === p || (phase === 'done' && p === 'teardown')
                  ? 'border-brand-green bg-brand-green/20 text-brand-green'
                  : 'border-gray-700 text-gray-600'
              }`}
            >
              {p}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setBusy(true)}
          disabled={busy}
          className="w-full mt-3 py-2 rounded-lg bg-brand-green hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-bold"
        >
          {busy ? 'Job running…' : phase === 'done' ? 'Run another training job' : 'Submit a training job'}
        </button>
      </div>

      <div className="max-w-xl mx-auto w-full grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-brand-green/40 bg-brand-green/10 p-3">
          <div className="text-[10px] text-brand-green font-bold uppercase mb-1">Benefit</div>
          <div className="text-xs text-gray-200">Productivity — idea → trained model faster, MLOps path included.</div>
        </div>
        <div className="rounded-xl border border-brand-orange/40 bg-brand-orange/10 p-3">
          <div className="text-[10px] text-brand-orange font-bold uppercase mb-1">Trade-off</div>
          <div className="text-xs text-gray-200">Less flexibility + vendor lock-in via platform SDKs.</div>
        </div>
      </div>
    </div>
  );
}

/* ── 8. Responsibility stacks ─────────────────────────────────────────────── */

const LAYERS_IAAS = [
  { label: 'Your Model & Application Code', you: true },
  { label: 'Frameworks & Dependencies', you: true },
  { label: 'OS & Drivers (e.g. CUDA)', you: true },
  { label: 'Hardware & Virtualization', you: false },
];

const LAYERS_MANAGED = [
  { label: 'Your Model & Application Code', you: true },
  { label: 'ML Platform (SDKs, HPO, …)', you: false },
  { label: 'Frameworks & Dependencies', you: false },
  { label: 'OS & Drivers (e.g. CUDA)', you: false },
  { label: 'Hardware & Virtualization', you: false },
];

export function ResponsibilityStackVisualizer() {
  const [mode, setMode] = useState('iaas');
  const layers = mode === 'iaas' ? LAYERS_IAAS : LAYERS_MANAGED;
  const yours = layers.filter((l) => l.you).length;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Comparing Responsibilities</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          The real difference is who owns each layer of the stack.
        </p>
      </div>

      <Tabs
        value={mode}
        onChange={setMode}
        accent={mode === 'iaas' ? 'bg-brand-blue' : 'bg-brand-green'}
        options={[
          { id: 'iaas', label: 'IaaS (EC2 / GCE / Azure VM)' },
          { id: 'managed', label: 'Managed (SageMaker / Vertex / AML)' },
        ]}
      />

      <div className="max-w-md mx-auto w-full mb-2 flex justify-center gap-3 text-[10px]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-sky-400" /> Managed by You
        </span>
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="w-3 h-3 rounded bg-gray-600" /> Managed by Cloud Provider
        </span>
      </div>

      <div className="max-w-md mx-auto w-full space-y-1.5 mb-3">
        {layers.map((l) => (
          <div
            key={l.label}
            className={`rounded-xl border-2 px-3 py-2.5 text-center text-xs font-bold transition-all duration-500 ${
              l.you
                ? 'border-sky-400 bg-sky-200 text-sky-950'
                : 'border-gray-600 bg-gray-700 text-gray-200'
            }`}
          >
            {l.label}
          </div>
        ))}
      </div>

      <p className="text-sm text-center max-w-md mx-auto text-gray-300">
        {mode === 'iaas' ? (
          <>
            You own <strong className="text-sky-300">{yours} of {layers.length} layers</strong> —
            from the OS upward. The provider only guarantees the virtualized hardware.
          </>
        ) : (
          <>
            You own <strong className="text-sky-300">just the top layer</strong>. The provider runs
            the platform, frameworks, drivers, and hardware — you bring the model and application
            code.
          </>
        )}
      </p>
    </div>
  );
}

/* ── 9. Making the right choice ───────────────────────────────────────────── */

const CHOICE_QS = [
  {
    id: 'team',
    q: 'Who is on the team?',
    options: [
      { id: 'devops', label: 'Strong DevOps / MLOps', lean: 'iaas' },
      { id: 'ds', label: 'Mostly data scientists', lean: 'managed' },
    ],
  },
  {
    id: 'goal',
    q: 'What matters most right now?',
    options: [
      { id: 'custom', label: 'Custom / unsupported stack', lean: 'iaas' },
      { id: 'speed', label: 'Speed of experimentation', lean: 'managed' },
    ],
  },
  {
    id: 'ops',
    q: 'How do you feel about ops burden?',
    options: [
      { id: 'own', label: 'We will own patches & drivers', lean: 'iaas' },
      { id: 'pay', label: 'Pay a premium to offload it', lean: 'managed' },
    ],
  },
];

export function ChoiceDecisionVisualizer() {
  const [answers, setAnswers] = useState({});
  const [showHybrid, setShowHybrid] = useState(false);

  const votes = Object.values(answers);
  const iaasN = votes.filter((v) => v === 'iaas').length;
  const managedN = votes.filter((v) => v === 'managed').length;
  const done = votes.length === CHOICE_QS.length;
  const verdict = iaasN > managedN ? 'iaas' : managedN > iaasN ? 'managed' : 'hybrid';

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Making the Right Choice</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Skills, requirements, and goals — answer three questions.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full space-y-2 mb-3">
        {CHOICE_QS.map((q) => (
          <div key={q.id} className="rounded-xl border border-gray-700 bg-gray-950 p-3">
            <div className="text-xs font-bold text-white mb-2">{q.q}</div>
            <div className="flex gap-2">
              {q.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.lean }))}
                  className={`flex-1 py-2 text-[11px] rounded-lg border font-bold ${
                    answers[q.id] === o.lean
                      ? o.lean === 'iaas'
                        ? 'bg-brand-blue border-brand-blue text-white'
                        : 'bg-brand-green border-brand-green text-white'
                      : 'bg-gray-900 border-gray-600 text-gray-400'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {done && (
        <div
          className={`max-w-xl mx-auto w-full rounded-xl border-2 p-3 mb-3 ${
            verdict === 'iaas'
              ? 'border-brand-blue bg-brand-blue/10'
              : verdict === 'managed'
                ? 'border-brand-green bg-brand-green/10'
                : 'border-brand-orange bg-brand-orange/10'
          }`}
        >
          <div className="font-bold text-white mb-1 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            {verdict === 'iaas' && 'Lean IaaS'}
            {verdict === 'managed' && 'Lean Managed AI'}
            {verdict === 'hybrid' && 'A hybrid is natural'}
          </div>
          <p className="text-sm text-gray-300">
            {verdict === 'iaas' &&
              'You have the ops muscle and need custom environments or hourly cost control on long stable jobs.'}
            {verdict === 'managed' &&
              'Accelerate the ML cycle, keep scientists on modeling, and buy a ready MLOps path.'}
            {verdict === 'hybrid' &&
              'Your answers split — many teams mix both. See the hybrid pattern below.'}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowHybrid((v) => !v)}
        className="max-w-xl mx-auto w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 mb-2"
      >
        {showHybrid ? 'Hide hybrid pipeline' : 'Show a common hybrid pattern'}
      </button>

      {showHybrid && (
        <div className="max-w-xl mx-auto w-full rounded-xl border border-gray-700 bg-gray-950 p-3">
          <div className="flex items-center gap-1 text-[10px] font-bold">
            <div className="flex-1 rounded-lg border border-brand-blue bg-brand-blue/20 text-sky-200 py-3 text-center">
              Preprocess
              <div className="font-normal text-[8px] text-gray-400">IaaS VMs</div>
            </div>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <div className="flex-1 rounded-lg border border-brand-green bg-brand-green/20 text-emerald-200 py-3 text-center">
              Train
              <div className="font-normal text-[8px] text-gray-400">Managed</div>
            </div>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <div className="flex-1 rounded-lg border border-brand-green bg-brand-green/20 text-emerald-200 py-3 text-center">
              Host
              <div className="font-normal text-[8px] text-gray-400">Managed</div>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-2">
            Custom heavy ETL on raw VMs; training and serving on the managed platform. Mix and match
            as the team matures — the choice is not permanent.
          </p>
        </div>
      )}
    </div>
  );
}
