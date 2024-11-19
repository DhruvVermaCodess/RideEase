import React, { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';

const PaymentGateway = ({ amount, onSuccess, onCancel }) => {
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            onSuccess();
        } catch (error) {
            console.error('Payment failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-[101]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Payment Details</h2>
                    <Lock className="text-gray-500" />
                </div>

                <div className="mb-4">
                    <p className="text-lg font-medium">Amount: ₹{amount}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                maxLength="16"
                                value={paymentDetails.cardNumber}
                                onChange={handleInputChange}
                                required
                            />
                            <CreditCard className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Holder Name
                        </label>
                        <input
                            type="text"
                            name="cardHolder"
                            placeholder="John Doe"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            value={paymentDetails.cardHolder}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date
                            </label>
                            <input
                                type="text"
                                name="expiryDate"
                                placeholder="MM/YY"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                maxLength="5"
                                value={paymentDetails.expiryDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CVV
                            </label>
                            <input
                                type="password"
                                name="cvv"
                                placeholder="123"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                maxLength="3"
                                value={paymentDetails.cvv}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : 'Pay Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentGateway;
