const express=require('express');
const app=express();
const cookierParser=require("cookie-parser");
const path=require('path');
const db=require("./config/mongoose-connection");
const ownersRouter=require("./routes/ownersRouter");
const productsRouter=require("./routes/productsRouter");
const usersRouter=require("./routes/usersRouter");
const paymentRoutes = require("./routes/paymentRouter");
const indexRouter=require("./routes/index");
require("dotenv").config();
const flash=require("connect-flash");
const session = require('express-session');
const dotenv = require("dotenv");
const cors = require("cors");
const methodOverride = require("method-override");



app.use(methodOverride("_method"));
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookierParser());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");

app.use(cors());
app.use(express.json());

app.use(
    session({
        secret: process.env.JWT_KEY,
        resave:false,
        saveUninitialized:false,
    })
);
app.use(flash());

app.use("/",indexRouter);
app.use("/owner", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/api/payment", paymentRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
