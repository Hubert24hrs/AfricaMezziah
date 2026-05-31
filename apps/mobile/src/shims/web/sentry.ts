export const init = (_opts: unknown) => {}
export const captureException = (_e: unknown) => {}
export const captureMessage = (_m: string) => {}
export const addBreadcrumb = (_b: unknown) => {}
export const withScope = (cb: (scope: { setTag: () => void; setExtra: () => void }) => void) => {
  cb({ setTag: () => {}, setExtra: () => {} })
}
export default { init, captureException, captureMessage, addBreadcrumb, withScope }
