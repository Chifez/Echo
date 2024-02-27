import nodemailer from 'nodemailer';
import {
  PUBLIC_NODEMAILER_EMAIL,
  PUBLIC_NODEMAILER_PW,
} from '$env/static/public';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: PUBLIC_NODEMAILER_EMAIL,
    pass: PUBLIC_NODEMAILER_PW,
  },
});

export const sendEmail = async ({
  from,
  to,
  subject,
  content,
}: {
  from: string;
  to: string;
  subject: string;
  content: string;
}) => {
  await transporter.sendMail({
    from,
    to,
    subject,
    text: content,
    html: content,
  });
};
