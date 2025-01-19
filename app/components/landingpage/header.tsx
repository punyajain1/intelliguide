"use client";
import React, { useState } from "react";
import {CoffeeIcon,} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Headlogo } from "../icons/logo";

const Header: React.FC = () => {
  //bg-[#FFF9F0]
  return (
    <div className="bg-[#6B4226] ">
    <header className="flex justify-between h-15 md:h-20 items-center p-4 border-b ">
      <div className="flex items-center gap-1 md:gap-2">
        <Headlogo />
        <span className="text-lg md:text-xl font-serif text-neutral-200 font-bold">
          IntelliGuide
        </span>
      </div>
      <a href="https://lightning-dust-053.notion.site/Buy-Me-a-Coffee-17d72d69c0498008aa42ef7121aff3b6" target="_blank" className="hidden md:flex">
        <Button className=" bg-[#FFF9F0] hover:bg-[#fbe7cc] text-black gap-2">
        <CoffeeIcon size={24} className="flex items-center justify-center"/>
        Buy me a coffee
      </Button>
      </a>
      <a href="https://lightning-dust-053.notion.site/Buy-Me-a-Coffee-17d72d69c0498008aa42ef7121aff3b6" target="_blank" className=" items-center justify-center flex md:hidden bg-[#FFF9F0] hover:bg-[#fbe7cc] w-10 h-10 rounded-lg">
        <CoffeeIcon size={24} className=""/>
      </a>
    </header>
  </div>
  );
};

export default Header;