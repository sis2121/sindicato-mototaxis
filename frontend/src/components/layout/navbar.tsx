import { Menu, Sun, Moon, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authService } from '@/services/auth.service'
import { useNavigate } from 'react-router-dom'
interface NavbarProps { onToggleSidebar: () => void; darkMode: boolean; onToggleDarkMode: () => void }
export function Navbar({ onToggleSidebar, darkMode, onToggleDarkMode }: NavbarProps) {
  const navigate = useNavigate()
  const usuario = authService.getUsuario()
  const handleLogout = () => { authService.logout(); navigate('/login') }
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden"><Menu className="h-5 w-5" /></Button>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleDarkMode} title={darkMode?'Modo claro':'Modo oscuro'}>{darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</Button>
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">{usuario?.nombre?.charAt(0)||'A'}</div>
          <span className="text-foreground font-medium">{usuario?.nombre||'Admin'}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Cerrar sesión"><LogOut className="h-5 w-5" /></Button>
      </div>
    </header>
  )
}
