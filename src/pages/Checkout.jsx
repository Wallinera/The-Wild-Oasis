import Row from "../ui/Row";
import Heading from "../ui/Heading";
import BasicDocument from "../ui/BasicDocument";
import { useBooking } from "../features/bookings/useBooking";
import { sendBookingEmail } from "../services/apiEmail";
import Spinner from "../ui/Spinner";
import Empty from "../ui/Empty";
import ButtonGroup from "../ui/ButtonGroup";
import Button from "../ui/Button";
import { useMoveBack } from "../hooks/useMoveBack";
import toast from "react-hot-toast";
import { useState } from "react";

function Checkout() {
  const { booking, isLoading } = useBooking();
  const [isSending, setIsSending] = useState(false);
  const moveBack = useMoveBack();

  if (isLoading) return <Spinner />;
  if (!booking) return <Empty resource={"booking"} />;
  if (booking.status !== "checked-out")
    return (
      <Row type="horizontal">
        <Heading as="h1">Guest is not yet checked out!</Heading>
        <Button size="medium" onClick={moveBack} variation="secondary">
          Back
        </Button>
      </Row>
    );

  async function handleSendEmail() {
    setIsSending(true);
    try {
      await sendBookingEmail(booking);
      toast.success(`Booking details sent to ${booking.guests.email}`);
    } catch (error) {
      toast.error(error.message || "Failed to send email. Please try again.");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <Row>
        <Heading as={"h2"}>Booking #{booking.id} PDF details</Heading>
      </Row>
      <Row>
        <BasicDocument booking={booking} />
      </Row>

      <ButtonGroup>
        <Button size="medium" onClick={moveBack} variation="secondary">
          Back
        </Button>
        <Button
          size="medium"
          variation={"primary"}
          onClick={handleSendEmail}
          disabled={isSending}
        >
          {isSending ? "Sending..." : `Send to: ${booking.guests.email}`}
        </Button>
      </ButtonGroup>
    </>
  );
}

export default Checkout;
