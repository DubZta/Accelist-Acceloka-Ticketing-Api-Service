"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "All Categories");
    const [date, setDate] = useState(searchParams.get("date") || "");

    const hasAdvancedParams = searchParams.get("ticketCode") || searchParams.get("maxPrice") || searchParams.get("maxDate") || searchParams.get("orderBy");
    const [showAdvanced, setShowAdvanced] = useState(!!hasAdvancedParams);

    const [ticketCode, setTicketCode] = useState(searchParams.get("ticketCode") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [maxDate, setMaxDate] = useState(searchParams.get("maxDate") || "");
    const [orderBy, setOrderBy] = useState(searchParams.get("orderBy") || "eventDate");
    const [orderState, setOrderState] = useState(searchParams.get("orderState") || "asc");

    const initialLoadDone = useRef(false);

    // Sync state with URL params (e.g., when a Category is clicked from Browse Category)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!initialLoadDone.current) {
            initialLoadDone.current = true;
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        setKeyword(searchParams.get("keyword") || "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setCategory(searchParams.get("category") || "All Categories");
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setDate(searchParams.get("date") || "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setTicketCode(searchParams.get("ticketCode") || "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setMaxPrice(searchParams.get("maxPrice") || "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setMaxDate(searchParams.get("maxDate") || "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setOrderBy(searchParams.get("orderBy") || "eventDate");
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setOrderState(searchParams.get("orderState") || "asc");
    }, [searchParams]);

    const handleSearch = () => {
        const params = new URLSearchParams();

        // Basic
        if (keyword) params.set("keyword", keyword);
        if (category && category !== "All Categories") params.set("category", category);
        if (date) params.set("date", date);

        // Advanced
        if (ticketCode) params.set("ticketCode", ticketCode);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (maxDate) params.set("maxDate", maxDate);
        if (orderBy) params.set("orderBy", orderBy);
        if (orderState) params.set("orderState", orderState);

        params.set("page", "1");

        router.push(`/?${params.toString()}#events`, { scroll: false });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-4xl mx-auto mb-20 -mt-8 relative z-30">

            {/* Basic Search Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-1 relative">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">
                        Keyword
                    </label>
                    <div className="relative">
                        <i className="fas fa-search absolute left-3 top-3.5 text-slate-400"></i>
                        <input
                            type="text"
                            placeholder="Event Name"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                        />
                    </div>
                </div>
                <div className="md:col-span-1 relative">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">
                        Category
                    </label>
                    <div className="relative">
                        <i className="fas fa-tag absolute left-3 top-3.5 text-slate-400"></i>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 appearance-none"
                        >
                            <option>All Categories</option>
                            <option value="Bioskop">Cinema</option>
                            <option value="Tiket Konser">Concert</option>
                            <option value="Kereta">Train</option>
                            <option value="Kapal Laut">Ferry</option>
                            <option value="Pesawat">Airplane</option>
                            <option value="Hotel">Hotel</option>
                        </select>
                        <i className="fas fa-chevron-down absolute right-3 top-4 text-slate-400 text-xs"></i>
                    </div>
                </div>
                <div className="md:col-span-1 relative">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">
                        {showAdvanced ? "Min Date" : "Date"}
                    </label>
                    <div className="relative">
                        <i className="fas fa-calendar absolute left-3 top-3.5 text-slate-400"></i>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                        />
                    </div>
                </div>
                <div className="md:col-span-1 flex items-end">
                    <button
                        onClick={handleSearch}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Advanced Toggle */}
            <div className="flex justify-center -mt-2 mb-2">
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition flex items-center gap-1"
                >
                    {showAdvanced ? "Hide Advanced Search" : "Advanced Search"}
                    <i className={`fas fa-chevron-${showAdvanced ? "up" : "down"} text-xs transition`}></i>
                </button>
            </div>

            {/* Advanced Search Area */}
            {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="md:col-span-1 relative">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">
                            Max Date
                        </label>
                        <div className="relative">
                            <i className="fas fa-calendar-times absolute left-3 top-3.5 text-slate-400"></i>
                            <input
                                type="date"
                                value={maxDate}
                                onChange={(e) => setMaxDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-1 relative">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">
                            Max Price
                        </label>
                        <div className="relative">
                            <i className="fas fa-money-bill absolute left-3 top-3.5 text-slate-400"></i>
                            <input
                                type="number"
                                placeholder="ex. 500000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-1 relative">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">
                            Ticket Code
                        </label>
                        <div className="relative">
                            <i className="fas fa-qrcode absolute left-3 top-3.5 text-slate-400"></i>
                            <input
                                type="text"
                                placeholder="ex. B001"
                                value={ticketCode}
                                onChange={(e) => setTicketCode(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-1 relative">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">
                            Order By
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={orderBy}
                                onChange={(e) => setOrderBy(e.target.value)}
                                className="w-2/3 pl-3 pr-2 py-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 appearance-none text-sm"
                            >
                                <option value="eventDate">Date</option>
                                <option value="price">Price</option>
                                <option value="quota">Quota</option>
                            </select>
                            <select
                                value={orderState}
                                onChange={(e) => setOrderState(e.target.value)}
                                className="w-1/3 pl-3 py-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 appearance-none text-sm"
                            >
                                <option value="asc">Asc</option>
                                <option value="desc">Desc</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
