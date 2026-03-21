import { create } from 'zustand'

interface NotificationStore {
  /** true = popup MSN foi dispensado e pode ser re-exibido via taskbar */
  hasMsnNotification: boolean
  setHasMsnNotification: (v: boolean) => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  hasMsnNotification: false,
  setHasMsnNotification: (v) => set({ hasMsnNotification: v }),
}))
