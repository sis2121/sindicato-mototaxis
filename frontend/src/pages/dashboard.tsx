import { useQuery } from '@tanstack/react-query'
import { Users, UserCheck, UserX, Bike, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { dashboardService } from '@/services/dashboard.service'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
const COLORS = ['#3b82f6','#f59e0b','#ef4444','#10b981']
export default function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard-stats'], queryFn: dashboardService.getStats })
  if (isLoading) return <div className="space-y-6"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_,i)=><Skeleton key={i} className="h-32 rounded-lg"/>)}</div><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Skeleton className="h-80 rounded-lg"/><Skeleton className="h-80 rounded-lg"/></div></div>
  const stats = data?.data
  if (!stats) return null
  const tarjetas = [
    { title:'Total Conductores', value:stats.conductores.total, icon:Users, color:'text-blue-600', bg:'bg-blue-100 dark:bg-blue-900/30' },
    { title:'Activos', value:stats.conductores.activos, icon:UserCheck, color:'text-emerald-600', bg:'bg-emerald-100 dark:bg-emerald-900/30' },
    { title:'Suspendidos', value:stats.conductores.suspendidos, icon:UserX, color:'text-amber-600', bg:'bg-amber-100 dark:bg-amber-900/30' },
    { title:'Total Mototaxis', value:stats.mototaxis.total, icon:Bike, color:'text-purple-600', bg:'bg-purple-100 dark:bg-purple-900/30' },
  ]
  const chartData = stats.conductores.registros_por_mes?.map((item:any) => ({ mes: item.mes?.substring(5)+'/'+item.mes?.substring(2,4)||item.mes, Conductores: item.total })) || []
  const pieData = stats.conductores.estados_distribucion || []
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Dashboard</h1><p className="text-muted-foreground mt-1">Resumen general del sindicato</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tarjetas.map((card,i) => (
          <Card key={i}><CardContent className="p-6 flex items-center gap-4"><div className={`p-3 rounded-lg ${card.bg}`}><card.icon className={`h-6 w-6 ${card.color}`} /></div><div><p className="text-sm text-muted-foreground">{card.title}</p><p className="text-3xl font-bold">{card.value}</p></div></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5"/> Registros por Mes</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" className="stroke-muted"/><XAxis dataKey="mes"/><YAxis/><Tooltip/><Bar dataKey="Conductores" fill="#3b82f6" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> Estados de Conductores</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="cantidad" nameKey="estado" label={({estado,cantidad}:any)=>`${estado}: ${cantidad}`}>{pieData.map((_:any,idx:number)=><Cell key={idx} fill={COLORS[idx%COLORS.length]}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></CardContent></Card>
      </div>
    </div>
  )
}
