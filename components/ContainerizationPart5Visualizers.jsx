import React, { useState } from 'react';
import {
  Box,
  CheckCircle,
  Folder,
  FileCode,
  Terminal,
  Flower2,
  Package,
} from 'lucide-react';

function Tabs({ options, value, onChange, accent = 'bg-amber-600' }) {
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

function CodeHi({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full text-left rounded-md px-1.5 py-0.5 transition ${
        active ? 'bg-amber-500/20 ring-1 ring-amber-400/50' : 'hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

/* ── 1. Lab overview ──────────────────────────────────────────────────────── */

const JOURNEY = [
  { id: 0, title: 'Package', detail: 'Flask Iris app + Dockerfile → image iris-app:v1' },
  { id: 1, title: 'Declare', detail: 'deployment.yaml (2 replicas) + service.yaml (NodePort)' },
  { id: 2, title: 'Apply', detail: 'kubectl apply — cluster creates Pods and a stable port' },
  { id: 3, title: 'Predict', detail: 'curl POST /predict → {"prediction":"setosa"}' },
];

export function LabOverviewVisualizer() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Hands-on: Iris model on Kubernetes</h3>
        <p className="text-gray-400 text-sm">Same production pattern — Docker image, then Deployment + Service.</p>
      </div>

      <div className="max-w-xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          {JOURNEY.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                type="button"
                onClick={() => setStep(i)}
                className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center text-[10px] font-bold transition ${
                  step === i
                    ? 'border-amber-400 bg-amber-400 text-slate-900 scale-110'
                    : step > i
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                      : 'border-gray-600 bg-gray-900 text-gray-400'
                }`}
              >
                {step > i ? <CheckCircle className="w-4 h-4 mb-0.5" /> : <span>{i + 1}</span>}
                {s.title}
              </button>
              {i < JOURNEY.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${step > i ? 'bg-emerald-400' : 'bg-gray-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 text-center">
          <p className="text-sm text-gray-200 leading-relaxed">{JOURNEY[step].detail}</p>
        </div>

        <div className="mt-4 flex justify-center gap-3 text-[10px]">
          <div className="rounded-lg border border-sky-400/40 bg-sky-500/10 px-3 py-2 text-sky-100">
            Flask + Scikit-learn Iris
          </div>
          <div className="rounded-lg border border-violet-400/40 bg-violet-500/10 px-3 py-2 text-violet-100">
            local cluster (Docker / Minikube)
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 disabled:opacity-30"
          >
            ← Back
          </button>
          <button
            type="button"
            disabled={step === 3}
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-xs font-bold text-white disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 2. Prerequisites ─────────────────────────────────────────────────────── */

export function PrerequisitesVisualizer() {
  const [on, setOn] = useState({ docker: true, cluster: true, kubectl: true });
  const all = on.docker && on.cluster && on.kubectl;

  const items = [
    {
      id: 'docker',
      title: 'Docker Desktop / Engine',
      why: 'Builds the container image from the Dockerfile.',
    },
    {
      id: 'cluster',
      title: 'Local Kubernetes cluster',
      why: 'Docker Desktop Kubernetes, or Minikube — somewhere to schedule Pods.',
    },
    {
      id: 'kubectl',
      title: 'kubectl',
      why: 'CLI to apply manifests. Check with kubectl version --client.',
    },
  ];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Prerequisites</h3>
        <p className="text-gray-400 text-sm">Toggle each tool — the lab needs all three on your machine.</p>
      </div>

      <div className="max-w-md mx-auto w-full space-y-2">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => setOn((s) => ({ ...s, [it.id]: !s[it.id] }))}
            className={`w-full text-left rounded-xl border-2 p-3 transition ${
              on[it.id] ? 'border-emerald-400 bg-emerald-500/15' : 'border-rose-500/50 bg-rose-500/10'
            }`}
          >
            <div className="flex items-center gap-2">
              {on[it.id] ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <span className="w-4 h-4 rounded-full border border-rose-400" />
              )}
              <span className="text-sm font-bold text-white">{it.title}</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 pl-6">{it.why}</p>
          </button>
        ))}

        <div
          className={`rounded-xl px-3 py-2 text-center text-xs font-bold ${
            all ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40' : 'bg-rose-500/20 text-rose-200 border border-rose-400/40'
          }`}
        >
          {all ? 'Ready to start the iris-k8s-app lab' : 'Install the missing tools before applying YAML'}
        </div>

        <div className="rounded-lg bg-black/70 border border-gray-700 px-3 py-2 font-mono text-xs text-emerald-300 flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" />
          kubectl version --client
        </div>
      </div>
    </div>
  );
}

/* ── 3. Project tree + requirements ───────────────────────────────────────── */

export function ProjectFilesVisualizer() {
  const [file, setFile] = useState('req');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">The model-serving app</h3>
        <p className="text-gray-400 text-sm">
          Directory <span className="font-mono text-rose-300">iris-k8s-app</span> — three files. Keep the app simple; the lab is about deploy.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full grid grid-cols-[140px_1fr] gap-3">
        <div className="rounded-xl border border-gray-700 bg-gray-950/80 p-3 space-y-1">
          <div className="flex items-center gap-1 text-amber-200 text-xs font-bold mb-2">
            <Folder className="w-3.5 h-3.5" /> iris-k8s-app/
          </div>
          {[
            { id: 'joblib', name: 'model.joblib' },
            { id: 'req', name: 'requirements.txt' },
            { id: 'app', name: 'app.py' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFile(f.id)}
              className={`w-full text-left rounded-lg px-2 py-1.5 text-[11px] font-mono flex items-center gap-1 ${
                file === f.id ? 'bg-amber-500/20 text-amber-100' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3 h-3" /> {f.name}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-gray-700 bg-black/70 p-3 min-h-[180px]">
          {file === 'joblib' && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-white">1. model.joblib</div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Pre-trained Iris classifier. You do not create this file — assume it exists so{' '}
                <span className="font-mono text-rose-300">app.py</span> can load it. Contents do not
                matter for this lab.
              </p>
              <div className="rounded-lg border border-dashed border-gray-600 p-4 flex flex-col items-center text-gray-500">
                <Package className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-mono">binary blob · given, not authored</span>
              </div>
            </div>
          )}
          {file === 'req' && (
            <div>
              <div className="text-xs font-bold text-white mb-2">2. requirements.txt</div>
              <pre className="font-mono text-sm text-gray-200 leading-7">{`flask==2.2.2
scikit-learn==1.1.2
joblib==1.2.0
numpy==1.23.4`}</pre>
            </div>
          )}
          {file === 'app' && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-white">3. app.py</div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Flask server, one <span className="font-mono text-rose-300">POST /predict</span> — flower
                measurements in, species out. Full listing is the next slide.
              </p>
              <div className="flex items-center justify-center gap-2 py-3">
                <div className="rounded-lg bg-amber-500/20 border border-amber-400 px-2 py-1 text-[10px] font-bold text-amber-100">
                  JSON features
                </div>
                <span className="text-gray-500">→</span>
                <Flower2 className="w-5 h-5 text-rose-300" />
                <span className="text-gray-500">→</span>
                <div className="rounded-lg bg-emerald-500/20 border border-emerald-400 px-2 py-1 text-[10px] font-bold text-emerald-100">
                  setosa / …
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 4. app.py ────────────────────────────────────────────────────────────── */

const APP_FOCUS = [
  {
    id: 'flask',
    label: 'Flask app',
    blurb: 'Creates the web server. joblib.load is commented out so the lab does not need a real model file.',
  },
  {
    id: 'route',
    label: '/predict',
    blurb: 'POST JSON {features: [4 floats]}. Reshape to (1, 4) as a real sklearn model would expect.',
  },
  {
    id: 'mock',
    label: 'Mock logic',
    blurb: 'If petal length (index 2) < 2.5 → setosa, else versicolor_or_virginica. Swap for model.predict in production.',
  },
  {
    id: 'bind',
    label: 'Bind 0.0.0.0:5000',
    blurb: 'Must listen on 0.0.0.0 so traffic from outside the container (and later the Service) can reach Flask.',
  },
];

export function AppPyVisualizer() {
  const [focus, setFocus] = useState('route');
  const f = APP_FOCUS.find((x) => x.id === focus);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">app.py — the serving script</h3>
        <p className="text-gray-400 text-sm">Full listing. Tap a region to see what that block is for.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 mb-3">
        {APP_FOCUS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setFocus(x.id)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
              focus === x.id ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto w-full space-y-3">
        <pre className="rounded-xl bg-black/85 border border-gray-700 p-4 font-mono text-[12px] leading-6 text-gray-300 overflow-x-auto whitespace-pre">
          <div>import joblib</div>
          <div>import numpy as np</div>
          <div>from flask import Flask, request, jsonify</div>
          <CodeHi active={focus === 'flask'} onClick={() => setFocus('flask')}>
            {'\n'}app = Flask(__name__)
            {'\n'}
            <span className="text-gray-500"># model = joblib.load(&apos;model.joblib&apos;)  # simulated in this lab</span>
          </CodeHi>
          <CodeHi active={focus === 'route'} onClick={() => setFocus('route')}>
            {'\n'}@app.route(<span className="text-rose-300">&apos;/predict&apos;</span>, methods=[<span className="text-emerald-300">&apos;POST&apos;</span>])
            {'\n'}def predict():
            {'\n'}
            {'    '}try:
            {'\n'}
            {'        '}data = request.get_json(force=True)
            {'\n'}
            {'        '}features = np.array(data[<span className="text-rose-300">&apos;features&apos;</span>]).reshape(1, -1)
          </CodeHi>
          <CodeHi active={focus === 'mock'} onClick={() => setFocus('mock')}>
            {'        '}
            <span className="text-gray-500"># mock: petal length &lt; 2.5 → setosa</span>
            {'\n'}
            {'        '}if features[0, 2] &lt; 2.5:
            {'\n'}
            {'            '}prediction_result = <span className="text-emerald-300">&apos;setosa&apos;</span>
            {'\n'}
            {'        '}else:
            {'\n'}
            {'            '}prediction_result = <span className="text-emerald-300">&apos;versicolor_or_virginica&apos;</span>
            {'\n'}
            {'        '}return jsonify({'{'}&apos;prediction&apos;: prediction_result{'}'})
            {'\n'}
            {'    '}except Exception as e:
            {'\n'}
            {'        '}return jsonify({'{'}&apos;error&apos;: str(e){'}'}), 400
          </CodeHi>
          <CodeHi active={focus === 'bind'} onClick={() => setFocus('bind')}>
            {'\n'}if __name__ == &apos;__main__&apos;:
            {'\n'}
            {'    '}app.run(host=<span className="text-rose-300">&apos;0.0.0.0&apos;</span>, port=<span className="text-rose-300">5000</span>)
          </CodeHi>
        </pre>
        <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3">
          <div className="text-rose-300 text-xs font-bold mb-1">{f.label}</div>
          <p className="text-sm text-gray-200">{f.blurb}</p>
        </div>
      </div>
    </div>
  );
}

/* ── 5. Dockerfile + build ────────────────────────────────────────────────── */

const DF_FOCUS = [
  { id: 'from', label: 'FROM', blurb: 'Slim Python 3.9 base — small image, enough for Flask.' },
  { id: 'workdir', label: 'WORKDIR / COPY', blurb: 'WORKDIR /app. Copy requirements first so pip layer caches when only app.py changes.' },
  { id: 'run', label: 'RUN pip', blurb: 'Install flask, sklearn, joblib, numpy inside the image.' },
  { id: 'cmd', label: 'EXPOSE / CMD', blurb: 'Document port 5000. CMD starts python app.py when the container runs.' },
];

export function DockerfileLabVisualizer() {
  const [focus, setFocus] = useState('from');
  const [phase, setPhase] = useState(0); // 0 file, 1 built, 2 running
  const f = DF_FOCUS.find((x) => x.id === focus);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">Step 1: Dockerfile → image</h3>
        <p className="text-gray-400 text-sm">Tag <span className="font-mono text-rose-300">iris-app:v1</span> then smoke-test locally.</p>
      </div>

      <Tabs
        options={[
          { id: 'file', label: 'Dockerfile' },
          { id: 'build', label: 'build & run' },
        ]}
        value={phase === 0 ? 'file' : 'build'}
        onChange={(id) => setPhase(id === 'file' ? 0 : 1)}
        accent="bg-sky-600"
      />

      <div className="max-w-3xl mx-auto w-full space-y-3">
        {phase === 0 && (
          <>
            <div className="flex flex-wrap justify-center gap-1.5">
              {DF_FOCUS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setFocus(x.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    focus === x.id ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
            <pre className="rounded-xl bg-black/85 border border-gray-700 p-4 font-mono text-[13px] leading-7 text-gray-300 overflow-x-auto whitespace-pre">
              <CodeHi active={focus === 'from'} onClick={() => setFocus('from')}>
                <span className="text-gray-500"># Start from a slim Python base image</span>
                {'\n'}
                <span className="text-sky-300">FROM</span> python:3.9-slim
              </CodeHi>
              <CodeHi active={focus === 'workdir'} onClick={() => setFocus('workdir')}>
                {'\n'}
                <span className="text-gray-500"># Set the working directory inside the container</span>
                {'\n'}
                <span className="text-sky-300">WORKDIR</span> /app
                {'\n\n'}
                <span className="text-gray-500"># Copy the requirements file into the container</span>
                {'\n'}
                <span className="text-sky-300">COPY</span> requirements.txt .
              </CodeHi>
              <CodeHi active={focus === 'run'} onClick={() => setFocus('run')}>
                {'\n'}
                <span className="text-gray-500"># Install the Python dependencies</span>
                {'\n'}
                <span className="text-sky-300">RUN</span> pip install --no-cache-dir -r requirements.txt
                {'\n\n'}
                <span className="text-gray-500"># Copy the rest of the application code</span>
                {'\n'}
                <span className="text-sky-300">COPY</span> . .
              </CodeHi>
              <CodeHi active={focus === 'cmd'} onClick={() => setFocus('cmd')}>
                {'\n'}
                <span className="text-gray-500"># Expose the port the app runs on</span>
                {'\n'}
                <span className="text-sky-300">EXPOSE</span> 5000
                {'\n\n'}
                <span className="text-gray-500"># Define the command to run the application</span>
                {'\n'}
                <span className="text-sky-300">CMD</span> [<span className="text-emerald-300">&quot;python&quot;</span>, <span className="text-emerald-300">&quot;app.py&quot;</span>]
              </CodeHi>
            </pre>
            <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-gray-200">
              {f.blurb}
            </div>
          </>
        )}

        {phase > 0 && (
          <div className="space-y-3">
            <div className="rounded-xl bg-black/80 border border-gray-700 p-3 font-mono text-sm space-y-2">
              <div>
                <span className="text-gray-500">$ </span>
                <span className="text-sky-300">docker</span> build -t <span className="text-rose-300">iris-app:v1</span> .
              </div>
              {phase >= 2 && (
                <div>
                  <span className="text-gray-500">$ </span>
                  <span className="text-sky-300">docker</span> run -p <span className="text-rose-300">5000:5000</span> iris-app:v1
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className={`rounded-xl border px-4 py-3 text-center ${phase >= 1 ? 'border-sky-400 bg-sky-500/15' : 'border-gray-700'}`}>
                <Box className="w-6 h-6 mx-auto text-sky-300 mb-1" />
                <div className="text-xs font-bold text-white">iris-app:v1</div>
                <div className="text-[9px] text-gray-500">image</div>
              </div>
              {phase >= 2 && (
                <>
                  <span className="text-amber-400 font-bold">→</span>
                  <div className="rounded-xl border border-emerald-400 bg-emerald-500/15 px-4 py-3 text-center">
                    <div className="text-xs font-bold text-emerald-100">container :5000</div>
                    <div className="text-[9px] text-emerald-300 animate-pulse">Flask running</div>
                  </div>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setPhase((p) => (p === 1 ? 2 : 1))}
              className="w-full py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              {phase === 1 ? 'docker run -p 5000:5000 iris-app:v1' : 'Stop container (Ctrl+C)'}
            </button>
            <p className="text-[10px] text-center text-gray-500">
              After Flask prints that it is running, stop it — next we let Kubernetes run the same image.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 6. Deployment YAML ───────────────────────────────────────────────────── */

const DEP_FOCUS = [
  { id: 'replicas', label: 'replicas: 2', blurb: 'Keep two identical Pods running for availability.' },
  { id: 'selector', label: 'selector', blurb: 'Deployment finds Pods labeled app: iris-server.' },
  { id: 'labels', label: 'template labels', blurb: 'Each created Pod gets app: iris-server — must match the selector.' },
  { id: 'image', label: 'image + port', blurb: 'iris-app:v1, IfNotPresent (use local image), containerPort 5000.' },
];

export function DeploymentLabVisualizer() {
  const [focus, setFocus] = useState('replicas');
  const f = DEP_FOCUS.find((x) => x.id === focus);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">Step 2: deployment.yaml</h3>
        <p className="text-gray-400 text-sm">A Deployment keeps replica count and rolls updates. Full file below.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 mb-3">
        {DEP_FOCUS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setFocus(x.id)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
              focus === x.id ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto w-full space-y-3">
        {focus === 'replicas' && (
          <div className="flex justify-center gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-sky-400/50 bg-sky-500/15 px-4 py-2 text-center">
                <Box className="w-4 h-4 mx-auto text-sky-300" />
                <div className="text-[10px] font-bold text-white">Pod {i}</div>
              </div>
            ))}
          </div>
        )}

        <pre className="rounded-xl bg-black/85 border border-gray-700 p-4 font-mono text-[13px] leading-7 text-gray-300 overflow-x-auto whitespace-pre">
          <div>apiVersion: apps/v1</div>
          <div>kind: Deployment</div>
          <div>metadata:</div>
          <div>  name: iris-deployment</div>
          <div>spec:</div>
          <CodeHi active={focus === 'replicas'} onClick={() => setFocus('replicas')}>
            {'  '}replicas: <span className="text-rose-300">2</span>
          </CodeHi>
          <CodeHi active={focus === 'selector'} onClick={() => setFocus('selector')}>
            {'  '}selector:
            {'\n'}
            {'    '}matchLabels:
            {'\n'}
            {'      '}app: <span className="text-rose-300">iris-server</span>
          </CodeHi>
          <div>  template:</div>
          <div>    metadata:</div>
          <CodeHi active={focus === 'labels'} onClick={() => setFocus('labels')}>
            {'      '}labels:
            {'\n'}
            {'        '}app: <span className="text-rose-300">iris-server</span>
          </CodeHi>
          <div>    spec:</div>
          <div>      containers:</div>
          <CodeHi active={focus === 'image'} onClick={() => setFocus('image')}>
            {'      '}- name: iris-app-container
            {'\n'}
            {'        '}image: <span className="text-rose-300">iris-app:v1</span>
            {'\n'}
            {'        '}imagePullPolicy: IfNotPresent
            {'\n'}
            {'        '}ports:
            {'\n'}
            {'        '}- containerPort: <span className="text-rose-300">5000</span>
          </CodeHi>
        </pre>
        <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-gray-200">
          {f.blurb}
        </div>
      </div>
    </div>
  );
}

/* ── 7. Service + architecture diagram ────────────────────────────────────── */

const SVC_FOCUS = [
  { id: 'type', label: 'type: NodePort', blurb: 'Expose on each node IP at a high port (e.g. 31234). Good for local/dev access.' },
  { id: 'selector', label: 'selector', blurb: 'Routes to Pods with app: iris-server — same label the Deployment stamps.' },
  { id: 'ports', label: 'ports', blurb: 'Service listens on 80, forwards to targetPort 5000 on the Pod (Flask).' },
];

export function ServiceLabVisualizer() {
  const [tab, setTab] = useState('diagram');
  const [focus, setFocus] = useState('type');
  const [hit, setHit] = useState(0);
  const [pathStep, setPathStep] = useState(0);
  const f = SVC_FOCUS.find((x) => x.id === focus);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">Step 3: service.yaml (NodePort)</h3>
        <p className="text-gray-400 text-sm">Stable door to ephemeral Pods — Client → Service → one replica.</p>
      </div>

      <Tabs
        options={[
          { id: 'diagram', label: 'How they connect' },
          { id: 'yaml', label: 'Full YAML' },
        ]}
        value={tab}
        onChange={setTab}
        accent="bg-teal-600"
      />

      <div className="max-w-2xl mx-auto w-full">
        {tab === 'diagram' && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-white p-3 shadow-inner">
              <svg viewBox="0 0 640 460" className="w-full h-[340px]">
                <defs>
                  <marker id="arrBlk" markerWidth="10" markerHeight="10" refX="8" refY="3.5" orient="auto">
                    <path d="M0,0 L8,3.5 L0,7 Z" fill="#111827" />
                  </marker>
                  <marker id="arrDash" markerWidth="10" markerHeight="10" refX="8" refY="3.5" orient="auto">
                    <path d="M0,0 L8,3.5 L0,7 Z" fill="#4b5563" />
                  </marker>
                </defs>

                {/* Client — outside the cluster */}
                <circle
                  cx="500"
                  cy="48"
                  r="36"
                  fill={pathStep >= 1 ? '#fef3c7' : '#ffffff'}
                  stroke="#111827"
                  strokeWidth="2.5"
                />
                <text x="500" y="53" textAnchor="middle" fill="#111827" fontSize="14" fontWeight="700">
                  Client
                </text>

                <path
                  d="M500 84 L500 118 L430 155"
                  fill="none"
                  stroke={pathStep >= 1 ? '#d97706' : '#111827'}
                  strokeWidth={pathStep >= 1 ? 3 : 2}
                  markerEnd="url(#arrBlk)"
                />
                <text x="512" y="118" fill="#111827" fontSize="12">
                  sends request via
                </text>
                <text x="512" y="134" fill="#111827" fontSize="12" fontWeight="700">
                  NodeIP:NodePort
                </text>

                {/* Cluster */}
                <rect x="24" y="148" width="592" height="292" rx="4" fill="#e8eef2" />

                {/* Deployment */}
                <g>
                  <rect x="36" y="178" width="24" height="58" rx="3" fill="#7ec8f5" stroke="#1e3a5f" strokeWidth="1.5" />
                  <rect x="48" y="172" width="210" height="70" rx="4" fill="#7ec8f5" stroke="#1e3a5f" strokeWidth="2" />
                  <text x="153" y="213" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="700">
                    Deployment: iris-deployment
                  </text>
                </g>

                {/* Service diamond — clearly to the right, no overlap */}
                <polygon
                  points="430,168 552,214 430,260 308,214"
                  fill={pathStep >= 1 ? '#5eead4' : '#7ee0d0'}
                  stroke="#115e59"
                  strokeWidth="2"
                />
                <text x="430" y="208" textAnchor="middle" fill="#134e4a" fontSize="14" fontWeight="700">
                  Service: iris-service
                </text>
                <text x="430" y="228" textAnchor="middle" fill="#134e4a" fontSize="12">
                  (Type: NodePort)
                </text>

                {/* Pods */}
                <rect
                  x="168"
                  y="338"
                  width="130"
                  height="56"
                  rx="3"
                  fill={pathStep === 2 && hit === 0 ? '#facc15' : '#fde68a'}
                  stroke="#a16207"
                  strokeWidth={pathStep === 2 && hit === 0 ? 3 : 2}
                />
                <text x="233" y="360" textAnchor="middle" fill="#422006" fontSize="14" fontWeight="700">
                  Pod
                </text>
                <text x="233" y="378" textAnchor="middle" fill="#422006" fontSize="12">
                  iris-app:v1
                </text>

                <rect
                  x="338"
                  y="338"
                  width="130"
                  height="56"
                  rx="3"
                  fill={pathStep === 2 && hit === 1 ? '#facc15' : '#fde68a'}
                  stroke="#a16207"
                  strokeWidth={pathStep === 2 && hit === 1 ? 3 : 2}
                />
                <text x="403" y="360" textAnchor="middle" fill="#422006" fontSize="14" fontWeight="700">
                  Pod
                </text>
                <text x="403" y="378" textAnchor="middle" fill="#422006" fontSize="12">
                  iris-app:v1
                </text>

                {/* Deployment manages — dashed, from bottom of deployment */}
                <path
                  d="M120 242 C 120 290, 200 310, 233 338"
                  fill="none"
                  stroke="#4b5563"
                  strokeWidth="2"
                  strokeDasharray="7 5"
                  markerEnd="url(#arrDash)"
                />
                <path
                  d="M200 242 C 260 290, 360 310, 403 338"
                  fill="none"
                  stroke="#4b5563"
                  strokeWidth="2"
                  strokeDasharray="7 5"
                  markerEnd="url(#arrDash)"
                />
                <text x="108" y="300" fill="#374151" fontSize="13" fontStyle="italic">
                  manages
                </text>

                {/* Service forwards — solid */}
                <path
                  d="M390 252 C 320 290, 260 310, 233 338"
                  fill="none"
                  stroke={pathStep === 2 && hit === 0 ? '#d97706' : '#111827'}
                  strokeWidth={pathStep === 2 && hit === 0 ? 3 : 2}
                  markerEnd="url(#arrBlk)"
                />
                <path
                  d="M450 252 C 440 290, 420 310, 403 338"
                  fill="none"
                  stroke={pathStep === 2 && hit === 1 ? '#d97706' : '#111827'}
                  strokeWidth={pathStep === 2 && hit === 1 ? 3 : 2}
                  markerEnd="url(#arrBlk)"
                />
                <text x="430" y="300" fill="#111827" fontSize="13" fontStyle="italic">
                  forwards to
                </text>

                <text x="318" y="412" textAnchor="middle" fill="#334155" fontSize="13">
                  Pods
                </text>
                <text x="318" y="430" textAnchor="middle" fill="#334155" fontSize="13">
                  Kubernetes Cluster
                </text>
              </svg>
            </div>

            <div className="rounded-xl border border-teal-400/40 bg-teal-500/10 px-4 py-3 text-sm text-gray-200 leading-relaxed min-h-[4.2rem]">
              {pathStep === 0 && (
                <>
                  <strong className="text-white">Bigger picture:</strong> two jobs, two objects. The{' '}
                  <span className="text-sky-300">Deployment</span> (dashed) owns the Pods — how many,
                  which image. The <span className="text-teal-300">Service</span> (solid) is the stable
                  address. Clients never talk to a Pod IP.
                </>
              )}
              {pathStep === 1 && (
                <>
                  <strong className="text-white">1. Client → Service.</strong> You call{' '}
                  <span className="font-mono text-rose-300 text-xs">NodeIP:NodePort</span> (e.g.
                  192.168.49.2:31234). That hits iris-service, not a Pod.
                </>
              )}
              {pathStep === 2 && (
                <>
                  <strong className="text-white">2. Service → Pod {hit + 1}.</strong> Matching label{' '}
                  <span className="font-mono text-rose-300 text-xs">app: iris-server</span>, traffic
                  lands on a replica. If that Pod dies, the Deployment replaces it; the Service URL
                  stays the same.
                </>
              )}
            </div>

            <div className="flex justify-center gap-2">
              <button
                type="button"
                disabled={pathStep === 0}
                onClick={() => setPathStep((s) => Math.max(0, s - 1))}
                className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 disabled:opacity-30"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={pathStep >= 2}
                onClick={() => {
                  if (pathStep === 1) setHit((h) => (h === 0 ? 1 : 0));
                  setPathStep((s) => Math.min(2, s + 1));
                }}
                className="px-4 py-1.5 rounded-lg bg-teal-600 text-xs font-bold text-white disabled:opacity-30"
              >
                {pathStep === 0 ? 'Follow a request →' : 'Forward to a Pod →'}
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-500 italic">
              A user sends a request to the stable Service, which forwards to one of the Pods the
              Deployment manages.
            </p>
          </div>
        )}

        {tab === 'yaml' && (
          <div className="space-y-3">
            <div className="flex flex-wrap justify-center gap-1.5">
              {SVC_FOCUS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setFocus(x.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    focus === x.id ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
            <pre className="rounded-xl bg-black/85 border border-gray-700 p-4 font-mono text-[13px] leading-7 text-gray-300 overflow-x-auto whitespace-pre">
              <div>apiVersion: v1</div>
              <div>kind: Service</div>
              <div>metadata:</div>
              <div>  name: iris-service</div>
              <div>spec:</div>
              <CodeHi active={focus === 'type'} onClick={() => setFocus('type')}>
                {'  '}type: <span className="text-rose-300">NodePort</span>
              </CodeHi>
              <CodeHi active={focus === 'selector'} onClick={() => setFocus('selector')}>
                {'  '}selector:
                {'\n'}
                {'    '}app: <span className="text-rose-300">iris-server</span>
              </CodeHi>
              <CodeHi active={focus === 'ports'} onClick={() => setFocus('ports')}>
                {'  '}ports:
                {'\n'}
                {'  '}- protocol: TCP
                {'\n'}
                {'    '}port: <span className="text-rose-300">80</span>
                {'\n'}
                {'    '}targetPort: <span className="text-rose-300">5000</span>
              </CodeHi>
            </pre>
            <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-gray-200">
              {f.blurb}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 8. kubectl apply + status ────────────────────────────────────────────── */

export function ApplyLabVisualizer() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">Step 4: Apply manifests</h3>
        <p className="text-gray-400 text-sm">Image built, YAML written — kubectl apply, then inspect.</p>
      </div>

      <div className="flex justify-center gap-1.5 mb-3 flex-wrap">
        {['apply', 'get deploy', 'get pods', 'get service'].map((l, i) => (
          <button
            key={l}
            type="button"
            onClick={() => setStep(i)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
              step === i ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {i + 1}. {l}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto w-full space-y-3">
        <pre className="rounded-xl bg-black/90 border border-gray-700 p-4 font-mono text-[12px] md:text-sm leading-6 text-gray-300 overflow-x-auto whitespace-pre">
          {step === 0 && `# Apply the deployment configuration
kubectl apply -f deployment.yaml

# Apply the service configuration
kubectl apply -f service.yaml`}
          {step === 1 && `# Check that the deployment is progressing
kubectl get deployment

# Expected output:
# NAME             READY   UP-TO-DATE   AVAILABLE   AGE
# iris-deployment  2/2     2            2           15s`}
          {step === 2 && `# Check that two pods are running
kubectl get pods

# Expected output:
# NAME                             READY   STATUS    RESTARTS   AGE
# iris-deployment-5c68f6d787-abcde 1/1     Running   0          25s
# iris-deployment-5c68f6d787-fghij 1/1     Running   0          25s`}
          {step === 3 && `# Check that the service is created
kubectl get service iris-service

# Expected output:
# NAME          TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
# iris-service  NodePort   10.101.102.103 <none>        80:31234/TCP   35s`}
        </pre>

        {step === 3 && (
          <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-gray-200">
            PORT(S) <span className="font-mono text-rose-300">80:31234/TCP</span> — cluster mapped a high
            port (31234) to service port 80. That NodePort is how you reach the app.
          </div>
        )}

        <div className="flex justify-center gap-2">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 disabled:opacity-30"
          >
            ← Back
          </button>
          <button
            type="button"
            disabled={step === 3}
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-xs font-bold text-white disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 9. Test + cleanup ────────────────────────────────────────────────────── */

export function TestLabVisualizer() {
  const [phase, setPhase] = useState(0);
  const [sent, setSent] = useState(false);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">Step 5: Test — then clean up</h3>
        <p className="text-gray-400 text-sm">Node IP + NodePort + POST /predict</p>
      </div>

      <Tabs
        options={[
          { id: 0, label: 'Find URL' },
          { id: 1, label: 'curl predict' },
          { id: 2, label: 'Clean up' },
        ]}
        value={phase}
        onChange={(id) => {
          setPhase(Number(id));
          setSent(false);
        }}
        accent="bg-rose-600"
      />

      <div className="max-w-xl mx-auto w-full space-y-3">
        {phase === 0 && (
          <>
            <p className="text-xs text-gray-400 text-center">
              Local cluster IP is often localhost, or <span className="font-mono text-rose-300">minikube ip</span>.
            </p>
            <pre className="rounded-xl bg-black/85 border border-gray-700 p-4 font-mono text-sm text-gray-300">
              minikube service iris-service --url
            </pre>
            <div className="rounded-lg border border-sky-400/40 bg-sky-500/10 px-3 py-2 text-center font-mono text-sm text-sky-200">
              http://192.168.49.2:31234
            </div>
          </>
        )}

        {phase === 1 && (
          <>
            <pre className="rounded-xl bg-black/85 border border-gray-700 p-4 font-mono text-[12px] leading-6 text-gray-300 overflow-x-auto whitespace-pre">{`curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"features": [5.1, 3.5, 1.4, 0.2]}' \\
  http://<YOUR_NODE_IP>:<YOUR_NODE_PORT>/predict`}</pre>
            <button
              type="button"
              onClick={() => setSent(true)}
              className="w-full py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
            >
              Send sample Iris request
            </button>
            {sent && (
              <div className="rounded-xl border border-emerald-400 bg-emerald-500/15 p-4 text-center">
                <div className="font-mono text-lg text-emerald-200">{'{"prediction": "setosa"}'}</div>
                <p className="text-[11px] text-gray-400 mt-2">
                  Petal length 1.4 &lt; 2.5 — mock classifier returns setosa. The JSON came from a Pod
                  behind the Service.
                </p>
              </div>
            )}
          </>
        )}

        {phase === 2 && (
          <>
            <pre className="rounded-xl bg-black/85 border border-gray-700 p-4 font-mono text-sm text-gray-300 leading-7">{`kubectl delete -f service.yaml
kubectl delete -f deployment.yaml`}</pre>
            <p className="text-xs text-gray-300 leading-relaxed text-center">
              Same manifests, reversed. Declarative YAML is how you replicate, scale, and tear down ML
              services on any Kubernetes cluster.
            </p>
            <div className="flex items-center justify-center gap-2 text-emerald-300 text-xs font-bold">
              <CheckCircle className="w-4 h-4" /> Lab complete — image → Deployment → Service → predict
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── 10. Blueprint: deployment.yaml ↔ architecture ────────────────────────── */

function HoverLine({ id, focus, setFocus, children }) {
  const active = focus === id;
  return (
    <button
      type="button"
      onMouseEnter={() => setFocus(id)}
      onFocus={() => setFocus(id)}
      onClick={() => setFocus(id)}
      className={`block w-full text-left whitespace-pre rounded-md px-1.5 py-0.5 transition ${
        active ? 'bg-amber-500/25 ring-1 ring-amber-400/60' : 'hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

export function BlueprintDeploymentVisualizer() {
  const [focus, setFocus] = useState('replicas');

  const note = {
    kind: 'kind: Deployment asks the control plane for a controller object — the thing that will own Pods.',
    replicas: 'replicas: 2 sets the controller’s desired state. It will create and keep exactly two Pods.',
    selector: 'selector is how the controller claims Pods: anything labeled app=iris-server belongs to it.',
    labels: 'template.metadata.labels stamps that same label onto every Pod it creates — this is what makes the selector match.',
    image: 'template.spec.containers puts your Docker image inside each Pod. Change this line to ship a new model version.',
    port: 'containerPort 5000 declares where Flask listens inside the Pod — the Service will target this.',
  }[focus];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Blueprint → Architecture: the Deployment</h3>
        <p className="text-gray-400 text-sm">
          Hover the YAML — see exactly which piece of the cluster that line creates.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-0">
        <div className="rounded-2xl bg-black/80 border border-gray-700 p-3 font-mono text-[12px] leading-6 text-gray-300 overflow-x-auto whitespace-pre">
          <div className="text-gray-500 border-b border-gray-800 pb-1 mb-2">deployment.yaml</div>
          <div>apiVersion: apps/v1</div>
          <HoverLine id="kind" focus={focus} setFocus={setFocus}>
            kind: <span className="text-emerald-300">Deployment</span>
          </HoverLine>
          <div>metadata:</div>
          <div>  name: iris-deployment</div>
          <div>spec:</div>
          <HoverLine id="replicas" focus={focus} setFocus={setFocus}>
            {'  '}replicas: <span className="text-sky-300">2</span>{' '}
            <span className="text-gray-500 italic"># desired state</span>
          </HoverLine>
          <HoverLine id="selector" focus={focus} setFocus={setFocus}>
            {'  '}selector:
            {'\n'}
            {'    '}matchLabels:
            {'\n'}
            {'      '}app: <span className="text-rose-300">iris-server</span>
          </HoverLine>
          <div>  template:</div>
          <HoverLine id="labels" focus={focus} setFocus={setFocus}>
            {'    '}metadata:
            {'\n'}
            {'      '}labels:
            {'\n'}
            {'        '}app: <span className="text-rose-300">iris-server</span>
          </HoverLine>
          <div>    spec:</div>
          <div>      containers:</div>
          <HoverLine id="image" focus={focus} setFocus={setFocus}>
            {'      '}- name: iris-app-container
            {'\n'}
            {'        '}image: <span className="text-amber-300">iris-app:v1</span>
          </HoverLine>
          <HoverLine id="port" focus={focus} setFocus={setFocus}>
            {'        '}ports:
            {'\n'}
            {'        '}- containerPort: <span className="text-sky-300">5000</span>
          </HoverLine>
        </div>

        <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-3 flex flex-col">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Kubernetes cluster
          </div>

          <div
            className={`rounded-xl border-2 p-3 text-center mb-4 transition ${
              focus === 'kind' || focus === 'replicas' || focus === 'selector'
                ? 'border-violet-400 bg-violet-500/20'
                : 'border-gray-700 bg-gray-900/60'
            }`}
          >
            <div className="text-sm font-bold text-violet-200">Deployment controller</div>
            <div
              className={`mt-1 inline-block rounded px-2 py-0.5 text-[11px] font-bold ${
                focus === 'replicas' ? 'bg-sky-500 text-white' : 'text-gray-400'
              }`}
            >
              desired state: 2 replicas
            </div>
            <div
              className={`mt-1 text-[11px] font-mono ${
                focus === 'selector' ? 'text-rose-300 font-bold' : 'text-gray-500'
              }`}
            >
              selector: app=iris-server
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((n) => (
              <div
                key={n}
                className={`rounded-xl border-2 p-3 text-center transition ${
                  focus === 'replicas'
                    ? 'border-sky-400 bg-sky-500/15'
                    : 'border-emerald-400/50 bg-emerald-500/5'
                }`}
              >
                <div className="text-xs font-bold text-emerald-200 mb-1">Pod {n}</div>
                <div
                  className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-mono mb-2 ${
                    focus === 'labels' || focus === 'selector'
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  app: iris-server
                </div>
                <div
                  className={`rounded-lg border px-2 py-2 text-[10px] font-mono transition ${
                    focus === 'image'
                      ? 'border-amber-400 bg-amber-500/20 text-amber-100'
                      : 'border-gray-700 bg-gray-900 text-gray-400'
                  }`}
                >
                  iris-app:v1
                  <div
                    className={`text-[9px] mt-0.5 ${
                      focus === 'port' ? 'text-sky-300 font-bold' : 'text-gray-600'
                    }`}
                  >
                    :5000
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-3">
            <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs text-gray-200 leading-relaxed">
              {note}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 11. Blueprint: service.yaml ↔ networking ─────────────────────────────── */

export function BlueprintServiceVisualizer() {
  const [focus, setFocus] = useState('type');
  const [request, setRequest] = useState(-1); // -1 idle, 0..3 hops
  const [target, setTarget] = useState(0);

  const fire = () => {
    setTarget((t) => (t === 0 ? 1 : 0));
    setRequest(0);
    [1, 2, 3].forEach((n) => setTimeout(() => setRequest(n), n * 650));
    setTimeout(() => setRequest(-1), 3200);
  };

  const note = {
    type: 'type: NodePort opens a high port (31234) on the node itself, so traffic from outside the cluster can get in.',
    selector: 'selector app=iris-server is the link to the Deployment’s Pods — no IPs are hard-coded anywhere.',
    ports: 'port 80 is the Service address; targetPort 5000 is where Flask actually listens inside the Pod.',
  }[focus];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Blueprint → Architecture: the Service</h3>
        <p className="text-gray-400 text-sm">
          Hover the YAML, then send a request and watch it hop into a Pod.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-0">
        <div className="rounded-2xl bg-black/80 border border-gray-700 p-3 font-mono text-[12px] leading-6 text-gray-300 overflow-x-auto whitespace-pre">
          <div className="text-gray-500 border-b border-gray-800 pb-1 mb-2">service.yaml</div>
          <div>apiVersion: v1</div>
          <div>kind: <span className="text-emerald-300">Service</span></div>
          <div>metadata:</div>
          <div>  name: iris-service</div>
          <div>spec:</div>
          <HoverLine id="type" focus={focus} setFocus={setFocus}>
            {'  '}type: <span className="text-rose-300">NodePort</span>{' '}
            <span className="text-gray-500 italic"># opens a port on the node</span>
          </HoverLine>
          <HoverLine id="selector" focus={focus} setFocus={setFocus}>
            {'  '}selector:
            {'\n'}
            {'    '}app: <span className="text-rose-300">iris-server</span>
          </HoverLine>
          <HoverLine id="ports" focus={focus} setFocus={setFocus}>
            {'  '}ports:
            {'\n'}
            {'  '}- protocol: TCP
            {'\n'}
            {'    '}port: <span className="text-sky-300">80</span>
            {'\n'}
            {'    '}targetPort: <span className="text-sky-300">5000</span>
          </HoverLine>

          <div className="mt-3 rounded-lg border border-teal-400/40 bg-teal-500/10 px-2 py-2 font-sans text-xs text-gray-200 leading-relaxed whitespace-normal">
            {note}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-3 flex flex-col">
          <div
            className={`mx-auto rounded-full border-2 px-4 py-2 text-xs font-bold transition ${
              request === 0 ? 'border-amber-400 bg-amber-500/25 text-amber-100' : 'border-gray-600 text-gray-300'
            }`}
          >
            External client · curl
          </div>

          <div className="flex justify-center py-1">
            <div className={`text-lg ${request >= 1 ? 'text-amber-400' : 'text-gray-700'}`}>↓</div>
          </div>

          <div
            className={`mx-auto rounded-lg border-2 px-3 py-1.5 text-xs font-mono font-bold transition ${
              focus === 'type' || request === 1
                ? 'border-rose-400 bg-rose-500/25 text-rose-100'
                : 'border-gray-700 text-gray-400'
            }`}
          >
            NodeIP:31234 (NodePort)
          </div>

          <div className="mt-2 rounded-xl border-2 border-dashed border-gray-600 p-3 flex-1 flex flex-col">
            <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Kubernetes cluster</div>

            <div
              className={`mx-auto rounded-lg border-2 px-4 py-2 text-center transition ${
                request === 2 ? 'border-teal-300 bg-teal-500/30' : 'border-teal-400/50 bg-teal-500/10'
              }`}
            >
              <div className="text-xs font-bold text-teal-100">Service: iris-service</div>
              <div
                className={`text-[10px] font-mono ${
                  focus === 'ports' ? 'text-sky-300 font-bold' : 'text-teal-200/70'
                }`}
              >
                port 80 → targetPort 5000
              </div>
              <div
                className={`text-[9px] font-mono mt-0.5 ${
                  focus === 'selector' ? 'text-rose-300 font-bold' : 'text-gray-500'
                }`}
              >
                selector: app=iris-server
              </div>
            </div>

            <div className="flex justify-center py-1">
              <div className={`text-lg ${request >= 3 ? 'text-teal-300' : 'text-gray-700'}`}>↓</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={`rounded-xl border-2 p-3 text-center transition ${
                    request === 3 && target === i
                      ? 'border-amber-400 bg-amber-500/25 scale-105'
                      : 'border-emerald-400/50 bg-emerald-500/5'
                  }`}
                >
                  <div className="text-xs font-bold text-emerald-200">Pod {i + 1}</div>
                  <div
                    className={`text-[9px] font-mono mt-1 ${
                      focus === 'selector' ? 'text-rose-300 font-bold' : 'text-gray-500'
                    }`}
                  >
                    app: iris-server
                  </div>
                  <div className="text-[9px] font-mono text-gray-500">Flask :5000</div>
                  {request === 3 && target === i && (
                    <div className="mt-1 text-[9px] font-bold text-amber-200">handling request</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={fire}
            className="mt-3 w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition"
          >
            Simulate external request
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 12. Ground → production build ────────────────────────────────────────── */

const BUILD_STAGES = [
  {
    id: 0,
    cmd: null,
    out: null,
    title: 'Bare cluster',
    note: 'You start with a worker node and nothing else. No image, no controller, no address.',
  },
  {
    id: 1,
    cmd: 'docker build -t iris-app:v1 .',
    out: 'Successfully tagged iris-app:v1',
    title: 'Artifact exists',
    note: 'The Dockerfile turns app.py + requirements into an immutable image. Nothing is running yet — this is just a build artifact.',
  },
  {
    id: 2,
    cmd: 'kubectl apply -f deployment.yaml',
    out: 'deployment.apps/iris-deployment created',
    title: 'Workload exists',
    note: 'The Deployment controller appears and reconciles: 0 Pods running, 2 desired → it schedules two Pods from your image onto the node.',
  },
  {
    id: 3,
    cmd: 'kubectl apply -f service.yaml',
    out: 'service/iris-service created',
    title: 'Address exists',
    note: 'The Service claims those Pods by label and opens NodePort 31234. Now the app has a stable front door that survives Pod restarts.',
  },
  {
    id: 4,
    cmd: 'curl -X POST http://NODE_IP:31234/predict -d \'{"features":[5.1,3.5,1.4,0.2]}\'',
    out: '{"prediction":"setosa"}',
    title: 'Serving traffic',
    note: 'Request enters the NodePort, the Service load-balances to one Pod, Flask answers. This is a working inference endpoint.',
  },
  {
    id: 5,
    cmd: 'kubectl scale deployment/iris-deployment --replicas=4',
    out: 'deployment.apps/iris-deployment scaled',
    title: 'Production shape',
    note: 'Same declarative loop scales you out. For real production you swap NodePort for LoadBalancer/Ingress, add probes and resource limits, and roll new models by bumping the image tag.',
  },
];

export function GroundToProductionVisualizer() {
  const [stage, setStage] = useState(0);
  const s = BUILD_STAGES[stage];

  const pods = stage >= 2 ? (stage >= 5 ? 4 : 2) : 0;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Ground → production, one command at a time</h3>
        <p className="text-gray-400 text-sm">
          Left: what you type. Right: what actually exists in the cluster after it.
        </p>
      </div>

      <div className="flex justify-center gap-1.5 mb-3 flex-wrap">
        {BUILD_STAGES.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setStage(b.id)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
              stage === b.id
                ? 'bg-amber-500 text-white'
                : stage > b.id
                  ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40'
                  : 'bg-gray-800 text-gray-500 border border-gray-700'
            }`}
          >
            {b.id}. {b.title}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-0">
        {/* terminal */}
        <div className="rounded-2xl bg-black/85 border border-gray-700 overflow-hidden flex flex-col">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-800/80 border-b border-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="ml-2 text-[10px] font-mono text-gray-400">kubectl terminal</span>
          </div>
          <div className="p-3 font-mono text-[11px] leading-5 space-y-1.5 overflow-x-auto">
            {BUILD_STAGES.slice(1, stage + 1).map((b) => (
              <div key={b.id}>
                <div className="text-gray-200 break-all">
                  <span className="text-emerald-400">$ </span>
                  {b.cmd}
                </div>
                <div className={b.id === 4 ? 'text-amber-300 font-bold' : 'text-gray-500'}>{b.out}</div>
              </div>
            ))}
            {stage < 5 && (
              <div className="text-gray-500">
                <span className="text-emerald-400">$ </span>
                <span className="bg-gray-700/60 px-1.5 rounded text-gray-200">
                  {BUILD_STAGES[stage + 1].cmd.length > 46
                    ? `${BUILD_STAGES[stage + 1].cmd.slice(0, 46)}…`
                    : BUILD_STAGES[stage + 1].cmd}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* live cluster */}
        <div className="rounded-2xl border border-gray-700 bg-gray-950/70 p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Live cluster state
            </span>
            <button
              type="button"
              onClick={() => setStage(0)}
              className="text-[10px] px-2 py-1 rounded-lg bg-gray-800 text-gray-300 hover:text-white"
            >
              Reset
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-end gap-2">
            {stage >= 1 && (
              <div
                className={`self-center rounded-lg border px-3 py-1.5 text-[10px] font-mono transition ${
                  stage === 1 ? 'border-amber-400 bg-amber-500/20 text-amber-100' : 'border-gray-700 text-gray-500'
                }`}
              >
                image: iris-app:v1 {stage === 1 && '(built, not running)'}
              </div>
            )}

            {stage >= 4 && (
              <div
                className={`self-center rounded-lg border-2 px-3 py-1 text-[10px] font-mono font-bold ${
                  stage === 4 ? 'border-amber-400 bg-amber-500/25 text-amber-100' : 'border-gray-700 text-gray-500'
                }`}
              >
                client → NodeIP:31234
              </div>
            )}

            {stage >= 3 && (
              <div className="self-center rounded-xl border-2 border-sky-400 bg-sky-500/15 px-4 py-2 text-center shadow-lg shadow-sky-500/10">
                <div className="text-xs font-bold text-sky-100">iris-service</div>
                <div className="text-[10px] font-mono text-sky-300">NodePort: 31234</div>
              </div>
            )}

            {stage >= 2 && (
              <div className="self-center rounded-lg border border-violet-400/50 bg-violet-500/10 px-3 py-1 text-[10px] font-bold text-violet-200">
                Deployment controller · {pods} desired
              </div>
            )}

            <div className="flex justify-center gap-2 flex-wrap">
              {Array.from({ length: pods }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-xl border-2 px-3 py-2 text-center transition ${
                    stage === 4 && i === 0
                      ? 'border-amber-400 bg-amber-500/20'
                      : 'border-emerald-400/60 bg-emerald-500/10'
                  }`}
                >
                  <div className="text-[10px] font-bold text-white">Pod (iris-app)</div>
                  <div className="text-[9px] text-emerald-300">Running</div>
                </div>
              ))}
              {pods === 0 && (
                <div className="text-[10px] text-gray-600 italic py-4">no workloads scheduled</div>
              )}
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-900/70 py-2 text-center text-[10px] text-gray-400">
              Node 1 (worker machine)
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 mt-3">
        <div className="text-amber-300 text-xs font-bold mb-1">
          {s.id}. {s.title}
        </div>
        <p className="text-sm text-gray-200 leading-relaxed">{s.note}</p>
      </div>

      <div className="flex justify-center gap-2 mt-3">
        <button
          type="button"
          disabled={stage === 0}
          onClick={() => setStage((v) => Math.max(0, v - 1))}
          className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs text-gray-300 disabled:opacity-30"
        >
          ← Back
        </button>
        <button
          type="button"
          disabled={stage === 5}
          onClick={() => setStage((v) => Math.min(5, v + 1))}
          className="px-4 py-1.5 rounded-lg bg-amber-600 text-xs font-bold text-white disabled:opacity-30"
        >
          Run next command →
        </button>
      </div>
    </div>
  );
}