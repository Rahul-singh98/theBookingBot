import CardDataStats from "@/components/CardDataStats";
import LineChart from "@/components/Charts/LineChart";
import PieChart from "@/components/Charts/PieChart";
import StackChart from "@/components/Charts/StackChart";
import { useEffect, useState } from "react";
import {
    total_bookings,
    total_chatbots,
    bookings_through_chatbots,
    average_number_of_question_in_chatbots
} from "@/api/analytics";
import { get_pct } from "@/utils/analytics";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card';
import ReactApexChart from 'react-apexcharts';


const AdminDashboard = () => {
    // Sample data - in real app would come from Prometheus metrics
    const [lineChartData, setLineChartData] = useState([]);
    const [lineChartMeta, setLineChartMeta] = useState({});
    const [resolution, setResolution] = useState('D');
    const commonResolutionClass = "rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark";

    
  
    // Active Chatbots Chart Options
    const activeChatbotsOptions = {
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false },
        fontFamily: 'Satoshi, sans-serif',
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
      xaxis: {
        categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
      },
      dataLabels: { enabled: false }
    };
  
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
              series={[{
                name: 'Active Chatbots',
                data: [5, 7, 10, 12, 8, 6]
              }]}
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