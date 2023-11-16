# fetcch-kit
### **Introduction**

- Crypto deposits are a serious vulnerability since they entail numerous actions such as selecting an asset, copying the address, manually pasting the address, inputting the deposit amount, and finally depositing. Fetcch kit substitutes this slow paced multi-step deposit with quick secure deposits enabled by links, qr codes and requests directly to ids.
Fetcch provides a deposit widget that may be used to receive deposits in a secure manner by centralised exchanges, institutional clients, otc, and so on.

### **Installation**

- Install via npm:
    
    ```jsx
    npm i @fetcch/kit
    ```
    
- Install via pnpm:
    
    ```jsx
    pnpm i @fetcch/kit
    ```
    
- Install via yarn:
    
    ```jsx
    yarn add @fetcch/kit
    ```
    

### **Usage**

- Acquire Secret Key (contact @sk1122_ on twitter)
- Creating transaction request
    - Arrange transaction request
        
        ```jsx
        {
            "receiver": "string",
            "payer": "string", //optional
            "actions": [
                {
                    "type": "PAYMENT",
                    "data": {
                        "token": "string",
                        "chain": number,
                        "receiver": "string",
                        "amount": {
                            "amount": "string" // in lowest denominator,
                            "currency": "CRYPTO"
                        }
                    }
                }
            ],
            "message": "string",
            "label": "string"
        }
        ```
        
    - Generate message by making post call to `https://staging-api.fetcch.xyz/v1/transaction-request/generate-message`
    - Create transaction request by making post call to `https://staging-api.fetcch.xyz/v1/transaction-request`
    - Detailed guide - https://docs.fetcch.xyz/how-to-integrate/guides/transaction-requests/how-to-create-transaction-request
- Integrating deposit widget
    - Import FetcchButton component from the package
        
        ```jsx
        import FetcchButton from "@fetcch/kit"
        ```
        
    - Render FetcchButton component and configure it with following params
        - `requestId` : Id of transaction request created
        - `action` : Type of operation to be performed
        - `name` : Label or identifier for the specific use case
        - `secretKey` : API keys for authenticating request
        
        ```jsx
        return(
               <FetcchButton requestId="" action="" name="" secretKey="" />
              )
        ```
        

### Example

```jsx
"use client"
import FetcchButton from "@fetcch/kit"

export const FButton = (params: { id: string }) => {
    return (
        <FetcchButton requestId={params.id} action="Deposit" name="Fetcch OTC" secretKey={process.env.NEXT_PUBLIC_FETCCH_API_KEY as string} />
    )
}
```

![Untitled](https://github.com/FetcchX/fetcch-kit/assets/59167439/cfeb137b-7852-420f-81ac-ae4dff0cd0c7)

<img src="https://github.com/FetcchX/fetcch-kit/assets/59167439/64811d43-2a02-4418-adcf-a30803eba3b1" width="500" height="700"/>


### **Contributing**

- Create a issue followed by a pull request on → https://github.com/fetcchx/fetcch-kit

### **API Documentation**

- https://docs.fetcch.xyz/how-to-integrate/quickstart

### **Troubleshooting**

- https://docs.fetcch.xyz/how-to-integrate/api-reference/troubleshooting-errors

### Demo

- https://institutions.fetcch.xyz/

### **Changelog**

- https://www.npmjs.com/package/@fetcch/kit?activeTab=versions

### **License**

- Licensed under the MIT License, Copyright © 2023-present [Fetcch](https://fetcch.xyz).

- See [LICENSE](./LICENSE) for more information.
