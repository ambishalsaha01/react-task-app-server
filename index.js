const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database Integration
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wybo3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('todo_Task').collection('task');

        // Get Task Data
        app.get('/task', async (req, res) => {
            const cursor = taskCollection.find({});
            const tasks = await cursor.toArray();
            res.send(tasks);
        });

        // Post Task Data
        app.post('/task', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.json(result)
        });

        // Get individual task data
        app.get('/task/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await taskCollection.findOne(query);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('React Task App')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})