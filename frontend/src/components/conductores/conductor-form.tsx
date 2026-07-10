import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  conductorSchema,
  type ConductorFormValues,
} from "@/schemas/conductor.schema";
import api from "@/services/api";

interface Props {
  defaultValues?: Partial<ConductorFormValues>;
  onSubmit: (data: ConductorFormValues) => void;
  isLoading: boolean;
  error?: string | null;
}

export function ConductorForm({
  defaultValues,
  onSubmit,
  isLoading,
  error,
}: Props) {
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(
    defaultValues?.fotografia || null,
  );
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ConductorFormValues>({
    resolver: zodResolver(conductorSchema),
    defaultValues: { estado: "ACTIVO", ...defaultValues },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFotoFile(null);
      setFotoPreview(defaultValues?.fotografia || null);
      setValue("fotografia", defaultValues?.fotografia || "");
      return;
    }

    setFotoFile(file);

    // Mostrar vista previa local inmediatamente
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFotoPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Subir al servidor
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setValue("fotografia", data.url); // guardar URL en el formulario
      setFotoPreview(data.url); // mantener preview (ahora del servidor)
    } catch (err: any) {
      const mensaje =
        err?.response?.data?.error || "Error desconocido al subir la imagen";
      alert(`Error al subir imagen: ${mensaje}`);
      setFotoFile(null);
      setFotoPreview(defaultValues?.fotografia || null);
      setValue("fotografia", defaultValues?.fotografia || "");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="codigo_afiliado"
          label="Código Afiliado *"
          error={errors.codigo_afiliado?.message}
          {...register("codigo_afiliado")}
        />
        <Input
          id="cedula_identidad"
          label="Cédula *"
          error={errors.cedula_identidad?.message}
          {...register("cedula_identidad")}
        />
        <Input
          id="nombres"
          label="Nombres *"
          error={errors.nombres?.message}
          {...register("nombres")}
        />
        <Input
          id="apellidos"
          label="Apellidos *"
          error={errors.apellidos?.message}
          {...register("apellidos")}
        />
        <Input
          id="telefono"
          label="Teléfono"
          error={errors.telefono?.message}
          {...register("telefono")}
        />
        <Input
          id="direccion"
          label="Dirección"
          error={errors.direccion?.message}
          {...register("direccion")}
        />
        <Input
          id="fecha_nacimiento"
          label="Fecha Nacimiento"
          type="date"
          error={errors.fecha_nacimiento?.message}
          {...register("fecha_nacimiento")}
        />
        <Input
          id="licencia_conducir"
          label="Licencia Conducir"
          error={errors.licencia_conducir?.message}
          {...register("licencia_conducir")}
        />
        <Input
          id="categoria_licencia"
          label="Categoría Licencia"
          error={errors.categoria_licencia?.message}
          {...register("categoria_licencia")}
        />
        <Input
          id="fecha_afiliacion"
          label="Fecha Afiliación"
          type="date"
          error={errors.fecha_afiliacion?.message}
          {...register("fecha_afiliacion")}
        />
        <Select
          id="estado"
          label="Estado"
          options={[
            { value: "ACTIVO", label: "Activo" },
            { value: "SUSPENDIDO", label: "Suspendido" },
            { value: "RETIRADO", label: "Retirado" },
          ]}
          error={errors.estado?.message}
          {...register("estado")}
        />

        {/* Campo de fotografía */}
        <div className="space-y-1 col-span-2">
          <label className="text-sm font-medium">Fotografía</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {uploading && (
            <p className="text-xs text-muted-foreground">Subiendo imagen...</p>
          )}
          {fotoPreview && (
            <div className="mt-2">
              <img
                src={fotoPreview}
                alt="Vista previa"
                className="h-32 w-32 object-cover rounded-md border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
          <input type="hidden" {...register("fotografia")} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || uploading}>
          {isLoading || uploading ? "Guardando..." : "Guardar Conductor"}
        </Button>
      </div>
    </form>
  );
}
