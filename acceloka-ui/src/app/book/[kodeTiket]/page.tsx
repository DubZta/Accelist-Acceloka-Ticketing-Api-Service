"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Ticket {
    ticketCode: string;
    ticketName: string;
    categoryName: string;
    price: number;
    quota: number;
    eventDate: string;
}

export default function BookTicketPage() {
    const params = useParams();
    const router = useRouter();
    const kodeTiket = params.kodeTiket as string;

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState<{ bookedTicketId: string } | null>(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await fetch(`http://localhost:5176/api/v1/get-available-ticket?kodeTiket=${kodeTiket}`);
                if (res.ok) {
                    const data: Ticket[] = await res.json();
                    if (data.length > 0) {
                        setTicket(data[0]);
                    } else {
                        setErrorMsg("Ticket not found.");
                    }
                } else {
                    setErrorMsg("Failed to load ticket details.");
                }
            } catch (err) {
                setErrorMsg("A network error occurred.");
            } finally {
                setLoading(false);
            }
        };

        if (kodeTiket) {
            fetchTicket();
        }
    }, [kodeTiket]);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!ticket) return;

        if (quantity > ticket.quota) {
            setErrorMsg(`Only ${ticket.quota} tickets available.`);
            return;
        }

        setSubmitting(true);
        try {
            const body = {
                tickets: [
                    {
                        kodeTiket: ticket.ticketCode,
                        quantity: quantity
                    }
                ]
            };

            const res = await fetch("http://localhost:5176/api/v1/book-ticket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                const responseData = await res.json();
                const bookedId = responseData.bookedTicketId || responseData.BookedTicketId || "";
                setSuccessMsg({ bookedTicketId: bookedId });

            } else {
                const errData = await res.text();
                setErrorMsg(`Booking failed: ${errData}`);
            }
        } catch (err) {
            setErrorMsg("An error occurred while booking.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-24 bg-slate-50 flex items-center justify-center text-slate-500 font-semibold text-xl">
                <i className="fas fa-spinner fa-spin mr-3 text-blue-600"></i> Loading...
            </div>
        );
    }

    if (!ticket && !loading) {
        return (
            <div className="min-h-screen pt-32 pb-24 bg-slate-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 max-w-md text-center">
                    <div className="text-red-500 text-5xl mb-4"><i className="fas fa-exclamation-circle"></i></div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Ticket Not Found</h2>
                    <p className="text-slate-500 mb-6">{errorMsg}</p>
                    <button onClick={() => router.push("/")} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition">Go Back</button>
                </div>
            </div>
        );
    }

    // Success State
    if (successMsg) {
        return (
            <div className="min-h-screen pt-32 pb-24 bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-10 rounded-3xl shadow-2xl border border-emerald-100 max-w-lg text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                        <i className="fas fa-check"></i>
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Booking Confirmed!</h2>
                    <p className="text-slate-600 mb-6 font-medium text-lg leading-relaxed">
                        Your booking has been successfully processed. Please save your Booked Ticket ID below to manage your order.
                    </p>

                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl mb-8 cursor-copy hover:border-blue-300 transition group space-y-2">
                        <div className="text-slate-400 text-sm font-bold uppercase tracking-widest group-hover:text-blue-500 transition select-none">Booked Ticket ID</div>
                        <div className="text-4xl font-black text-slate-800 tracking-tight select-all">{successMsg.bookedTicketId}</div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => router.push("/my-booking")}
                            className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-ticket-alt"></i> View My Booking
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="w-full bg-slate-100 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 bg-slate-50">
            <div className="max-w-4xl mx-auto px-6">
                <button
                    onClick={() => router.back()}
                    className="text-slate-500 font-semibold mb-8 hover:text-blue-600 transition flex items-center gap-2"
                >
                    <i className="fas fa-arrow-left"></i> Back
                </button>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                    <div className="bg-slate-900 text-white p-10 md:w-5/12 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl transform translate-x-1/4 -translate-y-1/4">
                            <i className="fas fa-ticket-alt"></i>
                        </div>

                        <div className="relative z-10">
                            <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm mb-6 text-blue-200">
                                {ticket?.categoryName}
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">
                                {ticket?.ticketName}
                            </h1>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-blue-400">
                                        <i className="far fa-calendar-alt"></i>
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Event Date</div>
                                        <div className="font-semibold">{ticket?.eventDate}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-400">
                                        <i className="fas fa-money-bill-wave"></i>
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Price per Ticket</div>
                                        <div className="font-semibold">Rp {ticket?.price.toLocaleString("id-ID")}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-purple-400">
                                        <i className="fas fa-qrcode"></i>
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Ticket Code</div>
                                        <div className="font-mono">{ticket?.ticketCode}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex justify-between items-center relative z-10">
                            <span className="text-slate-300 font-semibold text-sm">Available Seats</span>
                            <span className="font-black text-white bg-blue-500 px-3 py-1 rounded-lg shadow-inner">{ticket?.quota}</span>
                        </div>
                    </div>

                    <div className="p-10 md:w-7/12 flex flex-col">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Booking</h2>
                            <p className="text-slate-500">Select your tickets to proceed to checkout.</p>
                        </div>

                        <form onSubmit={handleBooking} className="flex-grow flex flex-col justify-between">

                            {errorMsg && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 mb-6 font-medium text-sm">
                                    <i className="fas fa-exclamation-triangle"></i> {errorMsg}
                                </div>
                            )}

                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8">
                                <div className="flex justify-between flex-wrap gap-4 items-center">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">Quantity</h4>
                                        <p className="text-slate-500 text-sm">Maximum {ticket?.quota} tickets per transaction</p>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                                        <button
                                            type="button"
                                            disabled={quantity <= 1}
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-50 text-slate-600 transition"
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <span className="w-8 text-center font-bold text-xl text-slate-900">{quantity}</span>
                                        <button
                                            type="button"
                                            disabled={quantity >= (ticket?.quota || 1)}
                                            onClick={() => setQuantity(q => Math.min(ticket?.quota || 1, q + 1))}
                                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-50 text-slate-600 transition"
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 mt-auto border-t border-slate-100 pt-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-semibold text-lg">Total Amount</span>
                                    <span className="text-3xl font-black text-slate-900">
                                        Rp {((ticket?.price || 0) * quantity).toLocaleString("id-ID")}
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-70 flex items-center justify-center gap-3"
                                >
                                    {submitting ? (
                                        <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                                    ) : (
                                        <><i className="fas fa-lock"></i> Confirm Booking</>
                                    )}
                                </button>
                                <p className="text-center text-xs text-slate-400 font-medium">
                                    <i className="fas fa-shield-alt mr-1"></i> Secure transaction encrypted by SSL
                                </p>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
