"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useOrderStore } from "@/stores/orderStore";
import CustomerInfo from "./customer-info";
import OrderDetails from "./order-details";

export default function OrderDetailForm() {
  const { id } = useParams();
  const { selectedOrder, getOrderDetailsById, loading } = useOrderStore();

  useEffect(() => {
    if (id) {
      getOrderDetailsById(id as string);
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Card>
          <CardContent>
            <p>Loading...</p>
          </CardContent>
        </Card>
      </>
    );
  }

  if (!selectedOrder || selectedOrder.id === "") return null;

  const customer = {
    customer_name: selectedOrder.customer_name,
    contact: selectedOrder.contact,
    notes: selectedOrder.notes || "",
    payment_status: selectedOrder.payment_status,
    total_price: selectedOrder.total_price
  };

  return (
    <>
      <Card>
        <CardContent className="grid gap-4">
          <CustomerInfo customer={customer} />
          <OrderDetails details={selectedOrder.order_details} />
        </CardContent>
      </Card>
    </>
  );
}