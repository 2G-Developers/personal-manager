import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const collectionName = "transactions";

const parseQueryparams = (url) => {
  const { searchParams } = new URL(url);

  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "10";

  return {
    type: searchParams.get("type"),
    startDate: searchParams.get("startDate") ?? null,
    endDate: searchParams.get("endDate") ?? null,
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
  };
};

export async function GET(request) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const { type, startDate, endDate, page, limit } = parseQueryparams(
      request.url
    );

    type Filters = {
      type?: string;
      date?: {
        $gte?: Date;
        $lte?: Date;
      };
    };

    const filters: Filters = {};

    if (type) filters.type = type;
    if (startDate || endDate) {
      filters.date = {};
      if (startDate) filters.date.$gte = new Date(startDate);
      if (endDate) filters.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const transactions = await collection
      .find(filters)
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await collection.countDocuments(filters);

    return Response.json({ total, page, limit, transactions });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// {
//     "name": "Electricity Bill",
//     "type": "expense",
//     "categoryId": "64a0c9e6bcf86cd799439011",
//     "amount": 100,
//     "date": "2025-01-01",
//     "notes": "Monthly payment"
//   }
export async function POST(request) {
  try {
    const { database } = await connectToDatabase();
    const collection = database.collection(collectionName);

    const body = await request.json();
    const { name, type, transactionItemId, amount, date, notes } = body;

    if (!name || !type || !transactionItemId || !amount || !date) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTransaction = {
      name,
      type,
      transactionItemId: new ObjectId(transactionItemId),
      amount,
      date: new Date(date),
      notes: notes || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newTransaction);
    return Response.json({
      message: "Transaction created",
      transactionId: result.insertedId,
    });
  } catch (error) {
    console.error("Error object:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
