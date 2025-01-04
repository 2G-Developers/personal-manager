import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

const collectionName = "transactionItems";

export async function GET(request: NextRequest) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const { searchParams } = new URL(request.url);

    const pageParam = searchParams.get("page") ?? "1";
    const limitParam = searchParams.get("limit") ?? "10";

    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search") ?? "";
    const page = parseInt(pageParam, 10);
    const limit = parseInt(limitParam, 10);

    type Filters = {
      categoryId?: ObjectId;
      name?: {
        $regex?: string;
        $options?: string;
      };
    };

    const filters: Filters = {};
    if (categoryId) filters.categoryId = new ObjectId(categoryId);
    if (search) filters.name = { $regex: search, $options: "i" }; // Case-insensitive search

    const skip = (page - 1) * limit;
    const transactionItems = await collection
      .find(filters)
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await collection.countDocuments(filters);

    return Response.json({ total, page, limit, transactionItems });
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
    const { name, categoryId, description } = body;

    if (!name || !categoryId) {
      return Response.json(
        { error: "Name and categoryId are required fields" },
        { status: 400 }
      );
    }

    const newTransactionItems = {
      name,
      categoryId: new ObjectId(categoryId),
      description: description || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newTransactionItems);
    return Response.json({
      message: "Expense item created",
      transactionItemId: result.insertedId,
    });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
