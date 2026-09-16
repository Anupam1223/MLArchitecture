import React, { useState } from 'react';
import {
  Server,
  HardDrive,
  AlertTriangle,
  Check,
  Users,
  Tag,
  Bell,
  Archive,
  Trash2,
  Globe,
  Database,
  Activity,
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
            value === o.id ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
        className="px-4 py-1.5 rounded-lg bg-cyan-600 text-xs font-bold text-white disabled:opacity-30"
      >
        Next →
      </button>
    </div>
  );
}

function NoteBox({ children, tone = 'cyan' }) {
  const map = {
    cyan: 'border-cyan-400/40 bg-cyan-500/10',
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

/* ── 1. Cost reduction map ────────────────────────────────────────────────── */

const STRATS = [
  { id: 'spot', n: '01', title: 'Spot + Checkpointing', sub: 'Fault-tolerant training at ~10–30% of On-Demand' },
  { id: 'scale', n: '02', title: 'Auto-Scaling Inference', sub: 'Match instance count to live traffic' },
  { id: 'sched', n: '03', title: 'Schedule Idle Resources', sub: 'Stop dev/staging outside work hours' },
  { id: 'store', n: '04', title: 'Storage & Transfer', sub: 'Tiers, lifecycle, egress control' },
  { id: 'watch', n: '05', title: 'Monitor · Tag · Budget', sub: 'Visibility, accountability, guardrails' },
];

export function CostReductionMapVisualizer() {
  const [sel, setSel] = useState('spot');
  const cur = STRATS.find((s) => s.id === sel);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Strategies for reducing cloud compute costs</h3>
        <p className="text-gray-400 text-sm">Pricing models pick the rate. These strategies cut the hours and the waste.</p>
      </div>

      <div className="space-y-2 mb-4">
        {STRATS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSel(s.id)}
            className={`w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${
              sel === s.id
                ? 'border-cyan-400 bg-cyan-500/20'
                : 'border-gray-700 bg-gray-900/60 hover:border-gray-600'
            }`}
          >
            <span className="text-[11px] font-mono text-cyan-400">{s.n}</span>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">{s.title}</div>
              <div className="text-[11px] text-gray-400">{s.sub}</div>
            </div>
            {sel === s.id && <Check className="w-4 h-4 text-cyan-300" />}
          </button>
        ))}
      </div>

      <NoteBox>
        <strong className="text-white">{cur.title}.</strong> This part walks each strategy as an interactive
        scene — Spot training that survives reclaim, inference that scales with traffic, clocks that shut
        boxes down, storage that ages itself, and budgets that page you before the invoice does.
      </NoteBox>
    </div>
  );
}

/* ── 2. Spot training lifecycle ───────────────────────────────────────────── */

const SPOT_STEPS = [
  {
    t: 'Job starts on Spot',
    d: 'You request spare capacity at a deep discount. Training begins like any other run — weights warm up, loss starts falling.',
  },
  {
    t: 'Checkpoint written',
    d: 'Every epoch (or every N batches) the script saves model weights, optimizer state, epoch number and data-loader position to durable storage.',
  },
  {
    t: '2-minute reclaim warning',
    d: 'The provider needs the GPU back. A well-built job finishes the current step, flushes a final checkpoint, and exits cleanly.',
  },
  {
    t: 'Instance terminated',
    d: 'The VM is gone. Anything not on durable storage is lost — which is why the checkpoint is the entire safety net.',
  },
  {
    t: 'Fleet replaces · resume',
    d: 'A managed Spot Fleet (or ASG) pulls a new instance from another capacity pool. The script sees the checkpoint and continues from epoch N — not epoch 0.',
  },
];

const REQUIREMENTS = [
  {
    id: 'ckpt',
    n: '1',
    title: 'Implement Checkpointing',
    body: 'Your training script must periodically save its state. This includes not just the model weights but also the optimizer’s state, the current epoch number, and the data loader’s position. Most modern frameworks like PyTorch and TensorFlow have utilities to facilitate this.',
    chips: ['model weights', 'optimizer state', 'epoch number', 'data-loader position'],
  },
  {
    id: 'resume',
    n: '2',
    title: 'Create Resume-from-Checkpoint Logic',
    body: 'Your script needs a mechanism to detect if a checkpoint exists upon startup. If it does, it should load the state and resume training from that point, rather than starting from scratch.',
    chips: ['detect ckpt on start', 'load state', 'continue — don’t restart'],
  },
  {
    id: 'fleet',
    n: '3',
    title: 'Use Managed Spot Services',
    body: 'Instead of requesting a single Spot Instance, use a managed service like an AWS Spot Fleet or an auto-scaling group configured to use Spot Instances. These services can automatically request new Spot Instances from different capacity pools if your current ones are reclaimed, increasing the stability of your workload.',
    chips: ['Spot Fleet / ASG', 'multi-pool capacity', 'auto-replace on reclaim'],
  },
];

