import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ConductorForm } from '@/components/conductores/conductor-form'
import { conductoresService } from '@/services/conductores.service'
import type { ConductorFormValues } from '@/schemas/conductor.schema'
export default function CreateConductorPage() {
  const navigate = useNavigate()
  const mutation = useMutation({ mutationFn: (data:ConductorFormValues) => conductoresService.create(data), onSuccess: () => navigate('/conductores') })
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={()=>navigate('/conductores')} className="gap-2"><ArrowLeft className="h-4 w-4"/>Volver</Button>
      <Card><CardHeader><CardTitle>Nuevo Conductor</CardTitle></CardHeader><CardContent><ConductorForm onSubmit={(data)=>mutation.mutate(data)} isLoading={mutation.isPending} error={mutation.error ? (mutation.error as any)?.response?.data?.error : null} /></CardContent></Card>
    </div>
  )
}
