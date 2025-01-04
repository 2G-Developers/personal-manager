import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

const collectionName = "investments";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ recurringExpenseId: string }> }
) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const recurringExpenseId = (await params).recurringExpenseId;

    const body = await request.json();

    if (!recurringExpenseId) {
      return Response.json(
        { error: "Recurring expense is required" },
        { status: 400 }
      );
    }

    if (body.startDate) {
      body.startDate = new Date(body.startDate);
    }
    if (body.endDate) {
      body.endDate = new Date(body.endDate);
    }
    body.updatedAt = new Date();

    const result = await collection.updateOne(
      { _id: new ObjectId(recurringExpenseId) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return Response.json(
        { error: "Recurring expense not found" },
        { status: 404 }
      );
    }

    return Response.json({ message: "Recurring expense updated successfully" });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ recurringExpenseId: string }> }
) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const recurringExpenseId = (await params).recurringExpenseId;

    if (!recurringExpenseId) {
      return Response.json(
        { error: "Recurring expense ID is required" },
        { status: 400 }
      );
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(recurringExpenseId),
    });

    if (result.deletedCount === 0) {
      return Response.json(
        { error: "Recurring expense not found" },
        { status: 404 }
      );
    }

    return Response.json({ message: "Recurring expense deleted successfully" });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
