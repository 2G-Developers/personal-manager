import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

const collectionName = "categories";

// {
//     "name": "Leisure",
//     "description": "Expenses for leisure activities"
//   }
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const categoryId = (await params).categoryId;

    if (!categoryId) {
      return Response.json(
        { error: "Category  ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    body.updatedAt = new Date();

    const result = await collection.updateOne(
      { _id: new ObjectId(categoryId) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    return Response.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const categoryId = (await params).categoryId;

    if (!categoryId) {
      return Response.json(
        { error: "Category  ID is required" },
        { status: 400 }
      );
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(categoryId),
    });

    if (result.deletedCount === 0) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    return Response.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
