import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  GpuNeedPluginVisualizer,
  DevicePluginWorkflowVisualizer,
  NodeSetupVisualizer,
  DevicePluginDaemonSetVisualizer,
  RequestGpuVisualizer,
  VerifyGpuVisualizer,
} from '../components/ContainerizationPart3Visualizers';

export const meta = {
  title: 'Containerization and Orchestration for ML (Part 3)',
  subtitle: 'GPU resources on Kubernetes — device plugins, DaemonSets, requesting & verifying GPUs',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'gpu-intro',
    title: 'Managing GPU Resources in a Kubernetes Cluster',
    subtitle: 'Device Plugin framework · NVIDIA Device Plugin',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Standard Kubernetes manages CPU and memory, but it does{' '}
          <strong className="text-white">not</strong> recognize GPUs by default. To run ML workloads,
          the cluster must discover and manage GPUs using the{' '}
          <strong className="text-brand-orange">Kubernetes Device Plugin framework</strong>. Vendors
          use this to advertise specialized hardware to the scheduler.
        </p>
        <p>
          The common implementation for NVIDIA GPUs is the{' '}
          <strong className="text-white">NVIDIA Device Plugin</strong>:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>The plugin runs on every GPU-equipped node.</li>
          <li>It detects available NVIDIA GPUs.</li>
          <li>
            It reports them as schedulable resources to the{' '}
            <span className="font-mono text-rose-300 text-xs">kubelet</span> (the node agent).
          </li>
          <li>
            Once the control plane knows about these resources, you request them in Pod specs the
            same way you request CPU or memory.
          </li>
        </ol>
        <p className="text-xs text-gray-400 italic">
          Toggle Without plugin vs With NVIDIA plugin — watch GPUs appear in Capacity.
        </p>
      </div>
    ),
    Visual: GpuNeedPluginVisualizer,
  },
  {
    id: 'workflow',
    title: 'The Device Plugin Workflow',
    subtitle: 'Submit → Schedule → Allocate → Mount',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Exposing and scheduling a GPU involves several components. The device plugin bridges
          physical hardware and the Kubernetes control plane.
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong className="text-white">User submits Pod</strong> — Spec requests a GPU.
          </li>
          <li>
            <strong className="text-white">Scheduler assigns Pod to Node</strong> — Chooses a node
            with free GPU capacity.
          </li>
          <li>
            <strong className="text-white">Kubelet allocates GPU</strong> — Talks to the NVIDIA Device
            Plugin over gRPC. The plugin has already discovered physical GPUs.
          </li>
          <li>
            <strong className="text-white">Runtime mounts GPU</strong> — Kubelet starts the Pod via
            the container runtime (e.g. containerd), which mounts the GPU (with drivers) into the
            container.
          </li>
        </ol>
        <p>
          Advertising GPUs to the kubelet is what lets the scheduler place GPU-requesting Pods on the
          right nodes.
        </p>
        <p className="text-xs text-gray-400 italic">
          Tap steps 1–4 or use Back / Next — nothing auto-advances; pause and read each stage.
        </p>
      </div>
    ),
    Visual: DevicePluginWorkflowVisualizer,
  },
  {
    id: 'node-setup',
    title: 'Setting Up the Node',
    subtitle: 'NVIDIA drivers + Container Toolkit on the host',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Before a device plugin can function, every GPU node needs two components on the{' '}
          <strong className="text-white">host operating system</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-violet-300">NVIDIA Drivers</strong> — The plugin does not install
            these. The host OS must already have the correct proprietary drivers to talk to the GPU
            hardware.
          </li>
          <li>
            <strong className="text-teal-300">NVIDIA Container Toolkit</strong> — Enables container
            runtimes (Docker / containerd) to expose GPUs. It mounts driver files and device nodes
            from the host into the container’s isolated environment.
          </li>
        </ul>
        <p>
          Without both, the device plugin might start, but Pods will fail to initialize or cannot
          access the GPU at runtime.
        </p>
        <p className="text-xs text-gray-400 italic">
          Toggle Drivers / Toolkit OFF to see “GPU Not Found” on the stack.
        </p>
      </div>
    ),
    Visual: NodeSetupVisualizer,
  },
  {
    id: 'daemonset',
    title: 'Deploying the NVIDIA Device Plugin',
    subtitle: 'DaemonSet · tolerations · hostPath · kubectl apply',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The standard way to deploy the NVIDIA Device Plugin is a Kubernetes{' '}
          <strong className="text-white">DaemonSet</strong>. That ensures every matching node (and
          every new node that joins) runs a copy of the plugin Pod so GPUs stay advertised to the
          scheduler.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="font-mono text-rose-300 text-xs">kind: DaemonSet</span> in{' '}
            <span className="font-mono text-xs">kube-system</span>
          </li>
          <li>
            <span className="font-mono text-rose-300 text-xs">tolerations</span> — run on control-plane
            / GPU-tainted nodes when needed
          </li>
          <li>
            Image: <span className="font-mono text-xs">nvcr.io/nvidia/k8s-device-plugin:v0.14.1</span>
          </li>
          <li>
            <span className="font-mono text-rose-300 text-xs">hostPath</span> mounts{' '}
            <span className="font-mono text-xs">/var/lib/kubelet/device-plugins</span> for kubelet
            registration
          </li>
        </ul>
        <p>
          Deploy with <span className="font-mono text-xs">kubectl apply -f nvidia-device-plugin-ds.yaml</span>,
          then verify with{' '}
          <span className="font-mono text-xs">kubectl get pods -n kube-system -o wide</span>.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right panel opens on Full YAML — scroll the complete manifest, tap sections 1–4, then try
          DaemonSet live.
        </p>
      </div>
    ),
    Visual: DevicePluginDaemonSetVisualizer,
  },
  {
    id: 'request-gpu',
    title: 'Requesting a GPU in a Pod',
    subtitle: 'nvidia.com/gpu · scheduler placement · allocation',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          With the device plugin running, the cluster treats GPUs as a finite, schedulable resource
          named <span className="font-mono text-rose-300 text-xs">nvidia.com/gpu</span>. A Pod must
          explicitly request it under the container’s{' '}
          <span className="font-mono text-xs">resources</span> section.
        </p>
        <p>
          When you apply a manifest that requests a GPU, the{' '}
          <strong className="text-white">scheduler</strong> searches for nodes with at least one
          allocatable <span className="font-mono text-xs">nvidia.com/gpu</span>. The{' '}
          <span className="font-mono text-rose-300 text-xs">kubelet</span> on that node allocates the
          GPU to the container before it starts.
        </p>
        <p>
          Example: <span className="font-mono text-xs">limits: nvidia.com/gpu: 1</span> on a
          CUDA-enabled PyTorch image. Requesting via limits also sets the request to the same value.
        </p>
        <p className="text-xs text-gray-400 italic">
          Full YAML tab shows the complete pytorch-pod.yaml — then Schedule it to watch placement.
        </p>
      </div>
    ),
    Visual: RequestGpuVisualizer,
  },
  {
    id: 'verify-gpu',
    title: 'Verifying GPU Allocation and Usage',
    subtitle: 'kubectl describe node · nvidia-smi in the container',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Confirm the cluster sees node GPUs with{' '}
          <span className="font-mono text-xs">kubectl describe node &lt;gpu-node&gt;</span>. Look for{' '}
          <span className="font-mono text-rose-300 text-xs">nvidia.com/gpu</span> under both{' '}
          <strong className="text-white">Capacity</strong> and{' '}
          <strong className="text-white">Allocatable</strong>.
        </p>
        <p>
          Once the Pod is running, exec into it and run{' '}
          <span className="font-mono text-rose-300 text-xs">nvidia-smi</span> to confirm the GPU is
          accessible from inside the container.
        </p>
        <p>
          That output means the container was granted access to the GPU — bridging your containerized
          ML app and the underlying hardware. This setup is fundamental for scalable training and
          inference on Kubernetes.
        </p>
        <p className="text-xs text-gray-400 italic">
          Full describe-node Capacity/Allocatable block and full nvidia-smi table are on the right —
          switch tabs to read each.
        </p>
      </div>
    ),
    Visual: VerifyGpuVisualizer,
  },
];