export function SpotTrainingVisualizer() {
  const [tab, setTab] = useState('loop');
  const [step, setStep] = useState(0);
  const [req, setReq] = useState('ckpt');
  const [every, setEvery] = useState(1);
  const hasCkpt = step >= 1;
  const alive = step < 3;
  const resumed = step >= 4;
  const curReq = REQUIREMENTS.find((r) => r.id === req);
  const epochHours = 2;
  const workLostHours = every * epochHours * 0.5;
  const ioOverheadPct = Math.min(40, Math.round(18 / every));

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Spot training that survives reclaim</h3>
        <p className="text-gray-400 text-sm">Build resilience into the training process.</p>
      </div>

      <Tabs
        options={[
          { id: 'loop', label: 'The reclaim loop' },
          { id: 'reqs', label: 'Three requirements' },
          { id: 'freq', label: 'Checkpoint frequency' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'loop' && (
        <>
          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
            <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
              <div
                className={`rounded-xl border-2 px-4 py-3 w-36 text-center transition ${
                  alive && step > 0
                    ? 'border-emerald-400 bg-emerald-500/20'
                    : step >= 3
                      ? 'border-rose-500 bg-rose-500/15 opacity-50'
                      : 'border-gray-700 bg-gray-900/60'
                }`}
              >
                <Server
                  className={`w-6 h-6 mx-auto mb-1 ${alive && step > 0 ? 'text-emerald-300' : 'text-gray-500'}`}
                />
                <div className="text-[11px] font-bold text-white">Spot GPU</div>
                <div className="text-[9px] font-mono text-emerald-400">~$0.40 / hr</div>
                <div className="text-[9px] text-gray-400 mt-0.5">
                  {step === 0 && 'starting…'}
                  {step === 1 && 'epoch 12 · training'}
                  {step === 2 && '⚠ reclaim in 2 min'}
                  {step >= 3 && !resumed && 'terminated'}
                  {resumed && 'replaced · resumed'}
                </div>
              </div>

              <div className="text-gray-600 text-lg">→</div>

              <div
                className={`rounded-xl border-2 px-4 py-3 w-40 text-center transition ${
                  hasCkpt ? 'border-sky-400 bg-sky-500/15' : 'border-gray-700 bg-gray-900/60'
                }`}
              >
                <HardDrive
                  className={`w-6 h-6 mx-auto mb-1 ${hasCkpt ? 'text-sky-300' : 'text-gray-500'}`}
                />
                <div className="text-[11px] font-bold text-white">Durable storage</div>
                <div className="text-[9px] text-gray-400 mt-0.5 font-mono">
                  {hasCkpt ? 'ckpt-epoch-12.pt' : 'no checkpoint yet'}
                </div>
                {hasCkpt && (
                  <div className="text-[8px] text-sky-300 mt-1">weights · optimizer · epoch · loader</div>
                )}
              </div>

              <div className="text-gray-600 text-lg">→</div>

              <div
                className={`rounded-xl border-2 px-4 py-3 w-36 text-center transition ${
                  resumed ? 'border-cyan-400 bg-cyan-500/20' : 'border-gray-700 bg-gray-900/60 opacity-50'
                }`}
              >
                <Activity
                  className={`w-6 h-6 mx-auto mb-1 ${resumed ? 'text-cyan-300' : 'text-gray-500'}`}
                />
                <div className="text-[11px] font-bold text-white">Spot Fleet</div>
                <div className="text-[9px] text-gray-400 mt-0.5">
                  {resumed ? 'new capacity found' : 'waiting…'}
                </div>
              </div>
            </div>

            <div className="mb-1 flex justify-between text-[9px] text-gray-500">
              <span>training progress</span>
              <span>{resumed ? 'epoch 12 → continuing' : step >= 1 ? 'epoch 12 saved' : 'epoch 0'}</span>
            </div>
            <div className="h-3 rounded bg-gray-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${resumed ? 'bg-cyan-500' : 'bg-emerald-500'}`}
                style={{ width: `${step === 0 ? 5 : resumed ? 55 : 40}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3 mb-2">
            <div className="text-xs font-bold text-white mb-1">
              {step + 1}. {SPOT_STEPS[step].t}
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{SPOT_STEPS[step].d}</p>
          </div>

          <Nav
            step={step}
            max={SPOT_STEPS.length - 1}
            onBack={() => setStep((s) => s - 1)}
            onNext={() => setStep((s) => s + 1)}
            onReset={() => setStep(0)}
          />
        </>
      )}

      {tab === 'reqs' && (
        <>
          <div className="flex gap-2 mb-3 flex-wrap justify-center">
            {REQUIREMENTS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setReq(r.id)}
                className={`rounded-xl border-2 px-3 py-2 text-left transition min-w-[140px] ${
                  req === r.id
                    ? 'border-cyan-400 bg-cyan-500/20'
                    : 'border-gray-700 bg-gray-900/60 hover:border-gray-600'
                }`}
              >
                <div className="text-[9px] font-mono text-cyan-400">Requirement {r.n}</div>
                <div className="text-[11px] font-bold text-white leading-tight mt-0.5">{r.title}</div>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
            {req === 'ckpt' && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {['weights', 'optimizer', 'epoch #', 'loader pos'].map((c) => (
                  <div
                    key={c}
                    className="rounded-lg border-2 border-sky-400 bg-sky-500/20 px-3 py-2 text-[11px] font-bold text-sky-100"
                  >
                    💾 {c}
                  </div>
                ))}
                <div className="w-full text-center text-gray-500 text-lg">↓</div>
                <div className="rounded-xl border-2 border-sky-400 bg-sky-500/15 px-4 py-3 text-center">
                  <HardDrive className="w-5 h-5 mx-auto text-sky-300 mb-1" />
                  <div className="text-[11px] font-bold text-white">Durable storage (S3 / GCS)</div>
                  <div className="text-[9px] font-mono text-gray-400">ckpt-epoch-12.pt</div>
                </div>
              </div>
            )}

            {req === 'resume' && (
              <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                <div className="rounded-xl border-2 border-violet-400 bg-violet-500/15 px-4 py-3 text-center w-32">
                  <Server className="w-5 h-5 mx-auto text-violet-300 mb-1" />
                  <div className="text-[11px] font-bold text-white">New instance</div>
                  <div className="text-[9px] text-gray-400">script starts</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-cyan-300 font-bold">detect ckpt?</div>
                  <div className="text-gray-500">→</div>
                </div>
                <div className="space-y-2">
                  <div className="rounded-lg border border-emerald-400 bg-emerald-500/20 px-3 py-2 text-[10px] text-emerald-100">
                    <strong>Yes</strong> → load · resume at epoch 12
                  </div>
                  <div className="rounded-lg border border-rose-400/50 bg-rose-500/10 px-3 py-2 text-[10px] text-rose-200">
                    <strong>No</strong> → start from scratch (epoch 0)
                  </div>
                </div>
              </div>
            )}

            {req === 'fleet' && (
              <div className="mb-4">
                <div className="text-[10px] uppercase text-gray-500 text-center mb-2">Spot Fleet / ASG</div>
                <div className="flex justify-center gap-2 mb-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`rounded-lg border-2 px-2 py-2 w-14 text-center ${
                        i === 1
                          ? 'border-rose-500 bg-rose-500/20 opacity-40'
                          : 'border-emerald-400 bg-emerald-500/20'
                      }`}
                    >
                      <Server
                        className={`w-4 h-4 mx-auto ${i === 1 ? 'text-rose-400' : 'text-emerald-300'}`}
                      />
                      <div className="text-[8px] text-white mt-0.5">{i === 1 ? 'gone' : `n${i}`}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px]">
                  <div className="rounded-lg border border-gray-600 bg-gray-800 px-2 py-1 text-gray-400">
                    pool A
                  </div>
                  <span className="text-rose-400 font-bold">reclaim</span>
                  <span className="text-gray-500">→</span>
                  <div className="rounded-lg border border-cyan-400 bg-cyan-500/20 px-2 py-1 text-cyan-200 font-bold">
                    pull from pool B
                  </div>
                  <span className="text-gray-500">→</span>
                  <div className="rounded-lg border border-emerald-400 bg-emerald-500/20 px-2 py-1 text-emerald-200">
                    fleet back to 4
                  </div>
                </div>
              </div>
            )}

            <NoteBox tone="cyan">
              <strong className="text-white">
                {curReq.n}. {curReq.title}.
              </strong>{' '}
              {curReq.body}
            </NoteBox>

            <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
              {curReq.chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] text-cyan-200"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'freq' && (
        <>
          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Checkpoint every N epochs</span>
              <span className="font-mono text-cyan-300">N = {every}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={every}
              onChange={(e) => setEvery(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500 mb-4"
            />

            <div className="flex gap-1 mb-2">
              {Array.from({ length: 10 }).map((_, i) => {
                const isCkpt = (i + 1) % every === 0;
                return (
                  <div
                    key={i}
                    className={`flex-1 h-10 rounded flex items-center justify-center text-[9px] font-bold transition ${
                      isCkpt ? 'bg-sky-500 text-white' : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {isCkpt ? '💾' : `e${i + 1}`}
                  </div>
                );
              })}
            </div>
            <div className="text-[9px] text-gray-500 text-center mb-4">
              Blue = write checkpoint · gray = train only
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-center">
                <div className="text-[10px] uppercase text-rose-300">Work lost on reclaim</div>
                <div className="text-2xl font-bold font-mono text-white">~{workLostHours.toFixed(1)}h</div>
              </div>
              <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-3 text-center">
                <div className="text-[10px] uppercase text-amber-300">I/O overhead</div>
                <div className="text-2xl font-bold font-mono text-white">~{ioOverheadPct}%</div>
              </div>
            </div>
          </div>

          <NoteBox tone={every === 1 ? 'sky' : every <= 3 ? 'emerald' : 'amber'}>
            Choosing how often to save involves a trade-off. Saving too frequently adds I/O overhead and
            can slow training. Saving too infrequently means you lose more work when an instance is
            preempted. A common strategy is to checkpoint at the end of every epoch — or every N batches
            for very long epochs.
          </NoteBox>
        </>
      )}
    </div>
  );
}

