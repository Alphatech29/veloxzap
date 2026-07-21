import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { QRCodeCanvas } from 'qrcode.react'
import { toPng } from 'html-to-image'
import { ChevronRight, Copy, Check, AlertTriangle, Info, Clock, ShieldCheck, Sparkles, Download, ReceiptText, Sun, Moon } from 'lucide-react'
import useCrypto from '../../../hooks/useCrypto'
import { useTheme } from '../../../hooks/useTheme'
import { COINS } from '../../../constants/crypto'
import BottomSheet from '../../../components/internalUI/BottomSheet'
import MobilePageHeader from '../../../components/partials/MobilePageHeader'
import { useAlert } from '../../../components/ui/Alert'

const CARD_BG_DARK = `radial-gradient(320px 160px at 15% -10%, rgba(201, 162, 39, 0.28), transparent 60%), linear-gradient(160deg, rgba(16, 36, 80, 1), rgba(6, 18, 44, 1))`
const CARD_BG_LIGHT = `radial-gradient(320px 160px at 15% -10%, rgba(201, 162, 39, 0.16), transparent 60%), linear-gradient(160deg, #ffffff, #f2efe6)`

function chainForAsset(asset) {
  if (asset === 'BTC') return 'BTC'
  if (asset === 'USDT_TRC20') return 'TRON'
  if (asset === 'USDC_SOL') return 'SOL'
  return null
}

function shortNetwork(variant) {
  return variant.network ? variant.network.split(' ')[0] : variant.symbol
}


const BLOCK_TIME_SECONDS = { BTC: 600, TRON: 3 }

function formatArrival(chain, confirmations) {
  if (chain === 'SOL') return '~30s'
  if (!chain || !confirmations || !BLOCK_TIME_SECONDS[chain]) return null
  const seconds = confirmations * BLOCK_TIME_SECONDS[chain]
  const minutes = Math.round(seconds / 60)
  if (minutes < 1) return `~${seconds}s`
  if (minutes < 60) return `~${minutes} min`
  return `~${Math.round(minutes / 60)} hr`
}

const HERO_BG = `radial-gradient(420px 180px at 110% -10%, rgba(201, 162, 39, 0.30), transparent 60%), linear-gradient(135deg, rgba(20, 42, 92, 0.96), rgba(10, 31, 68, 1))`

