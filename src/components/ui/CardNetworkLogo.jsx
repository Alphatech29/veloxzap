export default function CardNetworkLogo({ network, size = 28, className = '' }) {
  if (network === 'mastercard') {
    return (
      <span
        aria-label="Mastercard"
        className={`inline-flex items-center ${className}`}
        style={{ width: size * 1.55, height: size, isolation: 'isolate' }}
      >
        <span
          aria-hidden
          className="rounded-full"
          style={{ width: size, height: size, background: '#EB001B' }}
        />
        <span
          aria-hidden
          className="rounded-full"
          style={{
            width: size, height: size, background: '#F79E1B',
            marginLeft: -size * 0.42, mixBlendMode: 'multiply',
          }}
        />
      </span>
    )
  }

  if (network === 'visa') {
    return (
      <span
        aria-label="Visa"
        className={`inline-block font-black not-italic ${className}`}
        style={{
          fontSize: size * 0.62,
          letterSpacing: '-0.5px',
          fontStyle: 'italic',
          fontFamily: 'Georgia, "Times New Roman", serif',
          color: 'currentColor',
        }}
      >
        VISA
      </span>
    )
  }

  return null
}
