import React from 'react';

interface FetcchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    requestId: string
    action: string
    name: string
    secretKey: string
}
declare const FetcchButton: React.ForwardRefExoticComponent<FetcchButtonProps & React.RefAttributes<HTMLButtonElement>>;

export { FetcchButton as default };