export default function MobileCoinInfo() {
  const navigate = useNavigate()
  const { symbol } = useParams()
  const { theme } = useTheme()
  const { alert } = useAlert()
  const { addresses, config, addressesLoading, configLoading } = useCrypto()
  const [copied, setCopied] = useState(false)
  const [selected, setSelected] = useState(null)
  const [cardTheme, setCardTheme] = useState(() => theme)
  const qrRef = useRef(null)

  // Which networks a coin has is static (from COINS), not dependent on the
  // balances API call — so this, and the network sheet's open state, are
  // known synchronously on first render instead of waiting on a query.
  const variants = useMemo(
    () => COINS.filter(c => c.symbol.toLowerCase() === (symbol || '').toLowerCase()),
    [symbol]
  )
  const primary = variants[0]
  const variant = selected != null ? variants[selected] : (variants.length === 1 ? variants[0] : null)

  // Single-network coins need no picker. Multi-network coins (e.g. USDT)
  // open the network bottom sheet immediately — too easy to send funds on
  // the wrong chain to just default to one.
  const [networkSheetOpen, setNetworkSheetOpen] = useState(() => variants.length > 1)

  function handlePickNetwork(index) {
    setSelected(index)
    setNetworkSheetOpen(false)
  }

  const chain = variant ? chainForAsset(variant.asset) : null
  const addressRow = chain ? addresses.find(a => a.chain === chain) : null
  const ready = Boolean(addressRow)
  const minDeposit = variant ? config?.minDeposit?.[variant.asset] : null
  const confirmations = chain ? config?.confirmations?.[chain] : null
  const arrival = chain ? formatArrival(chain, confirmations) : null

  function handleCopy() {
    if (!addressRow) return
    if (navigator.clipboard) navigator.clipboard.writeText(addressRow.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const [savePreviewOpen, setSavePreviewOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const cardRef = useRef(null)

  async function handleSavePicture() {
    const node = cardRef.current
    if (!node || !variant) return
    setSaving(true)
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2 })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${variant.symbol}-${chain || 'address'}-deposit.png`
      link.click()
      setSavePreviewOpen(false)
    } catch {
      alert({ type: 'error', title: 'Could not save image', message: 'Something went wrong while generating the picture. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <MobilePageHeader
        title={`${primary ? primary.name : (symbol || '').toUpperCase()} · Deposit`}
        rightIcon={ReceiptText}
        rightLabel="Deposit history"
        onRightClick={() => navigate('/user/wallet/history')}
      />

      {!primary ? (
        <p className="text-[12px] text-[var(--c-text-muted)]">Coin not found.</p>
      ) : (
        <>
          <article className="relative overflow-hidden rounded-2xl border border-[rgba(201,162,39,0.28)] shadow-[0_18px_44px_-14px_rgba(2,7,23,0.5)]">
            {/* Header band */}
            <div className="relative overflow-hidden p-4" style={{ background: HERO_BG }}>
              <span aria-hidden className="pointer-events-none absolute -top-10 -right-10 w-[140px] h-[140px] rounded-full bg-brand-accent/[0.16] blur-2xl" />
              <div className="relative flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <img src={(variant || primary).icon} alt={(variant || primary).symbol} className="w-9 h-9 rounded-full border border-white/20" />
                  <div className="leading-tight">
                    <p className="text-[13px] font-bold text-white m-0">{(variant || primary).name}</p>
                    <p className="text-[10px] text-white/60 m-0 mt-0.5">
                      {variant ? (variant.network || `${variant.symbol} network`) : 'Select chain'}
                    </p>
                  </div>
                </div>
                {chain && (
                  <span className={[
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-[0.6px]',
                    ready ? 'bg-[rgba(16,185,129,0.16)] text-[#34d399]' : 'bg-[rgba(245,158,11,0.16)] text-[#fbbf24]',
                  ].join(' ')}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ready ? 'bg-[#34d399]' : 'bg-[#fbbf24]'}`} />
                    {ready ? 'Ready' : 'Generating'}
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="bg-[var(--c-surface)]">
              {variants.length > 1 && variant && (
                <button
                  type="button"
                  onClick={() => setNetworkSheetOpen(true)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--c-border)] active:bg-[var(--c-surface-soft)] transition"
                >
                  <span className="text-[11px] font-semibold text-[var(--c-text)]">
                    Network · <span className="text-brand-accent">{shortNetwork(variant)}</span>
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10.5px] font-bold text-brand-accent">
                    Change <ChevronRight size={12} />
                  </span>
                </button>
              )}

              {!variant ? (
                <div className="flex flex-col items-center gap-3 p-8 text-center">
                  <p className="text-[11.5px] text-[var(--c-text-muted)] m-0">
                    Choose a chain to view its deposit address.
                  </p>
                  <button
                    type="button"
                    onClick={() => setNetworkSheetOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary text-[12px] font-bold border border-[rgba(232,197,71,0.55)] active:scale-[0.98] transition"
                  >
                    Select chain
                  </button>
                </div>
              ) : addressesLoading ? (
                <div aria-hidden className="m-4 h-40 rounded-xl bg-[var(--c-surface-soft)] animate-pulse" />
              ) : !chain ? (
                <div className="flex items-start gap-2.5 p-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-[9px] bg-[var(--c-accent-soft)] text-brand-accent border border-[var(--c-accent-border)] shrink-0">
                    <Info size={13} />
                  </span>
                  <p className="text-[11px] text-[var(--c-text-muted)] m-0 leading-snug">
                    {variant.symbol} deposits aren't supported yet. Don't send {variant.symbol} to any address — it won't be credited.
                  </p>
                </div>
              ) : !addressRow ? (
                <div className="flex items-start gap-2.5 p-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-[9px] bg-[var(--c-warn-bg)] text-[var(--c-warn)] border border-[var(--c-warn)] shrink-0">
                    <AlertTriangle size={13} />
                  </span>
                  <p className="text-[11px] text-[var(--c-text-muted)] m-0 leading-snug">
                    Your deposit address is still being generated. Try again shortly.
                  </p>
                </div>
              ) : (
                <>
                  {/* QR + address */}
                  <div className="flex flex-col items-center gap-4 px-4 pt-6 pb-5">
                    <span className="relative inline-flex items-center justify-center rounded-2xl bg-white border border-[var(--c-border)] shadow-[0_10px_24px_-10px_rgba(0,0,0,0.28)] p-3.5">
                      <QRCodeCanvas ref={qrRef} value={addressRow.address} size={140} bgColor="#ffffff" fgColor="#0A1F44" level="H" />
                      <img
                        src={variant.icon}
                        alt=""
                        aria-hidden
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
                      />
                    </span>

                    <div className="w-full flex flex-col items-center gap-1.5 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)] px-4 py-3">
                      <span className="w-full text-left text-[9px] uppercase tracking-[1.1px] font-bold text-[var(--c-text-muted)]">
                        Wallet address
                      </span>
                     <div className="flex flex-row  justify-between items-start gap-2.5">
                       <span className="w-full text-start text-[14px] font-mono font-semibold text-[var(--c-text)] break-all leading-snug">
                        {addressRow.address}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopy}
                        aria-label={copied ? 'Copied' : 'Copy address'}
                        className={[
                          'inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0 border active:scale-95 transition',
                          copied
                            ? 'bg-[var(--c-success-bg)] border-[var(--c-success-bg)] text-[var(--c-success)]'
                            : 'bg-[var(--c-accent-soft)] border-[var(--c-accent-border)] text-brand-accent',
                        ].join(' ')}
                      >
                        {copied ? <Check size={13} strokeWidth={3} /> : <Copy size={13} />}
                      </button>
                     </div>
                    </div>
                  </div>

                  {/* Warning banner */}
                  <div className="mx-4 mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-[var(--c-warn-bg)] border border-[var(--c-warn)] border-opacity-30">
                    <AlertTriangle size={14} className="text-[var(--c-warn)] shrink-0 mt-px" />
                    <p className="text-[10.5px] text-[var(--c-warn)] m-0 leading-snug">
                      Send only <span className="font-bold">{variant.symbol}</span> via the <span className="font-bold">{variant.network || `${variant.symbol} network`}</span>.
                      Sending any other asset or using the wrong network will result in permanent loss of funds.
                    </p>
                  </div>

                  {/* Info rows */}
                  <div className="mx-4 mb-4 rounded-xl border border-[var(--c-border)] divide-y divide-[var(--c-border)] overflow-hidden">
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
                      <span className="text-[10.5px] text-[var(--c-text-muted)] font-medium">Minimum deposit</span>
                      <span className="text-[11.5px] font-bold tabular-nums text-[var(--c-text)]">
                        {configLoading ? '—' : minDeposit != null ? `${minDeposit} ${variant.symbol}` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
                      <span className="inline-flex items-center gap-1 text-[10.5px] text-[var(--c-text-muted)] font-medium">
                        <Clock size={10} /> Estimated arrival
                      </span>
                      <span className="text-[11.5px] font-bold tabular-nums text-[var(--c-text)]">
                        {configLoading ? '—' : arrival || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--c-surface-soft)]">
                      <span className="inline-flex items-center gap-1 text-[10.5px] text-[var(--c-text-muted)] font-medium">
                        <ShieldCheck size={10} /> Confirmations required
                      </span>
                      <span className="text-[11.5px] font-bold tabular-nums text-[var(--c-text)]">
                        {configLoading ? '—' : confirmations ?? 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                    <button
                      type="button"
                      onClick={() => setSavePreviewOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[12px] font-bold tracking-[0.2px] bg-[var(--c-surface-soft)] border border-[var(--c-border)] text-[var(--c-text)] active:scale-[0.98] transition"
                    >
                       Save picture
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={[
                        'inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[12px] font-bold tracking-[0.2px] active:scale-[0.98] transition',
                        copied
                          ? 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-bg)]'
                          : 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.3)]',
                      ].join(' ')}
                    >
                      {copied ? <><Check size={13} strokeWidth={2.8} /> Copied</> : <> Copy address</>}
                    </button>
                  </div>
                </>
              )}
            </div>
          </article>

          <p className="inline-flex items-center justify-center gap-1.5 text-[10px] text-[var(--c-text-muted)]">
            <Sparkles size={10} className="text-brand-accent" /> Funds are credited automatically after confirmation
          </p>

          <BottomSheet
            open={networkSheetOpen}
            onClose={() => setNetworkSheetOpen(false)}
            label="Deposit"
            title={`Select ${primary.symbol} network`}
          >
            <ul className="m-0 list-none p-0 pb-2">
              {variants.map((v, i) => (
                <li key={v.asset}>
                  <button
                    type="button"
                    onClick={() => handlePickNetwork(i)}
                    className={[
                      'w-full grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3 text-left active:bg-[var(--c-surface-soft)] transition',
                      i > 0 ? 'border-t border-[var(--c-border)]' : '',
                    ].join(' ')}
                  >
                    <img src={v.icon} alt={v.symbol} className="w-9 h-9 rounded-full shrink-0" />
                    <div className="flex flex-col min-w-0 leading-tight">
                      <span className="text-[13px] font-semibold text-[var(--c-text)] truncate">
                        {v.network || `${v.symbol} network`}
                      </span>
                      <span className="text-[10px] text-[var(--c-text-muted)] mt-0.5">{v.symbol}</span>
                    </div>
                    {i === selected && <Check size={14} className="text-brand-accent shrink-0" />}
                  </button>
                </li>
              ))}
            </ul>
          </BottomSheet>

          <BottomSheet
            open={savePreviewOpen}
            onClose={() => setSavePreviewOpen(false)}
            title="Save deposit card"
          >
            <div className="flex flex-col items-center gap-4 px-5 pb-2">
              <div className="inline-flex p-1 rounded-xl bg-[var(--c-surface-soft)] border border-[var(--c-border-soft)]">
                <button
                  type="button"
                  onClick={() => setCardTheme('light')}
                  className={[
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-[0.2px] transition',
                    cardTheme === 'light'
                      ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_3px_10px_rgba(201,162,39,0.28)]'
                      : 'text-[var(--c-text-muted)] hover:text-[var(--c-text)]',
                  ].join(' ')}
                >
                  <Sun size={12} /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setCardTheme('dark')}
                  className={[
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-[0.2px] transition',
                    cardTheme === 'dark'
                      ? 'bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary shadow-[0_3px_10px_rgba(201,162,39,0.28)]'
                      : 'text-[var(--c-text-muted)] hover:text-[var(--c-text)]',
                  ].join(' ')}
                >
                  <Moon size={12} /> Dark
                </button>
              </div>

              {!variant || !addressRow ? (
                <div aria-hidden className="w-full h-[420px] rounded-2xl bg-[var(--c-surface-soft)] animate-pulse" />
              ) : (
                <div className="relative w-full">
                <div
                  ref={cardRef}
                  className="relative w-full overflow-hidden rounded-2xl border border-[rgba(201,162,39,0.3)]"
                  style={{ background: cardTheme === 'dark' ? CARD_BG_DARK : CARD_BG_LIGHT }}
                >
                  <div className="relative flex flex-col items-center gap-4 p-6">
                    <img
                      src={cardTheme === 'dark' ? '/logo-2.png' : '/logo-1.png'}
                      alt="VeloxZap"
                      className="h-6 w-auto object-contain"
                    />

                    <div className="flex flex-col items-center gap-1.5">
                      <p className="text-[9.5px] uppercase tracking-[1.3px] text-brand-accent font-bold m-0">
                        Deposit address
                      </p>
                      <div className="flex items-center gap-1.5">
                        <img src={variant.icon} alt="" className="w-5 h-5 rounded-full" />
                        <h2 className={`text-[15px] font-bold m-0 ${cardTheme === 'dark' ? 'text-white' : 'text-[#0A1F44]'}`}>
                          {variant.name}
                        </h2>
                      </div>
                      <span className={[
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.7px] font-semibold',
                        cardTheme === 'dark'
                          ? 'bg-white/[0.08] border border-white/[0.16] text-white/70'
                          : 'bg-[#0A1F44]/[0.05] border border-[#0A1F44]/[0.12] text-[#0A1F44]/70',
                      ].join(' ')}>
                        {variant.network || `${variant.symbol} network`}
                      </span>
                    </div>

                    <span className="relative inline-flex items-center justify-center rounded-2xl bg-white p-3 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)]">
                      <QRCodeCanvas value={addressRow.address} size={160} bgColor="#ffffff" fgColor="#0A1F44" level="H" />
                      <img
                        src={variant.icon}
                        alt=""
                        aria-hidden
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
                      />
                    </span>

                    <div className={[
                      'w-full rounded-xl px-4 py-3',
                      cardTheme === 'dark'
                        ? 'bg-white/[0.06] border border-white/[0.12]'
                        : 'bg-[#0A1F44]/[0.04] border border-[#0A1F44]/[0.1]',
                    ].join(' ')}>
                      <p className={[
                        'text-[9px] uppercase tracking-[1.1px] font-bold m-0 text-center',
                        cardTheme === 'dark' ? 'text-white/50' : 'text-[#0A1F44]/50',
                      ].join(' ')}>
                        Wallet address
                      </p>
                      <p className={[
                        'text-[14px] font-mono font-semibold text-start break-all m-0 mt-1',
                        cardTheme === 'dark' ? 'text-white' : 'text-[#0A1F44]',
                      ].join(' ')}>
                        {addressRow.address}
                      </p>
                    </div>

                    <p className={`text-[9px] m-0 ${cardTheme === 'dark' ? 'text-white/40' : 'text-[#0A1F44]/40'}`}>
                      Saved on {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
                {saving && (
                  <div aria-hidden className="absolute inset-0 rounded-2xl bg-[var(--c-surface)]/70 backdrop-blur-[1px] animate-pulse" />
                )}
                </div>
              )}

             <div className="flex justify-center items-center w-full">
               <button
                type="button"
                onClick={handleSavePicture}
                disabled={saving}
                aria-label={saving ? 'Saving…' : 'Save image'}
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-brand-accent to-brand-gold-soft text-brand-primary border border-[rgba(232,197,71,0.55)] shadow-[0_4px_14px_rgba(201,162,39,0.3)] active:scale-95 transition disabled:opacity-60"
              >
                {saving ? (
                  <span aria-hidden className="w-4 h-4 rounded-full bg-brand-primary/40 animate-pulse" />
                ) : (
                  <Download size={18} />
                )}
              </button>
             </div>
            </div>
          </BottomSheet>
        </>
      )}
    </div>
  )
}
