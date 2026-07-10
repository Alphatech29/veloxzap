import { io } from 'socket.io-client'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

let socket = null
let refCount = 0

// Reference-counted: multiple hooks (useUser, useNotifications, ...) share one
// connection, so one hook's cleanup doesn't tear down another's still-active socket.
export function connectSocket() {
  refCount++
  if (!socket) socket = io(API_BASE_URL, { withCredentials: true, autoConnect: true })
  return socket
}

export function disconnectSocket() {
  refCount = Math.max(0, refCount - 1)
  if (refCount === 0 && socket) {
    socket.disconnect()
    socket = null
  }
}

export function getSocket() {
  return socket
}
