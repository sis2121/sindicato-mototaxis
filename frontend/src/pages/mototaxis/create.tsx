import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MototaxiForm } from '@/components/mototaxis/mototaxi-form'
import { mototaxisService } from '@/services/mototaxis.service'
export default function CreateMototaxiPage() {
  const navigate = useNavigate()
  const mutation = useMutation({ mutationFn: mototaxisService.create, onSuccess: ()=>navigate('/mototaxis') })
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={()=>navigate('/mototaxis')}><ArrowLeft className="h-4 w-4"/>Volver</Button>
      <Card><CardHeader><CardTitle>Nueva Mototaxi</CardTitle></CardHeader><CardContent><MototaxiForm onSubmit={(d)=>mutation.mutate(d)} isLoading={mutation.isPending} error={mutation.error ? (mutation.error as any)?.response?.data?.error : null} /></CardContent></Card>
    </div>
  )
}
