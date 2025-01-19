import CardDataStats from "@/components/CardDataStats";
import LineChart from "@/components/Charts/LineChart";
import PieChart from "@/components/Charts/PieChart";
import StackChart from "@/components/Charts/StackChart";
import { useEffect, useState } from "react";
import { PrometheusAPI } from "@/api/analytics";
import { get_pct } from "@/utils/analytics";
import { TIME_RANGES } from "@/utils/time_ranges";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/UI/card";
import ReactApexChart from "react-apexcharts";
import ActiveChatbotsCount from "@/components/Charts/ActiveChatbotsCount";
import TrafficStackChart from "@/components/Charts/TrafficeStackChart";
import CardBar from "@/components/UI/CardBar";
import ChatbotsTraffic from "@/components/Charts/ChatbotsTraffic";
import TrafficDistribution from "@/components/Charts/TrafficDistribution";

const AdminDashboard = () => {
  // Traffic Analysis Chart Options
  const trafficOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: { show: false },
      fontFamily: "Satoshi, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 2,
      },
    },
    colors: ["#3C50E0", "#80CAEE", "#6577F3"],
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    dataLabels: { enabled: false },
  };

  // Questions Distribution Donut Options
  const questionsOptions = {
    chart: {
      type: "donut",
      fontFamily: "Satoshi, sans-serif",
    },
    // colors: ["#3C50E0", "#80CAEE", "#6577F3", "#8FD0EF"],
    labels: ["Product", "Shipping", "Returns", "Payment"],
    legend: {
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
        },
      },
    },
  };

  // Booking Amount Histogram Options
  const bookingOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Satoshi, sans-serif",
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: "60%",
      },
    },
    colors: ["#3C50E0"],
    xaxis: {
      categories: ["0-50", "51-100", "101-200", "201-500", "501+"],
    },
    dataLabels: { enabled: false },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <CardBar />

      {/* Active Chatbots */}
      <ActiveChatbotsCount />

      {/* Traffic Analysis */}
      <ChatbotsTraffic />
      {/* <TrafficStackChart /> */}

      <TrafficDistribution />

      {/* <Card>
        <CardHeader>
          <CardTitle>Traffic by Chatbot</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactApexChart
            options={trafficOptions}
            series={[
              {
                name: "Chatbot 1",
                data: [44, 55, 41, 67, 22, 43, 21],
              },
              {
                name: "Chatbot 2",
                data: [13, 23, 20, 8, 13, 27, 33],
              },
              {
                name: "Chatbot 3",
                data: [11, 17, 15, 15, 21, 14, 15],
              },
            ]}
            type="bar"
            height={350}
          />
        </CardContent>
      </Card> */}

      {/* Questions Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic by users</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactApexChart
            options={questionsOptions}
            series={[44, 55, 13, 33]}
            type="donut"
            height={350}
          />
        </CardContent>
      </Card>

      {/* Booking Amount Distribution */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Booking Amount Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactApexChart
            options={bookingOptions}
            series={[
              {
                name: "Bookings",
                data: [100, 200, 150, 80, 30],
              },
            ]}
            type="bar"
            height={350}
          />
        </CardContent>
      </Card> */}
    </div>
  );
};

export default AdminDashboard;
