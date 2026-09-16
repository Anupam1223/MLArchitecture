import React, { useState } from 'react';
import { Cpu, HardDrive, Gauge, MemoryStick } from 'lucide-react';

function Tabs({ options, value, onChange }) {
  return (
    <div className="flex justify-center gap-2 mb-3 flex-wrap">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            value === o.id ? 'bg-lime-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
        <button type="button" onClick={onReset} className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300">
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
        className="px-4 py-1.5 rounded-lg bg-lime-600 text-xs font-bold text-white disabled:opacity-30"
      >
        Next →
      </button>
    </div>
  );
}

function NoteBox({ children, tone = 'lime' }) {
  const map = {
    lime: 'border-lime-400/40 bg-lime-500/10',
    amber: 'border-amber-400/40 bg-amber-500/10',
    rose: 'border-rose-400/40 bg-rose-500/10',
    emerald: 'border-emerald-400/40 bg-emerald-500/10',
    sky: 'border-sky-400/40 bg-sky-500/10',
    violet: 'border-violet-400/40 bg-violet-500/10',
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm text-gray-200 leading-relaxed ${map[tone] || map.lime}`}>
      {children}
    </div>
  );
}

function money(n, digits = 2) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/* ── 1. Just-in-case vs just-enough ───────────────────────────────────────── */

export function RightSizeIntroVisualizer() {
  const [mode, setMode] = useState('case'); // case | enough
  const [util, setUtil] = useState(10);

  const under = util > 92;
  const over = util < 40;
  const just = util >= 40 && util <= 92;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Just-in-case vs. just-enough</h3>
        <p className="text-gray-400 text-sm">The most powerful GPU is rarely the cheapest way to finish the work.</p>
      </div>

      <div className="flex justify-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => {
            setMode('case');
            setUtil(10);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            mode === 'case' ? 'bg-rose-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          Just-in-case
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('enough');
            setUtil(72);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            mode === 'enough' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          Just-enough
        </button>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
        <div className="flex items-end justify-center gap-6 h-36 mb-3">
          <div className="flex flex-col items-center h-full justify-end">
            <span className="text-[10px] text-gray-400 mb-1">Need</span>
            <div className="w-16 bg-sky-500 rounded-t" style={{ height: '40%' }} />
            <span className="text-[9px] text-gray-500 mt-1">workload</span>
          </div>
          <div className="flex flex-col items-center h-full justify-end">
            <span className="text-[10px] text-gray-400 mb-1">Bought</span>
            <div
              className={`w-16 rounded-t transition-all duration-500 ${mode === 'case' ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ height: mode === 'case' ? '95%' : '48%' }}
            />
            <span className="text-[9px] text-gray-500 mt-1">capacity</span>
          </div>
        </div>
        <div className="text-center text-[11px] text-gray-400">
          {mode === 'case'
            ? 'You paid for a box the workload never fills — 10% GPU util is financial waste.'
            : 'Capacity matches demand. Performance targets are met without idle GPUs on the bill.'}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>GPU utilization during heavy compute</span>
          <span className="font-mono">{util}%</span>
        </div>
        <input
          type="range"
          min={5}
          max={100}
          value={util}
          onChange={(e) => setUtil(parseInt(e.target.value, 10))}
          className="w-full accent-lime-500 mb-3"
        />
        <div className="grid grid-cols-3 gap-2">
          <div
            className={`rounded-xl border-2 p-3 ${
              over ? 'border-rose-400 bg-rose-500/15' : 'border-gray-700 bg-gray-900/60 opacity-50'
            }`}
          >
            <div className="text-[10px] font-bold text-rose-300">Overprovisioning</div>
            <p className="text-[10px] text-gray-400 mt-1">Paying for capacity the app never uses. An expensive GPU at 10% util is waste.</p>
          </div>
          <div
            className={`rounded-xl border-2 p-3 ${
              just ? 'border-emerald-400 bg-emerald-500/15' : 'border-gray-700 bg-gray-900/60 opacity-50'
            }`}
          >
            <div className="text-[10px] font-bold text-emerald-300">Just-enough</div>
            <p className="text-[10px] text-gray-400 mt-1">Capacity matches demand. Targets are met without idle GPUs on the bill.</p>
          </div>
          <div
            className={`rounded-xl border-2 p-3 ${
              under ? 'border-amber-400 bg-amber-500/15' : 'border-gray-700 bg-gray-900/60 opacity-50'
            }`}
          >
            <div className="text-[10px] font-bold text-amber-300">Underprovisioning</div>
            <p className="text-[10px] text-gray-400 mt-1">Jobs crawl, cycles stretch, inference misses latency SLOs.</p>
          </div>
        </div>
      </div>

      <NoteBox tone={just ? 'emerald' : over ? 'rose' : 'amber'}>
        {just && (
          <>
            <strong className="text-white">Right-sizing lives in the middle.</strong> Enough capacity to
            hit performance targets — not a bigger GPU “just in case.”
          </>
        )}
        {over && (
          <>
            <strong className="text-white">Overprovisioning is the more common cost failure.</strong>{' '}
            Selecting the most powerful instance feels safe and is often the fastest way to burn the budget.
          </>
        )}
        {under && (
          <>
            <strong className="text-white">Underprovisioning hurts performance.</strong> Training runs too
            slowly; inference fails latency requirements. The fix is measurement, not a bigger default.
          </>
        )}
      </NoteBox>
    </div>
  );
}

