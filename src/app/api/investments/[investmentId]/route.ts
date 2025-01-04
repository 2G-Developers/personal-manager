import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

const collectionName = "investments";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ investmentId: string }> }
) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const investmentId = (await params).investmentId;

    const body = await request.json();

    if (!investmentId) {
      return Response.json(
        { error: "Investment ID is required" },
        { status: 400 }
      );
    }

    if (body.date) {
      body.date = new Date(body.date);
    }
    body.updatedAt = new Date();

    const result = await collection.updateOne(
      { _id: new ObjectId(investmentId) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return Response.json(
        { error: "Investment item not found" },
        { status: 404 }
      );
    }

    return Response.json({ message: "Investment item updated successfully" });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ investmentId: string }> }
) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const investmentId = (await params).investmentId;

    if (!investmentId) {
      return Response.json(
        { error: "Investment item ID is required" },
        { status: 400 }
      );
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(investmentId),
    });

    if (result.deletedCount === 0) {
      return Response.json(
        { error: "Investment item not found" },
        { status: 404 }
      );
    }

    return Response.json({ message: "Investment item deleted successfully" });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
