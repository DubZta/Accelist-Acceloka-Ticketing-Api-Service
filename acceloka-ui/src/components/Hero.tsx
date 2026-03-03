"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { AuroraBackground } from "./ui/aurora-background";

export default function Hero() {
    return (
        <AuroraBackground className="pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-900 border-none">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white space-y-8"
                    >
                        <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-shadow">
                            Find & book
                            <br />
                            tickets fast
                        </h1>
                        <p className="text-lg lg:text-xl text-blue-100 max-w-lg leading-relaxed">
                            Search events, compare options, and book in minutes. The fastest
                            way to get into the experiences you love.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                href="#events"
                                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg transform hover:-translate-y-1 inline-block"
                            >
                                Explore Events
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative lg:h-[600px] h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl transform lg:rotate-1 hover:rotate-0 transition duration-500"
                    >
                        <Image
                            src="/OTA.png"
                            alt="Concert Crowd"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                        <div className="absolute inset-0 image-overlay"></div>
                        <div className="absolute bottom-8 left-8 right-8 text-white">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="font-medium text-sm">
                                        Choose what you wanna book!
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuroraBackground>
    );
}
