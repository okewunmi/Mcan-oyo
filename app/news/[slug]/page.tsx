import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar, ArrowLeft, User, Tag } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

async function getArticle(slug: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('news').select('*').eq('slug', slug).eq('is_published', true).single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug)
  if (!article) return { title: 'Not Found' }
  return {
    title: article.title,
    description: article.excerpt || article.title,
    openGraph: { images: article.image_url ? [article.image_url] : [] },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const article = await getArticle(params.slug)
  if (!article) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/news" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-700 font-body mb-6 transition-colors">
        <ArrowLeft size={15} /> Back to News
      </Link>

      <article className="card overflow-hidden">
        {article.image_url && (
          <div className="h-56 sm:h-80 overflow-hidden">
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="badge-primary capitalize">{article.category}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-800 mb-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-400 font-body mb-6 pb-6 border-b border-gray-100 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gold-500" />
              {format(new Date(article.published_at), 'MMMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-gold-500" />
              {article.author}
            </span>
          </div>

          {article.excerpt && (
            <p className="text-lg text-gray-600 font-body leading-relaxed mb-6 italic border-l-4 border-primary-200 pl-4">
              {article.excerpt}
            </p>
          )}

          {article.content && (
            <div className="prose max-w-none font-body text-gray-700 leading-relaxed whitespace-pre-line">
              {article.content}
            </div>
          )}
        </div>
      </article>

      <div className="mt-8 text-center">
        <Link href="/news" className="btn-outline text-sm">← Back to News</Link>
      </div>
    </div>
  )
}