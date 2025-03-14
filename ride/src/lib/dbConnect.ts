import { log } from "console";
import mongoose from "mongoose";

type ConnnectionObject = {
    isConnected?: number
}

const connection: ConnnectionObject = {} 

async function dbConnect(): Promise<void> {
    if( connection.isConnected ) {
        return  
    }

    try {
        const db  = await mongoose.connect(process.env.MONGODB_URI as string)

        connection.isConnected = db.connections[0].readyState

        console.log("DB connected successfuly");
    } catch (error) {

        console.log("Database connection failed", error);
        process.exit(1);
    }
}

export default dbConnect;