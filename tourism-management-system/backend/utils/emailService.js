import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
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

export const sendBookingConfirmation = async (userEmail, userName, bookingDetails, hotel) => {
  const checkIn = new Date(bookingDetails.check_in).toLocaleDateString()
  const checkOut = new Date(bookingDetails.check_out).toLocaleDateString()

  const mailOptions = {
    from: `"TourEase" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Booking Confirmed: ${hotel.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">Booking Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>Your booking at <strong>${hotel.name}</strong> has been confirmed!</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Booking Details:</h3>
          <p><strong>Hotel:</strong> ${hotel.name}</p>
          <p><strong>Location:</strong> ${hotel.location}</p>
          <p><strong>Check-in:</strong> ${checkIn}</p>
          <p><strong>Check-out:</strong> ${checkOut}</p>
          <p><strong>Guests:</strong> ${bookingDetails.number_of_guests}</p>
          <p><strong>Total Price:</strong> ₦${bookingDetails.total_price.toLocaleString()}</p>
        </div>
        <p>Thank you for choosing TourEase!</p>
        <p>Enjoy your stay!</p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('✅ Booking confirmation email sent to:', userEmail)
  } catch (error) {
    console.error('❌ Email sending failed:', error.message)
  }
}