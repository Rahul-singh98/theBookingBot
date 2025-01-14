import CardDataStats from "@/components/CardDataStats";
import LineChart from "@/components/Charts/LineChart";
import PieChart from "@/components/Charts/PieChart";
import StackChart from "@/components/Charts/StackChart";
import { useEffect, useState } from "react";
import {
    PrometheusAPI
} from "@/api/analytics";
import { get_pct } from "@/utils/analytics";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card';
import ReactApexChart from 'react-apexcharts';


const AdminDashboard = () => {
    const [resolution, setResolution] = useState('D');
    const [activeChatbotData, setActiveChatbotData] = useState([])
    const [loading, setLoading] = useState(true);
    const commonResolutionClass = "rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark";

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const results = await PrometheusAPI.getActiveChatbots(resolution);
          
          // Process and format the data
          const formattedData = results.map(result => ({
            x: new Date(result.timestamp * 1000),
            y: result.value,
            name: result.name,
            id: result.id
          })).sort((a, b) => a.x - b.x); // Sort by timestamp
  
          setActiveChatbotData(formattedData);
        } catch (error) {
          console.error('Error fetching active chatbots:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [resolution]);
  
    // Active Chatbots Chart Options
    const activeChatbotsOptions = {
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false },
        fontFamily: 'Satoshi, sans-serif',
        zoom: {
          enabled: true,
          type: 'x'
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      colors: ['#3C50E0'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      dataLabels: { 
        enabled: false
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM yyyy',
            day: 'dd MMM',
            hour: 'HH:mm'
          },
          formatter: function(value, timestamp) {
            return new Date(timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            });
          }
        },
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        title: {
          text: 'Active Chatbots'
        },
        min: 0,
        labels: {
          formatter: function(value) {
            return Math.round(value);
          }
        }
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy HH:mm'
        },
        y: {
          formatter: function(value) {
            return Math.round(value);
          }
        },
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
          const data = activeChatbotData[dataPointIndex];
          return (
            '<div class="p-2">' +
            '<div><strong>Time:</strong> ' + 
            new Date(data.x).toLocaleString() + '</div>' +
            '<div><strong>Count:</strong> ' + 
            Math.round(data.y) + '</div>' +
            (data.name ? '<div><strong>Name:</strong> ' + data.name + '</div>' : '') +
            (data.id ? '<div><strong>ID:</strong> ' + data.id + '</div>' : '') +
            '</div>'
          );
        }
      }
    };

    const chartSeries = [{
      name: 'Active Chatbots',
      data: activeChatbotData.map(item => ({
        x: item.x,
        y: item.y
      }))
    }];
  
    // Traffic Analysis Chart Options
    const trafficOptions = {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: { show: false },
        fontFamily: 'Satoshi, sans-serif',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 2
        },
      },
      colors: ['#3C50E0', '#80CAEE', '#6577F3'],
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      },
      dataLabels: { enabled: false }
    };
  
    // Questions Distribution Donut Options
    const questionsOptions = {
      chart: {
        type: 'donut',
        fontFamily: 'Satoshi, sans-serif',
      },
      colors: ['#3C50E0', '#80CAEE', '#6577F3', '#8FD0EF'],
      labels: ['Product', 'Shipping', 'Returns', 'Payment'],
      legend: {
        position: 'bottom'
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%'
          }
        }
      }
    };
  
    // Booking Amount Histogram Options
    const bookingOptions = {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false },
        fontFamily: 'Satoshi, sans-serif',
      },
      plotOptions: {
        bar: {
          borderRadius: 2,
          columnWidth: '60%',
        }
      },
      colors: ['#3C50E0'],
      xaxis: {
        categories: ['0-50', '51-100', '101-200', '201-500', '501+']
      },
      dataLabels: { enabled: false }
    };
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Active Chatbots */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>Active Chatbots</CardTitle>
              </div>
              <div className="inline-flex items-center rounded-md bg-whiter p-1.5">
                <button
                  className={`${commonResolutionClass} ${resolution === 'D' ? 'bg-white shadow-card' : ''}`}
                  onClick={() => setResolution('D')}
                >
                  Day
                </button>
                <button
                  className={`${commonResolutionClass} ${resolution === 'W' ? 'bg-white shadow-card' : ''}`}
                  onClick={() => setResolution('W')}
                >
                  Week
                </button>
                <button
                  className={`${commonResolutionClass} ${resolution === 'M' ? 'bg-white shadow-card' : ''}`}
                  onClick={() => setResolution('M')}
                >
                  Month
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ReactApexChart
              options={activeChatbotsOptions}
              series={chartSeries}
              type="area"
              height={350}
            />
          </CardContent>
        </Card>
  
        {/* Traffic Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic by Chatbot</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactApexChart
              options={trafficOptions}
              series={[
                {
                  name: 'Chatbot 1',
                  data: [44, 55, 41, 67, 22, 43, 21]
                },
                {
                  name: 'Chatbot 2',
                  data: [13, 23, 20, 8, 13, 27, 33]
                },
                {
                  name: 'Chatbot 3',
                  data: [11, 17, 15, 15, 21, 14, 15]
                }
              ]}
              type="bar"
              height={350}
            />
          </CardContent>
        </Card>
  
        {/* Questions Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Questions Distribution</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle>Booking Amount Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactApexChart
              options={bookingOptions}
              series={[{
                name: 'Bookings',
                data: [100, 200, 150, 80, 30]
              }]}
              type="bar"
              height={350}
            />
          </CardContent>
        </Card>
      </div>
    );
  };
  

export default AdminDashboard