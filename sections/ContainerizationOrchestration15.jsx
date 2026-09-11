import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  WhyKubeflowVisualizer,
  KubeflowConceptsVisualizer,
  ComponentsVisualizer,
  PipelineGraphVisualizer,
  DslComponentVisualizer,
  DslPipelineVisualizer,
  WhyKubeflowPillarsVisualizer,
} from '../components/ContainerizationPart4Visualizers';

export const meta = {
  title: 'Containerization and Orchestration for ML (Part 4)',
  subtitle: 'Kubeflow Pipelines — components, DAGs, Python SDK, and why it matters',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'why-kf',
    title: 'Using Kubeflow for ML Pipelines',
    subtitle: 'Beyond kubectl — composable, portable, scalable workflows',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Kubernetes is the base for running containers, but ML projects are multi-step workflows —
          ingestion, preprocessing, training, evaluation, deployment — not a single app. Orchestrating
          those stages with manual{' '}
          <span className="font-mono text-xs">kubectl</span> is complex and error-prone.
        </p>
        <p>
          <strong className="text-white">Kubeflow</strong> is an open-source ML toolkit built{' '}
          <em>on top of</em> Kubernetes. It does not replace Kubernetes; it adds tools so ML workflows
          are <strong className="text-brand-orange">composable, portable, and scalable</strong>.
        </p>
        <p>
          The central feature for orchestration is{' '}
          <strong className="text-sky-300">Kubeflow Pipelines</strong> — a framework and UI for
          building and deploying reusable ML workflows.
        </p>
        <p className="text-xs text-gray-400 italic">
          Watch the dataset token hop between stages. With kubectl you carry it; with Kubeflow the
          conveyor does. Use Back / Next.
        </p>
      </div>
    ),
    Visual: WhyKubeflowVisualizer,
  },
  {
    id: 'concepts',
    title: 'Understanding Kubeflow Pipelines',
    subtitle: 'Pipeline · Component · DAG',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A pipeline is a <strong className="text-white">Directed Acyclic Graph (DAG)</strong> of
          containerized tasks. Each task is a <strong className="text-white">component</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-sky-300">Component</strong> — independent containerized app for
            one step (download data, clean, train, evaluate). Acts like a function with strongly typed
            inputs and outputs.
          </li>
          <li>
            Because each step is its own container, dependencies stay isolated — Python 3.8 + libs in
            one step, Python 3.10 in another.
          </li>
          <li>
            <strong className="text-sky-300">DAG</strong> — directed edges, no cycles. Steps run when
            dependencies are ready; independent branches can run in parallel.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          First watch a component swallow raw.csv and emit a Dataset. Then see two DAG branches run
          in parallel while Train waits.
        </p>
      </div>
    ),
    Visual: KubeflowConceptsVisualizer,
  },
  {
    id: 'components',
    title: 'Components — Clean Separation',
    subtitle: 'Typed I/O · different images per step',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A component is the fundamental building block: one containerized step with typed inputs and
          outputs — like a programming function.
        </p>
        <p>Examples:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Download a dataset from cloud storage</li>
          <li>Clean and transform data</li>
          <li>Train a model</li>
          <li>Evaluate accuracy</li>
        </ul>
        <p>
          Because each component is a separate container,{' '}
          <span className="font-mono text-xs">preprocess</span> can use{' '}
          <span className="font-mono text-xs">python:3.9</span> + pandas while{' '}
          <span className="font-mono text-xs">train</span> uses a TensorFlow image — clean separation of
          concerns.
        </p>
        <p className="text-xs text-gray-400 italic">
          Two containers, two stacks. Step through and watch the Dataset artifact cross the wall —
          libraries never do.
        </p>
      </div>
    ),
    Visual: ComponentsVisualizer,
  },
  {
    id: 'graph',
    title: 'Pipelines',
    subtitle: 'Graph of dependencies · solid vs conditional edges',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A pipeline defines structure by connecting components. Outputs of one become inputs of
          another — e.g. processed data from{' '}
          <span className="font-mono text-rose-300 text-xs">preprocess</span> feeds{' '}
          <span className="font-mono text-rose-300 text-xs">train</span>.
        </p>
        <p>
          That graph lets Kubeflow manage execution order (a step runs only when dependencies are met)
          and run independent steps in parallel.
        </p>
        <p>
          Typical flow: Ingest → Preprocess → Train → Evaluate → Deploy. Solid lines are direct
          dependencies; a <strong className="text-white">dashed</strong> line can mean conditional
          deploy (only if eval score passes a threshold).
        </p>
        <p className="text-xs text-gray-400 italic">
          Step through the graph; toggle PASS/FAIL to gate Deploy.
        </p>
      </div>
    ),
    Visual: PipelineGraphVisualizer,
  },
  {
    id: 'dsl-component',
    title: 'Defining a Pipeline in Python — Components',
    subtitle: '@dsl.component · base_image · typed paths',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The Kubeflow Pipelines Python SDK (<span className="font-mono text-xs">kfp</span>) lets you
          define components and pipelines in familiar Python, then compile to static YAML for
          Kubernetes.
        </p>
        <p>
          <span className="font-mono text-rose-300 text-xs">@dsl.component</span> turns a function into
          a reusable step — declare <span className="font-mono text-xs">base_image</span>, packages,
          inputs, and outputs.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">preprocess_data</strong> —{' '}
            <span className="font-mono text-xs">python:3.9</span> + pandas; writes a Dataset via{' '}
            <span className="font-mono text-xs">OutputPath</span>
          </li>
          <li>
            <strong className="text-white">train_model</strong> — TensorFlow image; reads Dataset, writes
            a Model artifact
          </li>
        </ul>
        <p>
          Next you define the pipeline with{' '}
          <span className="font-mono text-rose-300 text-xs">@dsl.pipeline</span> and wire outputs to
          inputs.
        </p>
        <p className="text-xs text-gray-400 italic">
          Full kfp example is on the right — tap regions 1–4 to map decorator, typed I/O, preprocess
          body, and the TensorFlow train component.
        </p>
      </div>
    ),
    Visual: DslComponentVisualizer,
  },
  {
    id: 'dsl-pipeline',
    title: 'Defining the Pipeline — Wiring & Resources',
    subtitle: '@dsl.pipeline · outputs → inputs · GPU on train only',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Inside <span className="font-mono text-rose-300 text-xs">@dsl.pipeline</span>, instantiate
          components and pass one task’s output as another’s input.
        </p>
        <p>
          <span className="font-mono text-xs">train_task</span> depends on{' '}
          <span className="font-mono text-xs">preprocess_task</span> because it consumes{' '}
          <span className="font-mono text-xs">processed_data</span> — Kubeflow resolves that
          automatically.
        </p>
        <p>
          You can also set resources per step:{' '}
          <span className="font-mono text-xs">set_cpu_limit</span>,{' '}
          <span className="font-mono text-xs">set_memory_limit</span>, and a node selector for an{' '}
          <strong className="text-white">NVIDIA_TESLA_T4</strong> — so GPUs attach only to training,
          not every step.
        </p>
        <p className="text-xs text-gray-400 italic">
          Full @dsl.pipeline listing on the right — tap header, instantiate, wire outputs, then GPU
          on train only.
        </p>
      </div>
    ),
    Visual: DslPipelineVisualizer,
  },
  {
    id: 'pillars',
    title: 'Why Use Kubeflow for Pipelines?',
    subtitle: 'Reproducibility · reusability · scale · portability',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Reproducibility &amp; experiment tracking</strong> — logs
            component versions, inputs, and artifacts for every run.
          </li>
          <li>
            <strong className="text-white">Reusability</strong> — share components (validation, eval)
            across projects.
          </li>
          <li>
            <strong className="text-white">Scalability &amp; resource management</strong> — parallel
            steps; precise CPU / RAM / GPU per component on Kubernetes.
          </li>
          <li>
            <strong className="text-white">Portability</strong> — compile and run on any compliant
            cluster, on-prem or cloud.
          </li>
        </ul>
        <p>
          Kubeflow Pipelines abstracts complex Kubernetes objects so you define workflow logic in
          Python while the platform handles scheduling, execution, and resources — operational
          discipline for ML.
        </p>
        <p className="text-xs text-gray-400 italic">
          Ledger · shared component · GPU fan-out · same YAML on three clusters.
        </p>
      </div>
    ),
    Visual: WhyKubeflowPillarsVisualizer,
  },
];

export default function ContainerizationOrchestrationPart4() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-violet-400 to-amber-400" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-sky-400 font-bold tracking-wider text-xs uppercase mb-1 block">
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
                i === currentSlide ? 'w-8 bg-sky-500' : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
          className="p-3 rounded-full bg-sky-600 text-white hover:bg-sky-500 shadow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
