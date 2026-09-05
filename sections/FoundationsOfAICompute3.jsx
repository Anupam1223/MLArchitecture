import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  RamVramVisualizer,
  VramStackVisualizer,
  SevenBMathVisualizer,
  InferenceMemoryVisualizer,
  StorageAttributesVisualizer,
  LocalStorageVisualizer,
  StorageMapVisualizer,
  SharedStorageVisualizer,
  BandwidthLatencyVisualizer,
  AllToAllVisualizer,
  RdmaVisualizer,
} from '../components/FoundationsPart3Visualizers';

export const meta = {
  title: 'Foundations of AI Compute (Part 3)',
  subtitle: 'VRAM math, storage hierarchy, and the network that keeps GPUs busy',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'memory_intro',
    title: 'Memory and its Importance for Large Models',
    subtitle: 'FLOPS matter — VRAM decides if the job even starts',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Processing power gets the headlines. In practice,{' '}
          <strong className="text-white">available memory</strong> is often the first wall you hit
          when training or serving large models.
        </p>
        <h4 className="text-white font-semibold">System RAM (Random Access Memory)</h4>
        <p>
          This is the main memory of the server, directly accessible by the CPU. It’s used for
          holding the operating system, data preprocessing scripts, and entire datasets that are
          waiting to be fed to the accelerator.
        </p>
        <h4 className="text-white font-semibold">GPU VRAM (Video RAM)</h4>
        <p>
          This is high-speed memory located directly on the GPU card. It is significantly faster
          than system RAM and is where all the action happens for accelerated deep learning. The GPU
          can only operate on data that is present in its own VRAM.
        </p>
        <p>
          For GPU jobs, <strong className="text-brand-green">VRAM is almost always the tighter
          constraint</strong>. If the working set does not fit in one GPU (or pooled multi-GPU
          VRAM), the run fails with an out-of-memory error before a single useful step finishes.
        </p>
      </div>
    ),
    Visual: RamVramVisualizer,
  },
  {
    id: 'vram_stack',
    title: 'What Occupies VRAM During Training?',
    subtitle: 'The weight file is only the first slice',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Several tensors must live in VRAM <strong className="text-white">at the same time</strong>.
          The total footprint is much larger than the model’s parameter file.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-sky-300">Model parameters:</strong> weights and biases. Size =
            number of parameters × precision (FP32 = 4 bytes each).
          </li>
          <li>
            <strong className="text-rose-300">Gradients:</strong> one gradient per parameter during
            backprop — typically the same size as the weights.
          </li>
          <li>
            <strong className="text-emerald-300">Optimizer states:</strong> Adam keeps momentum and
            variance per parameter. That{' '}
            <strong className="text-white">doubles the parameter memory again</strong>.
          </li>
          <li>
            <strong className="text-orange-300">Activations:</strong> every layer’s forward output,
            cached for the backward pass. Grows with{' '}
            <span className="text-brand-rose font-mono">batch_size</span> and sequence length.
          </li>
          <li>
            <strong className="text-violet-300">Input batch:</strong> the tokens or images in this
            step.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">Click a band on the stack. Adam is the tall green one on purpose.</p>
      </div>
    ),
    Visual: VramStackVisualizer,
  },
  {
    id: 'seven_b_math',
    title: 'A Practical Memory Calculation',
    subtitle: '7B × FP32 × Adam = 112 GB before activations',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Train a <strong className="text-white">7-billion parameter</strong> language model with{' '}
          <strong className="text-white">Adam</strong> in <strong className="text-white">FP32</strong>{' '}
          (4 bytes per number):
        </p>
        <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-3 font-mono text-xs text-cyan-200 space-y-1.5">
          <div>params: 7B × 4 B = 28 GB</div>
          <div>grads: 7B × 4 B = 28 GB</div>
          <div>Adam: 2 × 7B × 4 B = 56 GB</div>
          <div className="text-white font-bold">28 + 28 + 56 = 112 GB</div>
        </div>
        <p>
          That 112 GB <strong className="text-white">does not include</strong> activations or CUDA
          kernel overhead. It already exceeds an{' '}
          <strong className="text-brand-rose">NVIDIA A100 80 GB</strong>.
        </p>
        <p>
          That gap is why you see <strong className="text-white">OOM</strong> — the allocator asked
          for more VRAM than exists. Usual culprits: the model is too big, or{' '}
          <span className="text-brand-rose font-mono">batch_size</span> (and sequence length) blew
          up the activation cache.
        </p>
        <p className="text-xs text-gray-400 italic">
          Step the formula. Try 1B / 13B / 70B and flip FP32 → FP16.
        </p>
      </div>
    ),
    Visual: SevenBMathVisualizer,
  },
  {
    id: 'inference_mem',
    title: 'Memory for Inference',
    subtitle: 'No gradients, no Adam — just weights and this request',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Once the model is deployed for predictions, memory drops hard. You no longer store
          gradients or optimizer states. What remains is the{' '}
          <strong className="text-white">parameters</strong> plus{' '}
          <strong className="text-white">activations for the current input</strong>.
        </p>
        <p>
          For the same 7B model the base is still{' '}
          <span className="font-mono text-cyan-300">7B × 4 bytes = 28 GB</span> of weights, plus a
          slim activation buffer for one (or a few) requests — not a training batch.
        </p>
        <p>
          That is why inference often runs on a GPU that could never train the model from scratch.
        </p>
        <p>
          This breakdown is the prerequisite for later tricks: mixed precision (16-bit), smaller
          optimizers, activation checkpointing. Model size and training config set the floor.
        </p>
      </div>
    ),
    Visual: InferenceMemoryVisualizer,
  },
  {
    id: 'storage_intro',
    title: 'Storage Solutions for AI Datasets',
    subtitle: 'A starved GPU is a very expensive space heater',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Fast GPUs still need data. If storage cannot keep up you hit an{' '}
          <strong className="text-white">I/O bottleneck</strong> — the accelerator sits idle.
          Datasets range from gigabytes to petabytes.
        </p>
        <p>An ideal store is a mix of three attributes:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Throughput:</strong> transfer rate (MB/s or GB/s). Needed
            to load large batches (images, video frames) into memory quickly.
          </li>
          <li>
            <strong className="text-white">Latency:</strong> time to the first byte (μs or ms).
            Critical when you have millions of small files — seek time adds up.
          </li>
          <li>
            <strong className="text-white">Capacity:</strong> how much you can hold, set by dataset
            size.
          </li>
        </ul>
        <p>
          Solutions fall into <strong className="text-white">local</strong>,{' '}
          <strong className="text-white">network-attached</strong>, and{' '}
          <strong className="text-white">object</strong> storage — each a different mix of those
          three.
        </p>
      </div>
    ),
    Visual: StorageAttributesVisualizer,
  },
  {
    id: 'local_storage',
    title: 'Local Storage: Speed at Your Fingertips',
    subtitle: 'HDD → SATA SSD → NVMe on PCIe',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Local storage is attached to the machine. Physical proximity is what gives you low latency
          and high throughput.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">HDDs:</strong> spinning disks. Lowest cost, high
            capacity, slow because of mechanics. Use for cold archive, not the training hot path.
          </li>
          <li>
            <strong className="text-white">SATA SSDs:</strong> flash, no moving parts. Lower
            latency and higher throughput than HDDs. Fine for small-to-medium datasets.
          </li>
          <li>
            <strong className="text-white">NVMe SSDs:</strong> the NVMe protocol talks to the CPU
            over the high-speed <span className="font-mono text-cyan-300">PCIe</span> bus.
            Sequential reads over 7,000 MB/s — the usual way to keep GPUs fed on one box.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Latency bars are exaggerated so the order-of-magnitude gap is visible.
        </p>
      </div>
    ),
    Visual: LocalStorageVisualizer,
  },
  {
    id: 'hierarchy',
    title: 'The Storage Hierarchy',
    subtitle: 'Speed near the core, scale and sharing farther out',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Performance generally falls as data moves away from compute — you trade speed for capacity
          and shareability.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-brand-green">NVMe:</strong> &lt;100 μs · ~7 GB/s
          </li>
          <li>
            <strong className="text-lime-300">SATA SSD:</strong> &lt;150 μs · ~550 MB/s
          </li>
          <li>
            <strong className="text-yellow-300">NAS:</strong> &gt;1 ms · ~1 GB/s
          </li>
          <li>
            <strong className="text-brand-rose">Object store:</strong> &gt;20 ms · variable
          </li>
        </ul>
        <p>
          <strong className="text-white">Laptop:</strong> a large internal NVMe is usually enough.
        </p>
        <p>
          <strong className="text-white">Startup / one server:</strong> a RAID of NVMe drives is a
          strong start.
        </p>
        <p>
          <strong className="text-white">Enterprise / distributed training:</strong> a distributed
          file system, or cloud object storage plus a high-performance local cache.
        </p>
        <p className="text-xs text-gray-400 italic">
          Click a store on the map, then read a batch — the wait grows as you leave the machine.
        </p>
      </div>
    ),
    Visual: StorageMapVisualizer,
  },
  {
    id: 'shared_storage',
    title: 'Network, Distributed, and Object Storage',
    subtitle: 'Many GPUs, one dataset, one source of truth',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <h4 className="text-white font-semibold text-base">Network and Distributed Storage</h4>
        <p>
          When datasets are too large to fit on a single machine or need to be accessed by multiple
          compute nodes simultaneously for distributed training, you must turn to network-based
          solutions.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Network-Attached Storage (NAS):</strong> A NAS is a
            dedicated file storage server that makes its storage available to other machines over a
            local area network (LAN), typically using a protocol like{' '}
            <span className="font-mono text-cyan-300">NFS</span> (Network File System). A
            high-performance NAS with fast networking (10GbE or faster) can serve data effectively
            to a small cluster of machines. However, the NAS device itself can become a single
            point of failure and a performance bottleneck if many clients make requests at once.
          </li>
          <li>
            <strong className="text-white">Distributed File Systems:</strong> For large-scale
            operations, a distributed file system is often the answer. These systems pool the
            storage from multiple servers (nodes) into a single, unified namespace. Data is spread
            across the nodes, and a file can be read in parallel from multiple disks at once,
            providing extremely high aggregate throughput. Systems like{' '}
            <strong className="text-white">Ceph</strong> or{' '}
            <strong className="text-white">Lustre</strong> are examples used in high-performance
            computing (HPC) and large AI clusters. They are complex to set up and manage but offer
            scalability and fault tolerance that a single NAS cannot.
          </li>
        </ul>

        <h4 className="text-white font-semibold text-base pt-1">Cloud Object Storage</h4>
        <p>
          Cloud providers offer a highly scalable and durable storage approach known as object
          storage. Services like Amazon S3, Google Cloud Storage (GCS), and Azure Blob Storage are
          the foundations of data storage in the cloud.
        </p>
        <p>
          Instead of a hierarchical filesystem of folders and files, object storage manages data as
          “objects” in a flat address space. Each object consists of the data itself, some metadata,
          and a unique ID.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-brand-green">Pros:</strong> Object storage offers virtually
            unlimited capacity, high durability (data is replicated across multiple locations), and
            a relatively low cost for storing massive amounts of data. This makes it the perfect
            place to build a “data lake” to house all of your raw and processed datasets.
          </li>
          <li>
            <strong className="text-brand-rose">Cons:</strong> Accessing data from object storage
            over the internet introduces higher latency compared to local or even LAN-based
            storage. Because of this, it is not typically used for direct access during
            high-performance training. The common pattern is to use object storage as the
            persistent source of truth and copy the required subset of data to faster, local NVMe
            storage on the compute instance before a training job begins.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Switch design, then drag the node count — watch the bandwidth each GPU actually gets.
        </p>
      </div>
    ),
    Visual: SharedStorageVisualizer,
  },
  {
    id: 'bw_latency',
    title: 'Networking: Bandwidth vs Latency',
    subtitle: 'A wide highway is useless if every car takes forever',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Scale past one machine and the network becomes the next bottleneck. Two numbers matter.
        </p>
        <h4 className="text-white font-semibold">Bandwidth (throughput)</h4>
        <p>
          How much data you can move per second — Gbps or Tbps. A 10-lane highway vs a 2-lane road.
          You need it for datasets, checkpoints, and shipping full parameter sets between nodes.
        </p>
        <h4 className="text-white font-semibold">Latency (delay)</h4>
        <p>
          Time for one packet to arrive — ms or μs. How long that one car takes, regardless of
          lanes. Data-parallel training syncs small gradient messages after every step. High
          latency = GPUs idle.
        </p>
        <p>
          The ideal AI fabric is a <strong className="text-white">wide pipe and a short pipe</strong>{' '}
          — same 100 Gbps, 50 μs vs 5 μs is a 10× wait on every all-reduce.
        </p>
      </div>
    ),
    Visual: BandwidthLatencyVisualizer,
  },
  {
    id: 'alltoall',
    title: 'Communication Patterns in Distributed Training',
    subtitle: 'The slowest hop stalls every GPU',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The effectiveness of a network is determined by how well it handles the specific
          communication patterns of an application. In distributed deep learning, one of the most
          demanding is <span className="text-brand-rose font-mono">All-to-All</span>. During
          gradient synchronization, every GPU node needs to send its calculated gradients to every
          other node.
        </p>
        <p>
          Imagine a cluster of 8 GPUs. After a training step, each GPU has a piece of the total
          gradient. To prepare for the next step, every GPU needs the complete, averaged gradient.
          This requires a complex shuffle of data where every node simultaneously talks to every
          other node.
        </p>
        <p>
          High latency in an <span className="text-brand-rose font-mono">All-to-All</span> exchange
          creates a compounding delay, as the slowest connection can hold up the entire cluster.
          This is why specialized networking hardware and libraries are used in large-scale AI
          systems.
        </p>
        <p className="text-xs text-gray-400 italic">
          Fire the sync — 8 nodes means 28 links light up at once.
        </p>
      </div>
    ),
    Visual: AllToAllVisualizer,
  },
  {
    id: 'rdma',
    title: 'High-Performance Networking Technologies',
    subtitle: 'InfiniBand, RDMA, and RoCE',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Standard enterprise Ethernet (1 GbE or 10 GbE) is fine for general IT tasks, but often
          insufficient for serious distributed AI. High-performance computing (HPC) has long relied
          on more advanced interconnects.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">InfiniBand:</strong> a high-performance networking
            standard designed for very low latency and high bandwidth. A common choice for building
            large AI supercomputers. An important feature is its support for{' '}
            <strong className="text-white">Remote Direct Memory Access (RDMA)</strong>.
          </li>
          <li>
            <strong className="text-white">RDMA:</strong> in a traditional network stack, moving
            data between machines takes multiple steps involving the CPU and operating system on
            both ends — latency plus wasted CPU cycles. RDMA lets the network interface card (NIC)
            of one machine write data directly into the memory (RAM or even VRAM) of another,
            bypassing the CPU and OS.
          </li>
          <li>
            <strong className="text-white">RoCE (RDMA over Converged Ethernet):</strong> achieves
            RDMA-like performance on a standard Ethernet network, a competitive alternative to
            InfiniBand if the fabric is configured to be “lossless”.
          </li>
        </ul>
        <p>
          The choice of network technology has a direct impact on both system performance and total
          cost. A low-latency, high-bandwidth network pays for itself by keeping expensive GPUs
          computing instead of waiting.
        </p>
        <p className="text-xs text-gray-400 italic">
          Toggle the two paths — watch System RAM &amp; CPU drop out of the route.
        </p>
      </div>
    ),
    Visual: RdmaVisualizer,
  },
];

export default function FoundationsOfAIComputePart3() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-green to-brand-blue" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-brand-green font-bold tracking-wider text-xs uppercase mb-1 block">
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
