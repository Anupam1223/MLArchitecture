import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  CostReductionMapVisualizer,
  SpotTrainingVisualizer,
  CheckpointFrequencyVisualizer,
  AutoScaleVisualizer,
  ScheduleIdleVisualizer,
  StorageTiersVisualizer,
  EgressVisualizer,
  DataStrategiesVisualizer,
  CostVisibilityVisualizer,
  TaggingVisualizer,
  BudgetAlertVisualizer,
  PlaybookVisualizer,
} from '../components/CostManagementPart2Visualizers';

export const meta = {
  title: 'Cost Management and Optimization (Part 2)',
  subtitle: 'Reduce compute waste, tame storage & egress, and put budgets on a leash',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'intro',
    title: 'Strategies for Reducing Cloud Compute Costs',
    subtitle: 'Beyond picking a pricing model',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Choosing On-Demand, Reserved or Spot sets the rate. Active resource management is what actually
          cuts the bill — without slowing model development or deployment.
        </p>
        <p className="font-bold text-white pt-1">This part covers:</p>
        <ol className="list-decimal pl-5 space-y-1.5 text-xs">
          <li>Spot instances for fault-tolerant training (checkpoint · resume · fleet)</li>
          <li>Auto-scaling for inference endpoints</li>
          <li>Scheduling and shutting down idle non-prod resources</li>
          <li>Storage tiers, egress fees, and data-cost tactics</li>
          <li>Monitoring, tagging, budgets and alerts</li>
        </ol>
        <p className="text-xs text-gray-400 italic">Right: tap each strategy in the map.</p>
      </div>
    ),
    Visual: CostReductionMapVisualizer,
  },
  {
    id: 'spot',
    title: 'Leverage Spot for Fault-Tolerant Training',
    subtitle: 'Up to 90% off — if the job can die and restart',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Cloud providers sell unused capacity as Spot Instances (AWS), Spot VMs (GCP) or Spot Virtual
          Machines (Azure) at discounts up to 90% off On-Demand. The catch: capacity can be reclaimed with
          roughly a two-minute warning — so they are unsuitable for production inference that cannot
          tolerate interruption.
        </p>
        <p>
          Long, iterative training jobs are a natural fit. To use Spot effectively you must build
          resilience into the training process:
        </p>
        <ol className="list-decimal pl-5 space-y-2.5 text-xs">
          <li>
            <strong className="text-white">Implement Checkpointing:</strong> periodically save state —
            not just model weights, but also the optimizer&apos;s state, the current epoch number, and
            the data loader&apos;s position. PyTorch and TensorFlow both have utilities for this.
          </li>
          <li>
            <strong className="text-white">Create Resume-from-Checkpoint Logic:</strong> on startup,
            detect whether a checkpoint exists. If it does, load the state and continue from that point
            instead of starting from scratch.
          </li>
          <li>
            <strong className="text-white">Use Managed Spot Services:</strong> instead of a single Spot
            instance, use an AWS Spot Fleet or an auto-scaling group configured for Spot. These
            automatically request new instances from different capacity pools when yours are reclaimed,
            increasing workload stability.
          </li>
        </ol>
        <p className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs">
          <strong className="text-amber-300">Checkpointing frequency:</strong> save too often and I/O
          slows training; save too rarely and a preemption loses more work. A common strategy is every
          epoch — or every N batches when epochs are very long.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: three tabs — the reclaim loop, the three requirements in detail, and the frequency
          trade-off.
        </p>
      </div>
    ),
    Visual: SpotTrainingVisualizer,
  },
  {
    id: 'ckpt-freq',
    title: 'Checkpointing Frequency',
    subtitle: 'I/O overhead vs. work lost on reclaim',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>How often you save is a real trade-off:</p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Too frequent</strong> — I/O overhead slows every training step.
          </li>
          <li>
            <strong className="text-white">Too infrequent</strong> — a preemption throws away more finished
            work.
          </li>
        </ul>
        <p>
          A common strategy is to checkpoint at the end of every epoch, or every N batches when epochs
          themselves are very long. By making jobs resumable you unlock Spot&apos;s discount for
          experimentation and development.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: drag N and watch work-lost hours climb while I/O overhead falls.
        </p>
      </div>
    ),
    Visual: CheckpointFrequencyVisualizer,
  },
  {
    id: 'autoscale',
    title: 'Implement Auto-Scaling for Inference Endpoints',
    subtitle: 'Stop paying for peak load at 3 AM',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          For model inference, the need for compute fluctuates with user traffic — high during business
          hours, low overnight. A common and expensive mistake is to provision for peak load 24/7, leaving
          expensive GPU instances idle most of the time.
        </p>
        <p>
          <strong className="text-white">Auto-scaling</strong> solves this. An auto-scaling group
          automatically adjusts the number of compute instances in a pool based on real-time demand,
          according to rules you define.
        </p>
        <p className="font-bold text-white pt-0.5">How it works in an ML inference context:</p>
        <ol className="list-decimal pl-5 space-y-2.5 text-xs">
          <li>
            <strong className="text-white">Define a Scaling Metric:</strong> choose a metric that reflects
            the load on your servers.
            <ul className="list-disc pl-4 mt-1.5 space-y-1 text-gray-400">
              <li>
                <span className="text-cyan-300">CPU Utilization</span> — a good general-purpose metric
              </li>
              <li>
                <span className="text-cyan-300">GPU Utilization</span> — highly effective for
                GPU-accelerated models
              </li>
              <li>
                <span className="text-cyan-300">Request Count Per Target</span> — based on the number of
                requests each instance is handling
              </li>
              <li>
                <span className="text-cyan-300">Queue Length</span> — useful if you buffer requests (e.g.
                with SQS)
              </li>
            </ul>
          </li>
          <li>
            <strong className="text-white">Set Thresholds:</strong> define a target value for the metric —
            for example, maintain average GPU utilization at 60%. If load rises above the target, the group{' '}
            <em>scales out</em> (adds an instance). If it falls below, the group <em>scales in</em>{' '}
            (removes an instance).
          </li>
          <li>
            <strong className="text-white">Establish Cooldown Periods:</strong> after a scaling action,
            a cooldown prevents another launch or terminate until the previous change has had time to take
            effect. This stops rapid, wasteful fluctuations known as <em>thrashing</em>.
          </li>
        </ol>
        <p>
          The result: you only pay for the compute capacity you actually need, matching expenses to
          application demand.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: pick a metric, drag load past the threshold, and watch scale-out / scale-in — with cooldown
          guarding against thrash.
        </p>
      </div>
    ),
    Visual: AutoScaleVisualizer,
  },
  {
    id: 'schedule',
    title: 'Schedule and Shut Down Idle Resources',
    subtitle: 'Dev boxes do not need nights and weekends',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          One of the most straightforward yet effective cost-saving measures is to simply turn off
          resources when they are not in use. Development, staging, and experimental environments rarely
          need to run 24/7. A GPU instance left running over a weekend can needlessly cost hundreds of
          dollars.
        </p>
        <p className="font-bold text-white">Implement a scheduling policy to automate this process:</p>
        <ul className="list-disc pl-5 space-y-2.5 text-xs">
          <li>
            <strong className="text-white">Tagging:</strong> First, establish a consistent tagging strategy
            for your resources. For example, a tag like{' '}
            <span className="font-mono text-cyan-300">environment:dev</span> or{' '}
            <span className="font-mono text-cyan-300">owner:data-scientist-x</span> can identify
            non-production resources that are candidates for shutdown.
          </li>
          <li>
            <strong className="text-white">Automation Tools:</strong> Use cloud-native services like the{' '}
            <strong className="text-white">AWS Instance Scheduler</strong>,{' '}
            <strong className="text-white">Azure Automation Runbooks</strong>, or simple cron jobs on a
            control machine to automatically stop instances based on a schedule (e.g., stop at 7 PM on
            weekdays, stop all day on weekends). The same tools can be configured to start them again
            before the workday begins.
          </li>
        </ul>
        <p>
          This strategy ensures that you only pay for development resources during productive hours,
          eliminating a common source of budget waste.
        </p>
        <p className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-xs leading-relaxed">
          These strategies are not mutually exclusive. A comprehensive cost-optimization plan often
          involves using <strong className="text-white">Spot Instances for training</strong>,{' '}
          <strong className="text-white">auto-scaling groups for production inference</strong>, and{' '}
          <strong className="text-white">aggressive scheduling for all non-production environments</strong>.
          This transforms cost management from a reactive exercise into a proactive, automated part of your
          MLOps practice.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: toggle scheduling and watch the hourly cost chart drop to zero outside 8 AM–7 PM.
        </p>
      </div>
    ),
    Visual: ScheduleIdleVisualizer,
  },
  {
    id: 'storage',
    title: 'Managing Data Storage Costs',
    subtitle: 'Breaking down cloud storage — Hot · IA · Archive',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          GPU compute dominates attention, but storing and moving petabyte-scale datasets — especially
          across regions — creates significant hidden cost. Cloud storage pricing is not a single flat
          fee. It is a composite of several factors; the two primary components are{' '}
          <strong className="text-white">storage at rest</strong> and{' '}
          <strong className="text-white">data access operations</strong>.
        </p>
        <p className="font-bold text-white">Storage Tiers: Balancing Cost and Access Speed</p>
        <p className="text-xs">
          Cloud providers offer a tiered storage model so you can match access frequency to cost.
          Storing data you rarely touch in a high-performance, expensive tier is a common and costly
          mistake. Most providers offer a similar hierarchy:
        </p>
        <ul className="list-disc pl-5 space-y-2.5 text-xs">
          <li>
            <strong className="text-white">Standard (Hot) Storage:</strong> The default, high-performance
            tier for frequently accessed data. Highest per-gigabyte storage cost, lowest latency, and no
            fees for data retrieval. Use it for active training datasets, model checkpoints you are
            currently working with, and any data that requires immediate access.
          </li>
          <li>
            <strong className="text-white">Infrequent Access (IA) Storage:</strong> Optimized for data
            accessed less often but that must still be available immediately when needed. Lower
            per-gigabyte storage cost than Standard, but you pay a small per-gigabyte fee every time you
            retrieve data. A good fit for older training sets, experiment artifacts, or models that are
            not in production but might be revisited.
          </li>
          <li>
            <strong className="text-white">Archive Storage:</strong> Designed for long-term retention and
            digital preservation — extremely low storage costs. The trade-off is retrieval time and cost:
            access is not immediate and can take anywhere from minutes to several hours. Ideal for
            regulatory compliance, backing up final model versions, or storing raw data you do not plan to
            use for months or years. Some providers offer even colder &quot;deep archive&quot; tiers with
            still lower costs and longer retrieval times.
          </li>
        </ul>
        <p>
          Choosing the right tier is a direct trade-off between how much you pay to store the data versus
          how quickly you can get it back.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: tap each tier on the cost-vs-retrieval-time chart.
        </p>
      </div>
    ),
    Visual: StorageTiersVisualizer,
  },
  {
    id: 'egress',
    title: 'The High Cost of Moving Data: Egress Fees',
    subtitle: 'Understanding ingress vs. egress',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          While cloud providers typically do not charge for data moving <em>into</em> their network
          (known as <strong className="text-emerald-300">ingress</strong>), they almost always charge for
          data moving <em>out</em> (known as <strong className="text-rose-300">egress</strong>). These
          egress fees are a common and often underestimated cost in AI workflows.
        </p>
        <p className="font-bold text-white">You incur egress fees in several common scenarios:</p>
        <ul className="list-disc pl-5 space-y-2.5 text-xs">
          <li>
            <strong className="text-white">Inter-Region Transfer:</strong> Moving data between different
            geographic regions, such as from{' '}
            <span className="font-mono text-rose-300">us-east-1</span> to{' '}
            <span className="font-mono text-rose-300">eu-west-1</span>.
          </li>
          <li>
            <strong className="text-white">Inter-Cloud Transfer:</strong> Sending data from one cloud
            provider to another, for example from AWS to GCP.
          </li>
          <li>
            <strong className="text-white">Cloud-to-On-Premise Transfer:</strong> Downloading large
            datasets or models from the cloud to your local or on-premise servers.
          </li>
          <li>
            <strong className="text-white">Serving Users:</strong> If you deploy a model as an API,
            every prediction you send back to a user over the public internet is data egress.
          </li>
        </ul>
        <p>
          These costs are calculated per gigabyte. While the price per GB may seem small, it can escalate
          rapidly when dealing with terabyte-scale datasets or high-traffic inference services.
        </p>
        <p className="rounded-lg border border-gray-700 bg-gray-900/60 px-3 py-2 text-xs text-gray-400 italic">
          Data transfers within the same cloud region are typically free, while transfers leaving the
          provider&apos;s regional network boundary incur egress fees.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: tap free (same-region) vs paid paths on the egress diagram.
        </p>
      </div>
    ),
    Visual: EgressVisualizer,
  },
  {
    id: 'data-strat',
    title: 'Strategies for Managing Data Costs',
    subtitle: 'Lifecycle · co-locate · compress',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>Be proactive instead of reacting to a surprise bill:</p>
        <ol className="list-decimal pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Lifecycle policies</strong> — auto-move{' '}
            <span className="font-mono">raw-training-data</span> Hot → IA (30d) → Archive (180d) → delete
            (3y).
          </li>
          <li>
            <strong className="text-white">Same region for compute and data</strong> — zero internal
            transfer cost; use a CDN for global static assets.
          </li>
          <li>
            <strong className="text-white">Compress and use columnar formats</strong> — Gzip/Zstd before
            upload; Parquet/Arrow so queries scan only needed columns.
          </li>
        </ol>
        <p className="text-xs text-gray-400 italic">
          Right: three tabs — age a dataset, flip regions, compare CSV vs Parquet scans.
        </p>
      </div>
    ),
    Visual: DataStrategiesVisualizer,
  },
  {
    id: 'visibility',
    title: 'Implementing Cost Monitoring and Alerting',
    subtitle: 'You cannot manage what you do not measure',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A forgotten GPU can empty a project budget. The goal is to leave reactive “bill shock” for a
          proactive, data-driven governance loop: see where money goes, attribute it, and get notified
          before it spirals.
        </p>
        <p className="font-bold text-white">Visibility tools</p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-white">AWS</strong> — Cost Explorer; CUR for hourly Athena queries
          </li>
          <li>
            <strong className="text-white">GCP</strong> — Cloud Billing reports by project / product /
            labels
          </li>
          <li>
            <strong className="text-white">Azure</strong> — Cost Management + Billing
          </li>
        </ul>
        <p>
          GPU compute usually dominates the breakdown — make it the primary optimization target.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: tap bars on a typical AI cost breakdown.
        </p>
      </div>
    ),
    Visual: CostVisibilityVisualizer,
  },
  {
    id: 'tags',
    title: 'Implementing Accountability Through Tagging',
    subtitle: 'What costs money → who owns it',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Visibility shows <em>what</em> is expensive. Accountability shows <em>who</em> or{' '}
          <em>which project</em> is responsible. Tags are key-value metadata on VMs, buckets and databases.
        </p>
        <p>Essential tags for an AI org:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs font-mono">
          <li>
            <span className="text-cyan-300">project</span>: fraud-detection-v2
          </li>
          <li>
            <span className="text-cyan-300">owner</span>: data-science-team
          </li>
          <li>
            <span className="text-cyan-300">environment</span>: development | staging | production
          </li>
          <li>
            <span className="text-cyan-300">experiment-id</span>: run-0842
          </li>
        </ul>
        <p>Tags flow into billing reports so you can allocate cost by project.</p>
        <p className="text-xs text-gray-400 italic">
          Right: step resources → tags → billing report → allocated costs.
        </p>
      </div>
    ),
    Visual: TaggingVisualizer,
  },
  {
    id: 'budgets',
    title: 'Establishing Control with Budgets and Alerts',
    subtitle: 'Dashboards are passive — budgets are active',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A <strong className="text-white">budget</strong> is a financial threshold for a scope (whole
          account, or tagged resources like{' '}
          <span className="font-mono text-cyan-300">project: big-llama</span>). An{' '}
          <strong className="text-white">alert</strong> fires when actual or forecasted spend crosses a
          percentage of that budget.
        </p>
        <p>Example — $10,000 / month experiment:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-sky-300">50%</strong> — Slack to the team (informational)
          </li>
          <li>
            <strong className="text-amber-300">80%</strong> — email the team lead to review
          </li>
          <li>
            <strong className="text-rose-300">100%</strong> — eng manager + finance (budget exhausted)
          </li>
        </ul>
        <p>
          Tiered alerts let you course-correct mid-cycle instead of discovering overruns on the final
          invoice.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: drag spend across the $10k budget and watch each alert tier light up.
        </p>
      </div>
    ),
    Visual: BudgetAlertVisualizer,
  },
  {
    id: 'playbook',
    title: 'Putting It All Together',
    subtitle: 'A proactive MLOps cost practice',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>These strategies are complementary, not exclusive:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-white">Training</strong> → Spot + checkpointing + fleets
          </li>
          <li>
            <strong className="text-white">Production inference</strong> → auto-scaling groups
          </li>
          <li>
            <strong className="text-white">Non-production</strong> → aggressive scheduling
          </li>
          <li>
            <strong className="text-white">Data</strong> → tiers, lifecycle, co-location, Parquet
          </li>
          <li>
            <strong className="text-white">Governance</strong> → tags, budgets, alerts
          </li>
        </ul>
        <p>
          Stacked together, cost management becomes a continuous loop — deploy with tags, monitor,
          alert, optimize — not a quarterly surprise.
        </p>
        <p className="text-xs text-gray-400 italic">Right: tap each layer of the playbook.</p>
      </div>
    ),
    Visual: PlaybookVisualizer,
  },
];

export default function CostManagementAndOptimizationPart2() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-cyan-400 font-bold tracking-wider text-xs uppercase mb-1 block">
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
                i === currentSlide ? 'w-8 bg-cyan-500' : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
          className="p-3 rounded-full bg-cyan-600 text-white hover:bg-cyan-500 shadow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
