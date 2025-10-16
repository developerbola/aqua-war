import Start from "@/parts/Start";
import Land from "../parts/Land";
import Balance from "@/parts/Balance";
import Profile from "@/parts/Profile";

const Main = () => {
  return (
    <div className="relative h-screen w-screen">
      <Profile />
      <Balance />
      <Land />
      <Start />
    </div>
  );
};

export default Main;
