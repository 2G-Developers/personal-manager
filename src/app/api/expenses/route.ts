import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const { database } = await connectToDatabase();
  const collection = database.collection(process.env.NEXT_ATLAS_COLLECTION);

  const results = await collection.find({}).limit(100).toArray();

  return Response.json({ data: results });
}

export async function POST(request) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.NEXT_ATLAS_COLLECTION);

    const payload = await request.json();
    payload["created_at"] = new Date();
    payload["created_by"] = "Gopalakrishnan";

    const result = await collection.insertOne(payload);

    return Response.json({
      message: "Expense added successfully",
      objectId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.NEXT_ATLAS_COLLECTION);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: "Trip planner",
          category: "Travel",
          type: "expense",
          date: "",
          amount: 1000,
          created_by: "",
          created_at: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: "Object not found" }, { status: 404 });
    }

    return Response.json({ data: "Expense updated successfully" });
  } catch (error) {
    console.error("Error updating object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.NEXT_ATLAS_COLLECTION);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.matchedCount === 0) {
      return Response.json({ error: "Object not found" }, { status: 404 });
    }

    return Response.json({ data: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
