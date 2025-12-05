require('dotenv').config()
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const User_Model = require('./Model/userInfo')
const mongoose = require('mongoose');
const router = require('./Routes/Router');


const app = express();
const PORT = process.env.PORT || 8000;



app.use(cors()); 
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URL)
        .then(()=> console.log("Database connected with your Backend..."))
        .catch((err) => console.log("Something is error to connect of database and Error is"+ err))





const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,      
    key_secret: process.env.RAZORPAY_KEY_SECRET, 
});



// ---------------------------------------------------------
// 2. Route: Create an Order
// This is called when the user clicks "Pay Now"
// ---------------------------------------------------------


app.post('/create-order', async (req, res) => {
    try {

        const {amount, receipt}  = req.body

        const options = {
            amount: amount,     // Amount in smallest currency unit (e.g., 50000 paise = 500 INR)
            currency: "INR",
            receipt: receipt,   //"receipt_" + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);

        // Send the order details back to the frontend
        res.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send("Error creating order");
    }
});



// ---------------------------------------------------------
// 2. Route: Verify Payment
// ---------------------------------------------------------




app.post('/verify-payment', async (req, res) => {
    // console.log("verify payment api run")
    // console.log(req.body)

    const {paymentDetails, formData} = req.body     

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;

    //Secret_Key
    const key_secret = process.env.RAZORPAY_KEY_SECRET 

    // Generate the expected signature
    const generated_signature = crypto
        .createHmac('sha256', key_secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    if (generated_signature === razorpay_signature) {
        // console.log("Payment verified successfully");

        //Store User Data
        const userData = await User_Model.create({
                                                  user_name: formData.name,
                                                  user_number: formData.phone,
                                                  attendance: formData.attend,
                                                  attend_someone: formData.someone,
                                                  how_many_people: formData.noPeople,
                                                  support: formData.support,
                                                 })


        res.json({ status: 'success', message: 'Payment verified successfully' });
    } else {
        // Signature mismatch
        console.error("Payment verification failed");
        res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
});





app.use('/admin', router)








app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});