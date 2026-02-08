import { PDFViewer, StyleSheet } from "@react-pdf/renderer";
import { BookingDocument } from "../ui/pdfGenerator";

const styles = StyleSheet.create({
  viewer: {
    width: "100%",
    height: "100rem",
  },
});

function BasicDocument({ booking }) {
  return (
    <PDFViewer style={styles.viewer}>
      <BookingDocument booking={booking} />
    </PDFViewer>
  );
}

export default BasicDocument;
