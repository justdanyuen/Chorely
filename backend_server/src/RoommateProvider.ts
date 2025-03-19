import { MongoClient, ObjectId } from "mongodb";

interface Roommate {
    _id: ObjectId;
    name: string;
    createdBy: string;
}

interface User {
    _id: ObjectId;
    username: string;
    email: string;
}

export class RoommateProvider {
    private collectionName: string;
    private usersCollectionName: string;

    constructor(private readonly mongoClient: MongoClient) {
        this.collectionName = process.env.ROOMMATES_COLLECTION_NAME || "";
        this.usersCollectionName = process.env.CREDS_COLLECTION_NAME || "";

        if (!this.collectionName || !this.usersCollectionName) {
            throw new Error("Missing collection names from environment variables");
        }
    }

    async getAllRoommates(createdBy?: string): Promise<Roommate[]> {
        const db = this.mongoClient.db();
        const roommatesCollection = db.collection<Roommate>(this.collectionName);

        const query: any = {};
        if (createdBy) {
            query.createdBy = createdBy;
        }

        return await roommatesCollection.find(query).toArray();
    }

    async createRoommate(roommate: { name: string; createdBy: string }): Promise<void> {
        if (!roommate) {
            throw new Error("Roommate data is undefined");
        }

        const db = this.mongoClient.db();
        const roommatesCollection = db.collection<Roommate>(this.collectionName);
        const usersCollection = db.collection<User>(this.usersCollectionName);

        const user = await usersCollection.findOne({ username: roommate.createdBy });

        if (!user) {
            throw new Error(`User with username "${roommate.createdBy}" not found`);
        }

        const newRoommate: Roommate = {
            _id: new ObjectId(), 
            name: roommate.name,
            createdBy: user.username
        };

        await roommatesCollection.insertOne(newRoommate);
        console.log("Roommate created successfully:", newRoommate);
    }

    async updateRoommateName(roommateId: string, newName: string): Promise<number> {
        if (!ObjectId.isValid(roommateId)) {
            throw new Error("Invalid roommate ID");
        }

        console.log(`Updating roommate ${roommateId} with new name: ${newName}`);
    
        const db = this.mongoClient.db();
        const roommatesCollection = db.collection<Roommate>(this.collectionName);
    
        const result = await roommatesCollection.updateOne(
            { _id: new ObjectId(roommateId) },
            { $set: { name: newName } }
        );
    
        console.log("Matched documents:", result.matchedCount);
        return result.matchedCount;
    }

    async deleteRoommate(name: string, createdBy: string): Promise<{ deletedCount: number }> {
        const db = this.mongoClient.db();
        const roommatesCollection = db.collection<Roommate>(this.collectionName);
    
        const roommate = await roommatesCollection.findOne({ name, createdBy });
    
        if (!roommate) {
            console.log(`No roommate found with name "${name}" created by "${createdBy}"`);
            return { deletedCount: 0 };
        }
    
        const objectId = new ObjectId(roommate._id); // Convert `_id` to `ObjectId`
    
        const result = await roommatesCollection.deleteOne({ _id: objectId });
    
        console.log(`Deleted roommate "${name}" created by "${createdBy}"`, result.deletedCount);
    
        return { deletedCount: result.deletedCount };
    }
}
