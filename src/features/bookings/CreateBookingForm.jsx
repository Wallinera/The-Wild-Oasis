import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { differenceInDays } from "date-fns";
import { useCabins } from "../cabins/useCabins";
import { useSettings } from "../settings/useSettings";
import { useCreateBooking } from "./useCreateBooking";
import { createGuest } from "../../services/apiGuests";
import { countries } from "../../data/data-countries";

import styled from "styled-components";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import Select from "../../ui/Select";
import Checkbox from "../../ui/Checkbox";

const ProgressHeader = styled.header`
  margin-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  font-size: 1.8rem;
  color: var(--color-grey-500);
`;

const StyledProgress = styled.progress`
  width: 50%;
  height: 1rem;
  appearance: none;
  border: none;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: var(--color-grey-200);

  &::-moz-progress-bar {
    background-color: var(--color-brand-500);
    border-radius: 100px;
    transition: width 0.3s ease;
  }

  &::-webkit-progress-bar {
    background-color: var(--color-grey-200);
    border-radius: 100px;
  }

  &::-webkit-progress-value {
    background-color: var(--color-brand-500);
    border-radius: 100px;
    transition: width 0.3s ease;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.15);
  }

  /* Add smooth rounding of container */
  border-radius: 1rem;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  justify-content: flex-end;
`;

