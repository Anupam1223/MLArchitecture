import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  WorkloadProfileVisualizer,
  VramBudgetVisualizer,
  FlopsLoadVisualizer,
  DatasetIoVisualizer,
  ScalingGoalsVisualizer,
  WorkloadFlowVisualizer,
  ChassisVisualizer,
  PcieLaneVisualizer,
  SlotSpacingVisualizer,
  CpuConductorVisualizer,
} from '../components/OnPremDesignVisualizers';

export const meta = {
  title: 'Designing On-Premise AI Infrastructure (Part 1)',
  subtitle: 'From workload analysis to a concrete chassis, motherboard, and CPU spec',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'assessing',
    title: 'Assessing Workload Requirements',
    subtitle: 'Deconstruct the job before you open a hardware catalog',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Before you select a single component, you must first create a{' '}
          <strong className="text-white">blueprint of your needs</strong>. This is less about
          browsing catalogs and more about a methodical analysis of the jobs the system will be
          expected to perform.
        </p>
        <p>
          A server optimized for training large language models looks significantly different from
          one designed to serve real-time predictions for a mobile app. Attempting to build a
          one-size-fits-all machine is an invitation to{' '}
          <strong className="text-brand-rose">wasted capital and performance bottlenecks</strong>.
        </p>
        <h4 className="text-white font-semibold">Deconstructing Your Workloads</h4>
        <p>
          Your infrastructure needs are dictated by three main activities, each with a distinct
          resource profile.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Data Preprocessing:</strong> the often-overlooked
            workhorse of the ML pipeline. Cleaning, transformation, tokenization, and augmentation
            are frequently CPU-bound. A pipeline that can’t feed the accelerator fast enough will
            leave your expensive GPUs idle. This points to strong multi-core CPUs, abundant system
            RAM, and fast storage I/O.
          </li>
          <li>
            <strong className="text-white">Model Training:</strong> the most computationally
            demanding phase. An iterative process of feeding data through a model, calculating loss,
            and updating weights via backpropagation — long-running jobs, massive parallel
            computation, and a voracious appetite for data. It wants powerful GPUs with as much VRAM
            as possible, high-speed interconnects between GPUs, and a data pipeline that sustains
            high throughput.
          </li>
          <li>
            <strong className="text-white">Model Inference:</strong> serving a trained model is a
            different challenge. The goal is either low latency (fast response for a single query)
            or high throughput (many queries per second, QPS). A single inference pass is far less
            demanding than a training iteration, but the system must handle concurrent requests
            reliably. That can mean cost-effective GPUs with just enough VRAM, or even powerful CPUs
            for models that are not easily parallelizable.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Switch between the three profiles — the grey bars are what you should refuse to pay for.
        </p>
      </div>
    ),
    Visual: WorkloadProfileVisualizer,
  },
  {
    id: 'vram_spec',
    title: 'Model Size: The VRAM Requirement',
    subtitle: 'The single most important number driving GPU selection',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          To translate general profiles into a concrete shopping list, you need quantitative answers
          about your models and data. The model itself is the single most important factor driving
          your GPU and memory selection.
        </p>
        <p>
          A model’s <strong className="text-white">parameters, gradients, and optimizer states</strong>{' '}
          must all fit into the GPU’s VRAM. For a model using 32-bit precision (FP32), each parameter
          requires 4 bytes. The gradients also require 4 bytes per parameter, and the Adam optimizer
          typically stores two states, requiring an additional 8 bytes per parameter.
        </p>
        <div className="rounded-lg bg-black/40 border border-gray-700 p-3 text-center font-serif italic text-slate-100">
          VRAM<sub>min</sub> ≈ (Parameters × 4) + (Parameters × 4) + (Parameters × 8)
        </div>
        <p>
          For a 7-billion parameter model, this translates to{' '}
          <span className="font-mono text-brand-orange">7B × 16 bytes</span>, or approximately{' '}
          <strong className="text-white">112 GB of VRAM</strong> — not even accounting for data
          batches and intermediate activations.
        </p>
        <p>
          This immediately tells you that a single GPU with 24 GB or 48 GB of VRAM is insufficient,
          pushing you toward <strong className="text-brand-green">multi-GPU solutions</strong>.
        </p>
        <p className="text-xs text-gray-400 italic">
          Drag the parameter slider, then flip precision to 16-bit or swap Adam for SGD and watch
          which GPUs stop throwing OOM.
        </p>
      </div>
    ),
    Visual: VramBudgetVisualizer,
  },
  {
    id: 'flops',
    title: 'Computational Load (FLOPs)',
    subtitle: 'How dense is one iteration of your model?',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The number of floating-point operations required for a forward and backward pass
          determines how fast a given GPU can complete an iteration.
        </p>
        <p>
          You may never calculate this precisely. What matters is understanding whether your model
          is <strong className="text-white">computationally dense</strong> (like a large Transformer)
          or <strong className="text-white">relatively light</strong> (like a ResNet-50). That single
          judgement is what selects the right <em>tier</em> of GPU.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Light models</strong> spend proportionally more time in
            the data pipeline than in the accelerator. Buying a flagship GPU here mostly buys you
            idle silicon.
          </li>
          <li>
            <strong className="text-white">Dense models</strong> are compute-limited. Every step up
            in GPU tier converts almost directly into shorter iterations, and therefore shorter
            time-to-solution.
          </li>
        </ul>
        <p>
          FLOPs and VRAM are independent constraints. A model can fit comfortably in memory and still
          be far too slow, or run fast per-token and still refuse to load.
        </p>
        <p className="text-xs text-gray-400 italic">
          Pick a model and a GPU tier, then run one iteration. Ratios are illustrative, not
          benchmarks.
        </p>
      </div>
    ),
    Visual: FlopsLoadVisualizer,
  },
  {
    id: 'dataset_io',
    title: 'Dataset and I/O Patterns',
    subtitle: 'Your GPUs are useless if they are starved for data',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Your GPUs are useless if they are starved for data. The characteristics of your dataset
          dictate your storage and networking needs.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Storage Capacity:</strong> the most straightforward
            metric. Do you need to store a few terabytes of data, or are you operating on a petabyte
            scale? This determines the number and size of drives you will need.
          </li>
          <li>
            <strong className="text-white">I/O Throughput:</strong> how quickly can you read data
            from disk and get it to the GPU? Measured in gigabytes per second (GB/s). Training on
            high-resolution video requires high sequential read speeds — a strength of NVMe SSDs in a
            RAID configuration.
          </li>
          <li>
            <strong className="text-white">I/O Operations Per Second (IOPS):</strong> if your dataset
            consists of millions of small files (like individual images), the storage system’s
            ability to handle many separate read requests per second becomes the bottleneck, rather
            than raw throughput. High-IOPS NVMe drives are critical in this scenario.
          </li>
        </ul>
        <p>
          The trap is optimizing the wrong metric. A RAID array tuned for enormous sequential reads
          can still crawl through fifty million thumbnails, because the limit was never bandwidth.
        </p>
        <p className="text-xs text-gray-400 italic">
          Switch datasets and watch which meter turns red.
        </p>
      </div>
    ),
    Visual: DatasetIoVisualizer,
  },
  {
    id: 'scaling',
    title: 'Performance and Scaling Goals',
    subtitle: 'T_total = T_compute + T_communication',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>Finally, define what success looks like in terms of time and scale.</p>
        <h4 className="text-white font-semibold">Training Time</h4>
        <p>
          What is an acceptable <strong className="text-white">“time-to-solution”</strong>? If a
          single GPU takes a month to train your flagship model, that is likely unacceptable. If you
          need to reduce that to two days, you can begin to calculate the number of GPUs required,
          factoring in the communication overhead from the formula:
        </p>
        <div className="rounded-lg bg-black/40 border border-gray-700 p-3 text-center font-serif italic text-slate-100">
          T<sub>total</sub> = T<sub>compute</sub> + T<sub>communication</sub>
        </div>
        <p>
          Compute time falls as you add GPUs, but communication time <em>grows</em>. There is a point
          where the next GPU makes the job slower — and the only way to find it is to treat this
          formula as a design input.
        </p>
        <h4 className="text-white font-semibold">Inference Targets</h4>
        <p>
          For inference, are you optimizing for the lowest possible latency for a single user, or the
          highest QPS for a large user base? A low-latency requirement for a large model might demand
          a powerful, dedicated GPU. A high-QPS target for a smaller model might be better served by
          deploying many instances of the model across multiple, less-expensive GPUs or even CPU
          cores.
        </p>
        <p className="text-xs text-gray-400 italic">
          Drag the GPU count — the green bar is the point of diminishing returns.
        </p>
      </div>
    ),
    Visual: ScalingGoalsVisualizer,
  },
  {
    id: 'profile',
    title: 'Creating Your Workload Profile',
    subtitle: 'A decision flow from application to specification sheet',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          By asking these questions, you can build a{' '}
          <strong className="text-white">workload profile</strong> that acts as a blueprint for your
          hardware decisions. This profile moves you from vague requirements to a set of concrete
          technical constraints.
        </p>
        <p>The flow has four decision points:</p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Primary workload</strong> — training pushes you toward
            high FLOPs, large VRAM, and fast interconnects; inference toward low latency or high QPS,
            VRAM merely larger than the model, and CPU-or-GPU options.
          </li>
          <li>
            <strong className="text-white">Model scale</strong> — above roughly 10B parameters you
            need maximum VRAM per GPU, multi-GPU support (NVLink), and the potential for model
            parallelism. Below it, standard VRAM is sufficient and you optimize compute per dollar.
          </li>
          <li>
            <strong className="text-white">Dataset</strong> — size, format, and I/O pattern give you
            capacity (TB/PB), bandwidth (NVMe), and IOPS targets for small files.
          </li>
          <li>
            <strong className="text-white">Performance targets</strong> — fast training means
            multiple high-end GPUs plus high-speed networking; low-latency inference means a fast
            single GPU or CPU with an optimized software stack.
          </li>
        </ul>
        <p>
          The output is a{' '}
          <strong className="text-brand-green">Hardware Specification Sheet</strong> covering CPU,
          GPU, RAM, storage, and network. With that in hand you move from analysis to action.
        </p>
        <p className="text-xs text-gray-400 italic">
          Walk the flow — each answer appends a requirement to your spec.
        </p>
      </div>
    ),
    Visual: WorkloadFlowVisualizer,
  },
  {
    id: 'chassis',
    title: "The Server Chassis: Your System's Foundation",
    subtitle: 'Not a case — a thermal and structural design decision',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Selecting physical hardware starts with defining performance and capacity targets. It isn’t
          about picking the most powerful components off a shelf; it’s about building a{' '}
          <strong className="text-white">balanced and integrated system</strong> where chassis,
          motherboard, and CPU work in concert to support your expensive, power-hungry GPUs.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Form Factor:</strong> most serious multi-GPU servers use a
            rack-mountable chassis, with <strong className="text-brand-orange">4U</strong> being a
            common choice. That height provides ample vertical space for multiple double-width or
            even triple-width GPUs, along with the large heatsinks and fans needed to cool them.
          </li>
          <li>
            <strong className="text-white">GPU Compatibility:</strong> check the maximum number of
            GPUs the chassis can house and its support for full-length cards. High-end GPUs are long
            and heavy, requiring strong mounting brackets to prevent sagging and damage to the
            motherboard’s PCIe slots.
          </li>
          <li>
            <strong className="text-white">Airflow and Cooling:</strong> AI workloads generate an
            immense amount of heat. A good chassis is designed for optimal airflow, with a clear path
            from front-to-back intake and exhaust fans. Look for high-static-pressure fans capable of
            moving air forcefully through dense GPU heatsinks.
          </li>
          <li>
            <strong className="text-white">Power Supply Unit (PSU) Bay:</strong> a single server with
            four high-end GPUs can easily require{' '}
            <strong className="text-brand-rose">3000 watts or more</strong>. Many server chassis
            support redundant PSUs, allowing one to fail without taking the system offline.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Switch form factor, add GPUs, and widen the coolers — watch bays, airflow, and wattage
          react.
        </p>
      </div>
    ),
    Visual: ChassisVisualizer,
  },
  {
    id: 'pcie',
    title: "The Motherboard: The System's Backbone",
    subtitle: 'PCIe architecture is what actually feeds your GPUs',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The motherboard is the central hub that connects every component. For an AI server, the
          most important feature is its ability to provide maximum data bandwidth to each GPU — and
          that is determined almost entirely by its{' '}
          <strong className="text-white">Peripheral Component Interconnect Express (PCIe)</strong>{' '}
          architecture.
        </p>
        <p>
          A modern GPU requires a PCIe x16 slot to operate at full bandwidth. The number of available
          lanes dictates how many GPUs you can run without creating a data bottleneck. Lanes
          originate from two sources: the CPU and the motherboard’s chipset. For maximum performance,
          you want your GPUs connected directly to the{' '}
          <strong className="text-brand-green">CPU’s lanes</strong>.
        </p>
        <h4 className="text-white font-semibold">Consumer vs HEDT / Server</h4>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-brand-rose">Consumer platform</strong> (Core i9 / Ryzen 9): 20–24
            CPU lanes. That covers GPU 1 at x16 and an NVMe SSD at x4. A second GPU has to reach the
            CPU through the chipset over a narrow DMI/UMI link, sharing x8 lanes with everything else
            hanging off the chipset.
          </li>
          <li>
            <strong className="text-brand-green">HEDT / Server platform</strong> (Xeon /
            Threadripper): 64–128 CPU lanes, enough for four GPUs to run at full x16 bandwidth
            simultaneously, directly off the CPU.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Toggle the two platforms — follow the animated lanes and see which GPU ends up behind the
          chipset.
        </p>
      </div>
    ),
    Visual: PcieLaneVisualizer,
  },
  {
    id: 'slots',
    title: 'Slot Configuration, Spacing, and Memory',
    subtitle: 'Four x16 slots does not mean four GPUs at x16',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>When selecting a motherboard, pay attention to these specifications:</p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">PCIe Slot Configuration:</strong> verify that the board
            offers enough physical x16 slots — then check the manual to see how the lanes are
            actually distributed. A board might have four physical x16 slots but only operate in an{' '}
            <span className="font-mono text-brand-rose">x16/x8/x8/x4</span> configuration when all are
            populated. For optimal performance you want a board that can supply{' '}
            <span className="font-mono text-brand-green">x16</span> lanes to every GPU slot you intend
            to use.
          </li>
          <li>
            <strong className="text-white">Slot Spacing:</strong> high-performance GPUs are typically
            “double-width” or “triple-width” due to their large cooling assemblies. Ensure the PCIe
            slots are spaced far enough apart to accommodate all your planned GPUs — a triple-width
            cooler physically covers the slot next door.
          </li>
          <li>
            <strong className="text-white">Memory Support:</strong> verify the maximum supported RAM
            and the number of DIMM slots. While the GPU has its own VRAM, system RAM is critical for
            data staging and preprocessing, especially with very large datasets.
          </li>
        </ul>
        <p>
          These two constraints compound. Even on a board with enough lanes, three triple-width cards
          may simply not have anywhere to sit.
        </p>
        <p className="text-xs text-gray-400 italic">
          Change card width and board type, then add GPUs to see what actually fits.
        </p>
      </div>
    ),
    Visual: SlotSpacingVisualizer,
  },
  {
    id: 'cpu',
    title: 'The CPU: The Conductor of the Orchestra',
    subtitle: 'Lane count matters more than clock speed',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          While GPUs get the spotlight, the CPU remains the brain of the operation. It handles the
          operating system, data loading and preprocessing, and orchestrates the tasks sent to the
          GPUs. For a multi-GPU training server, the most important CPU feature is not its raw clock
          speed, but its <strong className="text-white">PCIe lane count</strong>.
        </p>
        <p>
          Consumer-grade CPUs (Intel Core, AMD Ryzen) typically offer around 20–24 PCIe lanes —
          sufficient for one GPU at full x16 and a fast NVMe SSD at x4. Add a second GPU and you force
          the system to split lanes, often running both GPUs in a slower x8 configuration, effectively{' '}
          <strong className="text-brand-rose">halving their potential motherboard bandwidth</strong>.
        </p>
        <p>
          This is why HEDT and server-grade CPUs — AMD’s{' '}
          <strong className="text-white">Threadripper/EPYC</strong> or Intel’s{' '}
          <strong className="text-white">Xeon</strong> families — are the standard for multi-GPU
          builds. These processors offer 64, 128, or more PCIe lanes directly from the CPU, letting
          you run four, eight, or more GPUs each in a dedicated x16 slot at full bandwidth.
        </p>
        <h4 className="text-white font-semibold">Core count: the secondary factor</h4>
        <p>
          A CPU with a higher core count (16, 32, or 64 cores) can run more parallel data
          preprocessing threads. This is critical for pipelines that feed the GPUs without
          interruption. If your data loading and augmentation code cannot keep up with the GPUs’
          processing speed, your expensive accelerators will sit idle, wasting time and electricity.
        </p>
        <p>
          The goal is balance. A CPU that is{' '}
          <strong className="text-brand-rose">too weak creates a bottleneck</strong>, while a CPU that
          is excessively powerful for the number of GPUs represents{' '}
          <strong className="text-brand-orange">wasted capital expenditure</strong>.
        </p>
        <p className="text-xs text-gray-400 italic">
          Pick a CPU, then tune GPUs and cores until the verdict turns green.
        </p>
      </div>
    ),
    Visual: CpuConductorVisualizer,
  },
];

export default function DesigningOnPremiseAIPart1() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange to-brand-purple" />

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
