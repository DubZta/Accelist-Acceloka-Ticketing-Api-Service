export default function Stats() {
    return (
        <section className="bg-blue-600 pb-20 -mt-10 relative z-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 border-t border-white/10 pt-12">
                    <div className="text-center lg:text-left">
                        <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                            150K+
                        </div>
                        <div className="text-blue-200 font-medium mb-1">Tickets booked</div>
                        <div className="text-xs text-blue-300 uppercase tracking-wide">
                            Trusted by 150K+ users
                        </div>
                    </div>
                    <div className="text-center lg:text-left">
                        <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                            6
                        </div>
                        <div className="text-blue-200 font-medium mb-1">Categories</div>
                        <div className="text-xs text-blue-300 uppercase tracking-wide">
                            Cinema, concerts, travel, more
                        </div>
                    </div>
                    <div className="text-center lg:text-left">
                        <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                            24/7
                        </div>
                        <div className="text-blue-200 font-medium mb-1">Support</div>
                        <div className="text-xs text-blue-300 uppercase tracking-wide">
                            Help anytime, anywhere
                        </div>
                    </div>
                    <div className="text-center lg:text-left">
                        <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                            Instant
                        </div>
                        <div className="text-blue-200 font-medium mb-1">E-tickets</div>
                        <div className="text-xs text-blue-300 uppercase tracking-wide">
                            Fast, secure, paperless
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
