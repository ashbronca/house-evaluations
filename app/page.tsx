import Link from 'next/link'
import { getAllEvaluations } from '@/lib/evaluations'

const confidenceStyle = {
  High: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Low: 'text-red-400 bg-red-400/10 border-red-400/20',
  Unknown: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
}

export default function Home() {
  const evaluations = getAllEvaluations()

  return (
    <main className="min-h-screen bg-gray-950">
      <header className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/60 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold tracking-tight text-white">Properties</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {evaluations.length} {evaluations.length === 1 ? 'evaluation' : 'evaluations'}
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {evaluations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-base">No evaluations yet</p>
            <p className="text-gray-600 text-sm mt-1">Add a property address in Claude Code to get started</p>
          </div>
        ) : (
          evaluations.map(e => (
            <Link key={e.slug} href={`/${e.slug}`} className="block">
              <article className="bg-gray-900 rounded-2xl p-5 border border-gray-800/80 active:bg-gray-800/80 transition-colors cursor-pointer">
                <h2 className="font-semibold text-white text-[15px] leading-snug">{e.address}</h2>

                <p className="text-emerald-400 font-bold text-xl mt-2 tracking-tight">
                  {e.estimatedValue}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${confidenceStyle[e.confidenceLevel]}`}>
                    {e.confidenceLevel} confidence
                  </span>
                </div>

                {e.verdict && (
                  <p className="text-gray-400 text-sm mt-3 leading-relaxed line-clamp-2">{e.verdict}</p>
                )}

                {e.watchouts.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {e.watchouts.map((w, i) => (
                      <li key={i} className="text-gray-500 text-xs flex gap-1.5">
                        <span className="text-amber-500 shrink-0">⚠</span>
                        <span className="line-clamp-1">{w}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Link>
          ))
        )}
      </div>
    </main>
  )
}