export default function ContainerizationOrchestrationPart3() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((c) => Math.min(c + 1, slidesData.length - 1));
  const prevSlide = () => setCurrentSlide((c) => Math.max(c - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') setCurrentSlide((c) => Math.min(c + 1, slidesData.length - 1));
      if (e.key === 'ArrowLeft') setCurrentSlide((c) => Math.max(c - 1, 0));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const slide = slidesData[currentSlide];
  const VisualComponent = slide.Visual;

  return (
    <div
      className="flex-1 flex flex-col h-full min-h-0 bg-gray-950 font-sans text-gray-100 overflow-hidden"
      style={{ backgroundImage: GRID_BG }}
    >
      <main className="flex-1 flex flex-col lg:flex-row relative z-10 w-full mx-auto p-3 md:p-4 gap-4 min-h-0 overflow-hidden">
        <div
          key={`text-${currentSlide}`}
          className="slide-enter w-full lg:w-[380px] xl:w-[420px] shrink-0 min-h-0 h-[38%] lg:h-full glass-panel rounded-2xl p-5 flex flex-col relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-emerald-400 font-bold tracking-wider text-xs uppercase mb-1 block">
              Slide {currentSlide + 1} of {slidesData.length}
            </span>
            <h2 className="text-2xl font-extrabold text-white leading-tight mb-1">{slide.title}</h2>
            <h3 className="text-sm text-gray-400 font-medium">{slide.subtitle}</h3>
          </div>

          <div className="flex-1 overflow-y-scroll custom-scroll relative min-h-0 pr-1">
            {slide.content}
          </div>
        </div>

        <div
          key={`visual-${currentSlide}`}
          className="slide-enter flex-1 min-h-0 glass-panel rounded-2xl border-gray-700 overflow-hidden relative flex flex-col bg-gray-900/80"
        >
          <div className="absolute top-4 right-4 bg-gray-800 px-3 py-1 rounded-full text-xs font-mono text-brand-orange border border-gray-700 flex items-center gap-2 z-20">
            <MousePointerClick className="w-3 h-3" /> Interactive
          </div>

          <div className="flex-1 flex items-stretch justify-center p-2 relative min-h-0 overflow-hidden">
            <VisualComponent />
          </div>
        </div>
      </main>

      <footer className="flex justify-between items-center px-4 py-3 border-t border-gray-800 bg-[#161616] z-20 shrink-0">
        <button
          type="button"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-3 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          {slidesData.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(i)}
              title={s.title}
              aria-label={`Go to ${s.title}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-8 bg-emerald-500' : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
          className="p-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 shadow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
