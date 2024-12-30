"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Expenses = {
  id: string;
  name: string;
  category: string;
  type: string;
  date: string;
  amount: number;
};

export const columns: ColumnDef<Expenses>[] = [
  {
    accessorKey: "date",
    header: "date",
  },
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "category",
    header: "category",
  },
  {
    accessorKey: "type",
    header: "type",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
