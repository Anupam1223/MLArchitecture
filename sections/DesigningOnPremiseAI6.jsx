import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  NetworkBottleneckVisualizer,
  BandwidthLatencyVisualizer,
  RdmaPathVisualizer,
  TopologyVisualizer,
  NetworkPlanningVisualizer,
  TrafficSeparationVisualizer,
  PowerBudgetVisualizer,
  CircuitVisualizer,
  PowerFlowVisualizer,
  BtuVisualizer,
  ServerAirflowVisualizer,
  HotColdAisleVisualizer,
} from '../components/OnPremDesignPart3Visualizers';

export const meta = {
  title: 'Designing On-Premise AI Infrastructure (Part 3)',
  subtitle: 'The network that feeds the cluster, and the power and cooling that keep it alive',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'network_intro',
    title: 'Networking for Data and Model Transfer',
    subtitle: 'Your cluster is only as fast as its slowest component',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Your compute cluster is only as fast as its slowest component. While GPUs provide immense
          computational power, they are <strong className="text-white">completely dependent on the
          network</strong> to receive data and to coordinate with other nodes during distributed
          tasks.
        </p>
        <p>
          Minimizing the communication component of the total training time is a significant part of
          infrastructure design:
        </p>
        <div className="rounded-lg bg-black/40 border border-gray-700 p-3 text-center font-serif italic text-slate-100">
          T<sub>total</sub> = T<sub>compute</sub> + T<sub>communication</sub>
        </div>
        <p>
          An under-provisioned network effectively{' '}
          <strong className="text-brand-rose">throttles your expensive GPUs</strong>, leaving them
          idle while they wait for data. The goal of everything in this section is to keep{' '}
          <span className="font-serif italic">T<sub>communication</sub></span> as small as possible.
        </p>
        <p>
          A standard 1 Gbps office network is wholly insufficient. Modern AI clusters typically{' '}
          <strong className="text-white">start at 25 Gbps</strong> and frequently use 100 Gbps or
          faster connections.
        </p>
        <p className="text-xs text-gray-400 italic">
          Step through the fabric speeds and watch when the nodes stop saying “waiting”.
        </p>
      </div>
    ),
    Visual: NetworkBottleneckVisualizer,
  },
  {
    id: 'bandwidth_latency',
    title: 'Bandwidth and Latency: The Two Pillars',
    subtitle: 'A fat pipe and a fast pipe are not the same thing',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          When planning your on-premise network, two metrics are of primary importance — and they are
          independent of each other.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Bandwidth</strong> is the data throughput capacity of the
            network, typically measured in gigabits per second (Gbps). High bandwidth is essential
            for operations that move large volumes of data: loading massive datasets from a storage
            server, checkpointing a large model, or transferring model weights between nodes in
            certain parallelism strategies.
          </li>
          <li>
            <strong className="text-white">Latency</strong> is the time delay for a packet of data to
            travel from source to destination, measured in milliseconds (ms) or microseconds (µs).
            Low latency is extremely important for{' '}
            <strong className="text-brand-purple">synchronous distributed training</strong>, where
            multiple workers frequently exchange small packets of information (like gradients) and
            wait for each other to complete before proceeding to the next step. High latency creates
            a significant bottleneck, as all nodes are forced to wait for the slowest communication
            link to complete.
          </li>
        </ul>
        <p>
          While Ethernet is the most common networking technology, high-performance computing and AI
          clusters often use specialized technologies like{' '}
          <strong className="text-white">InfiniBand</strong>, designed from the ground up for the
          highest bandwidth and lowest possible latency.
        </p>
        <p className="text-xs text-gray-400 italic">
          Drag the two knobs — the pipe gets wider (bandwidth) or longer (latency). Watch which job
          time reacts.
        </p>
      </div>
    ),
    Visual: BandwidthLatencyVisualizer,
  },
  {
    id: 'rdma',
    title: 'RDMA: Bypassing the CPU',
    subtitle: 'Four memory copies, or none at all',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          In a standard network stack using TCP/IP, sending data from an application on Server A to
          an application on Server B involves multiple steps. The data is copied from the
          application’s memory space to the operating system’s kernel space, processed by the TCP/IP
          stack, and then sent to the network card. The process is reversed on the receiving end.
        </p>
        <p>
          These copies and kernel-level interventions add{' '}
          <strong className="text-brand-rose">significant latency and consume valuable CPU
          cycles</strong> — cycles you bought for computation, not for shuffling buffers.
        </p>
        <p>
          <strong className="text-brand-green">Remote Direct Memory Access (RDMA)</strong> changes
          this process entirely. It allows the network interface card (NIC) of one server to access
          the main memory of another server directly, without involving either server’s operating
          system or CPU. This bypasses the TCP/IP stack and eliminates memory copies, drastically
          reducing latency and freeing the CPU to focus on computation.
        </p>
        <p>
          For distributed training workloads that require frequent, rapid communication, RDMA is not
          a “nice-to-have” feature; it is a{' '}
          <strong className="text-white">fundamental requirement</strong> for achieving high
          performance. It is a native feature of InfiniBand and is also available over Ethernet
          through a protocol called <strong className="text-white">RoCE</strong> (RDMA over Converged
          Ethernet).
        </p>
        <p className="text-xs text-gray-400 italic">
          Send a message and count the stops on each path.
        </p>
      </div>
    ),
    Visual: RdmaPathVisualizer,
  },
  {
    id: 'topology',
    title: 'Network Topologies for Scalable AI Clusters',
    subtitle: 'Star for a few servers, leaf-spine for a real cluster',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The way you physically connect your servers and switches, known as the{' '}
          <strong className="text-white">network topology</strong>, has a direct impact on
          performance and scalability.
        </p>
        <h4 className="text-white font-semibold">Star topology</h4>
        <p>
          For a small setup with just two to four servers, a simple star topology is often
          sufficient. All servers connect directly to a single, high-performance switch. This is
          straightforward to implement and manage, but the central switch can become a{' '}
          <strong className="text-brand-rose">performance bottleneck</strong> and represents a{' '}
          <strong className="text-brand-rose">single point of failure</strong> as the cluster grows.
        </p>
        <h4 className="text-white font-semibold">Leaf-spine topology</h4>
        <p>
          For larger, multi-rack clusters, leaf-spine is the industry standard. This design consists
          of two layers of switches:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>
            <strong className="text-white">Leaf switches:</strong> servers in a rack connect to one
            or more leaf switches.
          </li>
          <li>
            <strong className="text-white">Spine switches:</strong> every leaf switch connects to
            every spine switch.
          </li>
        </ol>
        <p>
          This architecture provides multiple communication paths between any two servers. Traffic
          between any two nodes only has to traverse a leaf switch and a spine switch, leading to{' '}
          <strong className="text-white">predictable, low latency</strong>. The aggregate bandwidth
          of a leaf-spine network scales linearly as you add more spine switches, making it an
          excellent choice for building large, high-performance AI factories.
        </p>
        <p className="text-xs text-gray-400 italic">
          Try failing a switch in each topology — the outcomes could not be more different.
        </p>
      </div>
    ),
    Visual: TopologyVisualizer,
  },
  {
    id: 'planning',
    title: 'Planning Your Network Infrastructure',
    subtitle: 'NICs, switches, and cabling as first-class specs',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          When creating the specification for your on-premise AI server, the network is a first-class
          citizen alongside the CPU and GPU. Your planning should include:
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Network Interface Cards (NICs):</strong> select NICs that
            match your desired speed (e.g. 100GbE) and support RDMA, whether InfiniBand or RoCE. Most
            high-density GPU servers have multiple PCIe slots to accommodate several NICs if
            necessary.
          </li>
          <li>
            <strong className="text-white">Switches:</strong> the switch must have enough ports for
            all your servers and provide sufficient{' '}
            <strong className="text-brand-green">non-blocking backplane capacity</strong>. This means
            the switch can handle traffic from all ports at line rate simultaneously without dropping
            packets.
          </li>
          <li>
            <strong className="text-white">Cabling:</strong> choose cables that support your target
            speed — Direct Attach Copper for short in-rack connections, fibre optics for longer runs.
          </li>
        </ul>
        <p>
          Note that a NIC purchased without RDMA support quietly undoes the previous slide: every
          transfer goes back through the kernel.
        </p>
        <p className="text-xs text-gray-400 italic">
          Build a spec — the backplane meter turns red the moment the switch is oversubscribed.
        </p>
      </div>
    ),
    Visual: NetworkPlanningVisualizer,
  },
  {
    id: 'separation',
    title: 'Separation of Traffic',
    subtitle: 'Do not let a dataset load stall a gradient exchange',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          In many high-performance designs,{' '}
          <strong className="text-white">two separate physical networks</strong> are used: one for
          storage traffic (connecting nodes to the storage system) and one for the compute fabric
          (inter-node communication for distributed training).
        </p>
        <p>
          This prevents large data-loading operations from interfering with the{' '}
          <strong className="text-brand-purple">latency-sensitive gradient exchanges</strong>. The
          two traffic classes have opposite personalities: one is a sustained bulk stream that will
          happily consume every available bit of bandwidth, the other is a stream of tiny messages
          that only cares about arriving quickly.
        </p>
        <p>
          Put them on the same wire and the bulk transfer wins, because it is always sending. Your
          workers then sit waiting on gradient packets stuck behind a dataset.
        </p>
        <p>
          If physical separation is not feasible, using{' '}
          <strong className="text-white">VLANs</strong> to logically segment traffic is a viable
          alternative.
        </p>
        <p>
          By carefully planning your network, you ensure that communication overhead does not become
          the limiting factor in your system’s performance, allowing your computational hardware to
          operate at its full potential.
        </p>
        <p className="text-xs text-gray-400 italic">
          Start a dataset load on the shared fabric and watch the latency trace spike.
        </p>
      </div>
    ),
    Visual: TrafficSeparationVisualizer,
  },
  {
    id: 'power_calc',
    title: 'Calculating Power Consumption',
    subtitle: 'Sum the TDPs, then divide by PSU efficiency',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          High-performance CPUs and GPUs convert nearly every watt of electricity they consume into
          heat. Failing to plan for power delivery and heat dissipation leads to thermal throttling,
          system instability, and premature hardware failure.
        </p>
        <p>
          The first step is to estimate the total power your server will draw under a heavy workload.
          A component’s <strong className="text-white">Thermal Design Power (TDP)</strong> is a good
          starting point — while it technically measures the maximum heat the cooling system is
          designed to dissipate, it is a reliable estimate for power consumption under sustained
          load.
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-white">GPUs:</strong> the most power-intensive components. An
            NVIDIA A100 has a TDP of 400W.
          </li>
          <li>
            <strong className="text-white">CPUs:</strong> often 150W to 280W per processor.
          </li>
          <li>
            <strong className="text-white">Motherboard, RAM, and storage:</strong> around 150–250W
            combined, including system fans.
          </li>
        </ul>
        <div className="rounded-lg bg-black/40 border border-gray-700 p-3 font-mono text-xs space-y-1">
          <div>4 × 400W = 1600W</div>
          <div>2 × 200W = 400W</div>
          <div>motherboard, RAM, storage ≈ 200W</div>
          <div className="border-t border-gray-700 pt-1 text-white">
            1600W + 400W + 200W = 2200W
          </div>
        </div>
        <p>
          That 2200W is the <strong className="text-white">direct current</strong> the components
          need. The PSU draws alternating current from the wall and converts it, and that is not 100%
          efficient. High-quality server PSUs carry an “80 Plus” rating, with Platinum or Titanium
          indicating 90% or higher. At 90%:
        </p>
        <div className="rounded-lg bg-black/40 border border-gray-700 p-3 text-center font-serif italic text-slate-100">
          2200W ÷ 0.90 ≈ 2444W
        </div>
        <p>
          This is the number you must use for planning your electrical circuits. For production
          systems, always use redundant PSUs so one can carry the full load if the other fails.
        </p>
        <p className="text-xs text-gray-400 italic">
          Walk the two steps — pick a server, sum the TDPs, then apply PSU efficiency.
        </p>
      </div>
    ),
    Visual: PowerBudgetVisualizer,
  },
  {
    id: 'circuits',
    title: 'Planning for Power Delivery',
    subtitle: 'Volts × amps × 0.80',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A common mistake is assuming a standard wall outlet can handle a powerful AI server. In
          North America a typical household circuit is{' '}
          <strong className="text-white">120 volts</strong> protected by a{' '}
          <strong className="text-white">15-ampere</strong> breaker. The maximum power you can safely
          draw continuously is 80% of the circuit’s maximum:
        </p>
        <div className="rounded-lg bg-black/40 border border-gray-700 p-3 text-center font-serif italic text-slate-100">
          120V × 15A × 0.80 = 1440W
        </div>
        <p>
          Our example server, drawing 2444W, would immediately trip this breaker. Even a 20A circuit
          (<span className="font-mono text-xs">120V × 20A × 0.80 = 1920W</span>) is insufficient.
        </p>
        <p>
          This is why data centers and dedicated server rooms use higher-voltage circuits, typically{' '}
          <strong className="text-white">208V or 240V</strong>. A 208V, 20A circuit provides:
        </p>
        <div className="rounded-lg bg-black/40 border border-gray-700 p-3 text-center font-serif italic text-slate-100">
          208V × 20A × 0.80 = 3328W
        </div>
        <p>
          That gives a safe margin for our 2444W server. When building an on-premise facility you
          must work with an electrician to install the appropriate high-power outlets.
        </p>
        <p>
          For server racks you will use a{' '}
          <strong className="text-white">Power Distribution Unit (PDU)</strong> — essentially a power
          strip designed to mount in a rack and distribute power from a high-amperage wall circuit to
          multiple servers.
        </p>
        <p className="text-xs text-gray-400 italic">
          Pick a circuit and drag the draw until the breaker gives up.
        </p>
      </div>
    ),
    Visual: CircuitVisualizer,
  },
  {
    id: 'power_flow',
    title: 'The Full Power Path',
    subtitle: 'Wall outlet → PDU → PSUs → silicon → heat',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Putting the whole chain together shows where every watt goes and where it ends up. Power
          enters from a high-power wall outlet, passes through the rack PDU, is converted from AC to
          DC by the redundant PSUs, and is consumed by the CPUs, GPUs, and everything else.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">3328W available</strong> from a 208V / 20A circuit after
            the 80% rule.
          </li>
          <li>
            <strong className="text-white">2444W drawn</strong> from the wall by the server.
          </li>
          <li>
            <strong className="text-white">2200W delivered</strong> to the components — the
            difference is lost as heat inside the PSUs themselves.
          </li>
          <li>
            <strong className="text-brand-rose">~8340 BTU/hr</strong> of heat leaving the chassis,
            which a dedicated AC unit must remove from the room.
          </li>
        </ul>
        <p>
          Notice that the cooling system is not an afterthought bolted onto this diagram — it is the
          other half of it. Power in and heat out are the same quantity measured twice.
        </p>
        <p className="text-xs text-gray-400 italic">
          Energise the rack, then change the PSU rating to see the conversion loss move.
        </p>
      </div>
    ),
    Visual: PowerFlowVisualizer,
  },
  {
    id: 'btu',
    title: 'Calculating Cooling Requirements',
    subtitle: '1W ≈ 3.412 BTU/hr',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The laws of thermodynamics are unforgiving: nearly all the electricity a server consumes is
          converted into heat. That heat must be removed from the server and the room to prevent
          components from overheating. The standard unit for measuring heat is the{' '}
          <strong className="text-white">British Thermal Unit (BTU)</strong>.
        </p>
        <p>The conversion from watts to BTUs per hour is straightforward:</p>
        <div className="rounded-lg bg-black/40 border border-gray-700 p-3 text-center font-serif italic text-slate-100">
          1W ≈ 3.412 BTU/hr
        </div>
        <p>Using the 2444W drawn from the wall, our server’s heat output is:</p>
        <div className="rounded-lg bg-black/40 border border-gray-700 p-3 text-center font-serif italic text-slate-100">
          2444W × 3.412 BTU/hr ≈ 8339 BTU/hr
        </div>
        <p>
          To put this in perspective, a small personal space heater produces about{' '}
          <strong className="text-white">5,000 BTU/hr</strong>. Our single AI server generates
          significantly more heat than that.
        </p>
        <p>
          A standard office HVAC system is not designed to handle this kind of concentrated heat
          load. Placing such a server in a small, unventilated room will quickly raise the ambient
          temperature to levels that cause hardware to{' '}
          <strong className="text-brand-rose">throttle its performance or shut down
          entirely</strong>.
        </p>
        <p className="text-xs text-gray-400 italic">
          Slide the wall draw and the recommended AC size updates with it.
        </p>
      </div>
    ),
    Visual: BtuVisualizer,
  },
  {
    id: 'server_cooling',
    title: 'Cooling Strategies: Server Level',
    subtitle: 'Front-to-back airflow, measured in CFM',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Effective cooling requires a two-level approach: managing airflow{' '}
          <strong className="text-white">inside the server</strong>, and managing the temperature of
          the <strong className="text-white">room</strong> itself. This slide covers the first.
        </p>
        <p>
          Server chassis are engineered for specific airflow patterns, usually{' '}
          <strong className="text-white">front-to-back</strong>. Cool air is drawn in from the front,
          passes over the components, and the hot exhaust is expelled out the back.
        </p>
        <p>
          It is important <strong className="text-brand-rose">not to obstruct these vents</strong>. A
          blocked intake collapses the airflow no matter how hard the fans work, and the components
          heat up until they throttle.
        </p>
        <p>
          High-power servers use high-speed, high-pressure fans measured in{' '}
          <strong className="text-white">Cubic Feet per Minute (CFM)</strong>. These are much louder
          than those in a desktop PC — loud enough that a rack of them is genuinely unpleasant to sit
          next to, which is part of why they belong in a dedicated room.
        </p>
        <p className="text-xs text-gray-400 italic">
          Push the fans up, then block the intake and watch the temperature ignore them.
        </p>
      </div>
    ),
    Visual: ServerAirflowVisualizer,
  },
  {
    id: 'room_cooling',
    title: 'Cooling Strategies: Room Level',
    subtitle: 'Hot aisle, cold aisle',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A dedicated, portable AC unit or a <strong className="text-white">mini-split</strong> system
          is often necessary for even a single AI server. The cooling capacity of these units is
          rated in BTU/hr. For our 8339 BTU/hr server, you would need an air conditioner rated for at
          least <strong className="text-brand-green">10,000 BTU/hr</strong> to provide a safe margin.
        </p>
        <p>
          For multiple servers in a rack, data center best practices become relevant. The{' '}
          <strong className="text-white">hot aisle / cold aisle</strong> layout is a simple and
          effective strategy.
        </p>
        <p>
          Racks are arranged in rows where all server fronts (air intakes) face one aisle — the{' '}
          <span className="text-cyan-400 font-semibold">cold aisle</span> — and all server backs (hot
          exhausts) face the other, the{' '}
          <span className="text-orange-400 font-semibold">hot aisle</span>. This prevents servers from
          drawing in hot exhaust air from their neighbours, dramatically improving cooling
          efficiency.
        </p>
        <p>
          Get this wrong and each row inhales the row in front of it, compounding the intake
          temperature down the room until the machines at the far end throttle permanently.
        </p>
        <p>
          Ultimately, power and cooling are foundational to your on-premise infrastructure. They are
          not just operational details but{' '}
          <strong className="text-white">core design requirements</strong> that directly impact
          performance, reliability, and the total cost of ownership of your system.
        </p>
        <p className="text-xs text-gray-400 italic">
          Flip the rack orientation and compare Row 2’s intake temperature.
        </p>
      </div>
    ),
    Visual: HotColdAisleVisualizer,
  },
];

export default function DesigningOnPremiseAIPart3() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-cyan to-brand-rose" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-brand-cyan font-bold tracking-wider text-xs uppercase mb-1 block">
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
