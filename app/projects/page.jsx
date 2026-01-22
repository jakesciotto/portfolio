export const metadata = {
  title: 'projects',
  description: 'stuff i work on',
}

export default function Page() {
  return (
    <div className="mt-12 max-w-5xl px-4">
      <h1 className="font-semibold text-5xl mb-2 tracking-tighter gradient-text">projects</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">stuff i work on</p>
      <ul className="flex flex-col gap-2">
        <li>
          <h4 className="mb-3 text-white text-2xl font-semibold">easton+</h4>
        </li>
      </ul>
    </div>
  )
}
