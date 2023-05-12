import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'

let Transporter = nodemailer.createTransport({
  service:"gmail",
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
})

export default Transporter