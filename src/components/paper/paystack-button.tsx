'use client';

import { usePaystackPayment } from 'react-paystack';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PayWithPaystackButton() {
    const { toast } = useToast();

    const config = {
        reference: new Date().getTime().toString(),
        // Use site contact email by default; allow override via NEXT_PUBLIC_PAYSTACK_EMAIL
        email: (process.env.NEXT_PUBLIC_PAYSTACK_EMAIL || 'contact@drstryk.com').trim(),
        amount: 120000, // Amount in kobo (1200 NGN * 100)
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        currency: 'NGN',
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = (reference: any) => {
        console.log(reference);
        toast({
            title: "Payment Successful",
            description: "Your download will begin shortly.",
        });
        // Allow printing once and trigger the browser's print dialog
        try { (window as any).__printPaid = true; } catch (e) {}
        // Small timeout to ensure flag is set before print
        // Notify the app that payment succeeded
        try { window.dispatchEvent(new CustomEvent('payment:success', { detail: { reference } })); } catch (e) {}
    };

    const onClose = () => {
        console.log('Payment modal closed.');
        toast({
            variant: "destructive",
            title: "Payment Cancelled",
            description: "You have cancelled the payment.",
        });
    };

    const handlePayment = () => {
        if (!config.publicKey) {
            toast({
                variant: 'destructive',
                title: 'Paystack Not Configured',
                description: 'The Paystack public key is missing. Please configure it in your .env file.'
            });
            return;
        }
        initializePayment({onSuccess, onClose});
    }

    return (
        <Button onClick={handlePayment} className="shadow-lg paystack-button" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Pay ₦1200 to Download
        </Button>
    );
}
