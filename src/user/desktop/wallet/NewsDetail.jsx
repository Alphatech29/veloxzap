import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Newspaper, Sparkles } from 'lucide-react'
import useArticleContent from '../../../hooks/useArticleContent'
import { fmtDate } from '../../../utils/format'

const PROSE_CLASS = [
  'text-[14px] text-[var(--c-text)] leading-relaxed',
  '[&_p]:m-0 [&_p]:mb-3.5',
  '[&_a]:text-brand-accent [&_a]:underline [&_a]:underline-offset-2',
  '[&_img]:w-full [&_img]:rounded-xl [&_img]:my-3.5',
  '[&_figcaption]:text-[11px] [&_figcaption]:text-[var(--c-text-muted)] [&_figcaption]:-mt-2.5 [&_figcaption]:mb-3.5',
  '[&_h2]:text-[16px] [&_h2]:font-bold [&_h2]:text-[var(--c-text)] [&_h2]:mt-5 [&_h2]:mb-2',
  '[&_h3]:text-[14.5px] [&_h3]:font-bold [&_h3]:text-[var(--c-text)] [&_h3]:mt-4 [&_h3]:mb-1.5',
  '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3.5 [&_li]:mb-1',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-brand-accent [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-[var(--c-text-muted)] [&_blockquote]:my-3.5',
].join(' ')

export default function DesktopNewsDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const article = location.state?.article
  const { article: fullArticle, loading: contentLoading } = useArticleContent(article?.url)

  return (
    <div className="flex flex-col gap-4 max-w-[860px] mx-auto pb-8">

      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/user/wallet')}
          aria-label="Back to wallet"
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-accent-border)] transition shrink-0"
        >
          <ArrowLeft size={15} />
        </button>
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
            Blockchain news
          </p>
          <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[var(--c-text)] m-0 mt-1">News</h1>
        </div>
      </header>

      {!article ? (
        <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-[13px] text-[var(--c-text-muted)] m-0">
            Open this article from the blockchain news list to see its details.
          </p>
          <button
            type="button"
            onClick={() => navigate('/user/wallet')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[12px] font-bold border border-[rgba(232,197,71,0.55)] hover:-translate-y-px transition"
          >
            Back to wallet
          </button>
        </article>
      ) : (
        <article className="rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-6 flex flex-col gap-4">
          {article.image ? (
            <img
              src={article.image}
              alt=""
              className="w-full h-[280px] object-cover rounded-2xl border border-[var(--c-border)]"
            />
          ) : (
            <div className="w-full h-[280px] rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] flex items-center justify-center text-[var(--c-text-faint)]">
              <Newspaper size={32} />
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            {article.categories?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {article.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)]"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[var(--c-text)] leading-snug m-0">
              {article.title}
            </h1>

            <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--c-text-muted)]">
              <span className="font-semibold text-[var(--c-text)]">{article.source}</span>
              {(fullArticle?.byline || article.author) && <span>· {fullArticle?.byline || article.author}</span>}
              {article.publishedAt && <span>· {fmtDate(article.publishedAt)}</span>}

            </div>
          </div>

          {contentLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} aria-hidden className="h-2.5 rounded bg-[var(--c-surface-soft)] animate-pulse" style={{ width: `${90 - (i % 3) * 15}%` }} />
              ))}
            </div>
          ) : fullArticle?.content ? (
            <div className={PROSE_CLASS} dangerouslySetInnerHTML={{ __html: fullArticle.content }} />
          ) : article.description ? (
            <p className="text-[14px] text-[var(--c-text)] leading-relaxed m-0">
              {article.description}
            </p>
          ) : null}
        </article>
      )}
    </div>
  )
}
