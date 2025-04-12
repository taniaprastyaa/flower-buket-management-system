"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CustomerInfoProps {
  customer: {
    customer_name: string;
    contact: string;
    notes: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function CustomerInfo({ customer, onChange }: CustomerInfoProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="customer_name">
            Customer Name
          </label>
          <Input
            id="customer_name"
            placeholder="Customer Name"
            value={customer.customer_name}
            onChange={(e) => onChange("customer_name", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="contact">
            Contact
          </label>
          <Input
            id="contact"
            placeholder="Contact"
            value={customer.contact}
            onChange={(e) => onChange("contact", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="notes">
          Notes (Optional)
        </label>
        <Textarea
          id="notes"
          placeholder="Notes"
          value={customer.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </div>
    </div>
  );
}