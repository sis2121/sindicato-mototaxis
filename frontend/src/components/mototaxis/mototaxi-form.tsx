import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  mototaxiSchema,
  type MototaxiFormValues,
} from "@/schemas/mototaxi.schema";

interface Props {
  defaultValues?: Partial<MototaxiFormValues>;
  onSubmit: (data: MototaxiFormValues) => void;
  isLoading: boolean;
  error?: string | null;
}

export function MototaxiForm({
  defaultValues,
  onSubmit,
  isLoading,
  error,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MototaxiFormValues>({
    resolver: zodResolver(mototaxiSchema),
    defaultValues: {
      estado: "ACTIVO",
      año: null,
      codigo_afiliado: "",
      ...defaultValues,
    },
  });

  const handleFormSubmit = (data: MototaxiFormValues) => {
    // Limpiar campos vacíos
    const cleanedData = {
      ...data,
      año: data.año || null,
      codigo_afiliado: data.codigo_afiliado?.trim() || null,
    };
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="placa"
          label="Placa *"
          error={errors.placa?.message}
          {...register("placa")}
        />
        <Input
          id="marca"
          label="Marca *"
          error={errors.marca?.message}
          {...register("marca")}
        />
        <Input
          id="modelo"
          label="Modelo"
          error={errors.modelo?.message}
          {...register("modelo")}
        />
        <Input
          id="color"
          label="Color"
          error={errors.color?.message}
          {...register("color")}
        />
        <Input
          id="año"
          label="Año"
          type="number"
          error={errors.año?.message}
          {...register("año", { valueAsNumber: true })}
          placeholder="Dejar vacío si no se sabe"
        />
        <Input
          id="numero_motor"
          label="N° Motor"
          error={errors.numero_motor?.message}
          {...register("numero_motor")}
        />
        <Select
          id="estado"
          label="Estado"
          options={[
            { value: "ACTIVO", label: "Activo" },
            { value: "EN_REPARACION", label: "En Reparación" },
            { value: "FUERA_SERVICIO", label: "Fuera de Servicio" },
          ]}
          error={errors.estado?.message}
          {...register("estado")}
        />

        {/* Campo modificado: Código Afiliado */}
        <Input
          id="codigo_afiliado"
          label="Código Afiliado Conductor"
          placeholder="Ej: AF-001 (dejar vacío si no se asigna)"
          error={errors.codigo_afiliado?.message}
          {...register("codigo_afiliado")}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar Mototaxi"}
        </Button>
      </div>
    </form>
  );
}
