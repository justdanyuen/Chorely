import { MongoClient, Collection, ObjectId } from "mongodb";

interface Task {
    _id: ObjectId;
    text: string;
    completed: boolean;
    createdAt: string;
    createdBy: string;
}

interface User {
    _id: ObjectId;
    username: string;
    email: string;
}

export class TaskProvider {
    private collectionName: string;
    private usersCollectionName: string;

    constructor(private readonly mongoClient: MongoClient) {
        this.collectionName = process.env.TASKS_COLLECTION_NAME || "";
        this.usersCollectionName = process.env.CREDS_COLLECTION_NAME || "";
        
        if (!this.collectionName || !this.usersCollectionName) {
            throw new Error("Missing collection names from environment variables");
        }
    }

    async createTask(task: { text: string; completed: boolean; createdAt: string; createdBy: string }): Promise<void> {
        if (!task) {
            throw new Error("Task is undefined");
        }
        const db = this.mongoClient.db();
        const tasksCollection = db.collection(this.collectionName);
        const usersCollection = db.collection<User>(this.usersCollectionName);

        const user = await usersCollection.findOne({username:task.createdBy});

        if (!user) {
            throw new Error(`User with id ${task.createdBy} not found`);
        }

        const newTask: Task = {
            ...task,
            _id: new ObjectId(),
            createdBy: user.username 
        };

        await tasksCollection.insertOne(newTask);
    }

    async getAllTasks(createdBy?: string): Promise<Task[]> {
        const db = this.mongoClient.db();
        const tasksCollection = db.collection<Task>(this.collectionName);
        const usersCollection = db.collection<User>(this.usersCollectionName);

        const query: any = {};
        if (createdBy) {
            const user = await usersCollection.findOne({username: createdBy});
            if (!user) {
                throw new Error(`User with username "${createdBy}" not found`);
            }
            query.createdBy = createdBy;
        }
    
        return await tasksCollection.find(query).toArray();
    }



    async updateTask(taskId: string, updateData: Partial<{ text: string; completed: boolean }>): Promise<{ modifiedCount: number }> {
        if (!ObjectId.isValid(taskId)) {
            throw new Error("Invalid task ID");
        }
    
        const db = this.mongoClient.db();
        const tasksCollection = db.collection(this.collectionName);
        
        const result = await tasksCollection.updateOne(
            { _id: new ObjectId(taskId) },
            { $set: updateData }
        );
    
        return { modifiedCount: result.modifiedCount };
    }
    
    async deleteTask(text: string, createdBy: string): Promise<{ deletedCount: number }> {
        const db = this.mongoClient.db();
        const tasksCollection = db.collection<Task>(this.collectionName);
    
        const task = await tasksCollection.findOne({ text, createdBy });
    
        if (!task) {
            console.log(`No task found with text "${text}" created by "${createdBy}"`);
            return { deletedCount: 0 };
        }
    
        const objectId = new ObjectId(task._id); // Convert `_id` to `ObjectId`
    
        const result = await tasksCollection.deleteOne({ _id: objectId });
    
        console.log(`Deleted task "${text}" created by "${createdBy}"`, result.deletedCount);
    
        return { deletedCount: result.deletedCount };
    }
}
