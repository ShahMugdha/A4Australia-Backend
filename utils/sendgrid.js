import env from 'dotenv';
env.config({path: '../../'});
import sendGridMail from '@sendgrid/mail';
console.log(process.env.SENDGRID_API_KEY, "key")

export const sendMail = async (to, html) => {
  const msg = {
    to: to,
    auth: {
      user: "shahmugdha15@gmail.com",
      pass: "myfriend1234"
    },
    from: {
      email: 'shahmugdha15@gmail.com',
      name: "'A4AUSTRALIA'",
    }, 
    subject: 'Email Verification',
    html: html,
  };

  await sendGridMail.send(msg).catch((e) => {
    console.log('%c 🍾 e: ', 'font-size:20px;background-color: #3F7CFF;color:#fff;', e);
  });
};
