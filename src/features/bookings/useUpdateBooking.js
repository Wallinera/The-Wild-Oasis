import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useUpdateBooking() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: updateCurrentBooking, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, newBookingData }) => updateBooking(id, newBookingData),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked in`);
      queryClient.invalidateQueries({ active: true }); // active true invalidate all queries
      navigate("/");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateCurrentBooking };
}
