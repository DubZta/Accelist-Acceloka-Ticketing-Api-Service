"use client";

import { useState } from "react";

export default function FaqNewsletter() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I book tickets?",
            answer: "Choose your category, select an event, and follow the steps to book securely.",
        },
        {
            question: "Which payment options can I use?",
            answer: "Pay with major cards or digital wallets for a secure checkout.",
        },
        {
            question: "Can I update or cancel my booking?",
            answer: "Most bookings can be managed in your account. Review your ticket for details.",
        },
        {
            question: "Where is my e-ticket?",
            answer: "Your e-ticket is sent by email and available in your account for download.",
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Subscribed!");
    };

    return (
        <section className="py-24 bg-slate-900 border-t border-slate-800 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* FAQ */}
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            Your ticketing questions, answered fast
                        </h2>
                        <p className="text-slate-400 mb-8">
                            Get clear answers on booking, payments, and account access.
                        </p>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className={`faq-item border-b border-slate-700 pb-4 cursor-pointer ${activeFaq === index ? "active" : ""
                                        }`}
                                    onClick={() => toggleFaq(index)}
                                >
                                    <div className="flex items-center justify-between py-4">
                                        <h3 className="font-semibold text-lg">{faq.question}</h3>
                                        <i className="fas fa-chevron-down faq-icon transition-transform duration-300 text-blue-400"></i>
                                    </div>
                                    <div className="faq-answer text-slate-400">
                                        {faq.answer}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center lg:text-left">
                            <p className="text-slate-400 mb-4">
                                Still need help? Contact our support team.
                            </p>
                            <a
                                href="https://wa.me/0895396330120"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block border border-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-slate-900 transition"
                            >
                                Support
                            </a>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Never miss top events again
                        </h2>
                        <p className="text-slate-400 mb-8 text-lg">
                            Get ticket updates and exclusive offers directly to your inbox.
                        </p>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                            >
                                Subscribe
                            </button>
                            <p className="text-xs text-slate-500 mt-4">
                                No spam. Unsubscribe anytime.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
