import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  LabOverviewVisualizer,
  PrerequisitesVisualizer,
  ProjectFilesVisualizer,
  AppPyVisualizer,
  DockerfileLabVisualizer,
  DeploymentLabVisualizer,
  ServiceLabVisualizer,
  ApplyLabVisualizer,
  TestLabVisualizer,
  BlueprintDeploymentVisualizer,
  BlueprintServiceVisualizer,
  GroundToProductionVisualizer,
} from '../components/ContainerizationPart5Visualizers';

export const meta = {
  title: 'Containerization and Orchestration for ML (Part 5)',
  subtitle: 'Hands-on: package an Iris Flask app, deploy on Kubernetes, test /predict',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'overview',
    title: 'Hands-on Practical: Deploying a Model on Kubernetes',
    subtitle: 'Docker image → Deployment + Service → live /predict',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          This lab walks a complete workflow: package a simple model-serving app in Docker, deploy it
          on a local Kubernetes cluster, manage it with{' '}
          <span className="font-mono text-xs">kubectl</span>, and hit the live endpoint. It mirrors how
          ML services move toward production.
        </p>
        <p>
          The app is a Flask API over a classic Iris classifier. We keep the model logic tiny so you
          can focus on the infrastructure.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right: four-stage journey — Package → Declare → Apply → Predict.
        </p>
      </div>
    ),
    Visual: LabOverviewVisualizer,
  },
  {
    id: 'prereq',
    title: 'Prerequisites',
    subtitle: 'Docker · local cluster · kubectl',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>Before you begin, have these installed and configured:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Docker Desktop or Docker Engine</strong> — to build the
            image.
          </li>
          <li>
            <strong className="text-white">A local Kubernetes cluster</strong> — easiest is the cluster
            bundled with Docker Desktop. Alternatively{' '}
            <span className="text-sky-300">Minikube</span>.
          </li>
          <li>
            <strong className="text-white">kubectl</strong> — usually installed with Docker Desktop or
            Minikube. Verify with{' '}
            <span className="font-mono text-rose-300 text-xs">kubectl version --client</span>.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">Toggle each tool on/off on the right.</p>
      </div>
    ),
    Visual: PrerequisitesVisualizer,
  },
  {
    id: 'files',
    title: 'The Model Serving Application',
    subtitle: 'iris-k8s-app · model.joblib · requirements.txt · app.py',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A small Flask app serves predictions from a pre-trained Scikit-learn Iris model. Create a
          directory <span className="font-mono text-rose-300 text-xs">iris-k8s-app</span> with three
          files:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <span className="font-mono text-rose-300 text-xs">model.joblib</span> — assume a saved
            model exists; you do not author it here.
          </li>
          <li>
            <span className="font-mono text-rose-300 text-xs">requirements.txt</span> — flask,
            scikit-learn, joblib, numpy (pinned versions).
          </li>
          <li>
            <span className="font-mono text-rose-300 text-xs">app.py</span> — Flask{' '}
            <span className="font-mono text-xs">POST /predict</span> (next slide).
          </li>
        </ol>
        <p className="text-xs text-gray-400 italic">Click files in the tree to inspect them.</p>
      </div>
    ),
    Visual: ProjectFilesVisualizer,
  },
  {
    id: 'apppy',
    title: 'app.py — Flask /predict',
    subtitle: 'JSON features in · species out · bind 0.0.0.0:5000',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The script loads a model and exposes{' '}
          <span className="font-mono text-rose-300 text-xs">/predict</span> for POST requests with flower
          measurements.
        </p>
        <p>
          <strong className="text-white">Note on the model:</strong> <span className="font-mono text-xs">joblib.load</span>{' '}
          is commented out and replaced with mock logic (petal length &lt; 2.5 → setosa). That skips
          downloading a real model so the lab stays on containerization and orchestration.
        </p>
        <p>
          <span className="font-mono text-xs">host=&apos;0.0.0.0&apos;</span> is required so the
          container (and later the Service) can reach Flask.
        </p>
        <p className="text-xs text-gray-400 italic">Full source on the right — tap Flask /predict / mock / bind.</p>
      </div>
    ),
    Visual: AppPyVisualizer,
  },
  {
    id: 'docker',
    title: 'Step 1: Containerize with a Dockerfile',
    subtitle: 'FROM python:3.9-slim · build iris-app:v1 · docker run',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Create a <span className="font-mono text-rose-300 text-xs">Dockerfile</span> that builds an
          image of the app and its dependencies.
        </p>
        <p>
          From <span className="font-mono text-xs">iris-k8s-app</span>:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <span className="font-mono text-xs">docker build -t iris-app:v1 .</span>
          </li>
          <li>
            <span className="font-mono text-xs">docker run -p 5000:5000 iris-app:v1</span>
          </li>
        </ul>
        <p>
          You should see Flask start. Stop with Ctrl+C — Kubernetes will run this same image next.
        </p>
        <p className="text-xs text-gray-400 italic">Dockerfile tab for full file; build &amp; run to animate the image.</p>
      </div>
    ),
    Visual: DockerfileLabVisualizer,
  },
  {
    id: 'deploy',
    title: 'Step 2: Define the Kubernetes Deployment',
    subtitle: 'replicas · selector · iris-app:v1 · port 5000',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A <strong className="text-white">Deployment</strong> manages identical Pods, replica count,
          and rollouts. Create <span className="font-mono text-rose-300 text-xs">deployment.yaml</span>.
        </p>
        <h4 className="text-white font-semibold">Let&apos;s break down this file</h4>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <span className="font-mono text-rose-300 text-xs">replicas: 2</span> — Instructs
            Kubernetes to maintain two running instances (Pods) of our application for availability.
          </li>
          <li>
            <span className="font-mono text-rose-300 text-xs">selector</span> — Tells the Deployment
            which Pods to manage. It finds Pods with the label{' '}
            <span className="font-mono text-rose-300 text-xs">app: iris-server</span>.
          </li>
          <li>
            <span className="font-mono text-rose-300 text-xs">template</span> — Defines the Pod that
            will be created. It includes:
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                <span className="font-mono text-rose-300 text-xs">metadata.labels</span> — A label{' '}
                <span className="font-mono text-rose-300 text-xs">app: iris-server</span> is attached
                to each Pod. This is how the selector finds them.
              </li>
              <li>
                <span className="font-mono text-rose-300 text-xs">spec.containers</span> — Defines the
                container(s) to run inside the Pod.
              </li>
              <li>
                <span className="font-mono text-rose-300 text-xs">image: iris-app:v1</span> — Specifies
                the Docker image to use.
              </li>
              <li>
                <span className="font-mono text-rose-300 text-xs">imagePullPolicy: IfNotPresent</span>{' '}
                — Use the local image if it exists, rather than pulling from a remote registry. Useful
                for local development.
              </li>
              <li>
                <span className="font-mono text-rose-300 text-xs">containerPort: 5000</span> — Informs
                Kubernetes that the container listens on port 5000.
              </li>
            </ul>
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Tap matching YAML fields on the right to highlight each of these in the full manifest.
        </p>
      </div>
    ),
    Visual: DeploymentLabVisualizer,
  },
  {
    id: 'service',
    title: 'Step 3: Expose with a Service',
    subtitle: 'NodePort · selector iris-server · port 80 → 5000',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Pod IPs change. A <strong className="text-white">Service</strong> is a stable endpoint. We use{' '}
          <span className="font-mono text-rose-300 text-xs">NodePort</span> so each node exposes a static
          port — convenient for local development.
        </p>
        <p>
          Create <span className="font-mono text-rose-300 text-xs">service.yaml</span>: type NodePort,
          selector <span className="font-mono text-xs">app: iris-server</span> (same as the Deployment),
          port 80 → targetPort 5000.
        </p>
        <p>
          Client → Service → one of the Pods the Deployment manages.
        </p>
        <p className="text-xs text-gray-400 italic">
          Diagram tab: send a request. YAML tab: full service.yaml.
        </p>
      </div>
    ),
    Visual: ServiceLabVisualizer,
  },
  {
    id: 'apply',
    title: 'Step 4: Apply the Manifests',
    subtitle: 'kubectl apply · get deployment / pods / service',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          With the image built and YAML written, deploy:
        </p>
        <p className="font-mono text-xs text-rose-300">
          kubectl apply -f deployment.yaml
          <br />
          kubectl apply -f service.yaml
        </p>
        <p>
          Then <span className="font-mono text-xs">kubectl get deployment</span>,{' '}
          <span className="font-mono text-xs">get pods</span>,{' '}
          <span className="font-mono text-xs">get service iris-service</span>.
        </p>
        <p>
          Watch <strong className="text-white">PORT(S)</strong> — e.g.{' '}
          <span className="font-mono text-rose-300 text-xs">80:31234/TCP</span>. 31234 is the NodePort
          you will call.
        </p>
        <p className="text-xs text-gray-400 italic">Step through apply and expected output.</p>
      </div>
    ),
    Visual: ApplyLabVisualizer,
  },
  {
    id: 'test',
    title: 'Step 5: Test the Deployed Model',
    subtitle: 'minikube URL · curl POST · kubectl delete',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          You need the node IP and NodePort. Locally that is often localhost, or{' '}
          <span className="font-mono text-xs">minikube ip</span>. Full URL:
        </p>
        <p className="font-mono text-xs text-rose-300">minikube service iris-service --url</p>
        <p>
          POST sample features to <span className="font-mono text-xs">/predict</span>. Expect{' '}
          <span className="font-mono text-xs">{'{"prediction":"setosa"}'}</span>.
        </p>
        <p>
          Tear down with the same files:{' '}
          <span className="font-mono text-xs">kubectl delete -f service.yaml</span> and{' '}
          <span className="font-mono text-xs">deployment.yaml</span>.
        </p>
        <p>
          That is the pattern for scalable ML services: declarative YAML you can replicate on any
          cluster.
        </p>
        <p className="text-xs text-gray-400 italic">Find URL → send curl → clean up.</p>
      </div>
    ),
    Visual: TestLabVisualizer,
  },
  {
    id: 'blueprint-deploy',
    title: 'Blueprint → Architecture: deployment.yaml',
    subtitle: 'Every line you write creates a specific thing in the cluster',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Knowing <em>what does what</em> is not enough to start building. What you need is the map
          from <strong className="text-white">the text you type</strong> to{' '}
          <strong className="text-white">the object that appears</strong>.
        </p>
        <p>
          <span className="font-mono text-xs text-emerald-300">kind: Deployment</span> creates the
          controller. <span className="font-mono text-xs text-sky-300">replicas: 2</span> is the number
          it will defend. <span className="font-mono text-xs text-rose-300">selector</span> and{' '}
          <span className="font-mono text-xs text-rose-300">template.labels</span> are one idea written
          twice — the label is how the controller recognises its own Pods.
        </p>
        <p>
          <span className="font-mono text-xs text-amber-300">image: iris-app:v1</span> is the only line
          that changes when you ship a new model.{' '}
          <span className="font-mono text-xs text-sky-300">containerPort: 5000</span> is the door the
          Service will later knock on.
        </p>
        <p>
          Nothing here mentions an IP address or a machine. You describe a shape; Kubernetes finds the
          hardware.
        </p>
        <p className="text-xs text-gray-400 italic">
          Hover a YAML line to light up the part of the cluster it builds.
        </p>
      </div>
    ),
    Visual: BlueprintDeploymentVisualizer,
  },
  {
    id: 'blueprint-service',
    title: 'Blueprint → Architecture: service.yaml',
    subtitle: 'How the outside world reaches those Pods',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Pods now exist but are unreachable. The Service is the second half of the architecture: a
          stable address plus a load balancer.
        </p>
        <p>
          <span className="font-mono text-xs text-rose-300">type: NodePort</span> punches a high port
          (31234) through the cluster boundary.{' '}
          <span className="font-mono text-xs text-rose-300">selector: app=iris-server</span> is the same
          label from the Deployment — that shared string is the entire wiring between the two files.
        </p>
        <p>
          <span className="font-mono text-xs text-sky-300">port: 80</span> is what callers use;{' '}
          <span className="font-mono text-xs text-sky-300">targetPort: 5000</span> is where Flask
          listens. The Service translates between them.
        </p>
        <p>
          Pods can die and be replaced with new IPs all day. The Service address never changes, because
          it tracks labels, not addresses.
        </p>
        <p className="text-xs text-gray-400 italic">
          Hover the YAML, then fire a request and watch the hop into a Pod.
        </p>
      </div>
    ),
    Visual: BlueprintServiceVisualizer,
  },
  {
    id: 'ground-to-prod',
    title: 'The Whole Build: Ground → Production',
    subtitle: 'Six commands, and the architecture assembles itself',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Here is the entire lab as one continuous picture — an empty machine on the left, a live
          inference endpoint on the right, and each command adding exactly one layer.
        </p>
        <ol className="list-decimal ml-5 space-y-2 text-xs">
          <li>
            <strong className="text-white">Bare cluster.</strong> A worker node and nothing else.
          </li>
          <li>
            <strong className="text-white">docker build.</strong> Your code becomes an immutable
            artifact. Still nothing running.
          </li>
          <li>
            <strong className="text-white">apply deployment.yaml.</strong> A controller appears and
            reconciles 0 → 2 Pods.
          </li>
          <li>
            <strong className="text-white">apply service.yaml.</strong> The Pods get a front door on
            NodePort 31234.
          </li>
          <li>
            <strong className="text-white">curl /predict.</strong> Traffic flows all the way to Flask
            and back.
          </li>
          <li>
            <strong className="text-white">scale.</strong> Same loop, more replicas — this is where
            production tuning starts.
          </li>
        </ol>
        <p>
          Beyond this lab, production swaps NodePort for a LoadBalancer or Ingress, and adds readiness
          probes, resource limits, and image-tag rollouts. The shape you just built does not change.
        </p>
        <p className="text-xs text-gray-400 italic">
          Run the commands one at a time and watch the cluster grow.
        </p>
      </div>
    ),
    Visual: GroundToProductionVisualizer,
  },
];

export default function ContainerizationOrchestrationPart5() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-sky-400" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-amber-400 font-bold tracking-wider text-xs uppercase mb-1 block">
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
                i === currentSlide ? 'w-8 bg-amber-500' : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
          className="p-3 rounded-full bg-amber-600 text-white hover:bg-amber-500 shadow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
