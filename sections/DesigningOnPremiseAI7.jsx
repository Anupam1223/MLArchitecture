import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  ScenarioBriefVisualizer,
  SpecSheetVisualizer,
  LlamaVramVisualizer,
  ArchitectureDiagramVisualizer,
  PlatformRamVisualizer,
  StorageNetPowerVisualizer,
  PracticeScenarioVisualizer,
  PreflightVisualizer,
  AssemblyFlowVisualizer,
  BiosDriverVisualizer,
} from '../components/OnPremDesignPart4Visualizers';

export const meta = {
  title: 'Designing On-Premise AI Infrastructure (Part 4)',
  subtitle: 'Assemble the box, then fill the specification sheet for the workload',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'preflight',
    title: 'Building a Bare-Metal AI Server',
    subtitle: 'Pre-flight check before a single screw turns',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Turning a carefully selected bill of materials into a working server needs a methodical
          assembly and configuration process. Compared with a desktop build, a bare-metal AI server
          adds constraints around high-power GPUs, maximum data throughput, and stability under
          continuous load.
        </p>
        <h4 className="text-white font-semibold">A Pre-Flight Check for Compatibility</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Motherboard ↔ CPU:</strong> socket type must match (e.g.
            sTR5 on TRX50).
          </li>
          <li>
            <strong className="text-white">Motherboard ↔ GPUs:</strong> a board with four x16 slots may
            only physically fit two triple-width cards.
          </li>
          <li>
            <strong className="text-white">Chassis ↔ components:</strong> max GPU length, cooler
            height, and AIO radiator mounts (240/360 mm).
          </li>
          <li>
            <strong className="text-white">PSU connectors:</strong> four GPUs needing two 8-pin plugs
            each require eight dedicated connectors — wattage alone is not enough.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Widen the cards and add GPUs — watch slots go “blocked” and connectors run out.
        </p>
      </div>
    ),
    Visual: PreflightVisualizer,
  },

  {
    id: 'assembly',
    title: 'The Assembly Workflow',
    subtitle: 'Bench the board first, GPUs last, cables for airflow',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Assemble in an order that avoids uninstalling parts later. Prep the motherboard on the
          bench (CPU, RAM, M.2), mount it in the chassis, then PSU and cooling, then the GPUs.
        </p>
        <p>
          When seating GPUs, work one card at a time and only attach NVLink bridges after the cards
          are secured. Cable routing is not cosmetic — blocked intake paths cause thermal throttling
          during long training runs.
        </p>
        <p>
          After the hardware is in, the remaining work is firmware and software: BIOS settings, a
          minimal Linux install, NVIDIA drivers, and a final <span className="font-mono text-xs">nvidia-smi</span> check.
        </p>
        <p className="text-xs text-gray-400 italic">
          Step through the flowchart — each box expands with the gotcha for that stage.
        </p>
      </div>
    ),
    Visual: AssemblyFlowVisualizer,
  },

  {
    id: 'bios_drivers',
    title: 'Essential BIOS/UEFI Configuration',
    subtitle: 'Above 4G, ReBAR, PCIe Gen — then nvidia-smi',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <h4 className="text-white font-semibold">Essential BIOS / UEFI settings</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Above 4G Decoding:</strong> lets a 64-bit OS address the
            large memory spaces of multiple GPUs. Without it the system may not boot or may only see
            one GPU.
          </li>
          <li>
            <strong className="text-white">Resizable BAR:</strong> the CPU can access the entire GPU
            frame buffer at once instead of 256 MB chunks.
          </li>
          <li>
            <strong className="text-white">PCIe link speeds:</strong> manually set slots to the highest
            supported generation so the link does not auto-negotiate downward.
          </li>
        </ul>
        <h4 className="text-white font-semibold">OS and drivers</h4>
        <p>
          A stable minimal foundation such as <strong className="text-white">Ubuntu Server LTS</strong>,
          then proprietary NVIDIA drivers (including the CUDA toolkit). Verify with{' '}
          <span className="font-mono text-xs text-brand-green">nvidia-smi</span> — every installed GPU
          should appear with the expected VRAM.
        </p>
        <p className="text-xs text-gray-400 italic">
          Toggle the BIOS switches, then run the mock nvidia-smi and count the GPUs.
        </p>
      </div>
    ),
    Visual: BiosDriverVisualizer,
  },

  {
    id: 'practice_intro',
    title: 'Practice: Creating a Hardware Specification Sheet',
    subtitle: 'Theory becomes a shopping list with justifications',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          We now move from theory to the practical discipline of infrastructure engineering: creating
          a <strong className="text-white">hardware specification sheet</strong>. This document is
          the crucial bridge between the needs of an AI workload and the concrete configuration of a
          functional on-premise server.
        </p>
        <p>
          It involves making informed decisions, justifying those choices based on performance goals
          and constraints, and assembling those decisions into a coherent plan.
        </p>
        <h4 className="text-white font-semibold">Scenario: Fine-Tuning an Internal Q&amp;A Model</h4>
        <p>
          You are an engineer at a company building an internal knowledge-base assistant. Your task
          is to fine-tune a powerful open-source LLM on the company’s private documentation.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-white">Model:</strong> Llama 3 70B — significant VRAM for training
            and inference.
          </li>
          <li>
            <strong className="text-white">Task:</strong> Supervised fine-tuning (SFT) on a proprietary
            dataset.
          </li>
          <li>
            <strong className="text-white">Dataset:</strong> 500 GB of curated text and code.
          </li>
          <li>
            <strong className="text-white">Performance:</strong> a full fine-tuning run must finish in{' '}
            <strong className="text-brand-orange">under 48 hours</strong>.
          </li>
          <li>
            <strong className="text-white">Team:</strong> three ML engineers will share this server.
          </li>
          <li>
            <strong className="text-white">Budget:</strong> substantial, but every expensive part needs
            a clear justification. Prioritise long-term value over the cheapest bill of materials.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Click each constraint card — the rest of the sheet hangs off these six facts.
        </p>
      </div>
    ),
    Visual: ScenarioBriefVisualizer,
  },

  {
    id: 'spec_template',
    title: 'The Task: Build the Specification Sheet',
    subtitle: 'List the part — and defend why it is there',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Fill out a hardware specification sheet for a server that can handle the scenario above.
          The sheet should not only list the components but also provide a{' '}
          <strong className="text-white">clear justification</strong> for each choice, connecting it
          back to the project’s requirements.
        </p>
        <p>
          Below is a template. We will walk through filling it out for the LLM scenario, explaining
          the reasoning behind each selection.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-white">Compute</strong> — GPU and CPU
          </li>
          <li>
            <strong className="text-white">Platform</strong> — motherboard and chassis
          </li>
          <li>
            <strong className="text-white">Memory</strong> — system RAM
          </li>
          <li>
            <strong className="text-white">Storage</strong> — hot NVMe and cold SATA
          </li>
          <li>
            <strong className="text-white">Network</strong> — NIC speed
          </li>
          <li>
            <strong className="text-white">Power</strong> — PSU wattage and efficiency
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Click a row to see what question it must answer, then reveal the worked-example fill.
        </p>
      </div>
    ),
    Visual: SpecSheetVisualizer,
  },

  {
    id: 'vram_70b',
    title: 'Worked Example: Completing the Specification Sheet',
    subtitle: '70B × bytes/param decides whether four 4090s are enough',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <h4 className="text-white font-semibold">Graphics Processing Unit (GPU)</h4>
        <p>
          <strong className="text-brand-green">Selected: 4× NVIDIA RTX 4090 (24 GB)</strong>
        </p>
        <p>
          Llama 3 70B at full precision (FP32) would need roughly{' '}
          <span className="font-mono text-brand-rose">70B × 4 bytes = 280 GB</span> of VRAM. At mixed
          precision (FP16/BF16) that halves to{' '}
          <span className="font-mono text-brand-orange">140 GB</span>. Four 4090s only provide{' '}
          <span className="font-mono text-white">96 GB</span> total.
        </p>
        <p>
          The build still works because fine-tuning will use{' '}
          <strong className="text-white">quantization (e.g. 4-bit)</strong> and techniques like{' '}
          <strong className="text-white">LoRA</strong>, which shrink the resident working set into
          that 96 GB envelope.
        </p>
        <p>
          Four GPUs in parallel also target the sub-48-hour training deadline. The 4090 is chosen
          for its performance-to-cost ratio versus professional cards like the A100 on this budget.
          Inter-GPU communication is over <strong className="text-white">PCIe 4.0</strong> (consumer
          4090s do not offer NVLink).
        </p>
        <h4 className="text-white font-semibold">Central Processing Unit (CPU)</h4>
        <p>
          <strong className="text-brand-green">Selected: AMD Ryzen Threadripper 7960X (24-core)</strong>
        </p>
        <p>
          The CPU’s job is data feeding and system management. The critical requirement is a high
          number of <strong className="text-white">PCIe 5.0 lanes</strong> so all four GPUs get full
          x16 bandwidth at once. Twenty-four cores are enough for the OS and the data-loading
          pipeline that prepares batches for the GPUs.
        </p>
        <p className="text-xs text-gray-400 italic">
          Flip precision and GPU count — watch the VRAM bucket overflow or clear.
        </p>
      </div>
    ),
    Visual: LlamaVramVisualizer,
  },

  {
    id: 'architecture',
    title: 'Proposed Server Architecture',
    subtitle: 'CPU fans out dedicated PCIe lanes to every accelerator',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Putting the compute choices together produces a clear topology: a Threadripper with 256 GB
          of DDR5 at the centre, four RTX 4090s on dedicated PCIe x16 links, a 4 TB NVMe for the
          active dataset on PCIe x4, and an 8 TB SATA SSD for checkpoints.
        </p>
        <p>
          The diagram’s point is not aesthetics — it is that{' '}
          <strong className="text-white">no GPU shares a lane</strong> with another GPU, and the hot
          storage path does not steal bandwidth from the training fabric.
        </p>
        <p className="text-xs text-gray-400 italic">
          Click CPU, a GPU, RAM, or either drive to read its justification.
        </p>
      </div>
    ),
    Visual: ArchitectureDiagramVisualizer,
  },

  {
    id: 'platform_ram',
    title: 'Platform and Memory',
    subtitle: 'TRX50, a 4U box, and enough DDR5 to avoid swapping',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Motherboard — TRX50 (sTR5):</strong> required for
            Threadripper, with at least four PCIe x16 slots spaced for dual- or triple-slot GPUs.
            The chipset’s lane count is what makes four full-bandwidth GPUs possible.
          </li>
          <li>
            <strong className="text-white">Chassis — 4U rackmount or full-tower:</strong> must fit
            four large GPUs and the large motherboard, with excellent cooling potential (multiple
            high-CFM fans).
          </li>
          <li>
            <strong className="text-white">System RAM — 256 GB DDR5:</strong> essential for data
            preprocessing. For a 500 GB dataset, loaders read chunks into RAM before transferring to
            the GPU. 256 GB buffers the OS and multiple users so the machine never falls back to{' '}
            <strong className="text-brand-rose">disk swapping</strong>, which ruins training
            throughput.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Drag RAM down and watch the staging path turn red when swapping begins.
        </p>
      </div>
    ),
    Visual: PlatformRamVisualizer,
  },

  {
    id: 'storage_net_power',
    title: 'Storage, Network, and Power',
    subtitle: 'Keep the GPUs fed, move data fast, leave PSU headroom',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Hot storage — 4 TB NVMe Gen4:</strong> OS, software, and
            the 500 GB active dataset. High read speeds keep GPUs saturated.
          </li>
          <li>
            <strong className="text-white">Cold storage — 8 TB SATA SSD:</strong> model checkpoints for
            a 70B model can exceed 100 GB each. Cost-effective capacity that is still faster and more
            reliable than HDD.
          </li>
          <li>
            <strong className="text-white">NIC — 10 GbE:</strong> moving 500 GB over 1 GbE takes over
            an hour; 10 GbE is roughly a 10× speedup.
          </li>
          <li>
            <strong className="text-white">PSU — 2000W 80+ Titanium:</strong> each 4090 draws ~450W,
            the CPU over 300W under load. Four GPUs alone are 1800W; 2000W leaves headroom for spikes.
            Titanium efficiency cuts heat and electricity across 48-hour runs.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Tab between storage, the 1 GbE vs 10 GbE race, and the PSU ledger.
        </p>
      </div>
    ),
    Visual: StorageNetPowerVisualizer,
  },

  {
    id: 'yolo_practice',
    title: 'Your Turn: Practice Scenario',
    subtitle: 'A constrained manufacturing QC build — different answers',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Now use the empty template mindset for a more constrained scenario.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Goal:</strong> develop and serve a real-time object
            detection model for manufacturing quality control.
          </li>
          <li>
            <strong className="text-white">Model:</strong> custom model based on YOLOv8.
          </li>
          <li>
            <strong className="text-white">Task:</strong> train on a new dataset and deploy for
            low-latency inference.
          </li>
          <li>
            <strong className="text-white">Dataset:</strong> 2 TB of high-resolution images.
          </li>
          <li>
            <strong className="text-white">Target:</strong> inference faster than 30 ms per frame.
            Training speed matters less than inference performance and server cost.
          </li>
          <li>
            <strong className="text-white">Budget:</strong> moderate — cost-effectiveness for a 24/7
            inference workload.
          </li>
        </ul>
        <p>
          How do these requirements change component selection? Will you still need four GPUs? Is
          system RAM or VRAM more important? How does 24/7 inference affect the PSU?
        </p>
        <p className="text-xs text-gray-400 italic">
          Answer the three questions — green choices match the scenario, red ones import the LLM
          build by habit.
        </p>
      </div>
    ),
    Visual: PracticeScenarioVisualizer,
  }
];

export default function DesigningOnPremiseAIPart4() {
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
