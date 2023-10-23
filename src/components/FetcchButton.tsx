import React from "react";
import "../global.css";

export interface FetcchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const FetcchButton = React.forwardRef<HTMLButtonElement, FetcchButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none text-white shadow-[inset_0px_6px_4px_0px_rgba(255,255,255,0.2)] px-7 py-4 bg-primary hover:bg-primary/90  ${className}`}
        ref={ref}
        {...props}>
        Pay with Fetcch
      </button>
    );
  }
);

export default FetcchButton;
