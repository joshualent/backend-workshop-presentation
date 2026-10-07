// Plain object export: `vite` isn't a direct dependency (it comes with @slidev/cli).
export default {
  build: {
    // Slidev 53's own code-block CSS emits a nested `.dark` rule that Vite 8's
    // lightningcss minifier rejects ("Invalid token in pseudo element"), and
    // esbuild isn't installed. The deck is served locally, so skip CSS minify.
    cssMinify: false,
  },
}
