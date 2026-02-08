import Heading from "../ui/Heading";
import BasicDocument from "../ui/BasicDocument";
import SignupForm from "../features/authentication/SignupForm";

function NewUsers() {
  return (
    <>
      <Heading as="h1">Create a new user</Heading>
      <SignupForm />
      <BasicDocument />
    </>
  );
}

export default NewUsers;
