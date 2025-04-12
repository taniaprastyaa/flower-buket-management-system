"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CustomerInfoProps {
  customer: {
    customer_name: string;
    contact: string;
    notes: string;
    payment_status: string;
    total_price: number;
  };
}

export default function CustomerInfo({ customer}: CustomerInfoProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="customer_name">
            Customer Name
          </label>
          <Input
            id="customer_name"
            value={customer.customer_name}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="contact">
            Contact
          </label>
          <Input
            id="contact"
            value={customer.contact}
            readOnly
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="notes">
          Notes (Optional)
        </label>
        <Textarea
          id="notes"
          value={customer.notes}
          readOnly
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="payment_status">
              Payment Status
            </label>
            <Input
              id="payment_status"
              value={customer.payment_status}
              readOnly
            />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="notes">
                Total Price
              </label>
              <Input
                id="total_price"
                value={customer.total_price}
                readOnly
              />
            </div>
        </div>
    </div>
  );
}