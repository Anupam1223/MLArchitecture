import React, { useState, useEffect } from 'react';
import {
  Database,
  Cloud,
  Key,
  Server,
  Globe,
  Lock,
  Unlock,
  ArrowDown,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Zap,
  HardDrive,
  Network,
  Box,
} from 'lucide-react';

/* ── shared ───────────────────────────────────────────────────────────────── */

function Tabs({ options, value, onChange, accent = 'bg-brand-blue' }) {
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

/* ── 1. Object storage anatomy + valet analogy ────────────────────────────── */

const OBJECTS = [
  {
    id: 'cat',
    name: 'cat_image.jpg',
    data: 'JPEG binary · 2.4 MB',
    meta: { 'content-type': 'image/jpeg', source: 'sensor-123', split: 'train' },
    oid: 'obj_7f3a9c…e21',
  },
  {
    id: 'parquet',
    name: 'training_data_part1.parquet',
    data: 'Columnar table · 480 MB',
    meta: { 'content-type': 'application/parquet', rows: '1.2M', version: 'v1' },
    oid: 'obj_b91d02…a44',
  },
  {
    id: 'config',
    name: 'config/hyperparams.json',
    data: 'JSON config · 4 KB',
    meta: { 'content-type': 'application/json', lr: '3e-4', epochs: '12' },
    oid: 'obj_c0ee15…9f8',
  },
];

export function ObjectStorageAnatomyVisualizer() {
  const [sel, setSel] = useState('cat');
  const [valet, setValet] = useState(false);
  const obj = OBJECTS.find((o) => o.id === sel);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Objects in a Flat Address Space</h3>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Hand over the data, get a ticket back — you never need the physical shelf location.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full space-y-3">
        <div className="rounded-xl border border-gray-600 bg-white text-gray-900 px-4 py-2 text-center text-sm font-bold">
          Cloud Account
        </div>
        <div className="flex justify-center text-[10px] text-gray-500 uppercase tracking-wide">contains ↓</div>
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-100 text-amber-950 px-4 py-3 text-center">
          <Database className="w-5 h-5 mx-auto mb-1" />
          <div className="font-bold text-sm">my-ml-dataset-bucket</div>
          <div className="text-[10px] opacity-70">Globally unique namespace</div>
        </div>
        <div className="flex justify-center text-[10px] text-gray-500 uppercase tracking-wide">contains ↓</div>

        <div className="grid grid-cols-3 gap-2">
          {OBJECTS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setSel(o.id);
                setValet(false);
              }}
              className={`rounded-xl border p-2 text-left transition ${
                sel === o.id
                  ? 'border-sky-400 bg-sky-500/20 text-white'
                  : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500'
              }`}
            >
              <Box className="w-3.5 h-3.5 mb-1 text-sky-400" />
              <div className="text-[10px] font-mono leading-tight break-all">{o.name}</div>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-700 bg-gray-900/80 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-white font-mono truncate">{obj.name}</div>
            <button
              type="button"
              onClick={() => setValet(!valet)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                valet ? 'bg-brand-orange text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {valet ? 'Show internals' : 'Valet ticket'}
            </button>
          </div>

          {valet ? (
            <div className="flex items-center gap-3 justify-center py-4">
              <div className="rounded-xl border border-dashed border-gray-600 px-4 py-3 text-center opacity-40">
                <HardDrive className="w-6 h-6 mx-auto mb-1" />
                <div className="text-[10px] text-gray-400">Physical disk?</div>
                <div className="text-xs text-gray-500">You don&apos;t care</div>
              </div>
              <ArrowRight className="w-5 h-5 text-brand-orange" />
              <div className="rounded-xl border-2 border-brand-orange bg-brand-orange/10 px-4 py-3 text-center">
                <Key className="w-6 h-6 mx-auto mb-1 text-brand-orange" />
                <div className="text-[10px] text-gray-400">Your ticket</div>
                <div className="text-xs font-mono text-brand-orange">{obj.oid}</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-gray-800/80 p-2">
                <div className="text-[10px] text-sky-400 font-bold uppercase mb-1">Data</div>
                <div className="text-xs text-gray-300">{obj.data}</div>
              </div>
              <div className="rounded-lg bg-gray-800/80 p-2">
                <div className="text-[10px] text-violet-400 font-bold uppercase mb-1">Metadata</div>
                {Object.entries(obj.meta).map(([k, v]) => (
                  <div key={k} className="text-[10px] font-mono text-gray-400">
                    {k}: <span className="text-white">{v}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-gray-800/80 p-2">
                <div className="text-[10px] text-brand-orange font-bold uppercase mb-1">Unique ID</div>
                <div className="text-xs font-mono text-brand-orange break-all">{obj.oid}</div>
                <div className="text-[10px] text-gray-500 mt-1">GET / PUT via API</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 2. Major providers + durability ──────────────────────────────────────── */

const PROVIDERS = [
  {
    id: 'aws',
    name: 'AWS S3',
    container: 'Bucket',
    unit: 'Object',
    scope: 'Global (buckets)',
    sdk: 'Boto3',
    tone: 'border-sky-400 bg-sky-500/10',
  },
  {
    id: 'gcp',
    name: 'GCP Cloud Storage',
    container: 'Bucket',
    unit: 'Object',
    scope: 'Global (buckets)',
    sdk: 'google-cloud-storage',
    tone: 'border-emerald-400 bg-emerald-500/10',
  },
  {
    id: 'azure',
    name: 'Azure Blob Storage',
    container: 'Container',
    unit: 'Blob (Block Blob)',
    scope: 'Account (containers)',
    sdk: 'azure-storage-blob',
    tone: 'border-violet-400 bg-violet-500/10',
  },
];

export function ObjectProvidersVisualizer() {
  const [prov, setProv] = useState('aws');
  const [replicated, setReplicated] = useState(false);
  const p = PROVIDERS.find((x) => x.id === prov);

  useEffect(() => {
    setReplicated(false);
    const t = setTimeout(() => setReplicated(true), 600);
    return () => clearTimeout(t);
  }, [prov]);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Same Idea, Different Names</h3>
        <p className="text-gray-400 text-sm">Tap a provider — then watch durability across AZs.</p>
      </div>

      <Tabs
        options={PROVIDERS.map((x) => ({ id: x.id, label: x.id.toUpperCase() }))}
        value={prov}
        onChange={setProv}
        accent="bg-sky-600"
      />

      <div className={`max-w-md mx-auto w-full rounded-2xl border p-4 mb-4 ${p.tone}`}>
        <div className="text-white font-bold mb-3">{p.name}</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            ['Storage container', p.container],
            ['Unit of data', p.unit],
            ['Uniqueness scope', p.scope],
            ['Primary SDK', p.sdk],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-black/30 p-2">
              <div className="text-gray-400 text-[10px] uppercase">{k}</div>
              <div className="text-white font-mono text-xs mt-0.5">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto w-full rounded-2xl border border-gray-700 bg-gray-900/80 p-4">
        <div className="text-xs font-bold text-gray-400 uppercase mb-3 text-center">
          Region · multi-AZ replication
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[1, 2, 3].map((az) => (
            <div
              key={az}
              className={`rounded-xl border p-3 text-center transition-all duration-500 ${
                replicated
                  ? 'border-emerald-400/60 bg-emerald-500/10'
                  : 'border-gray-700 bg-gray-800'
              }`}
            >
              <div className="text-[10px] text-gray-500 mb-1">AZ {az}</div>
              <HardDrive
                className={`w-5 h-5 mx-auto ${replicated ? 'text-emerald-400' : 'text-gray-600'}`}
              />
              {replicated && (
                <div className="text-[9px] text-emerald-300 mt-1 font-mono">copy ✓</div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-gray-400">
          Upload once → replicas across data centers. Hardware failure ≠ data loss.
        </p>
      </div>
    </div>
  );
}

/* ── 3. Integrating object storage with AI workloads ──────────────────────── */

export function ObjectIntegrationVisualizer() {
  const [tab, setTab] = useState('org');
  const [iamOn, setIamOn] = useState(true);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Stream Directly from the Lake</h3>
        <p className="text-gray-400 text-sm">No local copy required — but structure, format, and IAM matter.</p>
      </div>

      <Tabs
        options={[
          { id: 'org', label: 'Prefixes' },
          { id: 'perf', label: 'Performance' },
          { id: 'egress', label: 'Egress & IAM' },
        ]}
        value={tab}
        onChange={setTab}
        accent="bg-violet-600"
      />

      <div className="max-w-xl mx-auto w-full">
        {tab === 'org' && (
          <div className="rounded-2xl border border-gray-700 bg-gray-900/80 p-4 font-mono text-xs space-y-1">
            <div className="text-sky-300">s3://my-bucket/</div>
            <div className="pl-3 text-gray-400">└── dataset-v1/</div>
            <div className="pl-6 text-emerald-300">├── train/</div>
            <div className="pl-9 text-white">│   └── image-001.jpg</div>
            <div className="pl-6 text-amber-300">└── test/</div>
            <div className="pl-9 text-white">    └── image-555.jpg</div>
            <p className="text-gray-500 pt-3 font-sans text-xs leading-relaxed">
              Flat keys, folder illusion via <strong className="text-white">prefixes</strong> — enables
              organization and granular access control.
            </p>
          </div>
        )}

        {tab === 'perf' && (
          <div className="space-y-3">
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3">
              <div className="text-[10px] font-bold text-rose-300 uppercase mb-2">Millions of tiny files</div>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-sm bg-rose-400/50 animate-pulse" style={{ animationDelay: `${i * 40}ms` }} />
                ))}
              </div>
              <p className="text-xs text-rose-100/80 mt-2">High API overhead → slow reads</p>
            </div>
            <div className="text-center text-gray-500 text-xs">vs</div>
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
              <div className="text-[10px] font-bold text-emerald-300 uppercase mb-2">
                Consolidated · Parquet / TFRecord / Petastorm
              </div>
              <div className="h-8 rounded-lg bg-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-100">
                one large columnar block → parallel reads
              </div>
            </div>
          </div>
        )}

        {tab === 'egress' && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-center">
                <ArrowDown className="w-4 h-4 mx-auto text-emerald-400 rotate-180" />
                <div className="text-xs text-emerald-300 font-bold mt-1">Ingress</div>
                <div className="text-[10px] text-gray-400">Usually free</div>
              </div>
              <Cloud className="w-8 h-8 text-sky-400" />
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-center">
                <ArrowDown className="w-4 h-4 mx-auto text-rose-400" />
                <div className="text-xs text-rose-300 font-bold mt-1">Egress</div>
                <div className="text-[10px] text-gray-400">$ to internet / other cloud</div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-700 bg-gray-900 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {iamOn ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-rose-400" />}
                <span className="text-sm text-white">IAM policy → instance can read bucket</span>
              </div>
              <button
                type="button"
                onClick={() => setIamOn(!iamOn)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  iamOn ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {iamOn ? 'Allow' : 'Deny'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 4. Storage tiers + lifecycle ─────────────────────────────────────────── */

const TIERS = [
  {
    id: 'hot',
    name: 'Standard / Hot',
    cost: 10,
    retrieve: 1,
    retrieveLabel: 'Milliseconds',
    use: 'Active training & validation datasets',
    color: 'bg-sky-500',
  },
  {
    id: 'ia',
    name: 'Infrequent Access',
    cost: 4,
    retrieve: 4,
    retrieveLabel: 'Milliseconds + fee',
    use: 'Older datasets, model checkpoints',
    color: 'bg-amber-500',
  },
  {
    id: 'cold',
    name: 'Archive / Cold',
    cost: 1,
    retrieve: 11,
    retrieveLabel: 'Minutes to hours',
    use: 'Raw backups, long-term retention',
    color: 'bg-violet-500',
  },
];

export function StorageTiersVisualizer() {
  const [tier, setTier] = useState('hot');
  const [day, setDay] = useState(0);
  const t = TIERS.find((x) => x.id === tier);

  const lifecycleTier =
    day < 60 ? 'hot' : day < 365 ? 'ia' : 'cold';
  const lc = TIERS.find((x) => x.id === lifecycleTier);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Cost vs Retrieval Speed</h3>
        <p className="text-gray-400 text-sm">Match access patterns to tiers — automate with lifecycle policies.</p>
      </div>

      <Tabs
        options={TIERS.map((x) => ({ id: x.id, label: x.name.split(' / ')[0] }))}
        value={tier}
        onChange={setTier}
        accent="bg-sky-600"
      />

      <div className="max-w-md mx-auto w-full space-y-4">
        <div className="rounded-2xl border border-gray-700 bg-white p-4">
          <div className="flex items-end justify-around h-36 gap-4">
            {TIERS.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setTier(x.id)}
                className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
              >
                <div className="flex items-end gap-1 h-28 w-full justify-center">
                  <div
                    className={`w-5 rounded-t transition-all ${tier === x.id ? 'bg-sky-600' : 'bg-sky-300'}`}
                    style={{ height: `${(x.cost / 12) * 100}%` }}
                    title="Storage cost"
                  />
                  <div
                    className={`w-5 rounded-t transition-all ${tier === x.id ? 'bg-orange-500' : 'bg-orange-300'}`}
                    style={{ height: `${(x.retrieve / 12) * 100}%` }}
                    title="Retrieval time"
                  />
                </div>
                <div className={`text-[9px] font-bold ${tier === x.id ? 'text-gray-900' : 'text-gray-500'}`}>
                  {x.name.split(' / ')[0]}
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-2 text-[10px] text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" /> Storage cost
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" /> Retrieval time
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-3 text-sm">
          <div className="text-white font-bold">{t.name}</div>
          <div className="text-xs text-gray-400 mt-1">
            Retrieval: <span className="text-brand-orange">{t.retrieveLabel}</span>
          </div>
          <div className="text-xs text-gray-300 mt-1">{t.use}</div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-3">
          <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">
            Lifecycle policy · day {day}
          </div>
          <input
            type="range"
            min={0}
            max={400}
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="w-full accent-violet-500 mb-2"
          />
          <div className="flex justify-between text-[10px] text-gray-500 mb-2">
            <span>0d · Hot</span>
            <span>60d · IA</span>
            <span>365d · Archive</span>
          </div>
          <div className={`rounded-lg px-3 py-2 text-center text-xs font-bold text-white ${lc.color}`}>
            Object now in: {lc.name}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 5. VPC / subnets / route tables ──────────────────────────────────────── */

export function VpcAnatomyVisualizer() {
  const [focus, setFocus] = useState('public');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Your Private Slice of the Cloud</h3>
        <p className="text-gray-400 text-sm">
          VPC <span className="font-mono text-brand-orange">10.0.0.0/16</span> → public &amp; private
          subnets + route tables.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'public', label: 'Public subnet' },
          { id: 'private', label: 'Private subnet' },
          { id: 'routes', label: 'Route tables' },
        ]}
        value={focus}
        onChange={setFocus}
        accent="bg-emerald-600"
      />

      <div className="max-w-xl mx-auto w-full rounded-2xl border-2 border-sky-500/40 bg-sky-950/30 p-3 relative">
        <div className="text-[10px] font-bold text-sky-300 uppercase mb-2 flex items-center gap-1">
          <Cloud className="w-3 h-3" /> VPC · 10.0.0.0/16
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div
            className={`rounded-xl border p-3 transition ${
              focus === 'public'
                ? 'border-emerald-400 bg-emerald-500/15'
                : 'border-gray-700 bg-gray-900/60'
            }`}
          >
            <div className="text-[10px] font-bold text-emerald-300 uppercase mb-2">Public</div>
            <div className="rounded-lg bg-violet-500/20 border border-violet-400/40 px-2 py-1.5 text-[10px] text-violet-200 mb-1">
              Bastion / NAT / IGW path
            </div>
            <div className="text-[9px] text-gray-500">Public IPs · two-way internet</div>
          </div>
          <div
            className={`rounded-xl border p-3 transition ${
              focus === 'private'
                ? 'border-rose-400 bg-rose-500/15'
                : 'border-gray-700 bg-gray-900/60'
            }`}
          >
            <div className="text-[10px] font-bold text-rose-300 uppercase mb-2">Private</div>
            <div className="rounded-lg bg-rose-500/20 border border-rose-400/40 px-2 py-1.5 text-[10px] text-rose-200 mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3" /> GPU training
            </div>
            <div className="text-[9px] text-gray-500">No public IP · outbound via NAT</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="rounded-lg border border-red-400/50 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold text-red-200">
            Internet Gateway
          </div>
          <Globe className="w-4 h-4 text-sky-400" />
        </div>

        {focus === 'public' && (
          <p className="text-xs text-center text-gray-300 bg-gray-900/80 rounded-lg p-2">
            Attached <strong className="text-white">IGW</strong> → resources can talk both ways with
            the internet.
          </p>
        )}
        {focus === 'private' && (
          <p className="text-xs text-center text-gray-300 bg-gray-900/80 rounded-lg p-2">
            Outbound only through a <strong className="text-white">NAT Gateway</strong> in the public
            subnet — internet cannot initiate inbound connections. One-way street.
          </p>
        )}
        {focus === 'routes' && (
          <div className="rounded-lg bg-gray-900/80 p-2 font-mono text-[10px] space-y-1">
            <div className="text-gray-400">
              10.0.0.0/16 → <span className="text-emerald-300">local</span> (all subnets)
            </div>
            <div className="text-gray-400">
              Public 0.0.0.0/0 → <span className="text-sky-300">Internet Gateway</span>
            </div>
            <div className="text-gray-400">
              Private 0.0.0.0/0 → <span className="text-violet-300">NAT Gateway</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 6. Security Groups vs NACLs ──────────────────────────────────────────── */

export function PerimeterSecurityVisualizer() {
  const [mode, setMode] = useState('sg');
  const [inboundOk, setInboundOk] = useState(true);
  const [naclOut, setNaclOut] = useState(false);

  const sgReturn = inboundOk; // stateful: return free
  const naclReturn = inboundOk && naclOut; // stateless: need both

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Stateful vs Stateless Firewalls</h3>
        <p className="text-gray-400 text-sm">Security Groups at the instance · NACLs at the subnet.</p>
      </div>

      <Tabs
        options={[
          { id: 'sg', label: 'Security Group' },
          { id: 'nacl', label: 'NACL' },
        ]}
        value={mode}
        onChange={setMode}
        accent="bg-rose-600"
      />

      <div className="max-w-md mx-auto w-full space-y-3">
        <div className="rounded-2xl border-2 border-dashed border-amber-500/40 p-3">
          <div className="text-[10px] font-bold text-amber-300 uppercase mb-2">
            Subnet {mode === 'nacl' ? '· NACL checkpoint' : ''}
          </div>
          <div className="rounded-xl border border-sky-500/40 bg-sky-950/40 p-3">
            <div className="text-[10px] font-bold text-sky-300 uppercase mb-2 flex items-center gap-1">
              <Server className="w-3 h-3" /> GPU instance · SG
            </div>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setInboundOk(!inboundOk)}
                className={`flex-1 rounded-lg text-[10px] font-bold py-2 ${
                  inboundOk ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                Inbound :22 / :8888 {inboundOk ? 'ALLOW' : 'DENY'}
              </button>
            </div>
            {mode === 'nacl' && (
              <button
                type="button"
                onClick={() => setNaclOut(!naclOut)}
                className={`w-full rounded-lg text-[10px] font-bold py-2 mb-2 ${
                  naclOut ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                NACL outbound ephemeral 1024–65535: {naclOut ? 'ALLOW' : 'missing'}
              </button>
            )}
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400">Request in →</span>
              {(mode === 'sg' ? sgReturn : naclReturn) ? (
                <span className="text-emerald-300 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Response out OK
                </span>
              ) : (
                <span className="text-rose-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Response blocked
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-3 text-xs text-gray-300 space-y-1.5">
          {mode === 'sg' ? (
            <>
              <p>
                <strong className="text-white">Stateful:</strong> allow inbound → matching outbound
                is automatic.
              </p>
              <p className="text-gray-500">
                Default: deny all in, allow all out. Lock SSH/Jupyter to bastion or corp IPs.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong className="text-white">Stateless:</strong> you must write both directions
                explicitly (incl. ephemeral ports).
              </p>
              <p className="text-gray-500">
                Most AI setups: meticulous SGs, leave NACLs at default allow-all.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 7. Reference architecture walkthrough ────────────────────────────────── */

const ARCH_STEPS = [
  {
    id: 1,
    title: 'Access',
    detail: 'Engineer SSHs (port 22) to the Bastion Host — the only public entry point.',
    nodes: ['engineer', 'bastion'],
  },
  {
    id: 2,
    title: 'Development',
    detail: 'From the bastion, SSH into GPU Training Instance(s) in the private subnet.',
    nodes: ['bastion', 'gpu'],
  },
  {
    id: 3,
    title: 'Outbound',
    detail: 'GPU pulls packages/models via NAT Gateway → Internet Gateway → Internet.',
    nodes: ['gpu', 'nat', 'igw', 'internet'],
  },
  {
    id: 4,
    title: 'Data Access',
    detail: 'GPU reads training data through a VPC Endpoint to Object Storage (private path).',
    nodes: ['gpu', 'endpoint', 'storage'],
  },
  {
    id: 5,
    title: 'Deployment',
    detail: 'CPU Inference Endpoint loads the final model via the same VPC Endpoint.',
    nodes: ['infer', 'endpoint', 'storage'],
  },
];

const GLOW = '#22d3ee'; // bright cyan for active arrows
const DIM = '#94a3b8';

export function ReferenceArchVisualizer() {
  const [step, setStep] = useState(1);
  const s = ARCH_STEPS.find((x) => x.id === step);

  const on = (n) => (step === n ? GLOW : DIM);
  const onW = (n) => (step === n ? 2.8 : 1.2);
  const dash = (n) => (step === n ? '6 3' : '4 3');
  const nodeOn = (id) => s.nodes.includes(id);

  return (
    <div className="flex flex-col w-full h-full p-3 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-lg font-semibold text-white mb-0.5">A Reference Architecture for AI Workloads</h3>
        <p className="text-gray-400 text-xs">
          Step through paths 1–5 — bright arrows light up in sequence.
        </p>
      </div>

      <div className="flex justify-center gap-1 mb-2 flex-wrap">
        {ARCH_STEPS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setStep(x.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
              step === x.id
                ? 'bg-cyan-500 text-gray-950 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {x.id}. {x.title}
          </button>
        ))}
      </div>

      {/* Diagram card matching source figure */}
      <div className="max-w-2xl mx-auto w-full rounded-xl bg-white border border-gray-300 p-3 relative shadow-lg">
        <svg viewBox="0 0 560 420" className="w-full h-auto" role="img" aria-label="AI reference architecture">
          {/* External Services box */}
          <rect x="40" y="290" width="480" height="118" rx="10" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5" />
          <text x="56" y="308" fontSize="11" fill="#166534" fontWeight="700">
            External Services
          </text>

          {/* --- Nodes (HTML-like via foreignObject would be heavy; use SVG shapes) --- */}

          {/* ML Engineer */}
          <ellipse
            cx="280"
            cy="28"
            rx="70"
            ry="18"
            fill={nodeOn('engineer') ? '#fde047' : '#fef08a'}
            stroke={nodeOn('engineer') ? GLOW : '#ca8a04'}
            strokeWidth={nodeOn('engineer') ? 2.5 : 1.2}
          />
          <text x="280" y="32" textAnchor="middle" fontSize="12" fontWeight="700" fill="#422006">
            ML Engineer
          </text>

          {/* Bastion Host */}
          <rect
            x="200"
            y="78"
            width="160"
            height="36"
            rx="8"
            fill={nodeOn('bastion') ? '#c4b5fd' : '#ddd6fe'}
            stroke={nodeOn('bastion') ? GLOW : '#7c3aed'}
            strokeWidth={nodeOn('bastion') ? 2.5 : 1.2}
          />
          <text x="280" y="100" textAnchor="middle" fontSize="12" fontWeight="700" fill="#4c1d95">
            Bastion Host
          </text>

          {/* Internet Gateway */}
          <rect
            x="48"
            y="150"
            width="100"
            height="40"
            rx="6"
            fill={nodeOn('igw') ? '#fca5a5' : '#fecaca'}
            stroke={nodeOn('igw') ? GLOW : '#dc2626'}
            strokeWidth={nodeOn('igw') ? 2.5 : 1.2}
          />
          <text x="98" y="168" textAnchor="middle" fontSize="10" fontWeight="700" fill="#7f1d1d">
            Internet
          </text>
          <text x="98" y="180" textAnchor="middle" fontSize="10" fontWeight="700" fill="#7f1d1d">
            Gateway
          </text>

          {/* NAT Gateway */}
          <rect
            x="412"
            y="118"
            width="100"
            height="40"
            rx="6"
            fill={nodeOn('nat') ? '#fda4af' : '#fecdd3'}
            stroke={nodeOn('nat') ? GLOW : '#e11d48'}
            strokeWidth={nodeOn('nat') ? 2.5 : 1.2}
          />
          <text x="462" y="136" textAnchor="middle" fontSize="10" fontWeight="700" fill="#881337">
            NAT
          </text>
          <text x="462" y="148" textAnchor="middle" fontSize="10" fontWeight="700" fill="#881337">
            Gateway
          </text>

          {/* CPU Inference */}
          <rect
            x="100"
            y="210"
            width="150"
            height="40"
            rx="8"
            fill={nodeOn('infer') ? '#f9a8d4' : '#fbcfe8'}
            stroke={nodeOn('infer') ? GLOW : '#db2777'}
            strokeWidth={nodeOn('infer') ? 2.5 : 1.2}
          />
          <text x="175" y="228" textAnchor="middle" fontSize="10" fontWeight="700" fill="#831843">
            CPU Inference
          </text>
          <text x="175" y="240" textAnchor="middle" fontSize="10" fontWeight="700" fill="#831843">
            Endpoint
          </text>

          {/* GPU Training */}
          <rect
            x="310"
            y="210"
            width="150"
            height="40"
            rx="8"
            fill={nodeOn('gpu') ? '#f9a8d4' : '#fbcfe8'}
            stroke={nodeOn('gpu') ? GLOW : '#db2777'}
            strokeWidth={nodeOn('gpu') ? 2.5 : 1.2}
          />
          <text x="385" y="228" textAnchor="middle" fontSize="10" fontWeight="700" fill="#831843">
            GPU Training
          </text>
          <text x="385" y="240" textAnchor="middle" fontSize="10" fontWeight="700" fill="#831843">
            Instance(s)
          </text>

          {/* Internet oval */}
          <ellipse
            cx="120"
            cy="350"
            rx="48"
            ry="18"
            fill={nodeOn('internet') ? '#cbd5e1' : '#e2e8f0'}
            stroke={nodeOn('internet') ? GLOW : '#64748b'}
            strokeWidth={nodeOn('internet') ? 2.5 : 1.2}
          />
          <text x="120" y="354" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">
            Internet
          </text>

          {/* VPC Endpoint */}
          <rect
            x="220"
            y="332"
            width="120"
            height="36"
            rx="18"
            fill={nodeOn('endpoint') ? '#67e8f9' : '#a5f3fc'}
            stroke={nodeOn('endpoint') ? GLOW : '#0891b2'}
            strokeWidth={nodeOn('endpoint') ? 2.5 : 1.2}
          />
          <text x="280" y="354" textAnchor="middle" fontSize="11" fontWeight="700" fill="#164e63">
            VPC Endpoint
          </text>

          {/* Object Storage */}
          <rect
            x="380"
            y="332"
            width="120"
            height="36"
            rx="8"
            fill={nodeOn('storage') ? '#fdba74' : '#fed7aa'}
            stroke={nodeOn('storage') ? GLOW : '#ea580c'}
            strokeWidth={nodeOn('storage') ? 2.5 : 1.2}
          />
          <text x="440" y="348" textAnchor="middle" fontSize="9" fontWeight="700" fill="#7c2d12">
            Object Storage
          </text>
          <text x="440" y="360" textAnchor="middle" fontSize="9" fontWeight="700" fill="#7c2d12">
            (S3 / GCS)
          </text>

          {/* Marker defs for arrowheads */}
          <defs>
            <marker id="arrowDim" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={DIM} />
            </marker>
            <marker id="arrowGlow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={GLOW} />
            </marker>
          </defs>

          {/* Step 1: Engineer → Bastion */}
          <line
            x1="280"
            y1="46"
            x2="280"
            y2="76"
            stroke={on(1)}
            strokeWidth={onW(1)}
            markerEnd={step === 1 ? 'url(#arrowGlow)' : 'url(#arrowDim)'}
            style={{ filter: step === 1 ? 'drop-shadow(0 0 4px #22d3ee)' : undefined }}
          />
          <text
            x="300"
            y="64"
            fontSize="10"
            fontWeight={step === 1 ? 700 : 500}
            fill={on(1)}
          >
            1. SSH (Port 22)
          </text>

          {/* Step 2: Bastion → GPU */}
          <path
            d="M280 114 L280 160 L385 160 L385 208"
            fill="none"
            stroke={on(2)}
            strokeWidth={onW(2)}
            markerEnd={step === 2 ? 'url(#arrowGlow)' : 'url(#arrowDim)'}
            style={{ filter: step === 2 ? 'drop-shadow(0 0 4px #22d3ee)' : undefined }}
          />
          <text
            x="300"
            y="152"
            fontSize="10"
            fontWeight={step === 2 ? 700 : 500}
            fill={on(2)}
          >
            2. SSH (Port 22)
          </text>

          {/* Step 3: GPU → NAT → IGW → Internet (dashed) */}
          <path
            d="M460 210 L462 160"
            fill="none"
            stroke={on(3)}
            strokeWidth={onW(3)}
            strokeDasharray={dash(3)}
            markerEnd={step === 3 ? 'url(#arrowGlow)' : 'url(#arrowDim)'}
            style={{ filter: step === 3 ? 'drop-shadow(0 0 4px #22d3ee)' : undefined }}
          />
          <path
            d="M412 138 L148 160"
            fill="none"
            stroke={on(3)}
            strokeWidth={onW(3)}
            strokeDasharray={dash(3)}
            style={{ filter: step === 3 ? 'drop-shadow(0 0 4px #22d3ee)' : undefined }}
          />
          <path
            d="M98 190 L98 280 L120 280 L120 330"
            fill="none"
            stroke={on(3)}
            strokeWidth={onW(3)}
            strokeDasharray={dash(3)}
            markerEnd={step === 3 ? 'url(#arrowGlow)' : 'url(#arrowDim)'}
            style={{ filter: step === 3 ? 'drop-shadow(0 0 4px #22d3ee)' : undefined }}
          />
          <text
            x="470"
            y="190"
            fontSize="9"
            fontWeight={step === 3 ? 700 : 500}
            fill={on(3)}
          >
            3. Download packages/
          </text>
          <text
            x="470"
            y="202"
            fontSize="9"
            fontWeight={step === 3 ? 700 : 500}
            fill={on(3)}
          >
            models (e.g. PyPI)
          </text>
          <text x="108" y="270" fontSize="9" fill={on(3)} fontWeight={step === 3 ? 700 : 500}>
            Internet Access
          </text>

          {/* Step 4: GPU → VPC Endpoint */}
          <path
            d="M385 250 L385 300 L280 300 L280 330"
            fill="none"
            stroke={on(4)}
            strokeWidth={onW(4)}
            markerEnd={step === 4 ? 'url(#arrowGlow)' : 'url(#arrowDim)'}
            style={{ filter: step === 4 ? 'drop-shadow(0 0 4px #22d3ee)' : undefined }}
          />
          <text
            x="300"
            y="292"
            fontSize="10"
            fontWeight={step === 4 ? 700 : 500}
            fill={on(4)}
          >
            4. Access Training Data
          </text>

          {/* Step 5: CPU Inference → VPC Endpoint */}
          <path
            d="M175 250 L175 310 L220 310 L220 340"
            fill="none"
            stroke={on(5)}
            strokeWidth={onW(5)}
            markerEnd={step === 5 ? 'url(#arrowGlow)' : 'url(#arrowDim)'}
            style={{ filter: step === 5 ? 'drop-shadow(0 0 4px #22d3ee)' : undefined }}
          />
          <text
            x="60"
            y="300"
            fontSize="10"
            fontWeight={step === 5 ? 700 : 500}
            fill={on(5)}
          >
            5. Load Final Model
          </text>

          {/* VPC Endpoint → Object Storage (always shown; bright on 4 or 5) */}
          <line
            x1="340"
            y1="350"
            x2="378"
            y2="350"
            stroke={step === 4 || step === 5 ? GLOW : DIM}
            strokeWidth={step === 4 || step === 5 ? 2.8 : 1.2}
            markerEnd={step === 4 || step === 5 ? 'url(#arrowGlow)' : 'url(#arrowDim)'}
            style={{
              filter: step === 4 || step === 5 ? 'drop-shadow(0 0 4px #22d3ee)' : undefined,
            }}
          />
        </svg>
      </div>

      <p className="max-w-2xl mx-auto mt-2 text-xs text-center text-gray-300 bg-gray-900/80 rounded-lg p-2 border border-cyan-500/30">
        <strong className="text-cyan-300">
          {s.id}. {s.title}:
        </strong>{' '}
        {s.detail}
      </p>
    </div>
  );
}

/* ── 8. Distributed networking performance ────────────────────────────────── */

export function DistributedNetVisualizer() {
  const [bw, setBw] = useState(true);
  const [place, setPlace] = useState(true);

  const util = bw && place ? 95 : bw || place ? 62 : 28;
  const waiting = util < 80;

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Gradients Need a Fast Fabric</h3>
        <p className="text-gray-400 text-sm">
          High bandwidth + placement groups keep multi-node GPUs busy.
        </p>
      </div>

      <div className="max-w-md mx-auto w-full space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setBw(!bw)}
            className={`rounded-xl border p-3 text-left ${
              bw ? 'border-emerald-400 bg-emerald-500/10' : 'border-rose-500/40 bg-rose-500/10'
            }`}
          >
            <Network className={`w-4 h-4 mb-1 ${bw ? 'text-emerald-400' : 'text-rose-400'}`} />
            <div className="text-xs font-bold text-white">{bw ? '100–200+ Gbps' : 'Low bandwidth'}</div>
            <div className="text-[10px] text-gray-400">Toggle instance fabric</div>
          </button>
          <button
            type="button"
            onClick={() => setPlace(!place)}
            className={`rounded-xl border p-3 text-left ${
              place ? 'border-sky-400 bg-sky-500/10' : 'border-amber-500/40 bg-amber-500/10'
            }`}
          >
            <Server className={`w-4 h-4 mb-1 ${place ? 'text-sky-400' : 'text-amber-400'}`} />
            <div className="text-xs font-bold text-white">
              {place ? 'Placement group' : 'Scattered AZs'}
            </div>
            <div className="text-[10px] text-gray-400">Proximity / latency</div>
          </button>
        </div>

        <div
          className={`relative rounded-2xl border border-gray-700 bg-gray-900/80 p-4 ${
            place ? 'min-h-[120px]' : 'min-h-[160px]'
          }`}
        >
          {[0, 1, 2].map((i) => {
            const positions = place
              ? [
                  { left: '15%', top: '30%' },
                  { left: '42%', top: '30%' },
                  { left: '70%', top: '30%' },
                ]
              : [
                  { left: '8%', top: '15%' },
                  { left: '55%', top: '55%' },
                  { left: '75%', top: '10%' },
                ];
            return (
              <div
                key={i}
                className={`absolute w-16 rounded-lg border px-1 py-2 text-center transition-all duration-500 ${
                  waiting
                    ? 'border-rose-500/50 bg-rose-500/10'
                    : 'border-emerald-500/50 bg-emerald-500/10'
                }`}
                style={positions[i]}
              >
                <Zap className={`w-3.5 h-3.5 mx-auto ${waiting ? 'text-rose-300' : 'text-emerald-300'}`} />
                <div className="text-[9px] text-gray-300">Node {i + 1}</div>
              </div>
            );
          })}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line
              x1={place ? 23 : 16}
              y1={place ? 40 : 25}
              x2={place ? 50 : 63}
              y2={place ? 40 : 65}
              stroke={bw ? '#34d399' : '#f87171'}
              strokeWidth={bw ? 1.2 : 0.4}
              strokeDasharray={bw ? '0' : '2 2'}
              className={bw ? 'opacity-80' : 'opacity-50'}
            />
            <line
              x1={place ? 50 : 63}
              y1={place ? 40 : 65}
              x2={place ? 78 : 83}
              y2={place ? 40 : 20}
              stroke={bw ? '#34d399' : '#f87171'}
              strokeWidth={bw ? 1.2 : 0.4}
              strokeDasharray={bw ? '0' : '2 2'}
            />
          </svg>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>GPU utilization (all-reduce busy)</span>
            <span className="font-mono text-white">{util}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-gray-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${waiting ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${util}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {waiting
              ? 'GPUs wait on gradient exchange — fabric or distance is the bottleneck.'
              : 'Cluster communicates efficiently — expensive GPUs stay fed.'}
          </p>
        </div>
      </div>
    </div>
  );
}