/* ── 3. Checkpoint frequency trade-off ────────────────────────────────────── */

export function CheckpointFrequencyVisualizer() {
  const [every, setEvery] = useState(1); // every N epochs
  const epochHours = 2;
  const workLostHours = every * epochHours * 0.5; // assume reclaim mid-window on average
  const ioOverheadPct = Math.min(40, Math.round(18 / every));

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">How often should you checkpoint?</h3>
        <p className="text-gray-400 text-sm">Too often slows training. Too rarely loses more work on reclaim.</p>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>Checkpoint every N epochs</span>
          <span className="font-mono text-cyan-300">N = {every}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={every}
          onChange={(e) => setEvery(parseInt(e.target.value, 10))}
          className="w-full accent-cyan-500 mb-4"
        />

        {/* timeline of epochs */}
        <div className="flex gap-1 mb-2">
          {Array.from({ length: 10 }).map((_, i) => {
            const isCkpt = (i + 1) % every === 0;
            return (
              <div
                key={i}
                className={`flex-1 h-10 rounded flex items-center justify-center text-[9px] font-bold transition ${
                  isCkpt ? 'bg-sky-500 text-white' : 'bg-gray-800 text-gray-500'
                }`}
              >
                {isCkpt ? '💾' : `e${i + 1}`}
              </div>
            );
          })}
        </div>
        <div className="text-[9px] text-gray-500 text-center mb-4">
          Blue cells write a checkpoint · gray cells only train
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-center">
            <div className="text-[10px] uppercase text-rose-300">Work lost on reclaim</div>
            <div className="text-2xl font-bold font-mono text-white">~{workLostHours.toFixed(1)}h</div>
            <div className="text-[9px] text-gray-400">average mid-window reclaim</div>
          </div>
          <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-3 text-center">
            <div className="text-[10px] uppercase text-amber-300">I/O overhead</div>
            <div className="text-2xl font-bold font-mono text-white">~{ioOverheadPct}%</div>
            <div className="text-[9px] text-gray-400">of step time spent saving</div>
          </div>
        </div>
      </div>

      <NoteBox tone={every === 1 ? 'sky' : every <= 3 ? 'emerald' : 'amber'}>
        {every === 1 && (
          <>
            <strong className="text-white">Every epoch is the common default.</strong> For long epochs,
            also checkpoint every N batches inside the epoch so a reclaim mid-epoch does not throw away
            hours of work.
          </>
        )}
        {every > 1 && every <= 3 && (
          <>
            A sensible middle ground for many jobs: less I/O than every-epoch, still bounded loss if the
            instance dies.
          </>
        )}
        {every > 3 && (
          <>
            <strong className="text-white">Risky on Spot.</strong> A reclaim can wipe {workLostHours.toFixed(0)}+
            hours. The discount is worthless if you keep replaying the same epochs.
          </>
        )}
      </NoteBox>
    </div>
  );
}

/* ── 4. Auto-scaling inference ────────────────────────────────────────────── */

const SCALE_METRICS = [
  { id: 'cpu', label: 'CPU Utilization', sub: 'general purpose', target: 60 },
  { id: 'gpu', label: 'GPU Utilization', sub: 'GPU-accelerated models', target: 60 },
  { id: 'req', label: 'Request Count / Target', sub: 'requests per instance', target: 70 },
  { id: 'queue', label: 'Queue Length', sub: 'e.g. SQS buffer', target: 50 },
];

