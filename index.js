const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

// Cloud MongoDB (MongoDB Atlas)
const uri =
  "mongodb+srv://a10-pet-stuff:IwUiR5JanfQFpV6e@aae.bclhfhx.mongodb.net/?appName=aae";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("petService");
    const petServices = database.collection("services");

    // post or save service to DB
    app.post("/services", async (req, res) => {
      const data = req.body;
      console.log(data);
      const date = new Date();
      data.createdAt = date;
      const result = await petServices.insertOne(data);
      res.send(result);
    });

    // Get service from DB
    app.get("/services", async (req, res) => {
      const { category, search } = req.query;
      const query = {};

      if (category) {
        query.category = category;
      }

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      const result = await petServices.find(query).toArray();
      res.send(result);
    });

    app.get("/recent-listings", async (req, res) => {
      const result = await petServices
        .find()
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();
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
