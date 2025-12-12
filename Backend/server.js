require('dotenv').config()
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const User_Model = require('./Model/userInfo')
const mongoose = require('mongoose');
const router = require('./Routes/Router');

const cron = require("node-cron");
const nodemailer = require("nodemailer");
const path = require("path");
const XLSX = require("xlsx");
const multer = require('multer');


const app = express();
const PORT = process.env.PORT || 8000;

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max


const allowedOrigins = [
  "http://localhost:5173",
   "http://127.0.0.1:5500",
   "http://localhost:5500",
  "www.ultimatejaipurians.in",
  "https://www.ultimatejaipurians.in",

];


app.use(
  cors({

origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, 
  })
);




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
        console.log(req.body)

        const options = {
            amount: amount,     // Amount in smallest currency unit (e.g., 50000 paise = 500 INR)
            currency: "INR",
            receipt: receipt,   //"receipt_" + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);

        console.log('It is run to create order....')

        // Send the order details back to the frontend
        res.status(200).json(order);
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


        const uniquePassCode = "PASS_" + crypto.randomBytes(8).toString("hex");

        //Store User Data
        const userData = await User_Model.create({
                                                  user_name: formData.name,
                                                  user_number: formData.phone,
                                                  user_email: formData.email,
                                                  address: formData.address,
                                                  city: formData.city,
                                                  adhaar: formData.adhaar,
                                                  attend_someone: formData.someone,
                                                  how_many_people: formData.noPeople,
                                                  support: formData.support,
                                                  qr_code: uniquePassCode,
                                                  donateAmt: formData.donateAmt,
                                                  totalAmt: formData.totalPayPrice,
                                                 })


            // const phone = formData.phone; // Customer Number
            // const amount = payment.amount / 100;

        
        res.status(200).json({ status: 'success', data: userData, message: 'Payment verified successfully' });

    } else {
        // Signature mismatch
        console.error("Payment verification failed");
        res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
});





//-----------------------------------------
//       NodeMailer to send email 
//-----------------------------------------


const transporter = nodemailer.createTransport({
       host: 'smtp.gmail.com',
       port: 587,
       secure: false,
       auth: {
          user: 'mohsin06388@gmail.com',   // your email
          pass: 'rnyv gyew qeek ddwm',    // your app password
        }
})




transporter.verify()
  .then(() => console.log("🔁 Mailer ready"))
  .catch(err => {
    console.error("Mailer verification failed — check credentials and network:", err);
    // optionally exit process if mailer is required
    // process.exit(1);
  });



  // Convert json to excel file
  async function createExcelFile(data, filename = "users.xlsx") {
  if (!data || data.length === 0) {
    console.log("No data to export");
    return null;
  }

  const cleaned = data.map(item => ({
    ...item,
    _id: item._id.toString()
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleaned);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const filePath = path.join(__dirname, "exports", filename);

  XLSX.writeFile(workbook, filePath); // <-- writes to backend folder

  return filePath; // return full path
}


cron.schedule("32 15 * * *", async () => {

     console.log("⏰ Running daily email at 8 AM...");
      
     try {

      const userData = await User_Model.find().lean();

      

      const filePath = await createExcelFile(userData, "users.xlsx");


       const info = await transporter.sendMail({
            from: 'mohsin06388@gmail.com',
            to: "mohsin06388@gmail.com",
            subject: "Daily Report",
            text: "Good morning! Here's your daily update. if you have any query tell me.",

            attachments: [
                         {
                           filename: "users.xlsx",
                           path: filePath,  // absolute or relative path
                           contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                         }
                       ]
          })

          console.log("📨 Email sent:", info.messageId);

     } catch (error) {
         console.error("❌ Error sending email:", err);
     }


}, { timezone: "Asia/Kolkata"})






app.post('/api/upload-pdf', upload.single('file'), async (req, res) => {

  console.log("===========sent pdf after payemnt ready api called")
  try {
    // Basic validation
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    // Get optional form fields
    const to = 'mosn0078600@gmail.com';
    const subject = req.body.subject || 'Gala Re-Union Ticket';
    const text = req.body.text || 'Your Pass is Ready.';

    // Send email using buffer (no disk write)
    const mailOptions = {
      from: 'mohsin06388@gmail.com',
      to,
      subject,
      text,
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
          contentType: req.file.mimetype // should be application/pdf
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);

    // Optionally log: info.messageId etc
    console.log('Email sent:', info.messageId);

    res.json({ ok: true, messageId: info.messageId });
  } catch (error) {
    console.error('Upload / email error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});








app.use('/admin', router)



app.use('/user', router)








app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
