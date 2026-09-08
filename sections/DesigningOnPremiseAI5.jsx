import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  InterconnectImpactVisualizer,
  PcieDetourVisualizer,
  PcieBandwidthVisualizer,
  NvlinkPathVisualizer,
  BandwidthChartVisualizer,
  NvlinkDecisionVisualizer,
  NvmeShiftVisualizer,
  StorageMetricsVisualizer,
  Raid0Visualizer,
  Raid10Visualizer,
  RaidLevelsVisualizer,
  TieredStorageVisualizer,
} from '../components/OnPremDesignPart2Visualizers';

export const meta = {
  title: 'Designing On-Premise AI Infrastructure (Part 2)',
  subtitle: 'GPU interconnects, NVLink, and storage that can actually keep up',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'interconnect_intro',
    title: 'GPU Interconnect Technologies',
    subtitle: 'The pathway between GPUs is part of your training time',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          When you connect multiple GPUs in a server, their ability to communicate efficiently
          becomes as important as their individual processing power. This communication channel, or{' '}
          <strong className="text-white">interconnect</strong>, is the physical pathway data travels
          between GPUs and between GPUs and the CPU.
        </p>
        <p>The total time for a training job is a sum of computation and communication times:</p>
        <div className="rounded-lg bg-black/40 border border-gray-700 p-3 text-center font-serif italic text-slate-100">
          T<sub>total</sub> = T<sub>compute</sub> + T<sub>communication</sub>
        </div>
        <p>
          A slow interconnect can create a severe bottleneck, leaving your expensive GPUs waiting
          for data and dramatically increasing{' '}
          <span className="font-serif italic">T<sub>communication</sub></span>.
        </p>
        <p>
          Two primary interconnect technologies are encountered when building an on-premise system:
          the standard <strong className="text-white">PCI Express bus</strong> and NVIDIA’s
          specialized <strong className="text-brand-green">NVLink</strong>.
        </p>
        <p className="text-xs text-gray-400 italic">
          Switch links and drag the payload — the red portion of the bar is time your GPUs are idle.
        </p>
      </div>
    ),
    Visual: InterconnectImpactVisualizer,
  },
  {
    id: 'pcie_standard',
    title: 'The Standard: PCI Express',
    subtitle: 'Two GPUs on a plain bus talk through the CPU',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Peripheral Component Interconnect Express, or{' '}
          <strong className="text-white">PCIe</strong>, is the standard high-speed interface used to
          connect processors to peripherals like GPUs, high-speed network cards, and NVMe drives.
          Every modern server and desktop uses it. When you install a GPU into a slot, you are
          connecting it to the system’s PCIe bus.
        </p>
        <p>
          For a <strong className="text-white">single-GPU setup</strong>, PCIe is perfectly
          adequate. The GPU communicates with the CPU to get data and instructions, performs its
          parallel computations, and sends results back. The bottleneck, if any, is usually
          elsewhere.
        </p>
        <p>
          The challenge arises in <strong className="text-white">multi-GPU configurations</strong>.
          GPUs communicating over the PCIe bus must route their traffic through the CPU. If GPU 1
          needs to send an update to GPU 2, the data path often looks like this:
        </p>
        <div className="rounded-lg bg-black/40 border border-gray-700 p-2.5 text-center font-mono text-xs text-brand-blue">
          GPU 1 → PCIe Bus → CPU → PCIe Bus → GPU 2
        </div>
        <p>
          This indirect path introduces significant latency and consumes the limited PCIe bandwidth
          connected to the CPU. While technologies like{' '}
          <strong className="text-brand-orange">PCIe Peer-to-Peer (P2P)</strong> can enable more
          direct transfers, performance can be inconsistent and depends heavily on the motherboard’s
          topology.
        </p>
        <p className="text-xs text-gray-400 italic">
          Send a packet, then flip P2P on and send it again.
        </p>
      </div>
    ),
    Visual: PcieDetourVisualizer,
  },
  {
    id: 'pcie_bandwidth',
    title: 'How PCIe Bandwidth Is Calculated',
    subtitle: 'Generation × lane count — and everyone shares',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The bandwidth of a PCIe connection is determined by two things: its{' '}
          <strong className="text-white">version</strong> (3.0, 4.0, 5.0) and the{' '}
          <strong className="text-white">number of lanes</strong> it uses (x4, x8, x16). Each
          generation roughly doubles the per-lane rate.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            A <strong className="text-white">PCIe 4.0 x16</strong> slot offers a theoretical
            bidirectional bandwidth of <span className="font-mono text-brand-green">64 GB/s</span>.
          </li>
          <li>
            <strong className="text-white">PCIe 5.0</strong> doubles that to{' '}
            <span className="font-mono text-brand-green">128 GB/s</span>.
          </li>
        </ul>
        <p>
          While impressive, this bandwidth is{' '}
          <strong className="text-brand-rose">shared among all devices</strong> connected to the CPU
          and can become saturated during intense multi-GPU synchronization. Your GPUs, NVMe drives,
          and network cards are all drawing from the same pool.
        </p>
        <p>
          This is also why lane width matters so much: dropping a card from x16 to x8 halves its
          ceiling regardless of how fast the generation is.
        </p>
        <p className="text-xs text-gray-400 italic">
          Combine a generation and a slot width, then add devices until the shared budget turns red.
        </p>
      </div>
    ),
    Visual: PcieBandwidthVisualizer,
  },
  {
    id: 'nvlink',
    title: 'The High-Speed Alternative: NVIDIA NVLink',
    subtitle: 'A direct link between GPUs that bypasses the CPU',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          To address the limitations of PCIe for multi-GPU workloads, NVIDIA developed{' '}
          <strong className="text-brand-green">NVLink</strong>, a proprietary high-speed interconnect
          that provides a direct communication link between GPUs.
        </p>
        <p>
          Instead of routing traffic through the CPU, NVLink-enabled GPUs can exchange data
          directly, <em>as if on a private highway</em>. This dramatically reduces latency and
          provides a massive increase in bandwidth dedicated solely to inter-GPU communication.
        </p>
        <p>
          In a PCIe-only setup, communication between GPUs is arbitrated by the CPU. With an NVLink
          bridge, GPUs gain a direct, high-bandwidth connection — which additionally{' '}
          <strong className="text-white">frees the PCIe bus</strong> for communication with the CPU
          and storage.
        </p>
        <p>
          This direct path is a game-changer for{' '}
          <strong className="text-white">model parallelism</strong>, where different layers of a
          large model reside on separate GPUs and must constantly exchange intermediate activations.
          It is also highly effective for{' '}
          <strong className="text-white">data parallelism</strong>, where gradients must be averaged
          across all GPUs after each step. By minimizing{' '}
          <span className="font-serif italic">T<sub>communication</sub></span>, NVLink allows training
          to scale more efficiently across multiple GPUs.
        </p>
        <p className="text-xs text-gray-400 italic">
          Race the same exchange down both routes and watch the two clocks diverge.
        </p>
      </div>
    ),
    Visual: NvlinkPathVisualizer,
  },
  {
    id: 'bandwidth_chart',
    title: 'Comparing Bandwidth: A Quantitative Look',
    subtitle: 'An order-of-magnitude difference, not a percentage',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The difference in performance between these two technologies is not subtle. NVLink
          bandwidth has increased with each generation, consistently outpacing the corresponding
          PCIe standards available at the time.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 font-mono text-xs">
          <li>PCIe 4.0 x16 — 64 GB/s</li>
          <li>PCIe 5.0 x16 — 128 GB/s</li>
          <li className="text-brand-green">NVLink (3rd Gen) — 600 GB/s</li>
          <li className="text-brand-green">NVLink (4th Gen) — 900 GB/s</li>
        </ul>
        <p>
          The 900 GB/s bandwidth of 4th generation NVLink (used with H100 GPUs) is{' '}
          <strong className="text-white">over 7 times</strong> that of PCIe 5.0. This massive
          bandwidth is what enables the training of today’s largest models in a reasonable amount of
          time.
        </p>
        <p className="text-xs text-gray-400">
          Note that NVLink values such as 900 GB/s are often quoted for a fully-connected set of GPUs
          in a high-end server node like an HGX system, using multiple links per GPU.
        </p>
        <p className="text-xs text-gray-400 italic">
          Click a bar for its multiplier, and switch to log scale to see the PCIe bars at all.
        </p>
      </div>
    ),
    Visual: BandwidthChartVisualizer,
  },
  {
    id: 'practical_notes',
    title: 'Practical Notes for System Design',
    subtitle: 'When NVLink pays for itself — and when it does not',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Your choice of interconnect technology has direct consequences on your server build,
          budget, and performance.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Workload Dependence:</strong> if your primary workloads
            involve single-GPU jobs or distributed tasks with very infrequent communication, the
            additional expense of NVLink may not be justified. A system with multiple PCIe 4.0 or 5.0
            slots can be a cost-effective solution for running many independent experiments in
            parallel.
          </li>
          <li>
            <strong className="text-white">Requirement for Scale:</strong> if your goal is to
            accelerate the training of a single, large model across multiple GPUs, NVLink is
            practically a necessity. The performance gains in reducing{' '}
            <span className="font-serif italic">T<sub>communication</sub></span> will far outweigh the
            initial hardware cost by shortening training cycles and improving GPU utilization.
          </li>
          <li>
            <strong className="text-white">Hardware Compatibility:</strong> NVLink is a feature of
            high-end, data-center-class NVIDIA GPUs (like the A100 and H100 series). It is not
            available on most consumer-grade GeForce cards. To connect GPUs with an NVLink bridge you
            also need a motherboard that physically spaces its PCIe slots correctly to accommodate
            the rigid bridge. For systems with more than two GPUs, you will typically need a
            specialized server platform such as an NVIDIA-Certified System.
          </li>
        </ul>
        <p>
          Ultimately the decision is a trade-off: upfront capital expenditure against the performance
          needs of your most demanding AI workloads.
        </p>
        <p className="text-xs text-gray-400 italic">
          Answer the three questions to get a verdict.
        </p>
      </div>
    ),
    Visual: NvlinkDecisionVisualizer,
  },
  {
    id: 'nvme_shift',
    title: 'High-Speed Storage: The Shift to NVMe',
    subtitle: 'SATA was designed for spinning disks',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A high-performance compute cluster is only as effective as its ability to access data. Your
          state-of-the-art GPUs will sit idle if they are constantly waiting for the storage system
          to feed them the next batch. This situation, known as an{' '}
          <strong className="text-brand-rose">I/O bottleneck</strong>, can neutralize the benefits of
          an otherwise powerful server, extending training times and wasting expensive resources.
        </p>
        <p>
          For years, Serial ATA (SATA) solid-state drives were a significant upgrade over spinning
          hard disk drives. However, for modern AI workloads even SATA SSDs become a chokepoint. The
          SATA interface was originally designed for mechanical drives and is limited to a
          theoretical maximum bandwidth of about{' '}
          <strong className="text-white">600 MB/s</strong>.
        </p>
        <p>
          This is where <strong className="text-brand-green">NVMe</strong> (Non-Volatile Memory
          Express) becomes the standard. Unlike SATA drives, NVMe SSDs connect directly to the
          motherboard’s PCIe bus — the same high-speed interface used by GPUs. This direct path
          slashes latency and opens a much wider data pipe. A single PCIe 4.0 NVMe drive can deliver
          sequential read speeds of over{' '}
          <strong className="text-white">7,000 MB/s</strong>, more than ten times that of a SATA SSD.
        </p>
        <p className="text-xs text-gray-400 italic">
          Resize the dataset and compare how long each interface takes to load it.
        </p>
      </div>
    ),
    Visual: NvmeShiftVisualizer,
  },
  {
    id: 'storage_metrics',
    title: 'Understanding Storage Performance Metrics',
    subtitle: 'Bandwidth, IOPS, and latency are three different things',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>When selecting drives, two metrics are particularly important.</p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Bandwidth (or Throughput):</strong> measured in megabytes
            or gigabytes per second, bandwidth indicates how quickly large, sequential chunks of data
            can be read or written. High bandwidth matters for loading massive model checkpoints or
            streaming large video and medical imaging files.
          </li>
          <li>
            <strong className="text-white">IOPS (Input/Output Operations Per Second):</strong> this
            measures how many separate read or write operations a drive can handle per second,
            regardless of the data size. High IOPS is essential when working with datasets composed
            of millions of small files, such as a collection of individual images. The storage system
            must locate and retrieve these files rapidly.
          </li>
        </ul>
        <p>
          <strong className="text-white">Latency</strong> is the third axis — the delay before a
          transfer even begins. An HDD measures it in milliseconds; NVMe measures it in microseconds.
        </p>
        <p>
          NVMe drives offer an order-of-magnitude improvement in{' '}
          <em>every</em> performance category, making them the default choice for the primary storage
          of any serious AI server.
        </p>
        <p className="text-xs text-gray-400 italic">
          Switch jobs — the highlighted table row is the metric that decides the race.
        </p>
      </div>
    ),
    Visual: StorageMetricsVisualizer,
  },
  {
    id: 'raid0',
    title: 'RAID 0: Striping for Maximum Performance',
    subtitle: 'Multiply your throughput, forfeit all redundancy',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Using a single drive, even a fast one, is rarely optimal. By combining multiple drives into
          a <strong className="text-white">RAID</strong> (Redundant Array of Independent Disks)
          array, you can multiply performance, add data protection, or both. For AI workloads, two
          configurations are most common for your “hot” data tier.
        </p>
        <p>
          In a RAID 0 configuration, data is <strong className="text-white">striped</strong> across
          multiple drives. When a file is written it is broken into chunks, and each chunk is written
          to a different drive simultaneously. This multiplies the effective read and write speed by
          the number of drives in the array.
        </p>
        <p>
          For example, a RAID 0 array with four NVMe drives capable of 7,000 MB/s each could
          theoretically approach{' '}
          <strong className="text-brand-green">28,000 MB/s</strong>.
        </p>
        <p>
          The major trade-off is the{' '}
          <strong className="text-brand-rose">lack of redundancy</strong>. If any single drive in a
          RAID 0 array fails, all data on the entire array is lost. Because of this, RAID 0 is best
          suited for “scratch” space — temporary data such as training datasets that are backed up
          elsewhere, or intermediate model artifacts that can be regenerated.
        </p>
        <p className="text-xs text-gray-400 italic">
          Add drives to watch throughput scale, then fail one.
        </p>
      </div>
    ),
    Visual: Raid0Visualizer,
  },
  {
    id: 'raid10',
    title: 'RAID 10: Performance and Redundancy',
    subtitle: 'A stripe of mirrors, at half the usable capacity',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          RAID 10 provides a balance of performance and protection. It requires at least{' '}
          <strong className="text-white">four drives</strong> and works by creating mirrored pairs
          (RAID 1) and then striping data across those pairs (RAID 0).
        </p>
        <p>
          The result is a system that has the read performance of a RAID 0 array and provides
          complete data redundancy. If one drive in a mirrored pair fails, the system continues to
          operate without data loss.
        </p>
        <p>
          The downside is <strong className="text-brand-orange">cost and capacity efficiency</strong>
          . You only get to use 50% of the total raw storage capacity. For example, four 2 TB drives
          in a RAID 10 configuration yield a usable capacity of just 4 TB.
        </p>
        <p>
          However, for storing valuable models or unique datasets where both performance and safety
          matter, RAID 10 is an excellent choice.
        </p>
        <p className="text-xs text-gray-400 italic">
          Click drives to fail them — one per mirror set survives, two does not.
        </p>
      </div>
    ),
    Visual: Raid10Visualizer,
  },
  {
    id: 'raid_levels',
    title: 'RAID 0, 1, 5, 6, 10: What Actually Differs',
    subtitle: 'Speed, usable capacity, and how many drives may die',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          RAID 0 and RAID 10 are the two you will use for the hot tier, but the other levels keep
          appearing — <strong className="text-white">RAID 1</strong> for the system drive and{' '}
          <strong className="text-white">RAID 5 or 6</strong> for the archive. Every level is the
          same trade between three quantities.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">RAID 0 — striping.</strong> Blocks are spread across all
            drives with nothing duplicated. Fastest and 100% usable capacity, but{' '}
            <span className="text-brand-rose">zero fault tolerance</span>. Minimum 2 drives.
          </li>
          <li>
            <strong className="text-white">RAID 1 — mirroring.</strong> Every drive holds an
            identical copy. You get the capacity of a single drive, and the array survives until the
            last copy dies. Minimum 2 drives. This is the mirrored pair recommended for the OS
            volume.
          </li>
          <li>
            <strong className="text-white">RAID 5 — striping with distributed parity.</strong> One
            drive’s worth of space per stripe holds a{' '}
            <strong className="text-brand-orange">parity block</strong>, rotated across the drives.
            Any single drive can fail and its contents are recomputed from the survivors. Usable
            capacity is <span className="font-mono">n − 1</span> drives. Minimum 3.
          </li>
          <li>
            <strong className="text-white">RAID 6 — double distributed parity.</strong> Two parity
            blocks per stripe (P and Q) instead of one, so it survives{' '}
            <strong className="text-white">two</strong> simultaneous failures. Usable capacity is{' '}
            <span className="font-mono">n − 2</span>. Minimum 4. Preferred for large archives, where
            a second drive often fails during the long rebuild after the first.
          </li>
          <li>
            <strong className="text-white">RAID 10 — a stripe of mirrors.</strong> Mirror pairs, then
            striping across them. No parity arithmetic, so writes stay fast, but you pay 50% of raw
            capacity.
          </li>
        </ul>
        <h4 className="text-white font-semibold">Why parity is not magic</h4>
        <p>
          A parity block is just the <strong className="text-white">XOR</strong> of the data blocks
          in its stripe: <span className="font-mono text-xs">P = A ⊕ B ⊕ C</span>. XOR undoes itself,
          so if B is lost you recover it with{' '}
          <span className="font-mono text-xs">B = A ⊕ C ⊕ P</span>. That single property is the whole
          reason RAID 5 can lose a drive without losing data — and the reason it can only lose{' '}
          <em>one</em>, since one equation cannot solve for two unknowns.
        </p>
        <p className="text-xs text-gray-400 italic">
          Pick a level, then click drives to kill them and watch where each array gives up.
        </p>
      </div>
    ),
    Visual: RaidLevelsVisualizer,
  },
  {
    id: 'tiers',
    title: 'A Tiered Strategy for On-Premise Storage',
    subtitle: 'Match each kind of data to the storage it deserves',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A practical approach to on-premise AI storage involves creating tiers based on performance
          needs and cost.
        </p>
        <ol className="list-decimal pl-5 space-y-2.5">
          <li>
            <strong className="text-white">OS and System Drive:</strong> a single small NVMe SSD or a
            mirrored pair (RAID 1) of SATA SSDs is sufficient for the operating system and core
            software. The priority here is reliability over raw speed.
          </li>
          <li>
            <strong className="text-white">High-Performance “Hot” Tier:</strong> this is for your
            active datasets and training scratch space. An array of four or more high-endurance NVMe
            SSDs in a RAID 0 configuration is ideal for maximizing I/O performance to keep the GPUs
            fed. The data here should be ephemeral or backed up elsewhere.
          </li>
          <li>
            <strong className="text-white">Warm/Cold Archive Tier:</strong> not all data needs to be
            on the fastest possible storage. A separate, larger-capacity NAS, possibly using HDDs in
            a RAID 5 or RAID 6 configuration, can serve as an archive for inactive projects, raw
            data, and backups. Data can be moved from this archive to the hot tier as needed for
            training.
          </li>
        </ol>
        <p>
          By designing your storage configuration to eliminate I/O bottlenecks, you ensure that your
          compute resources are used effectively — directly supporting the goal of minimizing total
          training time and maximizing the return on your hardware investment.
        </p>
        <p className="text-xs text-gray-400 italic">
          Run a training job to watch the dataset get staged, then drag the epoch count to find the
          point where staging stops being worth it.
        </p>
      </div>
    ),
    Visual: TieredStorageVisualizer,
  },
];

export default function DesigningOnPremiseAIPart2() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple to-brand-green" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-brand-purple font-bold tracking-wider text-xs uppercase mb-1 block">
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
