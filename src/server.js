require("dotenv").config();
require("./db/conn");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const userRouter = require("./router/user-Router");
const foodItemRouter=require("./router/foodItems-Router")
const categoryRouter=require("./router/category.Router")
const orderRouter=require("./router/order-Router");
const galleryRouter=require("./router/gallery-router");
const allowedOrigins = ["https://k2taj.co.uk", "http://localhost:5173"];

const coreOptions = {
    origin: "http://localhost:5173/",
    methods: "GET, POST, DELETE, PATCH,PUT",
    credentials: true,
}
app.use(cors(coreOptions));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cors(coreOptions));
// for Image get in frontend
app.use(express.static("public"));
// Increase JSON payload limit
app.use(express.json({ limit: "20mb" }));

// app.use(express.json());

app.get('/',(req,res)=>{
  res.status(200).send("Welcome to Nodejs Backend!")
});

app.use(userRouter);
app.use(foodItemRouter); 
app.use(categoryRouter);
app.use(orderRouter);
app.use(galleryRouter);
//app.use("/admin", fieldRouter);

app.listen(port, () => {
  console.log(`Listening from the port no ${port}`); 
}); 
//*********************************************************************** */
//_______________________________________________________________________
//   Start Date :  28 Aug 2025 Thrusday 06:15AM
//   Developed by Basharat Ali  +923211339413  WhatsApp Full Stack Developer 
//________________________________________________________________________
//************************************************************************* */