import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { RoommateProvider } from "../RoommateProvider";

export function registerRoommateRoutes(app: express.Application, mongoClient: MongoClient) {
    const roommateProvider = new RoommateProvider(mongoClient);

    app.get("/api/roommates", async (req: Request, res: Response) => {
        try {
            let createdBy: string | undefined = undefined;
            if (typeof req.query.createdBy === "string") {
                createdBy = req.query.createdBy;
            }

            console.log("Fetching roommates created by:", createdBy);

            if (!createdBy) {
                res.status(400).json({ error: "Missing createdBy parameter" });
                return;
            }

            const roommates = await roommateProvider.getAllRoommates(createdBy);

            if (!roommates || !Array.isArray(roommates)) {
                console.error("ERROR: Expected an array but got:", roommates);
                res.status(500).json({ error: "Invalid data format" });
                return;
            }

            console.log("Sending Roommates Data:", roommates);
            res.json(roommates.length > 0 ? roommates : []);
        } catch (error) {
            console.error("Error Fetching Roommates:", error);
            res.status(500).json({ error: "Failed to fetch roommates" });
        }
    });

    app.post("/api/roommates", async (req: Request, res: Response) => {
        try {
            const { name, createdBy } = req.body;

            if (!name || typeof name !== "string") {
                res.status(400).json({ error: "Invalid or missing required field: name (must be a string)" });
                return;
            }
            if (!createdBy || typeof createdBy !== "string") {
                res.status(400).json({ error: "Invalid or missing required field: createdBy (must be a string)" });
                return;
            }

            const newRoommate = { name, createdBy };
            await roommateProvider.createRoommate(newRoommate);

            console.log("Added Roommate:", newRoommate);
            res.status(201).json(newRoommate);
        } catch (error) {
            console.error("Error Adding Roommate:", error);
            res.status(500).json({ error: "Failed to create roommate" });
        }
    });

    app.delete("/api/roommates", async (req: Request, res: Response) => {
        try {
            const { name, createdBy } = req.body;
    
            if (!name || typeof name !== "string") {
                res.status(400).json({ error: "Invalid or missing roommate name" });
                return;
            }
    
            if (!createdBy || typeof createdBy !== "string") {
                res.status(400).json({ error: "Invalid or missing createdBy username" });
                return;
            }
    
            const result = await roommateProvider.deleteRoommate(name, createdBy);
    
            if (result.deletedCount === 0) {
                res.status(404).json({ error: "Roommate not found" });
                return;
            }
    
            res.status(200).json({ message: `Roommate "${name}" deleted successfully for user "${createdBy}"` });
        } catch (error) {
            console.error("Error deleting roommate:", error);
            res.status(500).json({ error: "Failed to delete roommate" });
        }
    });
}
