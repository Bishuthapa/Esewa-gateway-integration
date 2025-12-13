"use client"
import { useState } from "react";
import Image from 'next/image';



export default function EsewaPayment() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        amount: 0,
    });

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {

            const response = await fetch('/api/payment/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    amount: Number(formData.amount.toFixed(2)),
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Payment initiation failed');
            }

            const { paymentUrl, params } = await response.json();

            const form = document.createElement('form');
            form.method = 'POST';
            form.action = paymentUrl;
            form.style.display = 'none';

            const addField = (name: string, value: string) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = value;
                form.appendChild(input);
            };

            addField('ammount', params.amount);
            addField('tax_amount', params.tax_amount);
            addField('total_amount', params.total_amount);
            addField('transaction_uuid', params.transaction_uuid);
            addField('product_code', params.product_code);
            addField('signed_field_names', params.signed_field_names);
            addField('signature', params.signature);
            addField('success_url', params.success_url);
            addField('failure_url', params.failure_url);
            document.body.appendChild(form);
            form.submit();

        }
        catch (err: any) {
            console.error('Payment Error : ', err);
            setError(err.message || 'Payment initiation failed');
            setIsSubmitting(false);
        }
    };

    return (
        <> <div className="flex justify-center items-center bg-black h-screen" >
            <div className="bg-gray-900  p-4 w-96 ">
                <h1 className="text-white text-2xl font-bold mb-4" >Payment Form</h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-white">User Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-white">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email || ""}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div><label className="block text-sm font-medium mb-1 text-white">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount || ""}
                            onChange={(e) => setFormData({
                                ...formData,
                                amount: Math.max(1, Number(e.target.value))
                            })}
                            min="1"
                            step="0.01"
                            required
                            className="w-full p-2 border border-gray-300 rounded"

                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className=" w-full rounderd-md flex items-center justify-center bg-green-700 text-white px-4 py-2 rounded hover:bg-green-400"
                    >
                        {isSubmitting ? 'Processing...' : (
                            <>
                                Pay Via
                                <Image
                                    src="/esewa-icon-large.webp"
                                    alt="esewa"
                                    width={60}
                                    height={20}
                                    className="h-5 w-auto"
                                />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
        </>
    )
}