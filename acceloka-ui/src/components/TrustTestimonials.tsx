import Image from "next/image";

export default function TrustTestimonials() {
    return (
        <section className="py-24 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Users */}
                <div className="text-center mb-20">
                    <p className="text-blue-400 font-semibold uppercase tracking-widest text-sm mb-4">
                        Trusted by Our Community
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-bold mb-12">
                        Loved by our users
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <span className="text-4xl font-bold text-white">150K+</span>
                            <span className="text-sm font-medium text-slate-400">Tickets Sold</span>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2">
                            <span className="text-4xl font-bold text-white">99%</span>
                            <span className="text-sm font-medium text-slate-400">Positive Reviews</span>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2">
                            <span className="text-4xl font-bold text-white">10K+</span>
                            <span className="text-sm font-medium text-slate-400">Daily Users</span>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2">
                            <span className="text-4xl font-bold text-white">5 Star</span>
                            <span className="text-sm font-medium text-slate-400">Customer Support</span>
                        </div>
                    </div>
                </div>

                {/* Testimonial */}
                <div className="bg-slate-800 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row gap-12 items-center">
                    <div className="lg:w-1/3 w-full relative aspect-square max-w-sm mx-auto">
                        <Image
                            src="https://b.fssta.com/uploads/application/soccer/headshots/885.png"
                            alt="User"
                            fill
                            className="rounded-2xl shadow-2xl object-cover"
                            unoptimized
                        />
                    </div>
                    <div className="lg:w-2/3">
                        <div className="flex items-center gap-1 text-yellow-400 mb-6 text-xl">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                        </div>
                        <blockquote className="text-2xl lg:text-3xl font-medium leading-relaxed mb-8">
                            &quot;Booking tickets for the Travis Scott concert was quick and effortless. The process was
                            simple, and my e-ticket arrived instantly. Highly recommend for
                            smooth event access.&quot;
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <div>
                                <div className="font-bold text-lg">Cristiano Ronaldo</div>
                                <div className="text-slate-400">Football Player</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
