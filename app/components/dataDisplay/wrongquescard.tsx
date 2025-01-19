import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../key";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClickIcon } from "../icons/click";

interface BackendResponse {
  wrong: Record<
    string,
    {
      tags: string[];
      contestId: number;
      index: string;
    }
  >;
}

const WrongProblemsCard = ({ userHandle }: {
  userHandle: { userHandle: string };
}) => {
  const [wrongData, setWrongData] = useState<
    Record<
      string,
      {
        tags: string[];
        contestId: number;
        index: string;
      }
    > | null
  >(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const storedData = localStorage.getItem(
          `WrongData-${userHandle.userHandle}`
        );

        if (storedData) {
          setWrongData(JSON.parse(storedData));
          setLoading(false);
          return;
        }

        const response = await axios.post<BackendResponse>(
          `${BACKEND_URL}/contest`,
          { userhandle: userHandle.userHandle }
        );

        if (response.data) {
          setWrongData(response.data.wrong);
          localStorage.setItem(
            `WrongData-${userHandle.userHandle}`,
            JSON.stringify(response.data.wrong)
          );
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch user data.");
      }
    };

    if (userHandle.userHandle) {
      fetchData();
    }
  }, [userHandle.userHandle]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (loading || !wrongData) {
    return (
      <div className="overflow-y-auto h-80 mb-11">
        <div className="m-2">
          {/* Skeleton UI */}
          <div className="mb-4 h-10 bg-gray-300 rounded-md animate-pulse"></div>
          <div className="h-4 w-1/3 bg-gray-300 rounded-md mb-4 animate-pulse"></div>
          <div>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center mb-2 space-x-4 animate-pulse"
              >
                <div className="w-[250px] h-6 bg-gray-300 rounded-md"></div>
                <div className="flex-1 h-6 bg-gray-300 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex justify-center items-center gap-8 lg:gap-16 mx-4 lg:mx-10 p-4 lg:p-8 ">
      <div>
        <h1 className="text-4xl lg:text-5xl col-span-1 col-start-1 text-[#c9b57a] font-semibold font-serif leading-[1.25]">
          Unsolved Questions
        </h1>
        <h6 className="text-gray-500 text-xs pt-3 pb-3">
          (Include TLE,RUNTIME_ERROR , SKIPPED ,etc)
        </h6>
      </div>
      <div className="h-96 mb-11 bg-white border-t-2 border-orange-300 rounded-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 duration-300">
        <WrongQuestionsCard wrongData={wrongData} />
      </div>
    </div>
  );
};

export default WrongProblemsCard;

interface WrongQuestionsCardProps {
  wrongData: Record<
    string,
    {
      tags: string[];
      contestId: number;
      index: string;
    }
  >;
}

const WrongQuestionsCard = ({ wrongData }: WrongQuestionsCardProps) => {
  const [filter, setFilter] = useState<string>("");

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const handleTagClick = (tag: string) => {
    setFilter((prevFilter) => (prevFilter === tag ? "" : tag));
  };

  // Filter logic
  const filteredData = Object.entries(wrongData).filter(
    ([, details]) =>
      !filter || details.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase()))
  );

  // Extract unique tags
  const uniqueTags = Array.from(
    new Set(
      Object.values(wrongData)
        .flatMap((details) => details.tags)
    )
  );
  uniqueTags.sort();

  return (
    <div className="overflow-y-auto hide-scrollbar h-96 mb-11">
      <div className="m-3">
        {/* Filter Input */}
        {/* <Input
          placeholder="Filter by tags..."
          value={filter}
          onChange={handleFilterChange}
          className="mb-4 block md:hidden"
        /> */}

        {/* Tag Buttons */}
        {/* <div className="flex flex-wrap gap-2 mb-4">
          {uniqueTags.map((tag, index) => (
            <Button
              key={index}
              onClick={() => handleTagClick(tag)}
              className={`px-2 py-1 text-sm rounded-full ${filter === tag
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
            >
              {tag}
            </Button>
          ))}
        </div> */}

        <div className="flex flex-wrap gap-2 mb-4 overflow-y-auto hide-scrollbar max-h-[100px]">
          {uniqueTags.map((tag, index) => (
            <Button
              key={index}
              onClick={() => handleTagClick(tag)}
              className={`px-2 py-1 text-sm rounded-full ${filter === tag
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableCaption className="text-sm">A list of your unsolved questions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="max-w-[250px] flex items-center">
                  Problem <ClickIcon />
                </TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map(([problem, details]) => (
                  <TableRow key={problem}>
                    <TableCell className="font-medium">
                      <a
                        href={`https://codeforces.com/problemset/problem/${details.contestId}/${details.index}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 hover:underline flex w-full"
                      >
                        {problem}
                      </a>
                    </TableCell>
                    <TableCell className="break-words">{details.tags.join(", ")}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No matching problems found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>

  );
};
