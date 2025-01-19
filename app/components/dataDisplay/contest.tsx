import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../key";

interface ContestResult {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

interface ContestResults {
  result: ContestResult[];
}


export const ContestDisplay = (UserHandle: {
  userHandle: { userHandle: string };
}) => {
  const [summary, setSummery] = useState<string | null>(null);
  const [data, setUserData] = useState<ContestResults>({ result: [] });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedData = localStorage.getItem(
          `Contest-${UserHandle.userHandle.userHandle}`
        );
        if (storedData) {
          const data = JSON.parse(storedData);
          setSummery(data.summary);
          setUserData({ result: data.result });
          setLoading(false);
          return;
        }
        let response: { data: { result: ContestResult[], summary: string } } | undefined;
        try {
          response = await axios.post(`${BACKEND_URL}/rating`, {
            userhandle: UserHandle.userHandle.userHandle,
          });
          if (response && response.data) {
            localStorage.setItem(
              `Contest-${UserHandle.userHandle.userHandle}`,
              JSON.stringify(response.data)
            );
            setUserData({ result: response.data.result });
            setSummery(response.data.summary);
          } else {
            console.error("No data received from API");
            setError("Failed to fetch user data.");
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
      <div className="p-5 mb-6 bg-gray-50 animate-pulse">
        <div className="flex">
          <div className="overflow-y-auto h-96 w-2/3">
            <div className="h-6 bg-gray-300 rounded mb-6 w-1/4"></div>
            <div className="space-y-4">
              <div className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center bg-gray-100 py-3 px-4">
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="flex-1 h-5 bg-gray-300 rounded mx-2"
                      ></div>
                    ))}
                </div>
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center py-3 px-4 border-b border-gray-300"
                    >
                      {Array(6)
                        .fill(0)
                        .map((_, subIndex) => (
                          <div
                            key={subIndex}
                            className="flex-1 h-5 bg-gray-300 rounded mx-2"
                          ></div>
                        ))}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="w-1/3 p-4">
            <div className="h-6 bg-gray-300 rounded mb-6 w-1/3"></div>
            <div className="w-full pt-2 overflow-y-auto bg-gray-100 text-sm p-4 border border-gray-300 rounded-lg shadow-md space-y-3">
              {Array(6)
                .fill(0)
                .map((_, index) => (
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
    <div className="p-4 sm:p-8 mb-6 mx-4 sm:mx-12 rounded-xl bg-white border-t-2 border-orange-300 text-black hover:shadow-2xl transition-transform transform hover:-translate-y-1 duration-300 overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-center">
        {/* Left Section */}
        <div className="overflow-y-auto h-96 w-full lg:w-2/3 hide-scrollbar">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-serif mb-6 text-black text-center lg:text-left">
            Contest History
          </h2>
          <div>
            <div className="space-y-4">
              <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
                <div className="flex items-center py-3 px-4 text-[#c7a17e]">
                  <div className="flex-1 text-left font-bold">
                    Contest
                  </div>
                  <div className="hidden md:block flex-1 text-center font-bold">
                    Date
                  </div>
                  <div className="flex-1 text-center font-bold">
                    Rank
                  </div>
                  <div className="hidden md:block flex-1 text-center font-bold">
                    Old Rating
                  </div>
                  <div className="flex-1 text-center font-bold">
                    Rating Change
                  </div>
                  <div className=" flex-1 text-center font-bold">
                    New Rating
                  </div>
                </div>
                <hr className="w-full bg-gray-300" />
                {data?.result.slice().reverse().map((contest: ContestResult) => (
                  <div
                  key={contest.contestId}
                    className="flex flex-wrap text-xs md:text-lg items-center py-3 px-4 border-b border-gray-300 text-slate-700"
                  >
                    <div className="flex-1 text-left">
                      {contest.contestName}
                    </div>
                    <div className="hidden md:block flex-1 text-center">
                      {new Date(
                        contest.ratingUpdateTimeSeconds * 1000
                      ).toLocaleDateString()}
                    </div>
                    <div className="flex-1 text-center">{contest.rank}</div>
                    <div className="hidden md:block flex-1 text-center">
                      {contest.oldRating}
                    </div>
                    <div
                      className={`flex-1 text-center ${contest.newRating - contest.oldRating < 0
                          ? "text-red-500"
                          : "text-green-500"
                        }`}
                    >
                      {contest.newRating - contest.oldRating}
                    </div>
                    <div className="flex-1 text-center">
                      {contest.newRating}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:pl-6">
          <h1 className="text-2xl font-bold mb-6 text-[#c7a17e] font-serif text-center lg:text-left">
            Summary of your progress:
          </h1>
          <div className="w-full lg:h-80 overflow-y-auto bg-neutral-50 text-sm md:text-lg text-slate-700 p-4 border border-gray-300 rounded-lg hover:shadow-2xl transition-shadow duration-300">
            {summary}
          </div>
        </div>
      </div>
    </div>

  );
};
