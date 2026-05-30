import { CONFIG } from '@shared/constants/config'
import { getAccessToken } from './keychainService'

type SocketHandler = (data: unknown) => void

class SocketClient {
  private ws: WebSocket | null = null
  private handlers: Map<string, SocketHandler[]> = new Map()
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private connected = false

  async connect(): Promise<void> {
    const token = await getAccessToken()
    this.ws = new WebSocket(`${CONFIG.WS_URL}?token=${token ?? ''}`)
    this.ws.onopen = () => { this.connected = true }
    this.ws.onmessage = e => {
      try {
        const { event, data } = JSON.parse(e.data as string) as { event: string; data: unknown }
        this.handlers.get(event)?.forEach(h => h(data))
      } catch { /* ignore malformed messages */ }
    }
    this.ws.onclose = () => {
      this.connected = false
      this.reconnectTimer = setTimeout(() => this.connect(), 5000)
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.ws?.close()
    this.ws = null
    this.connected = false
  }

  on(event: string, handler: SocketHandler): void {
    const existing = this.handlers.get(event) ?? []
    this.handlers.set(event, [...existing, handler])
  }

  off(event: string, handler: SocketHandler): void {
    const existing = this.handlers.get(event) ?? []
    this.handlers.set(event, existing.filter(h => h !== handler))
  }

  emit(event: string, data: unknown): void {
    if (this.ws && this.connected) {
      this.ws.send(JSON.stringify({ event, data }))
    }
  }

  isConnected(): boolean { return this.connected }
}

export const socketClient = new SocketClient()
