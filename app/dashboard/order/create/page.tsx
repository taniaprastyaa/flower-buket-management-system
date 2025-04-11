"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { createOrderRequest } from "@/requests/order/create";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/stores/orderStore";
import { toast } from "sonner";

export default function CreateOrderPage() {
  const { loadingCrud } = useOrderStore();
  
  const [customer, setCustomer] = useState({
    name: "",
    contact: "",
    notes: "",
  });

  const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const [orderDetails, setOrderDetails] = useState([
    {
      id: generateUniqueId(),
      buket_name: "",
      size: "m",
      price: "",
      quantity: "",
      details: "",
      deadline: "",
    },
  ]);

  const router = useRouter();

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...orderDetails];
    updated[index] = { ...updated[index], [field]: value };
    setOrderDetails(updated);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      customer_name: customer.name,
      contact: customer.contact,
      notes: customer.notes,
      order_details: orderDetails.map((item) => ({
        buket_name: item.buket_name,
        size: item.size as "s" | "m" | "l" | "xl",
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 0,        
        details: item.details,
        deadline: item.deadline,
      })),
    };

    const result = await createOrderRequest(payload);

    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard/order");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Customer Info */}
            <Input
              placeholder="Customer Name"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />
            <Input
              placeholder="Contact"
              value={customer.contact}
              onChange={(e) =>
                setCustomer({ ...customer, contact: e.target.value })
              }
            />
            <Textarea
              placeholder="Notes (Optional)"
              value={customer.notes}
              onChange={(e) =>
                setCustomer({ ...customer, notes: e.target.value })
              }
            />

            {/* Order Details */}
            <div className="grid gap-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Order Details</h3>
              {orderDetails.map((detail, index) => (
                <div
                  key={detail.id}
                  className="grid gap-2 border p-4 rounded-md"
                >
                  <Input
                    placeholder="Buket Name"
                    value={detail.buket_name}
                    onChange={(e) =>
                      handleChange(index, "buket_name", e.target.value)
                    }
                  />

                  <Select
                    value={detail.size}
                    onValueChange={(value) => handleChange(index, "size", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s">S</SelectItem>
                      <SelectItem value="m">M</SelectItem>
                      <SelectItem value="l">L</SelectItem>
                      <SelectItem value="xl">XL</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Price"
                    value={detail.price}
                    onChange={(e) =>
                      handleChange(index, "price", e.target.value)
                    }
                  />
                  <Input
                    min={1}
                    type="number"
                    placeholder="Quantity"
                    value={detail.quantity}
                    onChange={(e) =>
                      handleChange(index, "quantity", e.target.value)
                    }
                  />
                  <Textarea
                    placeholder="Details"
                    value={detail.details}
                    onChange={(e) =>
                      handleChange(index, "details", e.target.value)
                    }
                  />
                  <Input
                    type="date"
                    value={detail.deadline}
                    onChange={(e) =>
                      handleChange(index, "deadline", e.target.value)
                    }
                  />

                  {orderDetails.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setOrderDetails(orderDetails.filter((_, i) => i !== index))
                      }
                    >
                      <IconTrash className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setOrderDetails([
                    ...orderDetails,
                    {
                      id: generateUniqueId(),
                      buket_name: "",
                      size: "m",
                      price: "",
                      quantity: "",
                      details: "",
                      deadline: "",
                    },
                  ])
                }
              >
                <IconPlus className="w-5 h-5 mr-2" /> Add Buket
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={loadingCrud}>
              {
                loadingCrud ? 'Saving...' : 'Submit Order'
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}