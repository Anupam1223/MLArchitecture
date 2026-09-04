import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Users,
  Cpu,
  Server,
  CheckCircle,
  Database,
  RotateCcw,
  HardDrive,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/** Interactive training vs inference flow with SVG arrows */
export function FlowDiagramVisualizer() {
  const [activeFlow, setActiveFlow] = useState('training');

  return (
    <div className="flex flex-col w-full h-full p-4 relative items-center justify-center overflow-auto custom-scroll">
      <div className="text-center mb-6 z-20">
        <h3 className="text-xl font-semibold text-white mb-4">A Tale of Two Workloads</h3>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveFlow('training')}
            className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
              activeFlow === 'training'
                ? 'bg-orange-500/20 text-brand-orange border-2 border-brand-orange shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-105'
                : 'bg-gray-800 border-2 border-transparent text-gray-400 hover:bg-gray-700'
            }`}
          >
            Training Workload
          </button>
          <button
            type="button"
            onClick={() => setActiveFlow('inference')}
            className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
              activeFlow === 'inference'
                ? 'bg-blue-500/20 text-brand-blue border-2 border-brand-blue shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-105'
                : 'bg-gray-800 border-2 border-transparent text-gray-400 hover:bg-gray-700'
            }`}
          >
            Inference Workload
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-lg relative bg-orange-50/5 rounded-2xl border border-gray-700 p-8 flex flex-col items-center justify-between min-h-[420px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden>
          <defs>
            <marker
              id="arrow-orange"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
            <marker
              id="arrow-blue"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
          </defs>

          {activeFlow === 'training' ? (
            <>
              <line
                x1="25%"
                y1="18%"
                x2="45%"
                y2="35%"
                stroke="#f59e0b"
                strokeWidth="2"
                markerEnd="url(#arrow-orange)"
              />
              <line
                x1="75%"
                y1="18%"
                x2="55%"
                y2="35%"
                stroke="#f59e0b"
                strokeWidth="2"
                markerEnd="url(#arrow-orange)"
              />
              <text x="45%" y="30%" fill="#d1d5db" fontSize="11" fontWeight="bold">
                Start
              </text>
              <line
                x1="50%"
                y1="58%"
                x2="50%"
                y2="70%"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="6 6"
                className="animate-flow"
                markerEnd="url(#arrow-orange)"
              />
              <path
                d="M 60% 75% C 85% 65%, 85% 50%, 62% 48%"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="6 6"
                className="animate-flow"
                markerEnd="url(#arrow-orange)"
              />
              <text x="80%" y="62%" fill="#9ca3af" fontSize="11" textAnchor="middle">
                Iterate & Refine (Epochs)
              </text>
              <line
                x1="50%"
                y1="82%"
                x2="50%"
                y2="90%"
                stroke="#f59e0b"
                strokeWidth="2"
                markerEnd="url(#arrow-orange)"
              />
              <text x="55%" y="87%" fill="#d1d5db" fontSize="11">
                Finish
              </text>
            </>
          ) : (
            <>
              <line
                x1="25%"
                y1="18%"
                x2="45%"
                y2="42%"
                stroke="#3b82f6"
                strokeWidth="2"
                markerEnd="url(#arrow-blue)"
              />
              <line
                x1="75%"
                y1="18%"
                x2="55%"
                y2="42%"
                stroke="#3b82f6"
                strokeWidth="2"
                markerEnd="url(#arrow-blue)"
              />
              <line
                x1="50%"
                y1="62%"
                x2="50%"
                y2="85%"
                stroke="#3b82f6"
                strokeWidth="2"
                markerEnd="url(#arrow-blue)"
              />
            </>
          )}
        </svg>

        {activeFlow === 'training' ? (
          <div className="w-full h-full flex flex-col items-center justify-between z-10">
            <div className="flex w-full justify-around mt-2 gap-2">
              <div className="bg-orange-200 text-orange-950 border-2 border-orange-300 p-3 rounded-xl text-sm font-semibold w-40 text-center shadow-lg">
                Model
                <br />
                <span className="text-xs font-normal opacity-80">(Initial Weights)</span>
              </div>
              <div className="bg-orange-200 text-orange-950 border-2 border-orange-300 p-3 rounded-xl text-sm font-semibold w-40 text-center shadow-lg">
                Large Dataset
              </div>
            </div>

            <div className="bg-pink-300 text-pink-950 border-2 border-pink-400 p-5 rounded-2xl text-center w-60 shadow-[0_0_20px_rgba(244,114,182,0.3)] my-4">
              <h4 className="font-bold text-base mb-1">Compute</h4>
              <p className="text-xs">
                (Massive Parallelism)
                <br />
                GPU Intensive
              </p>
            </div>

            <div className="bg-red-200 text-red-950 border-2 border-red-300 py-3 px-6 rounded-r-full rounded-l-lg text-sm font-semibold text-center mb-4">
              Optimizer
              <br />
              <span className="text-xs font-normal opacity-80">(Backpropagation)</span>
            </div>

            <div className="bg-green-300 text-green-950 border-2 border-green-400 p-3 rounded-xl text-sm font-bold w-44 text-center shadow-lg mb-2">
              Trained Model
              <br />
              <span className="text-xs font-normal opacity-80">(Final Weights)</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-between z-10">
            <div className="flex w-full justify-around mt-2 gap-2">
              <div className="bg-green-200 text-green-950 border-2 border-green-400 p-3 rounded-xl text-sm font-semibold w-40 text-center shadow-lg">
                Trained Model
                <br />
                <span className="text-xs font-normal opacity-80">(Fixed Weights)</span>
              </div>
              <div className="bg-blue-200 text-blue-950 border-2 border-blue-400 p-3 rounded-2xl text-sm font-semibold w-40 text-center shadow-lg flex items-center justify-center">
                New Data Point
              </div>
            </div>

            <div className="bg-purple-300 text-purple-950 border-2 border-purple-400 p-6 rounded-2xl text-center w-60 shadow-[0_0_20px_rgba(168,85,247,0.3)] my-auto">
              <h4 className="font-bold text-base mb-1">Compute</h4>
              <p className="text-xs">
                (Forward Pass)
                <br />
                Latency-Sensitive
              </p>
            </div>

            <div className="bg-cyan-200 text-cyan-950 border-2 border-cyan-400 p-4 rounded-full text-sm font-bold w-44 text-center shadow-lg mb-2">
              Prediction
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Step-through matrix multiply with formula reveal */
export function MatrixVisualizer() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const A = [
    [2, 3],
    [1, 4],
  ];
  const B = [
    [5, 1],
    [2, 3],
  ];
  const results = [
    A[0][0] * B[0][0] + A[0][1] * B[1][0],
    A[0][0] * B[0][1] + A[0][1] * B[1][1],
    A[1][0] * B[0][0] + A[1][1] * B[1][0],
    A[1][0] * B[0][1] + A[1][1] * B[1][1],
  ];
  const maxSteps = 5;

  useEffect(() => {
    if (!isPlaying || step >= maxSteps) {
      if (step >= maxSteps) setIsPlaying(false);
      return undefined;
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 1500);
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  const getRowState = (r) => {
    if (step === 0 || step === maxSteps) return '';
    if ((step === 1 || step === 2) && r === 0) return 'active-row';
    if ((step === 3 || step === 4) && r === 1) return 'active-row';
    return 'opacity-50';
  };

  const getColState = (c) => {
    if (step === 0 || step === maxSteps) return '';
    if ((step === 1 || step === 3) && c === 0) return 'active-col';
    if ((step === 2 || step === 4) && c === 1) return 'active-col';
    return 'opacity-50';
  };

  const getResultState = (r, c) => {
    const current =
      (step === 1 && r === 0 && c === 0) ||
      (step === 2 && r === 0 && c === 1) ||
      (step === 3 && r === 1 && c === 0) ||
      (step === 4 && r === 1 && c === 1);
    if (current) return 'active-result';

    const done =
      (step > 1 && r === 0 && c === 0) ||
      (step > 2 && r === 0 && c === 1) ||
      (step > 3 && r === 1 && c === 0) ||
      (step >= 4 && r === 1 && c === 1);
    return done ? 'border-brand-green text-brand-green' : 'border-gray-600 text-gray-500';
  };

  const displayC = (r, c) => {
    if (step === 0) return '?';
    if (step === 1 && r === 0 && c === 0) return '2*5 + 3*2';
    if (step > 1 && r === 0 && c === 0) return results[0];
    if (step === 2 && r === 0 && c === 1) return '2*1 + 3*3';
    if (step > 2 && r === 0 && c === 1) return results[1];
    if (step === 3 && r === 1 && c === 0) return '1*5 + 4*2';
    if (step > 3 && r === 1 && c === 0) return results[2];
    if (step === 4 && r === 1 && c === 1) return '1*1 + 4*3';
    if (step >= 4 && r === 1 && c === 1) return results[3];
    return '?';
  };

  const renderMatrix = (data, title, mode, colorClass) => (
    <div className="flex flex-col items-center">
      <span className={`text-sm mb-2 font-mono ${colorClass}`}>{title}</span>
      <div className="relative p-2 border-l-2 border-r-2 border-gray-500 rounded-lg bg-gray-800/50">
        {data.map((row, r) => (
          <div key={r} className="flex">
            {row.map((val, c) => {
              let extra = 'border-gray-600';
              if (mode === 'row') extra = getRowState(r);
              else if (mode === 'col') extra = getColState(c);
              else extra = getResultState(r, c);

              const displayVal = mode === 'result' ? displayC(r, c) : val;
              const small =
                mode === 'result' && typeof displayVal === 'string' && displayVal.includes('*');

              return (
                <div
                  key={c}
                  className={`math-cell w-14 h-14 md:w-20 md:h-20 m-1 flex items-center justify-center border-2 rounded-md font-mono font-bold ${
                    small ? 'text-[10px] leading-tight px-0.5 text-center' : 'text-lg'
                  } ${extra}`}
                >
                  {displayVal}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full justify-center p-4 overflow-auto custom-scroll">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          The Engine of AI: Matrix Multiplication
        </h3>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          Deep learning training is dominated by dot products{' '}
          <span className="font-serif italic text-cyan-300">C = A · B</span>. GPUs excel because
          they compute thousands of these intersecting row/column operations simultaneously.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
        {renderMatrix(A, 'Matrix A (Weights)', 'row', 'text-brand-blue')}
        <div className="text-3xl font-bold text-gray-500">×</div>
        {renderMatrix(B, 'Matrix B (Inputs)', 'col', 'text-brand-purple')}
        <div className="text-3xl font-bold text-gray-500">=</div>
        {renderMatrix(
          [
            [0, 0],
            [0, 0],
          ],
          'Matrix C (Output)',
          'result',
          'text-brand-green'
        )}
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4">
        <button
          type="button"
          onClick={() => {
            setStep(0);
            setIsPlaying(false);
          }}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium text-sm"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-medium text-sm"
        >
          Prev Step
        </button>
        <button
          type="button"
          onClick={() => {
            if (step === maxSteps) {
              setStep(0);
              setIsPlaying(true);
            } else {
              setIsPlaying(!isPlaying);
            }
          }}
          className="px-6 py-2 rounded-lg bg-brand-blue hover:bg-blue-600 text-white font-bold flex items-center gap-2"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pause' : step === maxSteps ? 'Replay' : 'Auto-Play'}
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(maxSteps, s + 1))}
          disabled={step === maxSteps}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-medium text-sm"
        >
          Next Step
        </button>
      </div>

      <div className="mt-8 text-center min-h-[60px]">
        {step === 0 && (
          <p className="text-gray-400 italic">
            Click Play or Next Step to see how the dot product is calculated.
          </p>
        )}
        {step > 0 && step < maxSteps && (
          <p className="text-white text-lg">
            Dot Product:{' '}
            <span className="text-brand-blue font-bold">Row {step <= 2 ? 1 : 2}</span> ×{' '}
            <span className="text-brand-purple font-bold">Col {step % 2 === 1 ? 1 : 2}</span>
          </p>
        )}
        {step === maxSteps && (
          <p className="text-brand-green font-bold text-lg">
            Calculation Complete! A GPU would do this in a single clock cycle.
          </p>
        )}
      </div>
    </div>
  );
}

/** Latency vs throughput inference simulation */
export function InferenceVisualizer() {
  const [activeRequest, setActiveRequest] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!activeRequest) return undefined;
    setProgress(0);
    const speed = activeRequest === 'single' ? 2 : 1;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setActiveRequest(null), 1000);
          return 100;
        }
        return p + speed;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [activeRequest]);

  return (
    <div className="flex flex-col w-full h-full p-6 relative overflow-auto custom-scroll">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-white mb-2">Inference: The Deployment Phase</h3>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          Once trained, the model weights are frozen. Inference prioritizes low-latency (returning
          one result instantly) or high-throughput (serving thousands of users concurrently).
        </p>
      </div>

      <div className="flex-1 flex items-center justify-between relative px-4 md:px-10 min-h-[200px]">
        <div className="flex flex-col items-center z-10">
          <div className="w-16 h-16 rounded-full bg-brand-blue/20 border-2 border-brand-blue flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Users className="w-8 h-8 text-brand-blue" />
          </div>
          <span className="text-sm font-medium text-gray-300">New Data</span>
        </div>

        <div className="flex flex-col items-center z-10 relative">
          <div
            className={`w-32 h-40 rounded-xl bg-brand-purple/20 border-2 border-brand-purple flex flex-col items-center justify-center mb-2 transition-all duration-300 ${
              activeRequest ? 'shadow-[0_0_30px_rgba(139,92,246,0.5)] scale-105' : ''
            }`}
          >
            <Cpu
              className={`w-12 h-12 text-brand-purple mb-2 ${activeRequest ? 'animate-pulse' : ''}`}
            />
            <span className="text-xs font-bold text-brand-purple text-center px-2">
              Trained Model
              <br />
              (Fixed Weights)
            </span>
          </div>
          <span className="text-sm font-medium text-gray-300">Compute</span>
        </div>

        <div className="flex flex-col items-center z-10">
          <div className="w-16 h-16 rounded-full bg-brand-green/20 border-2 border-brand-green flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <CheckCircle className="w-8 h-8 text-brand-green" />
          </div>
          <span className="text-sm font-medium text-gray-300">Prediction</span>
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          <line x1="15%" y1="50%" x2="40%" y2="50%" className="connector-line opacity-30" />
          <line x1="60%" y1="50%" x2="85%" y2="50%" className="connector-line opacity-30" />

          {activeRequest === 'single' && progress < 50 && (
            <circle cx={`${15 + progress * 0.5}%`} cy="50%" r="6" fill="#3b82f6" />
          )}
          {activeRequest === 'single' && progress >= 50 && progress < 100 && (
            <circle cx={`${60 + (progress - 50) * 0.5}%`} cy="50%" r="6" fill="#10b981" />
          )}

          {activeRequest === 'batch' && progress < 50 && (
            <g transform={`translate(${15 + progress * 0.5}%, 0)`}>
              {[0, 1, 2, 3, 4].map((i) => (
                <circle key={i} cx="0" cy={`${40 + i * 5}%`} r="4" fill="#3b82f6" opacity={0.8} />
              ))}
            </g>
          )}
          {activeRequest === 'batch' && progress >= 50 && progress < 100 && (
            <g transform={`translate(${60 + (progress - 50) * 0.5}%, 0)`}>
              {[0, 1, 2, 3, 4].map((i) => (
                <circle key={i} cx="0" cy={`${40 + i * 5}%`} r="4" fill="#10b981" opacity={0.8} />
              ))}
            </g>
          )}
        </svg>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8 z-20">
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => !activeRequest && setActiveRequest('single')}
            disabled={activeRequest !== null}
            className="px-6 py-3 rounded-lg bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold shadow-lg shadow-blue-500/20"
          >
            Simulate Single Request
          </button>
          <span className="text-xs text-gray-400 mt-2">Optimizes for Latency (ms)</span>
        </div>
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => !activeRequest && setActiveRequest('batch')}
            disabled={activeRequest !== null}
            className="px-6 py-3 rounded-lg bg-brand-purple hover:bg-purple-600 disabled:opacity-50 text-white font-bold shadow-lg shadow-purple-500/20"
          >
            Simulate Concurrent Traffic
          </button>
          <span className="text-xs text-gray-400 mt-2">Optimizes for Throughput (req/sec)</span>
        </div>
      </div>
    </div>
  );
}

/** Vertical training loop — CPU orchestrates, GPU accelerates */
export function TrainingLoopVisualizer() {
  const steps = [
    {
      id: 0,
      zone: 'cpu',
      label: 'Start Training Epoch',
      desc: 'Python loop begins — CPU is the conductor',
      bus: null,
    },
    {
      id: 1,
      zone: 'cpu',
      label: 'Load Data Batch from Disk',
      desc: 'OS I/O: images, CSV, text corpora',
      bus: null,
    },
    {
      id: 2,
      zone: 'cpu',
      label: 'Preprocess & Augment',
      desc: 'Decode JPEG, tokenize, rotate / crop / flip',
      bus: null,
    },
    {
      id: 3,
      zone: 'bus',
      label: 'Send Tensor + Kernel (H2D)',
      desc: 'PCIe: copy batch + “run matmul” command to GPU',
      bus: 'h2d',
    },
    {
      id: 4,
      zone: 'gpu',
      label: 'Forward Pass',
      desc: 'GPU: matrix multiplies → prediction',
      bus: null,
    },
    {
      id: 5,
      zone: 'gpu',
      label: 'Backward Pass',
      desc: 'GPU: gradients ∂L/∂w for every weight',
      bus: null,
    },
    {
      id: 6,
      zone: 'bus',
      label: 'Receive Gradients / Loss (D2H)',
      desc: 'PCIe: results return to host for control logic',
      bus: 'd2h',
    },
    {
      id: 7,
      zone: 'cpu',
      label: 'Update Model Weights',
      desc: 'Optimizer step (Adam / SGD) on the CPU loop',
      bus: null,
    },
    {
      id: 8,
      zone: 'cpu',
      label: 'Log Metrics & Checkpoint',
      desc: 'Write loss to logs; save weights to disk',
      bus: null,
    },
    {
      id: 9,
      zone: 'cpu',
      label: 'End of Batch?',
      desc: 'No → next batch. Yes → next epoch or stop.',
      bus: null,
    },
  ];

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [epoch, setEpoch] = useState(1);
  const [batch, setBatch] = useState(1);

  const bumpBatch = () => {
    setBatch((b) => {
      if (b >= 4) {
        setEpoch((e) => e + 1);
        return 1;
      }
      return b + 1;
    });
  };

  const goNext = () => {
    setPlaying(false);
    setStep((s) => {
      if (s >= steps.length - 1) {
        bumpBatch();
        return 0;
      }
      return s + 1;
    });
  };

  const goPrev = () => {
    setPlaying(false);
    setStep((s) => Math.max(0, s - 1));
  };

  useEffect(() => {
    if (!playing) return undefined;
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          bumpBatch();
          return 0;
        }
        return s + 1;
      });
    }, 1400);
    return () => clearInterval(t);
  }, [playing, steps.length]);

  const current = steps[step];
  const isGpu = current.zone === 'gpu';
  const isBus = current.zone === 'bus';

  const chipClass = (s, i) => {
    const active = i === step;
    const done = i < step;
    if (s.zone === 'gpu') {
      return active
        ? 'border-brand-green bg-brand-green text-white shadow-[0_0_18px_rgba(16,185,129,0.45)] scale-[1.02]'
        : done
          ? 'border-emerald-800/70 bg-emerald-950/50 text-emerald-200/80'
          : 'border-gray-700 bg-gray-900/70 text-gray-500';
    }
    if (s.zone === 'bus') {
      return active
        ? 'border-brand-purple bg-brand-purple text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] scale-[1.02]'
        : done
          ? 'border-violet-800/70 bg-violet-950/50 text-violet-200/80'
          : 'border-dashed border-gray-600 bg-gray-900/40 text-gray-500';
    }
    return active
      ? 'border-brand-blue bg-brand-blue text-white shadow-[0_0_18px_rgba(59,130,246,0.45)] scale-[1.02]'
      : done
        ? 'border-blue-800/70 bg-blue-950/50 text-blue-200/80'
        : 'border-gray-700 bg-gray-900/70 text-gray-500';
  };

  const cpuSteps = steps.filter((s) => s.zone === 'cpu' || s.zone === 'bus');
  const gpuSteps = steps.filter((s) => s.zone === 'gpu');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">
          The Master Conductor: CPU ↔ GPU Loop
        </h3>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          CPU prepares data and runs the Python control plane. GPU only computes when the CPU
          feeds it work over PCIe.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300">
          Step {step + 1} / {steps.length}
        </span>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300">
          Epoch {epoch}
        </span>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300">
          Batch {batch}
        </span>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
            isGpu
              ? 'bg-brand-green/15 border-brand-green/40 text-brand-green'
              : isBus
                ? 'bg-brand-purple/15 border-brand-purple/40 text-brand-purple'
                : 'bg-brand-blue/15 border-brand-blue/40 text-brand-blue'
          }`}
        >
          Active: {isGpu ? 'GPU' : isBus ? 'PCIe Bus' : 'CPU'}
        </span>
      </div>

      <div className="grid md:grid-cols-[1fr_72px_1fr] gap-3 items-stretch max-w-3xl mx-auto w-full flex-1 min-h-0">
        <div className="rounded-xl border border-brand-blue/35 bg-brand-blue/5 p-3 flex flex-col">
          <div className="flex items-center gap-2 text-brand-blue font-bold text-sm mb-3">
            <Cpu className="w-4 h-4" />
            CPU — Orchestrator
          </div>
          <div className="space-y-1.5 flex-1">
            {cpuSteps.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setStep(s.id);
                }}
                className={`w-full text-left rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${chipClass(s, s.id)}`}
              >
                <div className="flex items-center gap-1.5">
                  {step === s.id && <Sparkles className="w-3 h-3 shrink-0" />}
                  <span>{s.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center gap-2">
          <span
            className={`text-[10px] font-bold tracking-wider ${
              current.bus === 'h2d' ? 'text-brand-orange animate-pulse' : 'text-gray-600'
            }`}
          >
            H2D
          </span>
          <div className="w-1.5 flex-1 min-h-[120px] rounded-full bg-gradient-to-b from-brand-blue via-brand-purple to-brand-green relative">
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full transition-all duration-500 ${
                current.bus === 'h2d'
                  ? 'top-[15%] bg-brand-orange shadow-[0_0_14px_#f59e0b]'
                  : current.bus === 'd2h'
                    ? 'top-[75%] bg-brand-green shadow-[0_0_14px_#10b981]'
                    : isGpu
                      ? 'top-[50%] bg-brand-green'
                      : 'top-[20%] bg-brand-blue'
              }`}
            />
          </div>
          <span
            className={`text-[10px] font-bold tracking-wider ${
              current.bus === 'd2h' ? 'text-brand-green animate-pulse' : 'text-gray-600'
            }`}
          >
            D2H
          </span>
          <span className="text-[9px] text-gray-500 font-mono text-center leading-tight">PCIe</span>
        </div>

        <div className="rounded-xl border border-brand-green/35 bg-brand-green/5 p-3 flex flex-col">
          <div className="flex items-center gap-2 text-brand-green font-bold text-sm mb-3">
            <Server className="w-4 h-4" />
            GPU — Accelerator
          </div>
          <div className="flex-1 flex flex-col justify-center gap-3">
            {gpuSteps.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setStep(s.id);
                }}
                className={`w-full text-left rounded-lg border px-3 py-3 text-xs font-medium transition-all ${chipClass(s, s.id)}`}
              >
                <div className="flex items-center gap-1.5">
                  {step === s.id && <Sparkles className="w-3 h-3 shrink-0" />}
                  <span className="font-bold">{s.label}</span>
                </div>
                <div className="text-[10px] opacity-80 mt-1">{s.desc}</div>
              </button>
            ))}
            <div
              className={`mt-2 rounded-lg border border-dashed p-3 text-center transition-colors ${
                isGpu ? 'border-brand-green/50 bg-brand-green/10' : 'border-gray-700'
              }`}
            >
              <HardDrive
                className={`w-7 h-7 mx-auto mb-1.5 ${isGpu ? 'text-brand-green animate-pulse' : 'text-gray-600'}`}
              />
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Dense math lives here. If the CPU is slow to feed batches, these cores sit idle
                (memory starvation).
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mt-3 rounded-xl border p-3 text-center text-sm ${
          isGpu
            ? 'border-brand-green/40 bg-brand-green/10 text-emerald-100'
            : isBus
              ? 'border-brand-purple/40 bg-brand-purple/10 text-violet-100'
              : 'border-brand-blue/40 bg-brand-blue/10 text-blue-100'
        }`}
      >
        <strong>{current.label}</strong>
        <span className="text-gray-400"> — </span>
        {current.desc}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={step === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" /> Prev Step
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-semibold ${
            playing ? 'bg-brand-orange hover:bg-orange-500' : 'bg-brand-blue hover:bg-blue-600'
          }`}
        >
          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {playing ? 'Pause' : 'Auto-Play'}
        </button>
        <button
          type="button"
          onClick={goNext}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-gray-900 hover:bg-gray-200 text-xs font-bold"
        >
          Next Step <ChevronRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setStep(0);
            setEpoch(1);
            setBatch(1);
            setPlaying(false);
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>
    </div>
  );
}

