// localStorage-backed MMKV shim for web
export class MMKV {
  private prefix: string
  constructor(opts?: { id?: string }) { this.prefix = `mmkv_${opts?.id ?? 'default'}_` }
  set(key: string, value: string | number | boolean): void {
    localStorage.setItem(this.prefix + key, JSON.stringify(value))
  }
  getString(key: string): string | undefined {
    const v = localStorage.getItem(this.prefix + key)
    return v != null ? (JSON.parse(v) as string) : undefined
  }
  getNumber(key: string): number | undefined {
    const v = localStorage.getItem(this.prefix + key)
    return v != null ? (JSON.parse(v) as number) : undefined
  }
  getBoolean(key: string): boolean | undefined {
    const v = localStorage.getItem(this.prefix + key)
    return v != null ? (JSON.parse(v) as boolean) : undefined
  }
  delete(key: string): void { localStorage.removeItem(this.prefix + key) }
  clearAll(): void {
    Object.keys(localStorage).filter(k => k.startsWith(this.prefix)).forEach(k => localStorage.removeItem(k))
  }
}
