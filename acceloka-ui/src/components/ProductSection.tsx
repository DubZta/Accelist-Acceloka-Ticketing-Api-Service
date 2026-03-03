import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import dayjs from "dayjs";
import TicketCard from "./TicketCard";

type SearchParams = {
    keyword?: string;
    category?: string;
    date?: string;
    maxDate?: string;
    maxPrice?: string;
    ticketCode?: string;
    orderBy?: string;
    orderState?: string;
    page?: string;
};

interface Ticket {
    ticketCode: string;
    ticketName: string;
    categoryName: string;
    price: number;
    quota: number;
    eventDate: string;
}

export default async function ProductSection({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const unresolvedParams = await searchParams;

    // Basic search attributes
    const keyword = unresolvedParams?.keyword || "";
    const category = unresolvedParams?.category || "";
    const date = unresolvedParams?.date || "";

    // Advanced search attributes
    const maxDate = unresolvedParams?.maxDate || "";
    const maxPrice = unresolvedParams?.maxPrice || "";
    const ticketCode = unresolvedParams?.ticketCode || "";
    const orderBy = unresolvedParams?.orderBy || "eventDate";
    const orderState = unresolvedParams?.orderState || "asc";

    // Pagination attributes
    const currentPage = parseInt(unresolvedParams?.page || "1");
    const pageSize = 6;

    // Determine viewing mode:
    // "default" mode implies showing 1 ticket from each of the 6 categories (the initial view).
    // "search" mode means the user has interacted with filters or categories and we show paginated grid.
    const isSearchMode = Object.keys(unresolvedParams || {}).some(key => ["keyword", "category", "date", "maxDate", "maxPrice", "ticketCode", "page"].includes(key));

    const queryParams = new URLSearchParams();

    if (keyword) queryParams.set("namaTiket", keyword);
    if (category) queryParams.set("namaKategori", category);
    if (ticketCode) queryParams.set("kodeTiket", ticketCode);
    if (maxPrice) queryParams.set("harga", maxPrice);

    if (date) {
        // Assume native HTML input date is YYYY-MM-DD
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        queryParams.set("tanggalEventMinimal", formattedDate);

        // Match user expectation: If only basic Date is picked, show ONLY that date
        if (!maxDate) {
            queryParams.set("tanggalEventMaksimal", formattedDate);
        }
    }

    if (maxDate) {
        // Assume native HTML input date is YYYY-MM-DD
        const formattedMaxDate = dayjs(maxDate).format('YYYY-MM-DD');
        queryParams.set("tanggalEventMaksimal", formattedMaxDate);
    }

    queryParams.set("orderBy", orderBy);
    queryParams.set("orderState", orderState);

    // If in search mode, use API pagination exactly. Otherwise fetch plenty to find the 6 unique ones.
    if (isSearchMode) {
        queryParams.set("page", currentPage.toString());
        queryParams.set("pageSize", pageSize.toString());
    }

    let tickets: Ticket[] = [];
    try {
        const res = await fetch(
            `http://localhost:5176/api/v1/get-available-ticket?${queryParams.toString()}`,
            { cache: "no-store" }
        );
        if (res.ok) {
            tickets = await res.json();
        } else {
            console.error("Failed to fetch tickets", res.status);
        }
    } catch (error) {
        console.error("Error fetching tickets:", error);
    }

    const requiredCategories = ["Bioskop", "Tiket Konser", "Kereta", "Kapal Laut", "Pesawat", "Hotel"];
    const categoryMap = {
        "Bioskop": "Cinema",
        "Tiket Konser": "Concert",
        "Kereta": "Train",
        "Kapal Laut": "Ferry",
        "Pesawat": "Airplane",
        "Hotel": "Hotel",
    };
    const categoryIcons = {
        "Cinema": "fas fa-film",
        "Concert": "fas fa-music",
        "Train": "fas fa-train",
        "Ferry": "fas fa-ship",
        "Airplane": "fas fa-plane",
        "Hotel": "fas fa-hotel",
    }

    const displayTickets: Ticket[] = [];

    if (isSearchMode) {
        // Direct pass-through of matched tickets matching exactly the query parameters
        displayTickets.push(...tickets);
    } else {
        // Find 1 of each category
        const foundCategories = new Set<string>();
        for (const ticket of tickets) {
            if (requiredCategories.includes(ticket.categoryName) && !foundCategories.has(ticket.categoryName)) {
                displayTickets.push(ticket);
                foundCategories.add(ticket.categoryName);
            }
            if (displayTickets.length === 6) break;
        }
    }

    // Next Page URL generation logic
    const buildPageUrl = (newPage: number) => {
        const newParams = new URLSearchParams(queryParams.toString());
        newParams.set("page", newPage.toString());
        // Remove pagination constraints for the main route redirect
        newParams.delete("pageSize");

        // Remap API keys back to route keys for neat URLs (since our SearchForm expects specific ones)
        // Actually, it's safer and easier to just map the current original searchParams forward
        const forwardParams = new URLSearchParams();
        if (keyword) forwardParams.set("keyword", keyword);
        if (category) forwardParams.set("category", category);
        if (date) forwardParams.set("date", date);
        if (maxDate) forwardParams.set("maxDate", maxDate);
        if (ticketCode) forwardParams.set("ticketCode", ticketCode);
        if (maxPrice) forwardParams.set("maxPrice", maxPrice);
        if (orderBy) forwardParams.set("orderBy", orderBy);
        if (orderState) forwardParams.set("orderState", orderState);
        forwardParams.set("page", newPage.toString());

        return `/?${forwardParams.toString()}#events`;
    }

    const hasMoreThanZero = displayTickets.length > 0;
    // If we asked for 6 and got 6 in search mode, there MIGHT be a next page.
    const hasNextPage = isSearchMode && displayTickets.length === pageSize;
    const hasPrevPage = isSearchMode && currentPage > 1;

    return (
        <section className="py-24 bg-white" id="events">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Search Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        See what&apos;s happening now
                    </h2>
                    <p className="text-slate-500 text-lg">
                        Discover trending events near you and book your spot instantly.
                    </p>
                </div>

                {/* Search Bar - Client Component */}
                <SearchForm />

                {/* Featured Categories */}
                <div className="mb-20">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {Object.entries(categoryMap).map(([internalKey, label]) => (
                            <Link
                                key={label}
                                href={`/?category=${internalKey}#events`}
                                className="group p-6 rounded-2xl bg-slate-50 hover:bg-blue-50 transition border border-slate-100 hover:border-blue-200 text-center"
                            >
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md transition text-blue-600 text-xl">
                                    <i className={categoryIcons[label as keyof typeof categoryIcons]}></i>
                                </div>
                                <h4 className="font-bold text-slate-900">{label}</h4>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Event Grid */}
                <div id="grid">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-slate-900">
                            {isSearchMode ? "Search Results" : "Trending Events"}
                        </h3>

                        {/* Pagination Controls */}
                        {isSearchMode && (
                            <div className="flex gap-2 items-center">
                                <span className="text-sm font-medium text-slate-500 mr-2">Page {currentPage}</span>
                                {hasPrevPage ? (
                                    <Link href={buildPageUrl(currentPage - 1)} className="w-10 h-10 rounded-full border border-blue-600 bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm">
                                        <i className="fas fa-chevron-left"></i>
                                    </Link>
                                ) : (
                                    <button disabled className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 cursor-not-allowed">
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                )}

                                {hasNextPage ? (
                                    <Link href={buildPageUrl(currentPage + 1)} className="w-10 h-10 rounded-full border border-blue-600 bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm">
                                        <i className="fas fa-chevron-right"></i>
                                    </Link>
                                ) : (
                                    <button disabled className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 cursor-not-allowed">
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hasMoreThanZero ? (
                            displayTickets.map((ticket) => {
                                const displayCategory = categoryMap[ticket.categoryName as keyof typeof categoryMap] || ticket.categoryName;
                                const categoryIcon = categoryIcons[displayCategory as keyof typeof categoryIcons] || "fas fa-ticket-alt";

                                return (
                                    <TicketCard
                                        key={ticket.ticketCode}
                                        ticket={ticket}
                                        categoryIcon={categoryIcon}
                                        displayCategory={displayCategory}
                                    />
                                );
                            })
                        ) : (
                            <div className="col-span-full py-16 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                <div className="text-5xl mb-4 text-slate-300"><i className="fas fa-search"></i></div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">No tickets found</h3>
                                <p className="text-md text-slate-500">Try adjusting your valid search parameters or browse all categories.</p>
                                <Link href="/#events" className="mt-6 inline-block bg-white border border-slate-200 text-blue-600 px-6 py-2 rounded-xl font-semibold hover:bg-slate-50 transition shadow-sm">
                                    Clear Search
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
