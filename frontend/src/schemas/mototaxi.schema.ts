import { z } from "zod";

export const mototaxiSchema = z.object({
  placa: z.string().min(3).max(10),
  marca: z.string().min(2).max(50),
  modelo: z.string().max(50).optional().or(z.literal("")),
  color: z.string().max(30).optional().or(z.literal("")),
  año: z.number().min(1900).max(2100).optional().nullable(),
  numero_motor: z.string().max(50).optional().or(z.literal("")),
  estado: z
    .enum(["ACTIVO", "EN_REPARACION", "FUERA_SERVICIO"])
    .default("ACTIVO"),
  codigo_afiliado: z.string().optional().nullable(),
});

export type MototaxiFormValues = z.infer<typeof mototaxiSchema>;
