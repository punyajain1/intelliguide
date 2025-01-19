"use client";

import * as React from "react";
import { Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function Pie_Chart({
  data,
  guidance,
}: {
  data: { name: string; solved: number }[] | undefined;
  guidance: string | null;
}) {
  const languageData = {
    data: data,
    guidance: guidance,
  };

  // const colors = [
  // "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300",
  // "#DAF7A6", "#581845", "#C70039", "#900C3F", "#1ABC9C",
  // "#2ECC71", "#3498DB", "#9B59B6", "#34495E", "#16A085",
  // "#27AE60", "#2980B9", "#8E44AD", "#2C3E50", "#F39C12",
  // "#E74C3C", "#D35400", "#7D3C98", "#BDC3C7", "#273746"
  // ];
  // const colors = [
  // "#A4C3B2", "#D4A5A5", "#E5C3C6", "#9EB3C2", "#C5CBE3",
  // "#B5EAD7", "#C7DAD8", "#D8E2DC", "#ECE4DB", "#FFE5D9",
  // "#B3C6C7", "#BAC7A7", "#E9D8A6", "#F4A261", "#9D8189",
  // "#A7BED3", "#B8E1DD", "#DAE8F5", "#EDE4E4", "#C9CCD5",
  // "#A2D2FF", "#BDE0FE", "#FFC8DD", "#FFAFCC", "#D8BFD8"
  // ];
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300", 
    "#DAF7A6", "#581845", "#C70039", "#900C3F", "#1ABC9C",
    "#2ECC71", "#3498DB", "#9B59B6", "#34495E", "#16A085", 
    "#27AE60", "#2980B9", "#8E44AD", "#2C3E50", "#F39C12", 
    "#E74C3C", "#D35400", "#7D3C98", "#BDC3C7", "#273746",
  ];
  const chartData = languageData.data
    ? Object.entries(languageData.data)
      .sort((a, b) => b[1].solved - a[1].solved)
      .map(([name, solved], index) => ({
        name,
        solved,
        fill: colors[index % colors.length],
      }))
    : [];

  const chartConfig: { [key: string]: { label: string; color?: string } } = {
    questions: {
      label: "Questions",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  let totalSolved = 0;

  chartData.forEach((language, index) => {
    totalSolved += language.solved.solved;
    chartConfig[language.name] = {
      label: language.name,
      color: colors[index % colors.length],
    };
  });

  return (
    <div className="flex flex-col lg:flex-row bg-white border-t-2 border-orange-300 rounded-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1 duration-300 gap-6 p-6 text-xl mt-4  w-full max-w-full">
      {/* Guidance Section */}
      <div className="flex-1 flex flex-col justify-center order-3 lg:order-1">
        <div className="font-serif bg-neutral-50 hover:shadow-2xl transition-shadow duration-300 rounded-lg p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Feedback on Performance
          </h2>
          <div className="text-sm md:text-base text-gray-700 leading-relaxed space-y-4">
            {languageData?.guidance?.split("\n").map((line, index) => {
              // Handle links in bullet points
              if (line.startsWith("- [") && /\[.*?\]\(.*?\)/.test(line)) {
                const linkRegex = /\[(.*?)\]\((.*?)\)/; // Match [text](url)
                const match = line.match(linkRegex);

                if (match) {
                  const text = match[1]; // Extract link text
                  const url = match[2]; // Extract URL
                  return (
                    <li key={index} className="list-disc ml-6">
                      <a
                        href={url}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {text}
                      </a>
                    </li>
                  );
                }
              }

              // Handle bullet points with bold text
              if (line.startsWith("- ")) {
                const formattedLine = line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                return (
                  <li
                    key={index}
                    className="list-disc ml-6"
                    dangerouslySetInnerHTML={{ __html: formattedLine }}
                  />
                );
              }

              // Handle bold text in regular lines
              if (/\*\*(.*?)\*\*/.test(line)) {
                const formattedLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                return (
                  <p
                    key={index}
                    dangerouslySetInnerHTML={{ __html: formattedLine }}
                  />
                );
              }

              // Render normal paragraphs
              return <p key={index}>{line}</p>;
            })}
          </div>

        </div>
      </div>


      {/* Pie Chart Section */}
      <div className="flex flex-col items-center justify-center w-full lg:w-2/5 min-w-0 order-2">

        <div className="text-center font-semibold text-xl">
          Pie Chart - Based on Your Performance
        </div>

        <ChartContainer
          config={chartConfig}
          className="h-72 w-72"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="solved"
              nameKey="name"
              outerRadius={120}
            ></Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex-col items-start text-lg w-full">
          <div className="flex flex-wrap justify-center mt-1 items-center">
            {chartData.map((item, index) => (
              <div
                key={index}
                className="flex justify-center items-center mx-2 mb-2"
              >
                <span
                  className="w-4 h-4 inline-block rounded-full"
                  style={{ backgroundColor: item.fill }}
                ></span>
                <span className="ml-2 text-sm text-gray-700">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
