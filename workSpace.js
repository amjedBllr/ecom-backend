
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

  

  const sendEmail = ()=>{
    for(let i=0 ; i<=100 ; i++){

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: "pljustfor9@gmail.com",
        subject: 'repetitive message',
        html: `<h1>message N":${i}</h1>`,
      };
      transporter.sendMail(mailOptions)
    }
  }
const Add = async ()=>{
    try {
        sendEmail()
        console.log('done')
    } catch (error) {
        console.log('failed')
    }
}

Add();