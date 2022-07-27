//Imports
import express from "express";
import cors from "cors";

//Global Varialbles
const server = express();
const PORT = process.env.PORT || 3000;

//Middlewares
server.use(cors());
server.use(express.json());

//Listen
server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

//Routes:
//GET
server.get("/", (req, res) => {
  console.log("Hello World");
  res.send(Cars);
});

//DATA
const Cars = {
  sedan: "Altima",

  truck: "F1-50",

  plane: "777",
};
