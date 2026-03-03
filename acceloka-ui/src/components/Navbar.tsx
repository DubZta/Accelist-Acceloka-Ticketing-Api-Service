"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const categories = [
        { name: "Cinema", value: "Bioskop" },
        { name: "Concert", value: "Tiket Konser" },
        { name: "Train", value: "Kereta" },
        { name: "Ferry", value: "Kapal Laut" },
        { name: "Airplane", value: "Pesawat" },
        { name: "Hotel", value: "Hotel" },
    ];

    return (
        <nav
            className={`fixed w-full z-50 backdrop-blur-sm text-white transition-all duration-300 ${scrolled ? "bg-blue-600 shadow-lg" : "bg-blue-600/95"
                }`}
            id="navbar"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center">
                        <div className="relative w-48 h-42">
                            <Image
                                src="/acceloka_logo.png"
                                alt="Acceloka Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <div className="relative group">
                            <button className="text-blue-100 group-hover:text-white font-medium transition flex items-center h-20">
                                Categories <i className="fas fa-chevron-down text-xs ml-1"></i>
                            </button>
                            <div className="absolute top-20 left-0 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-slate-100 transform origin-top overflow-hidden">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.value}
                                        href={`/?category=${cat.value}#events`}
                                        className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link
                            href="/about"
                            className="text-blue-100 hover:text-white font-medium transition"
                        >
                            About
                        </Link>
                        <Link
                            href="/my-booking"
                            className="text-blue-100 hover:text-white font-medium transition"
                        >
                            View My Booking
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="http://localhost:3000/#events"
                            className="hidden md:block bg-white text-blue-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg"
                        >
                            Get Tickets
                        </Link>
                        <button className="md:hidden text-white text-xl">
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
