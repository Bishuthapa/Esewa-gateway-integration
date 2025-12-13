

import { useState } from "react";
import Image from "next/image";


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
                headers: {'Content- Type': 'application / json'},
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
    
    const { paymentUrl, params} = await response.json();

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentUrl;
    form.style.display = 'none';

    const addField = (name: string, value: string) => {
        const input= document.createElement('input');
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
catch(err: any){
    console.error('Payment Error : ', err);
    setError(err.message || 'Payment initiation failed');
    setIsSubmitting(false);
    }
};

return(
    <>
    <div>
        <p>Hello</p>

    </div>
    </>
)
}