/* ── 2. Data-driven metrics ───────────────────────────────────────────────── */

const PROFILES = {
  starve: {
    label: 'GPU starved',
    gpu: 18,
    vram: 7,
    cpu: 98,
    ram: 12,
    note: 'Low GPU util + CPU pinned at 100% is not a bigger-GPU problem. Optimize the data pipeline or pick a higher CPU-to-GPU ratio.',
    tone: 'amber',
  },
  oom: {
    label: 'VRAM bound',
    gpu: 88,
    vram: 23.4,
    cpu: 35,
    ram: 18,
    note: 'OOM on a 24 GB card is a clear signal: you need more VRAM (or a smaller batch / mixed precision) — not more CPU.',
    tone: 'rose',
  },
  waste: {
    label: 'Overprovisioned',
    gpu: 12,
    vram: 8,
    cpu: 22,
    ram: 9,
    note: '8 GB used on a 24 GB GPU: you are paying for memory you do not need. Downsize the instance family.',
    tone: 'rose',
  },
  fit: {
    label: 'Right-sized',
    gpu: 78,
    vram: 18,
    cpu: 45,
    ram: 20,
    note: 'Cores busy, VRAM comfortably used, CPU not starving the accelerator. This is the profile you size toward.',
    tone: 'emerald',
  },
};

