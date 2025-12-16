export const metadata = {
  title: 'Projects',
  description: 'My projects.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">projects</h1>
      <ul className="flex flex-col gap-2">
        <li>
          <a href="https://eastonplus.com" className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200">easton+</a>
        </li>
        <li>
          <a href="" className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200">easton matlab</a>
        </li>
        <li>
          <a href="" className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200">easton leaderboard</a>
        </li>
      </ul>
    </section>
  )
}
