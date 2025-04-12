"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "@/components/ui/select";
import { OrderDetailInput } from "@/types";

interface OrderDetailsProps {
  details: (OrderDetailInput)[];
}
const sizes = ["s", "m", "l", "xl"];
const status = ["Pending", "In Progress", "Completed", "Canceled"];

export default function OrderDetails({
  details
}: OrderDetailsProps) {

  console.log(details);

  return (
    <div className="grid gap-4 border-t pt-4">
      <h3 className="text-lg font-semibold">Order Details</h3>
      {details.map((detail, index) => (
        <div key={detail.id} className="grid gap-4 border p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor={`buket_name_${index}`}> Buket Name </label>
              <Input id={`buket_name_${index}`} value={detail.buket_name} readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2"> Size </label>
              <Select value={detail.size} disabled>
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
              <Input id={`price_${index}`} type="number" value={detail.price} readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor={`quantity_${index}`}> Quantity </label>
              <Input id={`quantity_${index}`} type="number" value={detail.quantity} readOnly />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor={`details_${index}`}> Details </label>
            <Textarea id={`details_${index}`} placeholder="Details" value={detail.details} readOnly
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor={`deadline_${index}`}> Deadline </label>
              <Input id={`deadline_${index}`} type="date" value={detail.deadline} readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2"> Status </label>
              <Select value={detail.status} disabled>
                <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    {status.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}