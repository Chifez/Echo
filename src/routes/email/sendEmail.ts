import { json } from '@sveltejs/kit';
import { render } from 'svelte-email';
import Email from '$lib/Email.svelte';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'my_user',
    pass: 'my_password',
  },
});

const emailHtml = render({
  component: Email,
  props: {
    name: 'Svelte',
  },
});

const options = {
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: emailHtml,
};

transporter.sendMail(options);