function Meter({ label, value, max = 100, unit = '%', warnLow, warnHigh }) {
  const pct = Math.min(100, (value / max) * 100);
  const bad = (warnLow != null && value < warnLow) || (warnHigh != null && value > warnHigh);
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3">
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-gray-400">{label}</span>
        <span className={`font-mono font-bold ${bad ? 'text-rose-300' : 'text-emerald-300'}`}>
          {value}
          {unit === '%' ? '%' : ` ${unit}`}
        </span>
      </div>
      <div className="h-2.5 rounded bg-gray-800 overflow-hidden">
        <div className={`h-full ${bad ? 'bg-rose-500' : 'bg-lime-500'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function SizingMetricsVisualizer() {
  const [p, setP] = useState('starve');
  const cur = PROFILES[p];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">A data-driven resource profile</h3>
        <p className="text-gray-400 text-sm">Run a baseline instance. Collect these four metrics. Then decide.</p>
      </div>

      <Tabs
        options={Object.entries(PROFILES).map(([id, v]) => ({ id, label: v.label }))}
        value={p}
        onChange={setP}
      />

      <div className="grid grid-cols-2 gap-2 mb-3">
        <Meter label="GPU Utilization" value={cur.gpu} warnLow={50} />
        <Meter label="GPU Memory (of 24 GB)" value={cur.vram} max={24} unit="GB" warnHigh={22} />
        <Meter label="CPU Utilization" value={cur.cpu} warnHigh={90} />
        <Meter label="System RAM (of 32 GB)" value={cur.ram} max={32} unit="GB" warnHigh={28} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        {[
          { icon: Gauge, t: 'GPU %', d: 'Busy cores. Consistently <50% during heavy compute → bottleneck elsewhere.' },
          { icon: MemoryStick, t: 'VRAM GB', d: 'Model + batch + activations. 8 GB used on 24 GB = paying for unused memory.' },
          { icon: Cpu, t: 'CPU %', d: 'Pinned at 100% while GPU is idle → preprocessing is starving the accelerator.' },
          { icon: HardDrive, t: 'RAM GB', d: 'Host memory, not VRAM. Too little → disk swap and a collapsed step time.' },
        ].map((m) => (
          <div key={m.t} className="rounded-xl border border-gray-700 bg-gray-900/60 p-2.5">
            <m.icon className="w-4 h-4 text-lime-300 mb-1" />
            <div className="text-[10px] font-bold text-white">{m.t}</div>
            <p className="text-[9px] text-gray-400 leading-relaxed mt-0.5">{m.d}</p>
          </div>
        ))}
      </div>

      <NoteBox tone={cur.tone}>{cur.note}</NoteBox>
    </div>
  );
}

/* ── 3. Training total job cost ───────────────────────────────────────────── */

const TRAIN_INST = [
  { id: 't4', name: 'T4', sku: 'g4dn.xlarge', rate: 0.526, hours: 30, color: 'bg-sky-400', hex: '#38bdf8' },
  { id: 'v100', name: 'V100', sku: 'p3.2xlarge', rate: 3.06, hours: 3, color: 'bg-violet-400', hex: '#a78bfa' },
  { id: 'a100', name: 'A100', sku: 'p4d.24xlarge', rate: 4.1, hours: 1, color: 'bg-lime-400', hex: '#a3e635' },
];

export function TrainingRightSizeVisualizer() {
  const [sel, setSel] = useState('a100');
  const maxTotal = 16;
  const maxRate = 5;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Total Job Cost = Rate × Hours</h3>
        <p className="text-gray-400 text-sm">The cheapest hour is not always the cheapest job. Tap a GPU.</p>
      </div>

      <div className="rounded-xl border border-lime-400/40 bg-lime-500/10 px-4 py-2 text-center font-mono text-sm text-lime-200 mb-3">
        Total Job Cost = Instance Hourly Rate × Hours to Complete
      </div>

      <div className="rounded-2xl bg-white p-4 mb-3">
        <div className="text-center text-xs font-bold text-gray-700 mb-3">Total Cost Analysis for a Training Job</div>
        <div className="flex items-end justify-center gap-8 h-52">
          {TRAIN_INST.map((g) => {
            const total = +(g.rate * g.hours).toFixed(2);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setSel(g.id)}
                className="flex flex-col items-center h-full justify-end"
              >
                <span className="text-[10px] font-bold text-gray-600 mb-1">{g.hours} hours</span>
                <div className="flex items-end gap-1 h-[85%]">
                  <div
                    className={`w-7 rounded-t bg-sky-300 ${sel === g.id ? 'ring-2 ring-offset-1 ring-cyan-500' : ''}`}
                    style={{ height: `${(g.rate / maxRate) * 100}%` }}
                    title={`$${g.rate}/hr`}
                  />
                  <div
                    className={`w-10 rounded-t bg-indigo-600 ${sel === g.id ? 'ring-2 ring-offset-1 ring-indigo-400' : ''}`}
                    style={{ height: `${(total / maxTotal) * 100}%` }}
                    title={`$${total} total`}
                  />
                </div>
                <span className="text-[9px] text-gray-700 mt-2 w-24 text-center leading-tight">
                  {g.name} ({g.sku})
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-center gap-4 mt-3 text-[10px] text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 rounded-sm bg-sky-300" /> Instance Cost/Hour
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 rounded-sm bg-indigo-600" /> Total Job Cost
          </span>
        </div>
      </div>

      {(() => {
        const g = TRAIN_INST.find((x) => x.id === sel);
        const total = +(g.rate * g.hours).toFixed(2);
        const cheapest = TRAIN_INST.reduce((a, b) => (a.rate * a.hours < b.rate * b.hours ? a : b));
        return (
          <NoteBox tone={g.id === cheapest.id ? 'emerald' : 'sky'}>
            <strong className="text-white">
              {g.name} · {money(g.rate)}/hr × {g.hours}h = {money(total)}
            </strong>
            . {g.id === 'a100'
              ? 'Highest hourly rate, lowest total — it finishes so fast the extra dollars per hour more than pay for themselves.'
              : g.id === 't4'
                ? 'Cheapest hour, most expensive job. Thirty slow hours dominate the bill.'
                : 'A middle ground — still more total cost than the A100 on this workload.'}{' '}
            Find the sweet spot by training a few epochs on several types and extrapolating.
          </NoteBox>
        );
      })()}
    </div>
  );
}

/* ── 4. Inference right-sizing ────────────────────────────────────────────── */

const INFER_STEPS = [
  {
    t: 'Load Testing',
    d: 'Send simulated traffic to the deployed model on different instance types — CPU, GPU, and specialized accelerators.',
  },
  {
    t: 'Measure Performance',
    d: 'Record the maximum throughput (requests per second) each instance can handle before latency exceeds your SLO.',
  },
  {
    t: 'Calculate Cost-Effectiveness',
    d: 'Divide throughput by hourly instance cost. The winner is inferences-per-second-per-dollar — not the biggest GPU.',
  },
  {
    t: 'Implement Auto-Scaling',
    d: 'Place the chosen type in an auto-scaling group so you only pay for the capacity you need at any moment.',
  },
];

const INFER_OPTS = [
  { id: 'cpu', name: 'CPU (quantized)', rps: 40, rate: 0.17, note: 'Often enough after quantization / compilation.' },
  { id: 't4', name: 'T4 GPU', rps: 180, rate: 0.53, note: 'Solid if the model still needs a GPU.' },
  { id: 'a10', name: 'A10G', rps: 320, rate: 1.2, note: 'Highest rps — rarely the best $ per inference.' },
];

function AutoScaleScene() {
  const [traffic, setTraffic] = useState(35);
  const replicas = traffic < 25 ? 1 : traffic < 70 ? 2 : 3;
  const hourly = replicas * 0.17;

  return (
    <div className="rounded-2xl bg-white p-4 mb-3">
      <div className="text-[10px] font-bold text-gray-500 text-center mb-2">Auto-Scaling Group</div>
      <div className="flex justify-center mb-2">
        <div className="rounded-lg bg-amber-200 text-amber-900 px-3 py-1 text-[10px] font-bold">
          User Traffic · {traffic}%
        </div>
      </div>
      <input
        type="range"
        min={5}
        max={100}
        value={traffic}
        onChange={(e) => setTraffic(parseInt(e.target.value, 10))}
        className="w-full accent-lime-600 mb-3"
      />
      <div className="flex justify-center mb-3">
        <div className="rounded-lg bg-sky-200 text-sky-900 px-4 py-1.5 text-[11px] font-bold">Load Balancer</div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-emerald-200 text-emerald-900 w-24 h-24 flex items-center justify-center text-[10px] font-bold text-center px-2">
            Cloud Monitoring
          </div>
          <span className="text-[9px] text-emerald-700 mt-1 font-bold">Scale {replicas < 3 ? 'in/out' : 'out'}</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => {
            const on = n <= replicas;
            return (
              <div
                key={n}
                className={`rounded-lg border-2 px-2 py-3 text-[10px] font-bold w-16 text-center transition-all duration-500 ${
                  on ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-gray-50 text-gray-300'
                }`}
              >
                VM {n}
                <div className="text-[8px] mt-1">{on ? 'serving' : 'stopped'}</div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[10px] text-gray-500 text-center mt-3">
        {replicas} instance{replicas === 1 ? '' : 's'} live · ~{hourly.toFixed(2)}/hr. Drag traffic — you
        only pay for the VMs that are actually serving requests.
      </p>
    </div>
  );
}

export function InferenceRightSizeVisualizer() {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState('cpu');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Right-sizing inference</h3>
        <p className="text-gray-400 text-sm">The metric is performance-per-dollar — inferences / second / dollar.</p>
      </div>

      <div className="flex justify-center gap-1.5 mb-3 flex-wrap">
        {INFER_STEPS.map((s, i) => (
          <button
            key={s.t}
            type="button"
            onClick={() => setStep(i)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition ${
              i === step ? 'bg-lime-600 text-white' : i < step ? 'bg-gray-700 text-gray-300' : 'bg-gray-800 text-gray-500'
            }`}
          >
            {i + 1}. {s.t.split(' ')[0]}
          </button>
        ))}
      </div>

      {step < 3 && (
        <>
          <div className="flex justify-center gap-2 mb-3 flex-wrap">
            {INFER_OPTS.map((o) => {
              const ppd = o.rps / o.rate;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setSel(o.id)}
                  className={`rounded-xl border-2 px-3 py-2 text-center w-[130px] transition ${
                    sel === o.id ? 'border-lime-400 bg-lime-500/20' : 'border-gray-700 bg-gray-900/60'
                  }`}
                >
                  <div className="text-[11px] font-bold text-white">{o.name}</div>
                  <div className="text-[9px] font-mono text-gray-400 mt-0.5">
                    {o.rps} rps · {money(o.rate)}/hr
                  </div>
                  {step >= 2 && (
                    <div className="text-[10px] font-bold text-lime-300 mt-1">{ppd.toFixed(0)} inf/$</div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3 mb-2">
            <div className="text-xs font-bold text-white mb-1">
              {step + 1}. {INFER_STEPS[step].t}
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{INFER_STEPS[step].d}</p>
            {step >= 2 && (
              <p className="text-[11px] text-lime-300 mt-2 font-mono">
                {INFER_OPTS.find((o) => o.id === sel).name}: {INFER_OPTS.find((o) => o.id === sel).rps} rps ÷{' '}
                {money(INFER_OPTS.find((o) => o.id === sel).rate)} ={' '}
                {(INFER_OPTS.find((o) => o.id === sel).rps / INFER_OPTS.find((o) => o.id === sel).rate).toFixed(0)}{' '}
                inferences per dollar-hour
              </p>
            )}
          </div>
        </>
      )}

      {step === 3 && <AutoScaleScene />}

      <Nav
        step={step}
        max={INFER_STEPS.length - 1}
        onBack={() => setStep((s) => s - 1)}
        onNext={() => setStep((s) => s + 1)}
        onReset={() => setStep(0)}
      />

      {step === 3 && (
        <div className="mt-3">
          <NoteBox tone="emerald">
            A large GPU is frequently overkill for inference. Quantization and compilation can make the
            model small enough for CPUs or cheaper accelerators — then auto-scaling matches the replica
            count to live traffic.
          </NoteBox>
        </div>
      )}
    </div>
  );
}

/* ── 5. Practice scenario ─────────────────────────────────────────────────── */

const SCENARIO = [
  { k: 'Workload', v: 'Train ResNet-101 for image classification' },
  { k: 'Hardware', v: 'Single NVIDIA A10G GPU' },
  { k: 'Duration', v: '100 hours to target accuracy' },
  { k: 'Fault tolerance', v: 'Checkpoint to object storage every hour → Spot-eligible' },
  { k: 'Final artifact', v: '400 MB trained model' },
];

const PRICE_ROWS = [
  { id: 'od', svc: 'On-Demand Instance', price: '$1.20 / hour', notes: 'Billed per second, no commitment.' },
  { id: 'ri', svc: '1-Year Reserved Instance', price: '$0.72 / hour (effective)', notes: 'Requires a 1-year upfront commitment.' },
  { id: 'spot', svc: 'Spot Instance', price: '$0.36 / hour (average)', notes: 'Price fluctuates; 70% average discount.' },
  { id: 'int', svc: 'Spot Interruption Rate', price: '1 interruption / 24 hours', notes: 'An assumption for this workload.' },
  { id: 'oh', svc: 'Interruption Overhead', price: '15 minutes', notes: 'Time lost to restart from checkpoint.' },
  { id: 'eg', svc: 'Data Egress', price: '$0.09 / GB', notes: 'Cost to transfer data out of the cloud.' },
];

export function JobScenarioVisualizer() {
  const [row, setRow] = useState('od');
  const cur = PRICE_ROWS.find((r) => r.id === row);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Scenario: training a computer vision model</h3>
        <p className="text-gray-400 text-sm">Same A10G job. Three pricing models. Tap a worksheet row.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        {SCENARIO.map((s) => (
          <div key={s.k} className="rounded-xl border border-gray-700 bg-gray-900/60 px-3 py-2">
            <div className="text-[9px] uppercase text-lime-400 font-bold">{s.k}</div>
            <div className="text-[11px] text-white mt-0.5">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-700 overflow-hidden text-[11px] mb-3">
        <div className="grid grid-cols-3 bg-gray-800 font-bold text-gray-300">
          <div className="px-2 py-1.5">Service / Instance</div>
          <div className="px-2 py-1.5">Unit Price</div>
          <div className="px-2 py-1.5">Notes</div>
        </div>
        {PRICE_ROWS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRow(r.id)}
            className={`grid grid-cols-3 w-full text-left border-t border-gray-700 ${
              row === r.id ? 'bg-lime-500/15' : 'bg-gray-900/60 hover:bg-gray-800/80'
            }`}
          >
            <div className="px-2 py-1.5 text-white">{r.svc}</div>
            <div className="px-2 py-1.5 font-mono text-lime-300">{r.price}</div>
            <div className="px-2 py-1.5 text-gray-400">{r.notes}</div>
          </button>
        ))}
      </div>

      <NoteBox>
        <strong className="text-white">{cur.svc}.</strong> {cur.notes} The next slides walk each
        calculation — On-Demand as the baseline, then Reserved, then Spot with interruption overhead, then
        a 400 MB egress add-on.
      </NoteBox>
    </div>
  );
}

/* ── 6. Three calculations ────────────────────────────────────────────────── */

const CALC_TABS = [
  { id: 'od', label: '1 · On-Demand' },
  { id: 'ri', label: '2 · Reserved' },
  { id: 'spot', label: '3 · Spot' },
];

export function JobCalcVisualizer() {
  const [tab, setTab] = useState('od');
  const [spotStep, setSpotStep] = useState(0);

  const od = 1.2 * 100;
  const ri = 0.72 * 100;
  const interruptions = Math.ceil(100 / 24);
  const overheadH = (interruptions * 15) / 60;
  const billable = 100 + overheadH;
  const spot = billable * 0.36;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Walk the three calculations</h3>
        <p className="text-gray-400 text-sm">Same 100-hour A10G job. Different rate — and Spot has extra hours.</p>
      </div>

      <Tabs options={CALC_TABS} value={tab} onChange={setTab} />

      {tab === 'od' && (
        <>
          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3 text-center">
            <div className="font-mono text-sm text-gray-300 mb-2">Cost = Hourly Rate × Duration</div>
            <div className="font-mono text-lg text-white">
              $1.20/hr × 100 h = <span className="text-rose-300 font-bold">{money(od)}</span>
            </div>
          </div>
          <NoteBox tone="rose">
            Maximum flexibility, no commitment — and the most expensive option. This is the baseline every
            other model is measured against.
          </NoteBox>
        </>
      )}

      {tab === 'ri' && (
        <>
          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3 text-center">
            <div className="font-mono text-sm text-gray-300 mb-2">Cost = Effective Hourly Rate × Duration</div>
            <div className="font-mono text-lg text-white">
              $0.72/hr × 100 h = <span className="text-amber-300 font-bold">{money(ri)}</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-2">40% cheaper than On-Demand on this job</div>
          </div>
          <NoteBox tone="amber">
            A 40% saving vs On-Demand — but the organization is committed to this instance for a full year.
            Only cost-effective if you have a continuous stream of work to keep it utilized for most of the
            term. A single 100-hour job does not by itself justify a 1-year RI.
          </NoteBox>
        </>
      )}

      {tab === 'spot' && (
        <>
          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3 space-y-3">
            {[
              {
                t: 'Expected interruptions',
                f: '100 h ÷ 24 h/interruption ≈ 4.17 → round up to 5',
              },
              {
                t: 'Restart overhead',
                f: '5 × 15 min = 75 min = 1.25 hours',
              },
              {
                t: 'Total billable time',
                f: '100 + 1.25 = 101.25 hours',
              },
              {
                t: 'Spot compute cost',
                f: `101.25 h × $0.36/hr = ${money(spot)}`,
              },
            ].map((s, i) => (
              <button
                key={s.t}
                type="button"
                onClick={() => setSpotStep(i)}
                className={`w-full text-left rounded-xl border px-3 py-2 transition ${
                  spotStep === i ? 'border-lime-400 bg-lime-500/15' : 'border-gray-700 bg-gray-900/60'
                }`}
              >
                <div className="text-[10px] uppercase text-gray-500">
                  {i + 1}. {s.t}
                </div>
                <div className="font-mono text-[12px] text-white mt-0.5">{s.f}</div>
              </button>
            ))}
          </div>
          <NoteBox tone="emerald">
            Spot must include interruption overhead — here 1.25 extra hours. Even then, compute is{' '}
            {money(spot)} vs {money(od)} On-Demand. The job is checkpointed hourly, so it is a natural
            Spot candidate.
          </NoteBox>
        </>
      )}
    </div>
  );
}

