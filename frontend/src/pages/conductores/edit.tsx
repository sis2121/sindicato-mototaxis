import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ConductorForm } from '@/components/conductores/conductor-form'
import { conductoresService } from '@/services/conductores.service'
import type { ConductorFormValues } from '@/schemas/conductor.schema'
export default function EditConductorPage() {
  const { id } = useParams<{id:string}>()
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({ queryKey:['conductor',id], queryFn:()=>conductoresService.getById(Number(id)), enabled:!!id })
  const mutation = useMutation({ mutationFn:(data:ConductorFormValues)=>conductoresService.update(Number(id),data), onSuccess:()=>navigate(`/conductores/${id}`) })
  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48"/><Skeleton className="h-64 w-full"/></div>
  if (!data?.data) return <p>No encontrado</p>
  const conductor = data.data
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={()=>navigate(`/conductores/${id}`)}><ArrowLeft className="h-4 w-4"/>Volver</Button>
      <Card><CardHeader><CardTitle>Editar Conductor</CardTitle></CardHeader><CardContent><ConductorForm defaultValues={conductor} onSubmit={(d)=>mutation.mutate(d)} isLoading={mutation.isPending} error={mutation.error ? (mutation.error as any)?.response?.data?.error : null} /></CardContent></Card>
    </div>
  )
}
