import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  PrecisionFormatsVisualizer,
  TensorCoreVisualizer,
  UnderflowVisualizer,
  LossScalingVisualizer,
  AmpFlowVisualizer,
  PytorchAmpVisualizer,
  TfMixedPrecisionVisualizer,
  QuantizationWhyVisualizer,
  AffineMappingVisualizer,
  QuantMethodsVisualizer,
  QatMechanicsVisualizer,
  QuantDecisionVisualizer,
  QuantPracticeVisualizer,
} from '../components/PerformanceOptimizationPart2Visualizers';

export const meta = {
  title: 'Strategies for Performance Optimization (Part 2)',
  subtitle: 'Mixed-precision training and model quantization for efficient inference',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'precision',
    title: 'Using Mixed-Precision Training',
    subtitle: 'FP32 is the safe default — and usually more than you need',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Mixed-precision training is a powerful optimization focused on the efficiency of computation on
          a single GPU. Most deep learning models are trained using standard 32-bit floating-point{' '}
          <span className="font-mono text-xs">FP32</span>, also called single precision. It offers a wide
          dynamic range and high precision, making it a safe default.
        </p>
        <p>
          For many deep learning operations, however, that level of precision is not strictly necessary.
          Mixed precision combines 16-bit floating point (<span className="font-mono text-xs">FP16</span>
          , half precision) with traditional <span className="font-mono text-xs">FP32</span>. The
          motivation is two-fold:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Faster computation:</strong> NVIDIA GPUs since the Volta
            architecture include specialized hardware called{' '}
            <strong className="text-violet-300">Tensor Cores</strong>, designed to perform matrix
            operations on FP16 inputs at a much higher rate than standard FP32 computation.
          </li>
          <li>
            <strong className="text-white">Reduced memory footprint:</strong> an FP16 value occupies half
            the memory of an FP32 value. That immediately halves the memory needed for weights,
            activations and gradients — letting you train larger models, use larger batches, or relieve
            memory pressure.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Right: flip between the two formats and watch bits, memory, and throughput move together.
        </p>
      </div>
    ),
    Visual: PrecisionFormatsVisualizer,
  },
  {
    id: 'tensorcore',
    title: 'What Makes a Tensor Core Fast',
    subtitle: '16 clocks versus 1, on the same chip',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A standard GPU core performs one multiply-accumulate per clock. A Tensor Core is different
          silicon: it consumes a small matrix tile of FP16 inputs and produces the entire matrix
          multiply-accumulate result in a single operation.
        </p>
        <p>
          That is why the speedup is a hardware property, not a software one. On an A100 the gap between
          standard FP32 throughput and FP16 Tensor Core throughput is roughly{' '}
          <strong className="text-white">19.5 versus 312 TFLOPS</strong>.
        </p>
        <p>
          It also explains the constraint: Tensor Cores only accept low-precision inputs. To use them at
          all, your matrix multiplies and convolutions must be in FP16. Everything that follows —
          numerical stability, loss scaling, master weights — exists to make that safe.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: tick the clock and watch one unit finish while the other grinds.
        </p>
      </div>
    ),
    Visual: TensorCoreVisualizer,
  },
  {
    id: 'underflow',
    title: 'The Challenge of Numerical Stability',
    subtitle: 'Why you cannot simply switch the model to FP16',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Simply switching an entire model to <span className="font-mono text-xs">FP16</span> leads to
          problems. The FP16 format has a much smaller representable range compared to FP32.
        </p>
        <p>
          During backpropagation, gradient values can become very small. In FP16 these small values may
          round down to zero — a phenomenon known as{' '}
          <strong className="text-rose-300">underflow</strong>. When gradients become zero, weight updates
          for those parts of the model stop, and the network ceases to learn effectively.
        </p>
        <p>
          There is no error and no crash. The model simply trains to a worse result, which makes this one
          of the harder failure modes to notice.
        </p>
        <p>
          The solution is not to abandon FP16, but to use it selectively alongside a technique called{' '}
          <strong className="text-violet-300">dynamic loss scaling</strong>. That combination forms the
          core of modern mixed-precision training.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: drag a gradient magnitude and watch FP16 lose it.
        </p>
      </div>
    ),
    Visual: UnderflowVisualizer,
  },
  {
    id: 'lossscaling',
    title: 'Dynamic Loss Scaling',
    subtitle: 'Shift the gradients into range, then shift them back',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          To prevent gradient underflow, the calculated loss is multiplied by a large scaling factor{' '}
          <em>before</em> the backward pass begins. By the chain rule, this scales up all resulting
          gradients, shifting their values into a range FP16 can safely represent.
        </p>
        <p>
          After the gradients are calculated, they are scaled back down <em>before</em> updating the FP32
          master weights. The mathematics of the update is therefore unchanged — only the numbers
          travelling through FP16 are temporarily made bigger.
        </p>
        <p>
          The factor is <strong className="text-white">dynamically adjusted</strong> during training. If
          gradients overflow — becoming <span className="font-mono text-xs text-rose-300">inf</span> or{' '}
          <span className="font-mono text-xs text-rose-300">NaN</span> — the factor is reduced and the
          step is skipped. If training is stable for a period, the factor is increased to make fuller use
          of the FP16 range.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: try each scale factor on five real gradient magnitudes.
        </p>
      </div>
    ),
    Visual: LossScalingVisualizer,
  },
  {
    id: 'ampflow',
    title: 'How Mixed-Precision Training Works',
    subtitle: 'Master weights · FP16 compute · dynamic loss scaling',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Instead of manually deciding which operations run in which precision, modern frameworks automate
          a three-part process:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Maintain master weights in FP32:</strong> a master copy of the
            weights is always stored in FP32, so small gradient updates accumulate accurately over
            thousands of steps without losing precision.
          </li>
          <li>
            <strong className="text-white">Perform computations in FP16:</strong> each step, the FP32
            master weights are cast to FP16 and the forward and backward passes run on those. This is
            where the Tensor Core speedup happens.
          </li>
          <li>
            <strong className="text-white">Use dynamic loss scaling:</strong> scale the loss up before
            backward, scale the gradients back down before updating the master weights, and adjust the
            factor as training proceeds.
          </li>
        </ol>
        <p>
          The result is speed where precision does not matter and precision where it does — with the loop
          closing back on the FP32 copy every single step.
        </p>
        <p className="text-xs text-gray-400 italic">Right: step through all eight stages of one step.</p>
      </div>
    ),
    Visual: AmpFlowVisualizer,
  },
  {
    id: 'pytorchamp',
    title: 'Implementation in Practice: PyTorch',
    subtitle: 'torch.cuda.amp — autocast and GradScaler',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          You rarely need to implement this logic from scratch. PyTorch provides automatic mixed precision
          through <span className="font-mono text-xs text-violet-300">torch.cuda.amp</span>, and it takes
          just a few extra lines in a standard training loop.
        </p>
        <p>You need two components:</p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <span className="font-mono text-violet-300">torch.cuda.amp.autocast</span> — a context manager
            that automatically selects the appropriate precision (FP16 or FP32) for each operation within
            its scope.
          </li>
          <li>
            <span className="font-mono text-violet-300">torch.cuda.amp.GradScaler</span> — manages the
            dynamic loss scaling process to prevent gradient underflow.
          </li>
        </ul>
        <p>
          Note what <span className="font-mono text-xs">scaler.step(optimizer)</span> does: it first
          unscales the gradients, and only calls{' '}
          <span className="font-mono text-xs">optimizer.step()</span> if no infs or NaNs were found.
          Otherwise the step is skipped entirely.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: compare the standard loop with the AMP loop, block by block.
        </p>
      </div>
    ),
    Visual: PytorchAmpVisualizer,
  },
  {
    id: 'tfamp',
    title: 'Implementation in Practice: TensorFlow',
    subtitle: "set_global_policy('mixed_float16') and Keras does the rest",
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          TensorFlow&apos;s Keras API makes enabling mixed precision even simpler. You set a global
          policy, and Keras automatically handles the rest — including loss scaling inside{' '}
          <span className="font-mono text-xs">model.fit()</span>.
        </p>
        <p className="font-mono text-xs text-violet-300">
          tf.keras.mixed_precision.set_global_policy(&apos;mixed_float16&apos;)
        </p>
        <p>
          With this policy set, Keras wraps your optimizer to handle loss scaling and ensures that layers
          like <span className="font-mono text-xs">Dense</span> and{' '}
          <span className="font-mono text-xs">Conv2D</span> use FP16 computation while maintaining FP32
          weights. The change is transparent and requires minimal code modification.
        </p>
        <p>
          By adopting mixed-precision training you can often achieve speedups of{' '}
          <strong className="text-white">1.5× to 3×</strong> on supported hardware with just a few lines
          of code — one of the most effective optimizations for GPU-bound workloads.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: the full script, plus what the policy does to a single layer.
        </p>
      </div>
    ),
    Visual: TfMixedPrecisionVisualizer,
  },
  {
    id: 'whyquant',
    title: 'Model Quantization for Efficient Inference',
    subtitle: 'The cost of shipping an FP32 model to production',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Optimizing models for their ultimate purpose — inference — is a primary concern in AI
          infrastructure. Deploying a large FP32 model directly into production is inefficient: it
          consumes significant memory, raises inference latency, and increases operational costs,
          especially when serving millions of requests. On edge devices like smartphones or embedded
          systems, large FP32 models are often not viable at all.
        </p>
        <p>
          <strong className="text-violet-300">Model quantization</strong> converts a model&apos;s weights,
          and sometimes its activations, from a high-precision representation like FP32 to a
          lower-precision one — most commonly 8-bit integer,{' '}
          <span className="font-mono text-xs">INT8</span>.
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Reduced model size:</strong> INT8 uses 8 bits where FP32 uses
            32, giving an immediate up-to-4× reduction. Faster downloads, less disk, smaller runtime
            footprint.
          </li>
          <li>
            <strong className="text-white">Faster computation:</strong> modern CPUs and GPUs are highly
            optimized for integer arithmetic, and specialized accelerators like Tensor Cores and TPUs
            execute low-precision matrix multiplications at extremely high speeds.
          </li>
        </ol>
        <p className="text-xs text-gray-400 italic">
          Right: pick a deployment target and switch precision to see what fits.
        </p>
      </div>
    ),
    Visual: QuantizationWhyVisualizer,
  },
  {
    id: 'affine',
    title: 'How Quantization Works',
    subtitle: 'Scale, zero-point, and a lossy affine mapping',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Quantization maps a range of floating-point numbers onto a much smaller range of integers. The
          most common approach is an <strong className="text-white">affine mapping</strong> using a scale
          factor and a zero-point:
        </p>
        <p className="font-mono text-xs text-violet-300 bg-black/40 rounded px-2 py-2">
          real_value ≈ (quantized_value − zero_point) × scale
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Scale:</strong> a positive float defining the step size of the
            quantization — how much real value one integer tick is worth.
          </li>
          <li>
            <strong className="text-white">Zero-point:</strong> the integer that corresponds exactly to
            the real value 0.0. This is what makes ranges that are not symmetric around zero
            representable. For INT8, integers run from −128 to 127.
          </li>
        </ul>
        <p>
          The process finds the minimum and maximum values in the float tensor and maps them onto the
          integer range.
        </p>
        <p>
          This conversion is inherently lossy, like compressing a photo to a JPEG. The goal is to perform
          the mapping intelligently so the drop in accuracy is minimized and stays within acceptable
          limits.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: three views — squeeze the range onto 256 rungs, zoom in and watch one value snap, then
          see what low precision does to a whole signal.
        </p>
      </div>
    ),
    Visual: AffineMappingVisualizer,
  },
  {
    id: 'methods',
    title: 'PTQ and QAT',
    subtitle: 'Dynamic · static · quantization-aware training',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          <strong className="text-white">Post-Training Quantization (PTQ)</strong> is the most
          straightforward approach: take a fully trained FP32 model and convert it without any retraining.
          It is fast and needs no access to the original training pipeline or dataset. There are two
          variants:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Dynamic quantization:</strong> weights are quantized offline,
            activations on the fly during inference. Easiest to apply, and good where activation
            distributions vary a lot, such as LSTMs and Transformers. The runtime overhead limits the
            gain.
          </li>
          <li>
            <strong className="text-white">Static quantization:</strong> both weights and activations are
            quantized offline. This requires a <strong>calibration step</strong> — a small representative
            sample is pushed through the model to collect activation statistics, which fix the optimal
            scale and zero-point per tensor. Typically yields greater performance than dynamic, because
            the work is moved out of the inference path.
          </li>
        </ul>
        <p>
          <strong className="text-white">Quantization-Aware Training (QAT)</strong> is the answer when PTQ
          costs too much accuracy. It simulates low-precision inference during training by inserting
          &quot;fake&quot; quantize/dequantize operations into the graph, so the model adapts its weights
          to be robust to the precision loss. Forward and backward still use floating point, but the model
          is optimized for integer-only deployment. It almost always recovers what PTQ lost, and can even
          beat the FP32 baseline.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: compare where the quantization work happens in each method.
        </p>
      </div>
    ),
    Visual: QuantMethodsVisualizer,
  },
  {
    id: 'qatmech',
    title: 'How QAT Actually Trains',
    subtitle: 'One model, FP32 weights, INT8 simulated in the forward pass',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The common confusion about QAT is whether you train two models — an FP32 one and an INT8 one —
          side by side. You do not.{' '}
          <strong className="text-white">There is a single model and its weights stay FP32 the whole
          time.</strong>{' '}
          INT8 is only simulated.
        </p>
        <p>One training step looks like this:</p>
        <ol className="list-decimal pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-white">Forward:</strong> each weight passes through a fake-quant node
            that rounds it to the nearest INT8 rung and converts it straight back to float. The layer
            computes with the degraded value. Activations get the same treatment.
          </li>
          <li>
            <strong className="text-white">Loss:</strong> computed on those degraded values, so it already
            contains the quantization error.
          </li>
          <li>
            <strong className="text-white">Backward:</strong> <span className="font-mono">round()</span>{' '}
            has a derivative of zero everywhere, which would kill every gradient. QAT uses a{' '}
            <strong className="text-violet-300">straight-through estimator</strong> — the fake-quant node
            passes the gradient through unchanged, clipped outside the range.
          </li>
          <li>
            <strong className="text-white">Update:</strong> the optimizer updates the FP32 master weight,
            never an integer.
          </li>
        </ol>
        <p>
          Over a few epochs the weights drift toward values that survive rounding. Only at the end does{' '}
          <span className="font-mono text-xs">convert()</span> emit the real integer model.
        </p>
        <p>
          Note the symmetry with mixed-precision training: FP32 master weights, low precision simulated in
          the forward pass, full-precision updates. Same structure, different goal.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: step through one QAT step, then see why the adapted weights round better.
        </p>
      </div>
    ),
    Visual: QatMechanicsVisualizer,
  },
  {
    id: 'decision',
    title: 'Choosing a Quantization Strategy',
    subtitle: 'Try the cheap method first, escalate only on evidence',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>The workflow is deliberately simple:</p>
        <ol className="list-decimal pl-5 space-y-1.5 text-xs">
          <li>Start with a trained FP32 model.</li>
          <li>Apply Post-Training Quantization — it is fast and requires no retraining.</li>
          <li>Measure accuracy against your tolerance.</li>
          <li>Acceptable → deploy the INT8 model. Not acceptable → perform QAT, then deploy.</li>
        </ol>
        <p>
          Which branch you take depends heavily on the architecture. Large, over-parameterized vision
          models usually survive PTQ with a fraction of a point lost. Compact architectures with
          depthwise-separable convolutions, and attention-heavy language models, are far more sensitive —
          these are the ones that need QAT.
        </p>
        <p>
          QAT requires more effort because it involves a training loop, but it almost always recovers the
          accuracy lost by PTQ.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: pick a model and walk the workflow with real accuracy numbers.
        </p>
      </div>
    ),
    Visual: QuantDecisionVisualizer,
  },
  {
    id: 'practice',
    title: 'Quantization in Practice',
    subtitle: 'Static PTQ in PyTorch: fuse → prepare → calibrate → convert',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Most modern frameworks provide built-in tooling. PyTorch offers a comprehensive API for both PTQ
          and QAT. Static PTQ comes down to four steps:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-white">Fuse modules</strong> like Conv-BN-ReLU, combining layers that
            are usually executed together, for better accuracy and performance.
          </li>
          <li>
            <strong className="text-white">Prepare</strong> the model — this inserts observer modules that
            collect activation statistics.
          </li>
          <li>
            <strong className="text-white">Calibrate</strong> by running representative data through the
            prepared model.
          </li>
          <li>
            <strong className="text-white">Convert</strong> to the final quantized form.
          </li>
        </ol>
        <p>
          The resulting model contains INT8 weights and performs computation using integer arithmetic. For
          a typical vision model that means nearly 4× smaller and over 3× faster inference.
        </p>
        <p>
          Quantization makes it possible to run complex models in resource-constrained environments and to
          serve models at lower cost in the cloud. Always validate the quantized model on a held-out test
          set to confirm it still meets the needs of your application.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: the full script with each step explained, plus the before/after numbers.
        </p>
      </div>
    ),
    Visual: QuantPracticeVisualizer,
  },
];

export default function StrategiesForPerformanceOptimizationPart2() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-violet-400 font-bold tracking-wider text-xs uppercase mb-1 block">
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
                i === currentSlide ? 'w-8 bg-violet-500' : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
          className="p-3 rounded-full bg-violet-600 text-white hover:bg-violet-500 shadow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
