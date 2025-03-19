import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { TaskProvider } from "../TaskProvider";

export function registerTaskRoutes(app: express.Application, mongoClient: MongoClient) {
    const taskProvider = new TaskProvider(mongoClient);

   
    app.get("/api/tasks", async (req: Request, res: Response) => {
        try {
            let createdBy: string | undefined = undefined;
            if (typeof req.query.createdBy === "string") {
                createdBy = req.query.createdBy;
            }

            console.log("Fetching tasks created by:", createdBy || "All users");
            if (!createdBy) {
                res.status(400).json({ error: "Missing createdBy parameter" });
                return;
            }

            const tasks = await taskProvider.getAllTasks(createdBy);

            if (!tasks || tasks.length === 0) {
                console.error("ERROR: Expected an array but got:", tasks);
                res.status(500).json({ error: "Invalid data format" });
                return;
            }

            console.log("Sending Tasks Data:", tasks);
            res.json(tasks.length > 0 ? tasks : []); // ✅ Always return an array
        } catch (error) {
            console.error("Error Fetching Tasks:", error);
            res.status(500).json({ error: "Failed to fetch tasks" });
        }
    });

    app.post("/api/tasks", async (req: Request, res: Response) => {
        try {
            const { text, createdBy } = req.body;

            if (!text || typeof text !== "string") {
                res.status(400).json({ error: "Invalid or missing required field: text" });
                return;
            }

            if (!createdBy || typeof createdBy !== "string") {
                res.status(400).json({ error: "Invalid or missing required field: createdBy" });
                return;
            }

            const newTask = {
                text,
                completed: false,
                createdAt: new Date().toISOString(),
                createdBy,
            };

            await taskProvider.createTask(newTask);
            console.log("Created Task:", newTask);
            res.status(201).json(newTask);
        } catch (error) {
            console.error("Error Creating Task:", error);
            res.status(500).json({ error: "Failed to create task" });
        }
    });


    app.delete("/api/tasks", async (req: Request, res: Response) => {
        try {
            const { text, createdBy } = req.body;
    
            if (!text || typeof text !== "string") {
                res.status(400).json({ error: "Invalid or missing task name" });
                return;
            }
    
            if (!createdBy || typeof createdBy !== "string") {
                res.status(400).json({ error: "Invalid or missing createdBy username" });
                return;
            }
    
            const result = await taskProvider.deleteTask(text, createdBy);
    
            if (result.deletedCount === 0) {
                res.status(404).json({ error: "Task not found" });
                return;
            }
    
            res.status(200).json({ message: `Task "${text}" deleted successfully for user "${createdBy}"` });
        } catch (error) {
            console.error("Error deleting task:", error);
            res.status(500).json({ error: "Failed to delete task" });
        }
    });
    
}
