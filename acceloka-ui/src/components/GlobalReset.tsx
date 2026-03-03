"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GlobalReset() {
    const router = useRouter();

    useEffect(() => {
        // Check if it's a hard refresh and we have search parameters active
        if (typeof window !== "undefined") {
            const navigationEntries = performance.getEntriesByType("navigation");
            if (navigationEntries.length > 0) {
                const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
                // If the page was reloaded (F5) AND there are search parameters in the URL
                if (navEntry.type === "reload" && window.location.search.length > 0) {
                    // Strip search parameters
                    router.replace("/");
                }
            }
        }
    }, [router]);

    return null;
}
