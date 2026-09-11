import React, { useState, useEffect } from 'react';
import {
  Laptop,
  Server,
  AlertTriangle,
  CheckCircle,
  Box,
  Layers,
  FileCode,
  Play,
  Zap,
  Package,
  Folder,
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

/* ── 1. It works on my machine ────────────────────────────────────────────── */

export function WorksOnMyMachineVisualizer() {
  const [mode, setMode] = useState('broken');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">&quot;It Works on My Machine&quot;</h3>
        <p className="text-gray-400 text-sm">Same code · different environments · different outcomes.</p>
      </div>

      <Tabs
        options={[
          { id: 'broken', label: 'Without Docker' },
          { id: 'fixed', label: 'With Docker' },
        ]}
        value={mode}
        onChange={setMode}
        accent={mode === 'fixed' ? 'bg-emerald-600' : 'bg-rose-600'}
      />

      <div className="max-w-xl mx-auto w-full grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-sky-500/40 bg-sky-500/10 p-4 text-center">
          <Laptop className="w-8 h-8 mx-auto text-sky-300 mb-2" />
          <div className="text-sm font-bold text-white mb-1">Laptop</div>
          <div className="text-[10px] text-gray-400 space-y-0.5 font-mono">
            <div>Python 3.9</div>
            <div>torch 1.13</div>
            <div>CUDA 11.8</div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-1 text-xs text-emerald-300 font-bold">
            <CheckCircle className="w-3.5 h-3.5" /> Works
          </div>
        </div>

        <div
          className={`rounded-2xl border p-4 text-center ${
            mode === 'broken'
              ? 'border-rose-500/40 bg-rose-500/10'
              : 'border-emerald-500/40 bg-emerald-500/10'
          }`}
        >
          <Server
            className={`w-8 h-8 mx-auto mb-2 ${mode === 'broken' ? 'text-rose-300' : 'text-emerald-300'}`}
          />
          <div className="text-sm font-bold text-white mb-1">Production / teammate</div>
          <div className="text-[10px] text-gray-400 space-y-0.5 font-mono">
            {mode === 'broken' ? (
              <>
                <div className="text-rose-300">Python 3.11</div>
                <div className="text-rose-300">torch 2.0</div>
                <div className="text-rose-300">CUDA 12.x</div>
              </>
            ) : (
              <>
                <div>Same container image</div>
                <div>Same deps everywhere</div>
                <div>Same CUDA stack</div>
              </>
            )}
          </div>
          <div
            className={`mt-3 flex items-center justify-center gap-1 text-xs font-bold ${
              mode === 'broken' ? 'text-rose-300' : 'text-emerald-300'
            }`}
          >
            {mode === 'broken' ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" /> Breaks
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5" /> Works
              </>
            )}
          </div>
        </div>
      </div>

      <p className="max-w-xl mx-auto mt-4 text-xs text-center text-gray-400">
        {mode === 'broken'
          ? 'Subtle version mismatches make deployments unreliable and collaboration painful.'
          : 'A container packages code + deps + config so it runs the same on any Docker host.'}
      </p>
    </div>
  );
}

/* ── 2. VM vs Container architecture ──────────────────────────────────────── */

