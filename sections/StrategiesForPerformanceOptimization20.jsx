import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  LabReadinessVisualizer,
  BaselineScriptVisualizer,
  AutocastVisualizer,
  GradScalerVisualizer,
  AmpScriptVisualizer,
  RunComparisonVisualizer,
  ResultsVisualizer,
  WhyFasterVisualizer,
  ThreeEditsVisualizer,
} from '../components/PerformanceOptimizationPart4Visualizers';

export const meta = {
  title: 'Strategies for Performance Optimization (Part 4)',
  subtitle: 'Hands-on practical: applying Automatic Mixed-Precision training to a real PyTorch script',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'lab-intro',
    title: 'Hands-on Practical: Applying Mixed-Precision Training',
    subtitle: 'Lab goal and prerequisites',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          This hands-on lab guides you through modifying a standard PyTorch training script to use{' '}
          <strong className="text-amber-300">Automatic Mixed-Precision (AMP)</strong> for performance
          optimization.
        </p>
        <p>
          The goal is to measure the resulting improvements in training speed and memory consumption,
          demonstrating firsthand how a few small code changes can yield significant performance gains.
        </p>
        <p className="font-bold text-white pt-1">Lab prerequisites</p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            An NVIDIA GPU with <strong className="text-white">Tensor Core support</strong> (Volta, Turing,
            Ampere architecture or newer). AMP will run on older GPUs, but the speedup from FP16
            computation is most pronounced on hardware with dedicated Tensor Cores.
          </li>
          <li>
            PyTorch installed (<span className="font-mono text-xs text-amber-300">pip install torch torchvision</span>).
          </li>
          <li>
            You can run this on a cloud instance you provisioned earlier, or a local on-premise machine
            that meets the hardware requirements.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Right: pick your GPU architecture and see the speedup you should actually expect.
        </p>
      </div>
    ),
    Visual: LabReadinessVisualizer,
  },
  {
    id: 'baseline',
    title: 'The Baseline: A Standard FP32 Training Script',
    subtitle: 'fp32_baseline.py — our point of comparison',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          First, establish a baseline. This script sets up a simple Convolutional Neural Network and trains
          it on the CIFAR-10 dataset using standard 32-bit floating-point precision (FP32).
        </p>
        <p>
          Save it as <span className="font-mono text-xs text-amber-300">fp32_baseline.py</span> and run it
          with <span className="font-mono text-xs">python fp32_baseline.py</span>.
        </p>
        <p>The script has three parts:</p>
        <ol className="list-decimal pl-5 space-y-1.5 text-xs">
          <li>Data loading and preparation — CIFAR-10, batch size 256, four loader workers.</li>
          <li>A simple CNN — two convolution blocks feeding two linear layers.</li>
          <li>A standard FP32 training loop over five epochs, wrapped in a timer.</li>
        </ol>
        <p>
          Take note of the total training time. You can also monitor GPU memory usage during the run using{' '}
          <span className="font-mono text-xs">nvidia-smi</span> in another terminal window. This will be
          our baseline for comparison.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: the complete script. Tap any region to see why it is written that way.
        </p>
      </div>
    ),
    Visual: BaselineScriptVisualizer,
  },
  {
    id: 'autocast',
    title: 'Applying Automatic Mixed-Precision: autocast',
    subtitle: 'torch.cuda.amp.autocast — the per-operation router',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          To enable mixed-precision training we use PyTorch&apos;s built-in{' '}
          <span className="font-mono text-xs text-amber-300">torch.cuda.amp</span> module. It requires two
          main changes to the training loop — this slide covers the first.
        </p>
        <p>
          <span className="font-mono text-xs text-amber-300">torch.cuda.amp.autocast</span> is a context
          manager that you wrap around your model&apos;s forward pass. It instructs PyTorch to
          automatically select the optimal data type for each operation.
        </p>
        <p>
          Operations that benefit from FP16 and are numerically stable — like convolutions and linear
          layers on Tensor Cores — will run in half precision. Other operations that require higher
          precision, like reductions, will remain in FP32.
        </p>
        <p>
          You do not maintain this list. PyTorch does, per operation, and applies it at the moment each op
          is called.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: send operations through autocast one at a time and see which lane each lands in, and why.
        </p>
      </div>
    ),
    Visual: AutocastVisualizer,
  },
  {
    id: 'gradscaler',
    title: 'Applying Automatic Mixed-Precision: GradScaler',
    subtitle: 'torch.cuda.amp.GradScaler — the safety mechanism',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Training with FP16 can cause a problem called{' '}
          <strong className="text-rose-300">gradient underflow</strong>. Because the FP16 data type has a
          limited range, very small gradient values can become zero, halting the learning process.
        </p>
        <p>
          The <span className="font-mono text-xs text-amber-300">GradScaler</span> solves this by scaling
          the loss value upwards before the backward pass. This makes all the resulting gradients larger,
          preventing them from becoming zero.
        </p>
        <p>
          Before the optimizer updates the weights, the scaler then un-scales the gradients back to their
          correct values — so the update the optimizer applies is mathematically the one it would have
          applied anyway.
        </p>
        <p>
          It also inspects the gradients while unscaling. If any are infinite or NaN, the whole update is
          skipped rather than corrupting the weights, and the scale factor is reduced.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: walk a gradient through all four stages, then inject an overflow to see the skip path.
        </p>
      </div>
    ),
    Visual: GradScalerVisualizer,
  },
  {
    id: 'ampscript',
    title: 'The Modified Script for AMP',
    subtitle: 'amp_optimized.py — three changes, nothing else',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Now modify the script to incorporate AMP. The changes are surprisingly minor, which is a
          testament to the design of the PyTorch API. Save this version as{' '}
          <span className="font-mono text-xs text-amber-300">amp_optimized.py</span>.
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Initialize a GradScaler</strong> once, outside the loop:{' '}
            <span className="font-mono">scaler = torch.cuda.amp.GradScaler()</span>
          </li>
          <li>
            <strong className="text-white">Wrap the forward pass</strong> — and the loss computation — with{' '}
            <span className="font-mono">with torch.cuda.amp.autocast():</span>
          </li>
          <li>
            <strong className="text-white">Use the scaler</strong> for the backward pass and optimizer
            step: <span className="font-mono">scaler.scale(loss).backward()</span>,{' '}
            <span className="font-mono">scaler.step(optimizer)</span>,{' '}
            <span className="font-mono">scaler.update()</span>
          </li>
        </ol>
        <p>
          Everything else is identical. The data pipeline, the model definition, the optimizer and{' '}
          <span className="font-mono text-xs">zero_grad()</span> are all untouched.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: diff mode dims everything that did not change — turn it off for the full listing.
        </p>
      </div>
    ),
    Visual: AmpScriptVisualizer,
  },
  {
    id: 'run',
    title: 'Running Both Scripts',
    subtitle: 'Measure, do not assume',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Run the baseline and then the optimized script, and capture two things from each: the total
          training time printed at the end, and the peak GPU memory from{' '}
          <span className="font-mono text-xs">nvidia-smi</span> in a second terminal.
        </p>
        <p>
          Watch the printed loss values as they scroll past, not only the clock. If mixed precision were
          hurting numerical stability, you would see the AMP run&apos;s loss diverge from the baseline.
          Matching losses are your evidence that the speedup is free.
        </p>
        <p>
          Peak memory has to be captured <em>during</em> the run — once the process exits, the reading is
          gone.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: step through both runs side by side and watch the two terminals fill in.
        </p>
      </div>
    ),
    Visual: RunComparisonVisualizer,
  },
  {
    id: 'results',
    title: 'Analyzing the Results',
    subtitle: 'Faster, and smaller',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Once the script finishes, compare the total training time with the baseline{' '}
          <span className="font-mono text-xs">fp32_baseline.py</span> run. You should observe a noticeable
          reduction in training time. If you monitored GPU memory usage with{' '}
          <span className="font-mono text-xs">nvidia-smi</span>, you will also see a significant drop.
        </p>
        <p>Your results will vary based on your specific GPU, but they might look like this:</p>
        <div className="rounded-lg border border-gray-700 overflow-hidden text-[11px]">
          <div className="grid grid-cols-3 bg-gray-800 font-bold text-gray-300">
            <div className="px-2 py-1.5">Metric</div>
            <div className="px-2 py-1.5">FP32 → AMP</div>
            <div className="px-2 py-1.5">Gain</div>
          </div>
          <div className="grid grid-cols-3 border-t border-gray-700">
            <div className="px-2 py-1.5">Training time</div>
            <div className="px-2 py-1.5 font-mono">75 → 48 s</div>
            <div className="px-2 py-1.5 text-emerald-400">~36% faster</div>
          </div>
          <div className="grid grid-cols-3 border-t border-gray-700">
            <div className="px-2 py-1.5">Peak GPU memory</div>
            <div className="px-2 py-1.5 font-mono">1.8 → 1.1 GB</div>
            <div className="px-2 py-1.5 text-emerald-400">~39% less</div>
          </div>
        </div>
        <p className="text-xs text-gray-400 italic">
          Right: switch metrics and watch the comparison chart redraw.
        </p>
      </div>
    ),
    Visual: ResultsVisualizer,
  },
  {
    id: 'why',
    title: 'Why It Is Faster',
    subtitle: 'The performance gain comes from two sources',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>The improvement is not one effect. It is two, working together.</p>
        <p>
          <strong className="text-white">First, FP16 operations are much faster on GPUs with Tensor
          Cores.</strong> A Tensor Core consumes a whole small matrix block per instruction instead of one
          multiply-add at a time — but it only accepts half-precision input, so FP32 code cannot use these
          units at all.
        </p>
        <p>
          <strong className="text-white">Second, using half-precision data reduces the memory
          footprint</strong> of the model, activations and gradients, which lessens the time spent on
          memory transfers.
        </p>
        <p>
          That second source is why operations with no matrix multiplication at all — like ReLU — also get
          faster. They were never compute-limited; they were limited by how fast bytes could move.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: two tabs — step a matrix multiply through both hardware paths, then compare bytes moved.
        </p>
      </div>
    ),
    Visual: WhyFasterVisualizer,
  },
  {
    id: 'three-edits',
    title: 'The Three Edits, Isolated',
    subtitle: 'Which change buys speed, and which buys correctness',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          This lab demonstrates that AMP is a powerful and easy-to-implement technique. With just three
          lines of code you can often achieve substantial speedups and memory savings, making it one of the
          first optimizations to try when your training process becomes a bottleneck.
        </p>
        <p>But it is worth knowing which line does what, because they do different jobs:</p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            Creating the <span className="font-mono">GradScaler</span> alone changes nothing — it is not
            used yet.
          </li>
          <li>
            <span className="font-mono">autocast</span> delivers the entire speedup and the entire memory
            saving. On its own, though, it leaves gradients exposed to underflow.
          </li>
          <li>
            The three <span className="font-mono">scaler</span> calls add no speed at all. They buy
            correctness — which is what makes the speed usable.
          </li>
        </ul>
        <p>
          Speed from autocast, safety from the scaler. Two tools, two jobs, and you need both.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: add the edits one at a time and watch which metric moves on each.
        </p>
      </div>
    ),
    Visual: ThreeEditsVisualizer,
  },
];

export default function StrategiesForPerformanceOptimizationPart4() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-amber-400 font-bold tracking-wider text-xs uppercase mb-1 block">
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
                i === currentSlide ? 'w-8 bg-amber-500' : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
          className="p-3 rounded-full bg-amber-600 text-white hover:bg-amber-500 shadow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
