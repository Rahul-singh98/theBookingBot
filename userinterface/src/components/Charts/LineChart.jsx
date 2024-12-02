import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const LineChart = ({ data, meta, resolution, onResolutionChange }) => {
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState([]);
    const commonResolutionClass = "rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark"

    useEffect(() => {
        // Update chart options and series when data or meta changes
        if (data && meta) {
            const { xAxis, yAxis, colors, markers } = meta;

            setChartOptions({
                legend: {
                    show: false,
                    position: 'top',
                    horizontalAlign: 'left',
                },
                colors: colors || ['#3C50E0', '#80CAEE'],
                chart: {
                    fontFamily: 'Satoshi, sans-serif',
                    height: 335,
                    type: 'area',
                    dropShadow: {
                        enabled: true,
                        color: '#623CEA14',
                        top: 10,
                        blur: 4,
                        left: 0,
                        opacity: 0.1,
                    },
                    toolbar: {
                        show: false,
                    },
                },
                responsive: [
                    {
                        breakpoint: 1024,
                        options: {
                            chart: {
                                height: 300,
                            },
                        },
                    },
                    {
                        breakpoint: 1366,
                        options: {
                            chart: {
                                height: 350,
                            },
                        },
                    },
                ],
                stroke: {
                    width: [2, 2],
                    curve: 'straight',
                },
                grid: {
                    xaxis: {
                        lines: {
                            show: true,
                        },
                    },
                    yaxis: {
                        lines: {
                            show: true,
                        },
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                markers: {
                    size: 4,
                    colors: '#fff',
                    strokeColors: markers?.strokeColors || ['#3056D3', '#80CAEE'],
                    strokeWidth: 3,
                    strokeOpacity: 0.9,
                    strokeDashArray: 0,
                    fillOpacity: 1,
                    discrete: [],
                    hover: {
                        size: undefined,
                        sizeOffset: 5,
                    },
                },
                xaxis: {
                    type: xAxis?.type || 'category',
                    categories: xAxis?.columns || [],
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                },
                yaxis: {
                    title: {
                        style: {
                            fontSize: '0px',
                        },
                    },
                    min: yAxis?.min || 0,
                    max: yAxis?.max || 100,
                },
            });

            setChartSeries(data);
        }
    }, [data, meta]);

    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
            <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
                <div className="flex w-full flex-wrap gap-3 sm:gap-5">
                    <h3>Total booking by chatbots</h3>
                </div>
                <div className="flex w-full max-w-45 justify-end">
                    <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
                        <button
                            className={`${commonResolutionClass} ${resolution === 'D' ? 'bg-white shadow-card dark:bg-boxdark' : ''
                                }`}
                            onClick={() => onResolutionChange('D')}
                        >
                            Day
                        </button>
                        <button
                            className={`${commonResolutionClass} ${resolution === 'W' ? 'bg-white shadow-card dark:bg-boxdark' : ''
                                }`}
                            onClick={() => onResolutionChange('W')}
                        >
                            Week
                        </button>
                        <button
                            className={`${commonResolutionClass} ${resolution === 'M' ? 'bg-white shadow-card dark:bg-boxdark' : ''
                                }`}
                            onClick={() => onResolutionChange('M')}
                        >
                            Month
                        </button>
                    </div>
                </div >
            </div >

            <div>
                <div id="LineChart" className="-ml-5">
                    <ReactApexChart
                        options={chartOptions}
                        series={chartSeries}
                        type="area"
                        height={350}
                    />
                </div>
            </div>
        </div >
    );
};

export default LineChart;
