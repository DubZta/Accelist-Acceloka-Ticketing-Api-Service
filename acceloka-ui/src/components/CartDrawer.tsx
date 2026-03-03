"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Link from "next/link";

export default function CartDrawer() {
    const { cartItems, removeFromCart, updateQuantity, totalPrice, totalCount, clearCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingResult, setBookingResult] = useState<{ id: string } | null>(null);

    const handleCheckout = async () => {
        setIsBooking(true);
        try {
            const payload = {
                tickets: cartItems.map(item => ({
                    kodeTiket: item.kodeTiket,
                    quantity: item.quantity
                }))
            };

            const res = await fetch("http://localhost:5176/api/v1/book-ticket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                setBookingResult({ id: data.bookedTicketId });
                clearCart();
            } else {
                alert("Booking failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("A network error occurred.");
        } finally {
            setIsBooking(false);
        }
    };

    if (bookingResult) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setBookingResult(null)}></div>
                <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 p-10 text-center animate-in zoom-in-95">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-check text-3xl"></i>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2">Booking Success!</h3>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Your multi-ticket booking is confirmed. Use the ID below to manage it.
                    </p>
                    <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 mb-8 cursor-copy hover:border-blue-300 transition group">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 select-none group-hover:text-blue-500 transition">Booked Ticket ID</span>
                        <span className="font-mono font-black text-slate-800 text-xl uppercase tracking-wider select-all">{bookingResult.id}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setBookingResult(null)}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 active:scale-95"
                        >
                            Continue Booking!
                        </button>
                        <Link
                            href="/my-booking"
                            onClick={() => setBookingResult(null)}
                            className="w-full bg-slate-50 text-slate-500 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 hover:text-blue-600 transition active:scale-95 border border-slate-100"
                        >
                            <i className="fas fa-external-link-alt mr-2 text-[10px]"></i> Open My Booking
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 z-[60] bg-blue-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group ${totalCount > 0 ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
            >
                <i className="fas fa-shopping-cart text-xl"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black min-w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 border-white animate-bounce-slow">
                    {totalCount}
                </span>
            </button>

            {/* Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Content */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[80] shadow-[-20px_0_60px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Cart</h2>
                            <p className="text-slate-400 text-sm font-bold">{totalCount} items selected</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors flex items-center justify-center"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {/* Items List */}
                    <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 p-12 text-center">
                                <i className="fas fa-shopping-basket text-6xl mb-6 opacity-10"></i>
                                <p className="font-bold text-slate-400">Cart is looking empty</p>
                                <p className="text-sm mt-2">Start adding some tickets to book them all at once!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.kodeTiket} className="group p-4 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300">
                                        <div className="flex gap-4">
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.kategori}</span>
                                                </div>
                                                <h4 className="font-bold text-slate-900 line-clamp-1">{item.namaTiket}</h4>
                                                <p className="text-xs text-slate-400 font-bold mt-1">Rp {item.harga.toLocaleString("id-ID")}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.kodeTiket)}
                                                className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <i className="fas fa-trash-alt text-sm"></i>
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100/50">
                                            <div className="flex items-center bg-white rounded-lg border border-slate-100 p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.kodeTiket, item.quantity - 1)}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-slate-50 text-slate-400 transition-colors"
                                                >
                                                    <i className="fas fa-minus text-[10px]"></i>
                                                </button>
                                                <span className="w-8 text-center font-bold text-slate-700 text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.kodeTiket, item.quantity + 1)}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-slate-50 text-slate-400 transition-colors"
                                                >
                                                    <i className="fas fa-plus text-[10px]"></i>
                                                </button>
                                            </div>
                                            <span className="font-black text-slate-900 text-sm">Rp {(item.harga * item.quantity).toLocaleString("id-ID")}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-slate-400 font-bold">Total Amount</span>
                                <span className="text-2xl font-black text-blue-600 tracking-tight">Rp {totalPrice.toLocaleString("id-ID")}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={isBooking}
                                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-70"
                            >
                                {isBooking ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Confirm Multi-Booking <i className="fas fa-arrow-right text-xs"></i>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={clearCart}
                                className="w-full mt-4 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-colors"
                            >
                                Empty Entire Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
