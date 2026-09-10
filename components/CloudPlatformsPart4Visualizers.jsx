import React, { useState, useEffect } from 'react';
import {
  Shield,
  Server,
  Cloud,
  Key,
  Lock,
  Unlock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Database,
  Terminal,
  Zap,
  HardDrive,
  Trash2,
  Globe,
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

/* ── 1. Shared responsibility ─────────────────────────────────────────────── */

export function SharedResponsibilityVisualizer() {
  const [side, setSide] = useState('both');
  const [neglect, setNeglect] = useState(false);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Shared Responsibility Model</h3>
        <p className="text-gray-400 text-sm">
          Provider secures <em>of</em> the cloud · you secure <em>in</em> the cloud.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'both', label: 'Both layers' },
          { id: 'provider', label: 'Provider' },
          { id: 'customer', label: 'You' },
        ]}
        value={side}
        onChange={setSide}
        accent="bg-emerald-600"
      />

      <div className="max-w-xl mx-auto w-full grid grid-cols-2 gap-3 mb-3">
        <div
          className={`rounded-2xl border p-4 transition ${
            side === 'customer'
              ? 'opacity-30 border-gray-700'
              : 'border-sky-400/50 bg-sky-500/10'
          }`}
        >
          <Cloud className="w-6 h-6 text-sky-400 mb-2" />
          <div className="text-sm font-bold text-white mb-2">Security of the cloud</div>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Physical data centers</li>
            <li>• Hardware &amp; hypervisors</li>
            <li>• Core networking fabric</li>
          </ul>
        </div>
        <div
          className={`rounded-2xl border p-4 transition ${
            side === 'provider'
              ? 'opacity-30 border-gray-700'
              : neglect
                ? 'border-rose-500 bg-rose-500/15'
                : 'border-amber-400/50 bg-amber-500/10'
          }`}
        >
          <User className="w-6 h-6 text-amber-400 mb-2" />
          <div className="text-sm font-bold text-white mb-2">Security in the cloud</div>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Your data &amp; models</li>
            <li>• Configurations &amp; IAM</li>
            <li>• Application code</li>
          </ul>
        </div>
      </div>

      <div className="max-w-xl mx-auto w-full flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setNeglect(!neglect)}
          className={`px-3 py-2 rounded-lg text-xs font-bold ${
            neglect ? 'bg-rose-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          {neglect ? 'Customer neglected duties' : 'Simulate neglect'}
        </button>
        {neglect && (
          <div className="flex-1 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Breach risk · stolen GPUs / models
          </div>
        )}
      </div>

      <p className="max-w-xl mx-auto mt-3 text-xs text-center text-gray-400">
        Defense in depth: layer identity, networking, and data controls.
      </p>
    </div>
  );
}

/* ── 2. Least privilege roles ─────────────────────────────────────────────── */

const ROLES = [
  {
    id: 'ds',
    name: 'Data Scientist',
    perms: [
      { door: 'Launch / stop training VMs', ok: true },
      { door: 'Read dataset buckets', ok: true },
      { door: 'Write model registry', ok: false },
      { door: 'Change IAM / networking', ok: false },
    ],
  },
  {
    id: 'mlops',
    name: 'MLOps Engineer',
    perms: [
      { door: 'Manage infra & pipelines', ok: true },
      { door: 'Update deployed models', ok: true },
      { door: 'Read all datasets', ok: true },
      { door: 'Admin root account', ok: false },
    ],
  },
  {
    id: 'svc',
    name: 'Training Service Role',
    perms: [
      { door: 'Read training buckets', ok: true },
      { door: 'Write logs / artifacts', ok: true },
      { door: 'Hardcoded access keys', ok: false },
      { door: 'Human console login', ok: false },
    ],
  },
];

export function LeastPrivilegeVisualizer() {
  const [role, setRole] = useState('ds');
  const r = ROLES.find((x) => x.id === role);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Principle of Least Privilege</h3>
        <p className="text-gray-400 text-sm">
          IAM first line of defense — grant only what each role needs.
        </p>
      </div>

      <Tabs
        options={ROLES.map((x) => ({ id: x.id, label: x.name }))}
        value={role}
        onChange={setRole}
        accent="bg-violet-600"
      />

      <div className="max-w-md mx-auto w-full space-y-2">
        {r.perms.map((p) => (
          <div
            key={p.door}
            className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${
              p.ok
                ? 'border-emerald-500/40 bg-emerald-500/10'
                : 'border-rose-500/30 bg-rose-500/5 opacity-60'
            }`}
          >
            <span className="text-sm text-gray-200">{p.door}</span>
            {p.ok ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-center text-gray-500 mt-3">
        AWS IAM · Google Cloud IAM · Azure Active Directory
      </p>
    </div>
  );
}

