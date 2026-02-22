import emailjs from "emailjs-com";

// Initialize EmailJS
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
  emailjs.init(PUBLIC_KEY);
}

// Format booking details as plain text
function formatBookingDetails(booking) {
  const {
    id,
    status,
    cabins,
    startDate,
    endDate,
    guests,
    numGuests,
    numNights,
    hasBreakfast,
    observations,
    cabinPrice,
    totalPrice,
    isPaid,
    extrasPrice,
    created_at: bookedDate,
  } = booking;

  const checkInDate = new Date(startDate).toDateString();
  const checkOutDate = new Date(endDate).toDateString();
  const bookedOnDate = new Date(bookedDate).toDateString();
  const extraCosts = totalPrice - cabinPrice - (hasBreakfast ? extrasPrice : 0);

  return `
BOOKING DETAILS
===============

Booking ID: #${id}
Status: ${status.toUpperCase()}
Booked on: ${bookedOnDate}

ACCOMMODATION
=============
Cabin: ${cabins.name}
Duration: ${numNights} nights
Check-in: ${checkInDate}
Check-out: ${checkOutDate}

GUEST INFORMATION
=================
Name: ${guests.fullName}${numGuests > 1 ? ` (+ ${numGuests - 1} guests)` : ""}
Email: ${guests.email}
Nationality: ${guests.nationality}
National ID: ${guests.nationalID}

PRICING DETAILS
===============
Cabin (${numNights} nights): $${cabinPrice}
${hasBreakfast ? `Breakfast: $${extrasPrice}\n` : ""}${extraCosts > 0 ? `Extras: $${extraCosts}\n` : ""}Total Price: $${totalPrice}

Payment Status: ${isPaid ? "Paid" : "Will pay at property"}

SPECIAL REQUESTS
================
${observations ? observations : "No special requests"}

=======================
Thank you for your booking!
The Wild Oasis Team
  `.trim();
}

// Send booking details via email using EmailJS
export async function sendBookingEmail(booking) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error(
      "EmailJS configuration is missing. Please set environment variables.",
    );
  }

  try {
    const bookingDetails = formatBookingDetails(booking);

    // Send email with booking details as plain text
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: booking.guests.email,
      booking_id: booking.id,
      booking_details: bookingDetails,
      guest_name: booking.guests.fullName,
    });

    return response;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send booking details. Please try again.");
  }
}
