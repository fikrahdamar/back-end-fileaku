import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

import {
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_PASS,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_SECURE,
  EMAIL_SMTP_USER,
} from "../env";

export interface ISendMail {
  from: string;
  to: string;
  subject: string;
  html: string;
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

export const sendMail = async ({ from, to, subject, html }: ISendMail) => {
  const result = await transporter.sendMail({ from, to, subject, html });
  return result;
};

export const renderMail = async (
  filePath: string,
  data: any
): Promise<string> => {
  const dataMail = ejs.renderFile(
    path.join(__dirname, `templates/${filePath}`),
    data
  );
  return dataMail as string;
};
