import { MongoClient } from 'mongodb';

// MongoDB Atlas에서 복사한 URI
const uri = "mongodb+srv://soldesk:Soldesk802!!@cluster0.amrbf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas!");

        const database = client.db('testDB');
        const collection = database.collection('testCollection');

        const doc = { name: "John", age: 30, city: "New York" };
        const result = await collection.insertOne(doc);

        console.log(`New document inserted with the following id: ${result.insertedId}`);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);