function CreateBookingForm({ onCloseModel }) {
  const [step, setStep] = useState(1);
  const [hasBreakfast, setHasBreakfast] = useState(false);
  const { cabins, isLoading: isLoadingCabins } = useCabins();
  const [selectedCabin, setSelectedCabin] = useState(null);
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const { createBooking, isCreating } = useCreateBooking();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const watchedCabinId = watch("cabinId");
  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");
  const watchedNumGuests = watch("numGuests");
  const watchedExtrasPrice = Number(watch("extrasPrice"));

  useEffect(() => {
    if (watchedCabinId && cabins) {
      const cabin = cabins.find((c) => c.id === +watchedCabinId);
      setSelectedCabin(cabin);
    }
  }, [watchedCabinId, cabins]);

  const numNights =
    watchedStartDate && watchedEndDate
      ? differenceInDays(new Date(watchedEndDate), new Date(watchedStartDate))
      : 0;

  const cabinPrice = selectedCabin
    ? selectedCabin.regularPrice - (selectedCabin.discount || 0)
    : 0;
  const breakfastPrice = settings?.breakfast_price || 0;
  const extrasPrice =
    watchedExtrasPrice +
    (hasBreakfast ? breakfastPrice * numNights * (watchedNumGuests || 1) : 0);

  const totalPrice = cabinPrice * numNights + extrasPrice;

  const cabinOptions =
    cabins?.map((cabin) => ({
      value: cabin.id,
      label: `${cabin.name} - $${cabin.regularPrice - (cabin.discount || 0)}`,
    })) || [];

  async function onSubmit(data) {
    if (step === 2) {
      setStep(3);
      return;
    }

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // New guest must be created first before creating the booking
    const countryData = countries[data.nationality];
    const guestData = {
      fullName: data.fullName,
      email: data.email,
      nationality: data.nationality,
      nationalID: Math.floor(Math.random() * 9000000000) + 1000000000,
      countryFlag: countryData ? countryData.flag : null,
    };

    const newGuest = await createGuest(guestData);

    const booking = {
      cabinPrice: totalPrice - extrasPrice,
      startDate: data.startDate,
      endDate: data.endDate,
      cabinId: selectedCabin.id,
      guestId: newGuest.id,
      hasBreakfast: data.hasBreakfast || false,
      observations: data.observations || "",
      isPaid: data.isPaid || false,
      numGuests: data.numGuests,
      extrasPrice: data.extrasPrice || 0,
      status: "unconfirmed",
      totalPrice,
      numNights,
    };

    createBooking(booking, {
      onSuccess: () => onCloseModel?.(),
    });
  }

  function handlePrevious() {
    if (step > 1) setStep(step - 1);
  }

  const isLoading = isLoadingCabins || isLoadingSettings;

  return (
    <>
      <ProgressHeader>
        <StyledProgress max={3} value={step}></StyledProgress>
        Step {step} of 3 -{" "}
        {step === 1
          ? "Select a cabin"
          : step === 2
            ? "Guest information"
            : "Booking details"}
      </ProgressHeader>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        type={onCloseModel ? "modal" : "regular"}
      >
        {step === 1 && (
          <FormRow label="Select cabin" error={errors.cabinId?.message}>
            <Select
              options={cabinOptions}
              disabled={isLoading}
              {...register("cabinId", { required: "This field is required" })}
            />
          </FormRow>
        )}

        {step === 2 && (
          <>
            <FormRow label="Full name" error={errors.fullName?.message}>
              <Input
                type="text"
                id="fullName"
                disabled={isLoading || isCreating}
                {...register("fullName", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow label="Email" error={errors.email?.message}>
              <Input
                type="email"
                id="email"
                disabled={isLoading || isCreating}
                {...register("email", { required: "This field is required" })}
              />
            </FormRow>
            <FormRow label="Nationality" error={errors.nationality?.message}>
              <Input
                type="text"
                id="nationality"
                disabled={isLoading || isCreating}
                {...register("nationality", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow label="Observations" error={errors.observations?.message}>
              <Textarea
                id="observations"
                disabled={isLoading || isCreating}
                {...register("observations")}
              />
            </FormRow>
          </>
        )}

        {step === 3 && (
          <>
            <FormRow label="Start date" error={errors.startDate?.message}>
              <Input
                type="date"
                id="startDate"
                disabled={isLoading || isCreating}
                {...register("startDate", {
                  required: "This field is required",
                })}
              />
            </FormRow>
            <FormRow label="End date" error={errors.endDate?.message}>
              <Input
                type="date"
                id="endDate"
                disabled={isLoading || isCreating}
                {...register("endDate", {
                  required: "This field is required",
                  validate: (value) => {
                    const start = new Date(watchedStartDate);
                    const end = new Date(value);
                    const nights = differenceInDays(end, start);
                    if (nights < (settings?.min_booking_length || 1))
                      return `Minimum ${settings?.min_booking_length || 1} nights`;
                    if (nights > (settings?.max_booking_length || 30))
                      return `Maximum ${settings?.max_booking_length || 30} nights`;
                    return true;
                  },
                })}
              />
            </FormRow>
            <FormRow label="Number of guests" error={errors.numGuests?.message}>
              <Input
                type="number"
                id="numGuests"
                defaultValue={1}
                disabled={isLoading || isCreating}
                {...register("numGuests", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "Number of guests must be at least 1",
                  },
                  max: {
                    value: settings?.max_guests_per_booking,
                    message: `Number of guests must be at most ${settings?.max_guests_per_booking}`,
                  },
                })}
              />
            </FormRow>
            <FormRow label="Cabin price">
              <Input type="number" value={cabinPrice} disabled />
            </FormRow>
            <FormRow>
              <Checkbox
                id="hasBreakfast"
                checked={hasBreakfast}
                onChange={(e) => {
                  setHasBreakfast(e.target.checked);
                  setValue("hasBreakfast", e.target.checked);
                }}
                disabled={isLoading || isCreating}
              >
                Include breakfast (+${breakfastPrice} per night and guest)
              </Checkbox>
            </FormRow>

            <FormRow label="Extras price" error={errors.extrasPrice?.message}>
              <Input
                type="number"
                id="extrasPrice"
                defaultValue={0}
                disabled={isLoading || isCreating}
                {...register("extrasPrice", {
                  required: "This field is required",
                  validate: (value) => {
                    if (value < 0) return "Extras price cannot be negative";
                    return true;
                  },
                })}
              />
            </FormRow>

            <FormRow label={`Total Price`}>
              <Input type="number" value={totalPrice} disabled />
            </FormRow>

            <FormRow>
              <Checkbox
                id="isPaid"
                checked={watch("isPaid")}
                onChange={(e) => setValue("isPaid", e.target.checked)}
                disabled={isLoading || isCreating}
              >
                Is paid
              </Checkbox>
            </FormRow>
          </>
        )}

        <FormRow>
          <ButtonGroup>
            <Button
              size="small"
              variation="danger"
              onClick={() => onCloseModel?.()}
            >
              Cancel
            </Button>
            {step > 1 && (
              <Button
                type="button"
                variation="secondary"
                size="small"
                onClick={handlePrevious}
              >
                Previous
              </Button>
            )}
            <Button
              size="small"
              variation="primary"
              disabled={isLoading || isCreating}
            >
              {step === 3 ? "Create booking" : "Next"}
            </Button>
          </ButtonGroup>
        </FormRow>
      </Form>
    </>
  );
}

export default CreateBookingForm;
