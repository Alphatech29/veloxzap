import { useLocation, useNavigate } from 'react-router-dom'
import { ExternalLink, Newspaper } from 'lucide-react'
import useArticleContent from '../../../hooks/useArticleContent'
import { fmtDate } from '../../../utils/format'
import MobilePageHeader from '../../../components/partials/MobilePageHeader'

const PROSE_CLASS = [
  'text-[13px] text-[var(--c-text)] leading-relaxed',
  '[&_p]:m-0 [&_p]:mb-3',
  '[&_a]:text-brand-accent [&_a]:underline [&_a]:underline-offset-2',
  '[&_img]:w-full [&_img]:rounded-xl [&_img]:my-3',
  '[&_figcaption]:text-[10.5px] [&_figcaption]:text-[var(--c-text-muted)] [&_figcaption]:-mt-2 [&_figcaption]:mb-3',
  '[&_h2]:text-[15px] [&_h2]:font-bold [&_h2]:text-[var(--c-text)] [&_h2]:mt-4 [&_h2]:mb-2',
  '[&_h3]:text-[13.5px] [&_h3]:font-bold [&_h3]:text-[var(--c-text)] [&_h3]:mt-3 [&_h3]:mb-1.5',
  '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:mb-1',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-brand-accent [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-[var(--c-text-muted)] [&_blockquote]:my-3',
].join(' ')

export default function MobileNewsDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const article = location.state?.article
  const { article: fullArticle, loading: contentLoading } = useArticleContent(article?.url)

  return (
    <div className="flex flex-col gap-4">
      <MobilePageHeader title="News" />

      {!article ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-[12px] text-[var(--c-text-muted)] m-0">
            Open this article from the blockchain news list to see its details.
          </p>
          <button
            type="button"
            onClick={() => navigate('/user/wallet')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[12px] font-bold border border-[rgba(232,197,71,0.55)] active:scale-[0.98] transition"
          >
            Back to wallet
          </button>
        </div>
      ) : (
        <>
          {article.image ? (
            <img
              src={article.image}
              alt=""
              className="w-full h-[180px] object-cover rounded-2xl border border-[var(--c-border)]"
            />
          ) : (
            <div className="w-full h-[180px] rounded-2xl bg-[var(--c-surface-soft)] border border-[var(--c-border)] flex items-center justify-center text-[var(--c-text-faint)]">
              <Newspaper size={28} />
            </div>
          )}

          <div className="flex flex-col gap-2">
            {article.categories?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {article.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)]"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-[18px] font-bold tracking-[-0.3px] text-[var(--c-text)] leading-snug m-0">
              {article.title}
            </h1>

            <div className="flex items-center gap-1.5 text-[10.5px] text-[var(--c-text-muted)]">
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
            <p className="text-[13px] text-[var(--c-text)] leading-relaxed m-0">
              {article.description}
            </p>
          ) : null}


        </>
      )}
    </div>
  )
}
