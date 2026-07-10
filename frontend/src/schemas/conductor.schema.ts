import { z } from 'zod'
export const conductorSchema = z.object({
  codigo_afiliado: z.string().min(3).max(20),
  nombres: z.string().min(2).max(100),
  apellidos: z.string().min(2).max(100),
  cedula_identidad: z.string().min(5).max(20),
  telefono: z.string().max(15).optional().or(z.literal('')),
  direccion: z.string().max(255).optional().or(z.literal('')),
  fecha_nacimiento: z.string().optional().or(z.literal('')),
  licencia_conducir: z.string().max(30).optional().or(z.literal('')),
  categoria_licencia: z.string().max(10).optional().or(z.literal('')),
  fecha_afiliacion: z.string().optional().or(z.literal('')),
  estado: z.enum(['ACTIVO','SUSPENDIDO','RETIRADO']).default('ACTIVO'),
  fotografia: z.string().optional().or(z.literal(''))
})
export type ConductorFormValues = z.infer<typeof conductorSchema>
