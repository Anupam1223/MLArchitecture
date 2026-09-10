import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  WorksOnMyMachineVisualizer,
  VmVsContainerVisualizer,
  DockerCoreVisualizer,
  WhyDockerMlVisualizer,
  MlImageLayersVisualizer,
  DockerfileInstructionsVisualizer,
  DockerfileWalkthroughVisualizer,
  BuildRunVisualizer,
} from '../components/ContainerizationPart1Visualizers';

export const meta = {
  title: 'Containerization and Orchestration for ML (Part 1)',
  subtitle: 'Docker for reproducible ML environments — images, Dockerfiles, and GPUs',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'intro',
    title: 'Introduction to Docker for Reproducible Environments',
    subtitle: 'Fixing “it works on my machine”',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Moving a machine learning project from a laptop to a production server often fails because of
          subtle differences: Python versions, conflicting dependencies, or incompatible system
          libraries. Deployments become unreliable and collaboration suffers.
        </p>
        <p>
          <strong className="text-white">Docker</strong> packages and runs applications in isolated
          environments called <strong className="text-white">containers</strong>. A container bundles
          your code, dependencies, libraries, and configuration so the same package runs consistently
          anywhere Docker is installed — laptop, on-prem server, or cloud VM.
        </p>
        <p className="text-xs text-gray-400 italic">
          Toggle Without / With Docker — watch laptop vs production diverge or match.
        </p>
      </div>
    ),
    Visual: WorksOnMyMachineVisualizer,
  },
  {
    id: 'vm-vs-ctr',
    title: 'Containers vs. Virtual Machines',
    subtitle: 'Hardware virtualization vs OS virtualization',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>Both isolate workloads, but they virtualize different layers:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-sky-300">Virtual Machines</strong> emulate an entire computer.
            Each VM includes a full <strong className="text-white">guest OS</strong> on top of a host
            OS, managed by a hypervisor. Isolation is strong, but disk size, startup time, and
            resource use are high.
          </li>
          <li>
            <strong className="text-emerald-300">Containers</strong> virtualize the OS, not the
            hardware. Many containers share one host kernel and only package the app plus its
            dependencies. They are lightweight, start almost instantly, and pack denser on a server.
          </li>
        </ul>
        <p>
          Caption from the architecture figure: containers share the host OS kernel via a container
          engine, making them more lightweight and faster than VMs that need a full guest OS per
          application.
        </p>
        <p className="text-xs text-gray-400 italic">
          Compare stacks side by side — notice no Guest OS / Hypervisor on the container side.
        </p>
      </div>
    ),
    Visual: VmVsContainerVisualizer,
  },
  {
    id: 'core',
    title: 'The Core Components of Docker',
    subtitle: 'Dockerfile · Image · Container',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>Working with Docker centers on three components:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-amber-300">Dockerfile</strong> — a text recipe: base image (Python
            or NVIDIA CUDA), system packages, copy app code, define the startup command.
          </li>
          <li>
            <strong className="text-sky-300">Image</strong> — a read-only template built from the
            Dockerfile. Layered for efficient storage and distribution; pushed to registries like
            Docker Hub or a private cloud registry.
          </li>
          <li>
            <strong className="text-emerald-300">Container</strong> — a live instance of an image. You
            create, start, stop, and delete them. Each is an isolated process on the host kernel with
            its own filesystem, networking, and process space.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">Tap Dockerfile → Image → Container in order.</p>
      </div>
    ),
    Visual: DockerCoreVisualizer,
  },
  {
    id: 'why-ml',
    title: 'Why Docker is Essential for Machine Learning',
    subtitle: 'Beyond venv / conda',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Python virtual environments (<span className="font-mono text-xs">venv</span>,{' '}
          <span className="font-mono text-xs">conda</span>) manage packages, but they do not capture
          system-level libraries, environment variables, or specific GPU driver / CUDA stacks.
        </p>
        <p>Docker closes those gaps:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Complete dependency encapsulation</strong> — Python
            packages, <span className="font-mono text-xs">apt-get</span> libs, CUDA versions, env vars
            in one Dockerfile.
          </li>
          <li>
            <strong className="text-white">Guaranteed reproducibility</strong> — training and serving
            run the same way everywhere; experiments stay comparable.
          </li>
          <li>
            <strong className="text-white">Simplified collaboration &amp; deployment</strong> — share
            an image, not a setup wiki. CI/CD runs the same artifact from dev to production.
          </li>
        </ul>
        <p>
          That stable foundation lets you focus on models, confident the environment is consistent
          and portable.
        </p>
        <p className="text-xs text-gray-400 italic">Compare what venv covers vs what Docker covers.</p>
      </div>
    ),
    Visual: WhyDockerMlVisualizer,
  },
  {
    id: 'layers',
    title: 'Building a Docker Image with ML Libraries',
    subtitle: 'Layered blueprint — OS → CUDA → Python → libs → code',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A Docker image is a blueprint for a consistent, portable environment. The blueprint is a{' '}
          <strong className="text-white">Dockerfile</strong> — a recipe. Each line is an instruction
          that assembles the image <strong className="text-white">layer by layer</strong>, starting
          from a base OS and adding libraries, code, and config on top.
        </p>
        <p>
          For ML this layering matters. A typical image is not just code and Python — it also needs
          the large <strong className="text-brand-orange">CUDA toolkit and cuDNN</strong> libraries to
          talk to the host GPU.
        </p>
        <p>
          Each layer builds on the previous and is <strong className="text-white">cached</strong> by
          Docker, so rebuilds are fast when only the top layers (your code) change.
        </p>
        <p className="text-xs text-gray-400 italic">
          Build from scratch, then “Rebuild (code only)” to see cache in action.
        </p>
      </div>
    ),
    Visual: MlImageLayersVisualizer,
  },
  {
    id: 'instructions',
    title: 'Essential Dockerfile Instructions',
    subtitle: 'FROM · WORKDIR / COPY · RUN · CMD',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <h4 className="text-white font-semibold">FROM — base image</h4>
        <p>
          Every Dockerfile starts with <span className="font-mono text-xs text-rose-300">FROM</span>.
          For CPU-only work, <span className="font-mono text-xs">python:3.9-slim</span> is light. For
          GPUs prefer{' '}
          <span className="font-mono text-xs text-rose-300">
            nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04
          </span>
          . Use <strong className="text-white">runtime</strong> (not devel) for most training.
          Always pin versions — never <span className="font-mono text-xs">latest</span>.
        </p>
        <h4 className="text-white font-semibold">WORKDIR and COPY</h4>
        <p>
          <span className="font-mono text-xs">WORKDIR</span> sets the working directory.{' '}
          <span className="font-mono text-xs">COPY</span> brings files in. Best practice: copy{' '}
          <span className="font-mono text-xs">requirements.txt</span> first, install deps, then copy
          the rest of the app — preserves layer cache when only code changes.
        </p>
        <h4 className="text-white font-semibold">RUN — install dependencies</h4>
        <p>
          Chain commands with <span className="font-mono text-xs">&&</span> in a single{' '}
          <span className="font-mono text-xs">RUN</span> to create one layer. Use{' '}
          <span className="font-mono text-xs">pip --no-cache-dir</span> to shrink the image.
        </p>
        <h4 className="text-white font-semibold">CMD</h4>
        <p>
          Default command when the container starts. Only one{' '}
          <span className="font-mono text-xs">CMD</span>. Prefer exec form:{' '}
          <span className="font-mono text-xs text-rose-300">
            CMD [&quot;python3&quot;, &quot;train.py&quot;, &quot;--epochs&quot;, &quot;10&quot;]
          </span>
          .
        </p>
        <p className="text-xs text-gray-400 italic">Tap FROM / WORKDIR / RUN / CMD on the right.</p>
      </div>
    ),
    Visual: DockerfileInstructionsVisualizer,
  },
  {
    id: 'full-df',
    title: 'Practical Example: Dockerizing a PyTorch Training App',
    subtitle: 'Project layout + complete GPU Dockerfile',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>A minimal project ready to containerize:</p>
        <pre className="text-[11px] font-mono text-gray-300 bg-gray-900/80 border border-gray-700 rounded-lg p-2">
{`.
├── Dockerfile
├── requirements.txt
└── train.py`}
        </pre>
        <p>
          <span className="font-mono text-xs">requirements.txt</span> pins ML libs, e.g.{' '}
          <span className="font-mono text-xs text-rose-300">torch==1.13.1</span>,{' '}
          <span className="font-mono text-xs text-rose-300">torchvision==0.14.1</span>,{' '}
          <span className="font-mono text-xs text-rose-300">numpy==1.23.5</span>.
        </p>
        <p>
          The complete GPU Dockerfile walks seven steps: CUDA base → noninteractive env →{' '}
          <span className="font-mono text-xs">WORKDIR /app</span> → copy requirements (cache) →
          chained <span className="font-mono text-xs">RUN</span> installs →{' '}
          <span className="font-mono text-xs">COPY . .</span> →{' '}
          <span className="font-mono text-xs">CMD [&quot;python3&quot;, &quot;train.py&quot;]</span>.
        </p>
        <p className="text-xs text-gray-400 italic">
          Switch Project files / Dockerfile steps and walk 1–7.
        </p>
      </div>
    ),
    Visual: DockerfileWalkthroughVisualizer,
  },
  {
    id: 'build-run',
    title: 'Building and Running the Image',
    subtitle: 'docker build · docker run --gpus all',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <h4 className="text-white font-semibold">Build</h4>
        <p>
          From the project directory, build and tag with{' '}
          <span className="font-mono text-xs">-t</span>:
        </p>
        <pre className="text-[10px] font-mono text-rose-300 bg-gray-900/80 border border-gray-700 rounded-lg p-2 overflow-x-auto">
          docker build -t pytorch-training-app:1.0 .
        </pre>
        <h4 className="text-white font-semibold">Run with GPU support</h4>
        <p>
          After the build you have a portable image. Grant host GPUs with{' '}
          <span className="font-mono text-xs text-rose-300">--gpus all</span>. The{' '}
          <strong className="text-white">NVIDIA Container Toolkit</strong> on the host mounts the
          needed drivers and libraries into the container:
        </p>
        <pre className="text-[10px] font-mono text-rose-300 bg-gray-900/80 border border-gray-700 rounded-lg p-2 overflow-x-auto">
          docker run --gpus all pytorch-training-app:1.0
        </pre>
        <p>
          You have packaged an ML app with its CUDA and Python dependencies into an image that runs
          on any machine with Docker and NVIDIA GPUs — the foundation for the scalable, reproducible
          systems we cover next.
        </p>
        <p className="text-xs text-gray-400 italic">
          Step Build → Run + GPU → Portability on the right.
        </p>
      </div>
    ),
    Visual: BuildRunVisualizer,
  },
];

export default function ContainerizationOrchestrationPart1() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400" />

          <div className="mb-3 shrink-0 pr-2">
            <span className="text-emerald-400 font-bold tracking-wider text-xs uppercase mb-1 block">
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
                i === currentSlide ? 'w-8 bg-emerald-500' : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          disabled={currentSlide === slidesData.length - 1}
          className="p-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 shadow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
