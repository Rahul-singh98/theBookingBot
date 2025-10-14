import CardDataStats from "@/components/CardDataStats";
import LineChart from "@/components/Charts/LineChart";
import PieChart from "@/components/Charts/PieChart";
import StackChart from "@/components/Charts/StackChart";
import { useEffect, useState } from "react";
import { AnalyticsAPI } from "@/api/analytics";
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
  const [regionalSeries, setRegionalSeries] = useState({
    labels: [],
    series: [],
  });
  const [subadminSeries, setSubadminSeries] = useState({
    categories: [],
    series: [],
  });

  useEffect(() => {
    let mounted = true;
    const loadExtras = async () => {
      try {
        const [regional, payments, quotes] = await Promise.all([
          AnalyticsAPI.getRegionalSessions(),
          AnalyticsAPI.getPaymentsBySubadmin(),
          AnalyticsAPI.getQuotesBySubadmin(),
        ]);

        if (!mounted) return;

        // regional pie
        const rLabels = regional.map((r) => r.region || "unknown");
        const rSeries = regional.map((r) => r.value || 0);
        setRegionalSeries({ labels: rLabels, series: rSeries });

        // subadmin stacked: create categories (subadmin ids)
        const ids = Array.from(
          new Set([
            ...payments.map((p) => p.v_id),
            ...quotes.map((q) => q.v_id),
          ])
        );
        const paymentsMap = Object.fromEntries(
          payments.map((p) => [p.v_id, p.value])
        );
        const quotesMap = Object.fromEntries(
          quotes.map((q) => [q.v_id, q.value])
        );

        const paymentsSeries = ids.map((id) => paymentsMap[id] || 0);
        const quotesSeries = ids.map((id) => quotesMap[id] || 0);

        setSubadminSeries({
          categories: ids,
          series: [
            { name: "Payments", data: paymentsSeries },
            { name: "Quotes", data: quotesSeries },
          ],
        });
      } catch (err) {
        console.error("Error loading additional metrics", err);
      }
    };
    loadExtras();
    return () => (mounted = false);
  }, []);
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
      <Card>
        <CardHeader>
          <CardTitle>Regional Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactApexChart
            options={{
              labels: regionalSeries.labels,
              noData: { text: "No regional data available" },
            }}
            series={regionalSeries.series}
            type="donut"
            height={300}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SubAdmin: Payments / Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactApexChart
            options={{
              chart: { type: "bar", stacked: true },
              xaxis: { categories: subadminSeries.categories },
              noData: { text: "No subadmin metrics available" },
            }}
            series={subadminSeries.series}
            type="bar"
            height={300}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
