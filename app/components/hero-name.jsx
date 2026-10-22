const letters = 'jake sciotto'.split('')

export default function HeroName() {
  return (
    <h1 className="font-sans font-bold text-[min(3.75rem,13vw)] leading-none md:text-8xl mb-2 tracking-tightest text-foreground relative whitespace-nowrap">
      {letters.map((char, i) => (
        <span
          key={i}
          className="hero-letter inline-block"
          style={
            char === ' '
              ? { width: '0.3em', '--letter-index': i }
              : { '--letter-index': i }
          }
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </h1>
  )
}
