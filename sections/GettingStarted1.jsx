import React from 'react';
import { Layers, FolderPlus, ArrowRight } from 'lucide-react';
import Slideshow from '../components/Slideshow';

export const meta = {
  title: 'Getting Started',
  subtitle: 'How to add ML Architecture slide topics',
};

const WelcomeSlide = () => (
  <div className="h-full bg-[#0f172a] text-slate-100 p-8 md:p-12 flex flex-col justify-center">
    <div className="flex items-center gap-3 mb-6 text-blue-400">
      <Layers className="w-8 h-8" />
      <span className="text-sm font-semibold tracking-widest uppercase">ML Architecture</span>
    </div>
    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
      Build slide decks by topic
    </h1>
    <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
      Drop a new <code className="text-blue-300">.jsx</code> file into{' '}
      <code className="text-blue-300">sections/</code>. Vite picks it up automatically —
      no App.jsx changes needed.
    </p>
  </div>
);

const HowToSlide = () => (
  <div className="h-full bg-[#0f172a] text-slate-100 p-8 md:p-12 overflow-y-auto">
    <div className="flex items-center gap-2 mb-6 text-blue-400">
      <FolderPlus className="w-6 h-6" />
      <h2 className="text-2xl font-bold">Add a topic</h2>
    </div>
    <ol className="space-y-5 text-slate-300 max-w-2xl">
      <li className="flex gap-3">
        <span className="shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
          1
        </span>
        <span>
          Create <code className="text-blue-300">sections/YourTopicNameN.jsx</code> —
          trailing number <code className="text-blue-300">N</code> sets order.
        </span>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
          2
        </span>
        <span>
          Export <code className="text-blue-300">meta</code>, define slide components, and
          default-export a <code className="text-blue-300">&lt;Slideshow /&gt;</code>.
        </span>
      </li>
      <li className="flex gap-3">
        <span className="shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
          3
        </span>
        <span>
          Use arrow keys or the bottom dots to move between slides; top bar switches topics.
        </span>
      </li>
    </ol>
    <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
      <ArrowRight className="w-4 h-4" />
      Replace this starter section when you add real content.
    </div>
  </div>
);

export default function GettingStarted() {
  return (
    <Slideshow
      theme="dark"
      slides={[
        { component: WelcomeSlide, title: 'Welcome' },
        { component: HowToSlide, title: 'How to add topics' },
      ]}
    />
  );
}
