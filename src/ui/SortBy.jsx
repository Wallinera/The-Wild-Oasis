import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSortBy = searchParams.get("sortBy") || "";

  function handleChange(event) {
    // cabins?sortBy={value}
    const value = event.target.value;
    searchParams.set("sortBy", value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      type="white"
      activeValue={currentSortBy}
      onChange={handleChange}
    />
  );
}

export default SortBy;
