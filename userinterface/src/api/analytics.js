import axios from "axios";
import { ANALYTICS_API_URL, AnalyticsRoutes } from "./routes";
import { TIME_RANGES } from "@/utils/time_ranges";

// Api API service
export const AnalyticsAPI = {
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

  async getCountUtils(total) {
    // Helper function to format numbers
    const formatNumber = (num) => {
      if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B"; // Billions
      if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M"; // Millions
      if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K"; // Thousands
      return num.toString(); // Less than 1,000
    };

    // Return the mapped structure
    const formattedCount = formatNumber(total || 0);
    return { count: formattedCount };
  },
  // Number of Active Chatbots
  async getNumberOfActiveChatbots(createdBy) {
    // Construct the Api query
    const url = `${AnalyticsRoutes.CHATBOT_COUNTER}/total`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Api query failed: ${response.status}`);

    const json = await response.json();
    return await this.getCountUtils(json?.total);
  },

  // Total Traffic Processed
  async getTotalTrafficProcessed(createdBy) {
    // Construct the Api query
    const url = `${AnalyticsRoutes.CHATBOT_TRAFFIC}/total`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Api query failed: ${response.status}`);
    const json = await response.json();
    return await this.getCountUtils(json?.total);
  },

  // Total Traffic Processed
  async getUniqueVisitors(createdBy) {
    // Construct the Api query
    const url = `${AnalyticsRoutes.CHATBOT_TRAFFIC}/unique_visitors`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Api query failed: ${response.status}`);
    const json = await response.json();
    return await this.getCountUtils(json?.count);
  },

  // Active Chatbots
  async getActiveChatbots(range = TIME_RANGES.HOUR, createdBy = null) {
    try {
      const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
      let start, step;

      // Define the start and step based on the range
      switch (range) {
        case TIME_RANGES.DAY: // Last 20 days
          start = now - 30 * 24 * 60 * 60; // 20 days ago
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

      let query = `${AnalyticsRoutes.CHATBOT_COUNTER}?`; // Aggregate active chatbots
      if (createdBy) {
        query = `${query}bot_author=${createdBy}&`;
      }
      // Construct the Api query_range API URL
      // const url = `${query}start=${start}&end=${now}`;
      const url = `${query}`;

      // Fetch metrics from the Api server
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Api query failed: ${response.status}`);
      const json = await response.json();

      if (!json?.items) {
        throw new Error("No data from Api");
      }

      return json.items.map((value) => ({
        timestamp: parseFloat(value?.timestamp || 0),
        value: parseFloat(value?.count || 0),
      }));
    } catch (err) {
      console.warn(
        "Api unavailable or query failed for getActiveChatbots:",
        err
      );
      // Return empty array so charts render as empty
      return [];
    }
  },

  // Chatbot Traffic Analysis
  async getChatbotTraffic(range = TIME_RANGES.DAY, createdBy = null) {
    try {
      const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
      let start, step;

      // Define the start and step based on the range
      switch (range) {
        case TIME_RANGES.DAY: // Last 20 days
          start = now - 30 * 24 * 60 * 60; // 20 days ago
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

      let query = `${AnalyticsRoutes.CHATBOT_TRAFFIC}?`; // Aggregate active chatbots
      if (createdBy) {
        query = `${query}bot_author=${createdBy}&`;
      }
      // Construct the Api query_range API URL
      // const url = `${query}start=${start}&end=${now}`;
      const url = `${query}`;

      // Fetch metrics from the Api server
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Api query failed: ${response.status}`);
      const json = await response.json();

      if (!json?.items) {
        throw new Error("No data from Api");
      }

      return json.items.map((value) => ({
        timestamp: parseFloat(value?.timestamp || 0),
        value: parseFloat(value?.count || 0),
      }));
    } catch (err) {
      console.warn(
        "Api unavailable or query failed for getChatbotTraffic:",
        err
      );
      return [];
    }

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
    try {
      let query = `${AnalyticsRoutes.CHATBOT_TRAFFIC}/grouped`; // Aggregate active chatbots
      const url = `${query}`;

      // Fetch metrics from the Api server
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Api query failed: ${response.status}`);
      const json = await response.json();

      if (!json?.items) {
        throw new Error("No data from Api");
      }

      return json?.items.map((result) => ({
        timestamp: parseFloat(result?.timestamp || 0),
        value: parseFloat(result?.count || 0),
        bot_author: result?.bot_author,
        bot_id: result?.bot_id,
      }));
    } catch (err) {
      console.warn(
        "Api unavailable or query failed for getChatbotTrafficByBots:",
        err
      );
      return [];
    }
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

  // Regional sessions (instant): sum by region
  async getRegionalSessions() {
    try {
      const url = `${AnalyticsRoutes.CHATBOT_TRAFFIC}/regional`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Api query failed: ${response.status}`);
      const json = await response.json();
      if (!json?.items) return [];
      return json.items.map((r) => ({
        region: r.country || "unknown",
        value: parseFloat(r.count),
      }));
    } catch (err) {
      console.warn("getRegionalSessions failed:", err);
      return [];
    }
  },

  // Payments by subadmin (instant)
  async getPaymentsBySubadmin() {
    return [];
    // try {
    //   const query = `sum(payments_total) by (v_id)`;
    //   const url = `/api/v1/query?query=${encodeURIComponent(query)}`;
    //   const response = await fetch(url);
    //   if (!response.ok) throw new Error(`Api query failed: ${response.status}`);
    //   const json = await response.json();
    //   if (!json?.data?.result) return [];
    //   return json.data.result.map((r) => ({ v_id: r.metric.v_id || "unknown", value: parseFloat(r.value[1]) }));
    // } catch (err) {
    //   console.warn("getPaymentsBySubadmin failed:", err);
    //   return [];
    // }
  },

  // Quotes / getquotes bills by subadmin (instant)
  async getQuotesBySubadmin() {
    try {
      const url = `${AnalyticsRoutes.CHATBOT_QUOTES}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Api query failed: ${response.status}`);
      const json = await response.json();
      if (!json?.items) return [];
      return json.items.map((r) => ({
        v_id: r.v_id || "unknown",
        value: parseFloat(r.count),
        bot_id: r.bot_id || "unknown",
        bot_name: r.bot_name || "unknown",
      }));
    } catch (err) {
      console.warn("getQuotesBySubadmin failed:", err);
      return [];
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
        const data = await AnalyticsAPI.getDashboardMetrics(range);
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
