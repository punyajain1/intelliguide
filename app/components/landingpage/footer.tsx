import React, { useState, ChangeEvent, useRef } from "react";
import axios from "axios";

import { BACKEND_URL } from "../../key";
const FooterC = () => {
  const message = useRef<HTMLTextAreaElement | null>(null);
  const handleSend = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/message`, {
        message: message.current?.value,
      });
      if (response) {
        alert("Message Sent");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <footer className="bg-[#6B4226] text-white font-serif" >
      <div className="p-4">
      <div className="font-bold text-center">Do click <a href="https://lightning-dust-053.notion.site/Buy-Me-a-Coffee-17d72d69c0498008aa42ef7121aff3b6" target="_blank" className="underline text-red-200 hover:text-red-300 hover:underline-offset-2">here</a></div>

<div className="max-w-screen-sm mx-auto h-auto ">
  <h2 className="text-lg mb-3">We value your feedback</h2>
  <textarea
    className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D0B17D] text-black"
    placeholder="Share your thoughts or suggestions..."
    ref={message}
  />
  <div className="flex justify-end">
    <button
      onClick={handleSend}
      className="bg-[#D0B17D] text-white py-1.5 px-4 rounded-md hover:bg-[#B89F6D]"
    >
      Send
    </button>
  </div>
</div>
      </div>
    </footer>
  );
};

export default FooterC;
