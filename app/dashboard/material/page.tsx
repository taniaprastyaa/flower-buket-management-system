"use client";

import { useState, useEffect } from "react";
import { useMaterialStore } from "@/stores/materialStore";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { getMaterialColumns } from "@/components/dashboard/datatable/columns/material";
import { DataTable } from "@/components/dashboard/datatable/datatable";
import { DataTablePagination } from "@/components/dashboard/datatable/datatable-pagination";
import { TableSearch } from "@/components/dashboard/datatable/table-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CreateMaterialModal from "@/components/dashboard/forms/material/create";
import UpdateMaterialModal from "@/components/dashboard/forms/material/update";
import { DeleteMaterialDialog } from "@/components/dashboard/forms/material/delete";
import type { Material } from "@/types";

export default function MaterialPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const { materials, fetchMaterials, loading} = useMaterialStore();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [selectedMaterialName, setSelectedMaterialName] = useState("");

  useEffect(() => {
    const getMaterials = async () => {
      try {
        await fetchMaterials();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred while retrieving material data");
        }
      }
    };
    getMaterials();
  }, [fetchMaterials]);

  const table = useReactTable({
    data: materials,
    columns: getMaterialColumns({
      actions: (row) => [
        {
          label: "Update",
          onClick: () => {
            setSelectedMaterial(row);
            setOpenUpdateModal(true);
          },
        },
        {
          label: "Delete",
          onClick: async () => {
            setSelectedMaterialId(row.id);
            setSelectedMaterialName(row.name);
            setDeleteDialogOpen(true);
          },
        },
      ],
    }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });  

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Material List</CardTitle>
          <div className="flex gap-5 items-center mt-2">
            <TableSearch value={globalFilter} onChange={setGlobalFilter} />
            <Button onClick={() => setOpenCreateModal(true)}>
              <IconPlus className="w-5 h-5 mr-2" /> Create Material
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <DataTable table={table} columnsLength={getMaterialColumns({}).length} />
              <DataTablePagination table={table} />
            </>
          )}
        </CardContent>
      </Card>
      <CreateMaterialModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} />
      <UpdateMaterialModal open={openUpdateModal} onClose={() => setOpenUpdateModal(false)} material={selectedMaterial} />
      <DeleteMaterialDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} materialId={selectedMaterialId} materialName={selectedMaterialName} />
    </div>
  );
}