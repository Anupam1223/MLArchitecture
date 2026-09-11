import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  K8sScaleProblemVisualizer,
  WhyK8sMlVisualizer,
  ClusterAbstractionVisualizer,
  HowK8sWorksVisualizer,
  PodsVisualizer,
  DeploymentsVisualizer,
  ServicesVisualizer,
} from '../components/ContainerizationPart2Visualizers';

export const meta = {
  title: 'Containerization and Orchestration for ML (Part 2)',
  subtitle: 'Kubernetes for ML — cluster abstraction, Pods, Deployments, Services',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'intro-k8s',
    title: 'Introduction to Kubernetes for Managing ML Workloads',
    subtitle: 'From packaging containers to operating a cluster',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Docker packages applications into portable containers — but managing{' '}
          <strong className="text-white">hundreds</strong> of them for distributed training or keeping
          an API highly available by hand is inefficient and error-prone.
        </p>
        <p>
          <strong className="text-white">Kubernetes (K8s)</strong>, originally from Google and now
          under the CNCF, automates deployment, scaling, and management of containers. Think of it as
          a <strong className="text-brand-orange">cluster operating system</strong>: it abstracts the
          hardware and exposes a unified API so you manage a shared resource pool instead of
          individual machines.
        </p>
        <p className="text-xs text-gray-400 italic">
          Toggle Manual Docker vs Kubernetes — chaos vs organized fleet.
        </p>
      </div>
    ),
    Visual: K8sScaleProblemVisualizer,
  },
  {
    id: 'why-ml',
    title: 'Why Kubernetes is a Good Fit for Machine Learning',
    subtitle: 'Scale · resources · portability · self-healing',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>Across experimentation, training, and deployment, Kubernetes shines in four ways:</p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Scalability for demanding workloads</strong> — Scale
            training replicas with a single command. For inference, autoscale containers up under
            traffic and back down when quiet.
          </li>
          <li>
            <strong className="text-white">Efficient resource management</strong> — ML jobs are hungry
            for CPU, RAM, and especially GPUs. Declare{' '}
            <strong className="text-brand-orange">requests and limits</strong> so critical training
            gets GPUs while notebooks cannot consume the whole cluster.
          </li>
          <li>
            <strong className="text-white">Portability and consistency</strong> — Declarative YAML
            describes pipelines, serving APIs, and dashboards. Deploy the same stack on-prem or on
            AWS, GCP, or Azure.
          </li>
          <li>
            <strong className="text-white">Resilience and self-healing</strong> — Long jobs die on
            hardware faults; Kubernetes restarts failed containers and keeps the desired replica
            count for live models.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Tap each pillar — scale slider, GPU pool, multi-cloud YAML, crash recovery.
        </p>
      </div>
    ),
    Visual: WhyK8sMlVisualizer,
  },
  {
    id: 'cluster',
    title: 'The Kubernetes Cluster Abstraction',
    subtitle: 'Desired state → Control Plane → Worker Nodes / Pods',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The fundamental shift is from thinking about individual machines to thinking about a{' '}
          <strong className="text-white">unified cluster</strong>. You declare the state you want;
          the control plane schedules work across worker machines called{' '}
          <strong className="text-white">Nodes</strong>.
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong className="text-white">Apply desired state</strong> — The engineer defines the
            app in YAML and sends it to the Control Plane (API, Scheduler, …).
          </li>
          <li>
            <strong className="text-white">Schedule Pods</strong> — The scheduler places components
            onto Worker Nodes, allocating GPUs where needed. Workloads might include Jupyter,
            GPU training, a model API, or preprocessing.
          </li>
        </ol>
        <p className="text-xs text-gray-400 italic">
          Step Apply → Schedule — watch cyan arrows light the source diagram path.
        </p>
      </div>
    ),
    Visual: ClusterAbstractionVisualizer,
  },
  {
    id: 'how-works',
    title: 'How It Works: A High-Level View',
    subtitle: 'Declarative config · Control Plane · Nodes · Pods',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          You interact with Kubernetes <strong className="text-white">declaratively</strong>. Instead
          of scripts that issue command after command, you write configuration files that declare
          desired state — e.g. “three replicas of my model-serving container, reachable from the
          public internet.” Kubernetes continuously reconciles actual cluster state to match.
        </p>
        <p>Core building blocks:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-sky-300">Control Plane</strong> — coordinating brain: exposes the
            API, watches for new definitions, makes global decisions like scheduling.
          </li>
          <li>
            <strong className="text-sky-300">Nodes</strong> — worker machines (physical or virtual).
            Each runs an agent that talks to the control plane and manages assigned containers.
          </li>
          <li>
            <strong className="text-sky-300">Pods</strong> — smallest object you create or deploy.
            Encapsulates your containerized app (e.g. a Docker model API), storage, and a unique
            network IP. Multiple containers are possible; one main container per Pod is the common
            pattern.
          </li>
        </ul>
        <p>
          With this map of what Kubernetes is and why it fits ML, we can examine the objects you use
          to define and deploy applications.
        </p>
        <p className="text-xs text-gray-400 italic">
          Tap Control Plane / Nodes / Pods for each definition.
        </p>
      </div>
    ),
    Visual: HowK8sWorksVisualizer,
  },
  {
    id: 'pods',
    title: 'Kubernetes Components: Pods',
    subtitle: 'Atomic unit · sidecars · ephemeral by design',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Pods, Services, and Deployments are the foundation for scalable, resilient ML systems on
          Kubernetes.
        </p>
        <h4 className="text-white font-semibold">Pods — the atomic unit of deployment</h4>
        <p>
          A <strong className="text-white">Pod</strong> is the smallest deployable object — a single
          running process instance. It encapsulates one or more containers, shared storage (volumes),
          and unique network resources (an IP). The usual pattern is one main application container
          per Pod.
        </p>
        <h4 className="text-white font-semibold">Sidecar pattern (common in ML)</h4>
        <p>
          A Pod can run a <strong className="text-white">main</strong> container (e.g. TensorFlow
          Serving) beside a <strong className="text-violet-300">sidecar</strong> that fetches model
          updates from cloud storage or ships logs to a collector. Containers in the same Pod share
          the network namespace and can share volumes — efficient local communication.
        </p>
        <h4 className="text-white font-semibold">Ephemeral nature</h4>
        <p>
          Pods are temporary. Node failure, resource pressure, or updates can destroy a Pod — and its
          IP is gone forever. Do not manage individual Pods by hand for reliable apps; use a higher
          controller like a <strong className="text-white">Deployment</strong>.
        </p>
        <p className="text-xs text-gray-400 italic">
          Flip Anatomy / Sidecar / Ephemeral on the right.
        </p>
      </div>
    ),
    Visual: PodsVisualizer,
  },
  {
    id: 'deployments',
    title: 'Deployments: Managing Application Lifecycles',
    subtitle: 'Replicas · self-healing · rolling updates · YAML',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A <strong className="text-white">Deployment</strong> is a controller for declarative Pod
          updates. You describe desired state; the controller moves actual state toward it at a
          controlled rate.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Managing replicas</strong> — Specify how many identical
            Pod copies to keep. If a node dies, the Deployment schedules a replacement on a healthy
            node — the self-healing that makes ML services resilient.
          </li>
          <li>
            <strong className="text-white">Handling updates</strong> — Change the container image
            (new model or API version). The Deployment runs a{' '}
            <strong className="text-brand-orange">rolling update</strong>, replacing Pods gradually
            with no full downtime.
          </li>
        </ul>
        <p>
          Under the hood a Deployment manages a <strong className="text-white">ReplicaSet</strong>.
          You almost never touch ReplicaSets directly.
        </p>
        <h4 className="text-white font-semibold">deployment.yaml — field guide</h4>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <span className="text-rose-300 font-mono text-xs">replicas</span> — Maintain three
            running instances of our Pod.
          </li>
          <li>
            <span className="text-rose-300 font-mono text-xs">selector</span> — How the Deployment
            finds Pods to manage (label <span className="font-mono text-xs">app: inference-api</span>
            ).
          </li>
          <li>
            <span className="text-rose-300 font-mono text-xs">template</span> — Blueprint for Pods
            it creates (own <span className="font-mono text-xs">metadata</span> +{' '}
            <span className="font-mono text-xs">spec</span>).
          </li>
          <li>
            <span className="text-rose-300 font-mono text-xs">template.metadata.labels</span> —
            Labels on each created Pod; must match the selector.
          </li>
          <li>
            <span className="text-rose-300 font-mono text-xs">template.spec.containers</span> —
            Containers in the Pod (here: <span className="font-mono text-xs">model-server</span> +
            image version).
          </li>
        </ol>
        <p className="text-xs text-gray-400 italic">
          Open the YAML tab — tap fields 1–5 to highlight lines and read each description.
        </p>
      </div>
    ),
    Visual: DeploymentsVisualizer,
  },
  {
    id: 'services',
    title: 'Services: Exposing Your Application',
    subtitle: 'Stable IP · label selectors · ClusterIP vs LoadBalancer',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Deployments manage identical but <strong className="text-white">ephemeral</strong> Pods.
          Each Pod’s internal IP changes when it is recreated — so clients cannot reliably dial a
          model-serving Pod by IP alone.
        </p>
        <p>
          A <strong className="text-white">Service</strong> gives a stable abstract endpoint: a
          persistent cluster IP and DNS name. Traffic to the Service is load-balanced to healthy Pods
          matched by <strong className="text-brand-orange">labels and selectors</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-sky-300">ClusterIP</strong> (default) — reachable only inside the
            cluster. Ideal for frontend → inference Pod traffic.
          </li>
          <li>
            <strong className="text-amber-300">LoadBalancer</strong> — cloud provider provisions an
            external load balancer and routes internet traffic to your Pods. Standard for public
            production inference APIs.
          </li>
        </ul>
        <p>
          Together, Deployments and Services are the backbone of a scalable app: Deployments own
          lifecycle and availability; Services own the stable network door.
        </p>
        <p className="text-xs text-gray-400 italic">
          Right panel: step through “What is a Service?” then compare ClusterIP vs LoadBalancer —
          kill a Pod and watch the stable IP keep routing.
        </p>
      </div>
    ),
    Visual: ServicesVisualizer,
  },
];

export default function ContainerizationOrchestrationPart2() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-violet-400 font-bold tracking-wider text-xs uppercase mb-1 block">
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
                i === currentSlide ? 'w-8 bg-violet-500' : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
          className="p-3 rounded-full bg-violet-600 text-white hover:bg-violet-500 shadow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
