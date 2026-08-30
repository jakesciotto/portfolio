export const ACCENTS = ['primary', 'secondary', 'tertiary', 'amber', 'violet', 'red']

export const accentVar = Object.fromEntries(ACCENTS.map((a) => [a, `var(--accent-${a})`]))

export const textClass = {
  primary: 'text-accent-primary',
  secondary: 'text-accent-secondary',
  tertiary: 'text-accent-tertiary',
  amber: 'text-accent-amber',
  violet: 'text-accent-violet',
  red: 'text-accent-red',
}

export const bgClass = {
  primary: 'bg-accent-primary',
  secondary: 'bg-accent-secondary',
  tertiary: 'bg-accent-tertiary',
  amber: 'bg-accent-amber',
  violet: 'bg-accent-violet',
  red: 'bg-accent-red',
}

export const LABEL = 'text-[10px] uppercase font-medium tracking-widest text-muted-foreground'
