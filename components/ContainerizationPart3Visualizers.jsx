import React, { useState } from 'react';
import {
  Cpu,
  Server,
  Box,
  AlertTriangle,
  CheckCircle,
  Zap,
  FileCode,
  Terminal,
  HardDrive,
} from 'lucide-react';

/* ── shared ───────────────────────────────────────────────────────────────── */

function Tabs({ options, value, onChange, accent = 'bg-emerald-600' }) {
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

/* ── 1. Why GPUs need device plugins ──────────────────────────────────────── */

export function GpuNeedPluginVisualizer() {
  const [mode, setMode] = useState('without'); // without | with

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Managing GPU Resources</h3>
        <p className="text-gray-400 text-sm">
          Stock Kubernetes sees CPU &amp; memory — not GPUs. Device plugins advertise hardware.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'without', label: 'Without plugin' },
          { id: 'with', label: 'With NVIDIA plugin' },
        ]}
        value={mode}
        onChange={setMode}
        accent="bg-emerald-600"
      />

      <div className="max-w-xl mx-auto w-full space-y-3">
        <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
          <div className="text-[10px] font-bold text-sky-300 uppercase mb-2">Worker Node</div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="rounded-lg border border-sky-400/40 bg-sky-500/10 p-2 text-center">
              <Cpu className="w-4 h-4 mx-auto text-sky-300 mb-1" />
              <div className="text-[10px] font-bold text-white">CPU</div>
              <div className="text-[9px] text-emerald-300">known ✓</div>
            </div>
            <div className="rounded-lg border border-sky-400/40 bg-sky-500/10 p-2 text-center">
              <HardDrive className="w-4 h-4 mx-auto text-sky-300 mb-1" />
              <div className="text-[10px] font-bold text-white">Memory</div>
              <div className="text-[9px] text-emerald-300">known ✓</div>
            </div>
            <div
              className={`rounded-lg border p-2 text-center transition ${
                mode === 'with'
                  ? 'border-emerald-400 bg-emerald-500/15'
                  : 'border-rose-500/50 bg-rose-500/10'
              }`}
            >
              <Zap className={`w-4 h-4 mx-auto mb-1 ${mode === 'with' ? 'text-emerald-300' : 'text-rose-400'}`} />
              <div className="text-[10px] font-bold text-white">GPU ×4</div>
              <div className={`text-[9px] ${mode === 'with' ? 'text-emerald-300' : 'text-rose-300'}`}>
                {mode === 'with' ? 'advertised ✓' : 'invisible ✗'}
              </div>
            </div>
          </div>

          {mode === 'without' ? (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 space-y-2">
              <div className="flex items-center gap-2 text-rose-200 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" /> Scheduler cannot place GPU Pods
              </div>
              <div className="rounded-lg bg-black/40 border border-gray-700 px-3 py-2 font-mono text-[11px] text-gray-400">
                Capacity:{'\n'}
                {'  '}cpu: &quot;32&quot;{'\n'}
                {'  '}memory: 128Gi{'\n'}
                <span className="text-rose-400 line-through">  nvidia.com/gpu: &quot;4&quot;</span>
                <span className="text-rose-300"> ← missing</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Hardware is on the machine, but Kubernetes has no API for it until a vendor plugin
                registers via the <strong className="text-white">Device Plugin framework</strong>.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-teal-200">
                <div className="rounded-lg border border-teal-400/50 bg-teal-500/15 px-3 py-2">
                  NVIDIA Device Plugin
                </div>
                <span className="text-teal-400">→ discovers →</span>
                <div className="rounded-lg border border-violet-400/50 bg-violet-500/15 px-3 py-2 text-violet-100">
                  kubelet
                </div>
              </div>
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 space-y-2">
                <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold">
                  <CheckCircle className="w-4 h-4" /> GPUs are schedulable resources
                </div>
                <div className="rounded-lg bg-black/40 border border-gray-700 px-3 py-2 font-mono text-[11px] text-gray-300">
                  Capacity:{'\n'}
                  {'  '}cpu: &quot;32&quot;{'\n'}
                  {'  '}memory: 128Gi{'\n'}
                  <span className="text-rose-300">  nvidia.com/gpu: &quot;4&quot;</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  The plugin runs on every GPU node, detects cards, and reports them to the{' '}
                  <span className="font-mono text-rose-300">kubelet</span>. Pods can then request{' '}
                  <span className="font-mono text-rose-300">nvidia.com/gpu</span> like CPU or RAM.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 2. Device Plugin Workflow (source diagram) ───────────────────────────── */

const WORKFLOW_STEPS = [
  {
    id: 1,
    label: 'Submit Pod',
    blurb: 'User applies a Pod Spec that requests a GPU (nvidia.com/gpu).',
  },
  {
    id: 2,
    label: 'Schedule',
    blurb: 'Control Plane Scheduler assigns the Pod to a node with free GPU capacity.',
  },
  {
    id: 3,
    label: 'Allocate',
    blurb: 'Kubelet calls the NVIDIA Device Plugin over gRPC to allocate a GPU.',
  },
  {
    id: 4,
    label: 'Mount',
    blurb: 'Container Runtime starts the Pod and mounts the GPU (with drivers) into the container.',
  },
];

export function DevicePluginWorkflowVisualizer() {
  const [step, setStep] = useState(1);

  const on = (n) => step >= n;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">The Device Plugin Workflow</h3>
        <p className="text-gray-400 text-sm">
          Pod Spec → Scheduler → Kubelet ↔ Plugin → Runtime → Physical GPU
        </p>
        <p className="text-[11px] text-emerald-400/90 mt-1">Click a step — or use Back / Next — to move at your own pace.</p>
      </div>

      <div className="flex justify-center gap-1.5 mb-3 flex-wrap">
        {WORKFLOW_STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(s.id)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
              step === s.id
                ? 'bg-emerald-500 text-white'
                : on(s.id)
                  ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40'
                  : 'bg-gray-800 text-gray-500 border border-gray-700 hover:text-white'
            }`}
          >
            {s.id}. {s.label}
          </button>
        ))}
      </div>

      <div className="max-w-lg mx-auto w-full space-y-2">
        {/* Pod Spec */}
        <div
          className={`rounded-xl border px-3 py-2 flex items-center gap-2 transition ${
            step === 1
              ? 'border-sky-400 bg-sky-500/20 shadow-lg shadow-sky-500/20'
              : 'border-sky-400/30 bg-sky-500/10'
          }`}
        >
          <FileCode className="w-5 h-5 text-sky-300 shrink-0" />
          <div>
            <div className="text-xs font-bold text-sky-100">Pod Spec (requests GPU)</div>
            <div className="text-[10px] font-mono text-rose-300">limits: nvidia.com/gpu: 1</div>
          </div>
          {step === 1 && (
            <span className="ml-auto text-[10px] font-bold text-sky-300 animate-pulse">1. Submit →</span>
          )}
        </div>

        <div className="flex justify-center text-gray-600 text-xs">↓</div>

        {/* Control Plane */}
        <div
          className={`rounded-xl border-2 border-dashed p-3 transition ${
            step === 2 ? 'border-sky-400 bg-sky-500/10' : 'border-gray-600 bg-gray-900/50'
          }`}
        >
          <div className="text-[9px] font-bold text-gray-400 uppercase mb-2">Kubernetes Control Plane</div>
          <div
            className={`inline-flex rounded-lg border px-3 py-2 text-xs font-bold transition ${
              step === 2
                ? 'border-sky-400 bg-sky-500/25 text-sky-100'
                : 'border-sky-400/40 bg-sky-500/10 text-sky-200/70'
            }`}
          >
            Scheduler
            {step === 2 && <span className="ml-2 text-[10px] font-normal text-sky-300">2. Assigns Pod to Node</span>}
          </div>
        </div>

        <div className="flex justify-center text-gray-600 text-xs">↓</div>

        {/* GPU Node */}
        <div
          className={`rounded-2xl border-2 p-3 space-y-2 transition ${
            step >= 3 ? 'border-violet-400/60 bg-violet-500/5' : 'border-gray-700 bg-gray-950/60'
          }`}
        >
          <div className="text-[9px] font-bold text-violet-300 uppercase">GPU Node</div>

          <div className="grid grid-cols-2 gap-2">
            <div
              className={`rounded-lg border px-2 py-2 text-center transition ${
                step === 3
                  ? 'border-violet-400 bg-violet-500/25'
                  : 'border-violet-400/40 bg-violet-500/10'
              }`}
            >
              <div className="text-[10px] font-bold text-violet-100">Kubelet</div>
              {step === 3 && (
                <div className="text-[9px] text-violet-300 mt-0.5">3. Allocates GPU</div>
              )}
              {step === 4 && (
                <div className="text-[9px] text-orange-300 mt-0.5">Starts Pod →</div>
              )}
            </div>
            <div
              className={`rounded-lg border px-2 py-2 text-center transition ${
                step === 3
                  ? 'border-teal-400 bg-teal-500/25'
                  : 'border-teal-400/40 bg-teal-500/10'
              }`}
            >
              <div className="text-[10px] font-bold text-teal-100">NVIDIA Device Plugin</div>
              <div className="text-[8px] text-teal-300/80 mt-0.5">gRPC ↔ kubelet</div>
              <div className="text-[8px] text-teal-200/70">Discovers ↓</div>
            </div>
          </div>

          <div
            className={`rounded-lg border px-2 py-2 text-center transition ${
              step === 4
                ? 'border-orange-400 bg-orange-500/25'
                : 'border-orange-400/40 bg-orange-500/10'
            }`}
          >
            <div className="text-[10px] font-bold text-orange-100">Container Runtime (e.g. containerd)</div>
            {step === 4 && (
              <div className="text-[9px] text-orange-200 mt-0.5 animate-pulse">
                4. Mounts GPU into container
              </div>
            )}
          </div>

          <div
            className={`rounded-lg border px-2 py-2 text-center transition ${
              step >= 3
                ? 'border-rose-400 bg-rose-500/20'
                : 'border-rose-400/30 bg-rose-500/10 opacity-60'
            }`}
          >
            <Zap className="w-4 h-4 mx-auto text-rose-300 mb-0.5" />
            <div className="text-[10px] font-bold text-rose-100">Physical GPU (with drivers)</div>
          </div>
        </div>

        <p className="text-xs text-center text-gray-300 leading-relaxed px-2">
          {WORKFLOW_STEPS[step - 1].blurb}
        </p>
        <p className="text-[10px] text-center text-gray-500">
          Device plugin advertises GPUs to the kubelet so the scheduler can place GPU Pods correctly.
        </p>

        <div className="flex justify-center gap-2 pt-1">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="px-4 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 disabled:opacity-30 hover:bg-gray-700"
          >
            ← Back
          </button>
          <button
            type="button"
            disabled={step === 4}
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 text-xs font-bold text-white disabled:opacity-30 hover:bg-emerald-500"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 3. Setting up the node ───────────────────────────────────────────────── */

export function NodeSetupVisualizer() {
  const [drivers, setDrivers] = useState(true);
  const [toolkit, setToolkit] = useState(true);

  const ok = drivers && toolkit;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Setting Up the Node</h3>
        <p className="text-gray-400 text-sm">
          Host OS needs NVIDIA drivers + Container Toolkit before the plugin can work.
        </p>
      </div>

      <div className="max-w-md mx-auto w-full space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDrivers((d) => !d)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
              drivers
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                : 'border-rose-500 bg-rose-500/15 text-rose-200'
            }`}
          >
            Drivers {drivers ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={() => setToolkit((t) => !t)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
              toolkit
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                : 'border-rose-500 bg-rose-500/15 text-rose-200'
            }`}
          >
            Toolkit {toolkit ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="rounded-2xl border border-gray-700 overflow-hidden">
          {/* Pod layer */}
          <div
            className={`p-3 border-b border-gray-700 transition ${
              ok ? 'bg-sky-500/15' : 'bg-rose-500/10'
            }`}
          >
            <div className="text-[9px] font-bold text-gray-400 uppercase mb-1">Container / Pod</div>
            <div className="flex items-center gap-2">
              <Box className={`w-4 h-4 ${ok ? 'text-sky-300' : 'text-rose-400'}`} />
              <span className="text-xs font-bold text-white">ML training container</span>
              <span className={`ml-auto text-[10px] font-bold ${ok ? 'text-emerald-300' : 'text-rose-300'}`}>
                {ok ? 'GPU visible ✓' : 'GPU Not Found ✗'}
              </span>
            </div>
            {toolkit && drivers && (
              <div className="mt-2 text-[9px] font-mono text-teal-300/90 border border-dashed border-teal-400/40 rounded px-2 py-1">
                mounts: /dev/nvidia* · driver libs from host
              </div>
            )}
          </div>

          {/* Toolkit */}
          <div
            className={`p-3 border-b border-gray-700 transition ${
              toolkit ? 'bg-teal-500/15' : 'bg-gray-900 opacity-50'
            }`}
          >
            <div className="text-[9px] font-bold text-teal-300 uppercase mb-1">
              NVIDIA Container Toolkit
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Bridges Docker / containerd to GPUs — mounts driver files &amp; device nodes into the
              container.
            </p>
          </div>

          {/* Drivers */}
          <div
            className={`p-3 border-b border-gray-700 transition ${
              drivers ? 'bg-violet-500/15' : 'bg-gray-900 opacity-50'
            }`}
          >
            <div className="text-[9px] font-bold text-violet-300 uppercase mb-1">NVIDIA Drivers</div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Proprietary host drivers talk to the GPU. The device plugin does{' '}
              <em>not</em> install these — they must already be on the OS.
            </p>
          </div>

          {/* Hardware */}
          <div className="p-3 bg-rose-500/10">
            <div className="text-[9px] font-bold text-rose-300 uppercase mb-1">Hardware</div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-300" />
              <span className="text-xs font-bold text-rose-100">Physical GPU</span>
            </div>
          </div>
        </div>

        {!ok && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            Plugin may start, but Pods fail to init or cannot access the GPU without both layers.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 4. Deploying DaemonSet ───────────────────────────────────────────────── */

const DS_FIELDS = [
  {
    id: 1,
    key: 'kind: DaemonSet',
    short: 'DaemonSet',
    desc: 'Ensures one plugin Pod on every matching node — including nodes that join later.',
  },
  {
    id: 2,
    key: 'tolerations',
    short: 'tolerations',
    desc: 'Lets the plugin run on control-plane nodes (if they have GPUs) and nodes tainted with nvidia.com/gpu.',
  },
  {
    id: 3,
    key: 'image + securityContext',
    short: 'image',
    desc: 'Official NVIDIA image nvcr.io/nvidia/k8s-device-plugin:v0.14.1, with privilege escalation off and capabilities dropped.',
  },
  {
    id: 4,
    key: 'volumeMounts / hostPath',
    short: 'hostPath',
    desc: 'Mounts host /var/lib/kubelet/device-plugins so the plugin can register with the kubelet and talk to drivers.',
  },
];

function YamlBlock({ focus, children, onFocus }) {
  return (
    <button
      type="button"
      onClick={() => onFocus()}
      className={`block w-full text-left rounded-md px-1.5 py-0.5 transition ${
        focus ? 'bg-violet-500/25 ring-1 ring-violet-400/50' : 'hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

export function DevicePluginDaemonSetVisualizer() {
  const [view, setView] = useState('yaml'); // yaml | live
  const [nodes, setNodes] = useState(3);
  const [focus, setFocus] = useState(1);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">Deploying the NVIDIA Device Plugin</h3>
        <p className="text-gray-400 text-sm">
          Full DaemonSet manifest — tap highlighted sections to learn each part.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'yaml', label: 'Full YAML' },
          { id: 'live', label: 'DaemonSet live' },
        ]}
        value={view}
        onChange={setView}
        accent="bg-teal-600"
      />

      <div className={`mx-auto w-full ${view === 'yaml' ? 'max-w-3xl' : 'max-w-md'}`}>
        {view === 'live' && (
          <div className="space-y-3">
            <label className="text-[10px] text-gray-400 block">
              Nodes in cluster: <span className="font-mono text-white">{nodes}</span>
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={nodes}
              onChange={(e) => setNodes(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: nodes }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-600 bg-gray-900/80 p-3 w-28 text-center relative"
                >
                  <Server className="w-5 h-5 mx-auto text-gray-300 mb-1" />
                  <div className="text-[10px] font-bold text-white">Node {i + 1}</div>
                  <div className="text-[8px] text-rose-300 mb-2">GPU node</div>
                  <div className="rounded-lg border border-teal-400/60 bg-teal-500/20 px-1.5 py-1">
                    <div className="text-[8px] font-bold text-teal-100">plugin Pod</div>
                    <div className="text-[7px] text-teal-300/80">DaemonSet</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-gray-400 leading-relaxed">
              New GPU nodes automatically get a device-plugin Pod from the DaemonSet.
            </p>
          </div>
        )}

        {view === 'yaml' && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {DS_FIELDS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFocus(f.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                    focus === f.id
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'
                  }`}
                >
                  {f.id}. {f.short}
                </button>
              ))}
            </div>

            <div className="rounded-xl bg-black/85 border border-gray-700 p-4 font-mono text-[13px] md:text-sm leading-6 text-gray-300 overflow-x-auto whitespace-pre">
              <div className="text-gray-500"># nvidia-device-plugin-ds.yaml</div>
              <div>apiVersion: apps/v1</div>
              <YamlBlock focus={focus === 1} onFocus={() => setFocus(1)}>
                <span className="text-gray-100">kind: DaemonSet</span>
                <span className="text-rose-300">  # 1</span>
              </YamlBlock>
              <div>metadata:</div>
              <div>  name: nvidia-device-plugin-daemonset</div>
              <div>  namespace: kube-system</div>
              <div>spec:</div>
              <div>  selector:</div>
              <div>    matchLabels:</div>
              <div>      name: nvidia-device-plugin-ds</div>
              <div>  template:</div>
              <div>    metadata:</div>
              <div>      labels:</div>
              <div>        name: nvidia-device-plugin-ds</div>
              <div>    spec:</div>
              <div className="text-gray-500">      # Allow the plugin to run on control-plane nodes if they have GPUs</div>
              <YamlBlock focus={focus === 2} onFocus={() => setFocus(2)}>
                <div>
                  <span className="text-gray-100">      tolerations:</span>
                  <span className="text-rose-300">  # 2</span>
                </div>
                <div>      - key: node-role.kubernetes.io/control-plane</div>
                <div>        operator: Exists</div>
                <div>        effect: NoSchedule</div>
                <div>      - key: &quot;nvidia.com/gpu&quot;</div>
                <div>        operator: &quot;Exists&quot;</div>
                <div>        effect: &quot;NoSchedule&quot;</div>
              </YamlBlock>
              <div>      containers:</div>
              <YamlBlock focus={focus === 3} onFocus={() => setFocus(3)}>
                <div>
                  <span className="text-gray-100">      - image: nvcr.io/nvidia/k8s-device-plugin:v0.14.1</span>
                  <span className="text-rose-300">  # 3</span>
                </div>
                <div>        name: nvidia-device-plugin-ctr</div>
                <div>        securityContext:</div>
                <div>          allowPrivilegeEscalation: false</div>
                <div>          capabilities:</div>
                <div>            drop: [&quot;ALL&quot;]</div>
              </YamlBlock>
              <div className="text-gray-500">        # Mount host paths for drivers / kubelet</div>
              <YamlBlock focus={focus === 4} onFocus={() => setFocus(4)}>
                <div>
                  <span className="text-gray-100">        volumeMounts:</span>
                  <span className="text-rose-300">  # 4</span>
                </div>
                <div>        - name: device-plugin</div>
                <div>          mountPath: /var/lib/kubelet/device-plugins</div>
                <div>      volumes:</div>
                <div>      - name: device-plugin</div>
                <div>        hostPath:</div>
                <div>          path: /var/lib/kubelet/device-plugins</div>
              </YamlBlock>
            </div>

            <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3">
              <div className="text-rose-300 font-mono text-sm font-bold mb-1">
                {DS_FIELDS[focus - 1].key}
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">{DS_FIELDS[focus - 1].desc}</p>
            </div>

            <div className="rounded-xl border border-gray-700 bg-gray-950/80 p-3 space-y-1.5 font-mono text-xs">
              <div className="text-gray-400 text-[10px] font-sans font-bold uppercase tracking-wide mb-1">
                Deploy &amp; verify
              </div>
              <div>
                <span className="text-emerald-400">$</span>{' '}
                <span className="text-rose-300">kubectl apply -f nvidia-device-plugin-ds.yaml</span>
              </div>
              <div>
                <span className="text-emerald-400">$</span>{' '}
                <span className="text-rose-300">kubectl get pods -n kube-system -o wide</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 5. Requesting a GPU ──────────────────────────────────────────────────── */

export function RequestGpuVisualizer() {
  const [tab, setTab] = useState('yaml'); // yaml | schedule
  const [applied, setApplied] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [focus, setFocus] = useState('gpu'); // command | gpu

  const apply = () => {
    setTab('schedule');
    setApplied(false);
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setApplied(true);
    }, 1400);
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">Requesting a GPU in a Pod</h3>
        <p className="text-gray-400 text-sm">
          Full <span className="font-mono text-rose-300">pytorch-pod.yaml</span> — then watch the
          scheduler place it.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'yaml', label: 'Full YAML' },
          { id: 'schedule', label: 'Schedule it' },
        ]}
        value={tab}
        onChange={setTab}
        accent="bg-emerald-600"
      />

      <div className={`mx-auto w-full ${tab === 'yaml' ? 'max-w-3xl' : 'max-w-xl'}`}>
        {tab === 'yaml' && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {[
                { id: 'command', label: 'command / args' },
                { id: 'gpu', label: 'nvidia.com/gpu' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFocus(f.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                    focus === f.id
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="rounded-xl bg-black/85 border border-gray-700 p-4 font-mono text-[13px] md:text-sm leading-6 text-gray-300 overflow-x-auto whitespace-pre">
              <div className="text-gray-500"># pytorch-pod.yaml</div>
              <div>apiVersion: v1</div>
              <div>kind: Pod</div>
              <div>metadata:</div>
              <div>  name: pytorch-gpu-pod</div>
              <div>spec:</div>
              <div>  containers:</div>
              <div>  - name: pytorch-container</div>
              <div>    image: pytorch/pytorch:latest-cuda</div>
              <div className="text-gray-500">    # Keep running &amp; test GPU access</div>
              <button
                type="button"
                onClick={() => setFocus('command')}
                className={`block w-full text-left rounded-md px-1.5 py-0.5 transition ${
                  focus === 'command' ? 'bg-violet-500/25 ring-1 ring-violet-400/50' : 'hover:bg-white/5'
                }`}
              >
                <div>    command: [&quot;/bin/sh&quot;, &quot;-c&quot;]</div>
                <div className="whitespace-pre-wrap break-all">
                  {`    args: ["python -c 'import torch; print(f\\"CUDA available: {torch.cuda.is_available()}\\")'; sleep 3600"]`}
                </div>
              </button>
              <div>    resources:</div>
              <div>      limits:</div>
              <div className="text-gray-500">        # Resource request for one NVIDIA GPU</div>
              <button
                type="button"
                onClick={() => setFocus('gpu')}
                className={`block w-full text-left rounded-md px-1.5 py-0.5 transition ${
                  focus === 'gpu' ? 'bg-violet-500/25 ring-1 ring-violet-400/50' : 'hover:bg-white/5'
                }`}
              >
                <span className="text-rose-300 font-bold">        nvidia.com/gpu: 1</span>
              </button>
            </div>

            <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-gray-200 leading-relaxed">
              {focus === 'gpu' ? (
                <>
                  <span className="font-mono text-rose-300 font-bold">nvidia.com/gpu: 1</span> under{' '}
                  <span className="font-mono text-xs">resources.limits</span> tells the scheduler you
                  need one GPU. Setting the limit also sets the request to the same value.
                </>
              ) : (
                <>
                  <span className="font-mono text-rose-300 font-bold">command / args</span> keep the
                  container alive and print whether CUDA is available — useful smoke test after the
                  GPU is mounted.
                </>
              )}
            </div>

            <button
              type="button"
              onClick={apply}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
            >
              kubectl apply -f pytorch-pod.yaml → see scheduling
            </button>
          </div>
        )}

        {tab === 'schedule' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={apply}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
            >
              kubectl apply -f pytorch-pod.yaml
            </button>

            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Node A', gpu: 0, label: 'CPU-only' },
                { name: 'Node B', gpu: 4, label: 'GPU ×4' },
                { name: 'Node C', gpu: 0, label: 'CPU-only' },
              ].map((n) => {
                const selected = applied && n.gpu > 0;
                const scanningHere = scanning && n.gpu > 0;
                return (
                  <div
                    key={n.name}
                    className={`rounded-xl border p-3 text-center transition ${
                      selected
                        ? 'border-emerald-400 bg-emerald-500/20 scale-105'
                        : scanningHere
                          ? 'border-amber-400 bg-amber-500/15 animate-pulse'
                          : n.gpu
                            ? 'border-rose-400/40 bg-rose-500/10'
                            : 'border-gray-700 bg-gray-900/60 opacity-70'
                    }`}
                  >
                    <Server className="w-4 h-4 mx-auto text-gray-300 mb-1" />
                    <div className="text-[10px] font-bold text-white">{n.name}</div>
                    <div className="text-[9px] text-gray-400">{n.label}</div>
                    {selected && (
                      <div className="mt-2 rounded bg-sky-500/20 border border-sky-400/40 text-[8px] font-bold text-sky-100 py-1">
                        Pod scheduled
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-gray-700 p-3">
              <div className="text-[10px] font-bold text-gray-400 mb-2">
                Node B — GPU slots (4 allocatable)
              </div>
              <div className="flex gap-2 justify-center">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-lg border flex flex-col items-center justify-center text-[8px] font-bold transition ${
                      applied && i === 0
                        ? 'border-emerald-400 bg-emerald-500/25 text-emerald-100'
                        : 'border-rose-400/40 bg-rose-500/10 text-rose-200/70'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 mb-0.5" />
                    {applied && i === 0 ? 'busy' : 'free'}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-center text-gray-400 leading-relaxed">
              Scheduler only places the Pod on nodes with allocatable{' '}
              <span className="font-mono text-rose-300">nvidia.com/gpu</span>. The{' '}
              <span className="font-mono text-rose-300">kubelet</span> then allocates a GPU before
              starting the container.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 6. Verifying allocation ──────────────────────────────────────────────── */

export function VerifyGpuVisualizer() {
  const [tab, setTab] = useState('node'); // node | smi

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">Verifying GPU Allocation and Usage</h3>
        <p className="text-gray-400 text-sm">
          Full node Capacity / Allocatable output · then full nvidia-smi inside the Pod
        </p>
      </div>

      <Tabs
        options={[
          { id: 'node', label: 'kubectl describe node' },
          { id: 'smi', label: 'nvidia-smi in Pod' },
        ]}
        value={tab}
        onChange={setTab}
        accent="bg-violet-600"
      />

      <div className="max-w-3xl mx-auto w-full space-y-3">
        {tab === 'node' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Confirm Kubernetes sees node GPUs — look for{' '}
              <span className="font-mono text-rose-300">nvidia.com/gpu</span> under Capacity and
              Allocatable:
            </p>
            <div className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 font-mono text-xs text-emerald-300 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 shrink-0" />
              kubectl describe node &lt;your-gpu-node-name&gt;
            </div>
            <pre className="rounded-xl bg-black/85 border border-gray-700 p-4 font-mono text-[13px] md:text-sm leading-7 text-gray-300 overflow-x-auto">{`Capacity:
  cpu:                96
  ephemeral-storage:  99264Mi
  memory:             527699Mi
  nvidia.com/gpu:     4
  pods:               110
Allocatable:
  cpu:                96
  ephemeral-storage:  91497Mi
  memory:             517200Mi
  nvidia.com/gpu:     4
  pods:               110`}</pre>
            <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-gray-200 leading-relaxed">
              Highlight: both sections report{' '}
              <span className="font-mono text-rose-300 font-bold">nvidia.com/gpu: 4</span> — Capacity
              is what the node has; Allocatable is what Pods can schedule against.
            </div>
          </div>
        )}

        {tab === 'smi' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              After the Pod is running, exec into it and run{' '}
              <span className="font-mono text-rose-300">nvidia-smi</span> to confirm GPU access from
              inside the container:
            </p>
            <div className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 font-mono text-xs text-emerald-300 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 shrink-0" />
              kubectl exec -it pytorch-gpu-pod -- nvidia-smi
            </div>
            <pre className="rounded-xl bg-black/90 border border-emerald-500/30 p-4 font-mono text-[11px] md:text-xs leading-relaxed text-gray-300 overflow-x-auto">{`+-----------------------------------------------------------------------------+
| NVIDIA-SMI 515.65.01    Driver Version: 515.65.01    CUDA Version: 11.7     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA A100-SXM...  On   | 00000000:07:00.0 Off |                    0 |
| N/A   32C    P0    56W / 400W |      1MiB / 40960MiB |      0%      Default |
|                               |                      |             Disabled |
+-------------------------------+----------------------+----------------------+
...`}</pre>
            <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100 leading-relaxed">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              This output confirms the container was granted access to the GPU — bridging your
              containerized ML app and the underlying hardware. That bridge is fundamental for
              scalable training and inference on Kubernetes.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
