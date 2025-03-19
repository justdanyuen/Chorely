import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;

if (!MONGO_USER || !MONGO_PWD || !MONGO_CLUSTER || !DB_NAME) {
    throw new Error("Missing MongoDB environment variables!");
}

const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;

const client = new MongoClient(connectionString);

export async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        return client.db(DB_NAME);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

connectToDatabase();
