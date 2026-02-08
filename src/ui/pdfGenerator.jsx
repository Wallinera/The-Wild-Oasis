import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import logo from "../data/img/logo-light.png";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  logo: {
    height: "6rem",
    width: "20%",
    marginBottom: 25,
    marginHorizontal: "auto",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#d0d0d0",
    paddingBottom: 20,
  },
  headerInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  bookingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#1f2937",
  },
  bookingStatus: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1f2937",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 8,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: "35%",
    fontWeight: "bold",
    color: "#374151",
  },
  value: {
    width: "65%",
    color: "#6b7280",
  },
  priceBox: {
    backgroundColor: "#f3f4f6",
    padding: 15,
    marginTop: 15,
    borderRadius: 4,
  },
  priceRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalPrice: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#d0d0d0",
    paddingTopWidth: 8,
    marginTop: 8,
    paddingTop: 8,
  },
  totalPriceLabel: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#1f2937",
  },
  totalPriceValue: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#059669",
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    fontSize: 10,
    color: "#9ca3af",
    textAlign: "center",
  },
});

export function BookingDocument({ booking }) {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <View style={styles.headerInfo}>
            <Text style={styles.bookingTitle}>Booking #{id}</Text>
            <Text style={styles.bookingStatus}>{status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Cabin & Dates Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {numNights} nights in Cabin {cabins.name}
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Check-in:</Text>
            <Text style={styles.value}>
              {new Date(startDate).toDateString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Check-out:</Text>
            <Text style={styles.value}>{new Date(endDate).toDateString()}</Text>
          </View>
        </View>

        {/* Guest Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guest Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Guest Name:</Text>
            <Text style={styles.value}>
              {guests.fullName}{" "}
              {numGuests > 1 ? `+ ${numGuests - 1} guests` : ""}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{guests.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nationality:</Text>
            <Text style={styles.value}>{guests.nationality}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>National ID:</Text>
            <Text style={styles.value}>{guests.nationalID}</Text>
          </View>
        </View>

        {/* Observations Section */}
        {observations && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observations</Text>
            <Text style={styles.value}>{observations}</Text>
          </View>
        )}

        {/* Price Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> Price Details</Text>
          <View style={styles.priceBox}>
            <View style={styles.priceRow}>
              <Text style={styles.label}>Cabin ({numNights} nights):</Text>
              <Text style={styles.value}>${cabinPrice}</Text>
            </View>
            {hasBreakfast && (
              <View style={styles.priceRow}>
                <Text style={styles.label}>Breakfast:</Text>
                <Text style={styles.value}>${extrasPrice}</Text>
              </View>
            )}
            <View style={styles.priceRow}>
              <Text style={styles.label}>Extras:</Text>
              <Text style={styles.value}>
                ${totalPrice - cabinPrice - (hasBreakfast ? extrasPrice : 0)}
              </Text>
            </View>
            <View style={styles.totalPrice}>
              <Text style={styles.totalPriceLabel}>Total Price:</Text>
              <Text style={styles.totalPriceValue}>${totalPrice}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 11, color: "#374151" }}>
                Payment Status: {isPaid ? "Paid" : "Will pay at property"}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Booked on {new Date(bookedDate).toDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
}

// Function to generate PDF blob
export async function generateBookingPDF(booking) {
  const pdfBlob = await pdf(<BookingDocument booking={booking} />).toBlob();
  return pdfBlob;
}
