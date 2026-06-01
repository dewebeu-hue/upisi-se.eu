import { cn } from "@/lib/class-names";

type TapeProps = {
  className?: string;
  rotate?: "left" | "right" | "none";
};

const rotateClasses = {
  left: "-rotate-6",
  right: "rotate-6",
  none: "rotate-0",
} as const;

export function Tape({ className, rotate = "left" }: TapeProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute h-7 w-20 rounded-sm border border-white/50 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,227,109,0.42))] opacity-90 shadow-sm",
        rotateClasses[rotate],
        className,
      )}
    />
  );
}
