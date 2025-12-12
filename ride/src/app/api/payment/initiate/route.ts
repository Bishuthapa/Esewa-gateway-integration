import { generateEsewaSignature } from "@/lib/esewa/verifySigunature";
import { error } from "console";
import { stat } from "fs";
import { NextResponse } from "next/server";
import { v4 as uuidv4} from 'uuid';

export async function POST (req: Request) {
    try {
        const {amount, name, email} = await req.json();

        if(!amount || !name || !email){
            return NextResponse.json(
                {
                    error: "missing required fields"
                },
                {
                    status : 400
                }
            )
        }
        
        const numbericAmount = Number(amount);
        if(isNaN(numbericAmount) || numbericAmount < 1) {
            return NextResponse.json(
                {
                    error : "Invalid amount"
                },
                {status : 400}
            )
        }

        //calculate amounts with 13% VAT
        const baseAmount = Number(numbericAmount.toFixed(2));
        const taxAmount = Number((baseAmount* 0.13).toFixed(2));
        const totalAmount = Number((baseAmount + taxAmount).toFixed(2));

        //Gnerate signature

        const transactionUuid = uuidv4();
        const message = [
            `total_amount= ${totalAmount.toFixed(2)}`,
            `transaction_uuid= ${transactionUuid}`,
            `product_code=${process.env.ESEWA_MERCENT_ID}`
        ].join(',');

        const signature = generateEsewaSignature(message);

        return NextResponse.json(
            {
                paymentUrl : `${process.env.ESEWA_BASE_URL}/api/epay/main/v2/form`,
                params: {
                    amount: baseAmount.toFixed(2),
                    tax_amount: taxAmount.toFixed(2),
                    total_amount: totalAmount.toFixed(2), 
                    transaction_uuid : transactionUuid,
                    product_code : process.env.ESEWA_MERCENT_ID!,
                    signature,
                    success_url: `${process.env.NEXT_PUBLIC_URL}/sucess`,
                    failure_url: `${process.env.NEXT_PUBLIC_URL}/failure`,
                    signed_field_name : `total_amount, transaction_uuid,product_code`

                }
            }
        );
    }
    catch(error : any){
        console.error("Payment error: ", error);
        return NextResponse.json(
            {
                error: error.message || "Payment failed"
            },
            {
                status: 500
            }
        )
    }
}
    