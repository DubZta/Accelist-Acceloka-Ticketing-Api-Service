"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";
import { GlowCard } from "./ui/spotlight-card";

interface TicketProps {
    ticket: {
        ticketCode: string;
        ticketName: string;
        categoryName: string;
        price: number;
        quota: number;
        eventDate: string;
    };
    categoryIcon: string;
    displayCategory: string;
}

export default function TicketCard({ ticket, categoryIcon, displayCategory }: TicketProps) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart({
            kodeTiket: ticket.ticketCode,
            namaTiket: ticket.ticketName,
            kategori: displayCategory,
            harga: ticket.price,
            quantity: 1,
            eventDate: ticket.eventDate,
            quota: ticket.quota
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <GlowCard
            glowColor="blue"
            customSize={true}
            className="group flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 border border-slate-100 transform hover:-translate-y-1"
        >
            <div className="relative h-48 bg-blue-50 flex items-center justify-center border-b border-blue-100">
                <div className="text-blue-600 text-6xl opacity-20 transform group-hover:scale-110 transition duration-500">
                    <i className={categoryIcon}></i>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-bold text-blue-600 shadow-sm border border-blue-100/50">
                    Rp {ticket.price.toLocaleString("id-ID")}
                </div>
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm">
                    {displayCategory}
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-mono font-medium text-slate-600 shadow-sm border border-slate-200">
                    {ticket.ticketCode}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-slate-500 text-sm mb-3 gap-4">
                    <span className="flex items-center gap-1 font-medium bg-slate-50 px-2 py-1 rounded-md border border-slate-100 text-xs text-nowrap">
                        <i className="far fa-calendar text-blue-500"></i> {ticket.eventDate}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md ml-auto text-nowrap">
                        {ticket.quota} left
                    </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 group-hover:text-blue-600 transition tracking-tight line-clamp-2 min-h-[3.5rem]">
                    {ticket.ticketName}
                </h3>

                <div className="mt-auto space-y-2">
                    {ticket.quota > 0 ? (
                        <>
                            <div className="flex gap-2">
                                <Link
                                    href={`/book/${ticket.ticketCode}`}
                                    className="flex-[2] bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-95 text-nowrap"
                                >
                                    Book Now
                                </Link>
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 border shadow-sm active:scale-95 ${added ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'}`}
                                >
                                    <i className={added ? "fas fa-check" : "fas fa-cart-plus"}></i>
                                </button>
                            </div>
                        </>
                    ) : (
                        <button disabled className="w-full bg-slate-100 text-slate-400 py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2 shadow-inner">
                            Sold Out
                        </button>
                    )}
                </div>
            </div>
        </GlowCard>
    );
}
