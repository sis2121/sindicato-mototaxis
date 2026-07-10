import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Navigate } from 'react-router-dom'
import { Bike, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema'
import { authService } from '@/services/auth.service'
export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })
  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true); setError('')
    try { await authService.login(data); navigate('/dashboard') }
    catch (err: any) { setError(err.response?.data?.error || 'Error al iniciar sesión') }
    finally { setLoading(false) }
  }
  if (authService.isAuthenticated()) return <Navigate to="/dashboard" replace />
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-14 w-14 rounded-full bg-primary flex items-center justify-center mb-2"><Bike className="h-7 w-7 text-primary-foreground" /></div>
          <CardTitle className="text-2xl">Sindicato de Mototaxis</CardTitle>
          <CardDescription>Trinidad, Beni - Bolivia</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            <Input id="email" label="Email" type="email" placeholder="admin@sindicato.bo" error={errors.email?.message} {...register('email')} />
            <div className="space-y-1">
              <label className="text-sm font-medium">Contraseña</label>
              <div className="relative">
                <Input id="password" type={showPassword?'text':'password'} placeholder="••••••••" error={errors.password?.message} className="pr-10" {...register('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? 'Iniciando...' : 'Iniciar Sesión'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
