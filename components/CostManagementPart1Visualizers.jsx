import React, { useState } from 'react';
import {
  Server,
  Network,
  HardDrive,
  Building2,
  KeyRound,
  Zap,
  Users,
  Wrench,
  CreditCard,
  DollarSign,
  AlertTriangle,
  Check,
  X,
  Flame,
} from 'lucide-react';

/* ── shared helpers ───────────────────────────────────────────────────────── */

function Tabs({ options, value, onChange }) {
  return (
    <div className="flex justify-center gap-2 mb-3 flex-wrap">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            value === o.id ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Nav({ step, max, onBack, onNext, onReset }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-3">
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300"
        >
          Reset
        </button>
      )}
      <button
        type="button"
        disabled={step === 0}
        onClick={onBack}
        className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 disabled:opacity-30"
      >
        ← Back
      </button>
      <span className="text-[11px] text-gray-500 font-mono">
        {step + 1} / {max + 1}
      </span>
      <button
        type="button"
        disabled={step === max}
        onClick={onNext}
        className="px-4 py-1.5 rounded-lg bg-teal-600 text-xs font-bold text-white disabled:opacity-30"
      >
        Next →
      </button>
    </div>
  );
}

function NoteBox({ children, tone = 'teal' }) {
  const map = {
    teal: 'border-teal-400/40 bg-teal-500/10',
    amber: 'border-amber-400/40 bg-amber-500/10',
    rose: 'border-rose-400/40 bg-rose-500/10',
    emerald: 'border-emerald-400/40 bg-emerald-500/10',
    sky: 'border-sky-400/40 bg-sky-500/10',
    violet: 'border-violet-400/40 bg-violet-500/10',
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm text-gray-200 leading-relaxed ${map[tone]}`}>
      {children}
    </div>
  );
}

function money(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

/* ── 1. Chapter map ───────────────────────────────────────────────────────── */

const TOPICS = [
  {
    id: 'tco',
    n: '01',
    title: 'On-Premise TCO',
    formula: 'TCO = CapEx + OpEx',
    what: 'Every dollar that hardware costs over its full life — not just the purchase price.',
    color: 'border-sky-400 bg-sky-500/15',
  },
  {
    id: 'cloud',
    n: '02',
    title: 'Cloud Pricing Models',
    formula: 'On-Demand · Reserved · Spot',
    what: 'Three ways to rent the same GPU, at three very different prices and risk levels.',
    color: 'border-amber-400 bg-amber-500/15',
  },
  {
    id: 'reduce',
    n: '03',
    title: 'Cost Reduction',
    formula: 'Right-size · Auto-scale · Storage',
    what: 'Practical levers that cut spend without cutting capability — covered in Part 2.',
    color: 'border-emerald-400 bg-emerald-500/15',
  },
  {
    id: 'monitor',
    n: '04',
    title: 'Monitoring & Alerts',
    formula: 'Budgets · Thresholds · Alerts',
    what: 'Catch overruns before the invoice arrives — also covered in Part 2.',
    color: 'border-violet-400 bg-violet-500/15',
  },
];

export function ChapterMapVisualizer() {
  const [sel, setSel] = useState('tco');
  const cur = TOPICS.find((t) => t.id === sel);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Cost Management and Optimization</h3>
        <p className="text-gray-400 text-sm">Four topics. This part covers the first two in depth.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSel(t.id)}
            className={`rounded-2xl border-2 p-3 text-left transition ${
              sel === t.id ? t.color : 'border-gray-700 bg-gray-900/60 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="text-[10px] font-mono text-gray-500 mb-1">{t.n}</div>
            <div className="text-sm font-bold text-white">{t.title}</div>
            <div className="text-[10px] font-mono text-teal-300 mt-1">{t.formula}</div>
          </button>
        ))}
      </div>

      <NoteBox tone={sel === 'tco' || sel === 'cloud' ? 'teal' : 'amber'}>
        <strong className="text-white">{cur.title}.</strong> {cur.what}
        {(sel === 'reduce' || sel === 'monitor') && (
          <span className="block mt-1 text-amber-300 text-xs">
            Coming in Part 2 — this slider builds the foundation first.
          </span>
        )}
      </NoteBox>

      <div className="mt-4 rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">The problem this chapter solves</div>
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-center">
            <Flame className="w-5 h-5 mx-auto text-rose-300 mb-1" />
            <div className="text-[11px] font-bold text-white">GPUs burn money</div>
            <div className="text-[9px] text-gray-400 mt-0.5">whether you own or rent them</div>
          </div>
          <span className="text-gray-600 text-lg">→</span>
          <div className="flex-1 rounded-xl border border-teal-400/40 bg-teal-500/10 p-3 text-center">
            <DollarSign className="w-5 h-5 mx-auto text-teal-300 mb-1" />
            <div className="text-[11px] font-bold text-white">Quantify · Monitor · Optimize</div>
            <div className="text-[9px] text-gray-400 mt-0.5">on-prem and cloud alike</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 2. TCO equation ──────────────────────────────────────────────────────── */

