import React, { useEffect } from "react";
import "../global.css";

import * as Dialog from "@radix-ui/react-dialog";
import FetcchModal from "./FetcchModal";

export interface FetcchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  requestId: string
  action: string
  name: string
  secretKey: string
}

const FetcchButton = React.forwardRef<HTMLButtonElement, FetcchButtonProps>(
  ({ className, requestId, action, name, secretKey, ...props }, ref) => {
    
    return (
      <div>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              className={`inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none text-white shadow-[inset_0px_6px_4px_0px_rgba(255,255,255,0.2)] px-7 py-4 bg-primary hover:bg-primary/90 ${className}`}
              ref={ref}
              {...props}>
              {action} with Fetcch
            </button>
          </Dialog.Trigger>
          <FetcchModal secretKey={secretKey} requestId={requestId} name={name} action={action} />
        </Dialog.Root>
      </div>
    );
  }
);

export default FetcchButton;
