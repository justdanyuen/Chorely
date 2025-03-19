import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { registerTaskRoutes } from "./routes/tasks";
import { registerRoommateRoutes } from "./routes/roommates";
import { registerAuthRoutes, verifyAuthToken } from "./routes/auth";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

async function setUpServer() {
    const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME} = process.env;

    if (!MONGO_USER || !MONGO_PWD || !MONGO_CLUSTER || !DB_NAME) {
        console.error("Missing required MongoDB environment variables.");
        process.exit(1);
    }

    const encodedPassword = encodeURIComponent(MONGO_PWD); // URL-encode password
    const connectionString = `mongodb+srv://${MONGO_USER}:${encodedPassword}@${MONGO_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

    console.log("Attempting Mongo connection...");

    try {
        const mongoClient = await MongoClient.connect(connectionString);
        console.log("Connected to MongoDB");


        // app.use("/api/*", verifyAuthToken);
        registerAuthRoutes(app, mongoClient);
        registerTaskRoutes(app, mongoClient);
        registerRoommateRoutes(app, mongoClient);

        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

        // const collectionInfos = await mongoClient.db().listCollections().toArray();
        // console.log(collectionInfos.map((collectionInfo) => collectionInfo.name));


    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}

setUpServer();