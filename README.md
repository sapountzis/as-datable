# Andreas Sapountzis — personal website

A topic-led technical website about machine learning, statistics, language-model systems, research, and software. Built with Next.js, React, TypeScript, and Tailwind; deployed through the existing OpenNext / Cloudflare configuration.

## Development

```sh
bun install
bun run dev -- --hostname 127.0.0.1 --port 3100
```

Use Bun 1.4.4 (pinned in `packageManager`) and Node 24. The project uses `bun.lock`; install reproducibly with `bun install --frozen-lockfile`.

TypeScript 7.0.2 supplies the native `tsc` through the `@typescript/native` alias. The `typescript` alias supplies Microsoft's TypeScript 6 API package for ESLint and Next integrations that still need the JavaScript compiler API. `bun run typecheck` generates Next route types, then runs the TypeScript 7 checker. Both production build commands include this check; Next also runs its own integrated check. This follows [Microsoft's side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0).

The scoped `glob` override replaces an upstream minifier’s exact vulnerable 10.3.3 pin with the patched 10.5.0 release. It applies only to that minifier, leaving other glob versions intact.

The portrait and Instrument Sans font are served locally. No font-service request is needed at build or runtime. The font license is in `public/fonts/OFL.txt`.

## Checks

```sh
bun test
bun run typecheck
bun run lint
bun run build
bun run opennextjs-build
```

The Cloudflare adapter initializes a local service during builds, so those commands require permission to bind a local port. `bun run start` serves the production Next.js build. `bun run preview` builds and previews the Cloudflare version. Publishing remains a separate action through the existing deployment scripts.

## Content and routes

`src/data/topics.ts` contains the topic descriptions, related links, and categories. `/work` is the topic index; `/work/[slug]` holds the individual pages. The sitemap lists canonical URLs only.

Public content describes technical methods and broad application areas. It does not contain employer names, customer cases, internal research links, or private measurements. The figures are conceptual or clearly identified synthetic examples. Pure TypeScript calculations and deterministic numerical fixtures are covered by method-level tests.

The current portrait was supplied by the site owner and encoded as a 640px WebP for delivery. The original supplied image is not modified in its source location. The social image and SVG favicon were drawn for this site.

## Browser behavior

The theme follows system preference until changed using the header control. The core content and static figure states remain available without JavaScript. Analytics are optional, load after acceptance, and can be declined or revoked through Cookie preferences. Local storage retains consent and theme choices when available.

Browser verification artifacts belong in the ignored `output/playwright/` directory. See `DESIGN.md` for the finished visual system.

## Technical examples

Continuous explanations start with their inputs, paused, and play only on request. Persistent SVG objects transform on a scrubbable timeline using measured content dimensions; native HTML keeps calculations and controls readable. Parameter changes preserve progress. Stacked text alternatives keep widget dimensions stable during playback and case changes without reserving a large empty canvas. Reduced-motion/manual and no-JavaScript explanations remain available. HTML/SVG and Motion 14.6.0 provide the rendering; numerical work stays offline. The homepage features rule discovery, recommendation/probability, agents/tools and statistical signatures/community detection. Dedicated pages include evaluation, message-pattern matching, seasonal adjustment and segmentation, plus static explanations where interaction adds little.

Regenerate or verify the synthetic fixtures with the pinned toolchain:

```sh
uv run --locked --script scripts/generate_explainer_fixtures.py
uv run --locked --script scripts/generate_explainer_fixtures.py --check
```

The generator snapshots the verified message normalization rules in `scripts/message_normalization.py`. Graph fixtures calculate enrichment screening, information selection, surprisal-weighted signatures, cosine edges and Leiden CPM partitions (seed 42). The edge cutoff is 0.05; resolution values are 0.1 and 0.5. Text matching uses character 3–7 grams and RapidFuzz partial-ratio, with the two documented acceptance gates. Temporal fixtures use distinct PELT penalties 8 and 100. Agent traces use authored decisions and computed evidence from synthetic per-example correctness records. Population mismatch conditionally adds a worker, whose action/observation loop loads pairs and calculates a matched gain. Evaluation annotations remain authored and distinct from executable schema checks. Credit-decision and social-media illustrations are synthetic teaching examples. None are private measurements or reported production performance.
