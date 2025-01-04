import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

const collectionName = "categories";

export async function GET(request: NextRequest) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page") ?? "1";
    const limitParam = searchParams.get("limit") ?? "10";

    const page = parseInt(pageParam, 10);
    const limit = parseInt(limitParam, 10);
    const search = searchParams.get("search") ?? "";

    type Filters = {
      name?: {
        $regex?: string;
        $options?: string;
      };
    };

    const filters: Filters = {};

    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const categories = await collection
      .find(filters)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments(filters);

    return Response.json({ total, page, limit, categories });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// {
//   "name": "Entertainment",
//   "type": "expense",
//   "description": "Expenses for movies, concerts, etc."
// }

export async function POST(request: NextRequest) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const body = await request.json();
    const { name, type, description } = body;

    if (!name || !type) {
      return Response.json(
        { error: "Name and type are required fields" },
        { status: 400 }
      );
    }

    const newCategory = {
      name,
      type,
      description: description || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newCategory);
    return Response.json({
      message: "Category created",
      categoryId: result.insertedId,
    });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
