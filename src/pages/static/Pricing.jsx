import React from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
    const plans = [
        {
            name: "Starter",
            price: "0",
            description: "Perfect for individuals and small side projects.",
            features: [
                "Up to 3 projects",
                "Unlimited issues",
                "Basic search",
                "Community support",
                "1GB storage"
            ],
            buttonText: "Get Started",
            highlight: false
        },
        {
            name: "Professional",
            price: "12",
            description: "Everything you need for growing teams and startups.",
            features: [
                "Unlimited projects",
                "Unlimited issues",
                "Advanced analytics",
                "Priority support",
                "10GB storage",
                "API access",
                "Custom status flows"
            ],
            buttonText: "Start Free Trial",
            highlight: true
        },
        {
            name: "Enterprise",
            price: "49",
            description: "Advanced control and support for large organizations.",
            features: [
                "Unlimited everything",
                "Dedicated account manager",
                "SSO & SAML",
                "Custom data retention",
                "Unlimited storage",
                "White-label options",
                "On-premise deployments"
            ],
            buttonText: "Contact Sales",
            highlight: false
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Simple, <span className="text-[#01a370]">Transparent</span> Pricing
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose the plan that fits your team's size and needs. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`rounded-3xl p-10 bg-white shadow-sm border transition-all duration-300 hover:shadow-2xl flex flex-col ${plan.highlight ? 'border-[#01a370] ring-4 ring-[#01a370]/10 scale-105 z-10' : 'border-gray-200'
                                }`}
                        >
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <span className="text-5xl font-extrabold text-gray-900">${plan.price}</span>
                                <span className="text-gray-500">/month</span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-start text-gray-600">
                                        <Check className="h-5 w-5 text-[#01a370] mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-4 rounded-xl font-bold transition-all duration-200 ${plan.highlight
                                        ? 'bg-[#01a370] text-white hover:bg-[#018a60] shadow-lg shadow-green-200'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                    }`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-gray-500 text-sm">
                        Need a custom plan? <a href="/contact" className="text-[#01a370] font-bold hover:underline">Contact us</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
