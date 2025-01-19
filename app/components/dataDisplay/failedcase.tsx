import React, { useState, useEffect } from "react";
import axios  from "axios";
import { Pie_Chart } from "./chart/chart-pie-donut-text";
import { BACKEND_URL } from "../../key";

interface Data {
  data: { name: string; solved: number }[];
  gpt_review: string;
}



export function Verdict({ userHandle }: { userHandle: { userHandle: string } }) {
  let [data, setUserData] = useState<{ name: string; solved: number }[]>();
  let [guidance, setGuidance] = useState<string | null>(null);
  let [error, setError] = useState<string | null>(null);
  let [loading, setLoading] = useState<boolean>(true);
  if (!userHandle) {
    return <div> No user handle </div>;
  }
  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem(
          `Verdict-${userHandle.userHandle}`
        );
        if (storedData) {
          const localdata = JSON.parse(storedData);
          setUserData(localdata.data);
          setGuidance(localdata.gpt_review);
          setLoading(false);
          return;
        }
        try {
          const res = await axios.post(`${BACKEND_URL}/verdict`, {
            userhandle: userHandle.userHandle,
          })as { data: Data };
          const responseData = res.data;
          if (responseData && responseData.data) {
            localStorage.setItem(
              `Verdict-${userHandle.userHandle}`,
              JSON.stringify(responseData)
            );        
            setUserData(responseData.data);
            setGuidance(responseData.gpt_review);
          } else {
            console.error("No data found in the response.");
            setError("Failed to fetch verdict data.");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("An error occurred while fetching data.");
        } finally {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data.");
      }
    };
    fetchData();
  }, [userHandle]);
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  if (loading || !data) {
    return (
      <div className="flex flex-col md:flex-row bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 space-y-6 md:space-y-0 md:space-x-8">
        {/* Guidance Section */}
        <div className="flex-1 flex flex-col justify-center bg-gray-100 rounded-lg p-6 shadow-inner">
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            {/* Placeholder for guidance text */}
          </p>
        </div>

        {/* Pie Chart Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex-1 pb-0">
            <div className="mx-auto aspect-square max-h-[250px]">
              {/* Placeholder for PieChart */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="10"
                />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-gray-700 font-bold text-lg"
                ></text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="text-5xl text-center m-2 font-serif font-bold text-[#c9b57a]">Insights On Failed Case</div>
      <Pie_Chart data={data} guidance={guidance} />
    </div>
  );
}

export default Verdict;
