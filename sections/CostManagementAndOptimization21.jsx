import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  ChapterMapVisualizer,
  TcoEquationVisualizer,
  CapexBlueprintVisualizer,
  OpexTreeVisualizer,
  TcoCalculatorVisualizer,
  BaselineHourVisualizer,
  OnDemandVisualizer,
  ReservedVisualizer,
  SpotVisualizer,
  PricingDecisionVisualizer,
  RelativeCostVisualizer,
} from '../components/CostManagementPart1Visualizers';

export const meta = {
  title: 'Cost Management and Optimization (Part 1)',
  subtitle: 'On-premise TCO and cloud pricing models — quantify before you compare',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'intro',
    title: 'Chapter 6: Cost Management and Optimization',
    subtitle: 'After you can build it — can you afford to run it?',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Designing and deploying AI infrastructure is only half the battle. The next operational challenge
          is managing the ongoing costs of the compute resources that power your models.
        </p>
        <p>
          GPUs are a significant and continuous expense. Without a clear strategy, costs can quickly
          escalate and become unsustainable.
        </p>
        <p>
          This chapter provides a systematic approach to financial governance for AI infrastructure. You
          will learn to quantify, monitor, and optimize spending across both on-premise and cloud
          environments.
        </p>
        <p className="font-bold text-white pt-1">We will cover:</p>
        <ol className="list-decimal pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-white">On-Premise TCO</strong> — CapEx + OpEx over the hardware lifespan
          </li>
          <li>
            <strong className="text-white">Cloud Pricing Models</strong> — On-Demand, Reserved, Spot
          </li>
          <li>
            <strong className="text-teal-300">Cost Reduction</strong> — right-sizing, auto-scaling (Part 2)
          </li>
          <li>
            <strong className="text-teal-300">Monitoring &amp; Alerting</strong> — budgets and thresholds
            (Part 2)
          </li>
        </ol>
        <p className="text-xs text-gray-400 italic">
          Right: tap each topic. This part builds the first two in depth.
        </p>
      </div>
    ),
    Visual: ChapterMapVisualizer,
  },
  {
    id: 'tco-eq',
    title: 'Analyzing On-Premise Total Cost of Ownership',
    subtitle: 'TCO = CapEx + OpEx',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          When evaluating the cost of building an on-premise AI cluster, a common but costly mistake is to
          look only at the purchase price of the hardware.
        </p>
        <p>
          A proper analysis requires calculating the{' '}
          <strong className="text-teal-300">Total Cost of Ownership (TCO)</strong> — a complete financial
          picture that accounts for every expense incurred over the entire operational lifespan of the
          hardware.
        </p>
        <p>
          Understanding TCO is fundamental for making informed decisions when comparing the long-term costs
          of an on-premise build versus using cloud services.
        </p>
        <p className="rounded-lg border border-teal-400/40 bg-teal-500/10 px-3 py-2 font-mono text-xs text-teal-200 text-center">
          TCO = Capital Expenses (CapEx) + Operational Expenses (OpEx)
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: reveal CapEx, then OpEx, and watch the sticker price become one-third of the real cost.
        </p>
      </div>
    ),
    Visual: TcoEquationVisualizer,
  },
  {
    id: 'capex',
    title: 'Capital Expenses (CapEx)',
    subtitle: 'The one-time costs to acquire and set up',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          CapEx represents the initial, upfront investment required to purchase and install the physical
          infrastructure. These are typically one-time costs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Compute Hardware:</strong> The largest component — servers,
            CPUs, and especially GPUs or other accelerators.
          </li>
          <li>
            <strong className="text-white">Networking Equipment:</strong> High-speed switches (e.g. 100GbE
            InfiniBand), routers, NICs, and cabling. A significant factor for distributed training.
          </li>
          <li>
            <strong className="text-white">Storage Systems:</strong> Local NVMe SSDs for caching, plus
            centralized NAS or SAN.
          </li>
          <li>
            <strong className="text-white">Data Center Infrastructure:</strong> Racks, PDUs, and colo
            setup fees.
          </li>
          <li>
            <strong className="text-white">Initial Software Licenses:</strong> One-time perpetual licenses
            for OS, virtualization, or management tools.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Right: tap components in the rack blueprint to see what each CapEx line covers.
        </p>
      </div>
    ),
    Visual: CapexBlueprintVisualizer,
  },
  {
    id: 'opex',
    title: 'Operational Expenses (OpEx)',
    subtitle: 'The recurring costs that often exceed CapEx',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          OpEx includes all the recurring costs associated with running and maintaining the infrastructure
          day-to-day. Over the lifespan of the hardware, these costs can easily exceed the initial capital
          investment.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Power and Cooling:</strong> High-end GPUs are extremely
            power-hungry — electricity for the chips plus HVAC to remove the heat.
          </li>
          <li>
            <strong className="text-white">Data Center Space:</strong> Colocation fees, or facility
            maintenance, security and taxes.
          </li>
          <li>
            <strong className="text-white">Personnel Costs:</strong> Engineers for setup, networking,
            administration and troubleshooting.
          </li>
          <li>
            <strong className="text-white">Maintenance and Support:</strong> Extended warranties and vendor
            support contracts.
          </li>
          <li>
            <strong className="text-white">Software Subscriptions:</strong> Monitoring, schedulers, MLOps
            tools on recurring plans.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Right: interactive TCO tree — focus CapEx or OpEx — then browse each OpEx category.
        </p>
      </div>
    ),
    Visual: OpexTreeVisualizer,
  },
  {
    id: 'calc',
    title: 'TCO Calculation Example',
    subtitle: '1 server · 4 GPUs · 3-year lifespan',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>Let&apos;s model a small on-premise setup over a three-year lifespan.</p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-white">Total CapEx:</strong> $30,000 for the server, GPUs, networking
            and racks.
          </li>
          <li>
            <strong className="text-white">Annualized hardware:</strong> $30,000 ÷ 3 ={' '}
            <span className="font-mono text-teal-300">$10,000 / year</span>
          </li>
          <li>
            <strong className="text-white">Power &amp; Cooling:</strong> ~$3,000 / year (2 kW at
            $0.12/kWh, 24/7, +40% for cooling)
          </li>
          <li>
            <strong className="text-white">Personnel:</strong> ~$15,000 / year (10% of a $150k loaded
            engineer)
          </li>
          <li>
            <strong className="text-white">Maintenance &amp; Space:</strong> $2,000 / year
          </li>
        </ul>
        <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs">
          Total annual cost ≈ <strong className="text-white">$30,000</strong>. Three-year TCO ≈{' '}
          <strong className="text-white">$90,000</strong>. The initial $30k hardware is only one-third of
          the lifetime cost.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: stacked annual bars — change the lifespan, toggle personnel on/off.
        </p>
      </div>
    ),
    Visual: TcoCalculatorVisualizer,
  },
  {
    id: 'baseline',
    title: 'The Baseline for Cloud Comparison',
    subtitle: '$30,000 / year ≈ $3.42 / hour at 24/7',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          This TCO analysis is the foundation for effective financial planning. By calculating a total cost
          per year ($30,000) or even per hour ($3.42, assuming 24/7 operation), you create a clear baseline.
        </p>
        <p>
          That baseline is what you use in the next sections to make a direct and informed comparison with
          the pricing models offered by cloud providers.
        </p>
        <p className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs">
          Without it, you are comparing the full on-premise investment against a single cloud bill — which
          is not an accurate comparison.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: adjust daily utilization and a mock On-Demand rate — see which side wins, and by how much.
        </p>
      </div>
    ),
    Visual: BaselineHourVisualizer,
  },
  {
    id: 'ondemand',
    title: 'Understanding Cloud Pricing Models',
    subtitle: 'On-Demand Instances — flexibility at a premium',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Unlike on-premise infrastructure with high upfront capital and predictable OpEx, cloud
          infrastructure from AWS, GCP and Azure is predominantly a pay-as-you-go model. The art is matching
          a workload&apos;s predictability, duration and interruption tolerance to the right pricing model.
        </p>
        <p className="font-bold text-white">On-Demand Instances</p>
        <p>
          The most straightforward model: request a VM, pay a fixed rate per hour or second only while it
          runs. No long-term commitment, no upfront payment.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-emerald-300">Best for:</strong> unpredictable or short-term work —
            debugging, prototyping, quick tests.
          </li>
          <li>
            <strong className="text-rose-300">Drawback:</strong> highest per-hour cost; inefficient for
            long-running stable loads; a common source of budget overruns.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Right: start a mock g5.xlarge, advance the clock hour by hour, watch the bill climb.
        </p>
      </div>
    ),
    Visual: OnDemandVisualizer,
  },
  {
    id: 'reserved',
    title: 'Reserved Instances & Savings Plans',
    subtitle: 'Commit for discount — lock in for years',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          For predictable, long-term usage, providers offer significant discounts — often up to 75% — in
          exchange for a commitment.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Reserved Instances:</strong> commit to a specific instance type
            in a specific region for a 1- or 3-year term. Deepest discounts when hardware needs are certain.
          </li>
          <li>
            <strong className="text-white">Savings Plans:</strong> commit to a dollar amount of compute per
            hour (e.g. $10/hr) for 1 or 3 years. Change instance families freely; keep the discount.
          </li>
        </ul>
        <p>
          <strong className="text-emerald-300">Best for:</strong> stable production — a 24/7 inference API,
          a core training fleet.
        </p>
        <p>
          <strong className="text-rose-300">Drawback:</strong> lock-in. You pay for the commitment whether
          you use it or not. Requires careful capacity planning.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: pick RI vs Savings Plan, 1- vs 3-year term, then toggle idle to see the lock-in cost.
        </p>
      </div>
    ),
    Visual: ReservedVisualizer,
  },
  {
    id: 'spot',
    title: 'Spot Instances & Preemptible VMs',
    subtitle: 'Deepest discount — design for interruption',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Spot Instances (AWS) or Preemptible VMs (GCP) let you bid on a provider&apos;s spare capacity,
          often at a discount of up to 90% off On-Demand.
        </p>
        <p>
          The catch: the provider can reclaim the instance at any time with very little warning — typically
          a two-minute notification.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>
            <strong className="text-emerald-300">Best for:</strong> fault-tolerant, interruptible work —
            large training jobs with checkpointing, batch inference, data pipelines.
          </li>
          <li>
            <strong className="text-rose-300">Drawback:</strong> volatility. Unsuitable for production
            user-facing APIs where downtime is unacceptable.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Right: walk a Spot job from cheap capacity through reclaim to checkpoint resume.
        </p>
      </div>
    ),
    Visual: SpotVisualizer,
  },
  {
    id: 'decide',
    title: 'Choosing the Right Model',
    subtitle: 'Two questions decide the pricing tier',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The cost difference between these models is not trivial. For GPU-intensive workloads, the right
          choice can mean the difference between a financially viable project and an abandoned one.
        </p>
        <p>A simple decision path:</p>
        <ol className="list-decimal pl-5 space-y-2 text-xs">
          <li>
            Is the workload <strong className="text-white">interruptible and fault-tolerant</strong>? →
            Spot / Preemptible.
          </li>
          <li>
            If not: is it <strong className="text-white">long-running and predictable</strong>? → Reserved
            or Savings Plans.
          </li>
          <li>Otherwise → On-Demand.</li>
        </ol>
        <p>
          Most effective strategies are hybrid: Reserved for baseline inference, Spot for large training,
          On-Demand for developer experiments.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: answer the two questions and get a recommendation — then see the relative cost chart and
          build a hybrid mix.
        </p>
      </div>
    ),
    Visual: PricingDecisionVisualizer,
  },
  {
    id: 'hybrid',
    title: 'Relative Cost & Hybrid Strategy',
    subtitle: '100% · 55% · 18% — then blend them',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Relative to On-Demand at 100%: a 1-year Savings Plan might sit around 55%, while Spot can drop to
          roughly 18% of the original price.
        </p>
        <p>
          Ultimately the most effective strategies involve a hybrid approach. You might:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>Cover baseline production inference with Reserved Instances</li>
          <li>Run large-scale training on a cluster of Spot Instances</li>
          <li>Let developers experiment with new models on On-Demand</li>
        </ul>
        <p>
          By actively analyzing usage patterns and mapping them to these pricing models, you maintain
          performance while keeping the cloud bill under control.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: compare the three bars, then dial a hybrid mix and watch the blended savings.
        </p>
      </div>
    ),
    Visual: RelativeCostVisualizer,
  },
];

export default function CostManagementAndOptimizationPart1() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-teal-400 font-bold tracking-wider text-xs uppercase mb-1 block">
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
                i === currentSlide ? 'w-8 bg-teal-500' : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
          className="p-3 rounded-full bg-teal-600 text-white hover:bg-teal-500 shadow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
