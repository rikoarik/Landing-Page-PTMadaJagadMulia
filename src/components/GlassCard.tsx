import { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  blur?: "sm" | "md" | "lg";
  style?: CSSProperties;
}

export const GlassCard = ({ children, className, hover = true, blur = "md", style }: GlassCardProps) => {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  };

  return (
    <div
      className={cn(
        "bg-glass-light border border-glass-border rounded-xl sm:rounded-2xl shadow-glass p-4 sm:p-6",
        blurClasses[blur],
        hover && "transition-all duration-300 hover:shadow-glass-strong hover:scale-[1.01] sm:hover:scale-[1.02] hover:-translate-y-0.5 sm:hover:-translate-y-1",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};