export function TcoEquationVisualizer() {
  const [reveal, setReveal] = useState(0); // 0 = sticker price only, 1 = +CapEx, 2 = +OpEx

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The costly mistake</h3>
        <p className="text-gray-400 text-sm">Looking only at the purchase price.</p>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
        <div className="text-center mb-4">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">What people often compare</div>
          <div
            className={`inline-block rounded-2xl border-2 px-6 py-4 transition ${
              reveal === 0 ? 'border-rose-400 bg-rose-500/15' : 'border-gray-700 bg-gray-900/40 opacity-50'
            }`}
          >
            <div className="text-xs text-gray-400">Hardware sticker price</div>
            <div className="text-3xl font-bold text-white font-mono">$30,000</div>
          </div>
        </div>

        <div className="text-center text-gray-600 text-sm mb-3">versus the real picture</div>

        <div className="flex items-stretch justify-center gap-2">
          <div
            className={`flex-1 rounded-2xl border-2 p-3 text-center transition ${
              reveal >= 1 ? 'border-sky-400 bg-sky-500/15' : 'border-gray-700 bg-gray-900/40 opacity-40'
            }`}
          >
            <div className="text-[10px] uppercase text-sky-300 mb-1">CapEx</div>
            <div className="text-xl font-bold text-white font-mono">{reveal >= 1 ? '$30k' : '?'}</div>
            <div className="text-[9px] text-gray-500 mt-1">one-time buy</div>
          </div>
          <div className="self-center text-2xl text-gray-600 font-bold">+</div>
          <div
            className={`flex-1 rounded-2xl border-2 p-3 text-center transition ${
              reveal >= 2 ? 'border-rose-400 bg-rose-500/15' : 'border-gray-700 bg-gray-900/40 opacity-40'
            }`}
          >
            <div className="text-[10px] uppercase text-rose-300 mb-1">OpEx</div>
            <div className="text-xl font-bold text-white font-mono">{reveal >= 2 ? '$60k' : '?'}</div>
            <div className="text-[9px] text-gray-500 mt-1">over 3 years</div>
          </div>
          <div className="self-center text-2xl text-gray-600 font-bold">=</div>
          <div
            className={`flex-1 rounded-2xl border-2 p-3 text-center transition ${
              reveal >= 2 ? 'border-teal-400 bg-teal-500/20' : 'border-gray-700 bg-gray-900/40 opacity-40'
            }`}
          >
            <div className="text-[10px] uppercase text-teal-300 mb-1">TCO</div>
            <div className="text-xl font-bold text-white font-mono">{reveal >= 2 ? '$90k' : '?'}</div>
            <div className="text-[9px] text-gray-500 mt-1">full lifespan</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-3">
        {[
          { n: 0, label: 'Sticker only' },
          { n: 1, label: 'Reveal CapEx' },
          { n: 2, label: 'Reveal OpEx' },
        ].map((b) => (
          <button
            key={b.n}
            type="button"
            onClick={() => setReveal(b.n)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              reveal === b.n ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <NoteBox tone={reveal === 2 ? 'teal' : reveal === 1 ? 'sky' : 'rose'}>
        {reveal === 0 && (
          <>
            <strong className="text-white">$30,000 looks like the cost.</strong> Comparing that to a cloud
            bill is how teams make bad build-vs-buy decisions. Reveal the rest.
          </>
        )}
        {reveal === 1 && (
          <>
            CapEx is the one-time outlay — servers, GPUs, networking, racks. Still only part of the story.
            Over three years the recurring side often dominates.
          </>
        )}
        {reveal === 2 && (
          <>
            <strong className="text-white">
              TCO = CapEx + OpEx. The sticker was only one-third of the real cost.
            </strong>{' '}
            That $90,000 over three years — or $30,000/year — is the number you compare against cloud
            pricing. Without it, the comparison is meaningless.
          </>
        )}
      </NoteBox>
    </div>
  );
}

/* ── 3. CapEx blueprint ───────────────────────────────────────────────────── */

const CAPEX = [
  {
    id: 'compute',
    icon: Server,
    title: 'Compute Hardware',
    share: 55,
    body: 'The largest component: servers, CPUs, and especially GPUs or other accelerators. For AI workloads this often dwarfs everything else.',
  },
  {
    id: 'net',
    icon: Network,
    title: 'Networking Equipment',
    share: 18,
    body: 'High-speed switches (100GbE, InfiniBand), routers, NICs, and cabling. A significant performance and cost factor for distributed training.',
  },
  {
    id: 'storage',
    icon: HardDrive,
    title: 'Storage Systems',
    share: 12,
    body: 'High-performance local NVMe SSDs for caching, plus centralized NAS or SAN for shared datasets.',
  },
  {
    id: 'dc',
    icon: Building2,
    title: 'Data Center Infrastructure',
    share: 10,
    body: 'Server racks, Power Distribution Units (PDUs), and initial setup fees for a colocation facility.',
  },
  {
    id: 'soft',
    icon: KeyRound,
    title: 'Initial Software Licenses',
    share: 5,
    body: 'One-time perpetual licenses for OS, virtualization (e.g. VMware vSphere), or infrastructure management tools.',
  },
];

export function CapexBlueprintVisualizer() {
  const [sel, setSel] = useState('compute');
  const cur = CAPEX.find((c) => c.id === sel);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Capital Expenses (CapEx)</h3>
        <p className="text-gray-400 text-sm">One-time costs to acquire and set up the infrastructure.</p>
      </div>

      {/* rack blueprint */}
      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-3 text-center">
          Tap a component in the rack
        </div>
        <div className="flex gap-3 items-stretch justify-center">
          {/* rack silhouette */}
          <div className="w-40 rounded-xl border-2 border-gray-600 bg-gray-900/80 p-2 flex flex-col gap-1.5">
            {[
              { id: 'compute', h: 'h-16', label: 'GPU servers' },
              { id: 'storage', h: 'h-8', label: 'NVMe / NAS' },
              { id: 'net', h: 'h-7', label: 'ToR switch' },
              { id: 'dc', h: 'h-6', label: 'PDU / rails' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSel(r.id)}
                className={`${r.h} rounded-md border-2 text-[9px] font-bold transition flex items-center justify-center ${
                  sel === r.id
                    ? 'border-sky-400 bg-sky-500/30 text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-500 hover:border-gray-500'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* list */}
          <div className="flex-1 space-y-1.5 max-w-sm">
            {CAPEX.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSel(c.id)}
                  className={`w-full flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition ${
                    sel === c.id
                      ? 'border-sky-400 bg-sky-500/20'
                      : 'border-gray-700 bg-gray-900/60 hover:border-gray-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${sel === c.id ? 'text-sky-300' : 'text-gray-500'}`} />
                  <span className="text-[11px] font-bold text-white flex-1">{c.title}</span>
                  <span className="text-[10px] font-mono text-gray-400">{c.share}%</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* share bar */}
        <div className="flex h-4 rounded-lg overflow-hidden mt-4 border border-gray-700">
          {CAPEX.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSel(c.id)}
              className={`h-full transition ${
                sel === c.id ? 'bg-sky-400' : 'bg-sky-800/60 hover:bg-sky-700'
              }`}
              style={{ width: `${c.share}%` }}
              title={c.title}
            />
          ))}
        </div>
      </div>

      <NoteBox tone="sky">
        <strong className="text-white">{cur.title}.</strong> {cur.body}
      </NoteBox>
    </div>
  );
}

/* ── 4. OpEx + TCO tree ───────────────────────────────────────────────────── */

const OPEX = [
  {
    id: 'power',
    icon: Zap,
    title: 'Power and Cooling',
    body: 'High-end GPUs are extremely power-hungry. Electricity for the GPUs themselves plus HVAC to dissipate the heat — often 40% on top of the compute power bill.',
  },
  {
    id: 'space',
    icon: Building2,
    title: 'Data Center Space',
    body: 'Monthly or annual colocation fees, or the maintenance, security and taxes of owning a facility.',
  },
  {
    id: 'people',
    icon: Users,
    title: 'Personnel Costs',
    body: 'Salaries for engineers who set up, network, administer and troubleshoot the cluster. Often the single largest OpEx line.',
  },
  {
    id: 'maint',
    icon: Wrench,
    title: 'Maintenance & Support',
    body: 'Extended warranties and support contracts from vendors like NVIDIA or Dell so failed hardware gets replaced quickly.',
  },
  {
    id: 'subs',
    icon: CreditCard,
    title: 'Software Subscriptions',
    body: 'Recurring fees for monitoring platforms, schedulers, or MLOps tools that run on subscription models.',
  },
];

const TREE_CAPEX = [
  { id: 'c1', label: 'Racks & PDU' },
  { id: 'c2', label: 'Storage Systems' },
  { id: 'c3', label: 'Networking Gear' },
  { id: 'c4', label: 'Compute Hardware' },
];
const TREE_OPEX = [
  { id: 'o1', label: 'Maintenance Contracts' },
  { id: 'o2', label: 'Personnel / Engineering' },
  { id: 'o3', label: 'Data Center Space' },
  { id: 'o4', label: 'Power & Cooling' },
];

export function OpexTreeVisualizer() {
  const [tab, setTab] = useState('tree');
  const [focus, setFocus] = useState('tco'); // tco | capex | opex
  const [opexSel, setOpexSel] = useState('power');
  const cur = OPEX.find((o) => o.id === opexSel);

  const Leaf = ({ items, active, tone }) => (
    <div className="flex flex-wrap justify-center gap-1.5">
      {items.map((l) => (
        <div
          key={l.id}
          className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-medium transition ${
            active
              ? tone === 'sky'
                ? 'border-sky-300 bg-white text-sky-900'
                : 'border-rose-300 bg-white text-rose-900'
              : 'border-gray-600 bg-gray-800 text-gray-500 opacity-40'
          }`}
        >
          {l.label}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Operational Expenses (OpEx)</h3>
        <p className="text-gray-400 text-sm">Recurring costs that often exceed CapEx over the hardware lifespan.</p>
      </div>

      <Tabs
        options={[
          { id: 'tree', label: 'TCO tree' },
          { id: 'opex', label: 'OpEx categories' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'tree' && (
        <>
          <div className="rounded-2xl bg-white p-4 mb-3">
            <button
              type="button"
              onClick={() => setFocus('tco')}
              className={`mx-auto block rounded-full px-5 py-2 text-sm font-bold transition ${
                focus === 'tco' ? 'bg-violet-600 text-white ring-4 ring-violet-300' : 'bg-violet-500 text-white'
              }`}
            >
              Total Cost of Ownership
            </button>

            <div className="flex justify-center gap-16 my-2">
              <div className="w-px h-6 bg-gray-300" />
              <div className="w-px h-6 bg-gray-300" />
            </div>
            <div className="flex justify-center gap-8 mb-3">
              <button
                type="button"
                onClick={() => setFocus('capex')}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  focus === 'capex' || focus === 'tco'
                    ? 'bg-sky-400 text-sky-950 ring-2 ring-sky-200'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                Capital Expenses (CapEx)
              </button>
              <button
                type="button"
                onClick={() => setFocus('opex')}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  focus === 'opex' || focus === 'tco'
                    ? 'bg-rose-300 text-rose-950 ring-2 ring-rose-100'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                Operational Expenses (OpEx)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Leaf items={TREE_CAPEX} active={focus === 'tco' || focus === 'capex'} tone="sky" />
              <Leaf items={TREE_OPEX} active={focus === 'tco' || focus === 'opex'} tone="rose" />
            </div>
            <p className="text-center text-[10px] text-gray-500 mt-3">
              Tap CapEx or OpEx to focus that branch
            </p>
          </div>
          <NoteBox tone={focus === 'opex' ? 'rose' : focus === 'capex' ? 'sky' : 'violet'}>
            {focus === 'tco' && (
              <>
                <strong className="text-white">TCO splits into two branches.</strong> CapEx is paid once up
                front. OpEx recurs every year for as long as the hardware lives — and over three years it
                usually outweighs CapEx.
              </>
            )}
            {focus === 'capex' && (
              <>
                CapEx leaf nodes: racks, storage, networking and compute. These are the one-time purchases
                that show up on the capital budget.
              </>
            )}
            {focus === 'opex' && (
              <>
                OpEx leaf nodes: maintenance, people, space and power. These keep arriving on the monthly
                bill long after the hardware is installed.
              </>
            )}
          </NoteBox>
        </>
      )}

      {tab === 'opex' && (
        <>
          <div className="flex flex-wrap justify-center gap-1.5 mb-3">
            {OPEX.map((o) => {
              const Icon = o.icon;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOpexSel(o.id)}
                  className={`rounded-xl border-2 px-3 py-2 flex items-center gap-1.5 transition ${
                    opexSel === o.id
                      ? 'border-rose-400 bg-rose-500/20'
                      : 'border-gray-700 bg-gray-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${opexSel === o.id ? 'text-rose-300' : 'text-gray-500'}`} />
                  <span className="text-[10px] font-bold text-white">{o.title}</span>
                </button>
              );
            })}
          </div>
          <NoteBox tone="rose">
            <strong className="text-white">{cur.title}.</strong> {cur.body}
          </NoteBox>
        </>
      )}
    </div>
  );
}

