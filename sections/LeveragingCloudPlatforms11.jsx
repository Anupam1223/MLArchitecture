import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  SharedResponsibilityVisualizer,
  LeastPrivilegeVisualizer,
  IamPolicyVisualizer,
  SecureNetFirewallVisualizer,
  DataProtectionVisualizer,
  HandsOnIntroVisualizer,
  InstanceAmiVisualizer,
  SecurityAccessVisualizer,
  LaunchInstanceVisualizer,
  ConnectVerifyVisualizer,
  TerminateVisualizer,
} from '../components/CloudPlatformsPart4Visualizers';

export const meta = {
  title: 'Leveraging Cloud Platforms for AI (Part 4)',
  subtitle: 'Cloud security, IAM, encryption, and launching a GPU instance',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'shared-resp',
    title: 'Security Considerations in the Cloud',
    subtitle: 'Shared responsibility · defense in depth',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Cloud security follows a <strong className="text-white">Shared Responsibility Model</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-sky-300">Provider — security of the cloud:</strong> physical data
            centers, hardware, and core networking.
          </li>
          <li>
            <strong className="text-amber-300">You — security in the cloud:</strong> your data,
            configurations, access policies, and application code.
          </li>
        </ul>
        <p>
          Neglecting your side can lead to data breaches or theft of expensive GPU time and trained
          models. Use a <strong className="text-white">defense-in-depth</strong> strategy: layer
          controls across identity, networking, and data.
        </p>
        <p className="text-xs text-gray-400 italic">
          Toggle provider vs customer layers — simulate what happens if you neglect your duties.
        </p>
      </div>
    ),
    Visual: SharedResponsibilityVisualizer,
  },
  {
    id: 'iam-roles',
    title: 'Identity and Access Management (IAM)',
    subtitle: 'Least privilege for people and services',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          IAM is the <strong className="text-white">first line of defense</strong> — AWS IAM, Google
          Cloud IAM, and Azure Active Directory.
        </p>
        <p>
          Foundational principle:{' '}
          <strong className="text-brand-orange">Principle of Least Privilege</strong> — grant only the
          minimum permissions needed for a task. Prefer specific roles over admin accounts:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Data Scientist:</strong> launch/stop training instances;
            read-only access to dataset buckets.
          </li>
          <li>
            <strong className="text-white">MLOps Engineer:</strong> manage infrastructure, configure
            pipelines, update models.
          </li>
          <li>
            <strong className="text-white">Training Service Role:</strong> assigned to a VM to read
            storage and write logs — <em>no hardcoded access keys</em>.
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">Tap each role to see which doors open and close.</p>
      </div>
    ),
    Visual: LeastPrivilegeVisualizer,
  },
  {
    id: 'iam-policy',
    title: 'IAM Policies for Training Instances',
    subtitle: 'Allow read on datasets · write on artifacts',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Attach a JSON policy to an <strong className="text-white">IAM Role</strong>, then assign
          that role to the cloud instance. The application acquires permissions automatically —
          without handling secret keys.
        </p>
        <p>A typical training policy might:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <span className="font-mono text-xs text-sky-300">s3:GetObject</span> /{' '}
            <span className="font-mono text-xs text-sky-300">s3:ListBucket</span> on{' '}
            <span className="font-mono text-xs text-rose-300">my-ai-datasets</span>
          </li>
          <li>
            <span className="font-mono text-xs text-amber-300">s3:PutObject</span> on{' '}
            <span className="font-mono text-xs text-rose-300">my-model-artifacts/*</span>
          </li>
        </ul>
        <h4 className="text-white font-semibold">Network isolation &amp; firewalls</h4>
        <p>
          Do not expose AI infra fully to the public internet. Use a VPC with{' '}
          <strong className="text-emerald-300">public subnets</strong> (load balancers, bastion hosts)
          and <strong className="text-rose-300">private subnets</strong> (GPU training). Private
          instances reach the internet outbound via a <strong className="text-white">NAT Gateway</strong>{' '}
          only.
        </p>
        <p>
          Traffic control: AWS <strong className="text-white">Security Groups</strong> (GCP/Azure:{' '}
          Firewall Rules) — stateful, instance-level. Example: allow inbound SSH :22 only from the
          bastion&apos;s security group.
        </p>
        <p className="text-xs text-gray-400 italic">
          Hover the policy actions on the right — watch read vs write paths light up.
        </p>
      </div>
    ),
    Visual: IamPolicyVisualizer,
  },
  {
    id: 'secure-arch',
    title: 'A Typical Secure Network Architecture',
    subtitle: 'Bastion jump · private GPU · S3 via IAM',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <h4 className="text-white font-semibold">Network Isolation and Firewalls</h4>
        <p>
          Your AI infrastructure should not be fully exposed to the public internet. Use the{' '}
          <strong className="text-white">Virtual Private Cloud (VPC)</strong> services to create a
          logically isolated section of the cloud. Within a VPC, you can define public and private
          subnets.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-emerald-300">Public Subnets:</strong> Contain resources that need
            direct internet access, like a load balancer for an inference endpoint or a{' '}
            <strong className="text-white">bastion host</strong> (jump box) for secure administrative
            access.
          </li>
          <li>
            <strong className="text-sky-300">Private Subnets:</strong> Contain your core
            infrastructure, such as GPU instances for training. These instances cannot be reached
            directly from the internet, which drastically reduces their attack surface. They can be
            configured to access the internet through a{' '}
            <strong className="text-white">NAT (Network Address Translation) Gateway</strong> for
            tasks like downloading packages, without allowing inbound connections.
          </li>
        </ul>
        <p>
          To control traffic to and from instances, use firewall rules. In AWS these are{' '}
          <strong className="text-white">Security Groups</strong>; in GCP and Azure they are simply{' '}
          <strong className="text-white">Firewall Rules</strong>. They are stateful and operate at the
          instance level.
        </p>
        <p>
          Example: a security group on training instances that only allows inbound SSH (port 22) from
          your bastion host&apos;s security group — and no other inbound traffic.
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong className="text-white">Engineer</strong> SSHs to the bastion in the{' '}
            <strong className="text-emerald-300">public subnet</strong> (SG:{' '}
            <span className="font-mono text-xs">allow-ssh-from-corp</span>).
          </li>
          <li>
            From the bastion, SSH into the{' '}
            <strong className="text-sky-300">GPU Training Instance</strong> in the private subnet (SG:{' '}
            <span className="font-mono text-xs">allow-ssh-from-bastion</span>).
          </li>
          <li>
            The GPU reads encrypted data from <strong className="text-amber-300">S3</strong> over
            HTTPS :443 using an <strong className="text-white">IAM role</strong> — not over the public
            internet path.
          </li>
        </ol>
        <p className="text-xs text-gray-400 italic">
          Step through Engineer → Bastion → GPU → S3; watch arrows glow cyan.
        </p>
      </div>
    ),
    Visual: SecureNetFirewallVisualizer,
  },
  {
    id: 'data-protect',
    title: 'Data Protection: Encryption and Secrets Management',
    subtitle: 'In transit · at rest · never hardcode secrets',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Your datasets and trained models are valuable intellectual property. Protecting them is
          non-negotiable.
        </p>
        <h4 className="text-white font-semibold">Encryption in transit</h4>
        <p>
          Encrypt all data between components with <strong className="text-white">TLS (SSL)</strong>.
          When a training instance pulls from S3 or GCS, use an{' '}
          <strong className="text-white">HTTPS</strong> endpoint to prevent eavesdropping.
        </p>
        <h4 className="text-white font-semibold">Encryption at rest</h4>
        <p>
          Encrypt objects and VM disks. Most providers enable{' '}
          <strong className="text-white">server-side encryption</strong> by default. For higher
          compliance, use <strong className="text-brand-orange">Customer-Managed Encryption Keys
          (CMEK)</strong> via AWS KMS or Google Cloud KMS — you can revoke access at the key level.
        </p>
        <h4 className="text-white font-semibold">Secrets management</h4>
        <p>
          Never hardcode API keys, passwords, or tokens. Fetch them at runtime via an IAM role from
          AWS Secrets Manager / Parameter Store, GCP Secret Manager, Azure Key Vault, or HashiCorp
          Vault. Benefits: decouple secrets from code, rotate credentials, audit access.
        </p>
        <p className="text-xs text-gray-400 italic">
          Flip In transit / At rest / Secrets — compare hardcoded vs vault patterns.
        </p>
      </div>
    ),
    Visual: DataProtectionVisualizer,
  },
  {
    id: 'hands-on-intro',
    title: 'Hands-on Practical: Launching a GPU Cloud Instance',
    subtitle: 'Prerequisites before you provision',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Cloud infrastructure principles stick best when you apply them. This lab walks through
          provisioning, configuring, and accessing a GPU virtual machine — selecting an instance,
          choosing a software image (AMI), managing network access, and connecting securely.
        </p>
        <p>
          The examples use <strong className="text-white">AWS</strong>; the process is similar on GCP
          and Azure.
        </p>
        <h4 className="text-white font-semibold">Prerequisites</h4>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Active cloud account with billing enabled (AWS)</li>
          <li>
            Cloud CLI installed and configured (
            <span className="font-mono text-xs text-rose-300">aws configure</span>)
          </li>
          <li>SSH client (built-in on macOS/Linux; WSL or PuTTY on Windows)</li>
          <li>An SSH key pair for secure connection</li>
        </ul>
        <p className="text-xs text-gray-400 italic">Check off each prerequisite on the right.</p>
      </div>
    ),
    Visual: HandsOnIntroVisualizer,
  },
  {
    id: 'step1-ami',
    title: 'Step 1: Choosing an Instance and a Machine Image',
    subtitle: 'g4dn.xlarge + Deep Learning AMI',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <h4 className="text-white font-semibold">Instance type</h4>
        <p>
          We use <span className="font-mono text-rose-300">g4dn.xlarge</span> — an{' '}
          <strong className="text-brand-orange">NVIDIA T4 GPU</strong>. It is a solid entry point for
          general-purpose ML and balances performance with cost.
        </p>
        <h4 className="text-white font-semibold">Amazon Machine Image (AMI)</h4>
        <p>
          An AMI is a template with the OS and pre-installed software. Prefer the{' '}
          <strong className="text-white">AWS Deep Learning AMI</strong>, which includes NVIDIA
          drivers, CUDA, cuDNN, and frameworks like <strong className="text-white">TensorFlow</strong>{' '}
          and <strong className="text-white">PyTorch</strong>.
        </p>
        <p>
          Naming pattern example:{' '}
          <span className="font-mono text-xs text-rose-300">
            Deep Learning AMI GPU TensorFlow X.X.X (Ubuntu 20.04)
          </span>
          . Replace the placeholder{' '}
          <span className="font-mono text-xs text-rose-300">ami-0123456789abcdef0</span> with a valid
          ID for your region.
        </p>
        <p className="text-xs text-gray-400 italic">
          Toggle instance specs vs AMI software stack layers.
        </p>
      </div>
    ),
    Visual: InstanceAmiVisualizer,
  },
  {
    id: 'step2-sec',
    title: 'Step 2: Configuring Security and Access',
    subtitle: 'Three setup tasks before you launch — in order',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Before we launch the GPU instance, we must decide <strong className="text-white">who is
          allowed to reach it</strong> and <strong className="text-white">how we will prove who we
          are</strong>. Do these three tasks in order — they solve different problems.
        </p>

        <h4 className="text-white font-semibold">
          1. Open the door — but only for you (Security Group)
        </h4>
        <p>
          A <strong className="text-white">Security Group</strong> is a virtual firewall around the
          future instance. For this lab we only need one inbound rule:{' '}
          <strong className="text-white">SSH on port 22</strong>, and only from{' '}
          <em>your</em> IP address — not from the whole internet. Think: “which network addresses may
          knock on the door?”
        </p>

        <h4 className="text-white font-semibold">
          2. Create your house key (SSH key pair)
        </h4>
        <p>
          Even with the door open to your IP, AWS still needs a cryptographic key to let you in. Create
          a key pair named <span className="font-mono text-xs text-rose-300">ai-infra-key</span>. The
          private half is saved locally as{' '}
          <span className="font-mono text-xs text-rose-300">ai-infra-key.pem</span> — that file is your
          house key.
        </p>
        <pre className="text-[10px] font-mono text-gray-300 bg-gray-900/80 border border-gray-700 rounded-lg p-2 overflow-x-auto">
{`aws ec2 create-key-pair --key-name ai-infra-key \\
  --query 'KeyMaterial' --output text > ai-infra-key.pem`}
        </pre>

        <h4 className="text-white font-semibold">
          3. Lock the key file on your laptop (<span className="font-mono text-xs">chmod 400</span>)
        </h4>
        <p>
          <strong className="text-amber-300">Important:</strong> the{' '}
          <span className="font-mono text-xs text-rose-300">.pem</span> file is the only way to access
          the instance. If anyone else can read it, they can SSH in. So lock the file on your machine
          so only you can read it:
        </p>
        <pre className="text-[10px] font-mono text-gray-300 bg-gray-900/80 border border-gray-700 rounded-lg p-2">
          chmod 400 ai-infra-key.pem
        </pre>
        <p className="text-xs text-gray-400">
          Summary: Security Group = who may connect · Key pair = how you authenticate · chmod =
          protect the key file locally. Next we launch the instance using both the SG and the key
          name.
        </p>
        <p className="text-xs text-gray-400 italic">
          Walk steps 1 → 2 → 3 on the right to see each layer light up.
        </p>
      </div>
    ),
    Visual: SecurityAccessVisualizer,
  },
  {
    id: 'step3-launch',
    title: 'Step 3: Launching the GPU Instance',
    subtitle: 'AMI + type + key + SG → InstanceId',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Combine AMI, instance type, and security settings into one{' '}
          <span className="font-mono text-xs text-rose-300">aws ec2 run-instances</span> request:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <span className="font-mono text-xs">--image-id</span> — Deep Learning AMI
          </li>
          <li>
            <span className="font-mono text-xs">--instance-type</span> —{' '}
            <span className="font-mono text-rose-300">g4dn.xlarge</span> (GPU)
          </li>
          <li>
            <span className="font-mono text-xs">--key-name</span> — key from Step 2
          </li>
          <li>
            <span className="font-mono text-xs">--security-group-ids</span> — firewall group ID
          </li>
          <li>
            <span className="font-mono text-xs">--tag-specifications</span> — e.g.{' '}
            <span className="font-mono text-rose-300">AI-Infra-Lab-Instance</span>
          </li>
        </ul>
        <p>
          AWS returns JSON including an <span className="font-mono text-xs text-rose-300">InstanceId</span>{' '}
          you will need for management, SSH lookup, and termination.
        </p>
        <p className="text-xs text-gray-400 italic">
          Tap each CLI flag to assemble the command, then launch.
        </p>
      </div>
    ),
    Visual: LaunchInstanceVisualizer,
  },
  {
    id: 'step4-verify',
    title: 'Step 4: Connecting and Verifying the Setup',
    subtitle: 'Public IP → SSH → nvidia-smi → PyTorch',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Initialization takes a few minutes. Retrieve the public IP with your{' '}
          <span className="font-mono text-xs text-rose-300">InstanceId</span>:
        </p>
        <pre className="text-[10px] font-mono text-gray-300 bg-gray-900/80 border border-gray-700 rounded-lg p-2 overflow-x-auto">
{`aws ec2 describe-instances --instance-ids i-012345abcdef \\
  --query 'Reservations[].Instances[].PublicIpAddress' --output text`}
        </pre>
        <p>
          SSH in (Ubuntu AMIs use user <span className="font-mono text-xs text-rose-300">ubuntu</span>):
        </p>
        <pre className="text-[10px] font-mono text-rose-300 bg-gray-900/80 border border-gray-700 rounded-lg p-2 overflow-x-auto">
          ssh -i &quot;ai-infra-key.pem&quot; ubuntu@YOUR_INSTANCE_PUBLIC_IP
        </pre>
        <p>
          First check: <span className="font-mono text-xs text-rose-300">nvidia-smi</span> — should show
          driver, CUDA, and a <strong className="text-white">Tesla T4</strong>.
        </p>
        <p>
          Final check: run a small PyTorch script (
          <span className="font-mono text-xs text-rose-300">python3 verify_gpu.py</span>) that creates a
          tensor on <span className="font-mono text-xs">cuda</span> and prints the device name.
        </p>
        <p className="text-xs text-gray-400 italic">
          Step through the terminal workflow on the right.
        </p>
      </div>
    ),
    Visual: ConnectVerifyVisualizer,
  },
  {
    id: 'step5-term',
    title: 'Step 5: Terminating the Instance (Important)',
    subtitle: 'Stopped still bills EBS — terminate to stop all charges',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Cloud resources incur costs while they exist. A{' '}
          <strong className="text-amber-300">stopped</strong> instance may stop compute charges, but
          its storage volume (EBS) is <em>still billed</em>.
        </p>
        <p>
          To stop all billing you must <strong className="text-rose-300">terminate</strong> the
          instance. Termination is irreversible — data on the instance&apos;s local storage is
          permanently deleted.
        </p>
        <pre className="text-[10px] font-mono text-rose-300 bg-gray-900/80 border border-gray-700 rounded-lg p-2 overflow-x-auto">
{`# Replace with your InstanceId
aws ec2 terminate-instances --instance-ids i-012345abcdef`}
        </pre>
        <p>
          Termination schedules removal; afterward billing ceases. Double-check in the AWS Management
          Console — a core habit for cloud cost management.
        </p>
        <p className="text-xs text-gray-400 italic">
          Compare Running / Stopped / Terminated cost meters on the right.
        </p>
      </div>
    ),
    Visual: TerminateVisualizer,
  },
];

export default function LeveragingCloudPlatformsPart4() {
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-violet-400 to-rose-400" />

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
