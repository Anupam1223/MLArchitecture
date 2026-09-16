import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  RightSizeIntroVisualizer,
  SizingMetricsVisualizer,
  TrainingRightSizeVisualizer,
  InferenceRightSizeVisualizer,
  JobScenarioVisualizer,
  JobCalcVisualizer,
  JobSummaryVisualizer,
} from '../components/CostManagementPart3Visualizers';

export const meta = {
  title: 'Cost Management and Optimization (Part 3)',
  subtitle: 'Right-size training and inference, then project the bill before you launch',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'intro',
    title: 'Right-Sizing Infrastructure for Workloads',
    subtitle: 'From “just-in-case” to “just-enough”',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Selecting the most powerful GPU instance available might feel like the safest bet, but it is
          often the quickest way to burn through your budget. Right-sizing is the disciplined process of
          matching infrastructure resources — CPU, GPU, and memory — to the specific demands of your AI
          workload. The goal is to provision enough capacity to meet performance targets without paying
          for idle resources.
        </p>
        <p>
          This practice moves you from a <strong className="text-rose-300">&quot;just-in-case&quot;</strong>{' '}
          provisioning model to a <strong className="text-emerald-300">&quot;just-enough&quot;</strong> model,
          which is essential for cost control.
        </p>
        <p>
          The challenge is avoiding two common failure modes: underprovisioning and overprovisioning.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-amber-300">Underprovisioning</strong>, or not allocating enough
            resources, leads to poor performance. Training jobs may run too slowly, lengthening
            development cycles, or inference endpoints might fail to meet latency requirements, resulting
            in a poor user experience.
          </li>
          <li>
            <strong className="text-rose-300">Overprovisioning</strong>, the more frequent issue in cost
            management, means you are paying for capacity that your application never uses. An expensive
            GPU that is consistently utilized at only 10% is pure financial waste.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Right: switch just-in-case vs just-enough, then drag GPU utilization to light up each failure mode.
        </p>
      </div>
    ),
    Visual: RightSizeIntroVisualizer,
  },
  {
    id: 'metrics',
    title: 'A Data-Driven Approach to Sizing',
    subtitle: 'Measure the resource profile before you pick the instance',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Effective right-sizing is not based on guesswork; it is based on measurement. Before you can
          choose the correct instance, you must first understand your workload&apos;s resource profile.
          This involves using the monitoring and profiling tools we covered in Chapter 5 to collect data
          on a representative workload.
        </p>
        <p>
          Start by running your training script or inference service on a baseline instance and collect
          these primary metrics:
        </p>
        <ul className="list-disc pl-5 space-y-2.5 text-xs">
          <li>
            <strong className="text-white">GPU Utilization (%):</strong> This shows how busy the GPU&apos;s
            processing cores are. Consistently low utilization (e.g., below 50%) during heavy computation
            phases often points to a bottleneck elsewhere, typically in the data input pipeline or CPU
            processing.
          </li>
          <li>
            <strong className="text-white">GPU Memory Utilization (GB):</strong> This metric tells you how
            much of the GPU&apos;s VRAM is being used to hold your model, data batches, and intermediate
            activations. If you are only using 8 GB of VRAM on a GPU with 24 GB, you are likely paying for
            memory you do not need.
          </li>
          <li>
            <strong className="text-white">CPU Utilization (%):</strong> Keep an eye on the CPU. If CPU
            utilization is pinned at 100% while GPU utilization is low, your data preprocessing or loading
            steps are starving the GPU.
          </li>
          <li>
            <strong className="text-white">System Memory (RAM) Usage (GB):</strong> This is distinct from
            GPU memory. Insufficient RAM can lead to the operating system using slower disk swap space,
            severely degrading performance.
          </li>
        </ul>
        <p className="text-xs">
          Once you have this data, you can begin to make informed decisions. For example, if your
          profiling shows low GPU utilization but maxed-out CPU cores, the immediate solution is not a
          bigger GPU. The correct action is to optimize your data loading pipeline or select an instance
          with a higher CPU-to-GPU ratio. Conversely, if your workload fails due to &quot;out of
          memory&quot; errors on the GPU, you have a clear signal to select an instance with more VRAM.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: switch among four real profiles — starved, VRAM-bound, overprovisioned, right-sized.
        </p>
      </div>
    ),
    Visual: SizingMetricsVisualizer,
  },
  {
    id: 'train',
    title: 'Right-Sizing for Training Workloads',
    subtitle: 'The cheapest hour is not always the cheapest job',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Training jobs are typically long-running, batch-processing tasks where the primary goal is to
          complete the training in an acceptable amount of time for a minimal total cost. The cost is not
          just the hourly rate of the instance but the total cost for the entire job.
        </p>
        <p className="rounded-lg border border-lime-400/40 bg-lime-500/10 px-3 py-2 font-mono text-xs text-lime-200 text-center">
          Total Job Cost = Instance Hourly Rate × Hours to Complete
        </p>
        <p>
          A faster, more expensive GPU might complete the job so quickly that its total cost is lower than
          that of a cheaper, slower GPU that runs for many more hours. To find the sweet spot, you should
          run a small-scale experiment, training for a few epochs on several different instance types and
          extrapolating the total time and cost.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: tap T4 (g4dn.xlarge), V100 (p3.2xlarge), or A100 (p4d.24xlarge). While the A100 has the
          highest hourly rate, it completes the job fastest, resulting in the lowest overall cost.
        </p>
      </div>
    ),
    Visual: TrainingRightSizeVisualizer,
  },
  {
    id: 'infer',
    title: 'Right-Sizing for Inference Workloads',
    subtitle: 'Performance-per-dollar, then auto-scale',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Inference workloads have different characteristics. They are often expected to run continuously,
          serve user requests with low latency, and handle variable traffic. Here the primary metric is{' '}
          <strong className="text-white">performance-per-dollar</strong>, often measured as
          inferences-per-second-per-dollar.
        </p>
        <p>
          For inference, a large GPU is frequently overkill. Techniques like quantization and model
          compilation can make models small and efficient enough to run on CPUs or specialized inference
          accelerators, which offer much lower costs. The right-sizing process:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Load Testing:</strong> send simulated traffic to the deployed
            model on different instance types.
          </li>
          <li>
            <strong className="text-white">Measure Performance:</strong> record the maximum throughput
            (requests per second) each instance can handle before latency exceeds your SLO.
          </li>
          <li>
            <strong className="text-white">Calculate Cost-Effectiveness:</strong> divide throughput by
            hourly instance cost to find the most cost-effective option.
          </li>
          <li>
            <strong className="text-white">Implement Auto-Scaling:</strong> place the chosen instance type
            in an auto-scaling group so the infrastructure adds or removes instances based on real-time
            traffic — you only pay for the capacity you need at any given moment.
          </li>
        </ol>
        <p className="text-xs text-gray-400 italic">
          Right: step through the four stages; compare CPU vs T4 vs A10G on inferences per dollar.
        </p>
      </div>
    ),
    Visual: InferenceRightSizeVisualizer,
  },
  {
    id: 'scenario',
    title: 'Practice: Calculating and Comparing Job Costs',
    subtitle: 'A concrete A10G / ResNet-101 worksheet',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Applying cloud pricing models to a common machine learning scenario is essential for
          understanding cost-effective decisions. A concrete example shows how dramatically the choice of
          pricing model can affect the final cost of a training job.
        </p>
        <p className="font-bold text-white">Scenario: Training a Computer Vision Model</p>
        <p className="text-xs">
          Imagine you are tasked with training a computer vision model for an image classification task.
          Here are the specifics of the job:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-white">Workload:</strong> Training a ResNet-101 model.
          </li>
          <li>
            <strong className="text-white">Required Hardware:</strong> a single NVIDIA A10G GPU.
          </li>
          <li>
            <strong className="text-white">Estimated Duration:</strong> 100 hours to reach the desired
            accuracy.
          </li>
          <li>
            <strong className="text-white">Fault Tolerance:</strong> the script saves a checkpoint to
            object storage every hour, so if the job is interrupted it can resume from the last checkpoint
            with minimal data loss — a Spot candidate.
          </li>
          <li>
            <strong className="text-white">Final Model Size:</strong> approximately 400 MB.
          </li>
        </ul>
        <p className="font-bold text-white">The Worksheet: Calculating Costs</p>
        <p className="text-xs">
          Your goal is to calculate the projected cost of this training job using three different cloud
          pricing models. We will use the following pricing for a virtual machine instance equipped with
          one A10G GPU.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>
            <strong className="text-white">On-Demand Instance</strong> — $1.20 / hour. Billed per second,
            no commitment.
          </li>
          <li>
            <strong className="text-white">1-Year Reserved Instance</strong> — $0.72 / hour (effective
            rate). Requires a 1-year upfront commitment.
          </li>
          <li>
            <strong className="text-white">Spot Instance</strong> — $0.36 / hour (average price). Price
            fluctuates; 70% average discount.
          </li>
          <li>
            <strong className="text-white">Spot Interruption Rate</strong> — 1 interruption per 24 hours
            (an assumption for this workload).
          </li>
          <li>
            <strong className="text-white">Interruption Overhead</strong> — 15 minutes. Time lost to
            restart the job from a checkpoint.
          </li>
          <li>
            <strong className="text-white">Data Egress</strong> — $0.09 / GB. Cost to transfer data out of
            the cloud.
          </li>
        </ul>
        <p className="text-xs">Let&apos;s calculate the cost for each option.</p>
        <p className="text-xs text-gray-400 italic">Right: tap any worksheet row for its role in the later math.</p>
      </div>
    ),
    Visual: JobScenarioVisualizer,
  },
  {
    id: 'calcs',
    title: 'On-Demand, Reserved, and Spot Math',
    subtitle: 'Three formulas for the same 100-hour job',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p className="font-bold text-white">Calculation 1: On-Demand Pricing</p>
        <p className="text-xs">
          This is the most straightforward calculation and serves as our baseline. The cost is simply the
          hourly rate multiplied by the total duration of the job.
        </p>
        <p className="font-mono text-[11px] text-lime-200 rounded-lg bg-gray-900/60 border border-gray-700 px-3 py-2">
          Cost<sub>On-Demand</sub> = Hourly Rate × Duration
          <br />
          Cost<sub>On-Demand</sub> = $1.20/hour × 100 hours = $120.00
        </p>
        <p className="text-xs">
          The On-Demand cost provides maximum flexibility with no commitment, but it is the most expensive
          option.
        </p>

        <p className="font-bold text-white">Calculation 2: Reserved Instance Pricing</p>
        <p className="text-xs">
          Using a Reserved Instance (RI) provides a significant discount in exchange for a long-term
          commitment. For this single job, we calculate the cost based on the effective hourly rate.
        </p>
        <p className="font-mono text-[11px] text-lime-200 rounded-lg bg-gray-900/60 border border-gray-700 px-3 py-2">
          Cost<sub>Reserved</sub> = Effective Hourly Rate × Duration
          <br />
          Cost<sub>Reserved</sub> = $0.72/hour × 100 hours = $72.00
        </p>
        <p className="text-xs">
          This is a 40% saving compared to the On-Demand price. However, remember that the organization is
          committed to paying for this instance for an entire year. This option is only truly
          cost-effective if you have a continuous stream of workloads to keep the instance utilized for
          the majority of its commitment term.
        </p>

        <p className="font-bold text-white">Calculation 3: Spot Instance Pricing</p>
        <p className="text-xs">
          Spot Instances offer the deepest discounts but come with the risk of interruption. Our
          calculation must account for this risk by adding the cost of the time lost due to interruptions.
        </p>
        <p className="text-xs">
          First, let&apos;s determine the number of expected interruptions over the 100-hour job run.
        </p>
        <p className="font-mono text-[11px] text-lime-200 rounded-lg bg-gray-900/60 border border-gray-700 px-3 py-2">
          Interruptions = Total Duration / Hours per Interruption
          <br />
          = 100 hours / 24 hours/interruption ≈ 4.17
        </p>
        <p className="text-xs">We&apos;ll round this up to 5 interruptions to be conservative.</p>
        <p className="text-xs">
          Next, calculate the total overhead time. This is the time spent restarting the job after each
          interruption.
        </p>
        <p className="font-mono text-[11px] text-lime-200 rounded-lg bg-gray-900/60 border border-gray-700 px-3 py-2">
          Total Overhead = Number of Interruptions × Interruption Overhead
          <br />
          = 5 interruptions × 15 minutes/interruption = 75 minutes = 1.25 hours
        </p>
        <p className="text-xs">
          Now we calculate the total billable time, which includes the original duration plus the
          overhead.
        </p>
        <p className="font-mono text-[11px] text-lime-200 rounded-lg bg-gray-900/60 border border-gray-700 px-3 py-2">
          Total Billable Time = Original Duration + Total Overhead
          <br />
          = 100 hours + 1.25 hours = 101.25 hours
        </p>
        <p className="text-xs">Finally, we find the total compute cost for using a Spot Instance.</p>
        <p className="font-mono text-[11px] text-lime-200 rounded-lg bg-gray-900/60 border border-gray-700 px-3 py-2">
          Cost<sub>Spot Compute</sub> = Total Billable Time × Average Spot Price
          <br />
          = 101.25 hours × $0.36/hour = $36.45
        </p>
        <p className="text-xs text-gray-400 italic">Right: switch tabs and tap each Spot step.</p>
      </div>
    ),
    Visual: JobCalcVisualizer,
  },
  {
    id: 'summary',
    title: "Don't Forget Data Transfer — Then Compare",
    subtitle: 'Egress is tiny here; the pricing-model gap is not',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          While small for this job, data egress fees are an important part of total cloud cost.
          Let&apos;s calculate the cost to download the final 400 MB model artifact.
        </p>
        <p className="text-xs">First, convert megabytes (MB) to gigabytes (GB).</p>
        <p className="font-mono text-[11px] text-lime-200 rounded-lg bg-gray-900/60 border border-gray-700 px-3 py-2">
          400 MB = 0.4 GB
        </p>
        <p className="text-xs">Now, calculate the egress cost.</p>
        <p className="font-mono text-[11px] text-lime-200 rounded-lg bg-gray-900/60 border border-gray-700 px-3 py-2">
          Cost<sub>Egress</sub> = 0.4 GB × $0.09/GB = $0.036
        </p>
        <p className="text-xs">
          This cost is negligible for a single model, but for continuous deployment systems that move
          terabytes of data, these fees can become significant. For our comparison, we&apos;ll add this to
          each total.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs font-mono">
          <li>Final On-Demand Cost: 120.00 + 0.04 = $120.04</li>
          <li>Final Reserved Cost: 72.00 + 0.04 = $72.04</li>
          <li>Final Spot Cost: 36.45 + 0.04 = $36.49</li>
        </ul>
        <p className="font-bold text-white">Summary and Comparison</p>
        <p className="text-xs">Let&apos;s summarize our findings in a final table.</p>
        <p className="text-xs">
          This analysis makes the financial trade-offs clear. For workloads that are fault-tolerant and
          not time-critical, Spot Instances offer substantial savings. For predictable, long-running
          needs, Reserved Instances provide a good balance of cost and reliability. On-Demand instances
          serve as a valuable, albeit expensive, option for short-term, urgent tasks or for initial
          development and benchmarking before committing to a long-term plan.
        </p>
        <p>
          As an infrastructure engineer, running these kinds of cost projections before launching major
          workloads is an indispensable practice.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: toggle egress on the comparison chart and read the savings column.
        </p>
      </div>
    ),
    Visual: JobSummaryVisualizer,
  },
];

export default function CostManagementAndOptimizationPart3() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-400 via-emerald-400 to-sky-400" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-lime-400 font-bold tracking-wider text-xs uppercase mb-1 block">
              Slide {currentSlide + 1} of {slidesData.length}
            </span>
            <h2 className="text-2xl font-extrabold text-white leading-tight mb-1">{slide.title}</h2>
            <h3 className="text-sm text-gray-400 font-medium">{slide.subtitle}</h3>
          </div>

          <div className="flex-1 overflow-y-scroll custom-scroll relative min-h-0 pr-1">{slide.content}</div>
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
                i === currentSlide ? 'w-8 bg-lime-500' : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
          className="p-3 rounded-full bg-lime-600 text-white hover:bg-lime-500 shadow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
