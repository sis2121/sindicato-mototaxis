// frontend/src/pages/mototaxis/index.tsx

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mototaxisService, type Mototaxi } from "@/services/mototaxis.service";

const estadoVariant: Record<string, "success" | "warning" | "destructive"> = {
  ACTIVO: "success",
  EN_REPARACION: "warning",
  FUERA_SERVICIO: "destructive",
};

export default function MototaxisPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["mototaxis", search, estadoFilter, page],
    queryFn: () =>
      mototaxisService.getAll({
        search,
        estado: estadoFilter,
        page,
        per_page: 10,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mototaxisService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mototaxis"] });
      setDeleteId(null);
    },
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["mototaxis"] });
  };

  const mototaxis = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mototaxis</h1>
            <p className="text-muted-foreground">
              {meta?.total || 0} registradas
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            title="Actualizar"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <Link to="/mototaxis/crear">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Mototaxi
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por placa, marca o modelo..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          options={[
            { value: "", label: "Todos los estados" },
            { value: "ACTIVO", label: "Activo" },
            { value: "EN_REPARACION", label: "En Reparación" },
            { value: "FUERA_SERVICIO", label: "Fuera de Servicio" },
          ]}
          value={estadoFilter}
          onChange={(e) => {
            setEstadoFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-48"
        />
      </div>

      {/* Tabla */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Marca/Modelo</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Conductor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mototaxis.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No se encontraron mototaxis
                    </TableCell>
                  </TableRow>
                ) : (
                  mototaxis.map((m: Mototaxi) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.placa}</TableCell>
                      <TableCell>
                        {m.marca} {m.modelo || ""}
                      </TableCell>
                      <TableCell>{m.color || "—"}</TableCell>
                      <TableCell>{m.año || "—"}</TableCell>
                      <TableCell>
                        {m.conductor?.nombre_completo || "Sin asignar"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={estadoVariant[m.estado] || "secondary"}>
                          {m.estado.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link to={`/mototaxis/${m.id}/editar`}>
                            <Button variant="ghost" size="icon" title="Editar">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Dialog
                            open={deleteId === m.id}
                            onOpenChange={(open) => !open && setDeleteId(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Eliminar"
                                onClick={() => setDeleteId(m.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirmar eliminación</DialogTitle>
                              </DialogHeader>
                              <p>
                                ¿Eliminar la mototaxi placa{" "}
                                <strong>{m.placa}</strong>?
                              </p>
                              <div className="flex justify-end gap-2 mt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => setDeleteId(null)}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => deleteMutation.mutate(m.id)}
                                >
                                  Eliminar
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {meta && meta.total_pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Página {meta.page} de {meta.total_pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.total_pages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
