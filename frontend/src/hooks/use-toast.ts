import { useState, useCallback } from 'react'
type ToastVariant = 'default' | 'success' | 'error' | 'warning'
interface Toast { id:string; title:string; description?:string; variant:ToastVariant }
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const addToast = useCallback((title:string, description?:string, variant:ToastVariant='default') => {
    const id = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, {id,title,description,variant}])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }, [])
  const removeToast = useCallback((id:string) => setToasts(prev => prev.filter(t => t.id !== id)), [])
  return { toasts, addToast, removeToast }
}
