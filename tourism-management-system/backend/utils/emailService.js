import nodemailer from 'nodemailer'

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  })
}

export const sendEmailViaNodemailer = async (to, subject, html) => {
  try {
    const transporter = createTransporter()
    const info = await transporter.sendMail({
      from: `"GroupIct Tourism Pro" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    })
    console.log('✅ Email sent via Nodemailer:', info.messageId)
    return { success: true }
  } catch (error) {
    console.error('❌ Nodemailer error:', error.message)
    return { success: false, error: error.message }
  }
}


export const sendBookingConfirmation = async (userEmail, userName, bookingDetails, hotel) => {
  try {
    const checkIn = new Date(bookingDetails.check_in).toLocaleDateString()
    const checkOut = new Date(bookingDetails.check_out).toLocaleDateString()

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmed</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="500" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #3B82F6; padding: 30px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">✈️ Booking Confirmed</h1>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 30px 25px;">
                    <p style="font-size: 18px; margin-top: 0;">Dear ${userName},</p>
                    <p>Your booking at <strong>${hotel.name}</strong> has been confirmed!</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                      <h3 style="margin-top: 0; color: #3B82F6;">Booking Details:</h3>
                      <p><strong>Hotel:</strong> ${hotel.name}</p>
                      <p><strong>Location:</strong> ${hotel.location}</p>
                      <p><strong>Check-in:</strong> ${checkIn}</p>
                      <p><strong>Check-out:</strong> ${checkOut}</p>
                      <p><strong>Guests:</strong> ${bookingDetails.number_of_guests}</p>
                      <p><strong>Total Price:</strong> ₦${bookingDetails.total_price.toLocaleString()}</p>
                    </div>
                    
                    <p>Thank you for choosing GroupIct Tourism Pro!</p>
                    <p>Enjoy your stay!</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    const transporter = createTransporter()
    await transporter.sendMail({
      from: `"GroupIct Tourism Pro" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Booking Confirmed: ${hotel.name}`,
      html: html
    })
    console.log('✅ Booking confirmation email sent to:', userEmail)
    return { success: true }
  } catch (error) {
    console.error('❌ Booking email sending failed:', error.message)
    return { success: false, error: error.message }
  }
}