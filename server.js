const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.Db_NAME}:${process.env.DB_PASS}@cluster0.xzzvi9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const craftCollection = client.db("jtassignment").collection("products");

    // get all products
    app.get("/product", async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortField = req.query.sortField || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
        const startIndex = (page - 1) * limit;
        const totalProducts = await craftCollection.countDocuments();
        const products = await craftCollection
          .find()
          .sort({ [sortField]: sortOrder }) // Sort by date, most recent first
          .skip(startIndex)
          .limit(limit)
          .toArray();
        // console.log(page,limit,startIndex,totalProducts);
        res.json({
          totalProducts,
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          products,
        });
      } catch (error) {
        res.json(error.message);
      }
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello hi World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
