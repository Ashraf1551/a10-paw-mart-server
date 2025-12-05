const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

// Local MongoDB (MongoDB Compass)
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db("petService");
    const petServices = database.collection("services");

    app.post("/services", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await petServices.insertOne(data);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello, Developers");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