export function VmVsContainerVisualizer() {
  const [side, setSide] = useState('compare');

  return (
    <div className="flex flex-col w-full h-full p-3 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">Containers vs Virtual Machines</h3>
        <p className="text-gray-400 text-sm">VMs emulate hardware · containers share the host kernel.</p>
      </div>

      <Tabs
        options={[
          { id: 'compare', label: 'Side by side' },
          { id: 'vm', label: 'VM only' },
          { id: 'ctr', label: 'Container only' },
        ]}
        value={side}
        onChange={setSide}
      />

      <div
        className={`max-w-2xl mx-auto w-full grid gap-3 ${
          side === 'compare' ? 'grid-cols-2' : 'grid-cols-1 max-w-sm'
        }`}
      >
        {(side === 'compare' || side === 'vm') && (
          <div className="rounded-2xl border-2 border-sky-400 bg-white p-3">
            <div className="text-center text-xs font-bold text-sky-800 mb-2">Virtual Machine Architecture</div>
            {['App', 'Bins / Libs', 'Guest OS', 'Hypervisor', 'Host OS', 'Infrastructure'].map(
              (layer, i) => (
                <div key={layer} className="flex flex-col items-center">
                  <div
                    className={`w-full rounded-lg px-2 py-1.5 text-center text-[11px] font-bold ${
                      layer === 'Infrastructure'
                        ? 'bg-gray-200 text-gray-700'
                        : layer === 'Hypervisor'
                          ? 'bg-sky-400 text-white'
                          : 'bg-sky-100 text-sky-900'
                    }`}
                  >
                    {layer}
                  </div>
                  {i < 5 && <div className="text-sky-400 text-[10px] leading-none my-0.5">↓</div>}
                </div>
              )
            )}
          </div>
        )}

        {(side === 'compare' || side === 'ctr') && (
          <div className="rounded-2xl border-2 border-emerald-400 bg-white p-3">
            <div className="text-center text-xs font-bold text-emerald-800 mb-2">Container Architecture</div>
            <div className="grid grid-cols-2 gap-1 mb-1">
              {['Container B', 'Container A'].map((c) => (
                <div key={c} className="rounded-lg border border-gray-300 p-1.5 bg-gray-50">
                  <div className="text-[9px] text-center text-gray-500 mb-1">{c}</div>
                  <div className="rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold text-center py-1 mb-0.5">
                    {c.includes('B') ? 'App B' : 'App A'}
                  </div>
                  <div className="rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold text-center py-1">
                    Bins / Libs
                  </div>
                </div>
              ))}
            </div>
            <div className="text-emerald-500 text-[10px] text-center leading-none my-0.5">↓ ↓</div>
            {['Container Engine (Docker)', 'Host OS', 'Infrastructure'].map((layer, i) => (
              <div key={layer} className="flex flex-col items-center">
                <div
                  className={`w-full rounded-lg px-2 py-1.5 text-center text-[11px] font-bold ${
                    layer === 'Infrastructure'
                      ? 'bg-gray-200 text-gray-700'
                      : layer.includes('Engine')
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {layer}
                </div>
                {i < 2 && <div className="text-emerald-500 text-[10px] leading-none my-0.5">↓</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="max-w-2xl mx-auto mt-3 text-[11px] text-center text-gray-400 italic">
        Containers share the host OS kernel via a container engine — lighter and faster than a full
        guest OS per app.
      </p>
    </div>
  );
}

/* ── 3. Dockerfile → Image → Container ────────────────────────────────────── */

const CORE = [
  {
    id: 'dockerfile',
    name: 'Dockerfile',
    icon: FileCode,
    tone: 'border-amber-400 bg-amber-500/10',
    points: [
      'Text recipe / blueprint',
      'FROM base image, install pkgs, COPY code',
      'Defines the startup command',
    ],
  },
  {
    id: 'image',
    name: 'Image',
    icon: Package,
    tone: 'border-sky-400 bg-sky-500/10',
    points: [
      'Read-only static template',
      'Built in layers · cached & shareable',
      'Stored in registries (Docker Hub, etc.)',
    ],
  },
  {
    id: 'container',
    name: 'Container',
    icon: Box,
    tone: 'border-emerald-400 bg-emerald-500/10',
    points: [
      'Live runnable instance of an image',
      'Own filesystem, net, process space',
      'Shares the host kernel',
    ],
  },
];

export function DockerCoreVisualizer() {
  const [sel, setSel] = useState('dockerfile');
  const c = CORE.find((x) => x.id === sel);
  const Icon = c.icon;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Core Components of Docker</h3>
        <p className="text-gray-400 text-sm">Recipe → snapshot → running process</p>
      </div>

      <div className="max-w-lg mx-auto w-full flex items-center justify-center gap-2 mb-4">
        {CORE.map((x, i) => (
          <React.Fragment key={x.id}>
            <button
              type="button"
              onClick={() => setSel(x.id)}
              className={`rounded-xl border px-3 py-3 text-center transition ${
                sel === x.id ? x.tone + ' scale-105' : 'border-gray-700 bg-gray-900 opacity-60'
              }`}
            >
              <x.icon className="w-5 h-5 mx-auto mb-1 text-white" />
              <div className="text-[10px] font-bold text-white">{x.name}</div>
            </button>
            {i < 2 && <span className="text-gray-600 font-bold">→</span>}
          </React.Fragment>
        ))}
      </div>

      <div className={`max-w-md mx-auto w-full rounded-2xl border p-4 ${c.tone}`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5 text-white" />
          <div className="text-white font-bold">{c.name}</div>
        </div>
        <ul className="text-sm text-gray-200 space-y-1.5">
          {c.points.map((p) => (
            <li key={p}>• {p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── 4. Why Docker for ML ─────────────────────────────────────────────────── */

export function WhyDockerMlVisualizer() {
  const [tab, setTab] = useState('venv');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Why Docker Beats venv Alone</h3>
        <p className="text-gray-400 text-sm">Python envs miss system libs, env vars, and CUDA stacks.</p>
      </div>

      <Tabs
        options={[
          { id: 'venv', label: 'venv / conda' },
          { id: 'docker', label: 'Docker' },
        ]}
        value={tab}
        onChange={setTab}
        accent={tab === 'docker' ? 'bg-emerald-600' : 'bg-amber-600'}
      />

      <div className="max-w-md mx-auto w-full space-y-2">
        {(tab === 'venv'
          ? [
              { ok: true, t: 'Python packages (pip / conda)' },
              { ok: false, t: 'System libraries (apt)' },
              { ok: false, t: 'Exact CUDA / cuDNN versions' },
              { ok: false, t: 'Environment variables' },
              { ok: false, t: 'Identical laptop ↔ cloud ↔ CI' },
            ]
          : [
              { ok: true, t: 'Complete dependency encapsulation' },
              { ok: true, t: 'Guaranteed reproducibility' },
              { ok: true, t: 'Share an image, not setup docs' },
              { ok: true, t: 'Train ↔ serve environment parity' },
              { ok: true, t: 'CI/CD runs the same artifact' },
            ]
        ).map((row) => (
          <div
            key={row.t}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${
              row.ok
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                : 'border-rose-500/30 bg-rose-500/5 text-rose-200/80'
            }`}
          >
            {row.ok ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            {row.t}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 5. ML image layers + cache ───────────────────────────────────────────── */

const ML_LAYERS = [
  { id: 'os', label: 'Base OS (e.g. Ubuntu)', color: 'bg-gray-500' },
  { id: 'cuda', label: 'NVIDIA CUDA + cuDNN', color: 'bg-rose-500' },
  { id: 'py', label: 'Python Environment', color: 'bg-amber-500' },
  { id: 'ml', label: 'ML Libraries (requirements.txt)', color: 'bg-sky-500' },
  { id: 'app', label: 'Your App Code (train.py)', color: 'bg-emerald-500' },
];

export function MlImageLayersVisualizer() {
  const [built, setBuilt] = useState(5);
  const [rebuild, setRebuild] = useState(false);

  useEffect(() => {
    if (!rebuild) return undefined;
    setBuilt(4); // bottom 4 cached
    const t = setTimeout(() => setBuilt(5), 900);
    return () => clearTimeout(t);
  }, [rebuild]);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">ML Docker Image Layers</h3>
        <p className="text-gray-400 text-sm">
          Stack from the base OS up — change only the top layer to rebuild fast.
        </p>
      </div>

      <div className="max-w-sm mx-auto w-full space-y-1.5 mb-4">
        {[...ML_LAYERS].reverse().map((layer, idx) => {
          const layerIndex = ML_LAYERS.length - 1 - idx;
          const visible = built > layerIndex;
          const cached = rebuild && layerIndex < 4 && visible;
          return (
            <div
              key={layer.id}
              className={`rounded-lg ${layer.color} px-3 py-2.5 text-center text-xs font-bold text-white transition-all duration-500 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-2'
              }`}
              style={{ marginLeft: idx * 6, marginRight: idx * 6 }}
            >
              {layer.label}
              {cached && <span className="ml-2 text-[9px] bg-black/30 px-1.5 py-0.5 rounded">cached</span>}
            </div>
          );
        })}
      </div>

      <div className="max-w-sm mx-auto w-full flex gap-2">
        <button
          type="button"
          onClick={() => {
            setRebuild(false);
            setBuilt(0);
            let i = 0;
            const iv = setInterval(() => {
              i += 1;
              setBuilt(i);
              if (i >= 5) clearInterval(iv);
            }, 350);
          }}
          className="flex-1 py-2 rounded-lg bg-sky-600 text-white text-xs font-bold"
        >
          Build from scratch
        </button>
        <button
          type="button"
          onClick={() => setRebuild((r) => !r)}
          className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
        >
          Rebuild (code only)
        </button>
      </div>
    </div>
  );
}

/* ── 6. Essential Dockerfile instructions ─────────────────────────────────── */

const INSTR = [
  {
    id: 'from',
    title: 'FROM — base image',
    body: 'Must be first. python:3.9-slim = CPU-only (no NVIDIA libs). nvidia/cuda:…-runtime = GPU path with CUDA + cuDNN. Prefer runtime over devel for training. Always pin versions — never latest.',
    code: 'FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04',
  },
  {
    id: 'workdir',
    title: 'WORKDIR + COPY',
    body: 'WORKDIR sets where later RUN/CMD/COPY run. Cache trick: COPY requirements.txt first → install → then COPY the rest of the app. Code changes won’t bust the dependency layer.',
    code: 'WORKDIR /app\nCOPY requirements.txt .',
  },
  {
    id: 'run',
    title: 'RUN — install deps',
    body: 'Each RUN adds a layer. Chain with && and \\ so apt + pip share one layer. Use pip --no-cache-dir so caches don’t bloat the image.',
    code: 'RUN apt-get update && \\\n    apt-get install -y python3-pip && \\\n    pip3 install --no-cache-dir -r requirements.txt',
  },
  {
    id: 'cmd',
    title: 'CMD — default start',
    body: 'Only one CMD per Dockerfile. Exec form (JSON array) is preferred: no shell, cleaner signal handling when the container stops.',
    code: 'CMD ["python3", "train.py", "--epochs", "10"]',
  },
];

export function DockerfileInstructionsVisualizer() {
  const [sel, setSel] = useState('from');
  const item = INSTR.find((x) => x.id === sel);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Essential Dockerfile Instructions</h3>
        <p className="text-gray-400 text-sm">Tap each instruction — see the pattern for ML images.</p>
      </div>

      <Tabs
        options={INSTR.map((x) => ({ id: x.id, label: x.id.toUpperCase() }))}
        value={sel}
        onChange={setSel}
        accent="bg-violet-600"
      />

      <div className="max-w-md mx-auto w-full rounded-2xl border border-gray-700 bg-gray-900/80 p-4 space-y-3">
        <div className="text-sm font-bold text-white">{item.title}</div>
        <p className="text-xs text-gray-400 leading-relaxed">{item.body}</p>
        <pre className="rounded-lg bg-black/60 border border-gray-700 p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
          {item.code}
        </pre>
      </div>
    </div>
  );
}

/* ── 7. Project tree + full Dockerfile walkthrough ────────────────────────── */

const DF_STEPS = [
  {
    id: 1,
    title: 'Base CUDA image',
    code: 'FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04',
    tip: 'Foundation with CUDA + cuDNN for GPU training.',
  },
  {
    id: 2,
    title: 'Noninteractive installs',
    code: 'ENV DEBIAN_FRONTEND=noninteractive',
    tip: 'Avoid apt prompts during automated builds.',
  },
  {
    id: 3,
    title: 'Working directory',
    code: 'WORKDIR /app',
    tip: 'All later COPY / RUN / CMD run relative to /app.',
  },
  {
    id: 4,
    title: 'Cache-friendly COPY',
    code: 'COPY requirements.txt .',
    tip: 'Deps file alone — rebuilds skip this if unchanged.',
  },
  {
    id: 5,
    title: 'Install in one layer',
    code: 'RUN apt-get update && \\\n    apt-get install -y python3 python3-pip && \\\n    pip3 install --no-cache-dir -r requirements.txt && \\\n    rm -rf /var/lib/apt/lists/*',
    tip: 'Chained RUN + --no-cache-dir keeps layers lean.',
  },
  {
    id: 6,
    title: 'Copy app code',
    code: 'COPY . .',
    tip: 'Code last — most frequent change stays on top.',
  },
  {
    id: 7,
    title: 'Default command',
    code: 'CMD ["python3", "train.py"]',
    tip: 'Exec form — container starts training immediately.',
  },
];

export function DockerfileWalkthroughVisualizer() {
  const [step, setStep] = useState(1);
  const [view, setView] = useState('walk'); // walk | tree
  const s = DF_STEPS.find((x) => x.id === step);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">GPU Training Dockerfile</h3>
        <p className="text-gray-400 text-sm">Walk the 7 instructions — or peek at the project layout.</p>
      </div>

      <Tabs
        options={[
          { id: 'walk', label: 'Dockerfile steps' },
          { id: 'tree', label: 'Project files' },
        ]}
        value={view}
        onChange={setView}
        accent="bg-emerald-600"
      />

      {view === 'tree' ? (
        <div className="max-w-sm mx-auto w-full rounded-2xl border border-gray-700 bg-gray-900/80 p-4 font-mono text-sm space-y-2">
          <div className="flex items-center gap-2 text-gray-400">
            <Folder className="w-4 h-4" /> .
          </div>
          {[
            { f: 'Dockerfile', d: 'build recipe' },
            { f: 'requirements.txt', d: 'torch · torchvision · numpy' },
            { f: 'train.py', d: 'training entrypoint' },
          ].map((x) => (
            <div key={x.f} className="pl-6 flex justify-between gap-2">
              <span className="text-emerald-300">{x.f}</span>
              <span className="text-[10px] text-gray-500">{x.d}</span>
            </div>
          ))}
          <pre className="mt-3 text-[10px] text-gray-400 bg-black/40 rounded-lg p-2">
{`torch==1.13.1
torchvision==0.14.1
numpy==1.23.5`}
          </pre>
        </div>
      ) : (
        <>
          <div className="flex justify-center gap-1 mb-3 flex-wrap">
            {DF_STEPS.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setStep(x.id)}
                className={`w-8 h-8 rounded-full text-[10px] font-bold ${
                  step === x.id ? 'bg-emerald-500 text-gray-950' : 'bg-gray-800 text-gray-400'
                }`}
              >
                {x.id}
              </button>
            ))}
          </div>
          <div className="max-w-md mx-auto w-full rounded-2xl border border-emerald-500/30 bg-gray-900/80 p-4 space-y-2">
            <div className="text-xs font-bold text-emerald-300 uppercase">
              Step {s.id} · {s.title}
            </div>
            <pre className="rounded-lg bg-black/60 border border-gray-700 p-3 text-[11px] font-mono text-emerald-200 overflow-x-auto whitespace-pre-wrap">
              {s.code}
            </pre>
            <p className="text-xs text-gray-400">{s.tip}</p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={step === 1}
                onClick={() => setStep((n) => Math.max(1, n - 1))}
                className="flex-1 py-1.5 rounded-lg bg-gray-800 text-xs font-bold disabled:opacity-30"
              >
                Back
              </button>
              <button
                type="button"
                disabled={step === 7}
                onClick={() => setStep((n) => Math.min(7, n + 1))}
                className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── 8. Build + run with GPUs ─────────────────────────────────────────────── */

export function BuildRunVisualizer() {
  const [phase, setPhase] = useState('build'); // build | run | portable
  const [built, setBuilt] = useState(false);
  const [running, setRunning] = useState(false);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Build → Run with GPUs</h3>
        <p className="text-gray-400 text-sm">
          <span className="font-mono text-rose-300">docker build</span> then{' '}
          <span className="font-mono text-rose-300">docker run --gpus all</span>
        </p>
      </div>

      <Tabs
        options={[
          { id: 'build', label: 'Build' },
          { id: 'run', label: 'Run + GPU' },
          { id: 'portable', label: 'Portable' },
        ]}
        value={phase}
        onChange={setPhase}
        accent="bg-rose-600"
      />

      <div className="max-w-md mx-auto w-full">
        {phase === 'build' && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 text-xs font-bold">
              <div className="rounded-xl border border-gray-600 px-3 py-3 text-center bg-gray-900">
                <FileCode className="w-5 h-5 mx-auto mb-1 text-amber-300" />
                Dockerfile
              </div>
              <span className="text-gray-500">→</span>
              <div
                className={`rounded-xl border px-3 py-3 text-center transition ${
                  built
                    ? 'border-emerald-400 bg-emerald-500/15 text-emerald-100'
                    : 'border-gray-700 bg-gray-900 text-gray-500'
                }`}
              >
                <Package className="w-5 h-5 mx-auto mb-1" />
                pytorch-training-app:1.0
              </div>
            </div>
            <pre className="rounded-lg bg-black/60 border border-gray-700 p-2 text-[10px] font-mono text-gray-300">
              docker build -t pytorch-training-app:1.0 .
            </pre>
            <button
              type="button"
              onClick={() => setBuilt(true)}
              className="w-full py-2 rounded-lg bg-sky-600 text-white text-xs font-bold"
            >
              {built ? '✓ Image tagged 1.0' : 'Run docker build'}
            </button>
          </div>
        )}

        {phase === 'run' && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-gray-700 bg-gray-900/80 p-4 space-y-3">
              <div
                className={`rounded-xl border px-3 py-3 text-center text-sm font-bold transition ${
                  running
                    ? 'border-emerald-400 bg-emerald-500/15 text-emerald-100'
                    : 'border-gray-600 text-gray-400'
                }`}
              >
                <Play className="w-5 h-5 mx-auto mb-1" />
                {running ? 'Container running · train.py' : 'Idle image'}
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px]">
                <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-rose-200 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Host GPU
                </div>
                <span className="text-emerald-400 font-bold">⟷</span>
                <div className="rounded-lg border border-sky-400/40 bg-sky-500/10 px-3 py-2 text-sky-200">
                  NVIDIA Container Toolkit
                </div>
              </div>
            </div>
            <pre className="rounded-lg bg-black/60 border border-gray-700 p-2 text-[10px] font-mono text-gray-300">
              docker run --gpus all pytorch-training-app:1.0
            </pre>
            <button
              type="button"
              onClick={() => setRunning(true)}
              className="w-full py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
            >
              {running ? '✓ GPUs mounted into container' : 'Run with --gpus all'}
            </button>
          </div>
        )}

        {phase === 'portable' && (
          <div className="rounded-2xl border border-violet-500/30 bg-gray-900/80 p-4">
            <div className="text-center text-sm font-bold text-white mb-3">One image · many hosts</div>
            <div className="flex justify-center gap-2 mb-3">
              {['Laptop', 'On-prem', 'Cloud GPU'].map((h) => (
                <div
                  key={h}
                  className="rounded-xl border border-violet-400/40 bg-violet-500/10 px-2 py-3 text-center flex-1"
                >
                  <Layers className="w-4 h-4 mx-auto text-violet-300 mb-1" />
                  <div className="text-[10px] text-violet-100 font-bold">{h}</div>
                  <div className="text-[9px] text-gray-500 mt-1">:1.0</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-gray-400">
              Same CUDA + Python deps wherever Docker + NVIDIA GPUs are installed — foundation for
              scalable, reproducible systems next.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
