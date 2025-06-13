import nodemailer from "nodemailer";
import {
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_PASS,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_SECURE,
  EMAIL_SMTP_USER,
} from "../env";

export interface ISendMail {
  from: String;
  to: String;
  subject: String;
  html: String;
}

const transporter = nodemailer.createTransport({
  host: EMAIL_SMTP_HOST,
  secure: EMAIL_SMTP_SECURE,
  port: EMAIL_SMTP_PORT,
  auth: {
    user: EMAIL_SMTP_USER,
    pass: EMAIL_SMTP_PASS,
  },
  requireTLS: true,
});

const sendMail = async ({ from, to, subject, html }: ISendMail) => {
  const result = await transporter.sendMail({ from, to, subject, html });
  return result;
};