/** CPU vs GPU race on 64 independent tasks */
export function ArchitecturesVisualizer() {
  const [view, setView] = useState('silicon');
  const [running, setRunning] = useState(false);
  const [cpuProgress, setCpuProgress] = useState(0);
  const [gpuProgress, setGpuProgress] = useState(0);
  const [simdTick, setSimdTick] = useState(0);

  const totalTasks = 64;
  const cpuCores = 4;
  const gpuCores = 64;

  useEffect(() => {
    if (view !== 'simd') return undefined;
    const t = setInterval(() => setSimdTick((x) => x + 1), 700);
    return () => clearInterval(t);
  }, [view]);

  useEffect(() => {
    if (!running) return undefined;
    const interval = setInterval(() => {
      setCpuProgress((p) => Math.min(totalTasks, p + cpuCores));
      setGpuProgress((p) => Math.min(totalTasks, p + gpuCores / 4));
    }, 200);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (cpuProgress >= totalTasks && gpuProgress >= totalTasks && running) {
      const t = setTimeout(() => setRunning(false), 500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [cpuProgress, gpuProgress, running]);

  const reset = () => {
    setCpuProgress(0);
    setGpuProgress(0);
    setRunning(true);
  };

  const renderCores = (total, activeCount, colorClass) =>
    Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`transition-colors duration-200 border border-gray-600 rounded-sm ${
          i < activeCount ? colorClass : 'bg-gray-800'
        }`}
        style={{
          width: total > 10 ? 12 : 40,
          height: total > 10 ? 12 : 40,
        }}
      />
    ));

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">
          Architecture of Throughput: CPU vs GPU
        </h3>
        <p className="text-gray-400 text-sm">
          Silicon layout → SIMD lockstep → race on 64 independent tasks.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {[
          { id: 'silicon', label: 'Silicon Die' },
          { id: 'simd', label: 'SIMD / Analogy' },
          { id: 'race', label: 'Throughput Race' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setView(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              view === t.id ? 'bg-brand-green text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {view === 'silicon' && (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-brand-blue/40 bg-gray-800/50 p-4 flex flex-col">
            <h4 className="text-brand-blue font-bold mb-1 text-sm">CPU — Low Latency</h4>
            <p className="text-[10px] text-gray-400 mb-3">
              Most die goes to cache + complex control so a few cores finish one thread fast.
            </p>
            <div className="flex-1 rounded-lg bg-[#e8eef6] p-3 space-y-2 text-[10px] font-bold">
              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 rounded bg-emerald-600 text-white flex items-center justify-center">
                  Large Cache
                </div>
                <div className="h-8 rounded bg-sky-500 text-white flex items-center justify-center">
                  Complex Control
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-16 rounded bg-blue-500 text-white flex items-center justify-center text-center leading-tight"
                  >
                    Core
                    <br />
                    {n}
                  </div>
                ))}
              </div>
              <div className="h-10 rounded-full bg-rose-300 text-rose-950 flex items-center justify-center">
                System Memory (DRAM)
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              Task scheduling &amp; logic — each core is a master chef cooking a full meal.
            </p>
          </div>

          <div className="rounded-xl border border-brand-green/40 bg-gray-800/50 p-4 flex flex-col">
            <h4 className="text-brand-green font-bold mb-1 text-sm">GPU — High Throughput</h4>
            <p className="text-[10px] text-gray-400 mb-3">
              Most die is arithmetic cores + a wide path to HBM / VRAM.
            </p>
            <div className="flex-1 rounded-lg bg-[#e8eef6] p-3 space-y-2 text-[10px] font-bold">
              <div className="flex gap-2">
                <div className="h-7 w-16 rounded bg-emerald-700 text-white flex items-center justify-center">
                  Small Cache
                </div>
                <div className="h-7 w-20 rounded bg-sky-400 text-white flex items-center justify-center">
                  Simple Control
                </div>
              </div>
              <div className="grid grid-cols-12 gap-0.5 p-1.5 rounded bg-green-600">
                {Array.from({ length: 72 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-[1px] bg-green-200" />
                ))}
              </div>
              <div className="h-6 rounded bg-slate-400 text-slate-900 flex items-center justify-center">
                Streaming Multiprocessor cluster
              </div>
              <div className="h-10 rounded-full bg-rose-300 text-rose-950 flex items-center justify-center">
                High-Bandwidth Memory (VRAM)
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              Matrix multiply &amp; parallel tensors — an assembly line of onion-dicers.
            </p>
          </div>
        </div>
      )}

      {view === 'simd' && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-brand-blue/40 bg-brand-blue/5 p-4">
              <h4 className="text-brand-blue font-bold text-sm mb-1">CPU · Master Chefs</h4>
              <p className="text-xs text-gray-400 mb-3">
                Few powerful cores. Each cooks an entire multi-course meal (complex, sequential
                instructions) end-to-end.
              </p>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-16 rounded-lg border-2 flex items-center justify-center text-[10px] font-bold ${
                      simdTick % 4 === i
                        ? 'border-brand-blue bg-brand-blue text-white'
                        : 'border-gray-700 bg-gray-900 text-gray-500'
                    }`}
                  >
                    Chef {i + 1}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                One chef works one dish at a time — low latency for that dish.
              </p>
            </div>
            <div className="rounded-xl border border-brand-green/40 bg-brand-green/5 p-4">
              <h4 className="text-brand-green font-bold text-sm mb-1">GPU · Assembly Line (SIMD)</h4>
              <p className="text-xs text-gray-400 mb-3">
                <strong className="text-white">Single Instruction, Multiple Data</strong> — the
                same “dice onion” op fires on thousands of onions at once.
              </p>
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-6 rounded-sm ${
                      simdTick % 2 === 0
                        ? 'bg-brand-green shadow-[0_0_6px_#10b981]'
                        : 'bg-brand-green/30'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                Lockstep: every core executes the identical instruction this cycle.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-3 text-center text-xs text-gray-300">
            <span className="text-brand-blue font-semibold">Low latency</span> = finish one
            complicated job quickly.&nbsp;&nbsp;
            <span className="text-brand-green font-semibold">High throughput</span> = finish a
            huge pile of simple identical jobs at once. Deep learning is the second pile.
          </div>
        </div>
      )}

      {view === 'race' && (
        <>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex flex-col items-center">
          <h4 className="text-lg font-bold text-brand-blue mb-2 flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            Central Processing Unit
          </h4>
          <p className="text-xs text-gray-400 text-center mb-6 h-8">
            A few powerful, complex cores designed for sequential, low-latency logic.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-900 p-4 rounded-lg">
            {renderCores(
              4,
              running && cpuProgress < totalTasks ? 4 : 0,
              'bg-brand-blue shadow-[0_0_10px_#3b82f6]'
            )}
          </div>
          <div className="w-full bg-gray-900 h-6 rounded-full overflow-hidden border border-gray-700 relative">
            <div
              className="absolute top-0 left-0 h-full bg-brand-blue transition-all duration-200"
              style={{ width: `${(cpuProgress / totalTasks) * 100}%` }}
            />
            <span className="absolute w-full text-center text-xs font-bold leading-6 text-white z-10 mix-blend-difference">
              {cpuProgress} / {totalTasks} Tasks
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Processes 4 tasks per clock cycle.</p>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex flex-col items-center">
          <h4 className="text-lg font-bold text-brand-green mb-2 flex items-center gap-2">
            <Server className="w-5 h-5" />
            Graphics Processing Unit
          </h4>
          <p className="text-xs text-gray-400 text-center mb-6 h-8">
            Thousands of simple cores designed for massive throughput and SIMD operations.
          </p>
          <div className="grid grid-cols-8 gap-1 mb-8 bg-gray-900 p-4 rounded-lg">
            {renderCores(
              64,
              running && gpuProgress < totalTasks ? 64 : 0,
              'bg-brand-green shadow-[0_0_5px_#10b981]'
            )}
          </div>
          <div className="w-full bg-gray-900 h-6 rounded-full overflow-hidden border border-gray-700 relative">
            <div
              className="absolute top-0 left-0 h-full bg-brand-green transition-all duration-200"
              style={{ width: `${(gpuProgress / totalTasks) * 100}%` }}
            />
            <span className="absolute w-full text-center text-xs font-bold leading-6 text-white z-10 mix-blend-difference">
              {Math.min(totalTasks, Math.floor(gpuProgress))} / {totalTasks} Tasks
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Processes all 64 tasks simultaneously.
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={reset}
          disabled={running}
          className="px-8 py-3 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-xl"
        >
          <Play className="w-5 h-5" />
          {cpuProgress === totalTasks ? 'Run Again' : 'Execute Computation'}
        </button>
      </div>
        </>
      )}
    </div>
  );
}

/** Layer formula + independent dot products */
export function NeuralOpsVisualizer() {
  const [cell, setCell] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showBias, setShowBias] = useState(true);
  const [showAct, setShowAct] = useState(true);

  const cells = [
    { r: 0, c: 0, expr: 'x₀·w₀₀ + x₁·w₁₀', val: 16 },
    { r: 0, c: 1, expr: 'x₀·w₀₁ + x₁·w₁₁', val: 11 },
    { r: 1, c: 0, expr: 'x₂·w₀₀ + x₃·w₁₀', val: 13 },
    { r: 1, c: 1, expr: 'x₂·w₀₁ + x₃·w₁₁', val: 13 },
  ];

  useEffect(() => {
    if (!playing) return undefined;
    const t = setInterval(() => setCell((c) => (c + 1) % 4), 1400);
    return () => clearInterval(t);
  }, [playing]);

  const cur = cells[cell];

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-auto custom-scroll">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-white mb-1">Why Layers Parallelize</h3>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Every output cell is an independent dot product. GPUs assign thousands of cells to
          thousands of cores at once.
        </p>
      </div>

      <div className="rounded-2xl border border-cyan-900/50 bg-gray-950 p-5 text-center mb-4">
        <div className="text-lg md:text-xl font-serif italic text-slate-100 tracking-wide">
          output ={' '}
          {showAct && <span className="text-brand-green">activation(</span>}
          <span className="text-brand-orange">inputs</span>
          <span className="text-gray-500"> · </span>
          <span className="text-brand-purple">weights</span>
          {showBias && (
            <>
              <span className="text-gray-500"> + </span>
              <span className="text-sky-300">biases</span>
            </>
          )}
          {showAct && <span className="text-brand-green">)</span>}
        </div>
        <div className="mt-3 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setShowBias((b) => !b)}
            className={`text-xs px-3 py-1 rounded-full border ${
              showBias ? 'border-sky-400 text-sky-300' : 'border-gray-600 text-gray-500'
            }`}
          >
            ± biases
          </button>
          <button
            type="button"
            onClick={() => setShowAct((a) => !a)}
            className={`text-xs px-3 py-1 rounded-full border ${
              showAct ? 'border-brand-green text-brand-green' : 'border-gray-600 text-gray-500'
            }`}
          >
            ± activation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto w-full mb-4">
        {cells.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setPlaying(false);
              setCell(i);
            }}
            className={`rounded-xl border p-3 text-left transition ${
              i === cell
                ? 'border-brand-green bg-brand-green/15 text-white'
                : 'border-gray-700 bg-gray-900/60 text-gray-400'
            }`}
          >
            <div className="text-[10px] uppercase tracking-wider mb-1">
              output[{c.r}][{c.c}]
            </div>
            <div className="font-mono text-xs">{c.expr}</div>
            {i === cell && (
              <div className="text-brand-green font-bold text-sm mt-1">= {c.val}</div>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-black/40 border border-gray-700 p-3 text-center text-sm text-gray-300 mb-4">
        Computing <span className="text-brand-green font-mono">C[{cur.r}][{cur.c}]</span>:{' '}
        <span className="font-serif italic text-cyan-300">{cur.expr}</span>
        <p className="text-xs text-gray-500 mt-2">
          These four cells do not depend on each other. A CPU walks them one (or a few) at a time.
          A GPU fires all four — and thousands more — in the same wave.
        </p>
      </div>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
            playing ? 'bg-brand-orange text-white' : 'bg-brand-blue text-white'
          }`}
        >
          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {playing ? 'Pause' : 'Auto-Play Cells'}
        </button>
      </div>
    </div>
  );
}

