const Share = {
  open: async (opts: { url?: string; message?: string }) => {
    if (navigator.share) await navigator.share({ url: opts.url, text: opts.message })
  },
}
export default Share
