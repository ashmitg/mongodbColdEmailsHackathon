"use client";

import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useState } from "react";
import { getRepositoryUrls } from "@/actions/repo/action";

export function PlaceholdersAndVanishInputDemo() {
  const [data, setData] = useState(null);
  const [value, setValue] = useState("");

  const placeholders = [
    "Find User-Authentication Management",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const getdataRepositoryUrls = async () => {
    const res = await getRepositoryUrls(value);
    setData(res);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    getdataRepositoryUrls();
  };

  return (
    <div className="h-[40rem] flex flex-col justify-center items-center px-4">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        Ask Aceternity UI Anything
      </h2>
      <div className="my-10 w-full max-w-2xl">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
          value={value}
          setValue={setValue}
        />
      </div>

      <div className="mt-10 w-full max-w-2xl overflow-y-auto">
        {data && (
          <ul className="list-disc list-inside text-left">
            {data.map((url, index) => (
              <li key={index} className="mb-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
