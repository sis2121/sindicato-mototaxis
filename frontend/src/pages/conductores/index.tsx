import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
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
import {
  conductoresService,
  type Conductor,
} from "@/services/conductores.service";

const estadoVariant: Record<string, "success" | "warning" | "destructive"> = {
  ACTIVO: "success",
  SUSPENDIDO: "warning",
  RETIRADO: "destructive",
};

export default function ConductoresPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["conductores", search, estadoFilter, page],
    queryFn: () =>
      conductoresService.getAll({
        search,
        estado: estadoFilter,
        page,
        per_page: 10,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => conductoresService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conductores"] });
      setDeleteId(null);
    },
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["conductores"] });
  };

  const conductores = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Conductores</h1>
            <p className="text-muted-foreground">
              {meta?.total || 0} registrados
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
        <Link to="/conductores/crear">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Conductor
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, código o cédula..."
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
            { value: "SUSPENDIDO", label: "Suspendido" },
            { value: "RETIRADO", label: "Retirado" },
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
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conductores.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No se encontraron conductores
                    </TableCell>
                  </TableRow>
                ) : (
                  conductores.map((conductor: Conductor) => (
                    <TableRow key={conductor.id}>
                      <TableCell className="font-medium">
                        {conductor.codigo_afiliado}
                      </TableCell>
                      <TableCell>{conductor.nombre_completo}</TableCell>
                      <TableCell>{conductor.cedula_identidad}</TableCell>
                      <TableCell>{conductor.telefono || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            estadoVariant[conductor.estado] || "secondary"
                          }
                        >
                          {conductor.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link to={`/conductores/${conductor.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Ver detalle"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/conductores/${conductor.id}/editar`}>
                            <Button variant="ghost" size="icon" title="Editar">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Dialog
                            open={deleteId === conductor.id}
                            onOpenChange={(open) => !open && setDeleteId(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Eliminar"
                                onClick={() => setDeleteId(conductor.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirmar eliminación</DialogTitle>
                              </DialogHeader>
                              <p>
                                ¿Estás seguro de eliminar a{" "}
                                <strong>{conductor.nombre_completo}</strong>?
                                Esta acción no se puede deshacer.
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
                                  onClick={() =>
                                    deleteMutation.mutate(conductor.id)
                                  }
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
