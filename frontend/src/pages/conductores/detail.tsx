import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { conductoresService } from "@/services/conductores.service";

const estadoVariant: Record<string, "success" | "warning" | "destructive"> = {
  ACTIVO: "success",
  SUSPENDIDO: "warning",
  RETIRADO: "destructive",
};

export default function ConductorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["conductor", id],
    queryFn: () => conductoresService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const conductor = data?.data;
  if (!conductor)
    return <p className="text-muted-foreground">Conductor no encontrado.</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/conductores")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
        <Link to={`/conductores/${conductor.id}/editar`}>
          <Button variant="outline" className="gap-2">
            <Pencil className="h-4 w-4" /> Editar
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{conductor.nombre_completo}</CardTitle>
            <Badge variant={estadoVariant[conductor.estado] || "secondary"}>
              {conductor.estado}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem
              label="Código Afiliado"
              value={conductor.codigo_afiliado}
            />
            <InfoItem
              label="Cédula Identidad"
              value={conductor.cedula_identidad}
            />
            <InfoItem label="Teléfono" value={conductor.telefono || "—"} />
            <InfoItem label="Dirección" value={conductor.direccion || "—"} />
            <InfoItem
              label="Fecha Nacimiento"
              value={conductor.fecha_nacimiento || "—"}
            />
            <InfoItem
              label="Licencia Conducir"
              value={conductor.licencia_conducir || "—"}
            />
            <InfoItem
              label="Categoría Licencia"
              value={conductor.categoria_licencia || "—"}
            />
            <InfoItem
              label="Fecha Afiliación"
              value={conductor.fecha_afiliacion || "—"}
            />
          </div>

          {/* Fotografía */}
          {conductor.fotografia && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Fotografía</p>
              <img
                src={conductor.fotografia}
                alt={`Foto de ${conductor.nombre_completo}`}
                className="h-48 w-48 object-cover rounded-md border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          {/* Mototaxi asignada */}
          {conductor.mototaxi && (
            <div className="mt-4 p-4 rounded-lg bg-muted">
              <p className="font-semibold text-sm">Mototaxi Asignada</p>
              <p className="text-sm">
                Placa: {conductor.mototaxi.placa} — {conductor.mototaxi.marca}{" "}
                {conductor.mototaxi.modelo}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
