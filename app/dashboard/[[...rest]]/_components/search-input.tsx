"use client";

import qs from "query-string";
import { useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState("");

  const debouncedCallback = useDebounceCallback((searchValue: string) => {
    const url = qs.stringifyUrl(
      {
        url: "/dashboard",
        query: { search: searchValue },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedCallback(newValue);
  };

  return (
    <div className="relative w-full max-w-[460px]">
      <Search className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400 h-4 w-4" />
      <Input
        className="h-10 w-full rounded-xl border-transparent bg-zinc-100 pl-10 text-sm shadow-none transition-colors placeholder:text-zinc-400 hover:bg-zinc-200/60 focus-visible:border-indigo-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-100"
        placeholder="Search boards…"
        aria-label="Search boards"
        onChange={handleChange}
        value={value}
      />
    </div>
  );
};

export default SearchInput;
