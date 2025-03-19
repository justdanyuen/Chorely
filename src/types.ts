export interface Task {
    _id: string;  // Store as a string in frontend
    text: string;
    completed: boolean;
    createdAt: string;
    createdBy: string; // Username instead of ObjectId
}

export interface User {
    _id: string;
    username: string;
    email: string;
}

export interface Roommate {
    _id: string;
    name: string;
    createdBy: string; // Username instead of ObjectId
}
