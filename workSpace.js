
const PCT = require('./models/PCTModel.js')
const connectDb = require('./db/connect.js')

const nodemailer = require('nodemailer');


require('dotenv').config()

  
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: "amjedbellir03@gmail.com",
    subject: 'Email Verification',
    html: `<h1>it worked !!</h1>`,
  };

const Add = async ()=>{
    try {
        for(let i=0 ; i<=10;i++){
            transporter.sendMail(mailOptions)
        }
        console.log('done')
    } catch (error) {
        console.log('failed')
    }
}

Add();