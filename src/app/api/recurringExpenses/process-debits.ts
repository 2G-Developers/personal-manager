import { connectToDatabase } from "@/lib/mongodb";

const collectionName = "recurringExpenses";

export async function POST() {
  const { database } = await connectToDatabase();
  const collection = database.collection(collectionName);

  const today = new Date();

  // Find expenses eligible for auto-debit
  const expensesToDebit = await collection
    .find({
      isAutoDebited: true,
      nextDueDate: { $lte: today },
    })
    .toArray();

  if (expensesToDebit.length === 0) {
    return Response.json({ message: "No expenses to auto-debit today" });
  }

  const logs = [];

  for (const expense of expensesToDebit) {
    try {
      // Simulate payment deduction (e.g., call payment gateway API here)
      const successful = true; // Replace with actual payment status

      if (successful) {
        const nextDueDate = calculateNextDueDate(
          expense.frequency,
          expense.nextDueDate
        );
        await collection.updateOne(
          { _id: expense._id },
          {
            $set: {
              lastDebitedDate: today,
              nextDueDate,
              updatedAt: new Date(),
            },
          }
        );

        logs.push({ id: expense._id, status: "success", nextDueDate });
      } else {
        logs.push({ id: expense._id, status: "failed" });
      }
    } catch (error) {
      logs.push({ id: expense._id, status: "error", error: error.message });
    }
  }

  return Response.json({ message: "Auto-debit processing complete", logs });
}

function calculateNextDueDate(frequency: string, currentDueDate: Date) {
  const nextDueDate = new Date(currentDueDate);
  if (frequency === "daily") nextDueDate.setDate(nextDueDate.getDate() + 1);
  if (frequency === "weekly") nextDueDate.setDate(nextDueDate.getDate() + 7);
  if (frequency === "monthly") nextDueDate.setMonth(nextDueDate.getMonth() + 1);
  if (frequency === "yearly")
    nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
  return nextDueDate;
}
