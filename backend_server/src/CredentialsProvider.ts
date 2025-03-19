import { Collection, MongoClient } from "mongodb";
import bcrypt from "bcrypt";

interface ICredentialsDocument {
    username: string;
    password: string;
}

export class CredentialsProvider {
    private readonly collection: Collection<ICredentialsDocument>;

    constructor(mongoClient: MongoClient) {
        const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
        if (!COLLECTION_NAME) {
            throw new Error("Missing CREDS_COLLECTION_NAME from env file");
        }
        this.collection = mongoClient.db().collection<ICredentialsDocument>(COLLECTION_NAME);
    }

    async registerUser(username: string, plaintextPassword: string): Promise<boolean> {
        const existingUser = await this.collection.findOne({ username });
        if (existingUser) {
            console.log(`User ${username} already exists in the database.`);
            return false;
        }
        //salt and hash
        try {
            const salt = await bcrypt.genSalt(10);
            console.log("Generated Salt:", salt);

            const hashedPassword = await bcrypt.hash(plaintextPassword, salt);
            console.log("Hashed Password:", hashedPassword);

            const result = this.collection.insertOne({
                username,
                password: hashedPassword,
            });
            console.log(`Inserted user: ${username}`, result);
            return true;
        }
        catch (error) {
            console.error(`Error inserting user ${username}:`, error);
            return false;
        }
    }

    async verifyPassword(username: string, plaintextPassword: string): Promise<boolean> {
        const user = await this.collection.findOne({ username });

        if (!user) {
            console.log(`User ${username} not found in database.`);
            return false; // User does not exist
        }

        console.log(`Stored Hash for ${username}:`, user.password);
        console.log(`Comparing with plaintext password:`, plaintextPassword);

        const isMatch = await bcrypt.compare(plaintextPassword, user.password);
        console.log(`Password match result:`, isMatch);
        
        return isMatch;
    }

    async doesUserExist(username: string): Promise<boolean> {
        const user = await this.collection.findOne({ username });
        return user !== null;
    }

    
}
