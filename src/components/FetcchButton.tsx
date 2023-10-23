import React from "react";

export interface FetcchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const FetcchButton = React.forwardRef<HTMLButtonElement, FetcchButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button className={className} ref={ref} {...props}>
        Pay with Fetcch
      </button>
    );
  }
);

export default FetcchButton;
