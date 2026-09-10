import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MousePointerClick } from 'lucide-react';
import {
  ObjectStorageAnatomyVisualizer,
  ObjectProvidersVisualizer,
  ObjectIntegrationVisualizer,
  StorageTiersVisualizer,
  VpcAnatomyVisualizer,
  PerimeterSecurityVisualizer,
  ReferenceArchVisualizer,
  DistributedNetVisualizer,
} from '../components/CloudPlatformsPart3Visualizers';

export const meta = {
  title: 'Leveraging Cloud Platforms for AI (Part 3)',
  subtitle: 'Object storage, storage tiers, VPCs, and secure AI networking',
};

const GRID_BG =
  "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+\")";

const slidesData = [
  {
    id: 'object-anatomy',
    title: 'Object Storage Services for Datasets',
    subtitle: 'Decoupled compute + flat address space',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          On-premise systems often store data on disks attached to servers or on network file shares.
          Cloud environments prefer a <strong className="text-white">decoupled architecture</strong>,
          where compute and storage scale independently. The standard for housing massive machine
          learning datasets is <strong className="text-white">object storage</strong>.
        </p>
        <p>
          Unlike a hierarchical file system (NTFS, ext4) with nested directories, object storage
          manages data as self-contained units called <strong className="text-white">objects</strong>{' '}
          in a <strong className="text-white">flat address space</strong>. Each object has three
          components:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-sky-300">The data itself</strong> — any file type: images, video
            chunks, CSVs, model artifacts, and more.
          </li>
          <li>
            <strong className="text-violet-300">Metadata</strong> — key-value tags that describe the
            data, e.g.{' '}
            <span className="font-mono text-rose-300 text-xs">content-type: image/jpeg</span> or{' '}
            <span className="font-mono text-rose-300 text-xs">source: sensor-123</span>.
          </li>
          <li>
            <strong className="text-brand-orange">A unique identifier</strong> — a globally unique
            address used to retrieve the object via an API (HTTP{' '}
            <span className="font-mono text-xs">GET</span> and{' '}
            <span className="font-mono text-xs">PUT</span>).
          </li>
        </ul>
        <p>
          Think of it like <strong className="text-white">valet parking</strong>: you hand over your
          car (the data) and receive a ticket (the object ID). You do not need to know which floor or
          spot the car is parked in — only the ticket to retrieve it. That abstraction enables
          massive scale and durability.
        </p>
        <p>
          Structurally: a <strong className="text-white">Cloud Account</strong> contains a{' '}
          <strong className="text-amber-300">bucket</strong> (a globally unique namespace, e.g.{' '}
          <span className="font-mono text-xs">my-ml-dataset-bucket</span>), which contains many
          objects such as <span className="font-mono text-xs">cat_image.jpg</span>,{' '}
          <span className="font-mono text-xs">training_data_part1.parquet</span>, and{' '}
          <span className="font-mono text-xs">config/hyperparams.json</span> — each with data,
          metadata, and an ID.
        </p>
        <p className="text-xs text-gray-400 italic">
          Tap an object for data / metadata / ID — or flip to the valet ticket view.
        </p>
      </div>
    ),
    Visual: ObjectStorageAnatomyVisualizer,
  },
  {
    id: 'providers',
    title: 'Major Cloud Object Storage Services',
    subtitle: 'S3 · GCS · Blob — same principles, different vocabulary',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Each major cloud provider offers a flagship object storage service that serves as the
          foundation for its data and AI offerings:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-sky-300">Amazon Web Services (AWS):</strong> Simple Storage
            Service (S3)
          </li>
          <li>
            <strong className="text-emerald-300">Google Cloud Platform (GCP):</strong> Cloud Storage
            (GCS)
          </li>
          <li>
            <strong className="text-violet-300">Microsoft Azure:</strong> Blob Storage
          </li>
        </ul>
        <p>
          While their underlying principles are nearly identical, they use slightly different
          terminology:
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-700 text-[11px]">
          <table className="w-full text-left">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="p-2 font-semibold">Feature</th>
                <th className="p-2 font-semibold">AWS S3</th>
                <th className="p-2 font-semibold">GCS</th>
                <th className="p-2 font-semibold">Azure Blob</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              <tr className="border-t border-gray-700">
                <td className="p-2 text-white">Storage container</td>
                <td className="p-2">Bucket</td>
                <td className="p-2">Bucket</td>
                <td className="p-2">Container</td>
              </tr>
              <tr className="border-t border-gray-700 bg-gray-900/50">
                <td className="p-2 text-white">Unit of data</td>
                <td className="p-2">Object</td>
                <td className="p-2">Object</td>
                <td className="p-2">Blob (Block Blob)</td>
              </tr>
              <tr className="border-t border-gray-700">
                <td className="p-2 text-white">Uniqueness scope</td>
                <td className="p-2">Global (buckets)</td>
                <td className="p-2">Global (buckets)</td>
                <td className="p-2">Account (containers)</td>
              </tr>
              <tr className="border-t border-gray-700 bg-gray-900/50">
                <td className="p-2 text-white">Primary SDK</td>
                <td className="p-2 font-mono text-rose-300">Boto3</td>
                <td className="p-2 font-mono text-rose-300">google-cloud-storage</td>
                <td className="p-2 font-mono text-rose-300">azure-storage-blob</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          These services are built for <strong className="text-white">high durability</strong>, often
          replicating your data across multiple physical data centers within a region to protect
          against hardware failure. That level of data safety is difficult and expensive to achieve
          with an on-premise setup.
        </p>
        <p className="text-xs text-gray-400 italic">
          Switch providers for the terminology map; watch multi-AZ replicas appear.
        </p>
      </div>
    ),
    Visual: ObjectProvidersVisualizer,
  },
  {
    id: 'integrate',
    title: 'Integrating Object Storage with AI Workloads',
    subtitle: 'Prefixes, formats, egress, and IAM',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          The true power of object storage is its{' '}
          <strong className="text-white">direct integration</strong> with the AI/ML ecosystem. Modern
          frameworks and libraries can stream data directly from S3, GCS, or Blob Storage without
          first copying it to the local disk of your compute instance.
        </p>
        <h4 className="text-white font-semibold">Organization</h4>
        <p>
          While object stores have a flat structure, you can simulate directories using{' '}
          <strong className="text-white">prefixes</strong> in your object keys. For example:
        </p>
        <ul className="list-none space-y-1 font-mono text-xs text-rose-300 pl-1">
          <li>s3://my-bucket/dataset-v1/train/image-001.jpg</li>
          <li>s3://my-bucket/dataset-v1/test/image-555.jpg</li>
        </ul>
        <p>
          This provides a logical structure for organization and granular access control.
        </p>
        <h4 className="text-white font-semibold">Performance</h4>
        <p>
          Reading millions of tiny files from object storage can be inefficient due to the overhead
          of individual API requests. It is often better to consolidate your data into a smaller
          number of larger files. Formats like <strong className="text-white">Apache Parquet</strong>,{' '}
          <strong className="text-white">TFRecord</strong>, and{' '}
          <strong className="text-white">Petastorm</strong> are designed for this, enabling efficient,
          parallel reads of large datasets.
        </p>
        <h4 className="text-white font-semibold">Data egress costs &amp; security</h4>
        <p>
          A critical financial factor is <strong className="text-white">data egress</strong>. Moving
          data <em>into</em> an object store is almost always free. However, moving data{' '}
          <em>out</em> of the cloud provider&apos;s network — whether to the public internet or
          another cloud — incurs a cost. Be mindful of this when designing workflows that require
          frequent transfers between environments.
        </p>
        <p>
          Security is managed through <strong className="text-white">Identity and Access Management
          (IAM)</strong> policies, which grant granular read/write permissions to specific users or
          compute instances, ensuring datasets are only accessible by authorized services.
        </p>
        <p className="text-xs text-gray-400 italic">
          Flip between prefixes, tiny-vs-Parquet, and egress / IAM toggles.
        </p>
      </div>
    ),
    Visual: ObjectIntegrationVisualizer,
  },
  {
    id: 'tiers',
    title: 'Optimizing Cost with Storage Tiers',
    subtitle: 'Hot · Infrequent · Archive + lifecycle automation',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          A significant advantage of cloud object storage is the ability to{' '}
          <strong className="text-white">pay only for what you need</strong> through storage tiers.
          Not all data requires instant, frequent access. You can drastically reduce costs by
          matching your data&apos;s access patterns to the appropriate storage class.
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-sky-300">Standard (Hot) Tier:</strong> Designed for frequently
            accessed data. It offers the lowest latency but has the highest storage cost. This is the
            correct tier for your <strong className="text-white">active training and validation
            datasets</strong> that are read repeatedly during model development.
          </li>
          <li>
            <strong className="text-amber-300">Infrequent Access (IA) Tier:</strong> Optimized for
            data that is accessed less often but still needs rapid access when needed. It has a lower
            per-gigabyte storage price than Standard, but includes a{' '}
            <strong className="text-white">small fee for data retrieval</strong>. Suitable for older
            datasets, model checkpoints, or occasional analysis.
          </li>
          <li>
            <strong className="text-violet-300">Archive (Cold) Tier:</strong> Built for long-term
            archival at the lowest possible storage cost. Retrieval is not instant — it can take{' '}
            <strong className="text-white">minutes to several hours</strong>. Ideal for backing up
            raw source data or meeting long-term retention requirements.
          </li>
        </ul>
        <p>
          Most cloud providers offer <strong className="text-white">lifecycle policies</strong> —
          automated rules that transition objects between tiers. For example, move data from Standard
          to Infrequent Access after <strong className="text-brand-orange">60 days</strong>, then to
          Archive after <strong className="text-brand-orange">one year</strong>. This automates cost
          optimization without manual intervention.
        </p>
        <p className="text-xs text-gray-400 italic">
          Compare cost vs retrieval bars, then scrub the lifecycle day slider.
        </p>
      </div>
    ),
    Visual: StorageTiersVisualizer,
  },
  {
    id: 'vpc',
    title: 'Understanding Cloud Networking and VPCs',
    subtitle: 'Private slice · public/private subnets · route tables',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          When you provision a virtual machine in the cloud, it does not exist in a vacuum. It lives
          within a network that you define and control — a layer of isolation and security essential
          for any serious AI workload. This private slice of the cloud is a{' '}
          <strong className="text-white">Virtual Private Cloud (VPC)</strong> on AWS and GCP, or a{' '}
          <strong className="text-white">Virtual Network (VNet)</strong> on Azure. Think of it as
          your own virtual datacenter network: full authority over IP address space, subnets,
          routing, and security.
        </p>
        <p>
          Properly configuring your cloud network is fundamental. A poorly designed network can
          expose sensitive data and models, create performance bottlenecks that starve expensive GPUs
          of data, or lead to unexpected data transfer costs.
        </p>
        <h4 className="text-white font-semibold">VPC and subnets</h4>
        <p>
          A VPC is a logically isolated network. You assign it a private IP range using{' '}
          <strong className="text-white">CIDR</strong> notation, such as{' '}
          <span className="font-mono text-rose-300 text-xs">10.0.0.0/16</span> — over 65,000 private
          IPs your resources can use without exposing them to the public internet.
        </p>
        <p>
          Within the VPC you create <strong className="text-white">subnets</strong> — smaller
          partitions used to group resources by function and security:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-emerald-300">Public subnets:</strong> Resources can have public
            IPs and talk directly to the internet via an{' '}
            <strong className="text-white">Internet Gateway (IGW)</strong> attached to the VPC. The
            route table directs internet-bound traffic (
            <span className="font-mono text-rose-300 text-xs">0.0.0.0/0</span>) to the IGW.
          </li>
          <li>
            <strong className="text-rose-300">Private subnets:</strong> Standard for core AI
            workloads. No public IPs; not reachable from the internet. Outbound connections (updates,
            model pulls) use a <strong className="text-white">NAT Gateway</strong> in a public
            subnet — a one-way street; the internet cannot initiate connections back.
          </li>
        </ul>
        <h4 className="text-white font-semibold">Route tables</h4>
        <p>
          Every subnet is associated with a route table — the traffic controller of your VPC:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-white">Public:</strong>{' '}
            <span className="font-mono text-xs">10.0.0.0/16 → local</span>;{' '}
            <span className="font-mono text-xs">0.0.0.0/0 → Internet Gateway</span>
          </li>
          <li>
            <strong className="text-white">Private:</strong> same local route, but{' '}
            <span className="font-mono text-xs">0.0.0.0/0 → NAT Gateway</span>
          </li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          Toggle public, private, and route-table views inside the VPC bubble.
        </p>
      </div>
    ),
    Visual: VpcAnatomyVisualizer,
  },
  {
    id: 'perimeter',
    title: 'Securing Your Network Perimeter',
    subtitle: 'Security Groups (stateful) vs NACLs (stateless)',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Isolation is only part of the security story. You also need to control exactly what traffic
          is allowed to flow to and from your instances.
        </p>
        <h4 className="text-white font-semibold">Security Groups</h4>
        <p>
          A Security Group acts as a virtual firewall for your instances, controlling inbound and
          outbound traffic at the <strong className="text-white">instance level</strong>. Security
          Groups are <strong className="text-brand-orange">stateful</strong>: if you allow an inbound
          connection, the corresponding outbound traffic is automatically permitted, regardless of
          outbound rules.
        </p>
        <p>For a typical GPU training instance, you might configure inbound rules such as:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-white">SSH (Port 22):</strong> Allow connections only from your
            corporate network or a specific bastion host&apos;s IP — prevents unauthorized
            administrative access.
          </li>
          <li>
            <strong className="text-white">Custom TCP (Port 8888):</strong> If you run a Jupyter
            server on the instance, open this port and restrict it to a trusted IP address.
          </li>
        </ul>
        <p>
          By default, all inbound traffic is denied and all outbound traffic is allowed. Best
          practice is to lock down outbound rules as well, allowing connections only to the specific
          services you need.
        </p>
        <h4 className="text-white font-semibold">Network Access Control Lists (NACLs)</h4>
        <p>
          NACLs are an additional layer of security — a firewall at the{' '}
          <strong className="text-white">subnet level</strong>. Unlike Security Groups, NACLs are{' '}
          <strong className="text-brand-orange">stateless</strong>: you must explicitly define rules
          for <em>both</em> inbound and outbound traffic.
        </p>
        <p>
          For example, to allow an inbound request on port 80, you must also create an outbound rule
          for the corresponding ephemeral ports (
          <span className="font-mono text-xs">1024–65535</span>).
        </p>
        <p>
          Because of this complexity, most use cases are well-served by meticulously configured
          Security Groups, with NACLs left at their default (allow all) setting.
        </p>
        <p className="text-xs text-gray-400 italic">
          Toggle inbound rules — watch SG auto-return vs NACL needing an explicit outbound rule.
        </p>
      </div>
    ),
    Visual: PerimeterSecurityVisualizer,
  },
  {
    id: 'ref-arch',
    title: 'A Reference Architecture for AI Workloads',
    subtitle: 'Bastion → private GPUs → NAT / VPC Endpoint → inference',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          Let&apos;s put these components together into a common architecture for a machine learning
          project. This design prioritizes security by placing compute resources in{' '}
          <strong className="text-white">private subnets</strong> and controlling access tightly.
        </p>
        <p className="text-xs text-gray-400">
          The ML engineer accesses private resources through a bastion host. Training instances pull
          code from the internet via a NAT Gateway and access datasets from object storage through a
          secure VPC Endpoint — preventing data transfer over the public internet.
        </p>
        <ol className="list-decimal pl-5 space-y-2.5">
          <li>
            <strong className="text-white">Access:</strong> An engineer connects via SSH (port 22) to
            a hardened <strong className="text-violet-300">Bastion Host</strong> in the public
            subnet. This is the <em>only</em> entry point from the outside.
          </li>
          <li>
            <strong className="text-white">Development:</strong> From the bastion, the engineer SSHs
            into the <strong className="text-rose-300">GPU Training Instance(s)</strong> in the
            private subnet.
          </li>
          <li>
            <strong className="text-white">Outbound connections:</strong> The training instance
            downloads Python packages or base models (e.g. from PyPI). Traffic is routed through the{' '}
            <strong className="text-white">NAT Gateway</strong> then the Internet Gateway, masking
            the instance&apos;s private IP.
          </li>
          <li>
            <strong className="text-white">Data access:</strong> To load large datasets from S3/GCS,
            the instance uses a <strong className="text-sky-300">VPC Endpoint</strong> instead of the
            public internet. This creates a private, secure connection between the VPC and storage —
            improving security and potentially reducing data transfer costs.
          </li>
          <li>
            <strong className="text-white">Deployment:</strong> Once trained, the model is saved to
            object storage. A cost-effective{' '}
            <strong className="text-violet-300">CPU Inference Endpoint</strong> loads the final model
            via the same VPC Endpoint for serving.
          </li>
        </ol>
        <p className="text-xs text-gray-400 italic">
          Click steps 1–5 to highlight each path on the architecture map.
        </p>
      </div>
    ),
    Visual: ReferenceArchVisualizer,
  },
  {
    id: 'dist-net',
    title: 'Networking for Distributed Performance',
    subtitle: '100–200+ Gbps fabric + placement / colocation',
    content: (
      <div className="space-y-3 text-gray-300 text-sm leading-relaxed pr-1">
        <p>
          For large-scale distributed training jobs that span multiple instances, the network
          connecting those instances is just as important as the GPUs themselves. The constant
          exchange of <strong className="text-white">gradients</strong> between nodes can quickly
          become a bottleneck. Cloud providers offer specialized features to address this:
        </p>
        <ul className="list-disc pl-5 space-y-2.5">
          <li>
            <strong className="text-white">High-bandwidth instances:</strong> Major cloud providers
            offer instance families with network bandwidths of{' '}
            <strong className="text-brand-orange">100 Gbps, 200 Gbps, or even higher</strong>. When
            running distributed training, selecting these instances is{' '}
            <em>non-negotiable</em> for good performance.
          </li>
          <li>
            <strong className="text-white">Placement Groups (AWS) / Colocation (GCP / Azure):</strong>{' '}
            These features let you request that instances be placed in{' '}
            <strong className="text-white">close physical proximity</strong> within a single
            datacenter. That dramatically reduces communication latency between nodes — a significant
            factor in distributed training performance.
          </li>
        </ul>
        <p>
          By combining high-bandwidth instances with a low-latency placement strategy, you ensure
          your compute cluster can communicate efficiently, keeping your expensive GPUs fully
          utilized rather than idle while waiting for data over the network.
        </p>
        <p className="text-xs text-gray-400 italic">
          Toggle bandwidth and placement — watch utilization and node spacing change.
        </p>
      </div>
    ),
    Visual: DistributedNetVisualizer,
  },
];

export default function LeveragingCloudPlatformsPart3() {
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
