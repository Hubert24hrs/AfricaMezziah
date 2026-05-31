const store: Record<string, string> = {}
export const setGenericPassword = async (_u: string, pw: string, opts?: { service?: string }) => {
  store[opts?.service ?? 'default'] = pw; return true
}
export const getGenericPassword = async (opts?: { service?: string }) => {
  const pw = store[opts?.service ?? 'default']
  return pw ? { username: 'user', password: pw, service: opts?.service ?? '' } : false
}
export const resetGenericPassword = async (opts?: { service?: string }) => {
  delete store[opts?.service ?? 'default']; return true
}
export const ACCESSIBLE = { WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY' }
export default { setGenericPassword, getGenericPassword, resetGenericPassword, ACCESSIBLE }
