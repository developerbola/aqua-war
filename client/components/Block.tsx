import { cn } from "@/lib/utils";

type BlockProps = {
  isActive: boolean;
  hasLeft: boolean;
  hasRight: boolean;
  hasTop: boolean;
  hasBottom: boolean;
  onToggle: () => void;
};

const Block = ({
  isActive,
  hasLeft,
  hasRight,
  hasTop,
  hasBottom,
  onToggle,
}: BlockProps) => {
  const defaultRadius = "10px";
  const activeRadius = "0px";

  let topLeftRadius = defaultRadius;
  let topRightRadius = defaultRadius;
  let bottomLeftRadius = defaultRadius;
  let bottomRightRadius = defaultRadius;

  if (isActive) {
    if (hasLeft) {
      topLeftRadius = activeRadius;
      bottomLeftRadius = activeRadius;
    }
    if (hasRight) {
      topRightRadius = activeRadius;
      bottomRightRadius = activeRadius;
    }
    if (hasTop) {
      topLeftRadius = activeRadius;
      topRightRadius = activeRadius;
    }
    if (hasBottom) {
      bottomLeftRadius = activeRadius;
      bottomRightRadius = activeRadius;
    }
  }

  return (
    <div
      className={cn(
        "w-full h-full grid place-items-center",
        isActive
          ? "bg-neutral-800 hover:bg-neutral-800"
          : "hover:bg-[#00000009]"
      )}
      style={{
        borderTopLeftRadius: topLeftRadius,
        borderTopRightRadius: topRightRadius,
        borderBottomLeftRadius: bottomLeftRadius,
        borderBottomRightRadius: bottomRightRadius,
      }}
      onClick={onToggle}
    >
      {isActive || (
        <div className="size-[5px] bg-neutral-300 rounded-full"></div>
      )}
    </div>
  );
};

export default Block;
