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
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  console.log(user)
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {user.scopes === "SuperAdmin" ? <CardBar /> : <></>}

      {/* Active Chatbots */}
      <ActiveChatbotsCount
        createdBy={user.scopes === "Organization" ? user.user_id : null}
      />

      {/* Traffic Analysis */}
      <ChatbotsTraffic
        createdBy={user.scopes === "Organization" ? user.user_id : null}
      />
      {/* <TrafficStackChart /> */}

      <TrafficDistribution
        createdBy={user.scopes === "Organization" ? user.user_id : null}
      />

      {/* Questions Distribution */}
      {/* <Card>
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
      </Card> */}
    </div>
  );
};

export default Dashboard;
