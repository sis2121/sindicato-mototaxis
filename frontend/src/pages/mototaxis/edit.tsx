import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { MototaxiForm } from '@/components/mototaxis/mototaxi-form'
import { mototaxisService } from '@/services/mototaxis.service'
export default function EditMototaxiPage() {
  const { id } = useParams<{id:string}>()
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({ queryKey:['mototaxi',id], queryFn:()=>mototaxisService.getById(Number(id)), enabled:!!id })
  const mutation = useMutation({ mutationFn:(d:any)=>mototaxisService.update(Number(id),d), onSuccess:()=>navigate('/mototaxis') })
  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48"/><Skeleton className="h-64"/></div>
  if (!data?.data) return <p>No encontrado</p>
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={()=>navigate('/mototaxis')}><ArrowLeft className="h-4 w-4"/>Volver</Button>
      <Card><CardHeader><CardTitle>Editar Mototaxi</CardTitle></CardHeader><CardContent><MototaxiForm defaultValues={data.data} onSubmit={(d)=>mutation.mutate(d)} isLoading={mutation.isPending} error={mutation.error ? (mutation.error as any)?.response?.data?.error : null} /></CardContent></Card>
    </div>
  )
}