/* ── 5. TCO calculator ────────────────────────────────────────────────────── */

const COST_PARTS = [
  { id: 'hw', label: 'Hardware (amortized)', annual: 10000, color: 'bg-blue-500', legend: '#4f6cf7' },
  { id: 'pwr', label: 'Power & Cooling', annual: 3000, color: 'bg-orange-500', legend: '#f59e0b' },
  { id: 'mnt', label: 'Maintenance & Space', annual: 2000, color: 'bg-emerald-500', legend: '#22c55e' },
  { id: 'ppl', label: 'Personnel', annual: 15000, color: 'bg-rose-400', legend: '#fb7185' },
];

export function TcoCalculatorVisualizer() {
  const [years, setYears] = useState(3);
  const [showPeople, setShowPeople] = useState(true);
  const parts = COST_PARTS.filter((p) => showPeople || p.id !== 'ppl');
  const annual = parts.reduce((s, p) => s + p.annual, 0);
  const total = annual * years;
  const maxY = 30000;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">TCO calculation example</h3>
        <p className="text-gray-400 text-sm">1 server · 4 high-end GPUs · adjustable lifespan</p>
      </div>

      <div className="flex justify-center gap-2 mb-3 flex-wrap">
        {[1, 2, 3, 4, 5].map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setYears(y)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              years === y ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {y} yr{y > 1 ? 's' : ''}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowPeople((v) => !v)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            showPeople ? 'bg-rose-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          {showPeople ? 'Personnel ON' : 'Personnel OFF'}
        </button>
      </div>

      {/* chart */}
      <div className="rounded-2xl bg-white p-4 mb-3">
        <div className="text-center text-xs font-bold text-gray-700 mb-3">
          Annual On-Premise Cost Breakdown (1 Server)
        </div>
        <div className="flex items-end justify-center gap-4 h-48">
          {Array.from({ length: years }).map((_, yi) => (
              <div key={yi} className="flex flex-col items-center h-full justify-end">
                <div className="relative w-16 flex flex-col-reverse" style={{ height: `${(annual / maxY) * 100}%` }}>
                  {parts.map((p) => {
                    const h = (p.annual / annual) * 100;
                    return (
                      <div
                        key={p.id}
                        className={`${p.color} w-full transition-all duration-500 first:rounded-t`}
                        style={{ height: `${h}%` }}
                        title={`${p.label}: ${money(p.annual)}`}
                      />
                    );
                  })}
                </div>
                <div className="text-[10px] text-gray-600 mt-1 font-mono">Y{yi + 1}</div>
              </div>
            ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-3 border-t border-gray-200 pt-2">
          {COST_PARTS.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-1.5 text-[10px] ${
                !showPeople && p.id === 'ppl' ? 'opacity-30 line-through' : 'text-gray-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.legend }} />
              {p.label}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          ['Annual cost', money(annual)],
          [`${years}-year TCO`, money(total)],
          ['Hardware share', `${Math.round((10000 / annual) * 100)}%`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-gray-700 bg-gray-900/60 px-3 py-2 text-center">
            <div className="text-[9px] uppercase text-gray-500">{k}</div>
            <div className="text-sm font-bold text-white font-mono">{v}</div>
          </div>
        ))}
      </div>

      <NoteBox tone={showPeople ? 'rose' : 'amber'}>
        {showPeople ? (
          <>
            <strong className="text-white">
              The $30,000 hardware is only one-third of the {money(total)} lifetime cost.
            </strong>{' '}
            Personnel alone — 10% of one engineer — equals the amortized hardware. Toggle personnel off to
            see how distorted the picture gets when people are ignored.
          </>
        ) : (
          <>
            Without personnel the annual cost looks like {money(annual)}. That is the number teams
            sometimes quote — and it understates the real TCO by half.
          </>
        )}
      </NoteBox>
    </div>
  );
}

/* ── 6. Baseline for cloud comparison ─────────────────────────────────────── */

export function BaselineHourVisualizer() {
  const annual = 30000;
  const hourly247 = +(annual / (365 * 24)).toFixed(2);
  const [hoursPerDay, setHoursPerDay] = useState(24);
  const effectiveHourly = +(annual / (365 * hoursPerDay)).toFixed(2);
  const [cloudRate, setCloudRate] = useState(4.1); // mock on-demand $/hr

  const cheaper = cloudRate < effectiveHourly;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Your comparison baseline</h3>
        <p className="text-gray-400 text-sm">
          $30,000/year → ${hourly247}/hour at 24/7. Now compare apples to apples.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="rounded-xl border-2 border-teal-400 bg-teal-500/15 px-4 py-3 text-center">
            <div className="text-[10px] uppercase text-teal-300">On-prem TCO</div>
            <div className="text-2xl font-bold text-white font-mono">${effectiveHourly}</div>
            <div className="text-[9px] text-gray-400">per hour · {hoursPerDay}h/day</div>
          </div>
          <span className="text-gray-500 text-lg font-bold">vs</span>
          <div className="rounded-xl border-2 border-amber-400 bg-amber-500/15 px-4 py-3 text-center">
            <div className="text-[10px] uppercase text-amber-300">Cloud On-Demand</div>
            <div className="text-2xl font-bold text-white font-mono">${cloudRate.toFixed(2)}</div>
            <div className="text-[9px] text-gray-400">per hour · mock GPU</div>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Hours the on-prem box runs per day</span>
            <span className="font-mono">{hoursPerDay}h</span>
          </div>
          <input
            type="range"
            min={4}
            max={24}
            step={1}
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(parseInt(e.target.value, 10))}
            className="w-full accent-teal-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Cloud On-Demand rate ($/hr)</span>
            <span className="font-mono">${cloudRate.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={1}
            max={8}
            step={0.1}
            value={cloudRate}
            onChange={(e) => setCloudRate(parseFloat(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>
      </div>

      <div
        className={`rounded-2xl border-2 p-4 text-center mb-3 ${
          cheaper ? 'border-amber-400 bg-amber-500/15' : 'border-teal-400 bg-teal-500/15'
        }`}
      >
        <div className="text-xs text-gray-400 mb-1">At these settings</div>
        <div className="text-lg font-bold text-white">
          {cheaper ? 'Cloud On-Demand wins on cost' : 'On-prem wins on cost'}
        </div>
        <div className="text-[11px] text-gray-400 mt-1">
          Gap: ${Math.abs(cloudRate - effectiveHourly).toFixed(2)}/hour ·{' '}
          {money(Math.abs(cloudRate - effectiveHourly) * 365 * hoursPerDay)}/year
        </div>
      </div>

      <NoteBox tone="teal">
        <strong className="text-white">
          Without this baseline you are comparing a three-year CapEx cheque to a single cloud invoice.
        </strong>{' '}
        Convert TCO to a per-hour figure first. Then On-Demand, Reserved and Spot prices become meaningful.
        Notice: if the box sits idle half the day, its effective hourly cost doubles — utilization matters
        as much as sticker price.
      </NoteBox>
    </div>
  );
}

/* ── 7. On-Demand meter ───────────────────────────────────────────────────── */

export function OnDemandVisualizer() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const hours = Math.floor(seconds / 3600);
  const displayCost = (hours * 1.2).toFixed(2);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">On-Demand: the running meter</h3>
        <p className="text-gray-400 text-sm">No commitment. Highest rate. You pay only while it runs.</p>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${running ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`}
            />
            <span className="text-xs font-bold text-white">
              {running ? 'Instance RUNNING' : 'Instance STOPPED'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-500">g5.xlarge · $1.20 / hr (mock)</span>
        </div>

        <div className="text-center mb-4">
          <div className="text-[10px] uppercase text-gray-500">Bill so far</div>
          <div className="text-4xl font-bold font-mono text-amber-300">${displayCost}</div>
          <div className="text-[11px] text-gray-400 mt-1">{hours} hour{hours !== 1 ? 's' : ''} billed</div>
        </div>

        {/* meter bars */}
        <div className="flex gap-1 mb-4 justify-center flex-wrap max-w-md mx-auto">
          {Array.from({ length: Math.min(hours, 24) }).map((_, i) => (
            <div key={i} className="w-3 h-8 rounded-sm bg-amber-500" title={`Hour ${i + 1}`} />
          ))}
          {hours === 0 && (
            <div className="text-[10px] text-gray-600 py-2">No hours billed yet — start and advance</div>
          )}
        </div>

        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setRunning((v) => !v)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              running ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {running ? 'Stop instance' : 'Start instance'}
          </button>
          <button
            type="button"
            disabled={!running}
            onClick={() => setSeconds((s) => s + 3600)}
            className="px-4 py-2 rounded-xl bg-amber-600 text-xs font-bold text-white disabled:opacity-30"
          >
            Advance 1 hour →
          </button>
          <button
            type="button"
            onClick={() => {
              setSeconds(0);
              setRunning(false);
            }}
            className="px-3 py-2 rounded-xl bg-gray-800 text-xs text-gray-300"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-3">
          <div className="text-[10px] font-bold uppercase text-emerald-300 mb-1">Best for</div>
          <ul className="text-[11px] text-gray-300 space-y-1 list-disc pl-4">
            <li>Unpredictable or short-term work</li>
            <li>Debugging a new training script</li>
            <li>Quick experiments of uncertain length</li>
          </ul>
        </div>
        <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3">
          <div className="text-[10px] font-bold uppercase text-rose-300 mb-1">Drawback</div>
          <ul className="text-[11px] text-gray-300 space-y-1 list-disc pl-4">
            <li>Highest per-hour cost</li>
            <li>Wasteful for stable long-running loads</li>
            <li>A common source of budget overruns</li>
          </ul>
        </div>
      </div>

      <NoteBox tone={hours > 8 ? 'rose' : 'amber'}>
        {hours === 0 && (
          <>
            Start the instance, then advance the clock. The meter only ticks while it is running — that
            flexibility is the whole point of On-Demand.
          </>
        )}
        {hours > 0 && hours <= 8 && (
          <>
            <strong className="text-white">${displayCost} for {hours}h of debugging.</strong> For a short,
            unpredictable session this is exactly right. Leave it running overnight and the story changes.
          </>
        )}
        {hours > 8 && (
          <>
            <strong className="text-white">
              ${displayCost} and climbing — this is how On-Demand becomes a budget problem.
            </strong>{' '}
            A 24/7 inference API at this rate would burn far more than a Reserved commitment for the same
            box.
          </>
        )}
      </NoteBox>
    </div>
  );
}

/* ── 8. Reserved / Savings Plans ──────────────────────────────────────────── */

export function ReservedVisualizer() {
  const [mode, setMode] = useState('ri'); // ri | sp
  const [term, setTerm] = useState(3); // 1 or 3
  const [used, setUsed] = useState(true);

  const onDemandHour = 3.0;
  const discount = term === 3 ? 0.6 : 0.45; // pay 40% / 55% of on-demand
  const reservedHour = +(onDemandHour * (1 - discount)).toFixed(2);
  const months = term * 12;
  const committed = reservedHour * 24 * 30 * months;
  const ifOnDemand = onDemandHour * 24 * 30 * months;
  const wasted = used ? 0 : reservedHour * 24 * 30; // one idle month

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Reserved Instances & Savings Plans</h3>
        <p className="text-gray-400 text-sm">Commit for 1–3 years. Pay less. Lock in.</p>
      </div>

      <Tabs
        options={[
          { id: 'ri', label: 'Reserved Instance' },
          { id: 'sp', label: 'Savings Plan' },
        ]}
        value={mode}
        onChange={setMode}
      />

      <div className="flex justify-center gap-2 mb-3">
        {[1, 3].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTerm(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              term === t ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {t}-year term
          </button>
        ))}
        <button
          type="button"
          onClick={() => setUsed((v) => !v)}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
            used ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          {used ? 'Workload running' : 'Idle — still paying'}
        </button>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-center">
            <div className="text-[10px] uppercase text-rose-300">On-Demand</div>
            <div className="text-2xl font-bold font-mono text-white">${onDemandHour.toFixed(2)}</div>
            <div className="text-[9px] text-gray-400">/ hour</div>
          </div>
          <div className="rounded-xl border border-amber-400/40 bg-amber-500/15 p-3 text-center">
            <div className="text-[10px] uppercase text-amber-300">
              {mode === 'ri' ? 'Reserved' : 'Savings Plan'}
            </div>
            <div className="text-2xl font-bold font-mono text-white">${reservedHour}</div>
            <div className="text-[9px] text-gray-400">/ hour · ~{Math.round(discount * 100)}% off</div>
          </div>
        </div>

        {/* commitment calendar */}
        <div className="text-[10px] uppercase text-gray-500 mb-1">
          {term}-year commitment · you owe this whether you use it or not
        </div>
        <div className="flex gap-0.5 mb-2">
          {Array.from({ length: months }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-6 rounded-sm transition ${
                used ? 'bg-amber-500' : 'bg-rose-700'
              }`}
              title={`Month ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-mono text-gray-400">
          <span>Total committed: {money(committed)}</span>
          <span>vs On-Demand: {money(ifOnDemand)}</span>
        </div>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3 mb-3 text-xs text-gray-300 leading-relaxed">
        {mode === 'ri' ? (
          <>
            <strong className="text-white">Reserved Instance:</strong> you commit to a{' '}
            <em>specific instance type</em> in a specific region (e.g.{' '}
            <span className="font-mono text-amber-300">p4d.24xlarge</span>) for the term. Deepest discount,
            least flexibility.
          </>
        ) : (
          <>
            <strong className="text-white">Savings Plan:</strong> you commit to a{' '}
            <em>dollar amount per hour</em> (e.g. $10/hr of compute) for the term. Change instance families
            freely; the discount still applies.
          </>
        )}
      </div>

      <NoteBox tone={used ? 'emerald' : 'rose'}>
        {used ? (
          <>
            <strong className="text-white">
              Best for stable, predictable load — a 24/7 inference API, a core training fleet.
            </strong>{' '}
            You save {money(ifOnDemand - committed)} over {term} year{term > 1 ? 's' : ''} versus
            On-Demand. The trade-off is lock-in: careful capacity planning required.
          </>
        ) : (
          <>
            <strong className="text-white">The commitment still bills.</strong> One idle month still costs{' '}
            {money(wasted)}. This is why Reserved/Savings Plans are wrong for bursty or experimental work —
            you pay for capacity whether it is used or not.
          </>
        )}
      </NoteBox>
    </div>
  );
}

/* ── 9. Spot / Preemptible ────────────────────────────────────────────────── */

export function SpotVisualizer() {
  const [step, setStep] = useState(0);
  // 0 idle ready, 1 running cheap, 2 reclaim warning, 3 reclaimed, 4 recovered from checkpoint

  const stages = [
    {
      t: 'Spot capacity available',
      d: 'The provider has spare GPUs. You bid (or accept the current Spot price) and get a machine at a deep discount — often 70–90% off On-Demand.',
    },
    {
      t: 'Training at ~18¢ on the dollar',
      d: 'Your job runs normally. With checkpointing every N steps, a sudden stop is recoverable. Without it, progress since the last save is lost.',
    },
    {
      t: '2-minute reclaim warning',
      d: 'The provider needs the capacity back. You typically get about two minutes. A well-built job finishes the current step, writes a checkpoint, and exits cleanly.',
    },
    {
      t: 'Instance gone',
      d: 'The VM is terminated. Any state not on durable storage is gone. This is why Spot is unsuitable for a user-facing production API.',
    },
    {
      t: 'Resume from checkpoint',
      d: 'A new Spot (or On-Demand) instance picks up the latest checkpoint and continues. Net result: near-Spot pricing with almost no lost work — if you designed for interruption.',
    },
  ];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Spot Instances & Preemptible VMs</h3>
        <p className="text-gray-400 text-sm">Up to 90% off — with a reclaim risk you must design for.</p>
      </div>

      {/* scene */}
      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div
            className={`rounded-xl border-2 px-4 py-3 w-40 text-center transition ${
              step >= 1 && step < 3
                ? 'border-emerald-400 bg-emerald-500/20'
                : step >= 3
                  ? 'border-rose-500 bg-rose-500/15 opacity-50'
                  : 'border-gray-700 bg-gray-900/60'
            }`}
          >
            <Server
              className={`w-6 h-6 mx-auto mb-1 ${
                step >= 1 && step < 3 ? 'text-emerald-300' : step >= 3 ? 'text-rose-400' : 'text-gray-500'
              }`}
            />
            <div className="text-[11px] font-bold text-white">Spot GPU</div>
            <div className="text-[9px] font-mono text-emerald-400">~$0.54 / hr</div>
            <div className="text-[9px] text-gray-400 mt-0.5">
              {step === 0 && 'waiting'}
              {step === 1 && 'training…'}
              {step === 2 && '⚠ reclaim in 2 min'}
              {step >= 3 && 'terminated'}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            {step >= 1 && step < 3 && (
              <div className="text-[10px] text-emerald-300 font-bold animate-pulse">checkpoint →</div>
            )}
            {step === 2 && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {step >= 3 && <X className="w-5 h-5 text-rose-400" />}
          </div>

          <div
            className={`rounded-xl border-2 px-4 py-3 w-36 text-center transition ${
              step >= 1 ? 'border-sky-400 bg-sky-500/15' : 'border-gray-700 bg-gray-900/60'
            }`}
          >
            <HardDrive className={`w-6 h-6 mx-auto mb-1 ${step >= 1 ? 'text-sky-300' : 'text-gray-500'}`} />
            <div className="text-[11px] font-bold text-white">Durable storage</div>
            <div className="text-[9px] text-gray-400 mt-0.5">
              {step === 0 && 'empty'}
              {step >= 1 && step < 4 && 'ckpt-epoch-12.pt'}
              {step >= 4 && 'ckpt loaded → resume'}
            </div>
          </div>
        </div>

        <div className="flex justify-between text-[9px] text-gray-500 mb-1 px-1">
          <span>On-Demand $3.00</span>
          <span>Spot ~$0.54 (18%)</span>
        </div>
        <div className="h-3 rounded bg-gray-800 overflow-hidden flex">
          <div className="h-full bg-emerald-500" style={{ width: '18%' }} />
          <div className="h-full bg-gray-700" style={{ width: '82%' }} />
        </div>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3 mb-2">
        <div className="text-xs font-bold text-white mb-1">
          {step + 1}. {stages[step].t}
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">{stages[step].d}</p>
      </div>

      <Nav
        step={step}
        max={stages.length - 1}
        onBack={() => setStep((s) => s - 1)}
        onNext={() => setStep((s) => s + 1)}
        onReset={() => setStep(0)}
      />

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-2.5">
          <div className="text-[10px] font-bold text-emerald-300 mb-1">Best for</div>
          <p className="text-[10px] text-gray-300 leading-relaxed">
            Checkpointed training, batch inference, data pipelines — anything that can die and restart.
          </p>
        </div>
        <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-2.5">
          <div className="text-[10px] font-bold text-rose-300 mb-1">Not for</div>
          <p className="text-[10px] text-gray-300 leading-relaxed">
            User-facing production APIs where sudden downtime is unacceptable.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 10. Decision tree ────────────────────────────────────────────────────── */

export function PricingDecisionVisualizer() {
  const [path, setPath] = useState([]); // ['yes'|'no', ...]
  const interruptible = path[0];
  const longRunning = path[1];

  let result = null;
  if (interruptible === 'yes') result = 'spot';
  else if (interruptible === 'no' && longRunning === 'yes') result = 'reserved';
  else if (interruptible === 'no' && longRunning === 'no') result = 'ondemand';

  const RESULTS = {
    spot: {
      label: 'Use Spot / Preemptible VMs',
      color: 'border-emerald-600 bg-emerald-200 text-emerald-950',
      icon: 'text-emerald-700',
      why: 'Your job can survive a reclaim. Take the deepest discount and checkpoint aggressively.',
    },
    reserved: {
      label: 'Use Reserved Instances or Savings Plans',
      color: 'border-amber-500 bg-amber-200 text-amber-950',
      icon: 'text-amber-700',
      why: 'Stable, long-running, cannot be interrupted. Commit and lock in the mid-tier discount.',
    },
    ondemand: {
      label: 'Use On-Demand Instances',
      color: 'border-rose-500 bg-rose-200 text-rose-950',
      icon: 'text-rose-700',
      why: 'Short, unpredictable, or cannot tolerate interruption. Pay the premium for flexibility.',
    },
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Choosing the right model</h3>
        <p className="text-gray-400 text-sm">Answer two questions. Get one recommendation.</p>
      </div>

      <div className="rounded-2xl bg-white p-4 mb-3">
        {/* start */}
        <div className="flex justify-center mb-3">
          <div className="rounded-full bg-sky-200 text-sky-900 px-4 py-2 text-xs font-bold">
            What is your workload?
          </div>
        </div>

        {/* Q1 */}
        <div className="flex flex-col items-center mb-3">
          <div className="rounded-xl bg-violet-200 text-violet-900 px-4 py-2 text-xs font-bold text-center max-w-xs">
            Is it interruptible and fault-tolerant?
          </div>
          <div className="flex gap-3 mt-2">
            {['yes', 'no'].map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setPath([a])}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold border-2 transition ${
                  interruptible === a
                    ? a === 'yes'
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-800'
                      : 'border-violet-500 bg-violet-100 text-violet-800'
                    : 'border-gray-300 bg-gray-50 text-gray-500'
                }`}
              >
                {a === 'yes' ? 'Yes → Spot' : 'No → next'}
              </button>
            ))}
          </div>
        </div>

        {/* Q2 */}
        {interruptible === 'no' && (
          <div className="flex flex-col items-center mb-3">
            <div className="rounded-xl bg-violet-200 text-violet-900 px-4 py-2 text-xs font-bold text-center max-w-xs">
              Is it long-running and predictable?
            </div>
            <div className="flex gap-3 mt-2">
              {['yes', 'no'].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setPath(['no', a])}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold border-2 transition ${
                    longRunning === a
                      ? a === 'yes'
                        ? 'border-amber-500 bg-amber-100 text-amber-900'
                        : 'border-rose-500 bg-rose-100 text-rose-800'
                      : 'border-gray-300 bg-gray-50 text-gray-500'
                  }`}
                >
                  {a === 'yes' ? 'Yes → Reserved' : 'No → On-Demand'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* result */}
        {result && (
          <div className={`mx-auto max-w-sm rounded-xl border-2 px-4 py-3 text-center ${RESULTS[result].color}`}>
            <Check className={`w-5 h-5 mx-auto mb-1 ${RESULTS[result].icon}`} />
            <div className="text-sm font-bold">{RESULTS[result].label}</div>
          </div>
        )}
      </div>

      {result ? (
        <NoteBox
          tone={result === 'spot' ? 'emerald' : result === 'reserved' ? 'amber' : 'rose'}
        >
          {RESULTS[result].why}
        </NoteBox>
      ) : (
        <NoteBox>
          Start at the top. Interruptible work almost always belongs on Spot. Everything else splits on
          whether the load is stable enough to commit to.
        </NoteBox>
      )}

      {path.length > 0 && (
        <div className="flex justify-center mt-3">
          <button
            type="button"
            onClick={() => setPath([])}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300"
          >
            Reset answers
          </button>
        </div>
      )}
    </div>
  );
}

/* ── 11. Relative cost + hybrid ───────────────────────────────────────────── */

export function RelativeCostVisualizer() {
  const [tab, setTab] = useState('chart');
  const [mix, setMix] = useState({ reserved: 40, spot: 45, ondemand: 15 });

  const rates = { ondemand: 100, reserved: 55, spot: 18 };
  const blended =
    (mix.ondemand * rates.ondemand + mix.reserved * rates.reserved + mix.spot * rates.spot) / 100;

  const setSlice = (key, val) => {
    const v = Math.max(0, Math.min(100, val));
    const others = ['ondemand', 'reserved', 'spot'].filter((k) => k !== key);
    const remaining = 100 - v;
    const otherSum = others.reduce((s, k) => s + mix[k], 0) || 1;
    const next = { ...mix, [key]: v };
    others.forEach((k) => {
      next[k] = Math.round((mix[k] / otherSum) * remaining);
    });
    // fix rounding
    const sum = next.ondemand + next.reserved + next.spot;
    if (sum !== 100) next[others[0]] += 100 - sum;
    setMix(next);
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The cost gap — and a hybrid mix</h3>
        <p className="text-gray-400 text-sm">
          On-Demand is the 100% baseline. Spot can be 18%. Most teams blend.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'chart', label: 'Relative hourly cost' },
          { id: 'hybrid', label: 'Build a hybrid mix' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'chart' && (
        <>
          <div className="rounded-2xl bg-white p-4 mb-3">
            <div className="text-center text-xs font-bold text-gray-700 mb-3">
              Relative Hourly Cost of a GPU Instance by Pricing Model
            </div>
            <div className="flex items-end justify-center gap-8 h-52">
              {[
                { k: 'On-Demand', v: 100, c: '#ef4444' },
                { k: 'Savings Plan (1-yr)', v: 55, c: '#eab308' },
                { k: 'Spot Instance', v: 18, c: '#22c55e' },
              ].map((b) => (
                <div key={b.k} className="flex flex-col items-center h-full justify-end">
                  <span className="text-xs font-bold text-gray-700 mb-1">{b.v}%</span>
                  <div
                    className="w-24 rounded-t transition-all duration-500"
                    style={{ height: `${b.v}%`, background: b.c }}
                  />
                  <span className="text-[10px] text-gray-600 mt-2 text-center w-24 leading-tight">{b.k}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] text-gray-500 mt-3">
              On-Demand = 100%. A 1-year Savings Plan ~55%. Spot ~18%.
            </p>
          </div>
          <NoteBox tone="amber">
            <strong className="text-white">
              For GPU-heavy work, this gap decides whether a project is viable.
            </strong>{' '}
            The same accelerator at 18¢ on the dollar versus full price is the difference between a
            financially sustainable training program and one that gets cancelled.
          </NoteBox>
        </>
      )}

      {tab === 'hybrid' && (
        <>
          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
            <div className="text-[10px] uppercase text-gray-500 mb-3">
              How much of your GPU spend sits in each model?
            </div>
            {[
              { key: 'reserved', label: 'Reserved / Savings — baseline inference', color: 'bg-amber-500' },
              { key: 'spot', label: 'Spot — large training jobs', color: 'bg-emerald-500' },
              { key: 'ondemand', label: 'On-Demand — developer experiments', color: 'bg-rose-500' },
            ].map((row) => (
              <div key={row.key} className="mb-3">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>{row.label}</span>
                  <span className="font-mono">{mix[row.key]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={mix[row.key]}
                  onChange={(e) => setSlice(row.key, parseInt(e.target.value, 10))}
                  className="w-full accent-teal-500"
                />
              </div>
            ))}

            <div className="flex h-8 rounded-lg overflow-hidden border border-gray-700 mb-3">
              <div className="bg-amber-500 transition-all" style={{ width: `${mix.reserved}%` }} />
              <div className="bg-emerald-500 transition-all" style={{ width: `${mix.spot}%` }} />
              <div className="bg-rose-500 transition-all" style={{ width: `${mix.ondemand}%` }} />
            </div>

            <div className="text-center">
              <div className="text-[10px] uppercase text-gray-500">Blended cost vs pure On-Demand</div>
              <div className="text-3xl font-bold font-mono text-teal-300">{blended.toFixed(0)}%</div>
              <div className="text-[11px] text-gray-400">
                ~{(100 - blended).toFixed(0)}% savings across the fleet
              </div>
            </div>
          </div>
          <NoteBox tone="emerald">
            <strong className="text-white">The effective strategy is almost always hybrid.</strong> Cover
            baseline production inference with Reserved, run large-scale training on Spot with
            checkpointing, and let developers experiment on On-Demand. Map usage patterns to models — that
            is how you keep performance and keep the bill under control.
          </NoteBox>
        </>
      )}
    </div>
  );
}
