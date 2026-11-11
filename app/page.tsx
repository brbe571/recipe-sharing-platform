interface RecipePreview {
  title: string;
  author: string;
  cookTime: string;
  servings: string;
  category: string;
  swatch: string;
}

const recipes: RecipePreview[] = [
  {
    title: "Lemon herb roast chicken",
    author: "Maya Chen",
    cookTime: "1 hr 15 min",
    servings: "Serves 4",
    category: "Dinner",
    swatch: "bg-[#e7c9a8]",
  },
  {
    title: "Weeknight tomato pasta",
    author: "Luis Ortega",
    cookTime: "25 min",
    servings: "Serves 2",
    category: "Pasta",
    swatch: "bg-[#e3b2a4]",
  },
  {
    title: "Miso ginger salmon",
    author: "Ava Nguyen",
    cookTime: "30 min",
    servings: "Serves 2",
    category: "Seafood",
    swatch: "bg-[#c9d4c0]",
  },
  {
    title: "Garden vegetable soup",
    author: "Jonah Hale",
    cookTime: "45 min",
    servings: "Serves 6",
    category: "Soup",
    swatch: "bg-[#d9c7a1]",
  },
  {
    title: "Brown butter chocolate chip cookies",
    author: "Priya Shah",
    cookTime: "35 min",
    servings: "24 cookies",
    category: "Baking",
    swatch: "bg-[#e4c6b0]",
  },
  {
    title: "Strawberry yogurt parfait",
    author: "Elena Brooks",
    cookTime: "10 min",
    servings: "Serves 1",
    category: "Breakfast",
    swatch: "bg-[#efc3c8]",
  },
];

const steps = [
  {
    title: "Write it down",
    description:
      "Ingredients, steps, and the small notes you usually keep in your head.",
  },
  {
    title: "Keep it together",
    description:
      "Weeknight meals and the recipes you make every year, in one place.",
  },
  {
    title: "Pass it on",
    description:
      "Share a dish with family and friends when someone asks how you made it.",
  },
];

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
          <nav aria-label="On this page" className="flex items-center gap-5 text-sm">
            <a
              href="#recipes"
              className="rounded-sm text-[#5c5348] underline-offset-4 hover:text-[#1f1a14] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
            >
              Recipes
            </a>
            <a
              href="#how-it-works"
              className="rounded-sm text-[#5c5348] underline-offset-4 hover:text-[#1f1a14] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
            >
              How it works
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
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
          <a
            href="#recipes"
            className="mt-8 inline-flex h-11 items-center rounded-full bg-[#9a3412] px-5 text-sm font-medium text-white hover:bg-[#7c2a0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
          >
            See recipes
          </a>
        </section>

        <section
          id="recipes"
          aria-labelledby="recipes-heading"
          className="border-t border-[#e6dccb] bg-[#fffdf9]"
        >
          <div className="mx-auto w-full max-w-5xl px-5 py-14 sm:py-16">
            <h2
              id="recipes-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              From the kitchen
            </h2>
            <p className="mt-2 max-w-lg text-[#5c5348]">
              A few dishes people have been cooking lately.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <li key={recipe.title}>
                  <RecipeCard recipe={recipe} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="how-it-works"
          aria-labelledby="how-it-works-heading"
          className="border-t border-[#e6dccb]"
        >
          <div className="mx-auto w-full max-w-5xl px-5 py-14 sm:py-16">
            <h2
              id="how-it-works-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              How it works
            </h2>
            <ol className="mt-8 grid gap-8 sm:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <p className="text-sm font-medium text-[#9a3412]">
                    {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5c5348]">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e6dccb]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-6 text-sm text-[#5c5348]">
          <p>Recipe Share</p>
          <a
            href="#top"
            className="rounded-sm underline-offset-4 hover:text-[#1f1a14] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a3412]"
          >
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: RecipePreview }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e6dccb] bg-white">
      <div className={`h-24 ${recipe.swatch}`} aria-hidden="true" />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium tracking-wide text-[#9a3412] uppercase">
          {recipe.category}
        </p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight">
          {recipe.title}
        </h3>
        <p className="mt-1 text-sm text-[#5c5348]">by {recipe.author}</p>
        <p className="mt-4 text-sm text-[#5c5348]">
          {recipe.cookTime}
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {recipe.servings}
        </p>
      </div>
    </article>
  );
}