/* ── 3. IAM policy → permissions map ──────────────────────────────────────── */

export function IamPolicyVisualizer() {
  const [action, setAction] = useState('get');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">IAM Policy → Live Permissions</h3>
        <p className="text-gray-400 text-sm">
          Attach the policy to a role on the instance — no secret keys in code.
        </p>
      </div>

      <div className="max-w-xl mx-auto w-full grid md:grid-cols-2 gap-3">
        <pre className="rounded-xl bg-gray-950 border border-gray-700 p-3 text-[10px] font-mono text-gray-300 overflow-x-auto leading-relaxed">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-ai-datasets",
        "arn:aws:s3:::my-ai-datasets/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource":
        "arn:aws:s3:::my-model-artifacts/*"
    }
  ]
}`}
        </pre>

        <div className="space-y-3">
          <div className="rounded-xl border border-violet-400/40 bg-violet-500/10 p-3 text-center">
            <Server className="w-5 h-5 mx-auto text-violet-300 mb-1" />
            <div className="text-xs font-bold text-white">Training Instance</div>
            <div className="text-[10px] text-gray-400">assumes IAM Role</div>
          </div>

          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setAction('get')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                action === 'get' ? 'bg-sky-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              GetObject / List
            </button>
            <button
              type="button"
              onClick={() => setAction('put')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                action === 'put' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              PutObject
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs">
            <div className="rounded-lg border border-gray-600 px-2 py-2 bg-gray-900">VM</div>
            <span className={`font-bold ${action === 'get' ? 'text-sky-400' : 'text-amber-400'}`}>
              {action === 'get' ? '← read' : 'write →'}
            </span>
            <div
              className={`rounded-lg border px-3 py-2 ${
                action === 'get'
                  ? 'border-sky-400 bg-sky-500/15 text-sky-200'
                  : 'border-amber-400 bg-amber-500/15 text-amber-200'
              }`}
            >
              <Database className="w-4 h-4 inline mr-1" />
              {action === 'get' ? 'my-ai-datasets' : 'my-model-artifacts'}
            </div>
          </div>
          <p className="text-[10px] text-center text-gray-500">
            Permissions arrive with the role — no access keys to leak.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── 4. Secure network: bastion + SG + S3 ─────────────────────────────────── */

const NET_STEPS = [
  { id: 1, title: 'Engineer', detail: 'Engineer initiates SSH from corp network.' },
  { id: 2, title: 'Bastion', detail: 'Public subnet bastion — SG allow-ssh-from-corp.' },
  { id: 3, title: 'GPU', detail: 'Private GPU only accepts SSH from bastion SG.' },
  { id: 4, title: 'S3 via IAM', detail: 'HTTPS :443 to encrypted S3 via IAM role — not public internet path.' },
];

export function SecureNetFirewallVisualizer() {
  const [step, setStep] = useState(1);
  const glow = '#22d3ee';
  const dim = '#94a3b8';
  const on = (n) => (step === n ? glow : dim);
  const onW = (n) => (step === n ? 2.8 : 1.2);

  return (
    <div className="flex flex-col w-full h-full p-3 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-lg font-semibold text-white mb-0.5">Network Isolation &amp; Firewalls</h3>
        <p className="text-gray-400 text-xs">
          Security Groups (AWS) / Firewall Rules (GCP·Azure) — stateful, instance-level.
        </p>
      </div>

      <div className="flex justify-center gap-1 mb-2 flex-wrap">
        {NET_STEPS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setStep(x.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
              step === x.id ? 'bg-cyan-500 text-gray-950' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {x.id}. {x.title}
          </button>
        ))}
      </div>

      <div className="max-w-lg mx-auto w-full rounded-xl bg-white p-3 shadow-lg">
        <svg viewBox="0 0 420 380" className="w-full h-auto">
          <defs>
            <marker id="aDim" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
              <path d="M0,0 L5,3 L0,6 Z" fill={dim} />
            </marker>
            <marker id="aGlow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
              <path d="M0,0 L5,3 L0,6 Z" fill={glow} />
            </marker>
          </defs>

          {/* Engineer */}
          <ellipse
            cx="210"
            cy="28"
            rx="55"
            ry="16"
            fill={step === 1 ? '#86efac' : '#bbf7d0'}
            stroke={step === 1 ? glow : '#16a34a'}
            strokeWidth={step === 1 ? 2.5 : 1.2}
          />
          <text x="210" y="32" textAnchor="middle" fontSize="12" fontWeight="700" fill="#14532d">
            Engineer
          </text>

          {/* VPC */}
          <rect x="50" y="70" width="320" height="220" rx="12" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="66" y="88" fontSize="11" fontWeight="700" fill="#0369a1">
            Virtual Private Cloud (VPC)
          </text>

          {/* Public subnet */}
          <rect
            x="80"
            y="100"
            width="260"
            height="70"
            rx="8"
            fill="none"
            stroke="#64748b"
            strokeDasharray="5 3"
            strokeWidth="1.2"
          />
          <text x="90" y="114" fontSize="9" fill="#475569" fontWeight="600">
            Public Subnet
          </text>
          <rect
            x="130"
            y="122"
            width="160"
            height="36"
            rx="10"
            fill={step === 2 ? '#c4b5fd' : '#ddd6fe'}
            stroke={step === 2 ? glow : '#7c3aed'}
            strokeWidth={step === 2 ? 2.5 : 1.2}
          />
          <text x="210" y="138" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4c1d95">
            Bastion Host
          </text>
          <text x="210" y="150" textAnchor="middle" fontSize="8" fill="#6b21a8">
            (SG: allow-ssh-from-corp)
          </text>

          {/* Private subnet */}
          <rect
            x="80"
            y="190"
            width="260"
            height="80"
            rx="8"
            fill="none"
            stroke="#64748b"
            strokeDasharray="5 3"
            strokeWidth="1.2"
          />
          <text x="90" y="204" fontSize="9" fill="#475569" fontWeight="600">
            Private Subnet
          </text>
          <rect
            x="115"
            y="214"
            width="190"
            height="40"
            rx="10"
            fill={step === 3 ? '#7dd3fc' : '#bae6fd'}
            stroke={step === 3 ? glow : '#0284c7'}
            strokeWidth={step === 3 ? 2.5 : 1.2}
          />
          <text x="210" y="232" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0c4a6e">
            GPU Training Instance
          </text>
          <text x="210" y="246" textAnchor="middle" fontSize="8" fill="#075985">
            (SG: allow-ssh-from-bastion)
          </text>

          {/* S3 */}
          <rect
            x="130"
            y="320"
            width="160"
            height="40"
            rx="8"
            fill={step === 4 ? '#fdba74' : '#fed7aa'}
            stroke={step === 4 ? glow : '#ea580c'}
            strokeWidth={step === 4 ? 2.5 : 1.2}
          />
          <text x="210" y="338" textAnchor="middle" fontSize="10" fontWeight="700" fill="#7c2d12">
            S3 Bucket
          </text>
          <text x="210" y="350" textAnchor="middle" fontSize="8" fill="#9a3412">
            (Encrypted Data)
          </text>

          {/* Arrow 1 */}
          <line
            x1="210"
            y1="44"
            x2="210"
            y2="120"
            stroke={on(1)}
            strokeWidth={onW(1)}
            markerEnd={step === 1 ? 'url(#aGlow)' : 'url(#aDim)'}
            style={{ filter: step === 1 ? 'drop-shadow(0 0 4px #22d3ee)' : undefined }}
          />
          <text x="220" y="70" fontSize="10" fontWeight={step === 1 ? 700 : 500} fill={on(1)}>
            SSH (port 22)
          </text>

          {/* Arrow 2 */}
          <line
            x1="210"
            y1="158"
            x2="210"
            y2="212"
            stroke={step === 2 || step === 3 ? glow : dim}
            strokeWidth={step === 2 || step === 3 ? 2.8 : 1.2}
            markerEnd={step === 2 || step === 3 ? 'url(#aGlow)' : 'url(#aDim)'}
            style={{
              filter: step === 2 || step === 3 ? 'drop-shadow(0 0 4px #22d3ee)' : undefined,
            }}
          />
          <text
            x="220"
            y="185"
            fontSize="10"
            fontWeight={step === 2 || step === 3 ? 700 : 500}
            fill={step === 2 || step === 3 ? glow : dim}
          >
            SSH (port 22)
          </text>

          {/* Arrow 4 to S3 dashed */}
          <line
            x1="210"
            y1="254"
            x2="210"
            y2="318"
            stroke={on(4)}
            strokeWidth={onW(4)}
            strokeDasharray={step === 4 ? '6 3' : '4 3'}
            markerEnd={step === 4 ? 'url(#aGlow)' : 'url(#aDim)'}
            style={{ filter: step === 4 ? 'drop-shadow(0 0 4px #22d3ee)' : undefined }}
          />
          <text x="220" y="290" fontSize="9" fontWeight={step === 4 ? 700 : 500} fill={on(4)}>
            HTTPS (443) via IAM Role
          </text>
        </svg>
      </div>

      <p className="max-w-lg mx-auto mt-2 text-xs text-center text-gray-300 bg-gray-900/80 rounded-lg p-2 border border-cyan-500/20">
        <strong className="text-cyan-300">
          {NET_STEPS[step - 1].id}. {NET_STEPS[step - 1].title}:
        </strong>{' '}
        {NET_STEPS[step - 1].detail}
      </p>
    </div>
  );
}

/* ── 5. Encryption + secrets ──────────────────────────────────────────────── */

export function DataProtectionVisualizer() {
  const [tab, setTab] = useState('transit');
  const [cmek, setCmek] = useState(true);
  const [goodSecrets, setGoodSecrets] = useState(true);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Encryption &amp; Secrets</h3>
        <p className="text-gray-400 text-sm">Datasets and models are IP — protect in transit, at rest, and in code.</p>
      </div>

      <Tabs
        options={[
          { id: 'transit', label: 'In transit' },
          { id: 'rest', label: 'At rest' },
          { id: 'secrets', label: 'Secrets' },
        ]}
        value={tab}
        onChange={setTab}
        accent="bg-emerald-600"
      />

      <div className="max-w-md mx-auto w-full">
        {tab === 'transit' && (
          <div className="rounded-2xl border border-emerald-500/30 bg-gray-900/80 p-4 space-y-3">
            <div className="flex items-center justify-center gap-3 text-xs font-bold">
              <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-3 text-amber-100">
                S3 / GCS
              </div>
              <div className="flex-1 h-3 rounded-full bg-emerald-500/30 relative overflow-hidden border border-emerald-400/40">
                <div className="absolute inset-y-0 left-0 w-1/3 bg-emerald-400 animate-pulse rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center text-[9px] text-emerald-100">
                  TLS / HTTPS tunnel
                </div>
              </div>
              <div className="rounded-lg border border-sky-400/40 bg-sky-500/10 px-3 py-3 text-sky-100">
                Training VM
              </div>
            </div>
            <p className="text-xs text-center text-gray-400">
              Always use HTTPS endpoints — blocks eavesdropping on the wire.
            </p>
          </div>
        )}

        {tab === 'rest' && (
          <div className="space-y-3">
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setCmek(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${!cmek ? 'bg-sky-600 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                Provider-managed
              </button>
              <button
                type="button"
                onClick={() => setCmek(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${cmek ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                CMEK (KMS)
              </button>
            </div>
            <div className="rounded-2xl border border-gray-700 bg-gray-900 p-4 text-center">
              <HardDrive className="w-8 h-8 mx-auto text-amber-400 mb-2" />
              <div className="text-sm text-white font-bold mb-1">Encrypted object store</div>
              {cmek ? (
                <div className="flex items-center justify-center gap-2 text-xs text-violet-200">
                  <Key className="w-4 h-4" /> You hold / revoke the key via AWS·GCP KMS
                </div>
              ) : (
                <div className="text-xs text-gray-400">Provider encrypts on write, decrypts via IAM</div>
              )}
            </div>
          </div>
        )}

        {tab === 'secrets' && (
          <div className="space-y-3">
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setGoodSecrets(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${!goodSecrets ? 'bg-rose-600 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                Bad: hardcoded
              </button>
              <button
                type="button"
                onClick={() => setGoodSecrets(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${goodSecrets ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                Good: vault
              </button>
            </div>
            {!goodSecrets ? (
              <pre className="rounded-xl bg-rose-950/40 border border-rose-500/40 p-3 text-[11px] font-mono text-rose-200">
{`# secrets.py  ❌
DB_PASSWORD = "hunter2"
API_KEY = "sk-live-...."  # leaked in git`}
              </pre>
            ) : (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="rounded-lg bg-gray-900 px-2 py-1 text-gray-300">App + IAM role</span>
                  <span className="text-emerald-400">→</span>
                  <span className="rounded-lg bg-gray-900 px-2 py-1 text-emerald-300 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Secrets Manager
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">
                  AWS Secrets Manager · GCP Secret Manager · Azure Key Vault · Vault
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 6. Hands-on prerequisites ────────────────────────────────────────────── */

const PREREQS = [
  { id: 'acct', label: 'AWS account + billing', icon: Cloud },
  { id: 'cli', label: 'AWS CLI · aws configure', icon: Terminal },
  { id: 'ssh', label: 'SSH client', icon: Globe },
  { id: 'key', label: 'SSH key pair ready', icon: Key },
];

export function HandsOnIntroVisualizer() {
  const [done, setDone] = useState({});

  const toggle = (id) => setDone((d) => ({ ...d, [id]: !d[id] }));
  const all = PREREQS.every((p) => done[p.id]);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Lab Checklist</h3>
        <p className="text-gray-400 text-sm">Tap each prerequisite — same flow works on GCP / Azure.</p>
      </div>

      <div className="max-w-sm mx-auto w-full space-y-2 mb-4">
        {PREREQS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => toggle(id)}
            className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
              done[id]
                ? 'border-emerald-400 bg-emerald-500/15'
                : 'border-gray-700 bg-gray-900/80 hover:border-gray-500'
            }`}
          >
            <Icon className={`w-5 h-5 ${done[id] ? 'text-emerald-400' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${done[id] ? 'text-white' : 'text-gray-400'}`}>
              {label}
            </span>
            {done[id] && <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto" />}
          </button>
        ))}
      </div>

      <div
        className={`max-w-sm mx-auto w-full rounded-xl border p-3 text-center text-sm ${
          all
            ? 'border-emerald-400 bg-emerald-500/10 text-emerald-200'
            : 'border-gray-700 bg-gray-900 text-gray-500'
        }`}
      >
        {all ? 'Ready to choose instance + AMI →' : 'Complete the checklist to proceed'}
      </div>
    </div>
  );
}

/* ── 7. Instance + AMI picker ─────────────────────────────────────────────── */

export function InstanceAmiVisualizer() {
  const [view, setView] = useState('instance');

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Step 1: Instance &amp; AMI</h3>
        <p className="text-gray-400 text-sm">
          Entry-level GPU lab shape + Deep Learning AMI stack.
        </p>
      </div>

      <Tabs
        options={[
          { id: 'instance', label: 'g4dn.xlarge' },
          { id: 'ami', label: 'Deep Learning AMI' },
        ]}
        value={view}
        onChange={setView}
        accent="bg-rose-600"
      />

      <div className="max-w-md mx-auto w-full">
        {view === 'instance' && (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 space-y-3">
            <div className="text-center">
              <div className="font-mono text-rose-300 text-lg font-bold">g4dn.xlarge</div>
              <div className="text-xs text-gray-400 mt-1">Balanced cost · general-purpose ML</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-gray-900/80 border border-gray-700 p-2">
                <div className="text-gray-500">vCPU</div>
                <div className="text-white font-bold">4</div>
              </div>
              <div className="rounded-lg bg-gray-900/80 border border-gray-700 p-2">
                <div className="text-gray-500">RAM</div>
                <div className="text-white font-bold">16 GB</div>
              </div>
              <div className="rounded-lg bg-gray-900/80 border border-brand-orange/50 p-2 ring-1 ring-brand-orange/40">
                <Zap className="w-3.5 h-3.5 mx-auto text-brand-orange mb-0.5" />
                <div className="text-brand-orange font-bold">NVIDIA T4</div>
              </div>
            </div>
          </div>
        )}
        {view === 'ami' && (
          <div className="space-y-1.5">
            {[
              { label: 'Ubuntu 20.04 OS', tone: 'bg-gray-700' },
              { label: 'NVIDIA drivers · CUDA · cuDNN', tone: 'bg-sky-700' },
              { label: 'TensorFlow + PyTorch', tone: 'bg-violet-700' },
              { label: 'Deep Learning AMI GPU …', tone: 'bg-emerald-700' },
            ].map((layer, i) => (
              <div
                key={layer.label}
                className={`rounded-lg ${layer.tone} px-3 py-2.5 text-center text-xs font-bold text-white`}
                style={{ marginLeft: i * 8, marginRight: i * 8 }}
              >
                {layer.label}
              </div>
            ))}
            <p className="text-[10px] text-center text-gray-500 font-mono mt-2">
              ami-0123456789abcdef0 ← replace with your region&apos;s ID
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 8. Security group + key pair ─────────────────────────────────────────── */

export function SecurityAccessVisualizer() {
  const [phase, setPhase] = useState(1); // 1 firewall, 2 key, 3 chmod
  const [sgOk, setSgOk] = useState(true);
  const [keyMade, setKeyMade] = useState(false);
  const [locked, setLocked] = useState(false);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Before Launch: 3 Access Tasks</h3>
        <p className="text-gray-400 text-sm">Follow the numbered path — each step solves a different problem.</p>
      </div>

      <div className="flex justify-center gap-1 mb-4 flex-wrap">
        {[
          { id: 1, label: '1. Firewall' },
          { id: 2, label: '2. House key' },
          { id: 3, label: '3. Lock the key' },
        ].map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPhase(p.id)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition ${
              phase === p.id ? 'bg-sky-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Progress strip */}
      <div className="max-w-md mx-auto w-full flex items-center gap-1 mb-4 text-[9px] font-bold uppercase">
        {[
          { n: 1, t: 'Who can knock?' },
          { n: 2, t: 'Prove identity' },
          { n: 3, t: 'Protect .pem' },
        ].map((x, i) => (
          <React.Fragment key={x.n}>
            <div
              className={`flex-1 rounded-lg border px-1.5 py-2 text-center ${
                phase === x.n
                  ? 'border-sky-400 bg-sky-500/20 text-sky-200'
                  : phase > x.n
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-gray-700 text-gray-600'
              }`}
            >
              {x.t}
            </div>
            {i < 2 && <span className="text-gray-600">→</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="max-w-md mx-auto w-full">
        {phase === 1 && (
          <div className="rounded-2xl border border-sky-500/30 bg-gray-900/80 p-4 space-y-3">
            <div className="text-sm font-bold text-white text-center">Security Group = the door policy</div>
            <p className="text-xs text-gray-400 text-center">
              Only allow SSH (port 22) from your IP. Everyone else is blocked at the network layer.
            </p>
            <div className="relative mx-auto w-36 h-36 rounded-full border-4 border-dashed border-sky-500/40 flex items-center justify-center">
              <Shield className={`w-12 h-12 ${sgOk ? 'text-emerald-400' : 'text-rose-400'}`} />
              <Server className="w-5 h-5 absolute text-white" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSgOk(true)}
                className={`rounded-lg py-2 text-[10px] font-bold ${
                  sgOk ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                ✓ :22 from my IP only
              </button>
              <button
                type="button"
                onClick={() => setSgOk(false)}
                className={`rounded-lg py-2 text-[10px] font-bold ${
                  !sgOk ? 'bg-rose-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                ✗ :22 open to 0.0.0.0/0
              </button>
            </div>
            <p className={`text-xs text-center ${sgOk ? 'text-emerald-300' : 'text-rose-300'}`}>
              {sgOk
                ? 'Safe for the lab — only your laptop can attempt SSH.'
                : 'Unsafe — the whole internet can knock on port 22.'}
            </p>
            <button
              type="button"
              onClick={() => setPhase(2)}
              className="w-full py-2 rounded-lg bg-sky-600 text-white text-xs font-bold"
            >
              Next: create the SSH key →
            </button>
          </div>
        )}

        {phase === 2 && (
          <div className="rounded-2xl border border-amber-500/30 bg-gray-900/80 p-4 space-y-3">
            <div className="text-sm font-bold text-white text-center">SSH key pair = your house key</div>
            <p className="text-xs text-gray-400 text-center">
              AWS keeps the public key. You keep the private <span className="font-mono text-rose-300">.pem</span> file.
            </p>
            <div className="flex items-center justify-center gap-3 text-xs">
              <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-3 text-center">
                <Key className="w-5 h-5 mx-auto text-amber-300 mb-1" />
                <div className="text-amber-100 font-bold">Private</div>
                <div className="font-mono text-[9px] text-rose-300">ai-infra-key.pem</div>
                <div className="text-[9px] text-gray-500">on your laptop</div>
              </div>
              <span className="text-gray-500">↔</span>
              <div className="rounded-xl border border-sky-400/40 bg-sky-500/10 px-3 py-3 text-center">
                <Cloud className="w-5 h-5 mx-auto text-sky-300 mb-1" />
                <div className="text-sky-100 font-bold">Public</div>
                <div className="font-mono text-[9px] text-gray-400">ai-infra-key</div>
                <div className="text-[9px] text-gray-500">registered in AWS</div>
              </div>
            </div>
            <pre className="text-[9px] font-mono text-gray-300 bg-black/50 rounded-lg p-2 overflow-x-auto">
{`aws ec2 create-key-pair --key-name ai-infra-key \\
  --query 'KeyMaterial' --output text > ai-infra-key.pem`}
            </pre>
            <button
              type="button"
              onClick={() => setKeyMade(true)}
              className={`w-full py-2 rounded-lg text-xs font-bold ${
                keyMade ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              {keyMade ? '✓ Key pair created' : 'Simulate: create key pair'}
            </button>
            <button
              type="button"
              disabled={!keyMade}
              onClick={() => setPhase(3)}
              className="w-full py-2 rounded-lg bg-sky-600 disabled:opacity-40 text-white text-xs font-bold"
            >
              Next: lock the .pem file →
            </button>
          </div>
        )}

        {phase === 3 && (
          <div className="rounded-2xl border border-violet-500/30 bg-gray-900/80 p-4 space-y-3">
            <div className="text-sm font-bold text-white text-center">chmod 400 = lock the key file</div>
            <p className="text-xs text-gray-400 text-center">
              If the .pem is world-readable, anyone with a copy of the file can SSH as you.
            </p>
            <div className="flex items-center justify-center gap-4 py-2">
              <div
                className={`rounded-xl border px-4 py-3 text-center transition ${
                  locked
                    ? 'border-emerald-400 bg-emerald-500/15'
                    : 'border-rose-400/50 bg-rose-500/10'
                }`}
              >
                {locked ? (
                  <Lock className="w-8 h-8 mx-auto text-emerald-400 mb-1" />
                ) : (
                  <Unlock className="w-8 h-8 mx-auto text-rose-400 mb-1" />
                )}
                <div className="font-mono text-[10px] text-rose-300">ai-infra-key.pem</div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {locked ? 'owner-read only (400)' : 'too open — fix me'}
                </div>
              </div>
            </div>
            <pre className="text-[11px] font-mono text-center text-violet-200 bg-black/50 rounded-lg p-2">
              chmod 400 ai-infra-key.pem
            </pre>
            <button
              type="button"
              onClick={() => setLocked(true)}
              className={`w-full py-2 rounded-lg text-xs font-bold ${
                locked ? 'bg-emerald-600 text-white' : 'bg-violet-600 text-white'
              }`}
            >
              {locked ? '✓ Permissions locked' : 'Run chmod 400'}
            </button>
            {locked && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-100 text-center">
                Ready for Step 3 — launch with this Security Group and key name together.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 9. Launch instance recipe ────────────────────────────────────────────── */

const LAUNCH_PARTS = [
  { id: 'ami', label: '--image-id', value: 'Deep Learning AMI', color: 'bg-emerald-600' },
  { id: 'type', label: '--instance-type', value: 'g4dn.xlarge', color: 'bg-rose-600' },
  { id: 'key', label: '--key-name', value: 'ai-infra-key', color: 'bg-amber-600' },
  { id: 'sg', label: '--security-group-ids', value: 'sg-…', color: 'bg-sky-600' },
  { id: 'tag', label: '--tag-specifications', value: 'AI-Infra-Lab-Instance', color: 'bg-violet-600' },
];

export function LaunchInstanceVisualizer() {
  const [assembled, setAssembled] = useState([]);
  const [launched, setLaunched] = useState(false);

  const add = (id) => {
    if (!assembled.includes(id)) setAssembled([...assembled, id]);
  };

  const canLaunch = assembled.length === LAUNCH_PARTS.length;

  useEffect(() => {
    if (!canLaunch) setLaunched(false);
  }, [canLaunch]);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Step 3: Launch Recipe</h3>
        <p className="text-gray-400 text-sm">Tap each flag to assemble <span className="font-mono text-rose-300">run-instances</span></p>
      </div>

      <div className="max-w-md mx-auto w-full flex flex-wrap justify-center gap-2 mb-3">
        {LAUNCH_PARTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => add(p.id)}
            disabled={assembled.includes(p.id)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition ${
              assembled.includes(p.id)
                ? `${p.color} text-white opacity-50`
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="max-w-md mx-auto w-full rounded-2xl border border-gray-700 bg-gray-950 p-3 min-h-[120px] space-y-1.5 mb-3">
        <div className="text-[10px] text-gray-500 font-mono">aws ec2 run-instances \</div>
        {LAUNCH_PARTS.filter((p) => assembled.includes(p.id)).map((p) => (
          <div key={p.id} className={`rounded px-2 py-1 text-[10px] font-mono text-white ${p.color}`}>
            {p.label} {p.value} \
          </div>
        ))}
        {assembled.length === 0 && (
          <div className="text-xs text-gray-600 text-center py-6">Add flags above…</div>
        )}
      </div>

      <button
        type="button"
        disabled={!canLaunch}
        onClick={() => setLaunched(true)}
        className="max-w-md mx-auto w-full py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 bg-emerald-600 hover:bg-emerald-500 text-white"
      >
        Launch instance
      </button>

      {launched && (
        <div className="max-w-md mx-auto w-full mt-3 rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-3 text-center">
          <CheckCircle className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
          <div className="text-sm text-white font-bold">InstanceId returned</div>
          <div className="font-mono text-xs text-emerald-300 mt-1">i-012345abcdef</div>
        </div>
      )}
    </div>
  );
}

/* ── 10. Connect & verify workflow ────────────────────────────────────────── */

const VERIFY_STEPS = [
  {
    id: 1,
    title: 'Get public IP',
    cmd: `aws ec2 describe-instances --instance-ids i-012345abcdef \\
  --query 'Reservations[].Instances[].PublicIpAddress' --output text`,
    result: '54.183.201.99',
  },
  {
    id: 2,
    title: 'SSH in',
    cmd: 'ssh -i "ai-infra-key.pem" ubuntu@54.183.201.99',
    result: 'Welcome to Ubuntu…',
  },
  {
    id: 3,
    title: 'nvidia-smi',
    cmd: 'nvidia-smi',
    result: 'Tesla T4 · Driver OK · CUDA OK',
  },
  {
    id: 4,
    title: 'PyTorch check',
    cmd: 'python3 verify_gpu.py',
    result: 'CUDA device: Tesla T4 · tensor on cuda:0',
  },
];

export function ConnectVerifyVisualizer() {
  const [step, setStep] = useState(1);
  const s = VERIFY_STEPS.find((x) => x.id === step);

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-2">
        <h3 className="text-xl font-semibold text-white mb-1">Step 4: Connect &amp; Verify</h3>
        <p className="text-gray-400 text-sm">Provision → SSH → nvidia-smi → PyTorch</p>
      </div>

      <div className="flex justify-center gap-1 mb-3 flex-wrap">
        {VERIFY_STEPS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setStep(x.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
              step === x.id ? 'bg-emerald-500 text-gray-950' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {x.id}. {x.title}
          </button>
        ))}
      </div>

      {/* Workflow strip */}
      <div className="max-w-lg mx-auto w-full flex items-center justify-between mb-3 text-[9px] font-bold uppercase tracking-wide">
        {['Local', 'AWS API', 'Instance', 'GPU'].map((n, i) => (
          <React.Fragment key={n}>
            <div
              className={`rounded-lg border px-2 py-2 text-center flex-1 ${
                step > i ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200' : 'border-gray-700 text-gray-500'
              }`}
            >
              {n}
            </div>
            {i < 3 && <span className="text-gray-600 px-0.5">→</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="max-w-lg mx-auto w-full rounded-xl bg-black border border-gray-700 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 border-b border-gray-800">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="ml-2 text-[10px] text-gray-500 font-mono">terminal</span>
        </div>
        <div className="p-3 font-mono text-[11px] space-y-2">
          <div className="text-emerald-400">$ {s.cmd}</div>
          <div className="text-gray-300 whitespace-pre-wrap">{s.result}</div>
        </div>
      </div>
    </div>
  );
}

/* ── 11. Terminate billing visualizer ─────────────────────────────────────── */

export function TerminateVisualizer() {
  const [state, setState] = useState('running'); // running | stopped | terminated

  const cost =
    state === 'running' ? 0.74 : state === 'stopped' ? 0.12 : 0;
  const label =
    state === 'running' ? 'Compute + EBS billing' : state === 'stopped' ? 'EBS still billing' : 'Billing stopped';

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto custom-scroll">
      <div className="text-center mb-3">
        <h3 className="text-xl font-semibold text-white mb-1">Step 5: Terminate (Important)</h3>
        <p className="text-gray-400 text-sm">Stopped ≠ free. Terminate to end all charges.</p>
      </div>

      <Tabs
        options={[
          { id: 'running', label: 'Running' },
          { id: 'stopped', label: 'Stopped' },
          { id: 'terminated', label: 'Terminated' },
        ]}
        value={state}
        onChange={setState}
        accent="bg-rose-600"
      />

      <div className="max-w-sm mx-auto w-full space-y-4">
        <div className="flex justify-center gap-6">
          <div
            className={`text-center transition ${
              state === 'terminated' ? 'opacity-20 scale-90' : 'opacity-100'
            }`}
          >
            <Server
              className={`w-10 h-10 mx-auto mb-1 ${
                state === 'running' ? 'text-emerald-400' : 'text-gray-600'
              }`}
            />
            <div className="text-[10px] text-gray-400">EC2 compute</div>
          </div>
          <div
            className={`text-center transition ${
              state === 'terminated' ? 'opacity-20 scale-90' : 'opacity-100'
            }`}
          >
            <HardDrive
              className={`w-10 h-10 mx-auto mb-1 ${
                state !== 'terminated' ? 'text-amber-400' : 'text-gray-600'
              }`}
            />
            <div className="text-[10px] text-gray-400">EBS volume</div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 text-center">
          <div className="text-[10px] text-gray-500 uppercase mb-1">Approx $/hr</div>
          <div
            className={`text-3xl font-mono font-bold ${
              cost === 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            ${cost.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">{label}</div>
        </div>

        {state === 'terminated' && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-100 flex gap-2">
            <Trash2 className="w-4 h-4 shrink-0" />
            Irreversible — local instance storage wiped. Confirm in the console.
          </div>
        )}

        <pre className="rounded-lg bg-black/50 border border-gray-700 p-2 text-[10px] font-mono text-rose-300 overflow-x-auto">
{`aws ec2 terminate-instances \\
  --instance-ids i-012345abcdef`}
        </pre>
      </div>
    </div>
  );
}
