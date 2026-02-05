import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateBookingForm from "./CreateBookingForm";

export default function CreateBooking() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="cabin-form">
          <Button variation="primary" size="medium">
            Create booking
          </Button>
        </Modal.Open>
        <Modal.Window name="cabin-form">
          <CreateBookingForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}
