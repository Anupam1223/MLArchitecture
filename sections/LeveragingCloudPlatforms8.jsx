import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  BigThreeVisualizer,
  AwsStackVisualizer,
  GcpStackVisualizer,
  AzureStackVisualizer,
  ServiceStacksVisualizer,
  IaasWorkflowVisualizer,
  ManagedWorkflowVisualizer,
  ResponsibilityStackVisualizer,
  ChoiceDecisionVisualizer,
} from '../components/CloudPlatformsPart1Visualizers';

export const meta = {
  title: 'Leveraging Cloud Platforms for AI (Part 1)',
  subtitle: 'The Big Three, IaaS vs managed services, and who owns each layer',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'overview',
    title: 'Overview of Major Cloud Providers for AI',
    subtitle: 'AWS, GCP, and Azure — three mature ecosystems',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Choosing a provider is the first step when moving machine learning operations to the
          cloud. The industry is dominated by three platforms:{' '}
          <strong className="text-white">Amazon Web Services (AWS)</strong>,{' '}
          <strong className="text-white">Google Cloud Platform (GCP)</strong>, and{' '}
          <strong className="text-white">Microsoft Azure</strong>.
        </p>
        <p>
          All three offer mature ecosystems of tools, compute options, and managed services tailored
          for AI development. Success depends on understanding their{' '}
          <strong className="text-white">distinct approaches</strong>, flagship services, and
          specialised hardware — not just picking the logo you already know.
        </p>
        <p className="text-xs text-gray-400 italic">
          Tap each provider to see its centre of gravity.
        </p>
      </div>
    ),
    Visual: BigThreeVisualizer,
  },
  {
    id: 'aws',
    title: 'Amazon Web Services (AWS)',
    subtitle: 'SageMaker on top, EC2 and custom silicon underneath, S3 as the lake',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          AWS is the longest-standing and largest provider by market share. Its strategy is a
          comprehensive toolkit — from small experiments to massive production systems.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Amazon SageMaker</strong> — the centrepiece. An end-to-end
            managed platform covering data labeling, feature engineering, model building (Jupyter
            notebooks), training, and one-click deployment.
          </li>
          <li>
            <strong className="text-white">Amazon EC2</strong> — raw IaaS compute.{' '}
            <strong className="text-brand-orange">P-series</strong> instances carry high-performance
            NVIDIA GPUs (e.g. A100) for large-scale distributed training;{' '}
            <strong className="text-brand-orange">G-series</strong> offers more cost-effective GPUs
            for graphics and smaller training / inference jobs.
          </li>
          <li>
            <strong className="text-white">Custom silicon</strong> —{' '}
            <strong className="text-brand-orange">Trainium</strong> for cost-effective deep learning
            training and <strong className="text-brand-orange">Inferentia</strong> for high-performance,
            low-latency inference. Both integrate with SageMaker and popular frameworks.
          </li>
          <li>
            <strong className="text-white">Amazon S3</strong> — the standard object store and primary
            data lake for most AWS AI workloads.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Walk the SageMaker lifecycle, then toggle P-series, G-series, and custom chips.
        </p>
      </div>
    ),
    Visual: AwsStackVisualizer,
  },
  {
    id: 'gcp',
    title: 'Google Cloud Platform (GCP)',
    subtitle: 'Vertex AI plus TPUs — research DNA in production form',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Google’s history in AI research — notably <strong className="text-white">TensorFlow</strong>{' '}
          and the <strong className="text-white">Transformer</strong> architecture — shows up as
          purpose-built services and specialised hardware.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-brand-green">Vertex AI</strong> — the unified managed platform
            that combines Google’s AI tools. It covers data management, model training, and MLOps
            (experiment tracking and model serving).
          </li>
          <li>
            <strong className="text-brand-orange">Tensor Processing Units (TPUs)</strong> — ASICs
            designed by Google to accelerate matrix computations for deep learning. They often deliver
            a performance-per-dollar advantage over GPUs for large-scale training with TensorFlow or
            JAX. Compute Engine VMs can still attach NVIDIA GPUs when you prefer that stack.
          </li>
          <li>
            <strong className="text-white">Google Cloud Storage</strong> for scalable object storage
            and <strong className="text-white">BigQuery</strong> as a serverless warehouse for
            preparing structured data before it enters a model.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Toggle TPU vs GPU to see when each hardware path wins.
        </p>
      </div>
    ),
    Visual: GcpStackVisualizer,
  },
  {
    id: 'azure',
    title: 'Microsoft Azure',
    subtitle: 'Enterprise gravity — code-first or low-code into the same hub',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Azure’s strength is its enterprise market position and integration with business tools. It
          serves data scientists, developers, and MLOps engineers in one place.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Azure Machine Learning</strong> — the central hub. Use the{' '}
            <strong className="text-brand-purple">Python SDK</strong> for a code-first experience, or
            the visual <strong className="text-brand-purple">Designer</strong> for low-code,
            drag-and-drop build and deploy.
          </li>
          <li>
            GPU-enabled VMs:{' '}
            <strong className="text-white">NC-series</strong> for compute-intensive / HPC workloads
            with modern NVIDIA GPUs; <strong className="text-white">ND-series</strong> for deep
            learning training with high-end GPUs and fast interconnects for distributed jobs.
          </li>
          <li>
            <strong className="text-white">Azure Blob Storage</strong> for scalable data and{' '}
            <strong className="text-white">Azure Databricks</strong> for large-scale data engineering
            that integrates tightly with Azure Machine Learning.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Flip between SDK and Designer, then NC vs ND for the IaaS layer.
        </p>
      </div>
    ),
    Visual: AzureStackVisualizer,
  },
  {
    id: 'stacks',
    title: 'Comparing the AI Service Stacks',
    subtitle: 'Same categories — different ecosystems',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          While all three providers offer the fundamental components needed for AI, their primary
          offerings and specialised hardware create{' '}
          <strong className="text-white">distinct ecosystems</strong>. The choice often depends on
          which platform’s philosophy and tools best align with your team’s needs and existing
          infrastructure.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-sky-300">AWS</strong> → SageMaker + Trainium &amp; Inferentia
          </li>
          <li>
            <strong className="text-emerald-300">GCP</strong> → Vertex AI + TPUs
          </li>
          <li>
            <strong className="text-violet-300">Azure</strong> → Azure Machine Learning
          </li>
        </ul>
        <p>
          Each provides a comprehensive managed platform. AWS and GCP also offer their own
          custom-designed hardware for accelerating AI workloads.
        </p>
        <p className="text-xs text-gray-400 italic">
          Click a cloud column — orange pills are custom silicon.
        </p>
      </div>
    ),
    Visual: ServiceStacksVisualizer,
  },
  {
    id: 'iaas',
    title: 'IaaS: The Building Blocks',
    subtitle: 'Control versus convenience starts here',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          When choosing a cloud platform for AI there is a fundamental trade-off between{' '}
          <strong className="text-white">control (IaaS)</strong> and{' '}
          <strong className="text-white">convenience (managed services)</strong>. That choice shapes
          workflow, development speed, and operational responsibility.
        </p>
        <p>
          <strong className="text-white">Infrastructure-as-a-Service</strong> is like leasing a
          bare-metal server in the cloud. You get raw compute, storage, and networking — and you are
          responsible for almost everything above the hardware virtualization layer.
        </p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>Provision a VM (EC2, Compute Engine, Azure VM) — pick CPU, RAM, GPUs.</li>
          <li>Configure the environment over SSH: OS, NVIDIA drivers, CUDA, Python, libraries.</li>
          <li>Manage data and code yourself.</li>
          <li>Execute training or inference from the CLI or your own automation.</li>
        </ol>
        <p>
          The advantage is <strong className="text-brand-green">ultimate control</strong> — custom
          environments, proprietary software, exact library versions. The cost is{' '}
          <strong className="text-brand-rose">high operational overhead</strong> and a slower
          time-to-first-experiment.
        </p>
        <p className="text-xs text-gray-400 italic">
          Step through the four-stage IaaS workflow.
        </p>
      </div>
    ),
    Visual: IaasWorkflowVisualizer,
  },
  {
    id: 'managed',
    title: 'Managed AI Services: An Integrated Platform',
    subtitle: 'Abstract the machines — keep the ML lifecycle tools',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Managed AI services are higher-level platforms that abstract away the underlying
          infrastructure — <strong className="text-white">SageMaker</strong>,{' '}
          <strong className="text-white">Vertex AI</strong>,{' '}
          <strong className="text-white">Azure Machine Learning</strong>. They bundle compute with
          tools for data labeling, training, hyperparameter tuning, and deployment.
        </p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>Define a training job or endpoint via UI, SDK, or config — not a hand-built VM.</li>
          <li>
            Specify resources (e.g. <span className="font-mono text-xs text-brand-orange">ml.g4dn.xlarge</span>)
            without managing the instances.
          </li>
          <li>Point at a script or container; the platform provisions, runs, and tears down.</li>
          <li>Use built-in HPO, experiment tracking, and one-click deploy with auto-scaling.</li>
        </ol>
        <p>
          The primary benefit is <strong className="text-brand-green">productivity</strong>. The
          trade-off is <strong className="text-brand-orange">less flexibility</strong> and a degree of{' '}
          <strong className="text-white">vendor lock-in</strong> when pipelines depend on a
          platform-specific SDK.
        </p>
        <p className="text-xs text-gray-400 italic">
          Submit a mock job and watch provision → run → teardown.
        </p>
      </div>
    ),
    Visual: ManagedWorkflowVisualizer,
  },
  {
    id: 'responsibility',
    title: 'Comparing Responsibilities',
    subtitle: 'Who owns each layer of the stack?',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The difference between the two models is clearest when you look at{' '}
          <strong className="text-white">who is responsible for each layer</strong> of the technology
          stack.
        </p>
        <p>
          With <strong className="text-sky-300">IaaS</strong>, your team’s responsibility extends
          deep into the stack — frameworks, OS, and drivers — while the provider only manages
          hardware and virtualization.
        </p>
        <p>
          With a <strong className="text-brand-green">managed AI service</strong>, the cloud provider
          handles most of the operational burden: the ML platform, frameworks, drivers, and hardware.
          You primarily focus on your model and application code.
        </p>
        <p className="text-xs text-gray-400 italic">
          Toggle IaaS vs managed — watch the blue “you” layers shrink.
        </p>
      </div>
    ),
    Visual: ResponsibilityStackVisualizer,
  },
  {
    id: 'choice',
    title: 'Making the Right Choice',
    subtitle: 'Skills, goals, and a hybrid that many teams actually run',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>Selecting the appropriate model depends on your team’s skills, project requirements, and business goals.</p>
        <h4 className="text-white font-semibold">Choose IaaS if</h4>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>You need custom software or an environment managed platforms do not support.</li>
          <li>You have a strong DevOps / MLOps team to build and maintain infrastructure.</li>
          <li>Per-hour cost optimisation on stable, long-running workloads justifies setup overhead.</li>
          <li>You want maximum portability and to avoid platform-level vendor lock-in.</li>
        </ul>
        <h4 className="text-white font-semibold">Choose a managed AI service if</h4>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Your main goal is to accelerate the ML development cycle.</li>
          <li>The team is mostly data scientists who want to stay on modeling.</li>
          <li>You need out-of-the-box MLOps: tracking, tuning, simplified deployment.</li>
          <li>You will pay a premium for convenience and faster time-to-market.</li>
        </ul>
        <p>
          A <strong className="text-brand-orange">hybrid</strong> is common: IaaS for heavy custom
          preprocessing, managed services for training and hosting. The choice is not permanent —
          strategies evolve as teams mature.
        </p>
        <p className="text-xs text-gray-400 italic">
          Answer the three questions, then open the hybrid pipeline pattern.
        </p>
      </div>
    ),
    Visual: ChoiceDecisionVisualizer,
  },
];

export default function LeveragingCloudPlatformsPart1() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-violet-400" />

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
                i === currentSlide ? 'w-8 bg-blue-500' : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
          className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-500 shadow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
