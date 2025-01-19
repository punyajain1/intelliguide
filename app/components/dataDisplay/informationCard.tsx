"use client";
import axios from "axios";
import { useEffect, useState } from "react";
require("dotenv").config();
import { BACKEND_URL } from "../../key";

export function Infocard({
  userHandle,
}: {
  userHandle: { userHandle: string };
}) {
  interface UserData {
    summary: string;
    user_info: {
      firstName: string;
      lastName: string;
      maxRank: string;
      maxRating: number;
      titlePhoto: string;
      email: string;
      handle: string;
      rank: string;
      rating: number;
      city: string;
      country: string;
      organization: string;
    }[];
    rating_improvement: string;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      if (!userHandle) {
        return;
      }
      try {
        const storedData = localStorage.getItem(
          `userData-${userHandle.userHandle}`
        );
        if (storedData) {
          setUserData(JSON.parse(storedData));
          setLoading(false);
          return;
        }
        const response = await axios.post(`${BACKEND_URL}/userinfo`, {
          userhandle: userHandle.userHandle,
        });
        setUserData(response.data as UserData);

        localStorage.setItem(
          `userData-${userHandle.userHandle}`,
          JSON.stringify(response.data)
        );
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data.");
      }
    };

    if (userHandle) {
      fetchData();
    }
  }, [userHandle.userHandle]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative bg-white text-white p-8 rounded-2xl shadow-lg transition-transform transform hover:-translate-y-1 duration-300 overflow-hidden">
            <h2 className="text-4xl font-bold mb-6 tracking-wide">About You</h2>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent opacity-30 animate-pulse pointer-events-none"></div>
          </div>

          <div className="bg-white text-white p-8 rounded-2xl shadow-lg">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto animate-pulse mb-4"></div>
            <div className="space-y-4 text-center">
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="mt-8 relative bg-white text-white p-8 rounded-2xl shadow-lg transition-transform transform hover:-translate-y-1 duration-300 overflow-hidden">
          <h2 className="text-2xl bg-white rounded w-3/4 mx-auto animate-pulse"></h2>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  const summ = userData?.summary;
  if (userData) {
    return (
      <div className="mx-auto p-6">
        <div className="">
          <div className=" grid grid-cols-1 lg:grid-cols-10 gap-8 relative bg-white border-t-2 border-orange-300 text-black p-8 rounded-2xl  hover:shadow-2xl transition-transform transform hover:-translate-y-1 duration-300 overflow-hidden">
            <div className="lg:col-span-4 xl:col-span-5 order-3 lg:order-1">
              <h2 className="text-xl md:text-4xl font-bold font-serif mb-2 lg:mb-6 relative z-10 tracking-wide">
                About You:
              </h2>
              <div className="relative z-10 space-y-4 sm:text-lg font-sans">{summ}</div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent opacity-30 animate-pulse pointer-events-none"></div>
            </div>
            <div className="bg-[#f3f4f6] rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-center lg:col-span-6 xl:col-span-5 order-2">
              <PORCards
                name={`${userData.user_info[0].firstName} ${userData.user_info[0].lastName}`}
                maxrank={`${userData.user_info[0].maxRank} (${userData.user_info[0].maxRating}) `}
                img={userData.user_info[0].titlePhoto}
                email={userData.user_info[0].email}
                User_Handle={userData.user_info[0].handle}
                minrank={`${userData.user_info[0].rank} (${userData.user_info[0].rating})`}
                state={`${userData.user_info[0].city}, ${userData.user_info[0].country}`}
                organization={userData.user_info[0].organization}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="relative bg-white border-t-2 border-orange-300 text-black p-8 rounded-2xl hover:shadow-2xl transition-transform transform hover:-translate-y-1 duration-300 overflow-hidden">
            {userData.user_info[0].rating >= 2100 ? (
              <div className="text-center text-lg">
                {userData.rating_improvement}
              </div>
            ) : (
              <div>
                <h2 className="text-lg md:text-4xl font-bold font-serif text-center pb-5">
                  Rating Improvement Guide:
                </h2>
                <div className="text:sm md:text-lg font-sans space-y-4">
                  {userData.rating_improvement
                    .split("\n")
                    .map((line, index) => {
                      // Check for bullet points
                      // if (line.startsWith("- ")) {
                      //   return (
                      //     <li key={index} className="list-disc ml-6">
                      //       {line.slice(2)}
                      //     </li>
                      //   );
                      // }
                      // if (line.startsWith("**") && line.endsWith("**")) {
                      //   return (
                      //     <p key={index} className="font-bold">
                      //       {line.slice(2, -2)}
                      //     </p>
                      //   );
                      // }
                      if (line.startsWith("- ")) {
                        // Replace double star quoted text with bold text
                        const formattedLine = line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                        return (
                          <li key={index} className="list-disc ml-6" dangerouslySetInnerHTML={{ __html: formattedLine }} />
                        );
                      }
                      return <p key={index}>{line}</p>;
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <div className="text-gray-500 text-center py-4">No User Found</div>;
  }
}

interface PROCardI {
  name: string;
  maxrank: string;
  img: string;
  email: string;
  User_Handle: string;
  minrank: string;
  state: string;
  organization: string;
}

function PORCards({
  name,
  maxrank,
  img,
  email,
  User_Handle,
  minrank,
  state,
  organization,
}: PROCardI) {
  return (
    <div className="">
      <div className="flex flex-col items-center sm:flex-row gap-6">
        <div className="w-36 h-36 rounded-full overflow-hidden">
          <img
            src={img}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-sm md:text-lg">
          <h4 className="text-2xl font-bold mb-2 text-black">{name}</h4>
          <p className="text-gray-500">{state}</p>
          <p className="text-gray-500">{organization}</p>
          <p className="text-blue-500">Handle: {User_Handle}</p>
          <p className="text-green-600 font-bold">Max Rank: {maxrank}</p>
          <p className="text-yellow-600">Current Rank: {minrank}</p>
          <p className="text-gray-600">{email}</p>
        </div>
      </div>
    </div>
  );
}
