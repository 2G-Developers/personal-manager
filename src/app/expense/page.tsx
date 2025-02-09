"use client";

import React, { useActionState } from "react";
import { DataTable } from "./components/datatable";
import { columns, Expenses } from "./components/datatable/columns";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { expenseAction } from "./actions";

async function getData(): Promise<Expenses[]> {
  return [
    {
      id: "001",
      name: "Shuttle",
      category: "gaming",
      type: "Expense",
      date: "Dec 20",
      amount: 200,
    },
  ];
}

export default function ExpenseHome() {
  const [state, formAction, isPending] = useActionState(expenseAction, {});

  return (
    <div>
      ExpenseHome
      <div>datepicker: Dec 20</div>
      <div>Total Expense: 10000</div>
      <div>Total Income: 200000</div>
      {/* <DataTable columns={columns} data={[{}]} /> */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Expense</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add your expenses</DialogTitle>
          </DialogHeader>
          <>
            <div></div>
            <form action={formAction}>
              <label>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter name"
                required
              />

              <label>Type</label>
              <select id="type" name="type" required>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <label>Category</label>
              <select id="category" name="category" required>
                <option value="savings">Savings</option>
                <option value="bills">Bills</option>
                <option value="shopping">Shopping</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>

              <label>Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="Enter the amount"
                required
                min="0"
                step="0.01"
              />

              <label>Date</label>
              <input type="date" id="date" name="date" required />
              <button type="submit">Submit</button>
            </form>
          </>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
