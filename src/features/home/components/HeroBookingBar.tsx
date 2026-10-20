"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Users, BedDouble, ArrowUpRight } from "lucide-react";
import { getWhatsAppEnquiryUrl } from "@/config/site.config";

export function HeroBookingBar() {
  const router = useRouter();

  // Default dates
  const today = new Date();
  const defaultCheckIn = new Date(today);
  defaultCheckIn.setDate(today.getDate() + 1);
  const defaultCheckOut = new Date(today);
  defaultCheckOut.setDate(today.getDate() + 3);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(formatDate(defaultCheckIn));
  const [checkOut, setCheckOut] = useState(formatDate(defaultCheckOut));
  const [suiteType, setSuiteType] = useState("Royal Tented Pavilion");
  const [guests, setGuests] = useState("2 Guests");

  const handleBookingEnquiry = () => {
    const text = `Namaste RETIVAA, I would like to check availability for the ${suiteType} from ${checkIn} to ${checkOut} for ${guests}.`;
    const url = getWhatsAppEnquiryUrl(text);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      router.push(`/contact?suite=${encodeURIComponent(suiteType)}&in=${checkIn}&out=${checkOut}&guests=${encodeURIComponent(guests)}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.35, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-5xl mx-auto mt-10 lg:mt-14"
      role="region"
      aria-label="Direct Camp Availability and Reservation Concierge"
    >
      <div className="relative rounded-2xl bg-[#14110E]/85 backdrop-blur-xl border border-[#FAF6F0]/15 p-3.5 sm:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
        {/* Top Gold Shimmer Border Accent */}
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#E4C198]/60 to-transparent" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 items-center">
          {/* Check-In */}
          <div className="flex items-center gap-3 rounded-xl bg-[#FAF6F0]/05 border border-[#FAF6F0]/10 px-4 py-2.5 transition-colors hover:border-[#E4C198]/40">
            <Calendar size={18} className="text-[#E4C198] shrink-0" />
            <div className="flex-1 text-left">
              <label htmlFor="check-in-date" className="block text-[10px] uppercase tracking-[0.25em] text-[#FAF6F0]/50 font-medium">
                Check In
              </label>
              <input
                id="check-in-date"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-[#FAF6F0] focus:outline-none cursor-pointer [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Check-Out */}
          <div className="flex items-center gap-3 rounded-xl bg-[#FAF6F0]/05 border border-[#FAF6F0]/10 px-4 py-2.5 transition-colors hover:border-[#E4C198]/40">
            <Calendar size={18} className="text-[#E4C198] shrink-0" />
            <div className="flex-1 text-left">
              <label htmlFor="check-out-date" className="block text-[10px] uppercase tracking-[0.25em] text-[#FAF6F0]/50 font-medium">
                Check Out
              </label>
              <input
                id="check-out-date"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-[#FAF6F0] focus:outline-none cursor-pointer [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Suite Tier */}
          <div className="flex items-center gap-3 rounded-xl bg-[#FAF6F0]/05 border border-[#FAF6F0]/10 px-4 py-2.5 transition-colors hover:border-[#E4C198]/40">
            <BedDouble size={18} className="text-[#E4C198] shrink-0" />
            <div className="flex-1 text-left">
              <label htmlFor="suite-select" className="block text-[10px] uppercase tracking-[0.25em] text-[#FAF6F0]/50 font-medium">
                Accommodation
              </label>
              <select
                id="suite-select"
                value={suiteType}
                onChange={(e) => setSuiteType(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-[#FAF6F0] focus:outline-none cursor-pointer [&>option]:bg-[#14110E] [&>option]:text-[#FAF6F0]"
              >
                <option value="Royal Tented Pavilion">Royal Tented Pavilion</option>
                <option value="Maharaja Dune Villa">Maharaja Dune Villa</option>
                <option value="Heritage Swiss Camp">Heritage Swiss Camp</option>
                <option value="Stargazer Dune Suite">Stargazer Dune Suite</option>
              </select>
            </div>
          </div>

          {/* Guests & Action Button */}
          <div className="flex items-center gap-2">
            {/* Guests Selector */}
            <div className="flex-1 flex items-center gap-2 rounded-xl bg-[#FAF6F0]/05 border border-[#FAF6F0]/10 px-3 py-2.5 transition-colors hover:border-[#E4C198]/40">
              <Users size={16} className="text-[#E4C198] shrink-0" />
              <div className="flex-1 text-left">
                <label htmlFor="guests-select" className="block text-[10px] uppercase tracking-[0.2em] text-[#FAF6F0]/50 font-medium">
                  Guests
                </label>
                <select
                  id="guests-select"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-[#FAF6F0] focus:outline-none cursor-pointer [&>option]:bg-[#14110E] [&>option]:text-[#FAF6F0]"
                >
                  <option value="1 Guest">1 Guest</option>
                  <option value="2 Guests">2 Guests</option>
                  <option value="3 Guests">3 Guests</option>
                  <option value="4+ Guests">4+ Guests</option>
                </select>
              </div>
            </div>

            {/* Check Availability CTA */}
            <button
              type="button"
              onClick={handleBookingEnquiry}
              className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FAF6F0] via-[#E4C198] to-[#D7B98E] px-4 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#14110E] transition-all duration-300 hover:shadow-[0_0_25px_rgba(228,193,152,0.45)] hover:scale-[1.02] active:scale-95 shrink-0"
              title="Reserve or enquire availability via concierge"
            >
              <span>Check</span>
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Bottom Sub-indicator */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-[10px] tracking-[0.15em] text-[#FAF6F0]/45 px-1 font-light">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E4C198] animate-pulse" />
            Best Rate Guaranteed · Direct Camp Booking
          </span>
          <span className="hidden sm:inline">
            Complimentary Camel Safari & Evening Cultural Folk Performance with all Suite Stays
          </span>
        </div>
      </div>
    </motion.div>
  );
}
