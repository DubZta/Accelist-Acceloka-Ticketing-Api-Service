"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedList from "@/components/ui/animated-list";
import { AuroraBackground } from "@/components/ui/aurora-background";

interface BookedTicket {
    ticketCode: string;
    ticketName: string;
    quantity: number;
    price: number;
    eventDate: string;
    categoryName: string;
}

interface BookedTicketResponse {
    priceSummary: number;
    ticketsPerCategories: {
        quantityPerCategory: number;
        categoryName: string;
        summaryPrice: number;
        tickets: BookedTicket[];
    }[];
}

interface EditRequest {
    kodeTiket: string;
    kuanitas: number;
}

export default function MyBookingPage() {
    const [searchId, setSearchId] = useState("");
    const [fetchedId, setFetchedId] = useState<string | null>(null);
    const [tickets, setTickets] = useState<BookedTicket[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Edit State
    const [editingTicket, setEditingTicket] = useState<string | null>(null);
    const [editQuantity, setEditQuantity] = useState(1);
    const [editLoading, setEditLoading] = useState(false);

    // Revoke State
    const [revokeLoading, setRevokeLoading] = useState<string | null>(null);

    // List IDs Modal State
    const [showIdsModal, setShowIdsModal] = useState(false);
    const [allIds, setAllIds] = useState<string[]>([]);
    const [idsLoading, setIdsLoading] = useState(false);

    const fetchAllIds = async () => {
        setIdsLoading(true);
        try {
            const res = await fetch("http://localhost:5176/api/v1/list-booked-ticket-ids");
            if (res.ok) {
                const data = await res.json();
                setAllIds(data);
            }
        } catch (err) {
            console.error("Failed to fetch IDs", err);
        } finally {
            setIdsLoading(false);
        }
    };

    useEffect(() => {
        if (showIdsModal) {
            fetchAllIds();
        }
    }, [showIdsModal]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId.trim()) return;

        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");
        setTickets([]);
        setFetchedId(null);
        setEditingTicket(null);
        setTotalPrice(0);

        try {
            const res = await fetch(`http://localhost:5176/api/v1/get-booked-ticket/${searchId}`);
            if (res.ok) {
                const data: BookedTicketResponse = await res.json();

                // Extract all tickets from all categories into a flat list for the UI
                const allTickets = data.ticketsPerCategories.flatMap(cat =>
                    cat.tickets.map(t => ({
                        ...t,
                        categoryName: cat.categoryName
                    }))
                );

                if (allTickets.length > 0) {
                    setTickets(allTickets);
                    setTotalPrice(data.priceSummary);
                    setFetchedId(searchId);
                } else {
                    setErrorMsg("No tickets found for this Booking ID.");
                }
            } else {
                if (res.status === 404) {
                    setErrorMsg("Booking ID not found.");
                } else {
                    setErrorMsg("Failed to retrieve booking.");
                }
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "A network error occurred.";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (ticketCode: string, currentQty: number) => {
        if (!confirm(`Are you sure you want to revoke/cancel all ${currentQty} tickets for ${ticketCode}?`)) return;

        setRevokeLoading(ticketCode);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const qtyToRevoke = window.prompt(`How many tickets to revoke? (Max: ${currentQty})`, currentQty.toString());
            const parsedQty = parseInt(qtyToRevoke || "0");

            if (isNaN(parsedQty) || parsedQty <= 0 || parsedQty > currentQty) {
                setRevokeLoading(null);
                return;
            }

            const res = await fetch(`http://localhost:5176/api/v1/revoke-ticket/${fetchedId}/${ticketCode}/${parsedQty}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setSuccessMsg(`Successfully revoked ${parsedQty} items of ticket ${ticketCode}.`);
                // Refresh list
                const refreshRes = await fetch(`http://localhost:5176/api/v1/get-booked-ticket/${fetchedId}`);
                if (refreshRes.ok) {
                    const data: BookedTicketResponse = await refreshRes.json();
                    const allTickets = data.ticketsPerCategories.flatMap(cat =>
                        cat.tickets.map(t => ({
                            ...t,
                            categoryName: cat.categoryName
                        }))
                    );
                    setTickets(allTickets);
                    setTotalPrice(data.priceSummary);
                } else {
                    setTickets([]);
                    setTotalPrice(0);
                }
            } else {
                const text = await res.text();
                setErrorMsg(`Failed to revoke ticket: ${text}`);
            }
        } catch (err: unknown) {
            setErrorMsg("A network error occurred during revocation.");
        } finally {
            setRevokeLoading(null);
        }
    };

    const handleEditSave = async (ticketCode: string) => {
        if (!fetchedId) return;
        setEditLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const body = {
                tickets: [
                    {
                        kodeTiket: ticketCode,
                        quantity: editQuantity
                    }
                ]
            };

            const res = await fetch(`http://localhost:5176/api/v1/edit-booked-ticket/${fetchedId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setSuccessMsg(`Successfully updated quantity for ticket ${ticketCode}.`);
                setEditingTicket(null);
                // Refresh list
                const refreshRes = await fetch(`http://localhost:5176/api/v1/get-booked-ticket/${fetchedId}`);
                if (refreshRes.ok) {
                    const data: BookedTicketResponse = await refreshRes.json();
                    const allTickets = data.ticketsPerCategories.flatMap(cat =>
                        cat.tickets.map(t => ({
                            ...t,
                            categoryName: cat.categoryName
                        }))
                    );
                    setTickets(allTickets);
                    setTotalPrice(data.priceSummary);
                }
            } else {
                const text = await res.text();
                setErrorMsg(`Failed to update booking: ${text}`);
            }
        } catch (err: unknown) {
            setErrorMsg("A network error occurred during update.");
        } finally {
            setEditLoading(false);
        }
    };

    const displayTotalPrice = totalPrice;

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-900">
            <Navbar />

            <main className="flex-grow flex flex-col">
                <AuroraBackground className="flex-grow pt-32 pb-24 border-none" opacity={0.15}>
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                                Manage Your Booking
                            </h1>
                            <p className="text-blue-100/70 text-lg max-w-2xl mx-auto leading-relaxed">
                                Access your tickets, modify your order, or cancel upcoming events using your unique Booking Reference.
                            </p>
                        </div>

                        {/* Search Card */}
                        <div className="bg-white/95 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/20 max-w-4xl mx-auto mb-16 relative group transition-all duration-300 hover:shadow-blue-500/20">
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-grow">
                                    <i className="fas fa-search absolute left-5 top-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                                    <input
                                        type="text"
                                        placeholder="Enter your Booked Ticket ID (e.g. 1)"
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        className="w-full pl-14 pr-[160px] py-4.5 bg-transparent rounded-xl border-none focus:ring-0 font-medium text-slate-700 text-lg placeholder:text-slate-300"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowIdsModal(true)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl transition-all border border-blue-100 hover:shadow-md active:scale-95"
                                        title="Show all available IDs"
                                    >
                                        <i className="fas fa-list-ul mr-2"></i> Show All
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !searchId}
                                    className="bg-blue-600 text-white px-10 py-4.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 text-lg disabled:opacity-70 flex items-center justify-center gap-2 m-1 hover:shadow-[0_0_20px_rgba(28,92,255,0.4)]"
                                >
                                    {loading ? <i className="fas fa-spinner fa-spin"></i> : "Find Booking"}
                                </button>
                            </form>
                        </div>

                        {/* Messages */}
                        {errorMsg && (
                            <div className="bg-red-500/10 backdrop-blur-md text-red-400 p-5 rounded-2xl border border-red-500/20 flex items-center gap-4 mb-8 max-w-2xl mx-auto font-semibold shadow-sm animate-in fade-in slide-in-from-top-2">
                                <i className="fas fa-exclamation-triangle text-xl"></i> {errorMsg}
                            </div>
                        )}
                        {successMsg && (
                            <div className="bg-emerald-500/10 backdrop-blur-md text-emerald-400 p-5 rounded-2xl border border-emerald-500/20 flex items-center gap-4 mb-8 max-w-2xl mx-auto font-semibold shadow-sm animate-in fade-in slide-in-from-top-2">
                                <i className="fas fa-check-circle text-xl"></i> {successMsg}
                            </div>
                        )}

                        {/* Results List */}
                        {tickets.length > 0 && fetchedId && (
                            <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="bg-slate-900/90 p-8 flex flex-col sm:flex-row justify-between items-center gap-6 relative border-b border-white/5">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                    <div className="relative z-10">
                                        <h2 className="text-white font-bold text-2xl flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                                                <i className="fas fa-receipt text-blue-400"></i>
                                            </div>
                                            Booking Reference
                                        </h2>
                                        <p className="text-slate-400 font-mono mt-2 text-sm tracking-wider bg-slate-800/50 px-3 py-1 rounded-lg inline-block">{fetchedId}</p>
                                    </div>
                                    <div className="text-center sm:text-right relative z-10">
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-60 font-sans">Price Summary</p>
                                        <p className="text-blue-400 font-black text-3xl tracking-tight [text-shadow:0_0_10px_rgba(96,165,250,0.3)]">Rp {displayTotalPrice.toLocaleString("id-ID")}</p>
                                    </div>
                                </div>

                                <div className="p-8 md:p-12">
                                    <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                                        <h3 className="font-extrabold text-slate-800 text-2xl tracking-tight">Scheduled Events</h3>
                                        <span className="bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full">
                                            {tickets.length} {tickets.length === 1 ? 'Event' : 'Events'}
                                        </span>
                                    </div>

                                    <AnimatedList
                                        items={tickets.map((t, index) => {
                                            const currentQty = t.quantity;
                                            const isEditing = editingTicket === t.ticketCode;

                                            return (
                                                <div key={index} className="flex flex-col md:flex-row gap-8 p-8 border border-white/20 rounded-[2rem] bg-white/40 backdrop-blur-md hover:bg-white/60 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group">
                                                    <div className="flex-grow text-left">
                                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                                            <span className="bg-slate-900/10 backdrop-blur-sm px-3 py-1 shadow-sm border border-slate-200/30 text-blue-600 font-extrabold text-[10px] uppercase tracking-widest rounded-lg">
                                                                {t.ticketCode}
                                                            </span>
                                                            <span className="bg-blue-600/5 text-blue-600 font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-lg">
                                                                {t.categoryName}
                                                            </span>
                                                            <span className="text-slate-400 font-bold text-xs flex items-center gap-1.5 ml-auto">
                                                                <i className="far fa-clock"></i>
                                                                {t.eventDate}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors tracking-tight [text-shadow:0_1px_2px_rgba(255,255,255,0.5)]">{t.ticketName}</h4>

                                                        <div className="text-slate-500 font-bold text-sm mt-4 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                                            Unit Price: <span className="text-slate-700">Rp {t.price?.toLocaleString("id-ID")}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col justify-center gap-4 md:min-w-[240px] border-t md:border-t-0 md:border-l border-slate-200/30 pt-6 md:pt-0 md:pl-8">
                                                        {isEditing ? (
                                                            <div className="bg-white/80 backdrop-blur-lg p-4 rounded-2xl shadow-xl border border-blue-100/50 animate-in zoom-in-95">
                                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">New Quantity</label>
                                                                <div className="flex items-center justify-between mb-4 bg-slate-900/5 p-1.5 rounded-xl border border-slate-200/30">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditQuantity(q => Math.max(1, q - 1));
                                                                        }}
                                                                        className="w-10 h-10 rounded-lg bg-white text-slate-600 hover:text-blue-600 shadow-sm flex items-center justify-center transition active:scale-95"
                                                                    >
                                                                        <i className="fas fa-minus text-xs"></i>
                                                                    </button>
                                                                    <span className="text-lg font-black text-slate-900">{editQuantity}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditQuantity(q => q + 1);
                                                                        }}
                                                                        className="w-10 h-10 rounded-lg bg-white text-slate-600 hover:text-blue-600 shadow-sm flex items-center justify-center transition active:scale-95"
                                                                    >
                                                                        <i className="fas fa-plus text-xs"></i>
                                                                    </button>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleEditSave(t.ticketCode);
                                                                        }}
                                                                        disabled={editLoading}
                                                                        className="flex-2 bg-blue-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 hover:shadow-[0_0_15px_rgba(28,92,255,0.4)]"
                                                                    >
                                                                        {editLoading ? "..." : "Save Changes"}
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditingTicket(null);
                                                                        }}
                                                                        disabled={editLoading}
                                                                        className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition"
                                                                    >
                                                                        <i className="fas fa-times"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col gap-3 w-full">
                                                                <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-slate-100 shadow-sm group-hover:border-blue-100 transition-colors">
                                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Quantity</span>
                                                                    <span className="text-lg font-black text-slate-900">{currentQty}</span>
                                                                </div>
                                                                <div className="flex gap-2 w-full mt-1">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditingTicket(t.ticketCode);
                                                                            setEditQuantity(currentQty);
                                                                        }}
                                                                        className="flex-1 bg-white/60 backdrop-blur-sm border border-slate-200/50 text-slate-700 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-2 shadow-sm hover:bg-white/80"
                                                                    >
                                                                        <i className="fas fa-edit text-[10px]"></i> Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleRevoke(t.ticketCode, currentQty);
                                                                        }}
                                                                        disabled={revokeLoading === t.ticketCode}
                                                                        className="flex-1 bg-white/40 backdrop-blur-sm border border-red-500/10 text-red-500 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30 transition flex items-center justify-center gap-2 shadow-sm"
                                                                    >
                                                                        {revokeLoading === t.ticketCode ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-trash-alt text-[10px]"></i> Cancel</>}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        showGradients={true}
                                        enableArrowNavigation={true}
                                        displayScrollbar={true}
                                    />
                                </div>
                            </div>
                        )}
                        {/* IDs Modal */}
                        {showIdsModal && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowIdsModal(false)}></div>
                                <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                                    <div className="bg-blue-600 p-8 text-white relative">
                                        <h3 className="text-2xl font-black tracking-tight">Booking History</h3>
                                        <p className="text-blue-100 text-sm opacity-80 mt-1">Found {allIds.length} distinct booking references</p>
                                        <button
                                            onClick={() => setShowIdsModal(false)}
                                            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                                        >
                                            <i className="fas fa-times text-xl"></i>
                                        </button>
                                    </div>
                                    <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                        {idsLoading ? (
                                            <div className="py-12 text-center text-slate-400">
                                                <i className="fas fa-spinner fa-spin text-3xl mb-4 text-blue-500"></i>
                                                <p className="font-bold">Syncing with database...</p>
                                            </div>
                                        ) : allIds.length === 0 ? (
                                            <div className="py-12 text-center text-slate-400">
                                                <i className="fas fa-history text-3xl mb-4 opacity-20"></i>
                                                <p className="font-bold">No booking history available yet.</p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-3">
                                                {allIds.map((id) => (
                                                    <button
                                                        key={id}
                                                        onClick={() => {
                                                            setSearchId(id);
                                                            setShowIdsModal(false);
                                                            // Auto trigger search
                                                            setTimeout(() => {
                                                                const form = document.querySelector('form');
                                                                form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                                            }, 100);
                                                        }}
                                                        className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-600/5 transition-all group text-left"
                                                    >
                                                        <div>
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Booking ID</span>
                                                            <span className="font-mono font-bold text-slate-700 group-hover:text-blue-600 transition-colors uppercase">{id}</span>
                                                        </div>
                                                        <i className="fas fa-chevron-right text-slate-300 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all"></i>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                                        <button
                                            onClick={() => setShowIdsModal(false)}
                                            className="text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-800 transition-colors"
                                        >
                                            Close Portal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </AuroraBackground>
            </main>

            <Footer />
        </div >
    );
}
