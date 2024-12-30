import { MongoClient, Db, MongoClientOptions } from "mongodb";

const uri: string = process.env.NEXT_ATLAS_URI as string;
const options: MongoClientOptions = {};

let mongoClient: MongoClient;
let database: Db;

if (!process.env.NEXT_ATLAS_URI) {
  throw new Error("Please add your mongo URI to .env.local");
}

export const connectToDatabase = async (): Promise<
  | {
      mongoClient: MongoClient;
      database: Db;
    }
  | undefined
> => {
  try {
    if (mongoClient && database) {
      return { mongoClient, database };
    }

    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClient) {
        mongoClient = await new MongoClient(uri, options).connect();
        global._mongoClient = mongoClient;
      } else {
        mongoClient = global._mongoClient;
      }
    } else {
      mongoClient = await new MongoClient(uri, options).connect();
    }

    database = await mongoClient.db(process.env.NEXT_ATLAS_DATABASE);
    return { mongoClient, database };
  } catch (e) {
    console.error(e);
  }
};
