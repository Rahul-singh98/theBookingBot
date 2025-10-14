import React, { useState, useEffect } from "react";
import { AnalyticsAPI } from "@/api/analytics";
import { Card, CardHeader, CardContent, CardTitle } from "../UI/card";
import { TIME_RANGES } from "@/utils/time_ranges";
import ReactApexChart from "react-apexcharts";

const ActiveChatbotsCount = ({ createdBy = null }) => {
  const [resolution, setResolution] = useState(TIME_RANGES.HOUR);
  const [activeChatbotData, setActiveChatbotData] = useState([]);
  const [loading, setLoading] = useState(true);
  const commonResolutionClass =
    "rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const results = await AnalyticsAPI.getActiveChatbots(resolution, createdBy);

        // Process and format the data
        const formattedData = results
          .map((result) => ({
            x: new Date(result.timestamp * 1000),
            y: result.value,
          }))
          .sort((a, b) => a.x - b.x);

        setActiveChatbotData(formattedData);
      } catch (error) {
        console.error("Error fetching active chatbots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolution]);

  // Active Chatbots Chart Options
  const activeChatbotsOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Satoshi, sans-serif",
      zoom: {
        enabled: true,
        type: "x",
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: ["#3C50E0"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM yyyy",
          day: "dd MMM",
          hour: "HH:mm",
        },
        formatter: function (value, timestamp) {
          return new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: function (value) {
          return Math.round(value);
        },
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm",
      },
      y: {
        formatter: function (value) {
          return Math.round(value);
        },
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const data = activeChatbotData[dataPointIndex];
        return (
          '<div class="p-2">' +
          "<div><strong>Time:</strong> " +
          new Date(data.x).toLocaleString() +
          "</div>" +
          "<div><strong>Count:</strong> " +
          Math.round(data.y) +
          "</div>" +
          (data.name
            ? "<div><strong>Name:</strong> " + data.name + "</div>"
            : "") +
          (data.id ? "<div><strong>ID:</strong> " + data.id + "</div>" : "") +
          "</div>"
        );
      },
    },
  };

  const chartSeries = [
    {
      // name: 'Active Chatbots',
      data: activeChatbotData.map((item) => ({
        x: item.x,
        y: item.y,
      })),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Active Chatbots</CardTitle>
            </div>
            <div className="inline-flex items-center rounded-md bg-whiter dark:bg-boxdark p-1.5">
              <button
                className={`${commonResolutionClass} ${resolution === TIME_RANGES.HOUR ? "bg-white dark:bg-slate-900 shadow-card" : ""}`}
                onClick={() => setResolution(TIME_RANGES.HOUR)}
              >
                Hour
              </button>
              <button
                className={`${commonResolutionClass} ${resolution === TIME_RANGES.DAY ? "bg-white dark:bg-slate-900 shadow-card" : ""}`}
                onClick={() => setResolution(TIME_RANGES.DAY)}
              >
                Day
              </button>
              <button
                className={`${commonResolutionClass} ${resolution === TIME_RANGES.WEEK ? "bg-white dark:bg-slate-900 shadow-card" : ""}`}
                onClick={() => setResolution(TIME_RANGES.WEEK)}
              >
                Week
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <>Loading...</>
          ) : (
            <ReactApexChart
              options={activeChatbotsOptions}
              series={chartSeries}
              type="area"
              height={350}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ActiveChatbotsCount;
