import { generateEsewaSignature } from "@/lib/esewa/generateSignature";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const { amount, name, email } = await req.json();

        if (!amount || !name || !email) {
            console.log("Missing required fields");
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount < 1) {
            return NextResponse.json(
                { error: "Invalid amount" },
                { status: 400 }
            );
        }

        if (!process.env.ESEWA_BASE_URL || !process.env.ESEWA_MERCHANT_ID) {
            return NextResponse.json(
                { error: "Payment configuration missing" },
                { status: 500 }
            );
        }

        const baseAmount = Number(numericAmount.toFixed(2));
        const taxAmount = Number((baseAmount * 0.13).toFixed(2));
        const product_service_charge = 0;
        const product_delivery_charge = 0;
        const totalAmount = Number((baseAmount + taxAmount).toFixed(2));



        const transactionUuid = uuidv4();

        const message = [
            `total_amount=${totalAmount.toFixed(2)}`,
            `transaction_uuid=${transactionUuid}`,
            `product_code=${process.env.ESEWA_MERCHANT_ID}`,
        ].join(",");

        const signature = generateEsewaSignature(message);

        return NextResponse.json({
            paymentUrl: `${process.env.ESEWA_BASE_URL}/api/epay/main/v2/form`,
            params: {
                amount: baseAmount.toFixed(2),
                tax_amount: taxAmount.toFixed(2),
                total_amount: totalAmount.toFixed(2),
                transaction_uuid: transactionUuid,
                product_code: process.env.ESEWA_MERCHANT_ID,
                product_service_charge: product_service_charge.toFixed(2),
                product_delivery_charge: product_delivery_charge.toFixed(2),
                signature: signature,
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
                failure_url: `${process.env.NEXT_PUBLIC_APP_URL}/failure`,
                signed_field_name: "total_amount,transaction_uuid,product_code",
            },
        });
    } catch (error: any) {
        console.error("Payment error:", error);
        return NextResponse.json(
            { error: error.message || "Payment failed" },
            { status: 500 }
        );
    }
}