export function AutoScaleVisualizer() {
  const [load, setLoad] = useState(35);
  const [metric, setMetric] = useState('gpu');
  const [cooldown, setCooldown] = useState(true);
  const [lastAction, setLastAction] = useState(null); // 'out' | 'in' | null — for cooldown demo
  const cur = SCALE_METRICS.find((m) => m.id === metric);
  const target = cur.target;

  let desired = 2;
  if (load > 85) desired = 4;
  else if (load > target) desired = 3;
  else if (load < 30) desired = 1;

  // With cooldown ON after a scale action, hold instance count briefly in the UI narrative
  // (we simulate: if cooldown and we just scaled, show "cooling down" instead of immediate reverse)
  const wouldScaleOut = load > target;
  const wouldScaleIn = load < 30;
  const blocked =
    cooldown &&
    lastAction &&
    ((lastAction === 'out' && wouldScaleIn) || (lastAction === 'in' && wouldScaleOut));

  let instances = desired;
  if (blocked && lastAction === 'out') instances = Math.max(desired, 3);
  if (blocked && lastAction === 'in') instances = Math.min(desired, 2);

  const scaling = blocked
    ? 'cooldown'
    : wouldScaleOut
      ? 'out'
      : wouldScaleIn && instances <= 1
        ? 'in'
        : 'steady';

  const onLoadChange = (v) => {
    const nextOut = v > target;
    const nextIn = v < 30;
    if (!cooldown) {
      if (nextOut) setLastAction('out');
      else if (nextIn) setLastAction('in');
      else setLastAction(null);
    } else {
      // record action only when crossing into a new scaling direction from steady
      if (nextOut && lastAction !== 'out') setLastAction('out');
      else if (nextIn && lastAction !== 'in') setLastAction('in');
      else if (!nextOut && !nextIn) setLastAction(null);
    }
    setLoad(v);
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Auto-scaling for inference</h3>
        <p className="text-gray-400 text-sm">Metric → threshold → cooldown. Then drag the load.</p>
      </div>

      {/* metric picker */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-3">
        {SCALE_METRICS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMetric(m.id);
              setLastAction(null);
            }}
            className={`rounded-lg border-2 px-2.5 py-1.5 text-left transition ${
              metric === m.id
                ? 'border-cyan-400 bg-cyan-500/20'
                : 'border-gray-700 bg-gray-900/60 hover:border-gray-600'
            }`}
          >
            <div className="text-[10px] font-bold text-white">{m.label}</div>
            <div className="text-[8px] text-gray-500">{m.sub}</div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
        <div className="flex items-start justify-center gap-3 mb-4 flex-wrap">
          <div className="rounded-xl border border-gray-600 bg-gray-800 px-3 py-2 text-center w-24">
            <Users className="w-5 h-5 mx-auto text-gray-300 mb-1" />
            <div className="text-[10px] font-bold text-white">User Traffic</div>
            <div className="text-[9px] font-mono text-cyan-300">{load}%</div>
          </div>
          <span className="self-center text-gray-600">→</span>
          <div className="rounded-xl border border-violet-400/50 bg-violet-500/15 px-3 py-2 text-center w-28">
            <div className="text-[10px] font-bold text-violet-200">Load Balancer</div>
            <div className="text-[9px] text-gray-400">distributes</div>
          </div>
          <span className="self-center text-gray-600">→</span>
          <div className="rounded-xl border-2 border-dashed border-sky-400/60 bg-sky-500/10 px-3 py-2 min-w-[220px]">
            <div className="text-[9px] uppercase text-sky-300 mb-2 text-center">Auto-Scaling Group</div>
            <div className="flex gap-1.5 justify-center flex-wrap">
              {Array.from({ length: instances }).map((_, i) => {
                const isNew = i === instances - 1 && scaling === 'out';
                return (
                  <div
                    key={i}
                    className={`rounded-lg border-2 px-2 py-2 w-[72px] text-center transition-all duration-500 ${
                      isNew
                        ? 'border-dashed border-cyan-300 bg-cyan-500/30 animate-pulse'
                        : 'border-sky-400 bg-sky-500/20'
                    }`}
                  >
                    <Server className="w-4 h-4 mx-auto text-sky-300" />
                    <div className="text-[8px] text-white mt-0.5">
                      {isNew ? `Instance ${i + 1} (added)` : `Inference ${i + 1}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
          <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-center">
            <div className="text-[10px] font-bold text-emerald-200">Cloud Monitoring Service</div>
            <div className="text-[9px] text-gray-400">{cur.label}</div>
          </div>
          {scaling === 'out' && (
            <div className="rounded-lg bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white">
              Scale-Out Signal (High Load)
            </div>
          )}
          {scaling === 'in' && (
            <div className="rounded-lg bg-amber-600 px-2.5 py-1 text-[10px] font-bold text-white">
              Scale-In Signal (Low Load)
            </div>
          )}
          {scaling === 'cooldown' && (
            <div className="rounded-lg bg-violet-600 px-2.5 py-1 text-[10px] font-bold text-white">
              Cooldown — waiting before next action
            </div>
          )}
          {scaling === 'steady' && (
            <div className="rounded-lg bg-gray-700 px-2.5 py-1 text-[10px] font-bold text-gray-300">
              Within target · steady
            </div>
          )}
        </div>

        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>
            {cur.label} (target {target}%)
          </span>
          <span className="font-mono">{load}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          value={load}
          onChange={(e) => onLoadChange(parseInt(e.target.value, 10))}
          className="w-full accent-cyan-500"
        />
        <div className="relative h-1 mt-1">
          <div
            className="absolute top-0 w-0.5 h-3 bg-amber-400"
            style={{ left: `${target}%` }}
            title="target threshold"
          />
        </div>
      </div>

      <div className="flex justify-center mb-3">
        <button
          type="button"
          onClick={() => {
            setCooldown((v) => !v);
            setLastAction(null);
          }}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
            cooldown ? 'bg-emerald-600 text-white' : 'bg-rose-700 text-white'
          }`}
        >
          Cooldown: {cooldown ? 'ON — prevents thrashing' : 'OFF — can thrash'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          ['1. Metric', cur.label],
          ['2. Threshold', `${target}% → out / <30% → in`],
          ['3. Cooldown', cooldown ? 'armed' : 'disabled'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-gray-700 bg-gray-900/60 px-2 py-2 text-center">
            <div className="text-[9px] uppercase text-gray-500">{k}</div>
            <div className="text-[10px] text-white font-medium mt-0.5">{v}</div>
          </div>
        ))}
      </div>

      <NoteBox
        tone={
          scaling === 'out' ? 'rose' : scaling === 'in' ? 'amber' : scaling === 'cooldown' ? 'violet' : 'emerald'
        }
      >
        {scaling === 'out' && (
          <>
            <strong className="text-white">Scale out.</strong> {cur.label} is above the {target}% target,
            so monitoring fires a scale-out signal and Instance {instances} is added to serve traffic. You
            pay for the extra capacity only while demand is high.
          </>
        )}
        {scaling === 'in' && (
          <>
            <strong className="text-white">Scale in.</strong> Load is quiet. The group removes capacity so
            you are not paying peak rates overnight.
          </>
        )}
        {scaling === 'cooldown' && (
          <>
            <strong className="text-white">Cooldown is holding.</strong> A scaling action just happened.
            Another reverse action is blocked until the new instance has time to warm up — that is what
            stops thrashing. Toggle cooldown OFF and slam the slider to see the difference.
          </>
        )}
        {scaling === 'steady' && (
          <>
            An auto-scaling group responds to high load — as detected by the monitoring service — by adding
            a new instance to the pool. Pick a metric above, then drag load past the amber target line.
          </>
        )}
      </NoteBox>
    </div>
  );
}

/* ── 5. Schedule idle resources ───────────────────────────────────────────── */

export function ScheduleIdleVisualizer() {
  const [on, setOn] = useState(true);
  const rate = 4.8; // $/hr
  const workStart = 8;
  const workEnd = 19; // 7pm
  const activeHours = on ? workEnd - workStart : 24;
  const daily = +(activeHours * rate).toFixed(0);
  const weeklyOn = daily * 5; // weekdays only when scheduled
  const weeklyOff = rate * 24 * 7;
  const weekly = on ? weeklyOn : weeklyOff;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Schedule and shut down idle resources</h3>
        <p className="text-gray-400 text-sm">Dev GPUs do not need to run at 3 AM — or all weekend.</p>
      </div>

      <div className="flex justify-center mb-3">
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
            on ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          Scheduling: {on ? 'ON · 8 AM–7 PM weekdays' : 'OFF · running 24/7'}
        </button>
      </div>

      <div className="rounded-2xl bg-white p-4 mb-3">
        <div className="text-center text-xs font-bold text-gray-700 mb-2">
          Cost Impact of Instance Scheduling
        </div>
        <div className="flex items-end gap-0.5 h-36 px-2">
          {Array.from({ length: 24 }).map((_, h) => {
            const active = on ? h >= workStart && h < workEnd : true;
            return (
              <div key={h} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    active ? 'bg-rose-500' : 'bg-sky-100'
                  }`}
                  style={{ height: active ? '85%' : '8%' }}
                  title={`${h}:00 — ${active ? `$${rate}` : '$0'}`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[9px] text-gray-500 mt-1 px-1 font-mono">
          <span>0</span>
          <span>8</span>
          <span>12</span>
          <span>19</span>
          <span>23</span>
        </div>
        <div className="flex justify-center gap-4 mt-2 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 rounded-sm bg-rose-500" /> Active (On)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 rounded-sm bg-sky-100 border border-sky-300" /> Idle (Off)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          ['Daily cost', money(daily)],
          ['Weekly cost', money(weekly)],
          ['Saved vs 24/7', on ? money(weeklyOff - weekly) + '/wk' : '—'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-gray-700 bg-gray-900/60 px-3 py-2 text-center">
            <div className="text-[9px] uppercase text-gray-500">{k}</div>
            <div className="text-sm font-bold text-white font-mono">{v}</div>
          </div>
        ))}
      </div>

      <NoteBox tone={on ? 'emerald' : 'rose'}>
        {on ? (
          <>
            <strong className="text-white">Tag non-prod resources</strong> (
            <span className="font-mono text-cyan-300">environment:dev</span>,{' '}
            <span className="font-mono text-cyan-300">owner:…</span>) then use AWS Instance Scheduler,
            Azure Automation, or a cron to stop at 7 PM and start before the workday. One GPU left over a
            weekend can waste hundreds of dollars.
          </>
        ) : (
          <>
            <strong className="text-white">24/7 on a quiet box is pure waste.</strong> Flip scheduling on
            and watch most of the day go to $0.
          </>
        )}
      </NoteBox>
    </div>
  );
}

/* ── 6. Storage tiers ─────────────────────────────────────────────────────── */

const TIERS = [
  {
    id: 'hot',
    label: 'Standard / Hot',
    cost: 0.023,
    costBar: 100,
    latency: 'Immediate Access',
    retrieval: 'None',
    use: 'Default high-performance tier. Highest $/GB, lowest latency, no retrieval fee. Use for active training datasets, live checkpoints, and anything that needs immediate access.',
    color: 'bg-rose-400',
    border: 'border-rose-400',
  },
  {
    id: 'ia',
    label: 'Infrequent Access',
    cost: 0.0125,
    costBar: 55,
    latency: 'Immediate Access',
    retrieval: 'Per-GB retrieval fee',
    use: 'Lower storage cost than Standard, but you pay per GB on every retrieve. Fit for older training sets, experiment artifacts, or models not in production that might be revisited.',
    color: 'bg-amber-400',
    border: 'border-amber-400',
  },
  {
    id: 'archive',
    label: 'Archive',
    cost: 0.004,
    costBar: 18,
    latency: 'Minutes to Hours',
    retrieval: 'Restore + fee',
    use: 'Extremely low storage cost for long-term retention. Retrieval takes minutes to hours. Ideal for compliance, final model backups, and raw data you will not touch for months or years. Deep archive is even colder.',
    color: 'bg-sky-400',
    border: 'border-sky-400',
  },
];

export function StorageTiersVisualizer() {
  const [sel, setSel] = useState('hot');
  const cur = TIERS.find((t) => t.id === sel);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Storage tier cost vs. retrieval time</h3>
        <p className="text-gray-400 text-sm">Cheaper to store usually means slower (or costlier) to get back.</p>
      </div>

      <div className="rounded-2xl bg-white p-4 mb-3">
        <div className="text-center text-xs font-bold text-gray-700 mb-3">
          Storage Tier Cost vs. Retrieval Time Trade-off
        </div>
        <div className="space-y-3">
          {[...TIERS].reverse().map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSel(t.id)}
              className={`w-full text-left transition ${sel === t.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-36 text-[10px] font-bold text-gray-700 shrink-0">{t.label}</span>
                <div className="flex-1 h-8 rounded bg-gray-100 overflow-hidden relative">
                  <div
                    className={`h-full ${t.color} transition-all duration-500 flex items-center px-2`}
                    style={{ width: `${t.costBar}%` }}
                  >
                    <span className="text-[9px] font-bold text-gray-900">
                      ${t.cost}/GB·mo
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-[9px] text-gray-500 pl-36">
                {t.latency}
                {t.retrieval !== 'None' ? ` · ${t.retrieval}` : ''}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-3 flex-wrap">
        {TIERS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSel(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition ${
              sel === t.id ? `${t.border} bg-gray-900 text-white` : 'border-gray-700 text-gray-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <NoteBox tone={sel === 'hot' ? 'rose' : sel === 'ia' ? 'amber' : 'sky'}>
        <strong className="text-white">{cur.label}.</strong> {cur.use}
      </NoteBox>
    </div>
  );
}

/* ── 7. Egress fees ───────────────────────────────────────────────────────── */

export function EgressVisualizer() {
  const [path, setPath] = useState('same'); // same | onprem | region | user

  const PATHS = {
    same: {
      label: 'Same region: GPU ↔ Object Storage',
      fee: false,
      note: 'Transfers within the same cloud region are typically free. Keep the training cluster next to the bucket and this path stays off the bill.',
    },
    onprem: {
      label: 'Cloud → On-premise',
      fee: true,
      note: 'Downloading large datasets or models from the cloud to local or on-premise servers is egress — billed per GB.',
    },
    region: {
      label: 'Inter-region: us-east-1 → eu-west-1',
      fee: true,
      note: 'Moving data between geographic regions always incurs egress. The per-GB rate looks small until the dataset is terabytes.',
    },
    cloud: {
      label: 'Inter-cloud: AWS → GCP',
      fee: true,
      note: 'Sending data from one cloud provider to another is egress on the source side (and often ingress-free on the destination — you still pay to leave).',
    },
    user: {
      label: 'Serving users: API → internet',
      fee: true,
      note: 'Every prediction sent back to a user over the public internet is data egress. High-traffic inference services feel this quickly.',
    },
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The high cost of moving data</h3>
        <p className="text-gray-400 text-sm">Ingress is usually free. Egress almost never is. Tap a path.</p>
      </div>

      <div className="rounded-2xl bg-white p-4 mb-3">
        <div className="relative mx-auto max-w-lg">
          {/* region box */}
          <div className="rounded-xl border-2 border-gray-300 p-3 mb-3">
            <div className="text-[9px] uppercase text-gray-500 mb-2 text-center">Cloud Provider · us-east-1</div>
            <div className="flex justify-center gap-4">
              <div className="rounded-lg bg-sky-200 border border-sky-400 px-3 py-2 text-center">
                <div className="text-[10px] font-bold text-sky-900">GPU Instance</div>
              </div>
              <div className="rounded-lg bg-sky-200 border border-sky-400 px-3 py-2 text-center">
                <div className="text-[10px] font-bold text-sky-900">Object Storage</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPath('same')}
              className={`mt-2 mx-auto block text-[10px] font-bold px-2 py-0.5 rounded ${
                path === 'same' ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              Free Transfer (Same Region)
            </button>
          </div>

          {/* outbound targets */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'onprem', label: 'On-Premise Server', cls: 'bg-emerald-100 border-emerald-400 text-emerald-900' },
              { id: 'region', label: 'Another Region (eu-west-1)', cls: 'bg-white border-gray-400 text-gray-800' },
              { id: 'cloud', label: 'Another Cloud (GCP)', cls: 'bg-amber-100 border-amber-400 text-amber-900' },
              { id: 'user', label: 'End User', cls: 'bg-gray-700 border-gray-600 text-white' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setPath(t.id)}
                className={`rounded-lg border-2 px-2 py-3 text-center transition ${t.cls} ${
                  path === t.id ? 'ring-2 ring-rose-500 ring-offset-1' : ''
                }`}
              >
                <div className="text-[10px] font-bold">{t.label}</div>
                <div
                  className={`text-[8px] mt-1 font-bold ${
                    path === t.id ? 'text-rose-600' : 'text-rose-400'
                  }`}
                >
                  Egress Fee Charged
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <NoteBox tone={PATHS[path].fee ? 'rose' : 'emerald'}>
        <strong className="text-white">{PATHS[path].label}.</strong> {PATHS[path].note}
        {PATHS[path].fee && (
          <span className="block mt-1 text-xs text-rose-200">
            Charged per GB — terabyte datasets and chatty APIs escalate this quickly.
          </span>
        )}
      </NoteBox>
    </div>
  );
}

/* ── 8. Data cost strategies ──────────────────────────────────────────────── */

export function DataStrategiesVisualizer() {
  const [tab, setTab] = useState('life');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Strategies for managing data costs</h3>
        <p className="text-gray-400 text-sm">Lifecycle · co-locate · compress — be proactive, not reactive.</p>
      </div>

      <Tabs
        options={[
          { id: 'life', label: '1 · Lifecycle' },
          { id: 'region', label: '2 · Same region' },
          { id: 'fmt', label: '3 · Compress / Parquet' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'life' && <LifecycleScene />}
      {tab === 'region' && <RegionScene />}
      {tab === 'fmt' && <FormatScene />}
    </div>
  );
}

function LifecycleScene() {
  const [day, setDay] = useState(0);
  const tier =
    day >= 1095 ? 'deleted' : day >= 180 ? 'archive' : day >= 30 ? 'ia' : 'hot';
  const tierMeta = {
    hot: { label: 'Standard', color: 'border-rose-400 bg-rose-500/20', cost: '$$$' },
    ia: { label: 'Infrequent Access', color: 'border-amber-400 bg-amber-500/20', cost: '$$' },
    archive: { label: 'Archive', color: 'border-sky-400 bg-sky-500/20', cost: '$' },
    deleted: { label: 'Deleted', color: 'border-gray-600 bg-gray-800', cost: 'free' },
  };
  const m = tierMeta[tier];

  return (
    <>
      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          {[
            { id: 'hot', icon: Database, d: 0, label: 'Day 0' },
            { id: 'ia', icon: HardDrive, d: 30, label: 'Day 30' },
            { id: 'archive', icon: Archive, d: 180, label: 'Day 180' },
            { id: 'deleted', icon: Trash2, d: 1095, label: 'Year 3' },
          ].map((s, i) => {
            const Icon = s.icon;
            const active = tier === s.id || (s.id === 'hot' && day < 30);
            const passed =
              (s.id === 'hot' && day >= 0) ||
              (s.id === 'ia' && day >= 30) ||
              (s.id === 'archive' && day >= 180) ||
              (s.id === 'deleted' && day >= 1095);
            return (
              <React.Fragment key={s.id}>
                <button
                  type="button"
                  onClick={() => setDay(s.d)}
                  className={`rounded-xl border-2 px-3 py-2 w-24 text-center transition ${
                    tier === s.id ? tierMeta[s.id].color : passed ? 'border-gray-600 bg-gray-900/60' : 'border-gray-800 opacity-40'
                  }`}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1 text-gray-300" />
                  <div className="text-[9px] font-bold text-white">{s.label}</div>
                </button>
                {i < 3 && <span className="text-gray-600">→</span>}
              </React.Fragment>
            );
          })}
        </div>

        <div className={`mx-auto max-w-xs rounded-xl border-2 p-3 text-center ${m.color}`}>
          <div className="text-sm font-bold text-white">raw-training-data</div>
          <div className="text-xs text-gray-300 mt-1">
            now in <strong>{m.label}</strong> · {m.cost}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Days since last access</span>
            <span className="font-mono">{day}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1200}
            step={1}
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-500"
          />
        </div>
      </div>
      <NoteBox tone="cyan">
        <strong className="text-white">Lifecycle policies automate the aging.</strong> New objects start
        Hot → after 30 days inactive move to IA → after 180 days to Archive → after 3 years delete. No
        manual cleanup required.
      </NoteBox>
    </>
  );
}

function RegionScene() {
  const [mode, setMode] = useState('good'); // good | bad

  return (
    <>
      <div className="flex justify-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode('bad')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            mode === 'bad' ? 'bg-rose-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          Split regions
        </button>
        <button
          type="button"
          onClick={() => setMode('good')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            mode === 'good' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          Same region
        </button>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
        <div className="flex items-center justify-center gap-4">
          <div className="rounded-xl border-2 border-sky-400 bg-sky-500/15 px-4 py-3 text-center">
            <HardDrive className="w-5 h-5 mx-auto text-sky-300 mb-1" />
            <div className="text-[11px] font-bold text-white">S3 bucket</div>
            <div className="text-[9px] font-mono text-gray-400">us-east-1</div>
          </div>
          <div className="text-center">
            <div
              className={`text-xs font-bold ${mode === 'good' ? 'text-emerald-400' : 'text-rose-400'}`}
            >
              {mode === 'good' ? 'Free · same region' : 'Egress fee + latency'}
            </div>
            <div className="text-2xl">{mode === 'good' ? '⟷' : '⟶'}</div>
          </div>
          <div
            className={`rounded-xl border-2 px-4 py-3 text-center ${
              mode === 'good'
                ? 'border-emerald-400 bg-emerald-500/15'
                : 'border-rose-400 bg-rose-500/15'
            }`}
          >
            <Server className={`w-5 h-5 mx-auto mb-1 ${mode === 'good' ? 'text-emerald-300' : 'text-rose-300'}`} />
            <div className="text-[11px] font-bold text-white">GPU cluster</div>
            <div className="text-[9px] font-mono text-gray-400">
              {mode === 'good' ? 'us-east-1' : 'eu-west-1'}
            </div>
          </div>
        </div>

        {mode === 'good' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400">
            <Globe className="w-4 h-4 text-cyan-300" />
            For global users: put a CDN in front of static assets to cut egress and latency.
          </div>
        )}
      </div>

      <NoteBox tone={mode === 'good' ? 'emerald' : 'rose'}>
        {mode === 'good'
          ? 'Internal traffic in one region costs nothing and gets full bandwidth. This is the default posture for training clusters.'
          : 'Training in a different region than your data is a silent bill killer. Move the cluster, not the petabytes.'}
      </NoteBox>
    </>
  );
}

function FormatScene() {
  const [fmt, setFmt] = useState('csv');

  return (
    <>
      <div className="flex justify-center gap-2 mb-3">
        {[
          { id: 'csv', label: 'CSV / JSON rows' },
          { id: 'parquet', label: 'Parquet columns' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFmt(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              fmt === f.id ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
        <div className="text-[10px] uppercase text-gray-500 mb-2 text-center">
          Query: SELECT age FROM users
        </div>
        {fmt === 'csv' ? (
          <div className="grid grid-cols-4 gap-1 max-w-sm mx-auto">
            {['id', 'name', 'age', 'city'].map((h) => (
              <div key={h} className="text-[9px] font-bold text-center text-gray-400">{h}</div>
            ))}
            {Array.from({ length: 4 }).map((_, r) =>
              ['id', 'name', 'age', 'city'].map((c) => (
                <div
                  key={`${r}-${c}`}
                  className="h-6 rounded bg-rose-500/40 border border-rose-400/50"
                  title="entire row scanned"
                />
              )),
            )}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1 max-w-sm mx-auto">
            {['id', 'name', 'age', 'city'].map((h) => (
              <div key={h} className="text-[9px] font-bold text-center text-gray-400">{h}</div>
            ))}
            {['id', 'name', 'age', 'city'].map((c) => (
              <div key={c} className="flex flex-col gap-1">
                {Array.from({ length: 4 }).map((_, r) => (
                  <div
                    key={r}
                    className={`h-6 rounded border ${
                      c === 'age'
                        ? 'bg-emerald-500/50 border-emerald-400'
                        : 'bg-gray-800 border-gray-700 opacity-40'
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-3 text-[11px] font-mono">
          Data scanned:{' '}
          <span className={fmt === 'csv' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
            {fmt === 'csv' ? '100%' : '~25% (one column)'}
          </span>
        </div>
      </div>

      <NoteBox tone={fmt === 'parquet' ? 'emerald' : 'rose'}>
        {fmt === 'csv' ? (
          <>
            Row formats force the engine to read every column to answer a one-column query — you pay for
            bytes you never needed. Compress with Gzip/Zstd before upload too.
          </>
        ) : (
          <>
            <strong className="text-white">Parquet / Arrow are columnar.</strong> The query reads only{' '}
            <span className="font-mono">age</span>, cutting scanned bytes — and access cost — dramatically.
          </>
        )}
      </NoteBox>
    </>
  );
}

/* ── 9. Cost breakdown / visibility ───────────────────────────────────────── */

const BREAKDOWN = [
  { id: 'gpu', label: 'GPU Instances (P4)', value: 4200, color: 'bg-rose-500', hex: '#ef4444' },
  { id: 's3', label: 'Object Storage (S3)', value: 520, color: 'bg-sky-500', hex: '#0ea5e9' },
  { id: 'cpu', label: 'CPU Instances (T3)', value: 310, color: 'bg-gray-400', hex: '#9ca3af' },
  { id: 'xfer', label: 'Data Transfer', value: 140, color: 'bg-amber-400', hex: '#fbbf24' },
];

export function CostVisibilityVisualizer() {
  const [sel, setSel] = useState('gpu');
  const max = 4500;
  const tools = {
    gpu: 'AWS Cost Explorer · filter EC2 / GPU · GCP Billing · Azure Cost Management',
    s3: 'Break down by bucket and storage class — lifecycle candidates hide here',
    cpu: 'Often right-size targets; many T3s sit underutilized',
    xfer: 'Egress and inter-region — the silent line item',
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">You cannot manage what you do not measure</h3>
        <p className="text-gray-400 text-sm">Tap a bar — see where the money goes and which tool shows it.</p>
      </div>

      <div className="rounded-2xl bg-white p-4 mb-3">
        <div className="text-center text-xs font-bold text-gray-700 mb-3">Typical AI project cost breakdown</div>
        <div className="flex items-end justify-center gap-6 h-48">
          {BREAKDOWN.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSel(b.id)}
              className="flex flex-col items-center h-full justify-end"
            >
              <span className="text-[10px] font-bold text-gray-700 mb-1">${b.value}</span>
              <div
                className={`w-16 rounded-t transition-all duration-300 ${b.color} ${
                  sel === b.id ? 'ring-2 ring-offset-2 ring-cyan-500' : ''
                }`}
                style={{ height: `${(b.value / max) * 100}%` }}
              />
              <span className="text-[9px] text-gray-600 mt-2 w-20 text-center leading-tight">{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      <NoteBox tone={sel === 'gpu' ? 'rose' : 'cyan'}>
        <strong className="text-white">{BREAKDOWN.find((b) => b.id === sel).label}.</strong>{' '}
        {tools[sel]}
        {sel === 'gpu' && (
          <span className="block mt-1 text-xs">
            GPU compute usually dominates — make it the first optimization target. Tools: Cost Explorer /
            CUR (AWS), Cloud Billing reports (GCP), Cost Management + Billing (Azure).
          </span>
        )}
      </NoteBox>
    </div>
  );
}

/* ── 10. Tagging ──────────────────────────────────────────────────────────── */

export function TaggingVisualizer() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Accountability through tagging</h3>
        <p className="text-gray-400 text-sm">Visibility shows what. Tags show who — and which project.</p>
      </div>

      <div className="rounded-2xl bg-white p-4 mb-3">
        {/* resources */}
        <div className="flex justify-center gap-3 mb-2">
          <div
            className={`rounded-lg border-2 px-3 py-2 text-center transition ${
              step >= 0 ? 'bg-rose-200 border-rose-400' : 'opacity-40'
            }`}
          >
            <div className="text-[10px] font-bold text-rose-900">GPU VM</div>
            <div className="text-[8px] font-mono text-rose-800">p4d.24xlarge</div>
          </div>
          <div
            className={`rounded-lg border-2 px-3 py-2 text-center transition ${
              step >= 0 ? 'bg-sky-200 border-sky-400' : 'opacity-40'
            }`}
          >
            <div className="text-[10px] font-bold text-sky-900">S3 Bucket</div>
            <div className="text-[8px] font-mono text-sky-800">training-data</div>
          </div>
        </div>

        {step >= 1 && (
          <div className="text-center mb-2">
            <div className="inline-flex items-center gap-1 rounded-lg bg-violet-100 border border-violet-300 px-3 py-1.5">
              <Tag className="w-3 h-3 text-violet-700" />
              <span className="text-[10px] font-mono text-violet-900">
                project: alpha-model · owner: jane.doe
              </span>
            </div>
            <div className="text-[9px] text-gray-500 mt-1">↓ tags flow into billing</div>
          </div>
        )}

        {step >= 2 && (
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-emerald-200 text-emerald-900 px-4 py-1.5 text-[11px] font-bold">
              Cloud Billing Report
            </div>
          </div>
        )}

        {step >= 3 && (
          <div className="flex justify-center gap-3">
            <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-center">
              <div className="text-[10px] text-gray-600">Project: alpha-model</div>
              <div className="text-sm font-bold text-gray-900">$2,100</div>
            </div>
            <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-center">
              <div className="text-[10px] text-gray-600">Project: beta-model</div>
              <div className="text-sm font-bold text-gray-900">$850</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        {[
          ['project', 'fraud-detection-v2'],
          ['owner', 'data-science-team'],
          ['environment', 'development'],
          ['experiment-id', 'run-0842'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-gray-700 bg-gray-900/60 px-2 py-2">
            <div className="text-[9px] text-cyan-400 font-mono">{k}</div>
            <div className="text-[10px] text-white font-mono truncate">{v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3 mb-2 text-xs text-gray-300">
        {step === 0 && 'Resources exist — but without tags, the bill is one opaque pile.'}
        {step === 1 && 'Attach key-value metadata. These four tags cover most AI orgs.'}
        {step === 2 && 'Billing systems ingest tags automatically into cost reports.'}
        {step === 3 && 'Now you can allocate: which project spent what — and who owns it.'}
      </div>

      <Nav
        step={step}
        max={3}
        onBack={() => setStep((s) => s - 1)}
        onNext={() => setStep((s) => s + 1)}
        onReset={() => setStep(0)}
      />
    </div>
  );
}

/* ── 11. Budgets and alerts ───────────────────────────────────────────────── */

export function BudgetAlertVisualizer() {
  const [spend, setSpend] = useState(4200);
  const budget = 10000;
  const pct = Math.round((spend / budget) * 100);

  let alert = null;
  if (pct >= 100) alert = { level: '100%', tone: 'rose', who: 'Eng manager + Finance', msg: 'Budget exhausted' };
  else if (pct >= 80) alert = { level: '80%', tone: 'amber', who: 'Team lead', msg: 'Review to prevent overspend' };
  else if (pct >= 50) alert = { level: '50%', tone: 'sky', who: 'Team Slack', msg: 'Informational checkpoint' };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Budgets and alerts</h3>
        <p className="text-gray-400 text-sm">
          Scope: <span className="font-mono text-cyan-300">project: big-llama</span> · $10,000 / month
        </p>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 mb-3">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>Actual spend this month</span>
          <span className="font-mono">
            {money(spend)} / {money(budget)} ({pct}%)
          </span>
        </div>
        <div className="h-6 rounded-lg bg-gray-800 overflow-hidden relative mb-2">
          <div
            className={`h-full transition-all duration-300 ${
              pct >= 100 ? 'bg-rose-500' : pct >= 80 ? 'bg-amber-500' : pct >= 50 ? 'bg-sky-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, pct)}%` }}
          />
          {[50, 80, 100].map((t) => (
            <div
              key={t}
              className="absolute top-0 bottom-0 w-0.5 bg-white/40"
              style={{ left: `${t}%` }}
            />
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={12000}
          step={100}
          value={spend}
          onChange={(e) => setSpend(parseInt(e.target.value, 10))}
          className="w-full accent-cyan-500 mb-3"
        />

        <div className="grid grid-cols-3 gap-2">
          {[
            { t: '50%', desc: 'Slack · info', hit: pct >= 50 },
            { t: '80%', desc: 'Email · team lead', hit: pct >= 80 },
            { t: '100%', desc: 'Mgr + Finance', hit: pct >= 100 },
          ].map((a) => (
            <div
              key={a.t}
              className={`rounded-xl border-2 p-2 text-center transition ${
                a.hit
                  ? a.t === '100%'
                    ? 'border-rose-400 bg-rose-500/20'
                    : a.t === '80%'
                      ? 'border-amber-400 bg-amber-500/20'
                      : 'border-sky-400 bg-sky-500/20'
                  : 'border-gray-700 bg-gray-900/60 opacity-50'
              }`}
            >
              <Bell className={`w-4 h-4 mx-auto mb-1 ${a.hit ? 'text-white' : 'text-gray-600'}`} />
              <div className="text-[11px] font-bold text-white">{a.t}</div>
              <div className="text-[8px] text-gray-400">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* workflow loop */}
      <div className="rounded-2xl bg-white p-3 mb-3">
        <div className="text-[10px] font-bold text-gray-600 text-center mb-2">Proactive cost management loop</div>
        <div className="flex items-center justify-center gap-1 flex-wrap text-[9px]">
          {[
            { l: 'Deploy (with tags)', c: 'bg-emerald-200 text-emerald-900' },
            { l: 'Monitor dashboards', c: 'bg-gray-100 text-gray-800' },
            { l: 'Budget alert', c: 'bg-rose-200 text-rose-900' },
            { l: 'Analyze & optimize', c: 'bg-sky-100 text-sky-900' },
          ].map((n, i) => (
            <React.Fragment key={n.l}>
              <div className={`rounded-lg px-2 py-1.5 font-bold ${n.c}`}>{n.l}</div>
              {i < 3 && <span className="text-gray-400">→</span>}
            </React.Fragment>
          ))}
          <span className="text-gray-400 ml-1">↻</span>
        </div>
      </div>

      <NoteBox tone={alert ? alert.tone : 'emerald'}>
        {alert ? (
          <>
            <strong className="text-white">
              {alert.level} alert → {alert.who}.
            </strong>{' '}
            {alert.msg}. Tiered thresholds let you course-correct on day 20 — not on the final invoice.
          </>
        ) : (
          <>
            Drag spend up. At 50% the team gets a Slack ping; at 80% the lead reviews; at 100% leadership
            and finance are notified. Dashboards alone are passive — budgets make control active.
          </>
        )}
      </NoteBox>
    </div>
  );
}

/* ── 12. Combined playbook ────────────────────────────────────────────────── */

export function PlaybookVisualizer() {
  const layers = [
    {
      id: 'train',
      title: 'Training',
      tactic: 'Spot + checkpointing + fleet',
      save: '~70–90% vs On-Demand',
      color: 'border-emerald-400 bg-emerald-500/15',
    },
    {
      id: 'infer',
      title: 'Production inference',
      tactic: 'Auto-scaling to demand',
      save: 'Pay for peak only when needed',
      color: 'border-violet-400 bg-violet-500/15',
    },
    {
      id: 'dev',
      title: 'Dev / staging',
      tactic: 'Scheduled start/stop',
      save: '~50%+ off 24/7 boxes',
      color: 'border-amber-400 bg-amber-500/15',
    },
    {
      id: 'data',
      title: 'Data at rest & in motion',
      tactic: 'Tiers · lifecycle · co-locate · Parquet',
      save: 'Cuts the silent bill',
      color: 'border-sky-400 bg-sky-500/15',
    },
    {
      id: 'gov',
      title: 'Governance',
      tactic: 'Tags · budgets · alerts',
      save: 'No more bill shock',
      color: 'border-cyan-400 bg-cyan-500/15',
    },
  ];
  const [sel, setSel] = useState('train');
  const cur = layers.find((l) => l.id === sel);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The combined playbook</h3>
        <p className="text-gray-400 text-sm">These strategies are not alternatives — stack them.</p>
      </div>

      <div className="space-y-2 mb-3">
        {layers.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setSel(l.id)}
            className={`w-full rounded-xl border-2 px-4 py-3 text-left transition flex items-center gap-3 ${
              sel === l.id ? l.color : 'border-gray-700 bg-gray-900/60 opacity-70'
            }`}
          >
            <div className="flex-1">
              <div className="text-sm font-bold text-white">{l.title}</div>
              <div className="text-[11px] text-gray-400">{l.tactic}</div>
            </div>
            <div className="text-[10px] font-mono text-cyan-300 shrink-0">{l.save}</div>
          </button>
        ))}
      </div>

      <NoteBox>
        <strong className="text-white">{cur.title}:</strong> {cur.tactic}. Together they turn cost
        management from a quarterly panic into a proactive MLOps practice — Spot for training, ASGs for
        production, schedules for non-prod, lifecycle for data, and budgets so nothing runs away quietly.
      </NoteBox>
    </div>
  );
}
