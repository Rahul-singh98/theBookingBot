import axios from "axios";
import { ANALYTICS_API_URL, AnalyticsRoutes } from "./routes";
import { TIME_RANGES } from "@/utils/time_ranges";

// Query builder functions
const buildRangeQuery = (metric, range = TIME_RANGES.DAY) => {
  return `rate(${metric}[${range}])`;
};

const buildHistogramQuery = (metric, range = TIME_RANGES.DAY) => {
  return `histogram_quantile(0.95, sum(rate(${metric}_bucket[${range}])) by (le))`;
};

// Prometheus API service
export const PrometheusAPI = {
  // Base fetch function
  async fetchMetrics(query) {
    try {
      const response = await axios.get(
        `${ANALYTICS_API_URL || ""}${AnalyticsRoutes.BASE}${AnalyticsRoutes.QUERY}`,
        {
          params: { query },
        }
      );
      return response.data.data.result;
    } catch (error) {
      console.error("Error fetching metrics:", error);
      throw error;
    }
  },

  async getCountUtils(query) {
    // Helper function to format numbers
    const formatNumber = (num) => {
      if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B"; // Billions
      if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M"; // Millions
      if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K"; // Thousands
      return num.toString(); // Less than 1,000
    };

    // Construct the Prometheus query_range API URL
    const url = `/api/v1/query?query=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);

      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();

      // Extract and validate the result
      const result = json.data?.result?.[0]?.value?.[1];
      const count = result ? parseFloat(result) : 0;

      // Format the count into human-readable form
      const formattedCount = formatNumber(count);

      // Return the mapped structure
      return { count: formattedCount };
    } catch (error) {
      console.error("Error fetching active chatbots count:", error);
      return { count: "0" };
    }
  },
  // Number of Active Chatbots
  async getNumberOfActiveChatbots(createdBy) {
    // Construct the Prometheus query
    const query = `sum(chatbots_gauge_total${createdBy ? `{bot_author="${createdBy}"}` : ""})`;
    return await this.getCountUtils(query);
  },

  // Total Traffic Processed
  async getTotalTrafficProcessed(createdBy) {
    // Construct the Prometheus query
    const query = `sum(chatbots_traffic_total${createdBy ? `{bot_author="${createdBy}"}` : ""})`;
    return await this.getCountUtils(query);
  },

  // Total Traffic Processed
  async getUniqueVisitors(createdBy) {
    // Construct the Prometheus query
    const query = `count(count by (v_id) (chatbots_traffic_total${createdBy ? `{bot_author="${createdBy}"}` : ""}))`;
    return await this.getCountUtils(query);
  },

  // Active Chatbots
  async getActiveChatbots(range = TIME_RANGES.HOUR, createdBy = null) {
    let query = "increase(sum(chatbots_gauge_total)[5m:])"; // Aggregate active chatbots
    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    let start, step;

    if (createdBy) {
      query = `increase(sum(chatbots_gauge_total${createdBy ? `{bot_author="${createdBy}"}` : ""})[5m:])`;
    }

    // Define the start and step based on the range
    switch (range) {
      case TIME_RANGES.DAY: // Last 20 days
        start = now - 20 * 24 * 60 * 60; // 20 days ago
        step = 24 * 60 * 60; // 1 day intervals
        break;
      case TIME_RANGES.WEEK: // Last 20 weeks
        start = now - 20 * 7 * 24 * 60 * 60; // 20 weeks ago
        step = 7 * 24 * 60 * 60; // 1 week intervals
        break;
      case TIME_RANGES.HOUR: // Last 20 hours
        start = now - 20 * 60 * 60; // 20 hours ago
        step = 60 * 60; // 1 hour intervals
        break;
      default:
        throw new Error(`Unsupported time range: ${range}`);
    }

    // Construct the Prometheus query_range API URL
    const url = `/api/v1/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${now}&step=${step}`;
    // const url = '/api/v1/query_range?query=increase%28sum%28chatbots_gauge_total%29%5B5m%3A%5D%29&step=60&start=1737199548.9865105&end=1737294444.384';

    // Fetch metrics from the Prometheus server
    const response = await fetch(url);
    const json = await response.json();

    // Map the results to the desired structure
    // return json.data.result.map((result) => ({
    //   timestamp: result.values.map((value) => parseFloat(value[0])),
    //   value: result.values.map((value) => parseFloat(value[1])),
    // }));

    return json.data.result[0].values.map((value) => ({
      timestamp: parseFloat(value[0]),
      value: parseFloat(value[1]),
    }));
  },

  // Chatbot Traffic Analysis
  async getChatbotTraffic(range = TIME_RANGES.DAY, createdBy = null) {
    // Base query for traffic
    let query = "increase(sum(chatbots_traffic_total)[5m:])";

    // Filter by created_by if provided
    if (createdBy) {
      query = `increase(sum(chatbots_traffic_total${createdBy ? `{bot_author="${createdBy}"}` : ""})[5m:])`;
    }

    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    let start, step;

    // Define the start and step based on the range
    switch (range) {
      case TIME_RANGES.DAY: // Last 20 days
        start = now - 20 * 24 * 60 * 60; // 20 days ago
        step = 24 * 60 * 60; // 1 day intervals
        break;
      case TIME_RANGES.WEEK: // Last 20 weeks
        start = now - 20 * 7 * 24 * 60 * 60; // 20 weeks ago
        step = 7 * 24 * 60 * 60; // 1 week intervals
        break;
      case TIME_RANGES.HOUR: // Last 20 hours
        start = now - 20 * 60 * 60; // 20 hours ago
        step = 60 * 60; // 1 hour intervals
        break;
      case TIME_RANGES.MONTH: // Last 20 months
        start = now - 20 * 30 * 24 * 60 * 60; // Approx 20 months ago
        step = 30 * 24 * 60 * 60; // 1 month intervals
        break;
      case TIME_RANGES.YEAR: // Last 20 years
        start = now - 20 * 365 * 24 * 60 * 60; // 20 years ago
        step = 365 * 24 * 60 * 60; // 1 year intervals
        break;
      default:
        throw new Error(`Unsupported time range: ${range}`);
    }

    // Construct the Prometheus query_range API URL
    const url = `/api/v1/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${now}&step=${step}`;

    // Fetch metrics from the Prometheus server
    const response = await fetch(url);
    const json = await response.json();

    return json.data.result[0].values.map((value) => ({
      timestamp: parseFloat(value[0]),
      value: parseFloat(value[1]),
    }));

    // Map the results to the desired structure
    // const chatbotData = json.data.result.map((result) => ({
    //   chatbot_id: result.metric.chatbot_id,
    //   data: result.values.map((value) => ({
    //     timestamp: parseFloat(value[0]),
    //     traffic: parseFloat(value[1]),
    //   })),
    // }));

    // Sort chatbots by total traffic (sum of traffic over the period) and pick the top 3
    // const topChatbots = chatbotData
    //   .map((bot) => ({
    //     ...bot,
    //     totalTraffic: bot.data.reduce((sum, point) => sum + point.traffic, 0), // Sum the traffic over the range
    //   }))
    //   .sort((a, b) => b.totalTraffic - a.totalTraffic) // Sort descending by total traffic
    //   .slice(0, 3); // Get top 3

    // Return the top 3 chatbots' traffic data
    // return topChatbots;
  },

  // Chatbot Traffic Analysis by users
  async getChatbotTrafficByBots(createdBy = null) {
    // Base query for traffic
    let query =
      "topk(10, sum by (bot_id, bot_author) (chatbots_traffic_total))";

    if (createdBy) {
      query = `topk(10, sum by (bot_id, bot_author) (chatbots_traffic_total${createdBy ? `{bot_author="${createdBy}"}` : ""}))`;
      // query = `sum(chatbot_traffic_total{chatbot_id=~"${createdBy}.*"}) by (chatbot_id)`;
    }

    // Construct the Prometheus query_range API URL
    const url = `/api/v1/query?query=${encodeURIComponent(query)}`;

    // Fetch metrics from the Prometheus server
    const response = await fetch(url);
    const json = await response.json();

    return json.data.result.map((result) => ({
      timestamp: parseFloat(result.value[0]),
      value: parseFloat(result.value[1]),
      bot_author: result.metric.bot_author,
      bot_id: result.metric.bot_id,
    }));
  },

  // Questions Answered
  async getQuestionsAnswered(range = TIME_RANGES.DAY) {
    const query = buildRangeQuery("chatbot_questions_answered_total", range);
    const results = await this.fetchMetrics(query);

    return results.map((result) => ({
      chatbot_id: result.metric.chatbot_id,
      session_id: result.metric.session_id,
      visitor_id: result.metric.visitor_id,
      rate: parseFloat(result.value[1]),
    }));
  },

  // Completed Payments
  async getCompletedPayments(range = TIME_RANGES.DAY) {
    const query = buildRangeQuery("payment_completed_total", range);
    const results = await this.fetchMetrics(query);

    return results.map((result) => ({
      visitor_id: result.metric.visitor_id,
      session_id: result.metric.session_id,
      rate: parseFloat(result.value[1]),
    }));
  },

  // Booking Amount Distribution
  async getBookingAmountDistribution(range = TIME_RANGES.DAY) {
    const query = buildHistogramQuery("booking_amount", range);
    const results = await this.fetchMetrics(query);

    return results.map((result) => ({
      visitor_id: result.metric.visitor_id,
      session_id: result.metric.session_id,
      value: parseFloat(result.value[1]),
    }));
  },

  // Get all metrics for dashboard
  async getDashboardMetrics(range = TIME_RANGES.DAY) {
    try {
      const [
        activeChatbots,
        traffic,
        questionsAnswered,
        payments,
        bookingDistribution,
      ] = await Promise.all([
        this.getActiveChatbots(range),
        this.getChatbotTraffic(range),
        this.getQuestionsAnswered(range),
        this.getCompletedPayments(range),
        this.getBookingAmountDistribution(range),
      ]);

      return {
        activeChatbots,
        traffic,
        questionsAnswered,
        payments,
        bookingDistribution,
      };
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      throw error;
    }
  },

  // Get time series data for a specific metric
  async getMetricTimeSeries(metricName, range = TIME_RANGES.DAY, step = "1h") {
    const endTime = Math.floor(Date.now() / 1000);
    const startTime = endTime - this.parseTimeRange(range);

    try {
      const response = await axios.get(`${ANALYTICS_API_URL}/query_range`, {
        params: {
          query: metricName,
          start: startTime,
          end: endTime,
          step,
        },
      });

      return response.data.data.result;
    } catch (error) {
      console.error("Error fetching time series data:", error);
      throw error;
    }
  },

  // Helper to parse time range strings
  parseTimeRange(range) {
    const value = parseInt(range);
    const unit = range.slice(-1);

    const multipliers = {
      h: 3600,
      d: 86400,
      w: 604800,
    };

    return value * (multipliers[unit] || 86400); // default to days if unit not recognized
  },
};

// Hook for using dashboard metrics
export const useDashboardMetrics = (range = TIME_RANGES.DAY) => {
  const [metrics, setMetrics] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await PrometheusAPI.getDashboardMetrics(range);
        setMetrics(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [range]);

  return { metrics, loading, error };
};

// Function to handle user login
export const total_bookings = async (chatbot_id) => {
  return {
    current: 100,
    previous: 110,
  };
};

export const total_chatbots = async (user_id) => {
  return {
    current: 5,
    previous: 10,
  };
};

export const average_number_of_question_in_chatbots = async (user_id) => {
  return {
    current: 5,
    previous: 10,
  };
};

export const bookings_through_chatbots = async (user_id, resolution) => {
  return {
    data: [
      {
        name: "Chatbot1",
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
      },
      {
        name: "Chatbot2",
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
      },
      {
        name: "Chatbot3",
        data: [30, 25, 40, 30, 50, 35, 64, 52, 59, 39, 45, 51],
      },
    ],
    meta: {
      xAxis: {
        columns: [
          "Sep",
          "Oct",
          "Nov",
          "Dec",
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
        ],
        type: "category",
      },
      yAxis: {
        min: 0,
        max: 100,
      },
      colors: ["#3C50E0", "#80CAEE", "#80CAFF"],
      markers: {
        strokeColors: ["#3056D3", "#80CAEE", "#80CAFF"],
      },
    },
  };
};

export const booking_success_rates = async (user_id) => {
  return [
    {
      id: "abc",
      success: 80,
      failure: 20,
    },
    {
      id: "xyz",
      success: 20,
      failure: 80,
    },
  ];
};
