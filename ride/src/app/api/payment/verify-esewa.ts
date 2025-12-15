// pages/api/verify-esewa.ts
import { NextApiRequest, NextApiResponse } from 'next';

// Define types for the request body and response
interface VerifyRequestBody {
  transaction_uuid: string;
}

interface PaymentResponse {
  success: boolean;
  amount?: number;
  transaction_id?: string;
  message?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { transaction_uuid }: VerifyRequestBody = req.body;

    // Simulating payment verification (Replace with real API request to Esewa or your payment provider)
    if (transaction_uuid === 'valid-transaction-id') {
      // If payment verification is successful, return success data
      return res.status(200).json({
        success: true,
        amount: 100,  // Example amount
        transaction_id: 'valid-transaction-id', // Example transaction ID
      });
    } else {
      // If payment verification fails, return error message
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction.',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