/* ── 7. Egress + summary ──────────────────────────────────────────────────── */

export function JobSummaryVisualizer() {
  const [showEgress, setShowEgress] = useState(true);
  const egress = 0.4 * 0.09;
  const rows = [
    { id: 'od', name: 'On-Demand', compute: 120, color: 'bg-sky-500', save: '0%' },
    { id: 'ri', name: 'Reserved', compute: 72, color: 'bg-emerald-500', save: '~40%' },
    { id: 'spot', name: 'Spot', compute: 36.45, color: 'bg-orange-500', save: '~70%' },
  ];
  const max = 130;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Don&apos;t forget egress — then compare</h3>
        <p className="text-gray-400 text-sm">400 MB model = 0.4 GB × $0.09 = $0.036. Tiny here; huge at TB scale.</p>
      </div>

      <div className="flex justify-center mb-3">
        <button
          type="button"
          onClick={() => setShowEgress((v) => !v)}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
            showEgress ? 'bg-lime-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          {showEgress ? 'Egress included ($0.04)' : 'Compute only'}
        </button>
      </div>

      <div className="rounded-2xl bg-white p-4 mb-3">
        <div className="text-center text-xs font-bold text-gray-700 mb-3">
          Cost Comparison for a 100-Hour GPU Training Job
        </div>
        <div className="flex items-end justify-center gap-8 h-48">
          {rows.map((r) => {
            const total = r.compute + (showEgress ? egress : 0);
            return (
              <div key={r.id} className="flex flex-col items-center h-full justify-end">
                <span className="text-[10px] font-bold text-gray-700 mb-1">{money(total)}</span>
                <div
                  className={`w-16 rounded-t ${r.color} transition-all duration-500`}
                  style={{ height: `${(total / max) * 100}%` }}
                />
                <span className="text-[10px] text-gray-600 mt-2">{r.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-gray-700 overflow-hidden text-[11px] mb-3">
        <div className="grid grid-cols-4 bg-gray-800 font-bold text-gray-300">
          <div className="px-2 py-1.5">Model</div>
          <div className="px-2 py-1.5">Compute</div>
          <div className="px-2 py-1.5">Total + egress</div>
          <div className="px-2 py-1.5">vs On-Demand</div>
        </div>
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-4 border-t border-gray-700 bg-gray-900/60">
            <div className="px-2 py-1.5 text-white">{r.name}</div>
            <div className="px-2 py-1.5 font-mono text-gray-300">{money(r.compute)}</div>
            <div className="px-2 py-1.5 font-mono text-white">{money(r.compute + egress)}</div>
            <div className="px-2 py-1.5 text-emerald-400 font-bold">{r.save}</div>
          </div>
        ))}
      </div>

      <NoteBox tone="lime">
        Fault-tolerant, not time-critical work belongs on <strong className="text-white">Spot</strong>.
        Predictable long-running needs fit <strong className="text-white">Reserved</strong>.{' '}
        <strong className="text-white">On-Demand</strong> is for short, urgent, or pre-commitment
        benchmarking. Run these projections before launching major workloads.
      </NoteBox>
    </div>
  );
}
