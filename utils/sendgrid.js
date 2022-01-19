import env from 'dotenv';
env.config({path: '../../'});
import sendGridMail from '@sendgrid/mail';
sendGridMail.setApiKey('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');
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
  console.log(msg, "msg")
  await sendGridMail.send(msg, (err, res) => {
    // if (err) return res.status(500).json({message: err.message});
    // res.status(200).json({message: 'A reset email has been sent to ' + user.email + '.'});
    if(err) console.log('bye')
    console.log("hi")
  })
  .catch((e) => {
    console.log('%c 🍾 e: ', 'font-size:20px;background-color: #3F7CFF;color:#fff;', e);
  });
};