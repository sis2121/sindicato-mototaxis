import { useState, useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Navbar } from './navbar'
import { authService } from '@/services/auth.service'
import { ToastContainer } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => { const s = localStorage.getItem('darkMode'); return s ? JSON.parse(s) : false })
  const { toasts, removeToast } = useToast()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])
  if (!authService.isAuthenticated()) return <Navigate to="/login" replace />
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
        <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}
