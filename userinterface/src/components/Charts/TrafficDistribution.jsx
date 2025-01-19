import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../UI/card";
import { PrometheusAPI } from "@/api/analytics";
import ReactApexChart from "react-apexcharts";

const TrafficDistribution = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    series: [],
    categories: [],
  });

  useEffect(() => {
    const fetchTrafficDistribution = async () => {
      setLoading(true);
      try {
        const response = await PrometheusAPI.getChatbotTrafficByBots();

        // Process the data into categories and series
        const categories = [];
        const seriesMap = {};

        response.forEach(({ timestamp, value, bot_author, bot_id }) => {
          const ts = new Date(timestamp * 1000).toLocaleDateString();

          if (!categories.includes(ts)) {
            categories.push(ts);
          }

          if (!seriesMap[bot_id]) {
            seriesMap[bot_id] = {};
          }

          seriesMap[bot_id][ts] = value;
        });

        // Create series array for ApexCharts
        const series = Object.keys(seriesMap).map((bot_id) => ({
          name: bot_id,
          data: categories.map((date) => seriesMap[bot_id][date] || 0),
        }));

        setChartData({ series, categories });
      } catch (error) {
        console.error("Error fetching traffic distribution:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrafficDistribution();
  }, []);

  // Chart options
  const TrafficOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Satoshi, sans-serif",
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "95%",
        distributed: false,
        // horizontal: true
      },
    },
    colors: ["#3C50E0"],
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    dataLabels: { enabled: true },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Distribution by Bot</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ReactApexChart
            options={TrafficOptions}
            series={chartData.series}
            type="bar"
            height={350}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TrafficDistribution;
