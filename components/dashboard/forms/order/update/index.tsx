"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/stores/orderStore";
import { toast } from "sonner";
import CustomerInfo from "./customer-info";
import OrderDetails from "./order-details";
import { OrderDetailInput } from "@/types";
import { updateOrderRequest } from "@/requests/order/update";

export default function UpdateOrderForm() {
  const router = useRouter();
  const { id } = useParams();
  const { getOrderDetailsById, selectedOrder, loadingCrud, loading } = useOrderStore();

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const [customer, setCustomer] = useState({ customer_name: "", contact: "", notes: "", payment_status: "", total_price: 0});
  const [orderDetails, setOrderDetails] = useState<(OrderDetailInput & { id: string })[]>([{ id: generateId(), buket_name: "", size: "m", price: 0, quantity: 1, details: "", deadline: "", status: "Pending"}, ]);

  useEffect(() => {
    if (id) {
      getOrderDetailsById(id as string);
    }
  }, [id]);
  useEffect(() => {
    if (selectedOrder) {
      setCustomer({
        customer_name: selectedOrder.customer_name || "",
        contact: selectedOrder.contact || "",
        notes: selectedOrder.notes || "",
        payment_status: selectedOrder.payment_status || "",
        total_price: selectedOrder.total_price || 0
      });
      setOrderDetails(
        selectedOrder.order_details.map((item) => ({
          ...item,
        }))
      );
    }
  }, [selectedOrder]);

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
      { id: generateId(), buket_name: "", size: "m", price: 0, quantity: 1, details: "", deadline: "", status: "Pending"},
    ]);
  };

  const handleRemoveDetail = (index: number) => {
    setOrderDetails(orderDetails.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
        order_id: id as string,
        customer_name: customer.customer_name,
        contact: customer.contact,
        notes: customer.notes,
        order_details: orderDetails.map((item) => ({
          id: item.id,
          buket_name: item.buket_name,
          size: item.size,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 0,
          details: item.details,
          deadline: item.deadline,
          status: item.status,
        })),
    };
    const result = await updateOrderRequest(payload);
    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard/order");
    } else {
      toast.error(result.message);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
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
            {loadingCrud ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}