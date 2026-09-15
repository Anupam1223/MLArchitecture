import React, { useState } from 'react';
import { Cpu, Smartphone, Server, Zap, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

/* ── shared helpers ───────────────────────────────────────────────────────── */

function Tabs({ options, value, onChange, accent = 'bg-violet-600' }) {
  return (
    <div className="flex justify-center gap-2 mb-3 flex-wrap">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            value === o.id ? `${accent} text-white` : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Nav({ step, max, onBack, onNext, label = 'Next' }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-3">
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
        className="px-4 py-1.5 rounded-lg bg-violet-600 text-xs font-bold text-white disabled:opacity-30"
      >
        {label} →
      </button>
    </div>
  );
}

function py(code) {
  const out = [];
  const re =
    /(#[^\n]*)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|\b(import|from|as|with|for|in|if|else|def|class|break|return|True|False|None|print|enumerate|zip|range)\b|\b(\d+)\b/g;
  let last = 0;
  let m;
  let k = 0;
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) out.push(code.slice(last, m.index));
    let cls = 'text-sky-300';
    if (m[1]) cls = 'text-gray-500 italic';
    else if (m[2] || m[3]) cls = 'text-emerald-400';
    else if (m[4]) cls = 'text-violet-400';
    else if (m[5]) cls = 'text-orange-300';
    out.push(
      <span key={`t${k++}`} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  out.push(code.slice(last));
  return out;
}

function CodeBlocks({ blocks, focus, setFocus, file, addedTone = false }) {
  return (
    <div className="rounded-2xl bg-black/85 border border-gray-700 overflow-auto custom-scroll">
      <div className="px-3 py-1.5 border-b border-gray-800 text-[10px] font-mono text-gray-500 sticky top-0 bg-black/90">
        {file}
      </div>
      <div className="p-2 font-mono text-[12px] leading-6">
        {blocks.map((b, i) =>
          b.id ? (
            <button
              key={b.id}
              type="button"
              onMouseEnter={() => setFocus(b.id)}
              onFocus={() => setFocus(b.id)}
              onClick={() => setFocus(b.id)}
              className={`block w-full text-left rounded-md px-1.5 transition border-l-2 ${
                focus === b.id
                  ? 'bg-violet-500/20 ring-1 ring-violet-400/60 border-violet-400'
                  : addedTone && b.added
                    ? 'border-emerald-500/70 bg-emerald-500/5 hover:bg-white/5'
                    : 'border-transparent hover:bg-white/5'
              }`}
            >
              <pre className="whitespace-pre text-gray-300">{py(b.text)}</pre>
            </button>
          ) : (
            <pre key={`s${i}`} className="whitespace-pre px-1.5 text-gray-300 border-l-2 border-transparent">
              {py(b.text)}
            </pre>
          ),
        )}
      </div>
    </div>
  );
}

function NoteBox({ children, tone = 'violet' }) {
  const map = {
    violet: 'border-violet-400/40 bg-violet-500/10',
    amber: 'border-amber-400/40 bg-amber-500/10',
    rose: 'border-rose-400/40 bg-rose-500/10',
    emerald: 'border-emerald-400/40 bg-emerald-500/10',
    sky: 'border-sky-400/40 bg-sky-500/10',
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm text-gray-200 leading-relaxed ${map[tone]}`}>
      {children}
    </div>
  );
}

/* ── 1. FP32 vs FP16: bits, memory, throughput ────────────────────────────── */

const FORMATS = {
  fp32: {
    label: 'FP32 — single precision',
    bits: [
      { n: 1, cls: 'bg-rose-500', name: 'sign' },
      { n: 8, cls: 'bg-amber-500', name: 'exponent' },
      { n: 23, cls: 'bg-sky-500', name: 'mantissa' },
    ],
    bytes: 4,
    max: '3.4 × 10³⁸',
    min: '1.2 × 10⁻³⁸',
    tflops: 19.5,
  },
  fp16: {
    label: 'FP16 — half precision',
    bits: [
      { n: 1, cls: 'bg-rose-500', name: 'sign' },
      { n: 5, cls: 'bg-amber-500', name: 'exponent' },
      { n: 10, cls: 'bg-sky-500', name: 'mantissa' },
    ],
    bytes: 2,
    max: '65,504',
    min: '6.0 × 10⁻⁸',
    tflops: 312,
  },
};

export function PrecisionFormatsVisualizer() {
  const [fmt, setFmt] = useState('fp32');
  const f = FORMATS[fmt];
  const params = 1.3; // billion
  const weights = params * f.bytes;
  const total = weights * 3; // weights + grads + optimizer-ish

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Two ways to store a number</h3>
        <p className="text-gray-400 text-sm">
          Same value, half the bits. Watch what that buys — and what it costs.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'fp32', label: 'FP32' },
          { id: 'fp16', label: 'FP16' },
        ]}
        value={fmt}
        onChange={setFmt}
      />

      <div className="max-w-2xl w-full mx-auto space-y-4">
        {/* bit layout */}
        <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">{f.label}</div>
          <div className="flex gap-0.5 h-9 rounded-lg overflow-hidden border border-gray-700 transition-all duration-500">
            {f.bits.map((b) => (
              <div
                key={b.name}
                className={`${b.cls} flex items-center justify-center text-[10px] font-bold text-white/95 transition-all duration-500`}
                style={{ width: `${(b.n / 32) * 100}%` }}
              >
                {b.n >= 5 ? `${b.name} · ${b.n}` : b.n}
              </div>
            ))}
            {fmt === 'fp16' && (
              <div
                className="bg-gray-800/60 border-l border-dashed border-gray-600 flex items-center justify-center text-[9px] text-gray-500"
                style={{ width: '50%' }}
              >
                16 bits saved
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              ['Bytes per value', f.bytes],
              ['Largest value', f.max],
              ['Smallest value', f.min],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-gray-700 bg-gray-900 px-2 py-1.5">
                <div className="text-[9px] uppercase text-gray-500">{k}</div>
                <div className="text-xs font-bold text-white font-mono">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* memory */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            Memory for a 1.3B-parameter model
          </div>
          <div className="h-8 rounded-lg bg-gray-800 border border-gray-700 overflow-hidden">
            <div
              className={`h-full flex items-center px-3 text-[11px] font-bold text-white transition-all duration-500 ${
                fmt === 'fp32' ? 'bg-rose-600/80' : 'bg-emerald-600/80'
              }`}
              style={{ width: `${(total / 15.6) * 100}%` }}
            >
              {total.toFixed(1)} GB · weights + gradients + activations
            </div>
          </div>
        </div>

        {/* throughput */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            NVIDIA A100 matrix throughput
          </div>
          <div className="space-y-1.5">
            {Object.entries(FORMATS).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <span className="w-32 text-[10px] font-mono text-gray-400 shrink-0">
                  {k === 'fp32' ? 'FP32 standard core' : 'FP16 Tensor Core'}
                </span>
                <div className="flex-1 h-6 rounded bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full flex items-center justify-end pr-2 text-[10px] font-bold text-white ${
                      k === fmt ? (k === 'fp16' ? 'bg-emerald-500' : 'bg-sky-600') : 'bg-gray-700'
                    } transition-all duration-500`}
                    style={{ width: `${(v.tflops / 312) * 100}%` }}
                  >
                    {v.tflops} TFLOPS
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <NoteBox tone={fmt === 'fp16' ? 'emerald' : 'sky'}>
          {fmt === 'fp32' ? (
            <>
              FP32 is the safe default: a wide dynamic range and plenty of precision. For most deep
              learning operations, that much precision is simply not necessary — you are paying for it in
              memory and speed.
            </>
          ) : (
            <>
              <strong className="text-white">16× the matrix throughput and half the memory.</strong>{' '}
              Tensor Cores, present on NVIDIA GPUs since Volta, execute FP16 matrix operations as
              dedicated hardware. But look at the smallest representable value — that shrinking range is
              where the trouble starts.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}

/* ── 2. Why a Tensor Core is faster ───────────────────────────────────────── */

export function TensorCoreVisualizer() {
  const [cycle, setCycle] = useState(0);
  const total = 16; // cells in a 4x4 output tile
  const fp32Done = Math.min(cycle, total);
  const tcDone = cycle >= 1 ? total : 0;

  const grid = (done, color) => (
    <div className="grid grid-cols-4 gap-1 w-fit mx-auto">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className={`w-8 h-8 rounded-md border transition-all duration-300 ${
            i < done ? `${color} border-transparent` : 'bg-gray-800/70 border-gray-700'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">What a Tensor Core actually does</h3>
        <p className="text-gray-400 text-sm">
          One 4×4 output tile of a matrix multiply. Advance the clock and compare.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-2xl w-full mx-auto">
        <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 text-center">
          <div className="text-xs font-bold text-sky-300 mb-1">Standard FP32 core</div>
          <div className="text-[10px] text-gray-500 mb-3">one multiply-accumulate per clock</div>
          {grid(fp32Done, 'bg-sky-500')}
          <div className="mt-3 text-[11px] font-mono text-gray-400">
            {fp32Done} / 16 results
            {fp32Done === total && <span className="text-sky-300 font-bold"> · done</span>}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 text-center">
          <div className="text-xs font-bold text-emerald-300 mb-1">FP16 Tensor Core</div>
          <div className="text-[10px] text-gray-500 mb-3">a whole 4×4 matrix op per clock</div>
          {grid(tcDone, 'bg-emerald-500')}
          <div className="mt-3 text-[11px] font-mono text-gray-400">
            {tcDone} / 16 results
            {tcDone === total && <span className="text-emerald-300 font-bold"> · done at clock 1</span>}
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Clock cycle</div>
        <div className="text-3xl font-bold text-white font-mono mb-2">{cycle}</div>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setCycle(0)}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300"
          >
            Reset
          </button>
          <button
            type="button"
            disabled={cycle >= total}
            onClick={() => setCycle((c) => c + 1)}
            className="px-4 py-1.5 rounded-lg bg-violet-600 text-xs font-bold text-white disabled:opacity-30"
          >
            Tick clock →
          </button>
          <button
            type="button"
            onClick={() => setCycle(total)}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300"
          >
            Skip to 16
          </button>
        </div>
      </div>

      <div className="mt-4 max-w-2xl w-full mx-auto">
        <NoteBox tone={cycle >= total ? 'emerald' : 'violet'}>
          {cycle === 0 && 'Both units start empty. The output tile is 16 values that each need a dot product.'}
          {cycle > 0 && cycle < total && (
            <>
              The Tensor Core finished the entire tile on the first clock. The standard core is still
              grinding through it one result at a time — {total - fp32Done} to go.
            </>
          )}
          {cycle >= total && (
            <>
              <strong className="text-white">16 clocks versus 1.</strong> This is not a compiler trick or
              a faster clock — it is dedicated silicon that only accepts FP16 inputs. That hardware is the
              entire reason mixed precision is worth the complexity.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}

/* ── 3. Numerical stability: underflow ────────────────────────────────────── */

const LOG_MIN = -12;
const LOG_MAX = 2;
const pos = (e) => ((e - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100;

export function UnderflowVisualizer() {
  const [exp, setExp] = useState(-8);
  const value = Math.pow(10, exp);
  const fp16Min = -7.22; // log10(5.96e-8) subnormal floor
  const fp16NormalMin = -4.21; // log10(6.1e-5)
  const dead = exp < fp16Min;
  const subnormal = !dead && exp < fp16NormalMin;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The gradient that disappears</h3>
        <p className="text-gray-400 text-sm">
          Slide a gradient magnitude and see what FP16 can still hold.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
        {/* FP32 line */}
        <div className="mb-5">
          <div className="text-[10px] font-bold text-sky-300 mb-1">FP32 representable range</div>
          <div className="relative h-7 rounded-lg bg-sky-500/20 border border-sky-500/40">
            <div
              className="absolute -top-1 w-0.5 h-9 bg-white"
              style={{ left: `${pos(exp)}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-sky-200">
              down to 10⁻³⁸ — nothing here is at risk
            </div>
          </div>
        </div>

        {/* FP16 line */}
        <div>
          <div className="text-[10px] font-bold text-emerald-300 mb-1">FP16 representable range</div>
          <div className="relative h-7 rounded-lg bg-gray-800 border border-gray-700 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-rose-900/60 border-r border-rose-500 flex items-center justify-center"
              style={{ width: `${pos(fp16Min)}%` }}
            >
              <span className="text-[9px] font-bold text-rose-300">FLUSHED TO ZERO</span>
            </div>
            <div
              className="absolute inset-y-0 bg-amber-900/40"
              style={{ left: `${pos(fp16Min)}%`, width: `${pos(fp16NormalMin) - pos(fp16Min)}%` }}
            />
            <div
              className="absolute inset-y-0 bg-emerald-800/40 flex items-center justify-center"
              style={{ left: `${pos(fp16NormalMin)}%`, right: 0 }}
            >
              <span className="text-[9px] font-bold text-emerald-300">safely representable</span>
            </div>
            <div className="absolute -top-1 w-0.5 h-9 bg-white" style={{ left: `${pos(exp)}%` }} />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-gray-600 mt-1">
            {[-12, -9, -6, -3, 0, 2].map((e) => (
              <span key={e}>1e{e}</span>
            ))}
          </div>
        </div>

        <input
          type="range"
          min={-12}
          max={2}
          step={0.25}
          value={exp}
          onChange={(e) => setExp(parseFloat(e.target.value))}
          className="w-full mt-4 accent-violet-500"
        />

        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2">
            <div className="text-[9px] uppercase text-gray-500">Gradient value</div>
            <div className="text-sm font-bold font-mono text-white">{value.toExponential(2)}</div>
          </div>
          <div className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2">
            <div className="text-[9px] uppercase text-gray-500">Stored as FP32</div>
            <div className="text-sm font-bold font-mono text-sky-300">{value.toExponential(2)}</div>
          </div>
          <div
            className={`rounded-lg border px-3 py-2 ${
              dead ? 'border-rose-500 bg-rose-500/15' : 'border-emerald-500/50 bg-emerald-500/10'
            }`}
          >
            <div className="text-[9px] uppercase text-gray-500">Stored as FP16</div>
            <div
              className={`text-sm font-bold font-mono ${dead ? 'text-rose-300' : 'text-emerald-300'}`}
            >
              {dead ? '0.00' : value.toExponential(2)}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-3">
          <div
            className={`rounded-xl border-2 px-4 py-2 text-center transition ${
              dead ? 'border-rose-500 bg-rose-500/20' : 'border-gray-700 bg-gray-900'
            }`}
          >
            <div className="text-[10px] text-gray-400">weight update</div>
            <div className={`text-sm font-bold ${dead ? 'text-rose-300' : 'text-emerald-300'}`}>
              {dead ? 'w ← w − 0  (stopped)' : 'w ← w − lr·g  (learning)'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <NoteBox tone={dead ? 'rose' : subnormal ? 'amber' : 'emerald'}>
          {dead && (
            <>
              <strong className="text-white">Underflow.</strong> The gradient rounded down to exactly
              zero. Those weights stop updating and that part of the network quietly stops learning — with
              no error message, just a worse model.
            </>
          )}
          {subnormal && (
            <>
              This lands in the subnormal region: FP16 can hold it, but with badly degraded precision. It
              is on the edge of vanishing.
            </>
          )}
          {!dead && !subnormal && (
            <>
              Comfortably representable. The problem is that backpropagation routinely produces gradients
              far smaller than this — slide left and watch them vanish.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}

/* ── 4. Dynamic loss scaling ──────────────────────────────────────────────── */

const GRADS = [3.2e-3, 4.5e-5, 8.1e-7, 2.4e-8, 6.0e-10];

const AX_MIN = -10;
const AX_MAX = 6;
const axPos = (v) => ((Math.log10(v) - AX_MIN) / (AX_MAX - AX_MIN)) * 100;

const FP16_FLOOR = 5.96e-8;
const FP16_CEIL = 65504;

export function LossScalingVisualizer() {
  const [exp, setExp] = useState(0);
  const [unscaled, setUnscaled] = useState(false);
  const scale = Math.pow(2, exp);

  const dots = GRADS.map((g) => {
    const v = g * scale;
    const status = v > FP16_CEIL ? 'over' : v < FP16_FLOOR ? 'under' : 'ok';
    return { g, v, status };
  });
  const lost = dots.filter((d) => d.status === 'under').length;
  const over = dots.filter((d) => d.status === 'over').length;
  const safe = dots.length - lost - over;

  const setScaleExp = (e) => {
    setExp(e);
    setUnscaled(false);
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Dynamic loss scaling</h3>
        <p className="text-gray-400 text-sm">
          Scale the loss and every gradient slides right together. Find the window where all five fit.
        </p>
      </div>

      {/* the track */}
      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
        <div className="relative h-24 rounded-xl overflow-hidden border border-gray-700">
          {/* zones */}
          <div
            className="absolute inset-y-0 left-0 bg-rose-950/70"
            style={{ width: `${axPos(FP16_FLOOR)}%` }}
          >
            <span className="absolute bottom-1 left-2 text-[9px] font-bold text-rose-400 uppercase tracking-wide">
              too small · becomes 0
            </span>
          </div>
          <div
            className="absolute inset-y-0 bg-emerald-950/50"
            style={{ left: `${axPos(FP16_FLOOR)}%`, width: `${axPos(FP16_CEIL) - axPos(FP16_FLOOR)}%` }}
          >
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-emerald-400 uppercase tracking-wide">
              what FP16 can hold
            </span>
          </div>
          <div
            className="absolute inset-y-0 bg-amber-950/70"
            style={{ left: `${axPos(FP16_CEIL)}%`, right: 0 }}
          >
            <span className="absolute bottom-1 right-2 text-[9px] font-bold text-amber-400 uppercase tracking-wide">
              too big · inf
            </span>
          </div>

          {/* zone edges */}
          <div
            className="absolute inset-y-0 w-0.5 bg-rose-500"
            style={{ left: `${axPos(FP16_FLOOR)}%` }}
          />
          <div
            className="absolute inset-y-0 w-0.5 bg-amber-500"
            style={{ left: `${axPos(FP16_CEIL)}%` }}
          />

          {/* gradient dots */}
          {dots.map((d, i) => {
            const dead = d.status === 'under';
            const showAt = unscaled ? (dead ? 0.5 : axPos(d.g)) : dead ? 0.5 : axPos(d.v);
            return (
              <div
                key={d.g}
                className="absolute transition-all duration-700 ease-out"
                style={{ left: `${Math.min(97, Math.max(1, showAt))}%`, top: `${8 + i * 11}px` }}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 -translate-x-1/2 transition-colors duration-500 ${
                    dead
                      ? 'bg-transparent border-rose-500/60'
                      : d.status === 'over'
                        ? 'bg-amber-400 border-amber-200 animate-pulse'
                        : 'bg-emerald-400 border-emerald-200'
                  }`}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[9px] font-mono text-gray-600 mt-1 px-0.5">
          <span>tiny</span>
          <span>gradient magnitude →</span>
          <span>huge</span>
        </div>

        {/* the one control */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider text-gray-500">Loss scale factor</span>
            <span className="text-sm font-bold font-mono text-violet-300">
              × {scale.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={26}
            step={1}
            value={exp}
            onChange={(e) => setScaleExp(parseInt(e.target.value, 10))}
            className="w-full accent-violet-500"
          />
        </div>

        {/* survivor pips — the only "score" on screen */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            {dots.map((d) => (
              <span
                key={d.g}
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  d.status === 'ok'
                    ? 'bg-emerald-500/25'
                    : d.status === 'under'
                      ? 'bg-rose-500/25'
                      : 'bg-amber-500/25'
                }`}
              >
                {d.status === 'ok' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                {d.status === 'under' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                {d.status === 'over' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-400">
            <strong
              className={
                safe === dots.length ? 'text-emerald-400' : over ? 'text-amber-400' : 'text-rose-400'
              }
            >
              {safe}
            </strong>{' '}
            of {dots.length} gradients survive
          </span>
        </div>
      </div>

      {/* dynamic behaviour controls */}
      <div className="flex justify-center gap-2 mt-3 flex-wrap">
        {over > 0 && (
          <button
            type="button"
            onClick={() => setScaleExp(Math.max(0, exp - 1))}
            className="px-4 py-1.5 rounded-lg bg-amber-600 text-xs font-bold text-white"
          >
            Overflow — back off ×½
          </button>
        )}
        {over === 0 && lost > 0 && (
          <button
            type="button"
            onClick={() => setScaleExp(Math.min(26, exp + 1))}
            className="px-4 py-1.5 rounded-lg bg-violet-600 text-xs font-bold text-white"
          >
            Grow ×2
          </button>
        )}
        {over === 0 && lost === 0 && (
          <button
            type="button"
            onClick={() => setUnscaled((u) => !u)}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 text-xs font-bold text-white"
          >
            {unscaled ? 'Scale back up' : 'Now unscale ÷ ' + scale.toLocaleString()}
          </button>
        )}
        <button
          type="button"
          onClick={() => setScaleExp(0)}
          className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300"
        >
          Reset
        </button>
      </div>

      <div className="mt-3">
        <NoteBox tone={over ? 'amber' : lost ? 'rose' : 'emerald'}>
          {unscaled && (
            <>
              <strong className="text-white">Divided back down before the weight update.</strong> The
              survivors return to their true magnitudes, so the maths of the optimizer step is unchanged —
              scaling was only ever a temporary trick to get them through FP16 alive.
            </>
          )}
          {!unscaled && exp === 0 && (
            <>
              No scaling yet. The two smallest gradients are sitting in the red zone, which means they are
              stored as zero and those weights will not move at all this step.
            </>
          )}
          {!unscaled && exp > 0 && lost > 0 && over === 0 && (
            <>
              Every dot slid right by the same amount — that is the chain rule doing the work. Keep
              growing the factor until the last one clears the red edge.
            </>
          )}
          {!unscaled && lost === 0 && over === 0 && (
            <>
              <strong className="text-white">All five inside the window.</strong> This is the whole idea:
              shift the gradients into the part of the range FP16 can represent, then shift them back
              before they touch the FP32 master weights.
            </>
          )}
          {!unscaled && over > 0 && (
            <>
              <strong className="text-white">Pushed too far.</strong> The largest gradient overflowed to
              inf. This is what the <em>dynamic</em> in dynamic loss scaling handles: on inf or NaN the
              framework throws the step away and halves the factor, then grows it again after a stable
              stretch — always hunting the largest safe value.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}

/* ── 5. The mixed-precision training step ─────────────────────────────────── */

const AMP_FLOW = [
  { id: 'master', label: 'Master weights (FP32)', tone: 'sky', note: 'A master copy of the weights always lives in FP32. This is what makes tiny accumulated updates survive over thousands of steps.' },
  { id: 'cast', label: 'Cast to FP16', tone: 'emerald', note: 'At the start of each step the FP32 master weights are cast down to FP16 working copies. The originals are untouched.' },
  { id: 'fwd', label: 'Forward pass (FP16 on Tensor Cores)', tone: 'emerald', note: 'The forward pass runs in FP16 — this is where the Tensor Core speedup is actually collected.' },
  { id: 'loss', label: 'Calculate loss', tone: 'rose', note: 'The loss comes out of the FP16 forward pass. On its own it is fine; the danger is what happens to the gradients derived from it.' },
  { id: 'scaleup', label: 'Scale loss up (× scale_factor)', tone: 'amber', note: 'Before backward, the loss is multiplied by a large factor. By the chain rule every gradient is multiplied by the same factor, shifting them all into FP16 range.' },
  { id: 'bwd', label: 'Backward pass (FP16 gradients)', tone: 'emerald', note: 'Backpropagation runs in FP16 too, producing scaled gradients that are large enough not to vanish.' },
  { id: 'unscale', label: 'Unscale gradients (÷ scale_factor)', tone: 'amber', note: 'The gradients are divided back down to their true magnitudes. If any came back inf or NaN, the step is skipped and the factor is reduced.' },
  { id: 'update', label: 'Update master weights (FP32)', tone: 'sky', note: 'The optimizer applies the unscaled gradients to the FP32 master weights — full precision where accumulation matters, FP16 speed everywhere else.' },
];

export function AmpFlowVisualizer() {
  const [step, setStep] = useState(0);
  const toneCls = {
    sky: 'border-sky-400 bg-sky-500/25',
    emerald: 'border-emerald-400 bg-emerald-500/25',
    rose: 'border-rose-400 bg-rose-500/25',
    amber: 'border-amber-400 bg-amber-500/25',
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">One mixed-precision training step</h3>
        <p className="text-gray-400 text-sm">Eight stages, looping back to the master weights.</p>
      </div>

      <div className="flex-1 rounded-2xl border border-gray-700 bg-gray-950/70 p-3 relative">
        <div className="absolute right-3 top-6 bottom-6 w-6 border-r-2 border-t-2 border-b-2 border-dashed border-gray-600 rounded-r-xl" />
        <div className="absolute right-10 top-3 text-[9px] text-gray-500">loop</div>

        <div className="flex flex-col items-center gap-0.5 pr-10">
          {AMP_FLOW.map((n, i) => (
            <React.Fragment key={n.id}>
              <button
                type="button"
                onClick={() => setStep(i)}
                className={`w-full max-w-sm rounded-xl border-2 px-3 py-1.5 text-center text-[11px] font-bold transition ${
                  step === i
                    ? `${toneCls[n.tone]} text-white scale-[1.03]`
                    : step > i
                      ? 'border-gray-600 bg-gray-800/70 text-gray-300'
                      : 'border-gray-800 bg-gray-900/40 text-gray-600'
                }`}
              >
                {n.label}
              </button>
              {i < AMP_FLOW.length - 1 && (
                <div className={`text-sm leading-none ${step > i ? 'text-violet-400' : 'text-gray-700'}`}>
                  ↓
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <NoteBox tone={AMP_FLOW[step].tone === 'emerald' ? 'emerald' : AMP_FLOW[step].tone === 'amber' ? 'amber' : 'violet'}>
          <strong className="text-white">
            {step + 1}. {AMP_FLOW[step].label}.
          </strong>{' '}
          {AMP_FLOW[step].note}
        </NoteBox>
      </div>

      <Nav
        step={step}
        max={AMP_FLOW.length - 1}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(AMP_FLOW.length - 1, s + 1))}
      />
    </div>
  );
}

/* ── 6. PyTorch AMP ───────────────────────────────────────────────────────── */

const STD_BLOCKS = [
  { id: null, text: `# Standard training loop` },
  { id: 'zero', text: `optimizer.zero_grad()` },
  { id: 'fwd', text: `outputs = model(inputs)\nloss = loss_fn(outputs, targets)` },
  { id: 'bwd', text: `loss.backward()` },
  { id: 'step', text: `optimizer.step()` },
];

const AMP_BLOCKS = [
  { id: 'scaler', added: true, text: `# Recommended: create the scaler once, outside the training loop\nscaler = torch.cuda.amp.GradScaler()` },
  { id: null, text: `` },
  { id: null, text: `# --- Inside the training loop ---` },
  { id: 'zero', text: `optimizer.zero_grad()` },
  { id: null, text: `` },
  { id: 'autocast', added: true, text: `# Casts operations to FP16 where appropriate\nwith torch.cuda.amp.autocast():\n    outputs = model(inputs)\n    loss = loss_fn(outputs, targets)` },
  { id: null, text: `` },
  { id: 'scalebwd', added: true, text: `# Scales loss. Calls backward() on scaled loss to create scaled gradients.\nscaler.scale(loss).backward()` },
  { id: null, text: `` },
  { id: 'scalestep', added: true, text: `# scaler.step() first unscales the gradients of the optimizer's params.\n# If no infs/NaNs are found, optimizer.step() is then called.\n# Otherwise, optimizer.step() is skipped.\nscaler.step(optimizer)` },
  { id: null, text: `` },
  { id: 'update', added: true, text: `# Updates the scale for next iteration.\nscaler.update()` },
];

const AMP_NOTES = {
  zero: 'Unchanged from the standard loop — clear last step’s gradients.',
  fwd: 'The standard FP32 forward pass. Every operation runs at single precision, Tensor Cores idle.',
  bwd: 'Plain backward. Nothing protects small gradients here, which is why a naive switch to FP16 fails.',
  step: 'The optimizer applies gradients directly. No scaling, no skipping.',
  scaler: 'GradScaler owns the dynamic loss-scaling state. Create it once — it needs history across steps to grow and back off the factor.',
  autocast: 'autocast is a context manager that picks the right precision per operation: matmuls and convolutions in FP16, reductions and softmax kept in FP32. You do not maintain that list yourself.',
  scalebwd: 'The one place the scale factor is applied. scaler.scale(loss) multiplies the loss, so backward() produces scaled gradients that clear FP16’s floor.',
  scalestep: 'This does three things: unscale the gradients, inspect them for inf/NaN, and only then call optimizer.step(). A bad step is skipped rather than corrupting the weights.',
  update: 'Adjusts the scale factor for the next iteration — halve it after an overflow, grow it after a stable run.',
};

export function PytorchAmpVisualizer() {
  const [tab, setTab] = useState('amp');
  const [focus, setFocus] = useState('autocast');
  const isAmp = tab === 'amp';

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Mixed precision in PyTorch</h3>
        <p className="text-gray-400 text-sm">
          The same loop, five lines heavier. Green bars mark what was added.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'std', label: 'Standard loop' },
          { id: 'amp', label: 'With AMP' },
        ]}
        value={tab}
        onChange={(v) => {
          setTab(v);
          setFocus(v === 'amp' ? 'autocast' : 'fwd');
        }}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-3 min-h-0">
        <CodeBlocks
          blocks={isAmp ? AMP_BLOCKS : STD_BLOCKS}
          focus={focus}
          setFocus={setFocus}
          file={isAmp ? 'train_amp.py' : 'train_fp32.py'}
          addedTone={isAmp}
        />
        <div className="flex flex-col gap-2 min-h-0 overflow-auto custom-scroll">
          <NoteBox>{AMP_NOTES[focus]}</NoteBox>
          <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3 text-xs text-gray-400 leading-relaxed">
            <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Two components</div>
            <p className="mb-1">
              <span className="font-mono text-violet-300">autocast</span> — chooses FP16 or FP32 per
              operation inside its scope.
            </p>
            <p>
              <span className="font-mono text-violet-300">GradScaler</span> — manages dynamic loss scaling
              to prevent gradient underflow.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-3 text-xs text-gray-200 leading-relaxed">
            You never write a cast yourself and you never pick a scale factor. Both are decisions the
            framework makes better than you can, per operation and per step.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 7. TensorFlow mixed precision ────────────────────────────────────────── */

const TF_MP_BLOCKS = [
  { id: 'imp', text: `import tensorflow as tf` },
  { id: null, text: `` },
  { id: 'policy', text: `# Set the global policy to use mixed precision\ntf.keras.mixed_precision.set_global_policy('mixed_float16')` },
  { id: null, text: `` },
  { id: 'model', text: `# ... define your model as usual\ninputs = tf.keras.Input(shape=(...))\n# Layers will automatically use mixed precision\noutputs = tf.keras.layers.Dense(10, activation='softmax')(inputs)\nmodel = tf.keras.Model(inputs=inputs, outputs=outputs)` },
  { id: null, text: `` },
  { id: 'compile', text: `optimizer = tf.keras.optimizers.Adam()\nmodel.compile(optimizer=optimizer, loss='sparse_categorical_crossentropy')` },
  { id: null, text: `` },
  { id: 'fit', text: `# model.fit will automatically handle loss scaling\n# model.fit(x_train, y_train, ...)` },
];

const TF_MP_NOTES = {
  imp: 'No extra package — mixed precision lives inside Keras.',
  policy: 'This single line is the whole feature. A global policy of mixed_float16 means: layer computations in FP16, layer variables kept in FP32.',
  model: 'You define the model exactly as before. Dense, Conv2D and friends read the policy and split their own dtypes accordingly.',
  compile: 'Keras wraps your optimizer in a LossScaleOptimizer behind the scenes — the equivalent of PyTorch’s GradScaler, but automatic.',
  fit: 'model.fit performs the scale, backward, unscale, inspect and step sequence for you. The change is transparent to the rest of your code.',
};

export function TfMixedPrecisionVisualizer() {
  const [focus, setFocus] = useState('policy');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Mixed precision in TensorFlow</h3>
        <p className="text-gray-400 text-sm">One global policy, and Keras handles the rest.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-3 min-h-0">
        <CodeBlocks blocks={TF_MP_BLOCKS} focus={focus} setFocus={setFocus} file="train_mixed_tf.py" />

        <div className="flex flex-col gap-2 min-h-0 overflow-auto custom-scroll">
          <NoteBox>{TF_MP_NOTES[focus]}</NoteBox>

          <div className="rounded-xl border border-gray-700 bg-gray-950/70 p-3">
            <div className="text-[10px] font-bold uppercase text-gray-500 mb-2">
              What the policy does to a layer
            </div>
            <div className="rounded-lg border-2 border-violet-400/50 bg-violet-500/10 p-3">
              <div className="text-xs font-bold text-white mb-2">Dense layer</div>
              <div className="flex items-center justify-between rounded-md bg-emerald-500/15 border border-emerald-400/40 px-2 py-1.5 mb-1.5">
                <span className="text-[11px] text-gray-200">compute dtype</span>
                <span className="text-[11px] font-mono font-bold text-emerald-300">float16</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-sky-500/15 border border-sky-400/40 px-2 py-1.5">
                <span className="text-[11px] text-gray-200">variable dtype</span>
                <span className="text-[11px] font-mono font-bold text-sky-300">float32</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
              Fast FP16 maths, FP32 master weights — the same two-copy design you stepped through, applied
              automatically per layer.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-3 text-xs text-gray-200 leading-relaxed">
            <strong className="text-white">1.5× to 3× speedups</strong> on supported hardware for a few
            lines of code — one of the most effective optimizations available for GPU-bound workloads.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 8. Why quantize for inference ────────────────────────────────────────── */

const TARGETS = {
  cloud: { label: 'Cloud GPU server', icon: Server, budget: 4000, note: 'plenty of memory, but you pay per request' },
  phone: { label: 'Smartphone', icon: Smartphone, budget: 300, note: 'strict app size and power limits' },
  edge: { label: 'Embedded device', icon: Cpu, budget: 150, note: 'tiny storage, no GPU at all' },
};

export function QuantizationWhyVisualizer() {
  const [target, setTarget] = useState('phone');
  const [int8, setInt8] = useState(false);
  const t = TARGETS[target];
  const size = int8 ? 128 : 510;
  const latency = int8 ? 45 : 150;
  const cost = int8 ? 0.31 : 1.04;
  const fits = size <= t.budget;
  const Icon = t.icon;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Why shrink a trained model</h3>
        <p className="text-gray-400 text-sm">
          Same network, two precisions, three places you might have to run it.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-3 flex-wrap">
        {Object.entries(TARGETS).map(([k, v]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTarget(k)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              target === k ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-4">
        <button
          type="button"
          onClick={() => setInt8((v) => !v)}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
            int8 ? 'bg-emerald-600 text-white' : 'bg-sky-700 text-white'
          }`}
        >
          {int8 ? 'INT8 quantized' : 'FP32 original'} — tap to switch
        </button>
      </div>

      <div className="max-w-2xl w-full mx-auto space-y-3">
        <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon className="w-5 h-5 text-violet-300" />
            <span className="text-sm font-bold text-white">{t.label}</span>
            <span className="text-[10px] text-gray-500">{t.note}</span>
            <span className="ml-auto text-[10px] font-mono text-gray-400">
              budget {t.budget} MB
            </span>
          </div>

          <div className="relative h-10 rounded-lg bg-gray-800 border border-gray-700 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${fits ? 'bg-emerald-600/80' : 'bg-rose-600/80'}`}
              style={{ width: `${Math.min(100, (size / t.budget) * 100)}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
              {size} MB model {fits ? '— fits' : `— ${size - t.budget} MB over budget`}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            ['Model size', `${size} MB`, int8 ? 'text-emerald-400' : 'text-sky-300'],
            ['Inference latency', `${latency} ms`, int8 ? 'text-emerald-400' : 'text-sky-300'],
            ['Cost / 1M requests', `$${cost.toFixed(2)}`, int8 ? 'text-emerald-400' : 'text-sky-300'],
          ].map(([k, v, cls]) => (
            <div key={k} className="rounded-xl border border-gray-700 bg-gray-900/60 px-3 py-2 text-center">
              <div className="text-[9px] uppercase text-gray-500">{k}</div>
              <div className={`text-lg font-bold ${cls}`}>{v}</div>
            </div>
          ))}
        </div>

        <NoteBox tone={int8 ? 'emerald' : fits ? 'sky' : 'rose'}>
          {!int8 && fits && (
            <>
              It runs — but every request costs three times what it needs to. At millions of requests that
              difference is the whole infrastructure bill.
            </>
          )}
          {!int8 && !fits && (
            <>
              A 510 MB FP32 model is simply not deployable here. On edge devices with strict power and
              storage constraints, large FP32 models are often not a viable option at all.
            </>
          )}
          {int8 && (
            <>
              <strong className="text-white">4× smaller, over 3× faster.</strong> An INT8 value uses 8 bits
              where FP32 uses 32, and modern CPUs, Tensor Cores and TPUs execute integer arithmetic
              substantially faster and more efficiently than floating point.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}

/* ── 9. The affine mapping ────────────────────────────────────────────────── */

const RANGES = {
  asym: { label: 'Activations [-3.5, 2.8]', rmin: -3.5, rmax: 2.8 },
  sym: { label: 'Weights [-1.0, 1.0]', rmin: -1.0, rmax: 1.0 },
  relu: { label: 'ReLU6 output [0, 6]', rmin: 0, rmax: 6 },
};

export function AffineMappingVisualizer() {
  const [rk, setRk] = useState('asym');
  const [view, setView] = useState('snap');
  const [bits, setBits] = useState(4);
  const { rmin, rmax } = RANGES[rk];
  const [real, setReal] = useState(1.5);

  const clampedReal = Math.min(rmax, Math.max(rmin, real));
  const scale = (rmax - rmin) / 255;
  const zeroPoint = Math.min(127, Math.max(-128, Math.round(-128 - rmin / scale)));

  const qExact = clampedReal / scale + zeroPoint; // continuous, before rounding
  const q = Math.min(127, Math.max(-128, Math.round(qExact)));
  const deq = (q - zeroPoint) * scale;
  const err = Math.abs(deq - clampedReal);

  const pickRange = (v) => {
    setRk(v);
    setReal((RANGES[v].rmin + RANGES[v].rmax) / 2 + (RANGES[v].rmax - RANGES[v].rmin) * 0.17);
  };

  /* ---- the two rungs your value falls between ---- */
  const [snapStage, setSnapStage] = useState(0);
  let qLo = Math.floor(qExact);
  if (qLo < -128) qLo = -128;
  if (qLo > 126) qLo = 126;
  const qHi = qLo + 1;
  const frac = Math.min(1, Math.max(0, qExact - qLo));
  const vLo = (qLo - zeroPoint) * scale;
  const vHi = (qHi - zeroPoint) * scale;
  const dLo = Math.abs(clampedReal - vLo);
  const dHi = Math.abs(vHi - clampedReal);
  const winner = dLo <= dHi ? qLo : qHi;
  const xDot = 25 + frac * 50;
  const xWin = winner === qLo ? 25 : 75;

  /* ---- staircase data for the "what gets lost" view ---- */
  const levels = Math.pow(2, bits);
  const step = (rmax - rmin) / (levels - 1);
  const W = 620;
  const H = 170;
  const samples = 160;
  const signal = (i) => {
    const x = i / (samples - 1);
    const mid = (rmin + rmax) / 2;
    const amp = (rmax - rmin) / 2;
    return mid + amp * (0.62 * Math.sin(x * Math.PI * 2.2) + 0.3 * Math.sin(x * Math.PI * 6.1));
  };
  const toY = (v) => H - ((v - rmin) / (rmax - rmin)) * H;
  const smoothPts = Array.from({ length: samples }, (_, i) => {
    const v = Math.min(rmax, Math.max(rmin, signal(i)));
    return `${(i / (samples - 1)) * W},${toY(v)}`;
  }).join(' ');
  const stairPts = Array.from({ length: samples }, (_, i) => {
    const v = Math.min(rmax, Math.max(rmin, signal(i)));
    const vq = rmin + Math.round((v - rmin) / step) * step;
    return `${(i / (samples - 1)) * W},${toY(vq)}`;
  }).join(' ');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Mapping floats onto 256 integers</h3>
        <p className="text-gray-400 text-sm">
          A continuous range has to land on a ladder with a fixed number of rungs.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'map', label: '1 · Squeeze the range' },
          { id: 'snap', label: '2 · Round one weight' },
          { id: 'loss', label: '3 · What gets lost' },
        ]}
        value={view}
        onChange={setView}
      />

      <div className="flex justify-center gap-1.5 mb-3 flex-wrap">
        {Object.entries(RANGES).map(([id, v]) => (
          <button
            key={id}
            type="button"
            onClick={() => pickRange(id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
              rk === id ? 'bg-gray-200 text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* ── view 1: the whole-range mapping ── */}
      {view === 'map' && (
        <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4 pt-6">
          <svg viewBox="0 0 620 210" className="w-full h-[210px]">
            {/* FP32 rail */}
            <rect x="20" y="24" width="580" height="30" rx="8" fill="#0ea5e922" stroke="#38bdf8" strokeDasharray="5 4" />
            <text x="20" y="18" fill="#7dd3fc" fontSize="11" fontWeight="bold">
              FP32 · infinitely many values in between
            </text>
            <text x="26" y="44" fill="#bae6fd" fontSize="11" fontFamily="monospace">
              {rmin}
            </text>
            <text x="594" y="44" fill="#bae6fd" fontSize="11" fontFamily="monospace" textAnchor="end">
              {rmax}
            </text>

            {/* connectors */}
            {[
              { r: rmin, qv: -128, label: 'r_min → −128', color: '#f472b6' },
              { r: 0, qv: zeroPoint, label: '0.0 → zero_point', color: '#facc15' },
              { r: rmax, qv: 127, label: 'r_max → 127', color: '#f472b6' },
            ]
              .filter((c) => c.r >= rmin && c.r <= rmax)
              .map((c) => {
                const x1 = 20 + ((c.r - rmin) / (rmax - rmin)) * 580;
                const x2 = 20 + ((c.qv + 128) / 255) * 580;
                return (
                  <g key={c.label}>
                    <line x1={x1} y1="54" x2={x2} y2="146" stroke={c.color} strokeWidth="2" />
                    <circle cx={x1} cy="54" r="4" fill={c.color} />
                    <circle cx={x2} cy="146" r="4" fill={c.color} />
                    <text
                      x={(x1 + x2) / 2}
                      y="104"
                      fill={c.color}
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {c.label}
                    </text>
                  </g>
                );
              })}

            {/* faint uniform connectors to show evenness */}
            {Array.from({ length: 11 }).map((_, i) => {
              const t = i / 10;
              return (
                <line
                  key={i}
                  x1={20 + t * 580}
                  y1="54"
                  x2={20 + t * 580}
                  y2="146"
                  stroke="#ffffff"
                  strokeOpacity="0.07"
                />
              );
            })}

            {/* INT8 rail with rungs */}
            <rect x="20" y="146" width="580" height="30" rx="8" fill="#10b98122" stroke="#34d399" strokeDasharray="5 4" />
            {Array.from({ length: 52 }).map((_, i) => (
              <line
                key={i}
                x1={20 + (i / 51) * 580}
                y1="150"
                x2={20 + (i / 51) * 580}
                y2="172"
                stroke="#34d399"
                strokeOpacity="0.35"
              />
            ))}
            <text x="26" y="166" fill="#a7f3d0" fontSize="11" fontFamily="monospace">
              −128
            </text>
            <text x="594" y="166" fill="#a7f3d0" fontSize="11" fontFamily="monospace" textAnchor="end">
              127
            </text>
            <text x="20" y="198" fill="#6ee7b7" fontSize="11" fontWeight="bold">
              INT8 · exactly 256 rungs, evenly spaced
            </text>
          </svg>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="rounded-xl border border-violet-400/40 bg-violet-500/10 px-3 py-2">
              <div className="text-[10px] uppercase text-violet-300 font-bold">scale</div>
              <div className="text-lg font-mono font-bold text-white">{scale.toFixed(5)}</div>
              <p className="text-[10px] text-gray-400 leading-snug mt-0.5">
                the real-world distance between two neighbouring rungs
              </p>
            </div>
            <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2">
              <div className="text-[10px] uppercase text-amber-300 font-bold">zero_point</div>
              <div className="text-lg font-mono font-bold text-white">{zeroPoint}</div>
              <p className="text-[10px] text-gray-400 leading-snug mt-0.5">
                the rung that means exactly 0.0
              </p>
            </div>
          </div>

          <div className="mt-3">
            <NoteBox tone="violet">
              The float range is stretched over 256 evenly spaced rungs.{' '}
              <strong className="text-white">scale</strong> is how far apart those rungs are, and{' '}
              <strong className="text-white">zero_point</strong> is which rung lands on 0.0.{' '}
              {rk === 'relu'
                ? 'This range never goes negative, so 0.0 sits at the very bottom rung — that is why zero_point is −128 here.'
                : rk === 'sym'
                  ? 'This range is symmetric around zero, so zero_point lands in the middle.'
                  : 'This range is lopsided — more negative than positive — so zero_point is pushed off-centre. Handling that is exactly why zero_point exists.'}
            </NoteBox>
          </div>
        </div>
      )}

      {/* ── view 2: one value, two choices ── */}
      {view === 'snap' && (
        <>
          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
            <div className="text-center text-[11px] text-gray-400 mb-1">
              INT8 can only store whole numbers. Your value is not one.
            </div>

            <div className="relative h-[230px]">
              {/* the value, floating above */}
              <div
                className="absolute top-0 transition-all duration-150 -translate-x-1/2 text-center"
                style={{ left: `${xDot}%` }}
              >
                <div className="rounded-lg bg-white px-3 py-1 text-[13px] font-mono font-bold text-gray-900 whitespace-nowrap shadow-lg">
                  {clampedReal.toFixed(4)}
                </div>
                <div className="text-[9px] text-gray-400 mt-0.5">your weight</div>
                <div className="w-0.5 h-6 bg-white/70 mx-auto mt-1" />
              </div>

              {/* halfway marker */}
              {snapStage >= 2 && (
                <>
                  <div className="absolute left-1/2 top-[76px] bottom-[86px] w-px border-l border-dashed border-gray-600" />
                  <div className="absolute left-1/2 top-[70px] -translate-x-1/2 text-[9px] text-gray-500">
                    halfway
                  </div>
                </>
              )}

              {/* distance brackets */}
              {snapStage >= 2 && (
                <div className="absolute top-[96px] left-0 right-0 h-8">
                  {[
                    { x: 25, d: dLo, side: 'left', win: winner === qLo },
                    { x: 75, d: dHi, side: 'right', win: winner === qHi },
                  ].map((b) => {
                    const l = Math.min(b.x, xDot);
                    const w = Math.abs(b.x - xDot);
                    return (
                      <div key={b.side}>
                        <div
                          className={`absolute h-2 border-x-2 transition-all duration-150 ${
                            b.win ? 'border-emerald-400 bg-emerald-500/25' : 'border-gray-600 bg-gray-700/30'
                          }`}
                          style={{ left: `${l}%`, width: `${w}%` }}
                        />
                        <div
                          className={`absolute top-3 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono transition ${
                            b.win ? 'text-emerald-300 font-bold' : 'text-gray-500'
                          }`}
                          style={{ left: `${l + w / 2}%` }}
                        >
                          {b.d.toFixed(4)}
                          {b.win ? ' ← closer' : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* drop arrow onto the winner */}
              {snapStage >= 2 && (
                <div
                  className="absolute top-[130px] -translate-x-1/2 text-2xl text-emerald-400 transition-all duration-500"
                  style={{ left: `${xWin}%` }}
                >
                  ↓
                </div>
              )}

              {/* the two rungs */}
              {[
                { qv: qLo, v: vLo, x: 25 },
                { qv: qHi, v: vHi, x: 75 },
              ].map((s) => {
                const isWin = snapStage >= 2 && winner === s.qv;
                const dim = snapStage >= 2 && winner !== s.qv;
                return (
                  <div
                    key={s.qv}
                    className={`absolute bottom-[26px] -translate-x-1/2 w-[130px] rounded-xl border-2 py-2 text-center transition-all duration-300 ${
                      isWin
                        ? 'border-emerald-400 bg-emerald-500/25 scale-105'
                        : dim
                          ? 'border-gray-700 bg-gray-900/50 opacity-45'
                          : snapStage >= 1
                            ? 'border-violet-400/60 bg-violet-500/15'
                            : 'border-gray-800 bg-gray-900/40 opacity-40'
                    }`}
                    style={{ left: `${s.x}%` }}
                  >
                    <div className="text-xl font-mono font-bold text-white">{s.qv}</div>
                    {snapStage >= 1 && (
                      <div className="text-[10px] font-mono text-gray-400">= {s.v.toFixed(4)}</div>
                    )}
                    {isWin && (
                      <div className="text-[9px] font-bold text-emerald-300 uppercase mt-0.5">
                        stored
                      </div>
                    )}
                  </div>
                );
              })}

              {/* nothing in between */}
              {snapStage >= 1 && (
                <div className="absolute bottom-[58px] left-1/2 -translate-x-1/2 text-[10px] text-rose-400/80 italic">
                  nothing exists in here
                </div>
              )}

              {/* read back */}
              {snapStage >= 3 && (
                <div
                  className="absolute bottom-0 -translate-x-1/2 transition-all duration-300"
                  style={{ left: `${xWin}%` }}
                >
                  <div className="text-[10px] text-rose-300 font-mono whitespace-nowrap">
                    read back → {deq.toFixed(4)}
                  </div>
                </div>
              )}
            </div>

            <input
              type="range"
              min={rmin}
              max={rmax}
              step={(rmax - rmin) / 900}
              value={clampedReal}
              onChange={(e) => setReal(parseFloat(e.target.value))}
              className="w-full mt-1 accent-violet-500"
            />
            <div className="text-center text-[10px] text-gray-500 mt-1">
              drag the value across the halfway line and the winner flips
            </div>
          </div>

          {snapStage >= 3 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="rounded-xl border border-sky-400/40 bg-sky-500/10 px-2 py-2 text-center">
                <div className="text-[9px] uppercase text-sky-300">you had</div>
                <div className="text-sm font-mono font-bold text-white">{clampedReal.toFixed(4)}</div>
              </div>
              <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-2 py-2 text-center">
                <div className="text-[9px] uppercase text-emerald-300">stored (1 byte)</div>
                <div className="text-sm font-mono font-bold text-white">{winner}</div>
              </div>
              <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-2 py-2 text-center">
                <div className="text-[9px] uppercase text-rose-300">lost forever</div>
                <div className="text-sm font-mono font-bold text-white">{err.toFixed(4)}</div>
              </div>
            </div>
          )}

          <div className="mt-3">
            <NoteBox tone={snapStage === 3 ? 'rose' : 'violet'}>
              {snapStage === 0 && (
                <>
                  <strong className="text-white">Here is one weight from your model</strong> — an ordinary
                  float. To store it in a single byte it has to become a whole number between −128 and 127.
                </>
              )}
              {snapStage === 1 && (
                <>
                  <strong className="text-white">These are the only two options.</strong> Your value falls
                  between the rungs numbered {qLo} and {qHi}, which stand for {vLo.toFixed(4)} and{' '}
                  {vHi.toFixed(4)}. There is no rung in between — INT8 simply has no way to express
                  anything there.
                </>
              )}
              {snapStage === 2 && (
                <>
                  <strong className="text-white">So it picks whichever is closer.</strong> That is all
                  rounding is. Drag the slider across the halfway line and watch the winner switch sides.
                </>
              )}
              {snapStage === 3 && (
                <>
                  <strong className="text-white">
                    You stored {winner} and got back {deq.toFixed(4)} instead of {clampedReal.toFixed(4)}.
                  </strong>{' '}
                  That difference is gone permanently — and it can never be worse than half a rung
                  ({(scale / 2).toFixed(4)}). Do this to every weight in the model and you have a model
                  that is 4× smaller and very slightly wrong.
                </>
              )}
            </NoteBox>
          </div>

          <Nav
            step={snapStage}
            max={3}
            onBack={() => setSnapStage((s) => Math.max(0, s - 1))}
            onNext={() => setSnapStage((s) => Math.min(3, s + 1))}
          />
        </>
      )}

      {/* ── view 3: what gets lost ── */}
      {view === 'loss' && (
        <>
          <div className="flex justify-center gap-2 mb-3">
            {[8, 4, 2].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBits(b)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  bits === b ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                INT{b}
                <span className="block text-[9px] font-normal opacity-70">{Math.pow(2, b)} rungs</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[180px]">
              {/* rung guides */}
              {Array.from({ length: Math.min(levels, 64) }).map((_, i) => {
                const v = rmin + i * ((rmax - rmin) / (Math.min(levels, 64) - 1));
                return (
                  <line
                    key={i}
                    x1="0"
                    y1={toY(v)}
                    x2={W}
                    y2={toY(v)}
                    stroke="#34d399"
                    strokeOpacity={levels > 32 ? 0.08 : 0.2}
                  />
                );
              })}
              <polyline points={smoothPts} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              <polyline points={stairPts} fill="none" stroke="#34d399" strokeWidth="2.5" />
            </svg>

            <div className="flex justify-center gap-5 text-[10px] mt-1">
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-4 h-0.5 bg-sky-400" /> original FP32 values
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-4 h-0.5 bg-emerald-400" /> what INT{bits} can reconstruct
              </span>
            </div>
          </div>

          <div className="mt-3">
            <NoteBox tone={bits === 8 ? 'emerald' : bits === 4 ? 'amber' : 'rose'}>
              {bits === 8 && (
                <>
                  <strong className="text-white">The two lines are indistinguishable.</strong> 256 rungs
                  are fine enough that the reconstruction tracks the original almost perfectly — which is
                  why INT8 is the workhorse of production inference.
                </>
              )}
              {bits === 4 && (
                <>
                  <strong className="text-white">Now you can see the staircase.</strong> With only 16
                  rungs the curve is visibly blocky. Some models tolerate this; most need help from
                  quantization-aware training to survive it.
                </>
              )}
              {bits === 2 && (
                <>
                  <strong className="text-white">Four rungs destroys the signal.</strong> This is the
                  lossiness in its extreme form — the same trade-off as saving a photo as a low-quality
                  JPEG. Fewer bits is always smaller and faster, right up until the model stops being
                  useful.
                </>
              )}
            </NoteBox>
          </div>
        </>
      )}
    </div>
  );
}

/* ── 10. PTQ dynamic vs static vs QAT ─────────────────────────────────────── */

const METHODS = {
  dynamic: {
    label: 'Dynamic PTQ',
    stages: [
      { t: 'Train FP32', on: false },
      { t: 'Quantize weights offline', on: true },
      { t: 'Deploy', on: false },
      { t: 'Quantize activations at runtime', on: true, hot: true },
    ],
    effort: 'Lowest',
    accuracy: 'Good',
    speed: 'Moderate',
    note: 'Weights are quantized ahead of time, activations on the fly during inference. Easiest method to apply, and it works well where activation distributions vary a lot — LSTMs and Transformers. The runtime quantization overhead is what limits the gain.',
  },
  static: {
    label: 'Static PTQ',
    stages: [
      { t: 'Train FP32', on: false },
      { t: 'Calibrate on sample data', on: true, hot: true },
      { t: 'Quantize weights + activations offline', on: true },
      { t: 'Deploy · pure integer inference', on: true },
    ],
    effort: 'Low',
    accuracy: 'Good',
    speed: 'Best',
    note: 'A small representative calibration dataset is pushed through the model to record activation distributions. Those statistics fix the scale and zero-point for every activation tensor ahead of time, so no quantization work happens during inference. Typically the fastest option.',
  },
  qat: {
    label: 'Quantization-Aware Training',
    stages: [
      { t: 'Insert fake quant nodes', on: true, hot: true },
      { t: 'Train / fine-tune with simulated INT8', on: true },
      { t: 'Convert to real INT8', on: true },
      { t: 'Deploy', on: true },
    ],
    effort: 'Highest',
    accuracy: 'Best',
    speed: 'Best',
    note: 'Fake quantize/dequantize operations are inserted into the graph so the model experiences precision loss while it is still learning, and adapts its weights to be robust to it. Forward and backward still run in floating point. It almost always recovers the accuracy PTQ lost, and sometimes beats the FP32 baseline.',
  },
};

export function QuantMethodsVisualizer() {
  const [m, setM] = useState('dynamic');
  const meth = METHODS[m];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">When does the quantizing happen?</h3>
        <p className="text-gray-400 text-sm">
          That single question is the whole difference between the three methods.
        </p>
      </div>

      <Tabs
        options={Object.entries(METHODS).map(([id, v]) => ({ id, label: v.label }))}
        value={m}
        onChange={setM}
      />

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
        <div className="flex items-center justify-center gap-1 flex-wrap">
          {meth.stages.map((s, i) => (
            <React.Fragment key={s.t}>
              <div
                className={`rounded-xl border-2 px-3 py-3 w-[128px] text-center text-[11px] font-bold transition ${
                  s.hot
                    ? 'border-amber-400 bg-amber-500/25 text-amber-100'
                    : s.on
                      ? 'border-violet-400/60 bg-violet-500/15 text-violet-100'
                      : 'border-gray-700 bg-gray-900/60 text-gray-400'
                }`}
              >
                {s.t}
                {s.on && (
                  <div className="mt-1 text-[8px] uppercase tracking-wide text-gray-400">
                    quantization work
                  </div>
                )}
              </div>
              {i < meth.stages.length - 1 && <span className="text-gray-600">→</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 max-w-md mx-auto">
          {[
            ['Effort', meth.effort],
            ['Accuracy', meth.accuracy],
            ['Inference speed', meth.speed],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-gray-700 bg-gray-900 px-2 py-1.5 text-center">
              <div className="text-[9px] uppercase text-gray-500">{k}</div>
              <div className="text-xs font-bold text-white">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <NoteBox tone={m === 'qat' ? 'emerald' : 'violet'}>{meth.note}</NoteBox>
      </div>

      {m === 'qat' && (
        <div className="mt-2 rounded-xl border border-gray-700 bg-gray-950/70 p-3">
          <div className="text-[10px] uppercase text-gray-500 mb-2">A fake-quant node in the graph</div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono flex-wrap">
            <span className="rounded px-2 py-1 bg-sky-500/20 border border-sky-400/40 text-sky-200">
              FP32 tensor
            </span>
            <span className="text-gray-600">→</span>
            <span className="rounded px-2 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-200">
              quantize
            </span>
            <span className="text-gray-600">→</span>
            <span className="rounded px-2 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200">
              INT8
            </span>
            <span className="text-gray-600">→</span>
            <span className="rounded px-2 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-200">
              dequantize
            </span>
            <span className="text-gray-600">→</span>
            <span className="rounded px-2 py-1 bg-sky-500/20 border border-sky-400/40 text-sky-200">
              FP32 tensor
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 text-center leading-relaxed">
            The round trip changes the values exactly the way real INT8 would, while keeping everything
            differentiable so training can continue.
          </p>
        </div>
      )}
    </div>
  );
}

/* ── 11. Choosing a quantization strategy ─────────────────────────────────── */

const QMODELS = {
  resnet: { label: 'ResNet-50 (vision)', fp32: 76.1, ptq: 75.8, qat: 76.0, tol: 1.0 },
  mobilenet: { label: 'MobileNetV2 (edge)', fp32: 71.9, ptq: 66.2, qat: 71.6, tol: 1.0 },
  bert: { label: 'BERT-base (NLP)', fp32: 88.5, ptq: 85.1, qat: 88.2, tol: 1.0 },
};

export function QuantDecisionVisualizer() {
  const [mk, setMk] = useState('resnet');
  const [stage, setStage] = useState(0); // 0 start, 1 ptq applied, 2 judged, 3 done
  const m = QMODELS[mk];
  const drop = m.fp32 - m.ptq;
  const acceptable = drop <= m.tol;

  const reset = (k) => {
    setMk(k);
    setStage(0);
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Choosing a strategy</h3>
        <p className="text-gray-400 text-sm">
          Always try the cheap method first. Escalate only if accuracy says you must.
        </p>
      </div>

      <Tabs
        options={Object.entries(QMODELS).map(([id, v]) => ({ id, label: v.label }))}
        value={mk}
        onChange={reset}
      />

      <div className="flex-1 rounded-2xl border border-gray-700 bg-gray-950/70 p-4 flex flex-col items-center gap-1.5">
        <div className="rounded-full border-2 border-sky-400 bg-sky-500/20 px-6 py-2 text-xs font-bold text-white">
          Start with trained FP32 model · {m.fp32}%
        </div>
        <div className={`text-lg ${stage >= 1 ? 'text-violet-400' : 'text-gray-700'}`}>↓</div>

        <div
          className={`rounded-xl border-2 px-6 py-2 text-xs font-bold transition ${
            stage >= 1 ? 'border-amber-400 bg-amber-500/20 text-white' : 'border-gray-700 text-gray-600'
          }`}
        >
          Apply Post-Training Quantization
          {stage >= 1 && <span className="ml-2 font-mono text-amber-200">→ {m.ptq}%</span>}
        </div>

        {stage === 0 && (
          <button
            type="button"
            onClick={() => setStage(1)}
            className="mt-2 px-4 py-1.5 rounded-lg bg-violet-600 text-xs font-bold text-white"
          >
            Run PTQ →
          </button>
        )}

        {stage >= 1 && (
          <>
            <div className={`text-lg ${stage >= 2 ? 'text-violet-400' : 'text-gray-700'}`}>↓</div>
            <div
              className={`rounded-xl border-2 px-6 py-2 text-xs font-bold transition ${
                stage >= 2 ? 'border-rose-400 bg-rose-500/20 text-white' : 'border-gray-700 text-gray-600'
              }`}
            >
              Is accuracy acceptable?{' '}
              <span className="font-mono text-[10px] text-gray-300">
                (drop {drop.toFixed(1)} pts, tolerance {m.tol})
              </span>
            </div>
          </>
        )}

        {stage === 1 && (
          <button
            type="button"
            onClick={() => setStage(2)}
            className="mt-2 px-4 py-1.5 rounded-lg bg-violet-600 text-xs font-bold text-white"
          >
            Evaluate →
          </button>
        )}

        {stage >= 2 && !acceptable && (
          <>
            <div className="text-rose-400 text-xs font-mono">↓ No</div>
            <div
              className={`rounded-xl border-2 px-6 py-2 text-xs font-bold transition ${
                stage >= 3 ? 'border-amber-400 bg-amber-500/25 text-white' : 'border-gray-700 text-gray-500'
              }`}
            >
              Perform Quantization-Aware Training
              {stage >= 3 && <span className="ml-2 font-mono text-amber-200">→ {m.qat}%</span>}
            </div>
            {stage === 2 && (
              <button
                type="button"
                onClick={() => setStage(3)}
                className="mt-2 px-4 py-1.5 rounded-lg bg-violet-600 text-xs font-bold text-white"
              >
                Run QAT →
              </button>
            )}
          </>
        )}

        {stage >= 2 && acceptable && <div className="text-emerald-400 text-xs font-mono">↓ Yes</div>}

        {((stage >= 2 && acceptable) || stage >= 3) && (
          <div className="rounded-full border-2 border-emerald-400 bg-emerald-500/25 px-8 py-3 text-sm font-bold text-emerald-100 mt-1">
            Deploy quantized INT8 model · {acceptable ? m.ptq : m.qat}%
          </div>
        )}
      </div>

      <div className="mt-3">
        <NoteBox tone={stage < 2 ? 'violet' : acceptable ? 'emerald' : 'amber'}>
          {stage === 0 && 'You always start here: a trained FP32 model and a target accuracy you are willing to accept.'}
          {stage === 1 && `PTQ needs no retraining and no training data — just the model. ${m.label} lost ${drop.toFixed(1)} points.`}
          {stage >= 2 && acceptable && (
            <>
              A {drop.toFixed(1)}-point drop is within tolerance, so you are done. PTQ is fast, needs no
              access to the original training pipeline, and here it was enough.
            </>
          )}
          {stage === 2 && !acceptable && (
            <>
              A {drop.toFixed(1)}-point drop is too much. Depthwise-separable and attention-heavy models
              are notoriously sensitive to naive quantization — this is the case QAT exists for.
            </>
          )}
          {stage >= 3 && (
            <>
              <strong className="text-white">QAT recovered almost everything</strong> — {m.qat}% against
              an FP32 baseline of {m.fp32}%. It costs you a training loop, but you keep both the accuracy
              and the 4× size reduction.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}

/* ── 12. Quantization in practice ─────────────────────────────────────────── */

const PTQ_BLOCKS = [
  { id: 'imp', text: `import torch\nimport torch.quantization` },
  { id: null, text: `` },
  { id: 'eval', text: `# Assume \`model_fp32\` is your trained FP32 model\n# and \`calibration_loader\` provides representative data\nmodel_fp32.eval()` },
  { id: null, text: `` },
  { id: 'fuse', text: `# Step 1: Fuse modules like Conv-BN-ReLU for better accuracy and performance\n# This step combines layers that are often executed together\ntorch.quantization.fuse_modules(model_fp32, [['conv', 'relu']], inplace=True)` },
  { id: null, text: `` },
  { id: 'prepare', text: `# Step 2: Prepare the model for static quantization\n# This inserts observer modules to collect activation statistics\nmodel_fp32.qconfig = torch.quantization.get_default_qconfig('fbgemm')\nmodel_quantized_prepared = torch.quantization.prepare(model_fp32)` },
  { id: null, text: `` },
  { id: 'calib', text: `# Step 3: Calibrate the model by running data through it\nwith torch.no_grad():\n    for data, _ in calibration_loader:\n        model_quantized_prepared(data)` },
  { id: null, text: `` },
  { id: 'convert', text: `# Step 4: Convert the model to its final quantized form\nmodel_quantized = torch.quantization.convert(model_quantized_prepared)` },
  { id: null, text: `` },
  { id: null, text: `# The resulting \`model_quantized\` is ready for deployment` },
];

const PTQ_NOTES = {
  imp: 'The quantization toolkit ships with PyTorch — there is no separate install for either PTQ or QAT.',
  eval: 'eval() matters: BatchNorm and Dropout must be in inference mode before you record activation statistics, or your calibration is measuring the wrong thing.',
  fuse: 'Fusing Conv-BN-ReLU into one op means one quantization step instead of three, so less rounding error accumulates — and the fused kernel is faster too.',
  prepare: 'prepare() walks the graph and inserts observer modules at every point that will need a scale and zero-point. The qconfig picks the backend: fbgemm for x86 servers, qnnpack for ARM/mobile.',
  calib: 'This is the calibration pass and the heart of static PTQ. A few hundred representative samples are enough — the observers only need to learn the min/max distribution of each activation tensor. no_grad() because nothing is being trained.',
  convert: 'convert() reads what the observers learned, computes the final scale and zero-point per tensor, and swaps every float module for its integer equivalent. After this the weights really are INT8.',
};

export function QuantPracticeVisualizer() {
  const [tab, setTab] = useState('code');
  const [focus, setFocus] = useState('prepare');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Static PTQ, start to finish</h3>
        <p className="text-gray-400 text-sm">Four steps in PyTorch, and what they buy you.</p>
      </div>

      <Tabs
        options={[
          { id: 'code', label: 'The four steps' },
          { id: 'result', label: 'FP32 vs INT8 result' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'code' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-3 min-h-0">
          <CodeBlocks blocks={PTQ_BLOCKS} focus={focus} setFocus={setFocus} file="quantize_ptq.py" />
          <div className="flex flex-col gap-2 min-h-0 overflow-auto custom-scroll">
            <NoteBox>{PTQ_NOTES[focus]}</NoteBox>
            <div className="rounded-xl border border-gray-700 bg-gray-950/70 p-3">
              <div className="text-[10px] font-bold uppercase text-gray-500 mb-2">Pipeline</div>
              {['fuse', 'prepare', 'calib', 'convert'].map((id, i) => (
                <div key={id} className="flex items-center gap-2 mb-1.5 last:mb-0">
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      focus === id ? 'bg-violet-500 text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-[11px] ${focus === id ? 'text-white font-bold' : 'text-gray-400'}`}>
                    {['fuse modules', 'insert observers', 'calibrate', 'convert to INT8'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'result' && (
        <div className="flex-1 overflow-auto custom-scroll max-w-2xl w-full mx-auto space-y-4">
          {[
            { k: 'Model size', fp32: 510, int8: 128, unit: 'MB', max: 510 },
            { k: 'Inference latency', fp32: 150, int8: 45, unit: 'ms', max: 150 },
          ].map((row) => (
            <div key={row.k}>
              <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{row.k}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-12 text-[10px] font-mono text-gray-400">FP32</span>
                  <div className="flex-1 h-7 rounded bg-gray-800 overflow-hidden">
                    <div
                      className="h-full bg-sky-600 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                      style={{ width: `${(row.fp32 / row.max) * 100}%` }}
                    >
                      {row.fp32} {row.unit}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12 text-[10px] font-mono text-gray-400">INT8</span>
                  <div className="flex-1 h-7 rounded bg-gray-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                      style={{ width: `${(row.int8 / row.max) * 100}%` }}
                    >
                      {row.int8} {row.unit}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-emerald-400 font-bold mt-1">
                {(row.fp32 / row.int8).toFixed(1)}× better
              </div>
            </div>
          ))}

          <div className="flex items-center justify-center gap-2 rounded-xl border border-violet-400/40 bg-violet-500/10 px-4 py-3">
            <Zap className="w-4 h-4 text-violet-300 shrink-0" />
            <p className="text-sm text-gray-200 leading-relaxed">
              A typical vision model: nearly <strong className="text-white">4× smaller</strong> and over{' '}
              <strong className="text-white">3× faster</strong>.
            </p>
          </div>

          <NoteBox tone="amber">
            One rule that never changes: always validate the quantized model on a held-out test set. The
            conversion is lossy, and the only way to know the loss is acceptable for your application is
            to measure it.
          </NoteBox>
        </div>
      )}
    </div>
  );
}

/* ── 13. How QAT actually trains ──────────────────────────────────────────── */

const RUNG = 0.02; // illustrative step size
const W_START = 0.347;
const W_AFTER = 0.3412;

const QAT_STEPS = [
  {
    title: 'One model — not two',
    note: 'There is never an INT8 model training beside an FP32 one. A single set of FP32 weights is trained, exactly as before. Everything QAT adds happens inside the forward pass of that one model.',
  },
  {
    title: 'Fake-quant rounds the weight',
    note: 'Before the weight is used, it is rounded to the nearest INT8 rung and immediately converted back to float. The layer receives 0.3400 instead of 0.3470. The arithmetic is still floating point — only the value has been degraded, exactly the way INT8 would degrade it.',
  },
  {
    title: 'The layer computes with the damaged value',
    note: 'Activations get the same treatment on the way through. By the time the output appears, it carries the same error the deployed integer model would produce.',
  },
  {
    title: 'The loss already includes the error',
    note: 'This is the whole point. The loss the model is being optimised against is the loss it will actually have after quantization — not the optimistic FP32 one.',
  },
  {
    title: 'Backward: the straight-through estimator',
    note: 'round() has a derivative of zero almost everywhere, so a normal backward pass would kill every gradient at the fake-quant node. QAT cheats: the node passes the gradient through unchanged (clipped if the value fell outside the range). Rounding is honoured going forward and ignored coming back.',
  },
  {
    title: 'Update the FP32 master weight',
    note: 'The optimizer updates the floating-point weight — never an integer. Here it moved from 0.3470 to 0.3412, closer to the rung, so next step the rounding costs less. Repeat for a few epochs at a low learning rate and the network adapts to the grid.',
  },
  {
    title: 'Only now does it become INT8',
    note: 'After fine-tuning, convert() reads the learned ranges and emits the real integer model. The weights it rounds are already sitting where rounding barely hurts, which is why QAT recovers the accuracy PTQ lost.',
  },
];

function QatNode({ active, done, tone, title, sub, badge }) {
  const tones = {
    sky: 'border-sky-400 bg-sky-500/25',
    amber: 'border-amber-400 bg-amber-500/25',
    violet: 'border-violet-400 bg-violet-500/25',
    rose: 'border-rose-400 bg-rose-500/25',
    emerald: 'border-emerald-400 bg-emerald-500/25',
  };
  return (
    <div
      className={`w-full max-w-sm rounded-xl border-2 px-3 py-2 text-center transition-all duration-300 ${
        active
          ? `${tones[tone]} scale-[1.03]`
          : done
            ? 'border-gray-600 bg-gray-800/60'
            : 'border-gray-800 bg-gray-900/40 opacity-50'
      }`}
    >
      <div className="text-[11px] font-bold text-white">{title}</div>
      {sub && <div className="text-[11px] font-mono text-gray-300 mt-0.5">{sub}</div>}
      {badge && (
        <div className="mt-1 inline-block rounded bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-white">
          {badge}
        </div>
      )}
    </div>
  );
}

const SPREAD = [
  -0.913, -0.742, -0.631, -0.494, -0.417, -0.353, -0.268, -0.191, -0.127, -0.068, -0.013, 0.041,
  0.096, 0.153, 0.211, 0.287, 0.347, 0.418, 0.492, 0.566, 0.648, 0.731, 0.829, 0.934,
];

export function QatMechanicsVisualizer() {
  const [tab, setTab] = useState('step');
  const [step, setStep] = useState(0);
  const [adapted, setAdapted] = useState(false);

  const weight = step >= 5 ? W_AFTER : W_START;
  const rounded = Math.round(weight / RUNG) * RUNG;
  const errNow = Math.abs(weight - rounded);

  // tab 2 data
  const pts = SPREAD.map((w) => {
    const rung = Math.round(w / RUNG) * RUNG;
    const shown = adapted ? w + (rung - w) * 0.86 : w;
    return { shown, err: Math.abs(shown - rung) };
  });
  const avgErr = pts.reduce((a, p) => a + p.err, 0) / pts.length;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">How QAT actually trains</h3>
        <p className="text-gray-400 text-sm">
          One model, FP32 weights throughout, INT8 only simulated in the forward pass.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'step', label: 'One training step' },
          { id: 'why', label: 'Why it recovers accuracy' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'step' && (
        <>
          {step === 0 && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="rounded-xl border-2 border-rose-500/60 bg-rose-500/10 p-3 text-center relative">
                <div className="absolute inset-0 flex items-center justify-center text-4xl text-rose-500/70 font-bold">
                  ✕
                </div>
                <div className="text-[10px] uppercase text-rose-300 font-bold mb-2">not this</div>
                <div className="flex justify-center gap-2 opacity-60">
                  <div className="rounded-lg border border-gray-600 px-2 py-3 text-[10px] text-gray-300">
                    FP32 model
                  </div>
                  <div className="rounded-lg border border-gray-600 px-2 py-3 text-[10px] text-gray-300">
                    INT8 model
                  </div>
                </div>
                <div className="text-[9px] text-gray-500 mt-2">two models trained side by side</div>
              </div>
              <div className="rounded-xl border-2 border-emerald-500/60 bg-emerald-500/10 p-3 text-center">
                <div className="text-[10px] uppercase text-emerald-300 font-bold mb-2">this</div>
                <div className="flex justify-center">
                  <div className="rounded-lg border-2 border-emerald-400 bg-emerald-500/20 px-3 py-3 text-[10px] text-white font-bold">
                    one FP32 model
                    <div className="text-[9px] font-normal text-emerald-200 mt-0.5">
                      + fake-quant nodes
                    </div>
                  </div>
                </div>
                <div className="text-[9px] text-gray-400 mt-2">INT8 is simulated, never stored</div>
              </div>
            </div>
          )}

          <div className="flex-1 rounded-2xl border border-gray-700 bg-gray-950/70 p-3 flex flex-col items-center gap-1">
            <QatNode
              active={step === 0 || step === 5}
              done={step > 0}
              tone={step === 5 ? 'emerald' : 'sky'}
              title="FP32 master weight"
              sub={`w = ${weight.toFixed(4)}`}
              badge={step === 5 ? `updated · error now ${errNow.toFixed(4)}` : null}
            />
            <div className={`text-sm ${step >= 1 ? 'text-violet-400' : 'text-gray-700'}`}>↓</div>

            <div className="w-full max-w-sm relative">
              <QatNode
                active={step === 1 || step === 4}
                done={step > 1}
                tone={step === 4 ? 'emerald' : 'amber'}
                title="Fake-quant node"
                sub={step >= 1 ? `round → q=${Math.round(weight / RUNG)} → back to ${rounded.toFixed(4)}` : null}
                badge={step === 4 ? 'STE: gradient passes straight through' : null}
              />
              {step === 4 && (
                <div className="mt-1 text-[10px] text-center text-rose-300 font-mono">
                  d(round)/dx = 0 — ignored on the way back
                </div>
              )}
            </div>

            <div className={`text-sm ${step >= 2 ? 'text-violet-400' : 'text-gray-700'}`}>↓</div>
            <QatNode
              active={step === 2}
              done={step > 2}
              tone="violet"
              title="Layer computes"
              sub={step >= 2 ? `uses ${rounded.toFixed(4)}, not ${weight.toFixed(4)}` : null}
            />

            <div className={`text-sm ${step >= 3 ? 'text-violet-400' : 'text-gray-700'}`}>↓</div>
            <QatNode
              active={step === 3}
              done={step > 3}
              tone="rose"
              title="Loss"
              sub={step >= 3 ? 'already includes the quantization error' : null}
            />

            {step >= 4 && (
              <div className="w-full max-w-sm mt-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-center text-[10px] text-emerald-200">
                ↑ gradient travels back up this same path ↑
              </div>
            )}

            {step >= 6 && (
              <div className="w-full max-w-sm mt-2 rounded-xl border-2 border-emerald-400 bg-emerald-500/25 px-3 py-2 text-center">
                <div className="text-[11px] font-bold text-white">convert() → real INT8 model</div>
                <div className="text-[10px] text-emerald-200 font-mono">
                  weights already sit near the rungs
                </div>
              </div>
            )}
          </div>

          <div className="mt-3">
            <NoteBox tone={step === 4 ? 'amber' : step >= 5 ? 'emerald' : 'violet'}>
              <strong className="text-white">
                {step + 1}. {QAT_STEPS[step].title}.
              </strong>{' '}
              {QAT_STEPS[step].note}
            </NoteBox>
          </div>

          <Nav
            step={step}
            max={QAT_STEPS.length - 1}
            onBack={() => setStep((s) => Math.max(0, s - 1))}
            onNext={() => setStep((s) => Math.min(QAT_STEPS.length - 1, s + 1))}
          />
        </>
      )}

      {tab === 'why' && (
        <>
          <div className="flex justify-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setAdapted(false)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                !adapted ? 'bg-rose-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              PTQ — weights never saw the grid
            </button>
            <button
              type="button"
              onClick={() => setAdapted(true)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                adapted ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              QAT — weights adapted to it
            </button>
          </div>

          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-3">
              24 weights from one layer, against the INT8 grid
            </div>
            <div className="relative h-24 rounded-lg bg-gray-900/70 border border-gray-700">
              {Array.from({ length: 21 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-y-0 w-px bg-emerald-500/30"
                  style={{ left: `${(i / 20) * 100}%` }}
                />
              ))}
              {pts.map((p, i) => (
                <div
                  key={i}
                  className="absolute w-2.5 h-2.5 rounded-full -translate-x-1/2 transition-all duration-700"
                  style={{
                    left: `${((p.shown + 1) / 2) * 100}%`,
                    top: `${14 + (i % 6) * 13}px`,
                    backgroundColor: p.err > RUNG * 0.3 ? '#fb7185' : '#34d399',
                  }}
                />
              ))}
            </div>
            <div className="text-center text-[9px] text-gray-500 mt-1">
              vertical lines are the only values INT8 can store
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                <span>average rounding error per weight</span>
                <span className={`font-mono font-bold ${adapted ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {avgErr.toFixed(4)}
                </span>
              </div>
              <div className="h-4 rounded bg-gray-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${
                    adapted ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${(avgErr / (RUNG / 2)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <NoteBox tone={adapted ? 'emerald' : 'rose'}>
              {adapted ? (
                <>
                  <strong className="text-white">The weights moved onto the grid.</strong> Training with
                  fake-quant in the loop gave the optimizer a reason to prefer values that survive
                  rounding — and to let neighbouring weights absorb whatever error remains. Same 8 bits,
                  far less damage.
                </>
              ) : (
                <>
                  <strong className="text-white">The weights sit wherever training left them.</strong>{' '}
                  Nothing ever told them the grid existed, so on average each one is off by about a
                  quarter of a rung. Across millions of weights that is the accuracy PTQ loses.
                </>
              )}
            </NoteBox>
          </div>
        </>
      )}
    </div>
  );
}
