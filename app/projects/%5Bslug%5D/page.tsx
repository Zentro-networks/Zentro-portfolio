import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Cpu, Database, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { Github } from '../../../components/shared/Icons';
import { projects } from '../../../data/projects';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for optimal pre-rendering
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Dynamic SEO metadata creation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: `${project.title} Case Study`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Technical Case Study`,
      description: project.description,
      type: 'article',
    },
  };
}

export default async function ProjectCaseStudy({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="min-h-screen pt-28 pb-20 px-4 max-w-5xl mx-auto z-10 relative">
      {/* Back to Home Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* Header Info */}
      <header className="border-b border-zinc-900 pb-8 mb-12">
        <span className="text-[10px] text-accent uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-900 border border-accent/20">
          {project.category}
        </span>
        <h1 className="font-display font-bold text-4xl md:text-6xl text-white mt-4 tracking-tight leading-tight">
          {project.title}
        </h1>
        <p className="text-sm md:text-lg text-accent/80 font-semibold mt-2">
          {project.subtitle}
        </p>

        {/* Tags and Links */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center mt-6">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white transition-all"
              >
                <Github className="w-4 h-4" />
                Repository
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-xs font-bold text-white transition-all shadow-lg hover:shadow-primary/20"
              >
                <ExternalLink className="w-4 h-4" />
                Live Application
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Case Study narrative (8 cols) */}
        <div className="lg:col-span-8 space-y-12">
          {/* Executive Outcome */}
          <section className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-400">
            <h2 className="text-xs uppercase font-bold tracking-wider mb-2 text-emerald-500">
              Project Impact Metric
            </h2>
            <p className="text-sm font-medium leading-relaxed">{project.outcome}</p>
          </section>

          {/* Overview */}
          <section>
            <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Project Overview
            </h2>
            <p className="text-xs md:text-sm text-muted leading-relaxed whitespace-pre-line">
              {project.longDescription}
            </p>
          </section>

          {/* Problem Statement */}
          <section>
            <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" /> Bottleneck Challenge
            </h2>
            <p className="text-xs md:text-sm text-muted leading-relaxed">
              {project.problem}
            </p>
          </section>

          {/* Solution */}
          <section>
            <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" /> Implemented Solution
            </h2>
            <p className="text-xs md:text-sm text-muted leading-relaxed">
              {project.solution}
            </p>
          </section>

          {/* Key Features List */}
          <section>
            <h2 className="font-display font-bold text-xl text-white mb-4">Core Specifications</h2>
            <ul className="space-y-3.5 pl-4">
              {project.features.map((feature, idx) => (
                <li key={idx} className="text-xs md:text-sm text-muted list-disc marker:text-accent leading-relaxed">
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          {/* Challenges & Takeaways */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-900 pt-8">
            <div>
              <h3 className="font-display font-bold text-sm text-white mb-2">Technical Challenge</h3>
              <p className="text-xs text-muted leading-relaxed">{project.challenges}</p>
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white mb-2">Architectural Takeaway</h3>
              <p className="text-xs text-muted leading-relaxed">{project.lessonsLearned}</p>
            </div>
          </section>
        </div>

        {/* Right Side: Architecture & DB specs (4 cols) */}
        <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
          {/* Architecture Panel */}
          <div className="rounded-xl glass-panel p-6 border border-white/5">
            <h3 className="font-display font-bold text-sm text-white mb-4 flex items-center gap-2 pb-2 border-b border-zinc-900">
              <Cpu className="w-4 h-4 text-primary" />
              System Architecture
            </h3>
            <div className="text-[11px] text-muted leading-relaxed whitespace-pre-line font-mono bg-zinc-950/50 p-4 rounded-lg border border-zinc-900">
              {project.architecture}
            </div>
          </div>

          {/* Database design Schema if exists */}
          {project.dbDesign && (
            <div className="rounded-xl glass-panel p-6 border border-white/5">
              <h3 className="font-display font-bold text-sm text-white mb-4 flex items-center gap-2 pb-2 border-b border-zinc-900">
                <Database className="w-4 h-4 text-accent" />
                Data Schemas Design
              </h3>
              <div className="text-[11px] text-muted leading-relaxed whitespace-pre-line font-mono bg-zinc-950/50 p-4 rounded-lg border border-zinc-900">
                {project.dbDesign}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
