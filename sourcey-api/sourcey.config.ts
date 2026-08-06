import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generate } from "moxygen";
import { defineConfig, markdown, type SourceAdapter } from "sourcey";

const upstreamCommit = "2ce777013963706c868b79da1483270e2690afab";

function cleanJavaMarkdown(markdown: string): string {
  return markdown
    .replace(/[ \t]+$/gm, "")
    .replace(/ ?`inline`/g, "")
    .replace(/```java\n([\s\S]*?)```/g, (_block, code: string) => {
      return `\`\`\`java\n${code.replace(/^inline\s+/gm, "")}\`\`\``;
    });
}

function javaDoxygen(): SourceAdapter {
  return {
    name: "java-doxygen",
    async resolve(ctx) {
      const xml = ctx.resolvePath("./.doxygen/xml");
      const templates = ctx.resolvePath("./templates");
      const generatedDir = ctx.resolvePath("./.generated");
      await ctx.assertExists(xml, "PF4J Doxygen XML");
      await ctx.assertExists(templates, "Moxygen Java templates");

      const generated = await generate({
        directory: xml,
        language: "java",
        templates,
        anchors: true,
        quiet: true,
        sourceUrl: [
          {
            prefix: "",
            url: `https://github.com/pf4j/pf4j/blob/${upstreamCommit}/{fullPath}#L{line}`,
          },
        ],
      });

      await rm(generatedDir, { recursive: true, force: true });
      await mkdir(generatedDir, { recursive: true });

      const grouped = new Map<string, Array<{ slug: string; file: string }>>();
      for (const page of generated) {
        const file = join(generatedDir, `${page.slug}.md`);
        await writeFile(file, cleanJavaMarkdown(page.markdown), "utf8");
        const label = (page.namespace || "Packages").replaceAll("::", ".");
        const pages = grouped.get(label) || [];
        pages.push({ slug: page.slug, file });
        grouped.set(label, pages);
      }

      return {
        kind: "markdown" as const,
        adapter: "java-doxygen",
        groups: [...grouped.entries()]
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([label, pages]) => ({
            label,
            pages: pages.sort((left, right) => left.slug.localeCompare(right.slug)),
          })),
        watchPaths: [xml, templates],
      };
    },
  };
}

export default defineConfig({
  name: "PF4J API Reference",
  siteUrl: "https://pf4j.org",
  baseUrl: "/api",
  prettyUrls: false,
  repo: "https://github.com/pf4j/pf4j",
  theme: {
    preset: "default",
    colors: { primary: "#2a6496" },
  },
  navigation: {
    tabs: [
      {
        tab: "Overview",
        slug: "overview",
        source: markdown({
          groups: [{ group: "PF4J", pages: ["overview"] }],
        }),
      },
      {
        tab: "API Reference",
        slug: "reference",
        source: javaDoxygen(),
      },
    ],
  },
  navbar: {
    links: [
      { label: "PF4J Docs", href: "https://pf4j.org/" },
      { label: "GitHub", href: "https://github.com/pf4j/pf4j" },
    ],
  },
  footer: {
    links: [
      {
        label: "PF4J · Apache-2.0",
        href: `https://github.com/pf4j/pf4j/blob/${upstreamCommit}/LICENSE`,
      },
      { label: "Generated with Sourcey", href: "https://sourcey.com" },
    ],
  },
  changelog: false,
});
