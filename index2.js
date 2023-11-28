import express from "express";
import cors from "cors";
import connection, { dbName } from "./Connection.js";
import bcrypt from "bcrypt";

const app = express();
const port = 8081;
let db;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// app.get("/", (req, res) => {
//   res.json(students);
// });
// app.post("/new", (req, res) => {
//   let newstudent = req.body;
//   // newstudent.id +=1
//   students.push(newstudent);
//   res.json(students);
// });
// app.delete("/new/id", (req, res) => {
//   res.send(students[0]);
// });



//REGISTER
app.post("/registered", async (req, res) => {
  //   console.log(req.body);
  const { name, email } = req.body;

    // console.log(req.body)
  const hashedPassowrd = await bcrypt.hash(req.body.password, 10);

  const save = db
    .collection("users")
    .insertOne({ name, email,hashedPassowrd });

  if (save) {
    res.send("Done");
  }
});

//LOGIN
app.post("/login", async (req, res) => {
  const usernameExists = await db
    .collection("users")
    .find({ name: req.body.name })
    .toArray();
console.log(usernameExists)
  
  if (usernameExists.length > 0) {
    //match password
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      usernameExists[0].hashedPassowrd
    );
    if (!passwordMatch) {
      res.send("Password not found");
    } else {
      res.send("Login Successful");
    }
  } else {
    res.send("Username Not found");
  }
});

connection.then((client) => {
  db = client.db(dbName);
  app.listen(port, () => console.log("server started at port " + port));
});
