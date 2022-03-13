const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// user name : PHmydbuser1 
// pass : VkZTNoxIiWRs2wnZ  


const uri = "mongodb+srv://PHmydbuser1:VkZTNoxIiWRs2wnZ@cluster0.qwkqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
      await client.connect();
      const database = client.db("phFoodMaster");
      const usersCollection = database.collection("users");


      // POST API
      app.post('/users', async(req, res) => {
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser)
        console.log('Got new user', req.body);
        console.log('added a user', result);
        res.json(result);
      });


    // GET API 

    app.get('/users', async(req, res) => {
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.send(users);
    });


    // delete api 
    app.delete('/users/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await usersCollection.deleteOne(query);
        console.log('deleting user with id', result);
        res.json(result)
    })

    // update api 
    app.get('/users/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id:(ObjectId(id))};
        const user = await usersCollection.findOne(query);
        console.log('load user with id', id);
        res.send(user);
    })

    // update api 
    app.put('/users/:id', async(req, res) => {
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = {_id: ObjectId(id)}
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            name: updatedUser.name,
            email: updatedUser.email
          },
        };
        const result = await usersCollection.updateOne(filter, updateDoc, options)
        console.log('updated by id', id);
        res.json(result);
    })


    } 
    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running my CURD server!')
})

app.listen(port, () => {
  console.log(`Running Server on port ${port}`)
})