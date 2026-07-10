import * as React from 'react'
import { cn } from '@/utils/cn'
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> { variant?: 'default'|'success'|'warning'|'destructive'|'secondary' }
const variantClasses: Record<string,string> = { default:'bg-primary text-primary-foreground', success:'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200', warning:'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', destructive:'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', secondary:'bg-secondary text-secondary-foreground' }
function Badge({ className, variant='default', ...props }: BadgeProps) { return <div className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors', variantClasses[variant], className)} {...props} /> }
export { Badge }
