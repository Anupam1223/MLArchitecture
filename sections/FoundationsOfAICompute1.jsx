import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  FlowDiagramVisualizer,
  MatrixVisualizer,
  InferenceVisualizer,
  TrainingLoopVisualizer,
  ArchitecturesVisualizer,
  NeuralOpsVisualizer,
  GPUHardwareVisualizer,
  SoftwareStackVisualizer,
} from '../components/FoundationsVisualizers';

export const meta = {
  title: 'Foundations of AI Compute (Part 1)',
  subtitle: 'Workloads, CPUs, GPUs, and the software stack',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'intro',
    title: 'Introduction to AI Workloads',
    subtitle: 'The Foundation of Infrastructure Planning',
    content: (
      <div className="space-y-4 text-gray-300">
        <p>
          Before selecting hardware or cloud instances, you must understand the nature of the work
          it will perform. AI work is divided into two primary, fundamentally different workloads:
        </p>
        <div className="grid grid-cols-1 gap-3 mt-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 border-l-4 border-l-brand-orange">
            <h4 className="text-white font-bold mb-2">1. Training Phase</h4>
            <p className="text-sm leading-relaxed">
              Teaching the model. A heavy-duty, cyclical process of calculating errors and updating
              billions of parameters over massive datasets.
            </p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 border-l-4 border-l-brand-blue">
            <h4 className="text-white font-bold mb-2">2. Inference Phase</h4>
            <p className="text-sm leading-relaxed">
              Putting the model to work. A lightweight, linear process of making a prediction on
              new data using the frozen, trained parameters.
            </p>
          </div>
        </div>
        <p className="mt-4 italic text-sm text-gray-400">
          Grasping this distinction is the first step in designing infrastructure that is both
          performant and cost-effective.
        </p>
      </div>
    ),
    Visual: FlowDiagramVisualizer,
  },
  {
    id: 'training',
    title: 'The Training Phase',
    subtitle: 'Forging the Model via Matrix Operations',
    content: (
      <div className="space-y-4 text-gray-300 pr-1">
        <p>
          Training is an iterative, computationally demanding process. The core of most deep
          learning training is a massive series of matrix operations (forward passes and backward
          passes via backpropagation).
        </p>
        <h4 className="text-white font-semibold mt-4">Key Characteristics:</h4>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>
            <strong className="text-white">High Parallelism:</strong> Involves millions of
            independent calculations (matrix multiplications). A perfect fit for a GPU.
          </li>
          <li>
            <strong className="text-white">Large Data & Model Size:</strong> Requires holding model
            parameters, gradients, and batches of data in memory, demanding tens/hundreds of GBs of
            high-speed VRAM.
          </li>
          <li>
            <strong className="text-white">Iterative & Long-Running:</strong> Can last hours, days,
            or weeks. Stability and endurance are paramount.
          </li>
          <li>
            <strong className="text-white">High Throughput:</strong> The goal is maximizing data
            processed over time to shorten the total time-to-train.
          </li>
        </ul>
      </div>
    ),
    Visual: MatrixVisualizer,
  },
  {
    id: 'inference',
    title: 'The Inference Phase',
    subtitle: 'Putting the Model to Work',
    content: (
      <div className="space-y-4 text-gray-300 pr-1">
        <p>
          Inference uses a fully trained model to make predictions on unseen data. The parameters
          are frozen. It consists of a single forward pass through the network.
        </p>
        <h4 className="text-white font-semibold mt-4">Key Characteristics:</h4>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>
            <strong className="text-brand-blue">Low Latency:</strong> For user-facing apps,
            predictions must return instantly. Latency is often the primary metric.
          </li>
          <li>
            <strong className="text-brand-purple">High Throughput (Concurrency):</strong> Serving
            thousands of simultaneous users requires robust handling of concurrent independent
            requests.
          </li>
          <li>
            <strong className="text-white">Computational Efficiency:</strong> Lighter than training
            (no backpropagation). A powerful CPU or specialized smaller accelerator can often be
            cost-effective.
          </li>
          <li>
            <strong className="text-white">Deployment Flexibility:</strong> Happens everywhere from
            massive datacenters to local edge devices.
          </li>
        </ul>
      </div>
    ),
    Visual: InferenceVisualizer,
  },
  {
    id: 'cpu_orchestration',
    title: 'The Role of CPUs',
    subtitle: 'System Orchestration & Data Preprocessing',
    content: (
      <div className="space-y-3 text-gray-300 pr-1 text-sm leading-relaxed">
        <p>
          While GPUs handle heavy math, the CPU is the{' '}
          <strong className="text-brand-blue">master conductor</strong> of the entire AI system. It
          runs the OS, the Python interpreter, and the high-level logic of your script (PyTorch /
          TensorFlow) — sequential, conditional work GPUs are poor at.
        </p>

        <h4 className="text-white font-semibold text-base pt-1">Data pipeline (before the GPU)</h4>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-white">Data Ingestion:</strong> Read images, CSVs, text corpora
            from disk (OS I/O).
          </li>
          <li>
            <strong className="text-white">Parsing & Transformation:</strong> Decode JPEG, tokenize
            sentences, parse JSON — branchy logic.
          </li>
          <li>
            <strong className="text-white">Data Augmentation:</strong> Random rotate / crop / flip
            so the model generalizes.
          </li>
        </ul>

        <h4 className="text-white font-semibold text-base pt-1">
          System Orchestration and Control
        </h4>
        <p>
          After data is ready, the CPU still owns the training loop. It is responsible for:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Initializing the GPU and allocating memory</li>
          <li>Executing Python that defines the model architecture and training loop</li>
          <li>
            Sending batches and kernels (e.g.{' '}
            <span className="font-mono text-xs text-cyan-300">&quot;perform matmul&quot;</span>)
            over the PCIe bus
          </li>
          <li>Collecting loss / gradients back from the GPU for logging</li>
          <li>Updating weights (optimizer) and saving checkpoints to disk</li>
          <li>
            Deciding <strong className="text-white">End of batch?</strong> — no → next batch; yes →
            next epoch or stop
          </li>
        </ul>

        <p className="italic text-brand-orange bg-brand-orange/10 p-3 rounded-lg border-l-4 border-brand-orange shadow-sm">
          Critical bottleneck: if the CPU cannot feed preprocessed data fast enough, the expensive
          GPU sits idle (memory starvation).
        </p>
        <p className="text-xs text-gray-400">
          The visual shows this collaboration: CPU prepares and directs; GPU does the numerical
          heavy-lift; purple steps are the PCIe handoff (host→device and device→host).
        </p>
      </div>
    ),
    Visual: TrainingLoopVisualizer,
  },
  {
    id: 'gpu_architecture',
    title: 'GPUs Accelerating AI',
    subtitle: 'The Architecture of Throughput',
    content: (
      <div className="space-y-3 text-gray-300 pr-1 text-sm leading-relaxed">
        <p>
          CPUs handle essential sequential work. The{' '}
          <strong className="text-white">heavy lifting of model training</strong> almost always
          runs on GPUs — originally built for 3D graphics, now ideal for deep-learning math because
          of <strong className="text-brand-green">massive parallelism</strong>.
        </p>

        <h4 className="text-white font-semibold text-base">The Architecture of Throughput</h4>
        <p>
          A CPU is designed for <strong className="text-brand-blue">low-latency</strong> execution:
          a small number of powerful cores (typically 4–64) that execute complex instructions and
          make sophisticated decisions on a <em>single thread</em>. Think a small team of{' '}
          <em className="text-brand-blue">master chefs</em> — each can cook an entire multi-course
          meal from start to finish.
        </p>
        <p>
          A GPU is designed for <strong className="text-brand-green">high-throughput</strong>{' '}
          computation: thousands of smaller, simpler cores that are weaker individually but work
          in lockstep. Think a{' '}
          <em className="text-brand-green">kitchen assembly line</em> — thousands of cooks each
          dice onions, simultaneously, on thousands of onions.
        </p>
        <p>
          That lockstep pattern is <strong className="text-white">SIMD</strong> (Single Instruction,
          Multiple Data). Use the visualizer tabs: <em>Silicon Die</em> (where the transistors
          go), <em>SIMD / Analogy</em> (chefs vs line), then <em>Throughput Race</em> (64 tasks).
        </p>
      </div>
    ),
    Visual: ArchitecturesVisualizer,
  },
  {
    id: 'neural_ops',
    title: 'Accelerating Neural Network Ops',
    subtitle: 'Independent Dot Products at Scale',
    content: (
      <div className="space-y-3 text-gray-300 pr-1 text-sm leading-relaxed">
        <p>
          Deep learning is layers of artificial neurons. Almost all of the work is the same few
          ops, repeated on huge tensors — especially <strong className="text-white">matrix
          multiplication</strong>.
        </p>
        <p>
          A layer&apos;s forward pass is:
        </p>
        <p className="font-serif italic text-cyan-300 text-center py-1">
          output = activation(inputs · weights + biases)
        </p>
        <p>
          Each element of the output matrix is a <strong className="text-white">dot product</strong>
          . Those products do <em>not</em> depend on each other.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-brand-green">GPU:</strong> assign thousands of independent
            dots to thousands of cores — they all run at once.
          </li>
          <li>
            <strong className="text-brand-blue">CPU:</strong> walk them sequentially or in small
            SIMD batches on a handful of powerful cores.
          </li>
        </ul>
        <p>
          That inherent parallelism is why a GPU processes a neural-network layer orders of
          magnitude faster than a CPU.
        </p>
        <p className="text-xs text-gray-400">
          Toggle biases / activation in the formula. Click an output cell to see its independent
          dot product.
        </p>
      </div>
    ),
    Visual: NeuralOpsVisualizer,
  },
  {
    id: 'gpu_hardware',
    title: 'Hardware Features',
    subtitle: 'Specialized Silicon for Deep Learning',
    content: (
      <div className="space-y-4 text-gray-300 pr-1">
        <p>
          Not all GPUs are created equal. When selecting accelerators for AI, three hardware
          knobs matter most.
        </p>
        <h4 className="text-white font-semibold mt-4">Key Features:</h4>
        <ul className="list-disc pl-5 space-y-3 text-sm">
          <li>
            <strong className="text-brand-blue">Compute Cores (CUDA):</strong> The fundamental
            ALUs. More cores = more parallel general operations.
          </li>
          <li>
            <strong className="text-brand-green">Tensor Cores:</strong> Specialized units (NVIDIA
            Volta+) for matrix multiply-accumulate (MAC). They fuse a 4×4 multiply-add in a{' '}
            <em>single clock cycle</em>, especially with mixed precision (FP16 / BF16).
          </li>
          <li>
            <strong className="text-brand-purple">Memory Bandwidth (HBM):</strong> Dedicated VRAM
            with an extremely wide interface so thousands of cores stay fed — otherwise you get{' '}
            <em>memory starvation</em> (idle silicon waiting on data).
          </li>
        </ul>
      </div>
    ),
    Visual: GPUHardwareVisualizer,
  },
  {
    id: 'software_layer',
    title: 'The Software Layer',
    subtitle: 'CUDA and cuDNN Abstraction',
    content: (
      <div className="space-y-4 text-gray-300 pr-1">
        <p>
          The raw parallel power of a GPU would be inaccessible without a robust software stack to
          translate high-level math into silicon instructions.
        </p>

        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 mt-4">
          <h4 className="text-brand-green font-bold mb-1">CUDA</h4>
          <p className="text-sm">
            NVIDIA&apos;s parallel computing platform that allows developers to program the GPU
            using a C-like language, managing memory allocation and thread blocks.
          </p>
        </div>

        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 mt-3">
          <h4 className="text-brand-rose font-bold mb-1">cuDNN</h4>
          <p className="text-sm">
            A GPU-accelerated library of primitives for deep neural networks. It provides highly
            tuned, low-level implementations for standard routines like Convolutions, Pooling, and
            Activation functions.
          </p>
        </div>

        <p className="mt-4 text-sm">
          Data scientists rarely write CUDA code. Instead, they write Python via frameworks like
          PyTorch, which relies on cuDNN to execute those operations efficiently on the hardware.
          This seamless abstraction makes GPUs the default choice for serious deep learning.
        </p>
      </div>
    ),
    Visual: SoftwareStackVisualizer,
  },
];

export default function FoundationsOfAICompute() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((c) => Math.min(c + 1, slidesData.length - 1));
  };
  const prevSlide = () => {
    setCurrentSlide((c) => Math.max(c - 1, 0));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setCurrentSlide((c) => Math.min(c + 1, slidesData.length - 1));
      }
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((c) => Math.max(c - 1, 0));
      }
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-brand-purple" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-brand-blue font-bold tracking-wider text-xs uppercase mb-1 block">
              Slide {currentSlide + 1} of {slidesData.length}
            </span>
            <h2 className="text-2xl font-extrabold text-white leading-tight mb-1">
              {slide.title}
            </h2>
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
