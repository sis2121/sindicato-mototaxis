import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/utils/cn'
interface ToastProps { id:string; title:string; description?:string; variant?:'default'|'success'|'error'|'warning'; onClose:(id:string)=>void }
const iconMap = { success:CheckCircle, error:AlertCircle, warning:AlertTriangle, default:Info }
const variantStyles = { success:'border-emerald-500 bg-emerald-50 dark:bg-emerald-950', error:'border-red-500 bg-red-50 dark:bg-red-950', warning:'border-amber-500 bg-amber-50 dark:bg-amber-950', default:'border-primary bg-background' }
export function Toast({ id, title, description, variant='default', onClose }: ToastProps) {
  const Icon = iconMap[variant]
  return (
    <div className={cn('pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg animate-in slide-in-from-right-full', variantStyles[variant])}>
      <Icon className="h-5 w-5 mt-0.5" />
      <div className="flex-1"><p className="text-sm font-semibold">{title}</p>{description && <p className="text-sm text-muted-foreground">{description}</p>}</div>
      <button onClick={() => onClose(id)} className="rounded-md p-1 hover:bg-black/10"><X className="h-4 w-4" /></button>
    </div>
  )
}
export function ToastContainer({ toasts, onClose }: { toasts:ToastProps[], onClose:(id:string)=>void }) {
  return <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">{toasts.map(t => <Toast key={t.id} {...t} onClose={onClose} />)}</div>
}
