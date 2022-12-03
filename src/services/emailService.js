require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });
    
      let info = await transporter.sendMail({
        from: '"Phạm Đức Hiếu 👻" <hieustupid2502@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám", // Subject line
        html: getBodyHTMLEmail(dataSend),
      });
}

let getBodyHTMLEmail = (dataSend) => {
  let result = ''
  if(dataSend.language === 'vi') {
    result = 
      `
      <h3>Xin chào ${dataSend.patientName}!</h3>
      <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên booking care</p>
      <p>Thông tin đặt lịch khám bệnh:</p>
      <div><b>Thời gian: ${dataSend.time}</b></div>
      <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
      
      <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào link bên dưới 
      để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh:</p>
      <div>
        <a href = ${dataSend.redirectLink} target = "_blank">Click here </a>
      </div>

      <div>Xin chân thành cảm ơn</div>
      `
  }
  if(dataSend.language === 'en') {
    result = 
      `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>Because you scheduled a medical visit via booking care, you got this email.</p>
        <p>Information schedule:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        
        <p>If the information listed above is accurate, kindly click the link below to
         confirm and finish the process of making a medical appointment:</p>
        <div>
            <a href = ${dataSend.redirectLink} target = "_blank">Click here </a>
        </div>

        <div>Sincere thanks!</div>
        `
  }

  return result;
}

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = ''
  if(dataSend.language === 'vi') {
    result = 
      `
      <h3>Xin chào ${dataSend.patientName}!</h3>
      <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên booking care thành công</p>
      <p>Thông tin đơn thuốc/ hóa đơn được gửi trong file đính kèm</p>
      <div>Xin chân thành cảm ơn!</div>
      `
  }
  if(dataSend.language === 'en') {
    result = 
      `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>Because you scheduled a medical visit via booking care, you got this email.</p>
        <p>.......</p>
        <div>Sincere thanks!</div>
        `
  }

  return result;
}

let sendAttachment = async (dataSend) => {
  return new Promise(async(resolve, reject) => {

    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });
      let info = await transporter.sendMail({
        from: '"Phạm Đức Hiếu 👻" <hieustupid2502@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Thông tin đặt lịch khám", // Subject line
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
          {
            filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding: 'base64'
          }
        ]
      });

      console.log('check info send email:')
      console.log(info)
      resolve()

    } catch (e) {
        reject(e);
    }
})
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}