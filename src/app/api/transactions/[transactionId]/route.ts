import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

const collectionName = "transactions";

// {
//     "amount": 120,
//     "notes": "Updated payment amount"
//   }
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const body = await request.json();

    const transactionId = (await params).transactionId;

    if (!transactionId) {
      return Response.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    if (body.transactionItemId) {
      body.transactionItemId = new ObjectId(body.transactionItemId);
    }

    if (body.date) {
      body.date = new Date(body.date);
    }

    body.updatedAt = new Date();

    const result = await collection.updateOne(
      { _id: new ObjectId(transactionId) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: "Transaction not found" }, { status: 404 });
    }

    return Response.json({ message: "Transaction updated successfully" });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const transactionId = (await params).transactionId;

    if (!transactionId) {
      return Response.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(transactionId),
    });

    if (result.deletedCount === 0) {
      return Response.json({ error: "Transaction not found" }, { status: 404 });
    }

    return Response.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
