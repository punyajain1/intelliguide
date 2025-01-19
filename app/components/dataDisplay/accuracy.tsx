import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../key";

interface Data {
  tag_wise: { [key: string]: number };
  gpt_guide: string;
}

const DataDisplay = (UserHandle: { userHandle: { userHandle: string } }) => {
  const [summary, setSummery] = useState<string>("");
  const [data, setUserData] = useState<{ [key: string]: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedData = localStorage.getItem(
          `Accuracy-${UserHandle.userHandle.userHandle}`
        );
        if (storedData) {
          const data = JSON.parse(storedData);
          setSummery(data.gpt_guide);
          setUserData(data.tag_wise);
          setLoading(false);
          return;
        }

        let response: Data | undefined;
        try {
          const res = await axios.post(`${BACKEND_URL}/accuracy`, {
            userhandle: UserHandle.userHandle.userHandle,
          });
          response = res.data as Data;
          localStorage.setItem(
            `Accuracy-${UserHandle.userHandle.userHandle}`,
            JSON.stringify(response)
          );
          setUserData(response.tag_wise);
          setSummery(response.gpt_guide);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data.");
      }
    };
    if (UserHandle.userHandle.userHandle) {
      fetchData();
    }
  }, [UserHandle.userHandle.userHandle]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!UserHandle) {
    return <div>no user handle</div>;
  }
  if (loading || !data) {
    return (
      <div className="p-6 w-full bg-gray-50 rounded-xl shadow-lg space-y-6 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wrong Tag Frequency Skeleton */}
          <div className="bg-slate-300 rounded-lg shadow-md p-6 h-96">
            <div className="h-6 bg-gray-400 rounded w-1/2 mb-4"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Guidance Skeleton */}
          <div className="bg-white p-6 rounded-lg shadow-md h-96">
            <div className="h-6 bg-gray-400 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {" "}
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 bg-gray-300 rounded w-full"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border-t-2 border-orange-300 rounded-xl space-y-6 hover:shadow-2xl transition-shadow duration-300 ">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Your Performance Insights
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wrong Tag Frequency Section */}
        <div className=" bg-slate-400 rounded-lg p-6 h-96 overflow-y-auto hide-scrollbar">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Frequency of Wrong Topics
          </h2>
          <div className="space-y-4 font-mono">
            {data &&
              Object.entries(data)
                .filter(([key, value]) => value > 0)
                .sort(([, valueA], [, valueB]) => valueB - valueA)
                .map(([key, value], index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <span className="text-gray-700 font-medium">{key}</span>
                    <span className="bg-slate-100 text-slate-900 font-bold px-3 py-1 rounded-md text-sm">
                      {value}
                    </span>
                  </div>
                ))}
          </div>
        </div>

        {/* Personalized Guidance Section */}
        <div className="bg-neutral-50 p-6 rounded-lg hover:shadow-2xl transition-shadow duration-300 h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold font-serif text-gray-800 mb-4">
            Personalized Guidance
          </h2>
          <div className="text-gray-700 font-serif leading-relaxed space-y-4">
            {summary.split("\n").map((line, index) => {
              // Remove manually written numbers (e.g., "1. " or "2. ")
              const formattedLine = line.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, (_, text) => {
                return `<strong>${text}</strong>`;
              });

              // Handle list items
              if (line.startsWith("- ")) {
                return (
                  <li
                    key={index}
                    className="list-disc ml-6"
                    dangerouslySetInnerHTML={{ __html: formattedLine }}
                  />
                );
              }

              // Handle numbered list
              if (/^\d+\.\s/.test(line)) {
                return (
                  <li
                    key={index}
                    className="list-decimal ml-6"
                    dangerouslySetInnerHTML={{ __html: formattedLine }}
                  />
                );
              }

              // Handle links
              if (line.includes("[") && line.includes("]") && line.includes("(") && line.includes(")")) {
                const textMatch = line.match(/\[.*?\]/);
                const urlMatch = line.match(/\(.*?\)/);
                const text = textMatch ? textMatch[0].slice(1, -1) : "";
                const url = urlMatch ? urlMatch[0].slice(1, -1) : "";

                return (
                  <p key={index}>
                    <a
                      href={url}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {text}
                    </a>
                  </p>
                );
              }

              // Render normal paragraphs
              if (line.trim()) {
                return (
                  <p
                    key={index}
                    dangerouslySetInnerHTML={{ __html: formattedLine }}
                  />
                );
              }

              return null;
            })}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDisplay;
