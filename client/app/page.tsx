import GameButton from "@/parts/GameButton";
import Land from "../parts/Land";
import Balance from "@/parts/Balance";

const Main = () => {
  return (
    <div className="relative h-screen w-screen">
      <Balance />
      <Land />
      <GameButton />
    </div>
  );
};

export default Main;
