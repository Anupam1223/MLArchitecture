import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  WhyProfileVisualizer,
  BottleneckTypesVisualizer,
  SystemMonitorVisualizer,
  DiagnosticFlowVisualizer,
  TorchProfilerVisualizer,
  TfProfilerVisualizer,
  TraceReadingVisualizer,
  DistributedIntroVisualizer,
  DataParallelVisualizer,
  ModelParallelVisualizer,
  StrategyChoiceVisualizer,
  FrameworksVisualizer,
} from '../components/PerformanceOptimizationPart1Visualizers';

export const meta = {
  title: 'Strategies for Performance Optimization (Part 1)',
  subtitle: 'Finding bottlenecks with profilers, then scaling out with distributed training',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'why',
    title: 'Identifying Performance Bottlenecks',
    subtitle: 'Why you must measure before you spend',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Before you can fix a performance problem, you must first find it. A common mistake is to assume
          that adding a more powerful GPU will magically accelerate a slow training job.
        </p>
        <p>
          Compute power matters, but the true bottleneck might be hiding in your{' '}
          <strong className="text-white">data loading pipeline</strong>,{' '}
          <strong className="text-white">network communication</strong>, or inefficient{' '}
          <strong className="text-white">CPU operations</strong>.
        </p>
        <p>
          This process of measurement and identification is called{' '}
          <strong className="text-cyan-300">profiling</strong>. Profiling moves you from guesswork to
          data-driven optimization, ensuring your effort lands on the part of the system that is actually
          constraining performance.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: spend money on each component and watch what it actually buys you.
        </p>
      </div>
    ),
    Visual: WhyProfileVisualizer,
  },
  {
    id: 'anatomy',
    title: 'The Anatomy of a Bottleneck',
    subtitle: 'CPU-bound · GPU-bound · I/O-bound · Network-bound',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          In an AI system, performance is limited by the slowest component in the chain. Think of it as a
          factory assembly line: the entire line can only move as fast as its slowest station.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">CPU-bound:</strong> limited by the CPU. Common during data
            preprocessing and augmentation. If the GPU is idle while cores run at 100%, your highly
            parallel accelerator is being starved of data.
          </li>
          <li>
            <strong className="text-white">GPU-bound:</strong> limited by the accelerator. During deep
            network training this is the <em>desired</em> state — the pipeline is efficient and the GPU is
            doing the heavy lifting. There is still room to improve with mixed precision or better
            architectures.
          </li>
          <li>
            <strong className="text-white">I/O-bound:</strong> limited by storage. Millions of small files
            on an HDD or a network filesystem is the classic cause. The fastest GPU is useless if it waits
            on data.
          </li>
          <li>
            <strong className="text-white">Network-bound:</strong> in distributed training, limited by
            bandwidth or latency while gradients synchronize across nodes.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Right: pick a station to slow down and see who queues and who starves.
        </p>
      </div>
    ),
    Visual: BottleneckTypesVisualizer,
  },
  {
    id: 'monitor',
    title: 'Step 1: High-Level System Monitoring',
    subtitle: 'nvidia-smi and htop before anything else',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A systematic investigation uses a hierarchy of tools, from high-level system monitors down to
          fine-grained code profilers. Always start by observing the system during a real training run.
        </p>
        <p>
          The indispensable tool for GPU monitoring is the NVIDIA System Management Interface. Running it
          in a loop gives a real-time view:
        </p>
        <p className="font-mono text-xs text-cyan-300">watch -n 1 nvidia-smi</p>
        <p>
          Look at <strong className="text-white">GPU-Util</strong>. Consistently high (&gt;90%) means you
          are likely GPU-bound. Low or wildly fluctuating means the bottleneck is elsewhere.
        </p>
        <p>
          Then use a CPU monitor like <span className="font-mono text-xs">htop</span>. If GPU-Util is low
          while one or more cores are pegged at 100%, you have strong evidence of a CPU bottleneck —
          usually a Python data loader struggling to keep up.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: three scenarios, two live monitors, one verdict each.
        </p>
      </div>
    ),
    Visual: SystemMonitorVisualizer,
  },
  {
    id: 'flow',
    title: 'A Diagnostic Flow for Bottlenecks',
    subtitle: 'From observation to a verdict in two questions',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>This initial analysis can quickly guide your investigation. The logic is short:</p>
        <ol className="list-decimal pl-5 space-y-2 text-xs">
          <li>Run the workload and monitor it.</li>
          <li>
            Check GPU-Util with <span className="font-mono">nvidia-smi</span>. Above 90% → likely
            GPU-bound, and you are done here.
          </li>
          <li>
            Below 50% → check CPU-Util with <span className="font-mono">htop</span>.
          </li>
          <li>CPU high → likely CPU-bound. CPU low → likely I/O or network bound.</li>
        </ol>
        <p>
          It is deliberately coarse. The goal is not a precise answer, it is to point your expensive,
          detailed profiling at the right half of the system.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: answer the questions and walk the tree to your verdict.
        </p>
      </div>
    ),
    Visual: DiagnosticFlowVisualizer,
  },
  {
    id: 'torch',
    title: 'Step 2: In-Depth Profiling — PyTorch',
    subtitle: 'torch.profiler traces every operation on CPU and CUDA',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Once high-level monitoring points you in a direction, it is time for specialized tools. Both
          PyTorch and TensorFlow ship powerful profilers that trace execution on CPU and GPU, pinpointing
          exactly which operations cost the most time.
        </p>
        <p>
          The <span className="font-mono text-xs text-cyan-300">torch.profiler</span> module provides a
          context manager that makes profiling a section of your code straightforward. It tracks the
          duration of every operation and can attribute time back to the original Python source.
        </p>
        <p>
          The output is a table of the most time-consuming operations on both the CPU and the CUDA
          devices, sorted however you choose.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: the full instrumented training loop, plus the table it produces.
        </p>
      </div>
    ),
    Visual: TorchProfilerVisualizer,
  },
  {
    id: 'tf',
    title: 'In-Depth Profiling — TensorFlow',
    subtitle: 'tf.profiler.experimental.Profile and the TensorBoard Profile tab',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          TensorFlow&apos;s profiler is tightly integrated with TensorBoard, providing a rich, interactive
          interface for exploring performance data. You enable it with a{' '}
          <span className="font-mono text-xs text-cyan-300">tf.profiler.experimental.Profile</span>{' '}
          context manager.
        </p>
        <p>
          After running the instrumented code, launching TensorBoard reveals a{' '}
          <strong className="text-white">Profile</strong> tab: a timeline of operations, performance
          statistics, and a <strong className="text-white">Trace Viewer</strong> that visualizes execution
          on both the CPU and GPU.
        </p>
        <p className="font-mono text-xs text-cyan-300">tensorboard --logdir logs/profile/</p>
        <p className="text-xs text-gray-400 italic">
          Right: the full script, then what TensorBoard actually shows you.
        </p>
      </div>
    ),
    Visual: TfProfilerVisualizer,
  },
  {
    id: 'trace',
    title: 'Reading the Signs: Interpreting Profiler Output',
    subtitle: 'The shape of the gaps tells you the answer',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The output from these profilers, especially the timeline or trace view, is incredibly revealing.
          You are looking for patterns.
        </p>
        <p>
          An <strong className="text-white">ideal profile</strong> shows the GPU packed with computation
          kernels with very few gaps in between, while the CPU is active just before the GPU work begins,
          preparing the next batch. That is a healthy, GPU-bound workload.
        </p>
        <p>
          A <strong className="text-white">CPU-bound profile</strong> tells a different story: large gaps
          on the GPU timeline, and during those gaps the trace shows significant CPU activity in your{' '}
          <span className="font-mono text-xs">DataLoader</span> or augmentation functions. The GPU is
          waiting for the CPU.
        </p>
        <p>
          If both CPU and GPU utilization are low, the bottleneck is likely I/O — the CPU sits in a wait
          state. Shift to <span className="font-mono text-xs">iostat</span> or{' '}
          <span className="font-mono text-xs">dstat</span> to confirm the system is waiting on storage.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: switch between the three trace shapes and compare the idle bar.
        </p>
      </div>
    ),
    Visual: TraceReadingVisualizer,
  },
  {
    id: 'dist',
    title: 'Techniques for Distributed Training',
    subtitle: 'Scaling out, and the communication tax you pay for it',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          When a single GPU is no longer sufficient — the dataset is massive or the model itself is
          enormous — you must scale the job across multiple processors. Done well, this moves training
          from weeks to days, or days to hours.
        </p>
        <p>
          But it is not as simple as adding hardware. The primary challenge in distributed training is{' '}
          <strong className="text-white">communication</strong>. Every time GPUs synchronize they spend
          time sending data to each other instead of computing.
        </p>
        <p>
          Your goal is to maximize computation while minimizing this overhead. The two principal
          strategies for dividing the work are{' '}
          <strong className="text-cyan-300">data parallelism</strong> and{' '}
          <strong className="text-cyan-300">model parallelism</strong>.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: add GPUs and watch real speedup drift away from ideal speedup.
        </p>
      </div>
    ),
    Visual: DistributedIntroVisualizer,
  },
  {
    id: 'dataparallel',
    title: 'Data Parallelism: One Model, Many Data Slices',
    subtitle: 'Replicate → Split → Compute → All-Reduce → Update',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The most common and most straightforward strategy. You replicate the entire model on each GPU,
          but feed each GPU a different slice of the input data — an effective way to process a much
          larger batch in the same time.
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-white">Replicate:</strong> the model is copied into each GPU&apos;s
            memory.
          </li>
          <li>
            <strong className="text-white">Split:</strong> a global batch is divided into mini-batches,
            one per GPU.
          </li>
          <li>
            <strong className="text-white">Compute:</strong> each GPU runs forward and backward on its own
            slice, producing different gradients.
          </li>
          <li>
            <strong className="text-white">Synchronize:</strong> an <strong>All-Reduce</strong> sums the
            gradients from all GPUs and distributes the result back to every one of them.
          </li>
          <li>
            <strong className="text-white">Update:</strong> each GPU applies the averaged gradient, so all
            replicas stay identical.
          </li>
        </ol>
        <p>
          Its limit is communication bandwidth — NVLink or PCIe inside a machine, networking between them.
          It also does not help if the model itself will not fit on one device.
        </p>
        <p className="text-xs text-gray-400 italic">Right: step through one full training step.</p>
      </div>
    ),
    Visual: DataParallelVisualizer,
  },
  {
    id: 'modelparallel',
    title: 'Model Parallelism: One Model, Split Across GPUs',
    subtitle: 'The assembly line — and the pipeline bubble',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          What if the model has billions of parameters and cannot fit in even the largest GPU? Instead of
          replicating the model, you split the model itself.
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-white">Partition:</strong> layers are divided across devices — in a
            24-layer transformer, GPU 0 might hold layers 1–12 and GPU 1 layers 13–24.
          </li>
          <li>
            <strong className="text-white">Forward pass:</strong> data enters GPU 0, which computes its
            activations and passes the result to GPU 1, which produces the output.
          </li>
          <li>
            <strong className="text-white">Backward pass:</strong> reversed — gradients are computed on
            GPU 1 and passed back to GPU 0.
          </li>
        </ol>
        <p>
          The main drawback is GPU underutilization: while GPU 1 works, GPU 0 is idle and vice versa. That
          dead space is the <strong className="text-white">pipeline bubble</strong>.
        </p>
        <p>
          Advanced techniques like <strong className="text-white">pipeline parallelism</strong> (e.g.
          GPipe) split the batch into micro-batches so the GPUs work on different micro-batches
          simultaneously, reducing idle time. Model parallelism is significantly more complex than data
          parallelism, and is reserved for when it is the only option.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: step the single pass, then toggle micro-batching to collapse the bubble.
        </p>
      </div>
    ),
    Visual: ModelParallelVisualizer,
  },
  {
    id: 'choice',
    title: 'Making the Choice: Data vs. Model Parallelism',
    subtitle: 'And the hybrid case at frontier scale',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>For most scenarios the choice is clear:</p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Use data parallelism if your model fits into a single
            GPU&apos;s memory.</strong> This is the default and the most efficient way to speed up
            training on large datasets.
          </li>
          <li>
            <strong className="text-white">Use model parallelism only when your model is too large for a
            single GPU.</strong> It is a solution for memory constraints, not for speed.
          </li>
        </ul>
        <p>
          In extreme cases, such as training state-of-the-art LLMs, the techniques are combined.{' '}
          <strong className="text-cyan-300">Hybrid parallelism</strong> uses model parallelism to split a
          massive model across the GPUs within one server node, then data parallelism to replicate that
          multi-GPU setup across many nodes.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: pick a model and a GPU size, and see which strategy the memory math forces on you.
        </p>
      </div>
    ),
    Visual: StrategyChoiceVisualizer,
  },
  {
    id: 'frameworks',
    title: 'Frameworks for Distributed Training',
    subtitle: 'DistributedDataParallel and tf.distribute.Strategy',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Manually managing gradient synchronization and data transfer is complex and error-prone.
          Fortunately, the major frameworks provide high-level abstractions that handle it for you.
        </p>
        <p>
          <strong className="text-white">PyTorch:</strong> the primary tool is{' '}
          <span className="font-mono text-xs text-cyan-300">
            torch.nn.parallel.DistributedDataParallel
          </span>{' '}
          (DDP). You wrap your model with DDP and it automatically distributes data, aggregates gradients
          using the efficient All-Reduce algorithm, and keeps the replicas in sync.
        </p>
        <p>
          <strong className="text-white">TensorFlow:</strong> the{' '}
          <span className="font-mono text-xs text-cyan-300">tf.distribute.Strategy</span> API is a
          flexible way to distribute training.{' '}
          <span className="font-mono text-xs">MirroredStrategy</span> and{' '}
          <span className="font-mono text-xs">MultiWorkerMirroredStrategy</span> are the common choices
          for data parallelism. You define the strategy, then build and compile your model inside its
          scope.
        </p>
        <p>
          These tools abstract away the low-level details, letting you convert a single-GPU script to a
          distributed one with relatively few code changes.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: both full scripts, tap any block to see what that line is doing.
        </p>
      </div>
    ),
    Visual: FrameworksVisualizer,
  },
];

export default function StrategiesForPerformanceOptimizationPart1() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-cyan-400 font-bold tracking-wider text-xs uppercase mb-1 block">
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
                i === currentSlide ? 'w-8 bg-cyan-500' : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
          className="p-3 rounded-full bg-cyan-600 text-white hover:bg-cyan-500 shadow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
