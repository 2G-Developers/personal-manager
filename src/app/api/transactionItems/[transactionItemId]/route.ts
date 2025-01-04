import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

const collectionName = "transactionItems";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ transactionItemId: string }> }
) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const transactionItemId = (await params).transactionItemId;

    const body = await request.json();

    if (!transactionItemId) {
      return Response.json(
        { error: "Expense item ID is required" },
        { status: 400 }
      );
    }

    if (body.categoryId) {
      body.categoryId = new ObjectId(body.categoryId);
    }
    body.updatedAt = new Date();

    const result = await collection.updateOne(
      { _id: new ObjectId(transactionItemId) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return Response.json(
        { error: "Expense item not found" },
        { status: 404 }
      );
    }

    return Response.json({ message: "Expense item updated successfully" });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ transactionItemId: string }> }
) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const transactionItemId = (await params).transactionItemId;

    if (!transactionItemId) {
      return Response.json(
        { error: "Expense item ID is required" },
        { status: 400 }
      );
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(transactionItemId),
    });

    if (result.deletedCount === 0) {
      return Response.json(
        { error: "Expense item not found" },
        { status: 404 }
      );
    }

    return Response.json({ message: "Expense item deleted successfully" });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
