import express, { Request, Response } from "express";
import process from 'process';
import cors from 'cors';
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import bodyParser from 'body-parser';
import { productRouter } from "./routes/product";
import { roleModel } from "./schemas/userModel";
const app = express()
const port = 9000

app.use(cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/product', productRouter);

dotenv.config();

mongoose.connect(
    process.env.MONGODB_URL!
).then(() => {
  console.log("Successfully connected to MongoDB.");
  initializeRoles();
})
.catch(err => {
  console.error("Connection error", err);
  process.exit();
});;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

app.get('/', (req, res) => {
    res.send('Home');
});


function initializeRoles() {
  roleModel.estimatedDocumentCount((err: any, count: number) => {
    if (!err && count === 0) {
      new roleModel({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });
      new roleModel({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'moderator' to roles collection");
      });
      new roleModel({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}


