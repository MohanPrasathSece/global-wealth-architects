import React, { useState, useRef, useEffect } from "react";
import { Country, COUNTRIES } from "../utils/phoneValidation";
import { ChevronDown, Check, Search } from "lucide-react";

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === value) || COUNTRIES[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search)
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
        className="flex items-center justify-between gap-1.5 rounded-xl sm:rounded-2xl border-2 border-ink bg-white/60 px-2.5 py-2.5 sm:px-3 sm:py-3 outline-none focus:border-coral text-ink text-xs sm:text-sm w-full h-full cursor-pointer hover:bg-white transition duration-200 whitespace-nowrap"
        style={{ minWidth: "75px" }}
      >
        <span className="flex items-center gap-1.5">
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <span className="text-sm font-semibold text-ink">
            {selectedCountry.code === "GEN" ? "Other" : selectedCountry.dialCode || selectedCountry.code}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 text-ink/50 transition-transform duration-300 ${isOpen ? "rotate-180 text-coral" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 max-h-72 w-[240px] sm:w-[280px] overflow-hidden rounded-2xl border-2 border-ink bg-cream p-1.5 shadow-[6px_6px_0_0_var(--ink)] flex flex-col">
          {/* Search Input */}
          <div className="relative mb-1.5 p-1 flex items-center border-b border-ink/10">
            <Search className="absolute left-3 h-3.5 w-3.5 text-ink/40" />
            <input
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-2 border-ink/40 bg-white/60 pl-8 pr-3 py-1.5 text-xs text-ink outline-none focus:border-coral transition"
            />
          </div>

          {/* List options */}
          <div className="flex-1 overflow-y-auto max-h-48 space-y-0.5 custom-scrollbar">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => {
                const isSelected = c.code === value;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onChange(c.code);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-left text-xs transition duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-ink text-cream font-bold"
                        : "text-ink/80 hover:bg-ink/5 hover:text-ink"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg leading-none">{c.flag}</span>
                      <span className="font-medium line-clamp-1">{c.name}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className={`text-[10px] ${isSelected ? "text-cream/70" : "text-ink/40"}`}>
                        {c.dialCode}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-cream" />}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-ink/40">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
