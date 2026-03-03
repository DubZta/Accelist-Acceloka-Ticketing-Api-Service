import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-white py-4 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <Link href="http://localhost:3000/" className="flex items-center">
                        <div className="relative w-40 h-24">
                            <Image
                                src="/acceloka_logo_blue.png"
                                alt="Acceloka Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>

                    <div className="flex flex-wrap justify-center gap-8 text-slate-600 font-medium">
                        <Link href="http://localhost:3000/" className="hover:text-blue-600 transition">
                            Home
                        </Link>
                        <Link href="http://localhost:3000/about" className="hover:text-blue-600 transition">
                            About
                        </Link>
                        <Link href="http://localhost:3000/#events" className="hover:text-blue-600 transition">
                            Tickets
                        </Link>
                        <Link href="https://wa.me/0895396330120" className="hover:text-blue-600 transition">
                            Support
                        </Link>
                        <Link href="https://wa.me/0895396330120" className="hover:text-blue-600 transition">
                            Contact
                        </Link>
                    </div>

                    <div className="flex gap-4 text-slate-400">
                        <Link
                            href="https://github.com/DubZta/Accelist-Acceloka-Ticketing-Api-Service"
                            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
                        >
                            <i className="fab fa-github"></i>
                        </Link>
                        <Link
                            href="https://www.instagram.com/jasonnnmatthew/"
                            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
                        >
                            <i className="fab fa-instagram"></i>
                        </Link>
                        <Link
                            href="https://www.linkedin.com/in/jasonnnmatthew/"
                            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
                        >
                            <i className="fab fa-linkedin-in"></i>
                        </Link>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 text-center text-slate-400 text-sm">
                    &copy; 2026 Acceloka Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
