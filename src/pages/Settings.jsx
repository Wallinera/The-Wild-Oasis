import { useSettings } from "../features/settings/useSettings";
import Heading from "../ui/Heading";
import Button from "../ui/Button";
import Row from "../ui/Row";
import UpdateSettingsForm from "../features/settings/UpdateSettingsForm";
import Spinner from "../ui/Spinner";

function Settings() {
  const { isLoading } = useSettings();

  return (
    <>
      <Heading as="h1">Update hotel settings</Heading>
      <Row>{isLoading ? <Spinner /> : <UpdateSettingsForm />}</Row>
    </>
  );
}

export default Settings;
