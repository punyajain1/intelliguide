"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { DataHandle } from "./components/datahandle";
import Header from "./components/landingpage/header";
import { BodyC } from "./components/landingpage/body";
import FooterC from "./components/landingpage/footer";
import { SendIcon } from "./components/icons/send";

export default function Home() {
  const userHandle = useRef<HTMLInputElement | null>(null);
  const [submittedHandle, setSubmittedHandle] = useState<string | null>(null);

  useEffect(() => {
    const handlePageHide = (event: PageTransitionEvent) => {
      if (!event.persisted) {
        localStorage.clear();
      }
    };
    window.addEventListener("pagehide", handlePageHide);
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  const handleAnalyze = () => {
    try {
      if (!userHandle.current?.value) {
        alert("Enter user handle");
      }
      setSubmittedHandle(userHandle.current?.value ?? null);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <Header />
      <div className="container mx-auto py-12">
        <div className="text-center m-5">
          <BodyC />
          <div className="">
            <div className="flex gap-4 mx-auto max-w-md bg-[#FFF9F0] p-4 rounded-lg shadow-md">
              <Input
                placeholder="Enter username"
                ref={userHandle}
                className="h-8 md:h-14 w-full rounded-lg p-5 border border-gray-300 shadow-md bg-[#FFF9F0] text-[#333333] text-md md:text-xl focus:outline-none focus:ring-2 focus:ring-[#FFA45B] focus:border-transparent"
                aria-label="Username input"
              />
              <Button
                className="hidden md:block h-14 px-10 rounded-lg text-white font-semibold text-sm md:text-lg transition-all transform hover:scale-105 shadow-md bg-[#6B4226] hover:bg-[#56351F]"
                onClick={handleAnalyze}
                aria-label="Analyze button"
              >
                Analyze
              </Button>
              <div
                className="md:hidden my-auto rounded-lg transition-all transform hover:scale-105 shadow-md bg-[#6B4226] hover:bg-[#56351F] flex items-center justify-center h-10 w-10"
                onClick={handleAnalyze}
                aria-label="Send icon"
              >
                <SendIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {submittedHandle && <DataHandle userHandle={submittedHandle} />}

      <div className="mt-20">
        <FooterC />
      </div>
    </div>
  );
}
