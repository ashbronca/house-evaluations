import fs from 'fs'
import path from 'path'

export interface EvaluationMeta {
  slug: string
  address: string
  estimatedValue: string
  confidence: string
  confidenceLevel: 'High' | 'Medium' | 'Low' | 'Unknown'
  verdict: string
  watchouts: string[]
}

export interface Evaluation extends EvaluationMeta {
  content: string
}

const evaluationsDir = path.join(process.cwd(), 'evaluations')

function parseSummary(content: string): Partial<EvaluationMeta> {
  const result: Partial<EvaluationMeta> = {}

  const titleMatch = content.match(/^# (?:Property Analysis: |Property Snapshot: )?(.+)$/m)
  if (titleMatch) result.address = titleMatch[1].trim()

  const valueMatch = content.match(/\|\s*\*\*Estimated value\*\*\s*\|\s*(.+?)\s*\|/)
  if (valueMatch) result.estimatedValue = valueMatch[1].replace(/\*\*/g, '').trim()

  const confMatch = content.match(/\|\s*\*\*Confidence\*\*\s*\|\s*(.+?)\s*\|/)
  if (confMatch) {
    result.confidence = confMatch[1].trim()
    const level = result.confidence.split(/\s*[—–-]/)[0].trim()
    result.confidenceLevel = (level === 'High' || level === 'Medium' || level === 'Low') ? level : 'Unknown'
  }

  const verdictMatch = content.match(/\|\s*\*\*Verdict\*\*\s*\|\s*(.+?)\s*\|/)
  if (verdictMatch) result.verdict = verdictMatch[1].trim()

  const watchoutsMatch = content.match(/\*\*Top 3 watchouts:\*\*\n([\s\S]+?)(?:\n\n|\n---|\n#)/)
  if (watchoutsMatch) {
    result.watchouts = watchoutsMatch[1]
      .split('\n')
      .filter(line => /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim())
      .slice(0, 3)
  }

  return result
}

export function getAllEvaluations(): EvaluationMeta[] {
  if (!fs.existsSync(evaluationsDir)) return []

  return fs.readdirSync(evaluationsDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse()
    .map(filename => {
      const slug = filename.replace('.md', '')
      const content = fs.readFileSync(path.join(evaluationsDir, filename), 'utf-8')
      const parsed = parseSummary(content)
      return {
        slug,
        address: parsed.address ?? slug,
        estimatedValue: parsed.estimatedValue ?? 'Not available',
        confidence: parsed.confidence ?? 'Unknown',
        confidenceLevel: parsed.confidenceLevel ?? 'Unknown',
        verdict: parsed.verdict ?? '',
        watchouts: parsed.watchouts ?? [],
      }
    })
}

export function getEvaluation(slug: string): Evaluation | null {
  const filepath = path.join(evaluationsDir, `${slug}.md`)
  if (!fs.existsSync(filepath)) return null

  const content = fs.readFileSync(filepath, 'utf-8')
  const parsed = parseSummary(content)

  return {
    slug,
    address: parsed.address ?? slug,
    estimatedValue: parsed.estimatedValue ?? 'Not available',
    confidence: parsed.confidence ?? 'Unknown',
    confidenceLevel: parsed.confidenceLevel ?? 'Unknown',
    verdict: parsed.verdict ?? '',
    watchouts: parsed.watchouts ?? [],
    content,
  }
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(evaluationsDir)) return []
  return fs.readdirSync(evaluationsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
}
