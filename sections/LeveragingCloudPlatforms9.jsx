import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  TrainingPillarsVisualizer,
  VramCalculatorVisualizer,
  BottleneckFeedVisualizer,
  InstanceNameDecoderVisualizer,
  TrainingDecisionVisualizer,
  NetStorageVisualizer,
  InferenceCpuVisualizer,
  BatchingVisualizer,
  InferenceDecisionVisualizer,
  AsicOptimizeVisualizer,
  InferenceMatrixVisualizer,
} from '../components/CloudPlatformsPart2Visualizers';

export const meta = {
  title: 'Leveraging Cloud Platforms for AI (Part 2)',
  subtitle: 'Training & inference instance selection, VRAM math, and serving optimization',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'training-select',
    title: 'Selecting Virtual Machine Instances for Training',
    subtitle: 'Balance GPU, CPU, and memory — then pick a GPU tier',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Choosing a training VM is a balancing act across three pillars:{' '}
          <strong className="text-white">GPU</strong> (compute for floating-point work),{' '}
          <strong className="text-white">CPU</strong> (data handling), and{' '}
          <strong className="text-white">system memory</strong> (working set size).
        </p>
        <h4 className="text-white font-semibold">GPU tiers</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-rose-300">High-performance</strong> (H100, A100) — large HBM,
            NVLink, Tensor Cores. Justified when training LLMs, diffusion, or heavy CV from scratch
            and you need weeks of work compressed into days.
          </li>
          <li>
            <strong className="text-sky-300">General / inference</strong> (A10G, L4, T4) — balance of
            performance and cost for smaller models, fine-tuning, or economical serving.
          </li>
          <li>
            <strong className="text-amber-300">Previous generation</strong> (V100, P100) — still
            useful on tight budgets when cutting-edge silicon is unnecessary.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">Browse the three pillars, then tap each GPU tier.</p>
      </div>
    ),
    Visual: TrainingPillarsVisualizer,
  },
  {
    id: 'vram-math',
    title: 'The Math of GPU Memory (VRAM)',
    subtitle: 'Why 16 bytes per parameter often decides the instance',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          VRAM is often a tighter constraint than raw TFLOPS. With a standard optimizer like{' '}
          <strong className="text-white">Adam</strong>, each parameter stores weights, gradients, and
          optimizer states:
        </p>
        <p className="font-mono text-xs text-brand-orange bg-gray-900/80 border border-gray-700 rounded-lg p-3">
          4 (weights) + 4 (grads) + 8 (Adam) = <strong>16 bytes / parameter</strong>
        </p>
        <p>
          For a <strong className="text-white">7B</strong> model:{' '}
          <span className="font-mono text-brand-orange">7×10⁹ × 16 ≈ 112 GB</span> — before activations,
          which grow with batch size.
        </p>
        <p>
          An <strong className="text-white">A100 80 GB</strong> can approach this with memory-saving
          techniques or multi-GPU; a <strong className="text-white">16 GB</strong> card cannot without
          aggressive tricks.
        </p>
        <p className="text-xs text-gray-400 italic">
          Drag model size and compare against T4 / A10G / A100 / H100 capacity.
        </p>
      </div>
    ),
    Visual: VramCalculatorVisualizer,
  },
  {
    id: 'balance-cpu-ram',
    title: 'Balancing the System: vCPUs and RAM',
    subtitle: 'A starved pipeline makes an expensive GPU idle',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A powerful GPU must be constantly fed. Weak vCPUs or insufficient RAM leave the accelerator
          idle — inefficient and costly.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">vCPUs</strong> run the data pipeline: read storage, augment
            (rotate/crop), batch tensors. GPU util consistently{' '}
            <strong className="text-brand-orange">&lt; 90%</strong> usually signals a CPU bottleneck.
          </li>
          <li>
            <strong className="text-white">RAM</strong> holds dataset slices, batch buffers, and the OS.
            When the working set exceeds RAM, the system spills to disk and creates an{' '}
            <strong className="text-brand-rose">I/O bottleneck</strong>.
          </li>
        </ul>
        <p>
          Providers ship preset ratios — e.g. roughly{' '}
          <strong className="text-white">8 vCPUs + 61 GB RAM per NVIDIA T4</strong> on compute-optimized
          shapes.
        </p>
        <p className="text-xs text-gray-400 italic">Lower vCPU or RAM and watch utilization collapse.</p>
      </div>
    ),
    Visual: BottleneckFeedVisualizer,
  },
  {
    id: 'name-decode',
    title: 'Decoding Instance Names',
    subtitle: 'Family, generation, size, storage, and networking in one string',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Cloud instance names look cryptic until you learn the grammar. Different parts signal
          hardware family, generation, size, and extras like local storage or high-speed networking.
        </p>
        <ul className="list-disc pl-5 space-y-2 font-mono text-xs">
          <li>
            <span className="text-rose-300">AWS p4d.24xlarge</span> — p = GPU accel, 4 = gen, d =
            NVMe, 24xlarge ≈ 96 vCPUs
          </li>
          <li>
            <span className="text-rose-300">GCP a2-highgpu-1g</span> — a2 = A100 family, highgpu =
            ratio, 1g = one GPU
          </li>
          <li>
            <span className="text-rose-300">Azure Standard_ND96asr_v4</span> — ND = AI/HPC GPU, 96
            vCPUs, a = AMD, s = premium storage, r = RDMA, v4 = version
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">Tap each name segment to reveal its meaning.</p>
      </div>
    ),
    Visual: InstanceNameDecoderVisualizer,
  },
  {
    id: 'train-flow',
    title: 'A Decision Process for Selecting a Training VM',
    subtitle: 'Model size → GPU; data pipeline → vCPU / RAM',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Work from the workload definition outward. Two parallel questions drive most of the choice:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Model size &amp; batch size</strong> determine VRAM and
            compute → cost-effective A10G/T4 for small models, or A100/H100 for large LLMs.
          </li>
          <li>
            <strong className="text-white">Data pipeline complexity</strong> determines loading needs
            → high vCPU for heavy image augmentation, standard counts for simple tabular loads.
          </li>
        </ul>
        <p>
          Concrete families to explore: AWS <span className="font-mono text-rose-300">p4 / g5</span>,
          GCP <span className="font-mono text-rose-300">a2 / g2</span>, Azure{' '}
          <span className="font-mono text-rose-300">ND / NC</span>.
        </p>
        <p className="text-xs text-gray-400 italic">Click model and data options to light the path.</p>
      </div>
    ),
    Visual: TrainingDecisionVisualizer,
  },
  {
    id: 'net-storage',
    title: 'Networking and Storage Capabilities',
    subtitle: 'Fabric for multi-node; NVMe to avoid I/O starvation',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>For larger jobs, inspect networking and storage as carefully as the GPU SKU.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Networking</strong> — distributed training across nodes
            needs high bandwidth and low latency. Prefer families with AWS{' '}
            <strong className="text-brand-orange">EFA</strong> or Azure{' '}
            <strong className="text-brand-orange">RDMA</strong>-capable instances.
          </li>
          <li>
            <strong className="text-white">Local NVMe SSDs</strong> — cache data subsets from object
            storage faster than network-attached disks, preventing I/O bottlenecks.
          </li>
        </ul>
        <p>
          Instance selection is a <strong className="text-white">system design</strong> exercise: GPU,
          CPU, RAM, and I/O must work in harmony. An overpowered GPU with a weak CPU wastes budget.
        </p>
        <p className="text-xs text-gray-400 italic">Toggle standard vs EFA/RDMA and network disk vs NVMe.</p>
      </div>
    ),
    Visual: NetStorageVisualizer,
  },
  {
    id: 'inference-intro',
    title: 'Choosing Instances for Inference and Serving',
    subtitle: '24/7 cost curves — start with CPU for many models',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Inference is a different optimization problem than training. Wrong instance choice means{' '}
          <strong className="text-white">continuous</strong> inflated OpEx. Multi-GPU boxes that shine
          in training can be wasteful and slow for single real-time requests.
        </p>
        <h4 className="text-white font-semibold">CPU instances: the cost-effective default</h4>
        <p>
          Outside LLM / generative image workloads — sklearn, XGBoost, small deep nets — CPUs are
          often the practical choice. They excel at individual low-latency requests; GPU parallelism
          sits idle and expensive.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Latency is critical and batching is not possible</li>
          <li>Traffic is low to moderate (horizontal scale is easy)</li>
          <li>The model is not computationally massive</li>
        </ul>
        <p className="text-xs text-gray-400">
          General: <span className="font-mono text-rose-300">m5</span> /{' '}
          <span className="font-mono text-rose-300">e2</span> · Compute-opt:{' '}
          <span className="font-mono text-rose-300">c5</span> /{' '}
          <span className="font-mono text-rose-300">c2</span>
        </p>
      </div>
    ),
    Visual: InferenceCpuVisualizer,
  },
  {
    id: 'gpu-batch',
    title: 'GPU Instances: High Throughput and Large Models',
    subtitle: 'Batching trades a little latency for far lower $/inference',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          GPUs are needed for large deep models or high volumes of concurrent requests. Processing
          one request at a time underutilizes the chip.
        </p>
        <p>
          <strong className="text-white">Batching</strong> groups requests so the GPU’s parallelism
          works. The problem shifts from latency-bound toward throughput-bound: single-request
          latency may rise slightly while inferences/sec rise and cost per inference falls.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-white">T4</strong> — versatile; AWS{' '}
            <span className="font-mono text-rose-300">g4dn</span>, GCP n1 + T4
          </li>
          <li>
            <strong className="text-white">L4</strong> — T4 successor; stronger on video / genAI
          </li>
          <li>
            <strong className="text-white">A10G</strong> — more headroom; AWS{' '}
            <span className="font-mono text-rose-300">g5</span>
          </li>
        </ul>
        <p>
          Implement batching in app logic or with{' '}
          <strong className="text-white">NVIDIA Triton Inference Server</strong>.
        </p>
        <p className="text-xs text-gray-400 italic">Compare serial vs batched and drag batch size.</p>
      </div>
    ),
    Visual: BatchingVisualizer,
  },
  {
    id: 'infer-flow',
    title: 'A Decision Flow for Selecting an Inference Instance',
    subtitle: 'Size → traffic → latency — then optimize',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Walk the requirements in order: model size, traffic volume, then latency strictness. Large
          models or high traffic push you toward GPUs; small models with strict latency and no
          batching favor CPUs.
        </p>
        <p>
          When batching is acceptable, GPU instances (T4, L4) win on throughput. For maximum
          cost-efficiency at stable high volume, consider specialized ASICs (Inferentia, TPU).
        </p>
        <p>
          Regardless of hardware, finish with{' '}
          <strong className="text-white">quantize, batch, and autoscale</strong>.
        </p>
        <p className="text-xs text-gray-400 italic">
          Step through the decision tree interactively.
        </p>
      </div>
    ),
    Visual: InferenceDecisionVisualizer,
  },
  {
    id: 'asic-opt',
    title: 'ASICs, Right-Sizing, and Serverless',
    subtitle: 'Compile for scale — or pay only when traffic arrives',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          <strong className="text-white">Specialized ASICs</strong> (AWS Inferentia{' '}
          <span className="font-mono text-rose-300">inf1/inf2</span>, GCP TPU{' '}
          <span className="font-mono text-rose-300">v4/v5e</span>) target low cost at very large
          inference scale. They require compilation (Neuron SDK) or conversion — more engineering
          overhead, less flexibility than GPUs.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-white">Autoscaling</strong> — add/remove instances on CPU util or
            request count
          </li>
          <li>
            <strong className="text-white">Quantization / pruning</strong> — FP32 → INT8 shrinks
            footprint and speeds serving
          </li>
          <li>
            <strong className="text-white">Serverless</strong> — Lambda, Cloud Run, Azure Functions
            for infrequent traffic (pay per invocation)
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">Explore ASIC compile path, quantize, autoscale, serverless.</p>
      </div>
    ),
    Visual: AsicOptimizeVisualizer,
  },
  {
    id: 'matrix',
    title: 'Inference Infrastructure at a Glance',
    subtitle: 'CPU · GPU · ASIC · Serverless — pick by traffic pattern',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>Use this matrix as a final checklist when locking serving architecture:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">CPU</strong> — low–medium traffic, latency-sensitive,
            traditional ML (m / e2 / DSv4)
          </li>
          <li>
            <strong className="text-white">GPU</strong> — high throughput, large DL, batchable
            requests (g4dn/g5, n1+T4/L4)
          </li>
          <li>
            <strong className="text-white">ASIC</strong> — stable, very high volume for minimum
            $/inference (inf, TPU)
          </li>
          <li>
            <strong className="text-white">Serverless</strong> — infrequent or unpredictable traffic
            (Lambda, Cloud Run, Functions)
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">Tap each category for best-fit and trade-offs.</p>
      </div>
    ),
    Visual: InferenceMatrixVisualizer,
  },
];

export default function LeveragingCloudPlatformsPart2() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-orange-400 to-sky-400" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-rose-400 font-bold tracking-wider text-xs uppercase mb-1 block">
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
                i === currentSlide ? 'w-8 bg-rose-500' : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
          className="p-3 rounded-full bg-rose-600 text-white hover:bg-rose-500 shadow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
