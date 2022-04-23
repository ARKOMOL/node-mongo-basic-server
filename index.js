const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 4000;

//midlewear

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('look babe i can code node')
})


/* 
USER : mongoTest
Pass : MeSMp9tVHF128zcU
*/
// cluster 


const uri = "mongodb+srv://mongoTest:MeSMp9tVHF128zcU@cluster0.zwrul.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
await client.connect();
const userCollection = client.db("foodExpress").collection("user");

// get user ===== load all the user

app.get('/user', async(req, res) =>{
    const query = {};
    const cursor = userCollection.find(query);
    const users = await cursor.toArray();
    res.send(users);
});

app.get('/user/:id',async(req,res)=>{
    const id = req.params.id;
    const query ={_id : ObjectId(id)};
    const result = await userCollection.findOne(query);
    res.send(result);
})

// post user ===== add a new user
app.post('/user',async(req,res)=>{
    const newUser = req.body;
    console.log('adding new user',newUser);
    const result = await userCollection.insertOne(newUser)
    res.send(result)

})

// put user 
app.put('/user/:id', async(req,res)=>{
    const id = req.params.id;
    const updatedUser = req.body;
    const filter = {_id: ObjectId(id)};
    const options = {upsert: true};
    const updatedDoc ={
        $set:{
            name: updatedUser.name,
            email: updatedUser.email
        }
    };
    const result =await userCollection.updateOne(filter,updatedDoc,options);
    res.send(result);
})

// deleteuser 
app.delete('/user/:id', async(req,res) => {
    const id = req.params.id;
    const query = {_id : ObjectId(id)};
    const result = await userCollection.deleteOne(query);
    res.send(result);
})

}


finally{
    // await/
}
}

run().catch(console.dir)

///////////
app.get('/users',(req,res)=>{
    res.send('hello from user')
})

app.listen(port,()=>{
    console.log('listening to port',port);
})