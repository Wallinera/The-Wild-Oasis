import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
  const queryClient = useQueryClient();
  const { mutate: signup, isPending: isLoading } = useMutation({
    mutationFn: signupApi,

    onSuccess: (user) => {
      console.log(user);
      toast.success(
        "Account successfully created! Please verify the new account from the user`s email adress",
      );
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
  return {
    signup,
    isLoading,
  };
}
