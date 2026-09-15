import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  GpuStarvationVisualizer,
  PipelineOverlapVisualizer,
  PipelineBottlenecksVisualizer,
  WorkersVisualizer,
  PrefetchVisualizer,
  CacheVisualizer,
  DataFormatsVisualizer,
  FullPipelineVisualizer,
  SmiMonitorVisualizer,
  TorchProfiler3Visualizer,
  TensorBoardProfilerVisualizer,
  TraceHealVisualizer,
} from '../components/PerformanceOptimizationPart3Visualizers';

export const meta = {
  title: 'Strategies for Performance Optimization (Part 3)',
  subtitle: 'Data loading pipelines, and profiling GPU/CPU usage to prove where the time goes',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'starvation',
    title: 'Optimizing Data Loading and Preprocessing Pipelines',
    subtitle: 'A powerful GPU is only as fast as the data you can feed it',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Many machine learning workflows bottleneck in the training loop not because of the GPU&apos;s
          computational power, but because of the data loading and preprocessing pipeline.
        </p>
        <p>
          When the GPU finishes a batch and has to wait for the next one, it sits idle. This{' '}
          <strong className="text-rose-300">GPU starvation</strong> wastes expensive resources and
          lengthens training times.
        </p>
        <p>
          Optimizing your data pipeline is not a minor tweak. It is a fundamental step toward
          high-throughput training, and it is frequently the single highest-leverage change available to
          you.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: change how fast the CPU can feed batches and watch the GPU utilisation follow.
        </p>
      </div>
    ),
    Visual: GpuStarvationVisualizer,
  },
  {
    id: 'overlap',
    title: 'Sequential vs. Parallel Pipelines',
    subtitle: 'The same work, stacked instead of queued',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The core issue is that data loading and model training are often treated as{' '}
          <strong className="text-white">sequential steps</strong>. The CPU prepares a batch, hands it to
          the GPU, and only then starts preparing the next batch.
        </p>
        <p>
          An efficient pipeline transforms this into a parallel, assembly-line process where the CPU is
          always preparing the next batch while the GPU is busy working on the current one.
        </p>
        <p>
          Nothing in the parallel version is individually faster. The read still takes as long, the
          augmentation still takes as long. The gain comes entirely from the two resources being busy at
          the same time.
        </p>
        <p>
          Every technique in the rest of this part — workers, prefetching, caching, file formats — is a
          different way of producing this one picture.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: advance the clock and compare the two timelines side by side.
        </p>
      </div>
    ),
    Visual: PipelineOverlapVisualizer,
  },
  {
    id: 'bottlenecks',
    title: 'Identifying Common Pipeline Bottlenecks',
    subtitle: 'I/O bound · CPU bound · inefficient transformations',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>Before you can fix the problem, you need to know where it is. The usual culprits:</p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">I/O bound:</strong> slowed by reading data from storage.
            Frequent with thousands of small files (individual JPEGs) or slow network storage. The
            overhead of opening, reading and closing each file adds up.
          </li>
          <li>
            <strong className="text-white">CPU bound:</strong> the transformations themselves are
            computationally intensive. Complex image augmentation or text tokenization on the CPU can take
            longer than the GPU needs to train on the batch.
          </li>
          <li>
            <strong className="text-white">Inefficient transformations:</strong> pure Python loops and
            non-vectorized operations are dramatically slower than the optimized equivalents in NumPy,
            TensorFlow or PyTorch — often by a factor of fifty for identical logic.
          </li>
        </ul>
        <p>
          The three look similar from the outside — an idle GPU — but each has a completely different fix,
          which is why identifying the right one first matters.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: pick a culprit and see where it sits in the pipeline, how to spot it, and what to do.
        </p>
      </div>
    ),
    Visual: PipelineBottlenecksVisualizer,
  },
  {
    id: 'workers',
    title: 'Parallelize Data Loading with Multiple Workers',
    subtitle: 'num_workers · pin_memory · num_parallel_calls',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The most direct way to speed up a data pipeline is to use multiple processes to load and
          preprocess data in parallel. This is especially effective against both I/O and CPU bottlenecks.
        </p>
        <p>
          In PyTorch the <span className="font-mono text-xs">DataLoader</span> has a{' '}
          <span className="font-mono text-xs text-rose-300">num_workers</span> argument. Setting it above
          zero spawns that many separate Python processes loading data in the background. On Linux a good
          starting point is the number of CPU cores; be more cautious on Windows, where process spawning
          has more overhead.
        </p>
        <p>
          In TensorFlow, <span className="font-mono text-xs">tf.data</span> offers the same through{' '}
          <span className="font-mono text-xs text-rose-300">num_parallel_calls</span> on{' '}
          <span className="font-mono text-xs">dataset.map()</span>, applying your preprocessing across
          multiple cores.
        </p>
        <p>
          More is not automatically better — past the core count, processes compete for the same CPUs and
          each one costs memory.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: add workers one at a time and watch utilisation rise, then turn over.
        </p>
      </div>
    ),
    Visual: WorkersVisualizer,
  },
  {
    id: 'prefetch',
    title: 'Prefetch Data to Overlap Computation',
    subtitle: 'Decouple the producer from the consumer',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Prefetching decouples data production (CPU) from data consumption (GPU). It creates a small
          buffer of preprocessed batches that are ready to be sent to the GPU.
        </p>
        <p>
          While the GPU trains on batch <span className="font-mono text-xs text-rose-300">N</span>, the CPU
          is already preparing batch <span className="font-mono text-xs text-rose-300">N+1</span>. This
          simple technique can almost completely eliminate GPU starvation — as long as the data pipeline
          can keep up on average.
        </p>
        <p>
          In TensorFlow this is <span className="font-mono text-xs">prefetch()</span> as the final step of
          your <span className="font-mono text-xs">tf.data</span> pipeline.
        </p>
        <p>
          In PyTorch, a <span className="font-mono text-xs">DataLoader</span> with{' '}
          <span className="font-mono text-xs">num_workers &gt; 0</span> already performs a form of
          prefetching. <span className="font-mono text-xs">pin_memory=True</span> optimizes this further by
          staging data in page-locked memory, allowing faster asynchronous transfer to the GPU.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: toggle the buffer on and step through batches to see the GPU stop waiting.
        </p>
      </div>
    ),
    Visual: PrefetchVisualizer,
  },
  {
    id: 'cache',
    title: 'Cache Datasets in Memory',
    subtitle: 'Pay the disk cost once — if it fits',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          If your entire dataset fits into RAM, you can cache it after the first epoch. During epoch one
          data is loaded from disk and processed; the result is stored in memory. Every subsequent epoch
          reads directly from that fast in-memory cache, bypassing disk I/O and the initial preprocessing
          entirely.
        </p>
        <p>This is extremely effective for datasets up to a few gigabytes.</p>
        <p>
          Placement matters. Cache <em>before</em> shuffling and batching so you are caching the
          individual preprocessed items — if you cache after the shuffle, every epoch replays the identical
          order and you lose the randomness training depends on.
        </p>
        <p className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs">
          <strong className="text-amber-300">Warning:</strong> be mindful of available RAM. Caching a
          dataset larger than memory will slow the system dramatically or crash it. Use this only when
          appropriate.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: run the epochs and watch the second one fall off a cliff — then oversize the dataset.
        </p>
      </div>
    ),
    Visual: CacheVisualizer,
  },
  {
    id: 'formats',
    title: 'Use Efficient Data Formats',
    subtitle: 'Fewer, larger, contiguous files',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The way you store data on disk matters. Reading millions of small files incurs significant
          filesystem overhead. It is far more efficient to read from a smaller number of large, contiguous
          binary files.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">TFRecord (TensorFlow):</strong> a sequence of binary records,
            letting you stream large datasets from disk efficiently without loading the entire file into
            memory.
          </li>
          <li>
            <strong className="text-white">WebDataset (PyTorch):</strong> stores datasets in simple tar
            archives, with efficient streaming and shuffling. Well suited to distributed training.
          </li>
          <li>
            <strong className="text-white">HDF5 / Parquet:</strong> column-oriented formats, excellent for
            tabular data and very fast reads of specific columns.
          </li>
        </ul>
        <p>
          Migrating from individual files to a format like TFRecord can substantially reduce data loading
          times, especially on network-based storage where every round trip also carries latency.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: switch between a million JPEGs and a thousand shards, and compare where the time goes.
        </p>
      </div>
    ),
    Visual: DataFormatsVisualizer,
  },
  {
    id: 'pipeline',
    title: 'A Complete Optimized Pipeline',
    subtitle: 'Six operations, chained in a deliberate order',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          By combining these techniques you can build a highly performant data pipeline. The recommended
          practice in TensorFlow is to chain the operations in a specific order to maximize their benefit:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 text-xs">
          <li>Create the dataset from a performant file format like TFRecord.</li>
          <li>
            <span className="font-mono">cache()</span> early, for datasets that fit in memory.
          </li>
          <li>
            <span className="font-mono">shuffle()</span> with a large buffer for real randomness.
          </li>
          <li>
            <span className="font-mono">map()</span> the preprocessing in parallel with AUTOTUNE.
          </li>
          <li>
            <span className="font-mono">batch()</span> the data.
          </li>
          <li>
            <span className="font-mono">prefetch()</span> last, to overlap CPU and GPU work.
          </li>
        </ol>
        <p>
          By systematically analyzing and optimizing how your model receives data, you ensure your
          expensive compute resources are always put to good use — which translates directly into faster
          experiments and more efficient model training.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: tap any step in the chain to see why it sits where it does.
        </p>
      </div>
    ),
    Visual: FullPipelineVisualizer,
  },
  {
    id: 'smi',
    title: 'Profiling GPU and CPU Usage',
    subtitle: 'High-level system monitoring with htop and nvidia-smi',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          To optimize a system you must first understand its behaviour. Running a training job and waiting
          for it to finish tells you how long it took, not <em>why</em>. Profiling moves you from guessing
          to data-driven decisions.
        </p>
        <p>
          Start simple. <span className="font-mono text-xs text-rose-300">htop</span> gives a color-coded,
          real-time view of your CPU cores and memory. If one or more cores sit consistently at 100% while
          the GPU is idle, you likely have a CPU bottleneck — often image augmentation or tokenization
          running before data reaches the GPU.
        </p>
        <p>
          For NVIDIA GPUs, <span className="font-mono text-xs text-rose-300">nvidia-smi</span> is
          indispensable. Run it continuously with{' '}
          <span className="font-mono text-xs">watch -n 1 nvidia-smi</span>.
        </p>
        <p>
          The key fields are <strong className="text-white">GPU-Util</strong> (should be consistently above
          90% for a well-optimized workload), <strong className="text-white">Memory-Usage</strong> (a
          different problem — OOM risk, not idleness), and{' '}
          <strong className="text-white">Pwr:Usage/Cap</strong> (high draw means the GPU is working hard).
        </p>
        <p>
          If nvidia-smi shows low GPU-Util, your investigation should turn immediately to the data pipeline
          and CPU-bound operations.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: tap the fields in the real nvidia-smi output to learn what each one means.
        </p>
      </div>
    ),
    Visual: SmiMonitorVisualizer,
  },
  {
    id: 'torchprof',
    title: 'Granular Analysis with Framework Profilers',
    subtitle: 'torch.profiler — what the GPU is doing, not just whether it is busy',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          While <span className="font-mono text-xs">nvidia-smi</span> tells you <em>if</em> your GPU is
          busy, it does not tell you <em>what</em> it is doing. For that you need a profiler built into
          your framework, which can break down execution time for every function, kernel launch and memory
          copy.
        </p>
        <p>
          PyTorch includes <span className="font-mono text-xs text-rose-300">torch.profiler</span>. You
          wrap the code you want to analyze — typically the training loop — in a context manager, and it
          tracks both CPU and GPU activity.
        </p>
        <p>
          <span className="font-mono text-xs">prof.key_averages().table()</span> gives a list of operations
          showing CPU and GPU time for each, which is extremely useful for finding the specific layers or
          functions taking the most time.
        </p>
        <p>
          For a more powerful view you can export the results as a Chrome trace file or open them in
          TensorBoard. The trace view shows a timeline of operations, making it easy to spot gaps where the
          GPU is idle — something a table can never show you.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: tap any block of the script, then see the table it produces.
        </p>
      </div>
    ),
    Visual: TorchProfiler3Visualizer,
  },
  {
    id: 'tbprof',
    title: 'Profiling in TensorFlow',
    subtitle: 'The TensorBoard callback and its three tools',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          TensorFlow&apos;s profiler is tightly integrated with TensorBoard. The easiest way to capture a
          profile is the TensorBoard callback during{' '}
          <span className="font-mono text-xs">tf.keras</span> training, configured to profile specific
          batches with <span className="font-mono text-xs text-rose-300">profile_batch=&apos;10,20&apos;</span>.
        </p>
        <p>After running, launch TensorBoard and open the Profile tab. You get several tools:</p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Overview Page:</strong> a high-level summary with
            recommendations. It will often tell you directly that your program is input-bound.
          </li>
          <li>
            <strong className="text-white">Trace Viewer:</strong> the most valuable tool. Like the PyTorch
            trace, a timeline of all operations on CPU and GPU.
          </li>
          <li>
            <strong className="text-white">Input Pipeline Analyzer:</strong> analyzes your{' '}
            <span className="font-mono">tf.data</span> pipeline specifically, finding bottlenecks in data
            loading and preprocessing.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Right: the callback code, then a mock of each of the three tools.
        </p>
      </div>
    ),
    Visual: TensorBoardProfilerVisualizer,
  },
  {
    id: 'heal',
    title: 'Visualizing the Performance Timeline',
    subtitle: 'Put it all together and watch the idle gaps close',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The trace viewer in both frameworks is the tool that makes a slow input pipeline obvious. In a
          starved run, the GPU executes a batch quickly and then sits idle while the CPU loads,
          preprocesses and transfers the next one. Those gaps on the GPU timeline are wasted compute
          capacity, and you can measure their duration directly.
        </p>
        <p>
          The goal of optimization is to pipeline these activities so the CPU is always preparing a future
          batch while the GPU works on the current one — eliminating the IDLE gaps entirely.
        </p>
        <p>Here is the whole part in one control panel:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-white">Workers</strong> shorten the preprocessing block.
          </li>
          <li>
            <strong className="text-white">Cache</strong> shortens the read block.
          </li>
          <li>
            <strong className="text-white">Prefetch</strong> is the one that actually overlaps the two
            rows.
          </li>
        </ul>
        <p>
          Note what happens with prefetch alone: overlap only helps if the producer can roughly keep up.
          The techniques are complementary, not alternatives.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: switch each technique on and watch step time, GPU idle and speedup respond.
        </p>
      </div>
    ),
    Visual: TraceHealVisualizer,
  },
];

export default function StrategiesForPerformanceOptimizationPart3() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-orange-400 to-emerald-400" />

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
