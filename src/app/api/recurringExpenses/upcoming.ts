import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest } from "next/server";

const collectionName = "recurringExpenses";

export async function GET(request: NextRequest) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days") ?? "7";
    const days = parseInt(daysParam, 10);

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const upcomingPayments = await collection
      .find({
        nextDueDate: { $gte: today, $lte: futureDate },
      })
      .toArray();

    return Response.json({ upcomingPayments });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
