import axios from 'axios';
import { ANALYTICS_API_URL, AnalyticsRoutes } from "./routes";

// Time range constants
const TIME_RANGES = {
  HOUR: "1h",
  DAY: "1d",
  WEEK: "7d",
  MONTH: "30d"
};

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
      const response = await axios.get(`${ANALYTICS_API_URL}/query`, {
        params: { query },
      });
      return response.data.data.result;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  },

  // Active Chatbots
  async getActiveChatbots(range = TIME_RANGES.HOUR) {
    const query = 'chatbots_active_count';
    const results = await this.fetchMetrics(query);
    
    return results.map(result => ({
      id: result.metric.id,
      name: result.metric.name,
      created_by: result.metric.created_by,
      value: parseFloat(result.value[1])
    }));
  },

  // Traffic Analysis
  async getChatbotTraffic(range = TIME_RANGES.DAY) {
    const query = buildRangeQuery('chatbot_traffic_total', range);
    const results = await this.fetchMetrics(query);

    return results.map(result => ({
      chatbot_id: result.metric.chatbot_id,
      session_id: result.metric.session_id,
      visitor_id: result.metric.visitor_id,
      rate: parseFloat(result.value[1])
    }));
  },

  // Questions Answered
  async getQuestionsAnswered(range = TIME_RANGES.DAY) {
    const query = buildRangeQuery('chatbot_questions_answered_total', range);
    const results = await this.fetchMetrics(query);

    return results.map(result => ({
      chatbot_id: result.metric.chatbot_id,
      session_id: result.metric.session_id,
      visitor_id: result.metric.visitor_id,
      rate: parseFloat(result.value[1])
    }));
  },

  // Completed Payments
  async getCompletedPayments(range = TIME_RANGES.DAY) {
    const query = buildRangeQuery('payment_completed_total', range);
    const results = await this.fetchMetrics(query);

    return results.map(result => ({
      visitor_id: result.metric.visitor_id,
      session_id: result.metric.session_id,
      rate: parseFloat(result.value[1])
    }));
  },

  // Booking Amount Distribution
  async getBookingAmountDistribution(range = TIME_RANGES.DAY) {
    const query = buildHistogramQuery('booking_amount', range);
    const results = await this.fetchMetrics(query);

    return results.map(result => ({
      visitor_id: result.metric.visitor_id,
      session_id: result.metric.session_id,
      value: parseFloat(result.value[1])
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
        bookingDistribution
      ] = await Promise.all([
        this.getActiveChatbots(range),
        this.getChatbotTraffic(range),
        this.getQuestionsAnswered(range),
        this.getCompletedPayments(range),
        this.getBookingAmountDistribution(range)
      ]);

      return {
        activeChatbots,
        traffic,
        questionsAnswered,
        payments,
        bookingDistribution
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  },

  // Get time series data for a specific metric
  async getMetricTimeSeries(metricName, range = TIME_RANGES.DAY, step = '1h') {
    const endTime = Math.floor(Date.now() / 1000);
    const startTime = endTime - this.parseTimeRange(range);
    
    try {
      const response = await axios.get(`${ANALYTICS_API_URL}/query_range`, {
        params: {
          query: metricName,
          start: startTime,
          end: endTime,
          step
        }
      });
      
      return response.data.data.result;
    } catch (error) {
      console.error('Error fetching time series data:', error);
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
      w: 604800
    };

    return value * (multipliers[unit] || 86400); // default to days if unit not recognized
  }
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
        previous: 110
    }
};

export const total_chatbots = async (user_id) => {
    return {
        current: 5,
        previous: 10
    }
}

export const average_number_of_question_in_chatbots = async (user_id) => {
    return {
        current: 5,
        previous: 10
    }
}


export const bookings_through_chatbots = async (user_id, resolution) => {
    return {
        data: [
            {
                name: 'Chatbot1',
                data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
            },
            {
                name: 'Chatbot2',
                data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
            },
            {
                name: 'Chatbot3',
                data: [30, 25, 40, 30, 50, 35, 64, 52, 59, 39, 45, 51],
            },
        ],
        meta: {
            xAxis: {
                columns: [
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                ],
                type: "category"
            },
            yAxis: {
                min: 0,
                max: 100
            },
            colors: ['#3C50E0', '#80CAEE', '#80CAFF'],
            markers: {
                strokeColors: ['#3056D3', '#80CAEE', '#80CAFF'],
            }
        }
    }
}


export const booking_success_rates = async (user_id) => {
    return [
        {
            id: "abc",
            success: 80,
            failure: 20
        },
        {
            id: "xyz",
            success: 20,
            failure: 80
        },
    ]
}