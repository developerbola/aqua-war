import GameButton from "@/parts/GameButton";
import Land from "../parts/Land";

const Main = () => {
  return (
    <div className="relative h-screen w-screen">
      <Land />
      <GameButton />
    </div>
  );
};

export default Main;
