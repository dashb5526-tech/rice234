import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const transporter = await createTransporter();
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Failed to send email notification' };
  }
}

export async function sendContactFormNotification(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const recipient = process.env.EMAIL_RECIPIENT || 'dashb5526@gmail.com';
  
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
    <hr />
    <p><em>This is an automated notification from your website contact form.</em></p>
  `;

  return sendEmail({
    to: recipient,
    subject: `New Contact Inquiry from ${data.name}`,
    html,
  });
}

export async function sendOrderFormNotification(data: {
  name: string;
  company?: string;
  phone: string;
  email: string;
  riceType: string;
  quantity: string;
  message?: string;
}) {
  const recipient = process.env.EMAIL_RECIPIENT || 'dashb5526@gmail.com';
  
  const html = `
    <h2>New Order Inquiry</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Rice Type:</strong> ${data.riceType}</p>
    <p><strong>Quantity:</strong> ${data.quantity} kg</p>
    <p><strong>Additional Details:</strong></p>
    <p>${data.message || 'None'}</p>
    <hr />
    <p><em>This is an automated notification from your website order form.</em></p>
  `;

  return sendEmail({
    to: recipient,
    subject: `New Order Inquiry from ${data.name} - ${data.riceType}`,
    html,
  });
}
