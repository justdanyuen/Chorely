import { Router, Express, Request, Response, NextFunction } from "express";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import { CredentialsProvider } from "../CredentialsProvider";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Ensure this is set in .env

export function verifyAuthToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.get("Authorization");
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
        console.log("No token provided, rejecting request.");
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if (error) {
            console.log("Token verification failed:", error.message);
            res.status(403).json({ error: "Forbidden" });
        } else {
            console.log("Token verified for user:", (decoded as { username: string }).username);
            
            // ✅ Store decoded user data in `req.user`
            (req as any).user = decoded; 
            
            next();
        }
    });
}

function generateAuthToken(username: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(
            { username },
            JWT_SECRET,
            { expiresIn: "1d" }, // Token expires in 24 hours
            (error, token) => {
                if (error) reject(error);
                else resolve(token as string);
            }
        );
    });
}

export function registerAuthRoutes(app: Express, mongoClient: MongoClient) {
    console.log("Registering /auth routes...");
    const router = Router();
    const credentialsProvider = new CredentialsProvider(mongoClient);

    router.post("/register", async (req, res) => {
        try {
            console.log("Received registration request:", req.body);

            const { username, password } = req.body;
            if (!username || !password) {
                res.status(400).json({
                    error: "Bad request",
                    message: "Missing username or password",
                });
                return;
            }

            const success = await credentialsProvider.registerUser(username, password);
            if (!success) {
                res.status(400).json({
                    error: "Username already taken",
                    message: "A user with that username already exists",
                });
                return;
            }

            // ✅ Return a JWT token after successful registration
            const token = await generateAuthToken(username);
            res.status(201).json({ token });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.post("/login", async (req, res) => {
        try {
            console.log("Received login request:", req.body);
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({
                    error: "Bad request",
                    message: "Missing username or password",
                });
                return;
            }

            const userExists = await credentialsProvider.doesUserExist(username);
            if (!userExists) {
                res.status(401).json({
                    error: "Unauthorized",
                    message: "User does not exist",
                });
                return;
            }

            const isValid = await credentialsProvider.verifyPassword(username, password);
            if (!isValid) {
                res.status(401).json({  // ✅ Change to `401 Unauthorized`
                    error: "Unauthorized",
                    message: "Incorrect username or password",
                });
                return;
            }

            const token = await generateAuthToken(username);
            res.status(200).json({ token });
        } catch (error) {
            console.error("Error logging in user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.get("/register", (req, res) => {
        res.send("GET request received for /auth/register. This route is for debugging only.");
    });

    app.use("/auth", router);
}
