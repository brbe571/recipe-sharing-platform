export default function Home() {
  return (
    <div
      id="top"
      className="flex flex-1 flex-col bg-[#f6f1e8] font-sans text-[#1f1a14]"
    >
      <header className="border-b border-[#e6dccb]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <a href="#top" className="text-lg font-semibold tracking-tight">
            Recipe Share
          </a>
          <nav aria-label="Primary" className="flex items-center gap-5 text-sm">
            <a
              href="/login"
              className="rounded-sm text-[#5c5348] underline-offset-4 hover:text-[#1f1a14] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="inline-flex h-9 items-center rounded-full bg-[#9a3412] px-4 text-sm font-medium text-white hover:bg-[#7c2a0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
            >
              Sign up
            </a>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 items-center">
        <section className="mx-auto w-full max-w-5xl px-5 py-16 sm:py-24">
          <p className="text-sm font-medium tracking-wide text-[#9a3412]">
            Home cooking, shared simply
          </p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Recipes worth passing on
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-8 text-[#5c5348]">
            A simple place to keep the dishes you cook and share them with the
            people you cook for.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/signup"
              className="inline-flex h-11 items-center rounded-full bg-[#9a3412] px-5 text-sm font-medium text-white hover:bg-[#7c2a0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
            >
              Start creating
            </a>
            <a
              href="/login"
              className="text-sm font-medium text-[#5c5348] underline-offset-4 hover:text-[#1f1a14] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
            >
              Log in
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e6dccb]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-6 text-sm text-[#5c5348]">
          <p>Recipe Share</p>
        </div>
      </footer>
    </div>
  );
}
