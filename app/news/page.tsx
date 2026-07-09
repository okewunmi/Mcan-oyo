import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Newspaper, Calendar, Tag } from 'lucide-react'
import { format } from 'date-fns'

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news and updates from MCAN Oyo State.',
}

const CATEGORIES = ['general', 'da\'wah', 'community', 'announcement', 'achievement']

async function getNews(category?: string) {
  const supabase = createServerSupabaseClient()
  let query = supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (category && category !== 'all') query = query.eq('category', category)

  const { data } = await query
  return data || []
}

interface PageProps { searchParams: { category?: string } }

export default async function NewsPage({ searchParams }: PageProps) {
  const activeCategory = searchParams.category || 'all'
  const news = await getNews(activeCategory)

  const featured = news[0]
  const rest      = news.slice(1)

  return (
    <div>
      <section className="islamic-bg-dark py-14 px-4 text-center">
        <span className="section-label text-gold-300">Stay Informed</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-3">News & Updates</h1>
        <p className="text-green-200 font-body max-w-xl mx-auto text-sm">
          Latest news, announcements, and updates from MCAN Oyo State.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {['all', ...CATEGORIES].map(cat => (
            <Link
              key={cat}
              href={cat === 'all' ? '/news' : `/news?category=${cat}`}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium border transition-all capitalize ${
                activeCategory === cat
                  ? 'bg-primary-700 text-white border-primary-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700'
              }`}
            >
              {cat === 'all' ? 'All News' : cat}
            </Link>
          ))}
        </div>

        {news.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-body">No news posted yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured */}
            {featured && (
              <Link href={`/news/${featured.slug}`} className="block group">
                <article className="card overflow-hidden lg:flex">
                  <div className="lg:w-2/5 h-56 lg:h-auto overflow-hidden bg-primary-100 flex-shrink-0">
                    {featured.image_url ? (
                      <img src={featured.image_url} alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-700 to-primary-900">
                        <Newspaper size={40} className="text-white/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 lg:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge-primary">Featured</span>
                      <span className="badge-gold capitalize">{featured.category}</span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-800 group-hover:text-primary-600 transition-colors leading-tight mb-3">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-gray-600 font-body text-sm leading-relaxed line-clamp-3 mb-4">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-body">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {format(new Date(featured.published_at), 'MMMM d, yyyy')}
                      </span>
                      <span>By {featured.author}</span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map(item => (
                  <Link key={item.id} href={`/news/${item.slug}`} className="block group">
                    <article className="card overflow-hidden h-full flex flex-col">
                      <div className="h-44 overflow-hidden bg-primary-50 flex-shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-700 to-primary-900">
                            <Newspaper size={28} className="text-white/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <span className="badge-primary capitalize text-xs mb-2 inline-block">{item.category}</span>
                        <h3 className="font-display text-lg font-semibold text-primary-800 group-hover:text-primary-600 transition-colors leading-tight line-clamp-2 flex-1">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-xs text-gray-500 font-body mt-2 line-clamp-2">{item.excerpt}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400 font-body">
                          <Calendar size={11} />
                          {format(new Date(item.published_at), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}