import { cn } from "@/lib/class-names";

type SparkleBurstProps = {
  active?: boolean;
  className?: string;
};

const burstSparkles = ["✨", "✦", "✧", "✨", "✦"] as const;

export function SparkleBurst({
  active = true,
  className,
}: SparkleBurstProps) {
  if (!active) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      className={cn("success-sparkle-burst", className)}
    >
      {burstSparkles.map((sparkle, index) => (
        <span className="success-sparkle-burst__sparkle" key={index}>
          {sparkle}
        </span>
      ))}
    </span>
  );
}
