import { Request, Response } from "express";
import { app } from "./app";
import './src/sockets/websocket'; 
// Test route to determine whether the server is up
app.get('/', (req: Request, res: Response) => {
    res.send('Collab Server Is Up.');
});