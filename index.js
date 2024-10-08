const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.szaofvp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const coffeeCollection = client.db('coffeeStoreDB').collection('coffee')
        const userCollection = client.db('coffeeStoreDB').collection('user')

        // user related apis
        app.get('/user', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result)
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        app.patch('/user', async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const updatedDoc = {
                $set: {
                    lastSignInTime: user.lastSignInTime
                }
            }
            const result = await userCollection.updateOne(query, updatedDoc);
            res.send(result)
        })

        app.get('/coffee', async (req, res) => {
            const result = await coffeeCollection.find().toArray();
            res.send(result)
        })

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeeCollection.insertOne(newCoffee)
            res.send(result);
        })

        app.patch('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCoffee = req.body;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    coffeeName: updatedCoffee.coffeeName,
                    quantity: updatedCoffee.quantity,
                    supplierName: updatedCoffee.supplierName,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    taste: updatedCoffee.taste,
                    photoUrl: updatedCoffee.photoUrl,
                }
            }
            const result = await coffeeCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('coffee store server is running')
})

app.listen(port, () => {
    console.log(`coffee store server is running on port: ${port}`)
})