"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
                <AuroraBackground className="pt-32 pb-24 overflow-visible bg-slate-900 border-none min-h-0 h-auto">
                    <div className="max-w-4xl mx-auto px-6 relative z-10 w-full mb-20">
                        {/* Hero Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-20 text-white"
                        >
                            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-shadow">
                                About <span className="text-blue-400">Acceloka</span>
                            </h1>
                            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                                The next generation of ticketing. Built for speed, security, and a seamless user experience.
                            </p>
                        </motion.div>

                        {/* Content Sections */}
                        <div className="grid gap-16">
                            <motion.section
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="bg-white/95 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20 transition-all"
                            >
                                <h2 className="text-3xl font-bold text-slate-900 mb-6 font-display">What is Acceloka?</h2>
                                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                    Acceloka is a modern ticketing platform designed to bridge the gap between event organizers and attendees.
                                    Whether you're looking for cinema tickets, concert passes, or travel bookings, Acceloka provides a
                                    centralized hub to discover, book, and manage all your digital tickets in one place.
                                </p>
                                <div className="grid md:grid-cols-3 gap-6 mt-8">
                                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                        <h3 className="font-bold text-blue-700 mb-2">Fast</h3>
                                        <p className="text-sm text-slate-600">Instant booking confirmation and real-time availability tracking.</p>
                                    </div>
                                    <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                        <h3 className="font-bold text-indigo-700 mb-2">Secure</h3>
                                        <p className="text-sm text-slate-600">Enterprise-grade encryption for all your transactions and data.</p>
                                    </div>
                                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                        <h3 className="font-bold text-emerald-700 mb-2">Social</h3>
                                        <p className="text-sm text-slate-600">Designed to be shared with friends and family seamlessly.</p>
                                    </div>
                                </div>
                            </motion.section>

                            <motion.section
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="grid md:grid-cols-2 gap-12 items-center text-white"
                            >
                                <div>
                                    <h2 className="text-3xl font-bold mb-6 text-shadow">Who Created It?</h2>
                                    <p className="text-blue-100 text-lg leading-relaxed mb-6">
                                        Acceloka was conceptualized and developed by <span className="font-bold text-white">Jason Matthew</span>.
                                        As someone who is passionate about technology, Jason envisioned a platform that removes the friction from
                                        traditional ticketing systems by utilizing cutting-edge web technologies like Next.js and .NET.
                                    </p>
                                    <p className="text-blue-100 text-lg leading-relaxed">
                                        His goal was to create a "wow" experience for users and an interface that's not just functional,
                                        but beautiful and intuitive to use.
                                    </p>
                                </div>
                                <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl group border border-white/10">
                                    <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors z-10"></div>
                                    <Image
                                        src="/hehe.png"
                                        alt="Creator workspace"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            </motion.section>

                            <motion.section
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="bg-slate-900/40 backdrop-blur-xl text-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/10"
                            >
                                <h2 className="text-3xl font-bold mb-8 text-center text-blue-400 font-display">How It Works</h2>
                                <div className="grid md:grid-cols-4 gap-8">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl shadow-lg shadow-blue-600/20">1</div>
                                        <h3 className="font-bold mb-2">Discover</h3>
                                        <p className="text-sm text-slate-400">Search for categories or dates using our smart filters.</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl shadow-lg shadow-blue-600/20">2</div>
                                        <h3 className="font-bold mb-2">Collect</h3>
                                        <p className="text-sm text-slate-400">Add multiple tickets to your cart across any category.</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl shadow-lg shadow-blue-600/20">3</div>
                                        <h3 className="font-bold mb-2">Book</h3>
                                        <p className="text-sm text-slate-400">Complete one transaction for all your selected tickets.</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl shadow-lg shadow-blue-600/20">4</div>
                                        <h3 className="font-bold mb-2">Manage</h3>
                                        <p className="text-sm text-slate-400">View or cancel your bookings anytime on your portal.</p>
                                    </div>
                                </div>
                            </motion.section>
                        </div>
                    </div>
                </AuroraBackground>
            </main>

            <Footer />
        </div>
    );
}
