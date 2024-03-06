require("dotenv").config();
const express = require("express");
const cors = require("cors");
require('./connection.js')
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const productRouter = require("./Controllers/Product.js");
const cookieParser = require('cookie-parser');
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();

app.use(cookieParser());
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/product", productRouter);


app.post("/api/create-checkout-session", async (req, res) => { 
  const { products } = req.body; 
  // console.log(products)
    const lineItems = products.map((product)=>({
      price_data:{
          currency:"inr",
          product_data:{
              name:product.name,
              images:[product.avatar],
             
          },
          unit_amount:product.price
      },
      
      quantity:product.cartQuantity

  }));

  const session = await stripe.checkout.sessions.create({ 
    payment_method_types: ["card"], 
    // line_items: [ 
    //   { 
    //     price_data: { 
    //       currency: "inr", 
    //       product_data: { 
    //         name: product.name, 
    //       }, 
    //       unit_amount: product.price * 100, 
    //     }, 
    //     // quantity: product.quantity, 
    //     quantity:product.cartQuantity
    //   }, 
    // ], 
    line_items:lineItems,
    mode: "payment", 
    success_url: "https://manish-e-commerce-website.netlify.app/success", 
    cancel_url: "https://manish-e-commerce-website.netlify.app/cancel", 
  }); 
  res.json({ id: session.id }); 
});

app.get('/',(req,res)=>{
res.send('welcome manish page')
})

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
