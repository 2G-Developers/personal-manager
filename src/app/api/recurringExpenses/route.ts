import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

const collectionName = "recurringExpenses";

export async function GET(request: NextRequest) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const { searchParams } = new URL(request.url);

    const pageParam = searchParams.get("page") ?? "1";
    const limitParam = searchParams.get("limit") ?? "10";

    const search = searchParams.get("search") ?? "";
    const page = parseInt(pageParam, 10);
    const limit = parseInt(limitParam, 10);

    type Filters = {
      name?: {
        $regex?: string;
        $options?: string;
      };
    };

    const filters: Filters = {};
    if (search) filters.name = { $regex: search, $options: "i" }; // Case-insensitive search

    const skip = (page - 1) * limit;
    const recurringExpenses = await collection
      .find(filters)
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await collection.countDocuments(filters);

    return Response.json({ total, page, limit, recurringExpenses });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const body = await request.json();
    const {
      name,
      amount,
      frequency,
      startDate,
      endDate,
      categoryId,
      description,
      isAutoDebited,
    } = body;

    if (!name || !amount || !frequency || !startDate || !categoryId) {
      return Response.json(
        {
          error:
            "Name, amount, frequency, startDate and date, categoryId are required fields",
        },
        { status: 400 }
      );
    }

    const newRecurringExpense = {
      name,
      amount,
      frequency, // e.g., "monthly", "weekly", "yearly"
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      categoryId: new ObjectId(categoryId),
      description: description || "",
      isAutoDebited: isAutoDebited || false,
      nextDueDate: new Date(startDate), // Set initial next due date
      lastDebitedDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newRecurringExpense);
    return Response.json({
      message: "Recurring expense created",
      expenseItemId: result.insertedId,
    });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
