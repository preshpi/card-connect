"use client";

import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { Eye, MousePointer2, Link2, Share2, Filter } from "lucide-react";

// Mock Data
const MOCK_DATA = {
  views: {
    total: 12450,
    data: [
      35, 35, 28, 40, 50, 22, 35, 35, 55, 35, 35, 45, 30, 15, 22, 24, 33, 35,
      40, 40, 40, 37, 37,
    ],
    color: "#6366f1",
  },
  clicks: {
    total: 850,
    data: [
      10, 15, 12, 20, 25, 15, 20, 25, 30, 18, 22, 28, 20, 12, 18, 22, 25, 28,
      30, 25, 20, 15, 12,
    ],
    color: "#3b82f6",
  },
  shares: {
    total: 240,
    data: [
      5, 8, 5, 12, 15, 8, 10, 12, 18, 12, 15, 10, 8, 5, 8, 10, 12, 15, 12, 10,
      8, 5, 5,
    ],
    color: "#10b981",
  },
};

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("views");
  const [timeFilter, setTimeFilter] = useState("Daily");
  const currentData = MOCK_DATA[activeTab];

  const option = useMemo(() => {
    return {
      grid: {
        top: 30,
        right: 10, // Tighter margins for mobile
        bottom: 20,
        left: 30,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 10,
        textStyle: { color: "#374151", fontSize: 14 },
        formatter: (params) => {
          const item = params[0];
          return `
            <div class="font-bold text-gray-900 text-lg mb-1 leading-tight">
              ${item.value} <span class="text-gray-500 text-sm font-normal capitalize">${activeTab}</span>
            </div>
            <div class="text-gray-400 text-xs">
              Fri, 14 Nov 2025
            </div>
          `;
        },
        axisPointer: {
          type: "line",
          lineStyle: { color: currentData.color, width: 1 },
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#9ca3af", margin: 15, fontSize: 11 },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#f3f4f6" } },
        axisLabel: { color: "#9ca3af", fontSize: 11 },
        min: 0,
      },
      series: [
        {
          name: activeTab,
          type: "line",
          smooth: false,
          showSymbol: false,
          symbolSize: 8,
          lineStyle: { width: 2, color: currentData.color },
          areaStyle: {
            opacity: 0.2,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: currentData.color },
              { offset: 1, color: "rgba(255, 255, 255, 0)" },
            ]),
          },
          emphasis: {
            focus: "series",
            itemStyle: {
              color: currentData.color,
              borderColor: "#fff",
              borderWidth: 2,
              shadowBlur: 6,
              shadowColor: "rgba(0,0,0,0.2)",
            },
          },
          data: currentData.data,
        },
      ],
    };
  }, [activeTab, currentData]);

  return (
    <div className="min-h-screen text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 md:mb-8 pt-8">
        <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
        <button className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Filter <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:mx-0 md:px-0 md:pb-0 scrollbar-hide snap-x">
        <StatsCard
          label="Views"
          value="0"
          icon={<Eye className="w-5 h-5 text-gray-600" />}
        />
        <StatsCard
          label="Clicks"
          value="0"
          icon={<MousePointer2 className="w-5 h-5 text-gray-600" />}
        />
        <StatsCard
          label="Top performing"
          value="0%"
          icon={<Link2 className="w-5 h-5 text-gray-600" />}
        />
        <StatsCard
          label="Most shared"
          value="0%"
          icon={<Share2 className="w-5 h-5 text-gray-600" />}
        />
      </div>

      {/* Main Activity Chart Section */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 mt-8">
        {/* Activity Header - Stacked on Mobile */}
        <div className="flex flex-col md:flex-row justify-between mb-6 md:mb-8 gap-4 md:items-start">
          {/* Title and Data Tabs */}
          <div className="flex flex-col gap-4 md:gap-4">
            <h2 className="text-lg font-bold">Activity</h2>

            {/* Chart Tabs (Views / Clicks / Share) */}
            <div className="flex gap-6 border-b border-gray-100 md:border-transparent w-full md:w-auto">
              {["views", "clicks", "shares"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 md:pb-1 text-sm font-medium capitalize transition-all border-b-2 ${
                    activeTab === tab
                      ? "text-gray-900 border-gray-900"
                      : "text-gray-400 border-transparent hover:text-gray-600"
                  }`}
                >
                  {tab === "shares"
                    ? "Share"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Time Filter Tabs - Full width on mobile, right aligned on desktop */}
          {/* Matches the 'Daily' 'Weekly' row in the second screenshot */}
          <div className="flex gap-2 overflow-x-auto md:bg-gray-50 md:p-1 md:rounded-lg md:border md:border-gray-100 no-scrollbar">
            {["Daily", "Weekly", "Monthly", "Yearly"].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`
                  px-4 py-2 md:py-1.5 text-xs font-medium rounded-lg border md:border-none transition-all whitespace-nowrap flex-1 md:flex-none
                  ${
                    timeFilter === filter
                      ? "bg-[#6366f1] text-white border-[#6366f1] shadow-sm"
                      : "bg-white md:bg-transparent text-gray-600 border-gray-200 hover:bg-gray-50 md:hover:bg-gray-200"
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* ECharts Instance */}
        {/* Adjusted height for mobile to fit screen better */}
        <div className="w-full h-[300px] md:h-[400px]">
          <ReactECharts
            option={option}
            style={{ height: "100%", width: "100%" }}
            notMerge={true}
          />
        </div>
      </div>
    </div>
  );
};

// Updated Stats Card for Mobile Snap
const StatsCard = ({ label, value, icon }) => (
  <div
    className="
    min-w-[85%] md:min-w-0 snap-center 
    bg-white p-5 md:p-6 rounded-2xl border border-gray-100 
    flex flex-col justify-between h-28 md:h-32
  "
  >
    <div className="flex justify-between items-start">
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className="flex justify-between items-end">
      <span className="text-gray-500 text-sm font-medium truncate pr-2">
        {label}
      </span>
      <div className="p-2 bg-gray-100 rounded-lg shrink-0">{icon}</div>
    </div>
  </div>
);

export default Analytics;
