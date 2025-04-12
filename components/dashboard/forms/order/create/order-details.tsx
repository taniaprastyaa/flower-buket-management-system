"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "@/components/ui/select";
import { OrderDetailInput} from "@/types";

interface OrderDetailsProps {
  details: (OrderDetailInput & { id: string })[];
  onChange: (index: number, field: keyof OrderDetailInput, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}
const sizes = ["s", "m", "l", "xl"];

export default function OrderDetails({
  details,
  onChange,
  onAdd,
  onRemove,
}: OrderDetailsProps) {
  return (
    <div className="grid gap-4 border-t pt-4">
      <h3 className="text-lg font-semibold">Order Details</h3>
      {details.map((detail, index) => (
        <div key={detail.id} className="grid gap-4 border p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor={`buket_name_${index}`}> Buket Name </label>
              <Input id={`buket_name_${index}`} placeholder="Buket Name" value={detail.buket_name} onChange={(e) => onChange(index, "buket_name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2"> Size </label>
              <Select value={detail.size}
                onValueChange={(value) =>
                  onChange(index, "size", value as string)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor={`price_${index}`}> Price </label>
              <Input id={`price_${index}`} type="number" placeholder="Price" value={detail.price} onChange={(e) => onChange(index, "price", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor={`quantity_${index}`}> Quantity </label>
              <Input id={`quantity_${index}`} type="number" placeholder="Quantity" value={detail.quantity} onChange={(e) => onChange(index, "quantity", e.target.value)} min={1} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor={`details_${index}`}> Details </label>
            <Textarea id={`details_${index}`} placeholder="Details" value={detail.details || ""} onChange={(e) => onChange(index, "details", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor={`deadline_${index}`}> Deadline </label>
            <Input id={`deadline_${index}`} type="date" value={detail.deadline} onChange={(e) => onChange(index, "deadline", e.target.value)}
            />
          </div>
          {details.length > 1 && (
            <Button type="button" variant="destructive" size="sm" onClick={() => onRemove(index)}>
              <IconTrash className="w-4 h-4 mr-2" /> Remove
            </Button>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" onClick={onAdd}>
        <IconPlus className="w-5 h-5 mr-2" /> Add Buket
      </Button>
    </div>
  );
}