import Link from 'next/link'
import { marked } from 'marked'
import { getEvaluation, getAllSlugs } from '@/lib/evaluations'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export default function EvaluationPage({ params }: { params: { slug: string } }) {
  const evaluation = getEvaluation(params.slug)
  if (!evaluation) notFound()

  const html = marked.parse(evaluation.content) as string

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/60 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="text-gray-400 text-sm flex items-center gap-1.5 active:text-gray-200">
            <span>←</span>
            <span>All properties</span>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <article
          className="prose prose-invert prose-sm max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-2xl prose-h1:text-white prose-h1:mb-4
            prose-h2:text-lg prose-h2:text-white prose-h2:mt-8 prose-h2:mb-3
            prose-h3:text-base prose-h3:text-gray-200 prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-table:text-sm prose-table:w-full
            prose-thead:border-b prose-thead:border-gray-700
            prose-tr:border-b prose-tr:border-gray-800/60
            prose-td:text-gray-300 prose-td:py-2 prose-td:pr-4
            prose-th:text-gray-200 prose-th:font-semibold prose-th:py-2 prose-th:pr-4
            prose-blockquote:border-l-2 prose-blockquote:border-amber-500/50 prose-blockquote:text-gray-400 prose-blockquote:not-italic
            prose-code:text-emerald-300 prose-code:bg-gray-800/80 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:font-normal
            prose-li:text-gray-300 prose-li:my-0.5
            prose-hr:border-gray-800"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
