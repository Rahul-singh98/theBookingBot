import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../UI/card";
import { PrometheusAPI } from "@/api/analytics";
import ReactApexChart from "react-apexcharts";
import { TIME_RANGES } from "@/utils/time_ranges";

const TrafficStackChart = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    series: [],
    categories: [],
  });
  const [resolution, setResolution] = useState(TIME_RANGES.HOUR);
  const [createdBy, setCreatedBy] = useState(null);

  useEffect(() => {
    const loadTrafficData = async () => {
      setLoading(true);
      try {
        const data = await PrometheusAPI.getChatbotTraffic(
          resolution,
          createdBy
        );

        // Transform data into series and categories
        const categories = [];
        const seriesMap = {};

        data.forEach(({ chatbot_id, data }) => {
          data.forEach(({ timestamp, traffic }) => {
            const date = new Date(timestamp * 1000).toLocaleDateString();
            if (!categories.includes(date)) categories.push(date);
            if (!seriesMap[chatbot_id]) seriesMap[chatbot_id] = {};
            seriesMap[chatbot_id][date] = traffic;
          });
        });

        // Create series array for ApexCharts
        const series = Object.keys(seriesMap).map((chatbot_id) => ({
          name: chatbot_id,
          data: categories.map((date) => seriesMap[chatbot_id][date] || 0),
        }));

        setChartData({ series, categories });
      } catch (error) {
        console.error("Error fetching active chatbots:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrafficData();
  }, [resolution, createdBy]);

  const options = {
    chart: {
      type: "bar",
      stacked: true,
      fontFamily: "Satoshi, sans-serif",
    },
    colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF"],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 3,
      },
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Date",
      },
    },
    yaxis: {
      title: {
        text: "Traffic Count",
      },
    },
    legend: {
      position: "top",
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Visitors Analytics</CardTitle>
            </div>
            <div className="inline-flex items-center rounded-md bg-whiter p-1.5">
              <select
                value={resolution}
                onChange={(e) =>
                  setResolution(TIME_RANGES[e.target.value.toUpperCase()])
                }
                className="rounded py-1 px-3 text-xs font-medium text-black hover:shadow-card dark:text-white dark:hover:bg-boxdark appearance-none bg-transparent outline-none"
              >
                <option value="hour">Hourly</option>
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ReactApexChart
            options={options}
            series={chartData.series}
            type="bar"
            height={350}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default TrafficStackChart;
