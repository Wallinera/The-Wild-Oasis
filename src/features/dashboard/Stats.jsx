import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";

function Stats({ bookings, confirmedStays, numCabins, numDays }) {
  const numBookings = bookings.length;

  const sales = bookings.reduce((acc, cur) => acc + cur.totalPrice, 0);

  const checkins = confirmedStays.length;

  // num checkin nights / all available nights we could have solved within given days
  const occupancyRate =
    confirmedStays.reduce((acc, cur) => acc + cur.numNights, 0) /
    (numDays * numCabins);

  return (
    <>
      <Stat
        icon={<HiOutlineBriefcase />}
        title={"Bookings"}
        color={"blue"}
        value={numBookings}
      />
      <Stat
        icon={<HiOutlineBanknotes />}
        title={"Sales"}
        color={"green"}
        value={formatCurrency(sales)}
      />
      <Stat
        icon={<HiOutlineCalendarDays />}
        title={"Check ins"}
        color={"indigo"}
        value={checkins}
      />
      <Stat
        icon={<HiOutlineChartBar />}
        title={"Occupancy rate"}
        color={"yellow"}
        value={Math.round(occupancyRate * 100) + "%"}
      />
    </>
  );
}

export default Stats;
