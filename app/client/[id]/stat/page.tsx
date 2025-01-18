'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChartData, Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from "react-chartjs-2";

import BackButtonLayout from '@/components/ui/layouts/back_button_layout';
import { Card, CardHeader, Field, makeStyles, Button, CardFooter } from '@fluentui/react-components';
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { OrdersCountPrice } from '@/types/statistic';
import { apiManager } from '@/services';

// Register necessary components for Chart.js
ChartJS.register(...registerables);

const useStyles = makeStyles({
    section: {
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: "12px"
    },
})

const StatisticsPage: React.FC = () => {
    const styles = useStyles();
    const params = useParams();

    const [ordersCountPrice, setOrdersCountPrice] = useState<OrdersCountPrice[]>([])
    const [startDate, setStartDate] = useState<Date | null | undefined>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // Default to current date - 30 days
    const [endDate, setEndDate] = useState<Date | null | undefined>(new Date());

    const fetchOrdersCountPrice = async () => {
        console.log(startDate, endDate)
        const data = await apiManager.getOrdersCountPriceStatistics(
            Number(params.id),
            Math.ceil((startDate ? startDate.getTime() : new Date().getTime()) / 1000),
            Math.ceil((endDate ? endDate.getTime() : new Date().getTime()) / 1000)
        )
        setOrdersCountPrice(data)
    }

    const setParams = () => {
        fetchOrdersCountPrice()
    }

    useEffect(() => {
        fetchOrdersCountPrice();
    }, [params.id])

    // Calculate total orders
    const totalOrders = ordersCountPrice.reduce((acc, order) => acc + order.orders_count, 0);

    // Prepare data for the chart
    const chartData: ChartData<'line' | 'bar', number[], string> = {
        labels: ordersCountPrice.map(order => order.date),
        datasets: [
            {
                label: 'Orders Count',
                data: ordersCountPrice.map(order => order.orders_count),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                type: 'line' as const,
                fill: true,
                yAxisID: 'count_y'
            },
            {
                label: 'Orders price',
                data: ordersCountPrice.map(order => order.price),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                type: 'bar' as const,
                yAxisID: 'price_y'
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                type: 'category' as const,
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            price_y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: 'Price (₸)'
                }
            },
            count_y: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false,
                },
                title: {
                    display: true,
                    text: 'Number of Orders'
                }
            },
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Orders Over Time',
            },
        },
    };

    const handleStartDateChange = (date: Date | null | undefined) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date: Date | null | undefined) => {
        setEndDate(date);
    };

    return (
        <BackButtonLayout title={"Статистика"}>
            <Card orientation="horizontal" className={styles.section}>
                <Field label="Start date">
                    <DatePicker
                        value={startDate}
                        onSelectDate={handleStartDateChange}
                    />
                </Field>
                <Field label="End date">
                    <DatePicker
                        value={endDate}
                        onSelectDate={handleEndDateChange}
                    />
                </Field>
                <CardFooter>
                    <Button onClick={setParams}>Применить</Button>
                </CardFooter>
            </Card>
            <Card className={styles.section}>
                <CardHeader>Total Orders: {totalOrders}</CardHeader>
                <Chart type='bar' data={chartData} options={chartOptions} />
            </Card>
        </BackButtonLayout>
    );
};

export default StatisticsPage;
