import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSettings } from "./useSettings";
import { useUpdateSettings } from "./useUpdateSettings";

function UpdateSettingsForm() {
  const {
    settings: {
      max_booking_length,
      max_guests_per_booking,
      min_booking_length,
      breakfast_price,
    },
  } = useSettings();
  const { isUpdating, updateSettings } = useUpdateSettings();

  function handleUpdate(e) {
    const { value, id, defaultValue } = e.target;

    if (!value || !id || defaultValue === value) return;
    updateSettings({ [id]: value });
    e.target.defaultValue = value;
  }
  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min_booking_length"
          defaultValue={min_booking_length}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e)}
        />
      </FormRow>
      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="max_booking_length"
          defaultValue={max_booking_length}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e)}
        />
      </FormRow>
      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max_guests_per_booking"
          defaultValue={max_guests_per_booking}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e)}
        />
      </FormRow>
      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast_price"
          defaultValue={breakfast_price}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e)}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
