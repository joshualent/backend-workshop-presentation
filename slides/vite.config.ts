// Plain object export: `vite` isn't a direct dependency (it comes with @slidev/cli).
export default {
  build: {
    // Slidev 53's code-block CSS has a nested `.dark` rule that Vite's
    // lightningcss minifier rejects. The deck is served locally; skip CSS minify.
    cssMinify: false,
  },
}
