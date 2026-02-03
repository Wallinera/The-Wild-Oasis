import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../bookings/useBooking";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/helpers";
import { useUpdateBooking } from "../bookings/useUpdateBooking";
import { useSettings } from "../settings/useSettings";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmed, setConfirmed] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const { booking, isLoading } = useBooking();
  const { settings, isLoading: isSettingsLoading } = useSettings();

  const { isUpdating, updateCurrentBooking } = useUpdateBooking();

  useEffect(() => {
    setConfirmed(booking?.isPaid ?? false);
  }, [booking]);

  const moveBack = useMoveBack();
  if (isLoading || isSettingsLoading) return <Spinner />;

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  const optionalBreakfastPrice =
    settings?.breakfast_price * numGuests * numNights || 0;

  function handleCheckin() {
    if (!confirmed) return;

    if (addBreakfast) {
      updateCurrentBooking({
        id: bookingId,
        newBookingData: {
          status: "checked-in",
          isPaid: true,
          hasBreakfast: true,
          extrasPrice: optionalBreakfastPrice,
          totalPrice: totalPrice + optionalBreakfastPrice,
        },
      });
    } else {
      updateCurrentBooking({
        id: bookingId,
        newBookingData: { status: "checked-in", isPaid: true },
      });
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast(!addBreakfast);
              setConfirmed(false);
            }}
            id={"breakfast"}
          >
            Breakfast included for {numGuests} guest{numGuests > 1 ? "s" : ""}{" "}
            during {numNights} night{numNights > 1 ? "s" : ""}: +
            {formatCurrency(optionalBreakfastPrice)}
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmed}
          disabled={confirmed}
          onChange={() => setConfirmed(!confirmed)}
          id={"confirm"}
        >
          I confirm that "{guests.fullName}" has paid the total amount{" "}
          {!addBreakfast
            ? formatCurrency(totalPrice)
            : `${formatCurrency(totalPrice + optionalBreakfastPrice)} (${formatCurrency(totalPrice)} + ${formatCurrency(optionalBreakfastPrice)})`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button
          disabled={!confirmed || isUpdating}
          variation={!confirmed ? "secondary" : "primary"}
          onClick={handleCheckin}
        >
          Check in booking #{bookingId}
        </Button>

        <Button disabled={isUpdating} variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