/** Tensor cores vs HBM bandwidth */
export function GPUHardwareVisualizer() {
  const [activeFeature, setActiveFeature] = useState('cores');
  const [animating, setAnimating] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!animating || activeFeature !== 'tensor') return undefined;
    const t = setInterval(() => setTick((x) => x + 1), 50);
    return () => clearInterval(t);
  }, [animating, activeFeature]);

  const triggerAnimation = () => {
    setAnimating(true);
    const ms = activeFeature === 'tensor' ? 1000 : activeFeature === 'cores' ? 1800 : 2500;
    setTimeout(() => setAnimating(false), ms);
  };

  return (
    <div className="flex flex-col w-full h-full p-4 relative overflow-auto custom-scroll">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-1">Advanced GPU Architecture</h3>
        <p className="text-gray-400 text-sm">
          Beyond core counts: The specialized hardware that enables modern AI.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {[
          { id: 'cores', label: 'CUDA Cores', on: 'bg-brand-blue text-white' },
          { id: 'tensor', label: 'Tensor Cores', on: 'bg-brand-green text-white' },
          { id: 'memory', label: 'HBM Bandwidth', on: 'bg-brand-purple text-white' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setActiveFeature(t.id);
              setAnimating(false);
            }}
            className={`px-3 py-2 rounded-lg font-bold text-xs transition-colors ${
              activeFeature === t.id ? t.on : 'bg-gray-800 text-gray-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-gray-900 rounded-xl border border-gray-700 p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[280px]">
        {activeFeature === 'cores' && (
          <div className="w-full flex flex-col items-center">
            <h4 className="text-brand-blue font-bold mb-2">CUDA Cores (Compute ALUs)</h4>
            <p className="text-xs text-gray-400 mb-6 text-center max-w-sm">
              Fundamental processing units on NVIDIA GPUs. More cores = more parallel elementwise
              and general ops in flight.
            </p>
            <div className="grid grid-cols-8 gap-1 max-w-sm w-full">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-7 rounded ${
                    animating ? 'bg-brand-blue animate-pulse' : 'bg-brand-blue/40'
                  }`}
                  style={{ animationDelay: `${i * 40}ms` }}
                />
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-3">Simulate to light up the ALU grid.</p>
          </div>
        )}

        {activeFeature === 'tensor' && (
          <div className="w-full flex flex-col items-center">
            <h4 className="text-brand-green font-bold mb-2">Matrix Multiply-Accumulate (MAC)</h4>
            <p className="text-xs text-gray-400 mb-8 text-center max-w-sm">
              Standard cores process one element at a time. Tensor cores execute a full 4×4 matrix
              operation in a single clock cycle.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-center">
              <div className="flex flex-col items-center opacity-50">
                <span className="text-xs mb-2 text-gray-300 font-mono">Standard Core</span>
                <div className="grid grid-cols-4 gap-1 bg-gray-800 p-2 rounded">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-sm border border-gray-600 transition-colors duration-100 ${
                        animating && i === tick % 16 ? 'bg-white' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] mt-2 text-gray-400">Sequential Processing</span>
              </div>

              <div className="text-2xl font-bold text-gray-600">VS</div>

              <div className="flex flex-col items-center">
                <span className="text-xs mb-2 text-brand-green font-mono font-bold">Tensor Core</span>
                <div className="grid grid-cols-4 gap-1 bg-gray-800 p-2 rounded relative">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={`t-${i}`}
                      className={`w-6 h-6 rounded-sm border border-brand-green transition-all duration-300 ${
                        animating
                          ? 'bg-brand-green shadow-[0_0_10px_#10b981]'
                          : 'bg-brand-green/20'
                      }`}
                    />
                  ))}
                  {animating && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded" />
                  )}
                </div>
                <span className="text-[10px] mt-2 text-brand-green">1 Clock Cycle</span>
              </div>
            </div>
          </div>
        )}

        {activeFeature === 'memory' && (
          <div className="w-full flex flex-col items-center">
            <h4 className="text-brand-blue font-bold mb-2">High-Bandwidth Memory (HBM)</h4>
            <p className="text-xs text-gray-400 mb-8 text-center max-w-sm">
              Thousands of cores are useless if they wait for data. HBM provides an ultra-wide
              highway between VRAM and compute cores.
            </p>

            <div className="flex items-center gap-4 w-full max-w-lg">
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-600 flex flex-col items-center w-24 shrink-0">
                <Database className="w-8 h-8 text-brand-blue mb-2" />
                <span className="text-[10px] text-gray-300">VRAM</span>
              </div>

              <div className="flex-1 relative h-16 flex items-center justify-center">
                <div
                  className={`w-full h-8 bg-brand-blue/10 border-y border-brand-blue/30 relative overflow-hidden ${
                    animating ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  {animating &&
                    Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-brand-blue rounded-full"
                        style={{
                          top: `${(i * 17) % 80}%`,
                          left: '-10%',
                          animation: 'slideIn 0.8s linear infinite',
                          animationDelay: `${(i % 10) * 0.05}s`,
                        }}
                      />
                    ))}
                </div>
                <div className="absolute font-bold text-brand-blue text-xs uppercase tracking-widest bg-gray-900 px-2 rounded-full">
                  TB/s Highway
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-xl border border-gray-600 flex flex-col items-center w-24 shrink-0">
                <Cpu className="w-8 h-8 text-brand-green mb-2" />
                <span className="text-[10px] text-gray-300 text-center">
                  Compute
                  <br />
                  Cores
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={triggerAnimation}
          disabled={animating}
          className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-medium text-sm"
        >
          Simulate Hardware Action
        </button>
      </div>
    </div>
  );
}

/** Software stack with code viewer */
export function SoftwareStackVisualizer() {
  const [activeLayer, setActiveLayer] = useState(0);

  const layers = [
    {
      id: 0,
      title: 'Deep Learning Framework',
      tech: 'PyTorch / TensorFlow',
      color: 'text-brand-orange border-brand-orange bg-brand-orange',
      code: 'import torch\nimport torch.nn.functional as F\n\n# High-level Python\noutput = F.conv2d(image, weights)',
    },
    {
      id: 1,
      title: 'Optimized Libraries',
      tech: 'cuDNN / cuBLAS',
      color: 'text-brand-rose border-brand-rose bg-brand-rose',
      code: '// C++ Primitives\ncudnnConvolutionForward(\n    handle,\n    &alpha, inputDesc, inputData,\n    filterDesc, filterData,\n    convDesc, algo, workspace,\n    workspaceSize, &beta,\n    outputDesc, outputData\n);',
    },
    {
      id: 2,
      title: 'Parallel Computing Platform',
      tech: 'CUDA',
      color: 'text-brand-green border-brand-green bg-brand-green',
      code: '// Low-level GPU Kernel\n__global__ void convKernel(float* out, float* in) {\n    int tx = threadIdx.x;\n    int ty = threadIdx.y;\n    // Direct memory addressing and math\n}',
    },
    {
      id: 3,
      title: 'Hardware Execution',
      tech: 'NVIDIA GPU',
      color: 'text-gray-400 border-gray-500 bg-gray-500',
      code: '01001010 11010011 00000001 01111111\n\nAllocating Blocks to Streaming Multiprocessors (SMs)\nDispatching Warps (32 threads)\nExecuting on ALU / Tensor Cores...',
    },
  ];

  const active = layers[activeLayer];
  const borderColor = active.color.split(' ')[1];
  const textColor = active.color.split(' ')[0];

  return (
    <div className="flex flex-col md:flex-row w-full h-full p-4 gap-6 overflow-auto custom-scroll">
      <div className="w-full md:w-1/2 flex flex-col justify-center gap-2">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-white">The Software Abstraction</h3>
          <p className="text-gray-400 text-xs">Bridging Python to Silicon</p>
        </div>

        {layers.map((layer, idx) => {
          const isActive = activeLayer === idx;
          const lc = layer.color.split(' ');
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayer(idx)}
              className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-300 relative text-left ${
                isActive
                  ? `${lc[1]} bg-opacity-10 scale-105 shadow-lg`
                  : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
              }`}
            >
              <div className={`font-bold text-sm mb-1 ${isActive ? lc[0] : 'text-gray-300'}`}>
                {layer.title}
              </div>
              <div className="text-xs text-gray-500 font-mono">{layer.tech}</div>
              {isActive && (
                <div
                  className={`hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rotate-45 border-t-2 border-r-2 ${lc[1]} bg-gray-900`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="w-full md:w-1/2 flex flex-col md:pt-[72px]">
        <div
          className={`flex-1 rounded-xl border-2 bg-gray-950 p-4 font-mono text-[11px] overflow-hidden transition-colors duration-300 min-h-[220px] ${borderColor}`}
        >
          <div className="flex gap-2 mb-3 border-b border-gray-800 pb-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-gray-500">Execution context</span>
          </div>
          <pre className={`whitespace-pre-wrap leading-relaxed ${textColor === 'text-gray-400' ? 'text-gray-300' : 'text-gray-300'}`}>
            {active.code}
          </pre>
        </div>
      </div>
    </div>
  );
}
