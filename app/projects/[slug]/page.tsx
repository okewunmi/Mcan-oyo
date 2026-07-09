import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { MapPin, Calendar, ArrowLeft, Hammer, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Project } from '@/components/ProjectCard'

interface Props { params: { slug: string } }

async function getProject(slug: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('projects').select('*').eq('slug', slug).eq('is_published', true).single()
  return data as Project | null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject(params.slug)
  if (!p) return { title: 'Project Not Found' }
  return { title: p.title, description: p.description || `MCAN Oyo project: ${p.title}` }
}

const STATUS_LABELS = {
  ongoing:   { label: 'Ongoing',   color: 'bg-blue-100 text-blue-700',     icon: Hammer },
  upcoming:  { label: 'Upcoming',  color: 'bg-amber-100 text-amber-700',   icon: Clock },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProject(params.slug)
  if (!project) notFound()

  const cfg  = STATUS_LABELS[project.status]
  const Icon = cfg.icon

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-700 font-body mb-6 transition-colors">
        <ArrowLeft size={15} /> All Projects
      </Link>

      <article className="card overflow-hidden">
        {project.image_url && (
          <div className="h-56 sm:h-72 overflow-hidden">
            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 sm:p-8">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full font-body mb-4 ${cfg.color}`}>
            <Icon size={12} /> {cfg.label}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-800 mb-5 leading-tight">
            {project.title}
          </h1>
          <div className="grid sm:grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
            {project.location && (
              <div className="flex items-center gap-2.5 text-sm text-gray-600 font-body">
                <MapPin size={16} className="text-gold-500" /> {project.location}
              </div>
            )}
            {project.start_date && (
              <div className="flex items-center gap-2.5 text-sm text-gray-600 font-body">
                <Calendar size={16} className="text-gold-500" />
                {format(new Date(project.start_date), 'MMMM yyyy')}
                {project.end_date && ` – ${format(new Date(project.end_date), 'MMMM yyyy')}`}
              </div>
            )}
          </div>
          {project.description && (
            <p className="font-body text-gray-700 leading-relaxed whitespace-pre-line">{project.description}</p>
          )}
        </div>
      </article>

      <div className="mt-8 text-center">
        <Link href="/projects" className="btn-outline text-sm">← Back to Projects</Link>
      </div>
    </div>
  )
}