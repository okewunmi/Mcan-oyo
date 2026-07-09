import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProjectCard, { type Project } from '@/components/ProjectCard'
import { Hammer } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Community development projects by MCAN Oyo State.',
}

async function getProjects() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  return (data || []) as Project[]
}

export default async function ProjectsPage() {
  const projects  = await getProjects()
  const ongoing   = projects.filter(p => p.status === 'ongoing')
  const upcoming  = projects.filter(p => p.status === 'upcoming')
  const completed = projects.filter(p => p.status === 'completed')

  return (
    <div>
      <section className="islamic-bg-dark py-14 px-4 text-center">
        <span className="section-label text-gold-300">Community Development</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-3">Our Projects</h1>
        <p className="text-green-200 font-body max-w-xl mx-auto text-sm leading-relaxed">
          Mosque renovations, Arabic schools, infrastructure — serving communities across Oyo State.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-14">

        {projects.length === 0 && (
          <div className="text-center py-20">
            <Hammer size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-body">Projects will be posted soon.</p>
          </div>
        )}

        {ongoing.length > 0 && (
          <section>
            <div className="mb-6">
              <span className="section-label">In Progress</span>
              <h2 className="section-title mt-1">Ongoing Projects</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ongoing.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </section>
        )}

        {upcoming.length > 0 && (
          <section>
            <div className="mb-6">
              <span className="section-label">Coming Soon</span>
              <h2 className="section-title mt-1">Upcoming Projects</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </section>
        )}

        {completed.length > 0 && (
          <section>
            <div className="mb-6">
              <span className="section-label">Completed</span>
              <h2 className="section-title mt-1">Past Projects</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {completed.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}