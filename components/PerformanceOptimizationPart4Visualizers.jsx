import React, { useState } from 'react';
import { Cpu, Zap, Check, X, AlertTriangle, Terminal, Gauge } from 'lucide-react';

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
            value === o.id ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
      <button
        type="button"
        onClick={onReset}
        className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300"
      >
        Reset
      </button>
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
        className="px-4 py-1.5 rounded-lg bg-amber-600 text-xs font-bold text-white disabled:opacity-30"
      >
        Next →
      </button>
    </div>
  );
}

function py(code) {
  const out = [];
  const re =
    /(#[^\n]*)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|\b(import|from|as|with|for|in|if|else|def|class|return|True|False|None|print|enumerate|super|range)\b|\b(\d[\d_]*)\b/g;
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

function ScriptViewer({ blocks, focus, setFocus, file, diff = false }) {
  return (
    <div className="rounded-2xl bg-black/85 border border-gray-700 overflow-auto custom-scroll min-h-0">
      <div className="px-3 py-1.5 border-b border-gray-800 text-[10px] font-mono text-gray-500 sticky top-0 bg-black/95 z-10 flex justify-between">
        <span>{file}</span>
        {diff && <span className="text-emerald-400">showing only what changed</span>}
      </div>
      <div className="p-2 font-mono text-[12px] leading-6">
        {blocks.map((b, i) => {
          if (!b.id) {
            return (
              <pre
                key={`s${i}`}
                className={`whitespace-pre px-1.5 text-gray-300 border-l-2 border-transparent ${
                  diff ? 'opacity-25' : ''
                }`}
              >
                {py(b.text)}
              </pre>
            );
          }
          const dim = diff && !b.chg;
          const lit = diff && b.chg;
          return (
            <button
              key={b.id}
              type="button"
              onMouseEnter={() => setFocus(b.id)}
              onClick={() => setFocus(b.id)}
              className={`block w-full text-left rounded-md px-1.5 transition border-l-2 ${
                lit
                  ? 'bg-emerald-500/15 border-emerald-400'
                  : focus === b.id
                    ? 'bg-amber-500/20 ring-1 ring-amber-400/60 border-amber-400'
                    : 'border-transparent hover:bg-white/5'
              } ${dim ? 'opacity-25' : ''}`}
            >
              <pre className="whitespace-pre text-gray-300">{py(b.text)}</pre>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NoteBox({ children, tone = 'amber' }) {
  const map = {
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

/* ── 1. Lab prerequisites / readiness ─────────────────────────────────────── */

const ARCHS = [
  {
    id: 'pascal',
    name: 'Pascal',
    ex: 'P100 · GTX 1080',
    tc: false,
    gen: '—',
    speed: 1.05,
    verdict: 'AMP will run, but there are no Tensor Cores. You still save memory; you gain almost no speed.',
  },
  {
    id: 'volta',
    name: 'Volta',
    ex: 'V100',
    tc: true,
    gen: '1st gen',
    speed: 1.6,
    verdict: 'The first architecture with dedicated Tensor Cores. This is the minimum for a real AMP speedup.',
  },
  {
    id: 'turing',
    name: 'Turing',
    ex: 'T4 · RTX 2080',
    tc: true,
    gen: '2nd gen',
    speed: 1.7,
    verdict: 'Solid FP16 throughput, and T4 instances are cheap — a good machine for this lab.',
  },
  {
    id: 'ampere',
    name: 'Ampere',
    ex: 'A100 · RTX 3090',
    tc: true,
    gen: '3rd gen',
    speed: 2.2,
    verdict: 'Adds BF16 and TF32. The speedup from AMP here is pronounced, and BF16 removes most loss-scaling worries.',
  },
  {
    id: 'hopper',
    name: 'Hopper',
    ex: 'H100',
    tc: true,
    gen: '4th gen',
    speed: 2.8,
    verdict: 'Adds FP8 on top. Mixed precision is not optional on this hardware — full FP32 leaves most of the chip unused.',
  },
];

export function LabReadinessVisualizer() {
  const [a, setA] = useState('turing');
  const cur = ARCHS.find((x) => x.id === a);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Is your machine ready?</h3>
        <p className="text-gray-400 text-sm">Pick the GPU architecture you will run this lab on.</p>
      </div>

      <div className="flex justify-center gap-1.5 mb-4 flex-wrap">
        {ARCHS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setA(x.id)}
            className={`rounded-xl border-2 px-3 py-2 text-center transition w-[104px] ${
              a === x.id
                ? 'border-amber-400 bg-amber-500/20'
                : 'border-gray-700 bg-gray-900/60 hover:border-gray-600'
            }`}
          >
            <div className="text-[11px] font-bold text-white">{x.name}</div>
            <div className="text-[9px] text-gray-500">{x.ex}</div>
            <div className={`text-[9px] mt-1 font-bold ${x.tc ? 'text-emerald-400' : 'text-rose-400'}`}>
              {x.tc ? `TC ${x.gen}` : 'no Tensor Cores'}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
          expected training time for this lab
        </div>
        {[
          ['FP32 baseline', 1, 'bg-sky-600'],
          [`AMP on ${cur.name}`, 1 / cur.speed, cur.speed > 1.3 ? 'bg-emerald-500' : 'bg-amber-500'],
        ].map(([k, frac, col]) => (
          <div key={k} className="flex items-center gap-2 mb-2">
            <span className="w-32 text-[10px] font-mono text-gray-400 shrink-0">{k}</span>
            <div className="flex-1 h-7 rounded bg-gray-800 overflow-hidden">
              <div
                className={`h-full ${col} transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white`}
                style={{ width: `${frac * 100}%` }}
              >
                {Math.round(75 * frac)}s
              </div>
            </div>
          </div>
        ))}
        <div className="text-center mt-2">
          <span className="text-2xl font-bold text-amber-300">{cur.speed.toFixed(2)}×</span>
          <span className="text-[10px] text-gray-500 ml-2">expected speedup</span>
        </div>
      </div>

      <div className="mt-3">
        <NoteBox tone={cur.tc ? 'emerald' : 'rose'}>{cur.verdict}</NoteBox>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
        {[
          ['NVIDIA GPU', 'Volta, Turing, Ampere or newer for the full benefit', cur.tc],
          ['PyTorch', 'pip install torch torchvision', true],
          ['A machine', 'A cloud instance or a local on-premise box', true],
        ].map(([k, d, ok]) => (
          <div
            key={k}
            className={`rounded-xl border p-3 ${
              ok ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-rose-400/40 bg-rose-500/10'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              {ok ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span className="text-xs font-bold text-white">{k}</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed font-mono">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── the two scripts ──────────────────────────────────────────────────────── */

const IMPORTS = `import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms
import time`;

const DATA = `# 1. Data Loading and Preparation
transform = transforms.Compose(
    [transforms.ToTensor(),
     transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])

trainset = torchvision.datasets.CIFAR10(root='./data', train=True,
                                        download=True, transform=transform)
trainloader = torch.utils.data.DataLoader(trainset, batch_size=256,
                                          shuffle=True, num_workers=4)`;

const MODEL = `# 2. A simple CNN Model
class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2)
        )
        self.classifier = nn.Sequential(
            nn.Linear(64 * 8 * 8, 512),
            nn.ReLU(),
            nn.Linear(512, 10)
        )

    def forward(self, x):
        x = self.features(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x`;

const SETUP = `device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
model = SimpleCNN().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)`;

const TAIL = `end_time = time.time()
total_time = end_time - start_time`;

const FP32_BLOCKS = [
  { id: 'imp', text: IMPORTS },
  { id: null, text: `` },
  { id: 'data', text: DATA },
  { id: null, text: `` },
  { id: 'model', text: MODEL },
  { id: null, text: `` },
  { id: 'setup', text: SETUP },
  { id: null, text: `` },
  {
    id: 'loop',
    text: `# 3. Standard FP32 Training Loop
print("Starting FP32 baseline training...")
start_time = time.time()

for epoch in range(5):  # loop over the dataset 5 times
    running_loss = 0.0
    for i, data in enumerate(trainloader, 0):
        inputs, labels = data[0].to(device), data[1].to(device)`,
  },
  {
    id: 'zero',
    text: `
        # zero the parameter gradients
        optimizer.zero_grad()`,
  },
  {
    id: 'step',
    text: `
        # forward + backward + optimize
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()`,
  },
  {
    id: 'log',
    text: `
        running_loss += loss.item()
        if i % 100 == 99:    # print every 100 mini-batches
            print(f'[Epoch: {epoch + 1}, Batch: {i + 1:5d}] loss: {running_loss / 100:.3f}')
            running_loss = 0.0`,
  },
  { id: null, text: `` },
  { id: 'time', text: `${TAIL}\nprint(f'Finished FP32 Training in {total_time:.2f} seconds')` },
];

const FP32_NOTES = {
  imp: 'A plain PyTorch setup. Note what is absent: nothing from torch.cuda.amp yet. time is imported because the whole point of this lab is to measure.',
  data: 'CIFAR-10 with batch_size=256 and num_workers=4. A large batch matters here — Tensor Cores need enough work per kernel to show their advantage, and four workers keep the GPU fed so we are measuring compute, not the input pipeline.',
  model: 'A deliberately ordinary CNN: two convolution blocks and two linear layers. Convolutions and linear layers are exactly the operations that Tensor Cores accelerate, which is why even this small model will show a clear gain.',
  setup: 'Everything lives on the GPU in FP32. Weights, activations and gradients are all 32-bit — this is the memory footprint we will cut nearly in half.',
  loop: 'Five epochs over the dataset, timed from before the first batch. Standard structure, nothing unusual.',
  zero: 'Gradients accumulate by default in PyTorch, so they are cleared at the start of every iteration. This line is unchanged by AMP.',
  step: 'The four lines at the heart of it: forward, loss, backward, update. Three of these four lines are what AMP modifies — this is the region to watch when we compare scripts.',
  log: 'Printing every 100 mini-batches gives you a loss curve to sanity-check against later. If AMP were hurting numerical stability, you would see it diverge here.',
  time: 'The number that matters. Take note of it, and also watch nvidia-smi in another terminal to record peak memory.',
};

const AMP_BLOCKS = [
  { id: 'imp', text: IMPORTS, chg: false },
  { id: null, text: `` },
  { id: 'data', text: DATA.replace('# 1. Data Loading and Preparation', '# 1. Data Loading and Preparation (No changes here)'), chg: false },
  { id: null, text: `` },
  { id: 'model', text: MODEL.replace('# 2. A simple CNN Model', '# 2. Model definition (No changes here)'), chg: false },
  { id: null, text: `` },
  { id: 'setup', text: SETUP, chg: false },
  { id: null, text: `` },
  {
    id: 'c1',
    chg: true,
    text: `# AMP CHANGE 1: Initialize a GradScaler
scaler = torch.cuda.amp.GradScaler()`,
  },
  { id: null, text: `` },
  {
    id: 'loop',
    chg: false,
    text: `# 3. Modified Training Loop with AMP
print("Starting AMP optimized training...")
start_time = time.time()

for epoch in range(5):  # loop over the dataset 5 times
    running_loss = 0.0
    for i, data in enumerate(trainloader, 0):
        inputs, labels = data[0].to(device), data[1].to(device)

        # zero the parameter gradients
        optimizer.zero_grad()`,
  },
  {
    id: 'c2',
    chg: true,
    text: `
        # AMP CHANGE 2: Wrap the forward pass with autocast
        with torch.cuda.amp.autocast():
            outputs = model(inputs)
            loss = criterion(outputs, labels)`,
  },
  {
    id: 'c3',
    chg: true,
    text: `
        # AMP CHANGE 3: Use the scaler for the backward pass and optimizer step
        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()`,
  },
  {
    id: 'log',
    chg: false,
    text: `
        running_loss += loss.item()
        if i % 100 == 99:    # print every 100 mini-batches
            print(f'[Epoch: {epoch + 1}, Batch: {i + 1:5d}] loss: {running_loss / 100:.3f}')
            running_loss = 0.0`,
  },
  { id: null, text: `` },
  {
    id: 'time',
    chg: true,
    text: `${TAIL}\nprint(f'Finished AMP Training in {total_time:.2f} seconds')`,
  },
];

const AMP_NOTES = {
  imp: 'Unchanged. torch.cuda.amp is part of torch, so there is nothing extra to import at the top — the module is referenced by its full path below.',
  data: 'Unchanged. The input pipeline has nothing to do with precision; the cast happens on the GPU, inside the model.',
  model: 'Unchanged, and this is the important part. You do not rewrite layers, change dtypes, or call .half() anywhere. The model definition is precision-agnostic.',
  setup: 'Unchanged. The master weights stay in FP32 — this is deliberate. Optimizer updates are often tiny relative to the weight value, and doing them in FP16 would round them away entirely.',
  c1: 'Change 1. One GradScaler for the whole run, created once outside the loop. It carries the scale factor between iterations and adapts it over time, so it has to persist.',
  loop: 'The loop skeleton is identical, including zero_grad(). Only the three marked regions differ from the baseline.',
  c2: 'Change 2. Everything inside this context manager gets routed per-operation: convolutions and linear layers run in FP16 on Tensor Cores, while operations needing range or precision stay FP32. Note that the loss is computed inside the block too, so the loss function is included in the routing decision.',
  c3: 'Change 3, three lines that replace loss.backward() and optimizer.step(). scale() multiplies the loss up so small gradients survive FP16; step() unscales and skips the update if anything overflowed; update() adjusts the scale factor for next time.',
  time: 'Only the printed label changed. Compare this number directly against the baseline run.',
};

export function BaselineScriptVisualizer() {
  const [focus, setFocus] = useState('step');
  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">The baseline: fp32_baseline.py</h3>
        <p className="text-gray-400 text-sm">The whole script. Tap any region to see why it is there.</p>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-3 min-h-0">
        <ScriptViewer blocks={FP32_BLOCKS} focus={focus} setFocus={setFocus} file="fp32_baseline.py" />
        <div className="flex flex-col gap-2 min-h-0 overflow-auto custom-scroll">
          <NoteBox>{FP32_NOTES[focus]}</NoteBox>
          <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3">
            <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Run it</div>
            <pre className="font-mono text-[11px] text-emerald-400">$ python fp32_baseline.py</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AmpScriptVisualizer() {
  const [focus, setFocus] = useState('c2');
  const [diff, setDiff] = useState(true);
  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">The modified script: amp_optimized.py</h3>
        <p className="text-gray-400 text-sm">Same file, three edits. Toggle the diff to see how few.</p>
      </div>

      <div className="flex justify-center mb-2">
        <button
          type="button"
          onClick={() => setDiff((v) => !v)}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
            diff ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300'
          }`}
        >
          {diff ? 'Diff mode ON — only the 3 changes are lit' : 'Diff mode OFF — full script'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-3 min-h-0">
        <ScriptViewer
          blocks={AMP_BLOCKS}
          focus={focus}
          setFocus={setFocus}
          file="amp_optimized.py"
          diff={diff}
        />
        <div className="flex flex-col gap-2 min-h-0 overflow-auto custom-scroll">
          <NoteBox tone={['c1', 'c2', 'c3'].includes(focus) ? 'emerald' : 'amber'}>
            {AMP_NOTES[focus]}
          </NoteBox>
          <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3">
            <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">Run it</div>
            <pre className="font-mono text-[11px] text-emerald-400">$ python amp_optimized.py</pre>
          </div>
          <div className="rounded-xl border border-sky-400/40 bg-sky-500/10 p-3 text-xs text-gray-200 leading-relaxed">
            Three edits, none of them in the model or the data pipeline. That is the whole point of the
            <span className="font-mono"> torch.cuda.amp </span>
            design — the changes are surprisingly minor.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 4. autocast op router ────────────────────────────────────────────────── */

const OPS = [
  { id: 'conv', name: 'nn.Conv2d', lane: 16, why: 'A matrix multiply in disguise. This is precisely the shape of work Tensor Cores exist for, and it is numerically forgiving — the summation happens in FP32 internally anyway.' },
  { id: 'lin', name: 'nn.Linear', lane: 16, why: 'A dense matrix multiply. Same reasoning as convolution: huge speedup, negligible risk.' },
  { id: 'mm', name: 'torch.matmul', lane: 16, why: 'The raw operation behind both of the above. Routed to FP16 wherever it appears.' },
  { id: 'relu', name: 'nn.ReLU', lane: 16, why: 'Elementwise and cheap. It inherits the dtype of its input and stays in half precision, which halves the activation memory it has to move.' },
  { id: 'ce', name: 'CrossEntropyLoss', lane: 32, why: 'Contains a log and a sum over the batch. Logs of small probabilities and long summations both lose accuracy fast in FP16, so autocast keeps this in FP32.' },
  { id: 'softmax', name: 'log_softmax', lane: 32, why: 'Exponentials overflow FP16 easily and logs underflow it. This one is kept in full precision as a matter of safety.' },
  { id: 'sum', name: 'tensor.sum()', lane: 32, why: 'Reductions accumulate many values into one. Rounding error compounds with every addition, so long reductions stay FP32.' },
  { id: 'norm', name: 'LayerNorm', lane: 32, why: 'Computes a mean and a variance — a reduction followed by a division by a possibly tiny number. FP32 keeps it stable.' },
];

export function AutocastVisualizer() {
  const [routed, setRouted] = useState([]);
  const [sel, setSel] = useState(null);
  const pending = OPS.filter((o) => !routed.includes(o.id));
  const cur = OPS.find((o) => o.id === sel);

  const route = (id) => {
    setSel(id);
    setRouted((r) => (r.includes(id) ? r : [...r, id]));
  };

  const Lane = ({ bits }) => {
    const items = OPS.filter((o) => routed.includes(o.id) && o.lane === bits);
    const is16 = bits === 16;
    return (
      <div
        className={`flex-1 rounded-2xl border-2 p-3 min-h-[150px] ${
          is16 ? 'border-emerald-400/50 bg-emerald-500/10' : 'border-sky-400/50 bg-sky-500/10'
        }`}
      >
        <div className="flex items-center gap-1.5 mb-2">
          {is16 ? (
            <Zap className="w-4 h-4 text-emerald-300" />
          ) : (
            <Cpu className="w-4 h-4 text-sky-300" />
          )}
          <span className="text-xs font-bold text-white">{is16 ? 'FP16 lane' : 'FP32 lane'}</span>
          <span className="text-[9px] text-gray-400 ml-auto">
            {is16 ? 'runs on Tensor Cores' : 'needs range or precision'}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {items.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setSel(o.id)}
              className={`rounded-lg px-2 py-1 font-mono text-[10px] border transition ${
                sel === o.id
                  ? 'bg-amber-500 text-white border-amber-300'
                  : is16
                    ? 'bg-emerald-500/25 text-emerald-100 border-emerald-400/50'
                    : 'bg-sky-500/25 text-sky-100 border-sky-400/50'
              }`}
            >
              {o.name}
            </button>
          ))}
          {items.length === 0 && <span className="text-[10px] text-gray-600">empty</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Inside autocast()</h3>
        <p className="text-gray-400 text-sm">
          It does not cast your model. It decides, per operation, at the moment of the call.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-500">
            operations entering the context manager
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setRouted(OPS.map((o) => o.id))}
              className="px-2.5 py-1 rounded-lg bg-amber-600 text-[10px] font-bold text-white"
            >
              Route all
            </button>
            <button
              type="button"
              onClick={() => {
                setRouted([]);
                setSel(null);
              }}
              className="px-2.5 py-1 rounded-lg bg-gray-800 text-[10px] text-gray-300"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 min-h-[34px]">
          {pending.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => route(o.id)}
              className="rounded-lg px-2 py-1 font-mono text-[10px] bg-gray-800 text-gray-300 border border-gray-700 hover:border-amber-400 hover:text-white transition"
            >
              {o.name}
            </button>
          ))}
          {pending.length === 0 && (
            <span className="text-[10px] text-gray-600">all routed — tap any chip below</span>
          )}
        </div>
      </div>

      <div className="text-center text-gray-600 text-lg mb-1">↓</div>

      <div className="flex gap-2 mb-3">
        <Lane bits={16} />
        <Lane bits={32} />
      </div>

      <NoteBox tone={cur ? (cur.lane === 16 ? 'emerald' : 'sky') : 'amber'}>
        {cur ? (
          <>
            <strong className="text-white font-mono">{cur.name}</strong> → FP{cur.lane}. {cur.why}
          </>
        ) : (
          <>
            Tap an operation to send it through <span className="font-mono">autocast</span>. The rule is
            not arbitrary: operations that are big matrix multiplies go to FP16, and operations that sum,
            exponentiate or divide by small numbers stay in FP32. You never write this list yourself —
            PyTorch maintains it.
          </>
        )}
      </NoteBox>
    </div>
  );
}

/* ── 5. GradScaler ────────────────────────────────────────────────────────── */

const GS_STEPS = [
  {
    t: 'A gradient is computed — and it is tiny',
    d: 'A typical gradient in this network is around 1e-7. FP16 cannot represent anything below roughly 6e-8, and values near that limit lose most of their precision.',
  },
  {
    t: 'scaler.scale(loss).backward()',
    d: 'The loss is multiplied by the scale factor before the backward pass. By the chain rule every gradient comes out multiplied by the same factor — so 1e-7 becomes 6.5e-3, comfortably inside FP16 range.',
  },
  {
    t: 'scaler.step(optimizer)',
    d: 'Before the optimizer touches anything, the scaler divides the gradients back down by the same factor and inspects them. If any are inf or NaN, the entire update is skipped rather than corrupting the weights.',
  },
  {
    t: 'scaler.update()',
    d: 'The scale factor is adjusted. After a run of clean steps it doubles, reaching further into the usable range. On an overflow it halves immediately. You never tune this by hand.',
  },
];

export function GradScalerVisualizer() {
  const [step, setStep] = useState(0);
  const [overflow, setOverflow] = useState(false);

  const scale = 65536;
  const raw = 1e-7;
  const scaled = overflow ? Infinity : raw * scale;
  const skipped = overflow && step >= 2;

  const fmt = (v) => (v === Infinity ? 'inf' : v.toExponential(1));

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">What GradScaler is protecting you from</h3>
        <p className="text-gray-400 text-sm">FP16 has a floor. Gradients live very close to it.</p>
      </div>

      <div className="flex justify-center mb-3">
        <button
          type="button"
          onClick={() => {
            setOverflow((v) => !v);
            setStep(0);
          }}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
            overflow ? 'bg-rose-600 text-white' : 'bg-gray-800 text-gray-300'
          }`}
        >
          {overflow ? 'Simulating an overflow' : 'Normal step — tap to inject an overflow'}
        </button>
      </div>

      {/* pipeline */}
      <div className="flex items-stretch gap-2 mb-4">
        {[
          {
            k: 'loss',
            label: 'loss',
            val: step >= 1 ? `${(0.42 * scale).toExponential(1)}` : '4.2e-01',
            sub: step >= 1 ? `× ${scale}` : 'unscaled',
            on: step >= 0,
            tone: step >= 1 ? 'amber' : 'gray',
          },
          {
            k: 'grad',
            label: 'gradient',
            val: step >= 1 ? fmt(scaled) : fmt(raw),
            sub: step >= 1 ? 'survives FP16' : 'below FP16 floor',
            on: step >= 1,
            tone: step >= 1 ? (overflow ? 'rose' : 'emerald') : 'rose',
          },
          {
            k: 'un',
            label: 'unscale + check',
            val: step >= 2 ? (overflow ? 'inf found' : fmt(raw)) : '—',
            sub: step >= 2 ? (overflow ? 'skip this step' : 'safe to apply') : 'waiting',
            on: step >= 2,
            tone: step < 2 ? 'gray' : overflow ? 'rose' : 'emerald',
          },
          {
            k: 'upd',
            label: 'new scale',
            val: step >= 3 ? (overflow ? `${scale / 2}` : `${scale}`) : `${scale}`,
            sub: step >= 3 ? (overflow ? 'halved' : 'held / doubled') : 'unchanged',
            on: step >= 3,
            tone: step < 3 ? 'gray' : overflow ? 'rose' : 'emerald',
          },
        ].map((b, i) => {
          const tones = {
            gray: 'border-gray-700 bg-gray-900/60',
            amber: 'border-amber-400 bg-amber-500/15',
            emerald: 'border-emerald-400 bg-emerald-500/15',
            rose: 'border-rose-400 bg-rose-500/15',
          };
          return (
            <React.Fragment key={b.k}>
              <div
                className={`flex-1 rounded-xl border-2 p-3 text-center transition ${tones[b.tone]} ${
                  b.on ? '' : 'opacity-50'
                }`}
              >
                <div className="text-[10px] uppercase text-gray-400">{b.label}</div>
                <div className="text-sm font-bold font-mono text-white mt-1">{b.val}</div>
                <div className="text-[9px] text-gray-400 mt-0.5">{b.sub}</div>
              </div>
              {i < 3 && <span className="self-center text-gray-600">→</span>}
            </React.Fragment>
          );
        })}
      </div>

      {/* FP16 range track */}
      <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-3 mb-3">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
          FP16 representable range
        </div>
        <div className="relative h-14 rounded-lg overflow-hidden border border-gray-700 flex">
          <div className="w-[22%] bg-rose-900/60 flex items-center justify-center text-[9px] text-rose-300 font-bold">
            underflow → 0
          </div>
          <div className="flex-1 bg-emerald-900/40 flex items-center justify-center text-[9px] text-emerald-300 font-bold">
            representable
          </div>
          <div className="w-[16%] bg-rose-900/60 flex items-center justify-center text-[9px] text-rose-300 font-bold">
            overflow → inf
          </div>
          {/* raw gradient dot */}
          <div
            className="absolute top-2 w-3 h-3 rounded-full bg-rose-400 ring-2 ring-white/50 transition-all duration-700"
            style={{ left: step >= 1 ? (overflow ? '92%' : '55%') : '10%' }}
          />
          <div
            className="absolute bottom-1 text-[9px] font-mono text-white transition-all duration-700"
            style={{ left: step >= 1 ? (overflow ? '84%' : '48%') : '4%' }}
          >
            {step >= 1 ? fmt(scaled) : fmt(raw)}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3">
        <div className="text-xs font-bold text-white mb-1">
          {step + 1}. {GS_STEPS[step].t}
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">{GS_STEPS[step].d}</p>
      </div>

      <Nav
        step={step}
        max={GS_STEPS.length - 1}
        onBack={() => setStep((s) => s - 1)}
        onNext={() => setStep((s) => s + 1)}
        onReset={() => setStep(0)}
      />

      {skipped && (
        <div className="mt-3">
          <NoteBox tone="rose">
            <strong className="text-white">This iteration was thrown away, and that is correct.</strong>{' '}
            An occasional skipped step costs nothing across thousands of iterations, whereas one inf
            written into the weights destroys the run. The scaler then halves the factor so the next steps
            succeed.
          </NoteBox>
        </div>
      )}
    </div>
  );
}

/* ── 6. Running both scripts ──────────────────────────────────────────────── */

const FP32_LOG = [
  'Starting FP32 baseline training...',
  '[Epoch: 1, Batch:   100] loss: 2.068',
  '[Epoch: 2, Batch:   100] loss: 1.572',
  '[Epoch: 3, Batch:   100] loss: 1.331',
  '[Epoch: 4, Batch:   100] loss: 1.186',
  '[Epoch: 5, Batch:   100] loss: 1.074',
  'Finished FP32 Training in 75.31 seconds',
];
const AMP_LOG = [
  'Starting AMP optimized training...',
  '[Epoch: 1, Batch:   100] loss: 2.071',
  '[Epoch: 2, Batch:   100] loss: 1.576',
  '[Epoch: 3, Batch:   100] loss: 1.334',
  '[Epoch: 4, Batch:   100] loss: 1.189',
  '[Epoch: 5, Batch:   100] loss: 1.071',
  'Finished AMP Training in 48.12 seconds',
];

export function RunComparisonVisualizer() {
  const [line, setLine] = useState(0);
  const fp32Mem = 1.8;
  const ampMem = 1.1;
  const running = line > 0 && line < 6;

  const Pane = ({ title, log, mem, color }) => (
    <div className="flex-1 rounded-2xl bg-black/85 border border-gray-700 overflow-hidden flex flex-col">
      <div className="px-3 py-1.5 border-b border-gray-800 flex items-center gap-1.5">
        <Terminal className="w-3 h-3 text-gray-500" />
        <span className="text-[10px] font-mono text-gray-400">{title}</span>
      </div>
      <div className="p-3 font-mono text-[11px] leading-6 flex-1">
        {log.slice(0, line + 1).map((l, i) => (
          <div
            key={l}
            className={
              i === 0
                ? 'text-gray-500'
                : l.startsWith('Finished')
                  ? `font-bold ${color}`
                  : 'text-gray-300'
            }
          >
            {l}
          </div>
        ))}
        {running && <span className="text-gray-600">█</span>}
      </div>
      <div className="px-3 py-2 border-t border-gray-800 bg-gray-950/80">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>nvidia-smi peak memory</span>
          <span className="font-mono font-bold text-white">{line > 0 ? `${mem} GB` : '—'}</span>
        </div>
        <div className="h-3 rounded bg-gray-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ${
              mem > 1.5 ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{ width: line > 0 ? `${(mem / 2) * 100}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Run both, watch two terminals</h3>
        <p className="text-gray-400 text-sm">
          Same data, same model, same five epochs. Step through the run.
        </p>
      </div>

      <div className="flex gap-2 mb-3">
        <Pane title="$ python fp32_baseline.py" log={FP32_LOG} mem={fp32Mem} color="text-sky-400" />
        <Pane title="$ python amp_optimized.py" log={AMP_LOG} mem={ampMem} color="text-emerald-400" />
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setLine(0)}
          className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300"
        >
          Reset
        </button>
        <button
          type="button"
          disabled={line >= FP32_LOG.length - 1}
          onClick={() => setLine((l) => l + 1)}
          className="px-4 py-1.5 rounded-lg bg-amber-600 text-xs font-bold text-white disabled:opacity-30"
        >
          {line === 0 ? 'Start both runs →' : 'Next epoch →'}
        </button>
      </div>

      <div className="mt-3">
        <NoteBox tone={line >= FP32_LOG.length - 1 ? 'emerald' : 'amber'}>
          {line === 0 && (
            <>
              Before you start, open a second terminal with{' '}
              <span className="font-mono">watch -n 1 nvidia-smi</span> so you capture peak memory during
              the run — it is gone once the process exits.
            </>
          )}
          {line > 0 && line < FP32_LOG.length - 1 && (
            <>
              <strong className="text-white">Watch the loss values, not just the clock.</strong> They
              track the baseline almost exactly. That is the evidence that half precision is not costing
              you accuracy here.
            </>
          )}
          {line >= FP32_LOG.length - 1 && (
            <>
              <strong className="text-white">75.31s → 48.12s, and 1.8 GB → 1.1 GB.</strong> The final
              losses differ in the third decimal place — well inside run-to-run noise. You got a third of
              your time back for three lines of code.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}

/* ── 7. Results ───────────────────────────────────────────────────────────── */

export function ResultsVisualizer() {
  const [metric, setMetric] = useState('time');
  const data = {
    time: { unit: 'sec', base: 75, amp: 48, label: 'Training Time (5 epochs)', imp: '~36% faster' },
    mem: { unit: 'GB', base: 1.8, amp: 1.1, label: 'Peak GPU Memory', imp: '~39% less' },
  };
  const d = data[metric];
  const max = metric === 'time' ? 80 : 2;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Analyzing the results</h3>
        <p className="text-gray-400 text-sm">Your numbers will vary by GPU, but the shape will not.</p>
      </div>

      <Tabs
        options={[
          { id: 'time', label: 'Training time' },
          { id: 'mem', label: 'Peak GPU memory' },
        ]}
        value={metric}
        onChange={setMetric}
      />

      {/* chart */}
      <div className="rounded-2xl bg-white/95 p-4 mb-3">
        <div className="flex items-end justify-center gap-10 h-52">
          {[
            ['FP32 (Baseline)', d.base, '#4f6cf7'],
            ['AMP (Optimized)', d.amp, '#22c99a'],
          ].map(([k, v, c]) => (
            <div key={k} className="flex flex-col items-center justify-end h-full">
              <span className="text-xs font-bold text-gray-700 mb-1">
                {v} {d.unit}
              </span>
              <div
                className="w-28 rounded-t transition-all duration-500"
                style={{ height: `${(v / max) * 100}%`, background: c }}
              />
            </div>
          ))}
        </div>
        <div className="border-t border-gray-300 pt-2 flex justify-center gap-6">
          {[
            ['FP32 (Baseline)', '#4f6cf7'],
            ['AMP (Optimized)', '#22c99a'],
          ].map(([k, c]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: c }} />
              <span className="text-[11px] text-gray-700">{k}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-gray-500 mt-1">SimpleCNN Training · CIFAR-10</p>
      </div>

      {/* table */}
      <div className="rounded-xl border border-gray-700 overflow-hidden text-xs">
        <div className="grid grid-cols-4 bg-gray-800 text-gray-300 font-bold">
          {['Metric', 'FP32 (Baseline)', 'AMP (FP16/FP32)', 'Improvement'].map((h) => (
            <div key={h} className="px-3 py-2 border-r border-gray-700 last:border-0">
              {h}
            </div>
          ))}
        </div>
        {[
          ['Training Time (5 epochs)', '~75 sec', '~48 sec', '~36% faster', 'time'],
          ['Peak GPU Memory', '~1.8 GB', '~1.1 GB', '~39% less', 'mem'],
        ].map(([a, b, c, e, id]) => (
          <div
            key={a}
            className={`grid grid-cols-4 border-t border-gray-700 transition ${
              metric === id ? 'bg-amber-500/15' : 'bg-gray-900/60'
            }`}
          >
            {[a, b, c].map((x) => (
              <div key={x} className="px-3 py-2 border-r border-gray-700 text-gray-300">
                {x}
              </div>
            ))}
            <div className="px-3 py-2 text-emerald-400 font-bold">{e}</div>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <NoteBox tone="emerald">
          {metric === 'time' ? (
            <>
              <strong className="text-white">A third of the wall-clock time, gone.</strong> On a five-day
              training run that is nearly two days back — and on a rented GPU it is a third off the bill
              for an identical result.
            </>
          ) : (
            <>
              <strong className="text-white">The memory saving is the underrated half.</strong> Less
              memory means you can raise the batch size, or fit a model that previously threw
              out-of-memory. Both of those compound with the speedup.
            </>
          )}
        </NoteBox>
      </div>
    </div>
  );
}

/* ── 8. Where the gain comes from ─────────────────────────────────────────── */

export function WhyFasterVisualizer() {
  const [tab, setTab] = useState('tc');
  const [cycle, setCycle] = useState(0);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Where the gain actually comes from</h3>
        <p className="text-gray-400 text-sm">Two separate mechanisms, both in play at once.</p>
      </div>

      <Tabs
        options={[
          { id: 'tc', label: '1 · Tensor Cores' },
          { id: 'mem', label: '2 · Memory traffic' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'tc' && (
        <>
          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-3">
              one 4×4 matrix multiply-accumulate
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  k: 'FP32 · CUDA cores',
                  cycles: 16,
                  color: 'bg-sky-600',
                  sub: 'one multiply-add per core, per cycle',
                },
                {
                  k: 'FP16 · Tensor Cores',
                  cycles: 1,
                  color: 'bg-emerald-500',
                  sub: 'the entire 4×4 block in one instruction',
                },
              ].map((r) => (
                <div key={r.k}>
                  <div className="text-[11px] font-bold text-white mb-2">{r.k}</div>
                  <div className="grid grid-cols-4 gap-1 mb-2">
                    {Array.from({ length: 16 }).map((_, i) => {
                      const lit = r.cycles === 1 ? cycle >= 1 : cycle > i;
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-sm transition-all duration-200 ${
                            lit ? r.color : 'bg-gray-800'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="text-[10px] text-gray-400">{r.sub}</div>
                  <div className="text-[10px] font-mono text-gray-500 mt-1">
                    {r.cycles} cycle{r.cycles > 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => setCycle(0)}
                className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300"
              >
                Reset
              </button>
              <button
                type="button"
                disabled={cycle >= 16}
                onClick={() => setCycle((c) => c + 1)}
                className="px-4 py-1.5 rounded-lg bg-amber-600 text-xs font-bold text-white disabled:opacity-30"
              >
                Advance one cycle →
              </button>
              <span className="self-center text-[10px] font-mono text-gray-500">cycle {cycle}</span>
            </div>
          </div>
          <div className="mt-3">
            <NoteBox tone={cycle >= 16 ? 'emerald' : 'amber'}>
              {cycle >= 16 ? (
                <>
                  <strong className="text-white">Sixteen cycles versus one.</strong> The Tensor Core
                  finished before the first row of the FP32 grid was done. Real speedups never reach 16×
                  because only part of your model is matrix multiplication — but this is the engine behind
                  the number.
                </>
              ) : (
                <>
                  Advance the clock. A Tensor Core is a dedicated unit that consumes a whole small matrix
                  block per instruction, instead of one multiply-add at a time. It only accepts
                  half-precision input, which is why FP32 code cannot touch it at all.
                </>
              )}
            </NoteBox>
          </div>
        </>
      )}

      {tab === 'mem' && (
        <>
          <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-4">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-3">
              bytes that must move between memory and compute
            </div>
            {[
              ['Model weights', 0.12, 0.12, 'master copy stays FP32'],
              ['Activations', 0.9, 0.45, 'halved'],
              ['Gradients', 0.45, 0.23, 'halved'],
              ['Optimizer state', 0.33, 0.3, 'largely unchanged'],
            ].map(([k, a, b, note]) => (
              <div key={k} className="mb-2.5">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-300">{k}</span>
                  <span className="text-gray-500">{note}</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="flex-1 h-4 rounded bg-gray-800 overflow-hidden">
                    <div className="h-full bg-sky-600" style={{ width: `${(a / 1) * 100}%` }} />
                  </div>
                  <span className="w-12 text-right text-[9px] font-mono text-sky-400">{a} GB</span>
                </div>
                <div className="flex gap-1 items-center mt-0.5">
                  <div className="flex-1 h-4 rounded bg-gray-800 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${(b / 1) * 100}%` }} />
                  </div>
                  <span className="w-12 text-right text-[9px] font-mono text-emerald-400">{b} GB</span>
                </div>
              </div>
            ))}
            <div className="flex justify-center gap-4 text-[10px] pt-2 border-t border-gray-800">
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded-sm bg-sky-600" /> FP32
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded-sm bg-emerald-500" /> AMP
              </span>
            </div>
          </div>
          <div className="mt-3">
            <NoteBox tone="emerald">
              <strong className="text-white">
                Half-precision tensors are half the bytes to move.
              </strong>{' '}
              Many operations in a network are not compute-limited at all — they are limited by how fast
              values can be read from and written to GPU memory. Halving the activations and gradients
              halves that traffic, and the time spent on memory transfers drops with it. This is why even
              elementwise layers like ReLU get faster, despite Tensor Cores having nothing to do with them.
            </NoteBox>
          </div>
        </>
      )}
    </div>
  );
}

/* ── 9. The three edits, assembled ────────────────────────────────────────── */

const JOURNEY = [
  {
    t: 'Baseline',
    code: `outputs = model(inputs)
loss = criterion(outputs, labels)
loss.backward()
optimizer.step()`,
    time: 75,
    mem: 1.8,
    safe: true,
    note: 'Everything in FP32. Correct, and slow. This is the number every other row is measured against.',
  },
  {
    t: '+ scaler = GradScaler()',
    code: `scaler = torch.cuda.amp.GradScaler()

outputs = model(inputs)
loss = criterion(outputs, labels)
loss.backward()
optimizer.step()`,
    time: 75,
    mem: 1.8,
    safe: true,
    note: 'Creating the scaler changes nothing on its own — it is not used yet. Nothing gets faster, and nothing breaks. Worth seeing, because it proves the speed comes entirely from the next step.',
  },
  {
    t: '+ autocast (no scaler use)',
    code: `scaler = torch.cuda.amp.GradScaler()

with torch.cuda.amp.autocast():
    outputs = model(inputs)
    loss = criterion(outputs, labels)
loss.backward()
optimizer.step()`,
    time: 48,
    mem: 1.1,
    safe: false,
    note: 'Here is the speed and the memory saving — all of it comes from autocast. But the backward pass is still unscaled, so the smallest gradients flush to zero in FP16 and quietly stop contributing. This version trains, but worse.',
  },
  {
    t: '+ scaler.scale / step / update',
    code: `scaler = torch.cuda.amp.GradScaler()

with torch.cuda.amp.autocast():
    outputs = model(inputs)
    loss = criterion(outputs, labels)
scaler.scale(loss).backward()
scaler.step(optimizer)
scaler.update()`,
    time: 48,
    mem: 1.1,
    safe: true,
    note: 'The finished lab. Same speed and memory as the previous row, but the gradients are protected, so the loss curve matches the FP32 baseline. Speed from autocast, correctness from the scaler — two jobs, two tools.',
  },
];

export function ThreeEditsVisualizer() {
  const [step, setStep] = useState(0);
  const s = JOURNEY[step];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">The three edits, one at a time</h3>
        <p className="text-gray-400 text-sm">
          Add them in order and watch which one moves which number.
        </p>
      </div>

      <div className="flex gap-1.5 mb-3">
        {JOURNEY.map((j, i) => (
          <button
            key={j.t}
            type="button"
            onClick={() => setStep(i)}
            className={`flex-1 rounded-lg px-2 py-1.5 text-[10px] font-bold transition ${
              i === step
                ? 'bg-amber-600 text-white'
                : i < step
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-800 text-gray-500'
            }`}
          >
            {j.t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-3">
        <pre className="rounded-2xl bg-black/85 border border-gray-700 p-3 font-mono text-[12px] leading-6 whitespace-pre text-gray-300 overflow-x-auto">
          {py(s.code)}
        </pre>

        <div className="space-y-2">
          {[
            ['Training time', `${s.time} s`, s.time < 75 ? 'text-emerald-400' : 'text-gray-300', s.time / 80],
            ['Peak memory', `${s.mem} GB`, s.mem < 1.8 ? 'text-emerald-400' : 'text-gray-300', s.mem / 2],
          ].map(([k, v, cls, frac]) => (
            <div key={k} className="rounded-xl border border-gray-700 bg-gray-900/60 p-3">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10px] uppercase text-gray-500">{k}</span>
                <span className={`text-lg font-bold ${cls}`}>{v}</span>
              </div>
              <div className="h-2 rounded bg-gray-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    cls.includes('emerald') ? 'bg-emerald-500' : 'bg-sky-600'
                  }`}
                  style={{ width: `${frac * 100}%` }}
                />
              </div>
            </div>
          ))}

          <div
            className={`rounded-xl border-2 p-3 flex items-center gap-2 ${
              s.safe ? 'border-emerald-400/50 bg-emerald-500/10' : 'border-rose-400/60 bg-rose-500/15'
            }`}
          >
            {s.safe ? (
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-bold text-white">
                {s.safe ? 'Gradients intact' : 'Gradients underflowing'}
              </div>
              <div className="text-[10px] text-gray-400">
                {s.safe ? 'loss curve matches the FP32 baseline' : 'small gradients silently become zero'}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px] text-gray-300">
              Speedup so far:{' '}
              <strong className="text-white">{(75 / s.time).toFixed(2)}×</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <NoteBox tone={s.safe ? (step === 3 ? 'emerald' : 'amber') : 'rose'}>{s.note}</NoteBox>
      </div>

      <Nav
        step={step}
        max={JOURNEY.length - 1}
        onBack={() => setStep((v) => v - 1)}
        onNext={() => setStep((v) => v + 1)}
        onReset={() => setStep(0)}
      />
    </div>
  );
}
