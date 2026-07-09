import Link from 'next/link'
import { MapPin, Calendar, Clock, CheckCircle, Hammer } from 'lucide-react'
import { format } from 'date-fns'

export interface Project {
  id: string
  title: string
  slug: string
  description?: string
  status: 'ongoing' | 'upcoming' | 'completed'
  image_url?: string
  location?: string
  start_date?: string
  end_date?: string
  is_published: boolean
  created_at: string
}

const STATUS_CONFIG = {
  ongoing: {
    label: 'Ongoing',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Hammer,
    dot: 'bg-blue-500',
  },
  upcoming: {
    label: 'Upcoming',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock,
    dot: 'bg-amber-500',
  },
  completed: {
    label: 'Completed',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
    dot: 'bg-emerald-500',
  },
}

export default function ProjectCard({ project }: { project: Project }) {
  const config = STATUS_CONFIG[project.status]
  const Icon   = config.icon

  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <article className="card overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-primary-100">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-700 to-primary-900">
              <Hammer size={36} className="text-white/30" />
            </div>
          )}
          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border font-body ${config.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display text-lg font-semibold text-primary-800 group-hover:text-primary-600 transition-colors leading-tight mb-2">
            {project.title}
          </h3>

          {project.description && (
            <p className="text-sm text-gray-600 font-body leading-relaxed line-clamp-2 flex-1">
              {project.description}
            </p>
          )}

          <div className="mt-3 space-y-1.5">
            {project.location && (
              <div className="flex items-center gap-2 text-xs text-gray-500 font-body">
                <MapPin size={12} className="text-gold-500 flex-shrink-0" />
                {project.location}
              </div>
            )}
            {project.start_date && (
              <div className="flex items-center gap-2 text-xs text-gray-500 font-body">
                <Calendar size={12} className="text-gold-500 flex-shrink-0" />
                {format(new Date(project.start_date), 'MMM yyyy')}
                {project.end_date && ` – ${format(new Date(project.end_date), 'MMM yyyy')}`}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-primary-600 font-semibold font-body group-hover:text-primary-500">
              View details →
            </span>
            <Icon size={14} className={`${config.color.split(' ')[1]}`} />
          </div>
        </div>
      </article>
    </Link>
  )
}