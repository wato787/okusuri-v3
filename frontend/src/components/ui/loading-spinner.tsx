import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-3",
  lg: "h-12 w-12 border-4",
} as const;

type LoadingSpinnerProps = {
  size?: keyof typeof sizeClasses;
  className?: string;
};

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-primary border-t-transparent",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}
