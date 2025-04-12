"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/stores/orderStore";
import { toast } from "sonner";
import CustomerInfo from "./customer-info";
import OrderDetails from "./order-details";
import { createOrderRequest } from "@/requests/order/create";
import { OrderDetailInput } from "@/types";

export default function CreateOrderForm() {
  const router = useRouter();
  const { loadingCrud } = useOrderStore();

  const [customer, setCustomer] = useState({ customer_name: "", contact: "", notes: "", });

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const [orderDetails, setOrderDetails] = useState<(OrderDetailInput & { id: string })[]>([
    { id: generateId(), buket_name: "", size: "m", price: 0, quantity: 1, details: "", deadline: "", },
  ]);

  const handleCustomerChange = (field: string, value: string) => {
    setCustomer({ ...customer, [field]: value });
  };

  const handleOrderDetailChange = (
    index: number,
    field: keyof OrderDetailInput,
    value: string
  ) => {
    const updated = [...orderDetails];
    updated[index] = { ...updated[index], [field]: value };
    setOrderDetails(updated);
  };

  const handleAddDetail = () => {
    setOrderDetails([
      ...orderDetails,
      { id: generateId(), buket_name: "", size: "m", price: 0, quantity: 1, details: "", deadline: "", },
    ]);
  };

  const handleRemoveDetail = (index: number) => {
    setOrderDetails(orderDetails.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      customer_name: customer.customer_name,
      contact: customer.contact,
      notes: customer.notes,
      order_details: orderDetails.map((item) => ({
        buket_name: item.buket_name,
        size: item.size,
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
    <>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <CustomerInfo customer={customer} onChange={handleCustomerChange} />
            <OrderDetails
              details={orderDetails}
              onChange={handleOrderDetailChange}
              onAdd={handleAddDetail}
              onRemove={handleRemoveDetail}
            />
            <Button type="submit" className="w-full" disabled={loadingCrud}>
              {loadingCrud ? "Saving..." : "Submit Order"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}