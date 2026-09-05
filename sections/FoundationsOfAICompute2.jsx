import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  CpuGpuArchVisualizer,
  ParallelMatmulVisualizer,
  ComparisonTableVisualizer,
  AsicKitchenVisualizer,
  SystolicArrayVisualizer,
  EcosystemVisualizer,
  FlexibilityTradeoffVisualizer,
} from '../components/FoundationsPart2Visualizers';

export const meta = {
  title: 'Foundations of AI Compute (Part 2)',
  subtitle: 'CPU vs GPU silicon, why matmul parallelizes, TPUs and ASICs',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'cpu_gpu_arch',
    title: 'Comparing CPU and GPU Architectures',
    subtitle: 'Few powerful cores vs thousands of simple ones',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          CPUs and GPUs are both silicon processors, but they spend the transistor budget on opposite
          bets. That split decides what an ML stack should run where.
        </p>

        <h4 className="text-white font-semibold text-base pt-1">
          The CPU: a few powerful cores for sequential logic
        </h4>
        <p>
          A CPU is built for <strong className="text-brand-blue">low-latency, single-thread</strong>{' '}
          work. A handful of fat cores (typically 4–64) each run complex programs well.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Large caches:</strong> CPUs have substantial L1, L2, and
            L3 caches to store frequently accessed data and instructions, minimizing the time spent
            fetching information from slower main memory (RAM).
          </li>
          <li>
            <strong className="text-white">Complex control logic:</strong> A significant portion of
            a CPU's die space is dedicated to sophisticated control units, including branch
            predictors and speculative execution engines. This allows the CPU to make intelligent
            guesses about which instructions will be needed next, optimizing workflows with complex
            conditional logic (
            <span className="text-brand-rose font-mono">if-else</span> statements) and unpredictable
            access patterns.
          </li>
        </ul>
        <p>
          In ML, the CPU still owns preprocessing, file I/O, the Python interpreter, and the training
          loop’s control flow.
        </p>

        <h4 className="text-white font-semibold text-base pt-1">
          The GPU: thousands of simple cores for throughput
        </h4>
        <p>
          A GPU is built for <strong className="text-brand-green">high-throughput</strong> math.
          Thousands of weaker cores execute the same instruction on different data.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Massive parallelism:</strong> All cores on a GPU can
            execute the same instruction on different pieces of data simultaneously. This model is
            often referred to as{' '}
            <span className="font-mono text-cyan-300">SIMT</span> (Single Instruction, Multiple
            Threads).
          </li>
          <li>
            <strong className="text-white">High-bandwidth memory:</strong> GPUs are equipped with
            their own dedicated, high-speed memory (like{' '}
            <span className="font-mono text-cyan-300">GDDR6</span> or{' '}
            <span className="font-mono text-cyan-300">HBM</span>) connected via a very wide memory
            bus. This is essential for feeding its thousands of cores with data, preventing them
            from sitting idle.
          </li>
          <li>
            <strong className="text-white">Simple control logic:</strong> GPUs dedicate far less
            silicon to complex control logic and have smaller caches per core compared to CPUs.
            They are optimized to run the same computation over and over on large streams of data,
            not for handling intricate, decision-heavy program flow.
          </li>
        </ul>
        <p className="italic text-gray-400 text-xs">
          Use the visual: CPU close-up, GPU close-up, or both diagrams at once.
        </p>
      </div>
    ),
    Visual: CpuGpuArchVisualizer,
  },
  {
    id: 'why_gpus',
    title: 'Why GPUs Dominate Deep Learning',
    subtitle: 'Independent Cij cells are a perfect GPU job',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Deep learning is mostly matrix multiplies. A dense layer is:
        </p>
        <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-3 text-center font-serif italic text-slate-100">
          output = activation(
          <span className="text-brand-rose">weights</span>
          {' · '}
          <span className="text-brand-rose">inputs</span> + bias)
        </div>
        <p>
          The operation <span className="text-brand-rose font-semibold">weights · inputs</span> is
          one huge <span className="font-mono text-cyan-300">C = A · B</span>. Each element{' '}
          <span className="font-mono text-cyan-300">Cᵢⱼ</span> is the dot product of row i of A and
          column j of B — and it does <strong className="text-white">not</strong> depend on any
          other Cᵢⱼ.
        </p>
        <p>
          That is a <strong className="text-brand-green">perfectly parallelizable</strong> problem.
          A GPU assigns thousands of those tiny dots to thousands of cores in the same wave.
        </p>
        <p>
          A CPU walks the cells a few at a time. The same 4096×4096 layer that finishes in minutes
          on a GPU can take hours if you force it down a handful of fat cores.
        </p>
        <p className="text-xs text-gray-400 italic">
          Play CPU mode (four sequential steps) then GPU mode (one wave). The math stays identical —
          only the schedule changes.
        </p>
      </div>
    ),
    Visual: ParallelMatmulVisualizer,
  },
  {
    id: 'comparison',
    title: 'A Side-by-Side Comparison',
    subtitle: 'Where each chip wins in an ML stack',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The table on the right is the cheat sheet: design goal, core count, memory, strengths, and
          the jobs you should actually assign.
        </p>
        <p>
          Modern AI boxes use <strong className="text-white">both</strong>. The CPU is the general
          — it directs traffic, prepares data, and runs the script. The GPU is the specialized
          co-processor for the heavy parallel arithmetic.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-brand-blue">CPU:</strong> tokenize, decode images, shuffle,
            Python <span className="font-mono text-brand-rose">if-else</span>, small-model CPU
            inference.
          </li>
          <li>
            <strong className="text-brand-green">GPU:</strong> train deep nets, serve large models,
            anything that is a wall of matmuls.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Click a table row, then try the job chips — “who should run this?”
        </p>
      </div>
    ),
    Visual: ComparisonTableVisualizer,
  },
  {
    id: 'asic_intro',
    title: 'Introduction to TPUs and other ASICs',
    subtitle: 'When you carve silicon for one job',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          CPUs and GPUs stay flexible. When one workload is large enough — and stable enough — teams
          build an <strong className="text-white">ASIC</strong> (Application-Specific Integrated
          Circuit) for maximum efficiency on that job alone.
        </p>

        <h4 className="text-white font-semibold text-base">What is an ASIC?</h4>
        <p>
          A CPU is a programmable kitchen. An ASIC is a coffee grinder: it does one thing, faster,
          with less energy. Google’s <strong className="text-brand-orange">TPU</strong> (Tensor
          Processing Unit) is the landmark AI ASIC — designed to run TensorFlow / JAX ops, not a
          desktop.
        </p>

        <h4 className="text-white font-semibold text-base">The Systolic Array Architecture</h4>
        <p>
          A systolic array is a grid of simple, identical processing elements (PEs) that are
          connected to their nearest neighbors. Data flows through this grid in a rhythmic,
          wave-like pattern, similar to how blood is pumped through the circulatory system, which
          is where the name “systolic” comes from.
        </p>
        <p>
          Here is how it works for a matrix multiplication{' '}
          <span className="font-mono text-cyan-300">C = A · B</span>:
        </p>
        <ol className="list-decimal pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Load weights:</strong> The values from one matrix (e.g.,
            the model’s weights) are pre-loaded into the array of processing elements.
          </li>
          <li>
            <strong className="text-white">Stream data:</strong> The values from the other matrix
            (e.g., the input activations) are streamed into the array from one edge.
          </li>
          <li>
            <strong className="text-white">Compute and pass:</strong> As the input data streams
            through, each PE performs a multiply-accumulate (MAC) operation. It multiplies the
            incoming activation by its stored weight and adds the result to the value passed from
            its neighbor. It then passes its own input data and the accumulated result to the next
            PE in the sequence.
          </li>
        </ol>
        <p>
          This design is incredibly efficient because data is constantly moving and being computed
          upon. The values of the weight matrix are reused many times without needing to be fetched
          from memory repeatedly, which dramatically reduces memory bandwidth bottlenecks and power
          consumption.
        </p>
      </div>
    ),
    Visual: AsicKitchenVisualizer,
  },
  {
    id: 'systolic',
    title: 'Systolic Arrays and the MAC',
    subtitle: 'acc ← acc + w × x, then pass it on',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Forget the scary grid for a second. Every PE only knows this line:
        </p>
        <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-3 text-center font-mono text-cyan-200">
          acc ← acc + w × x
        </div>
        <p>
          That is a <strong className="text-white">MAC</strong> (multiply-accumulate). A 2×2 matmul
          is just four of these, each summing two products. A TPU is millions of MACs, pulsing in
          lockstep.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-brand-rose">Weights</strong> enter from the side.
          </li>
          <li>
            <strong className="text-sky-300">Activations</strong> drop from the top.
          </li>
          <li>
            When both arrive, the PE multiplies, adds into{' '}
            <span className="font-mono">acc</span>, and passes values to neighbors.
          </li>
          <li>
            In this demo the result <strong className="text-brand-green">C stays in the PE</strong>{' '}
            (output-stationary) — read it once at the end.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Step the clocks. Click a PE to see its local MAC. Same 2×2 as the GPU slide: C = [[10, 7],
          [6, 15]].
        </p>
      </div>
    ),
    Visual: SystolicArrayVisualizer,
  },
  {
    id: 'tradeoff',
    title: 'The Trade-Off: Performance vs Flexibility',
    subtitle: 'TOPS-per-watt is never free',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The specialization of ASICs leads to massive gains in performance and power efficiency —
          often an order of magnitude better than even high-end GPUs for specific tasks. This is
          typically measured in <strong className="text-white">Tera Operations Per Second (TOPS)</strong>{' '}
          and, more importantly for large-scale deployment,{' '}
          <strong className="text-white">TOPS-per-watt</strong>.
        </p>
        <p>
          However, this high performance comes at the cost of flexibility. A TPU is not a
          general-purpose processor. You cannot run arbitrary Python code or render a user interface
          on it. It is a specialist, optimized for a specific set of mathematical operations and
          data types, such as <span className="text-brand-rose font-mono font-bold">bfloat16</span>{' '}
          and <span className="text-brand-rose font-mono font-bold">INT8</span>. If a model uses an
          operation the TPU does not support, the developer must modify the model or wait for a
          hardware/software update.
        </p>
        <p>This creates a clear spectrum of choice:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-sky-300">CPU:</strong> Highest flexibility, lowest parallel
            performance.
          </li>
          <li>
            <strong className="text-teal-300">GPU:</strong> Good balance of flexibility and high
            parallel performance.
          </li>
          <li>
            <strong className="text-lime-300">ASIC:</strong> Lowest flexibility, highest parallel
            performance for specific tasks.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          The chart is normalized performance-per-watt on a typical matrix-heavy AI workload. Click
          a bar, or switch to the flexibility slider. CPU ≈ 1×, GPU ≈ 4.5×, TPU ≈ 10×.
        </p>
      </div>
    ),
    Visual: FlexibilityTradeoffVisualizer,
  },
  {
    id: 'ecosystem',
    title: 'Past the TPU: A Growing Ecosystem',
    subtitle: 'Custom silicon beyond Google',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Google proved the ASIC bet for AI. Demand for specialized chips did not stop at the TPU.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-white">AWS Trainium & Inferentia:</strong> Amazon’s training and
            serving ASICs — a path off a GPU-only bill.
          </li>
          <li>
            <strong className="text-white">Cerebras:</strong> wafer-scale engines so a huge model
            can sit on one piece of silicon.
          </li>
          <li>
            <strong className="text-white">SambaNova:</strong> dataflow machines that map the model
            graph onto the chip.
          </li>
          <li>
            <strong className="text-white">Groq:</strong> deterministic “LPU” scheduling for very
            low, predictable latency.
          </li>
        </ul>
        <p>
          The strategic choice is not “which logo is cool.” It is{' '}
          <strong className="text-white">custom silicon vs GPU infrastructure</strong>: watts and
          unit cost on one side, software, talent, and flexibility on the other.
        </p>
      </div>
    ),
    Visual: EcosystemVisualizer,
  },
];

export default function FoundationsOfAIComputePart2() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange to-brand-green" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-brand-orange font-bold tracking-wider text-xs uppercase mb-1 block">
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
                i === currentSlide ? 'w-8 bg-blue-500' : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
          className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-500 shadow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
