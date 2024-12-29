'use client'

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import BackButtonLayout from '@/components/ui/layouts/back_button_layout';
import { Card, CardHeader } from '@fluentui/react-components';

// Register necessary components for Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

// Sample data
const orderData = [
    { "orders_count": 22, "date": "2024-11-27" },
    { "orders_count": 8, "date": "2024-11-28" },
    { "orders_count": 10, "date": "2024-11-29" },
    { "orders_count": 5, "date": "2024-11-30" },
    { "orders_count": 7, "date": "2024-12-01" },
    { "orders_count": 14, "date": "2024-12-02" },
    { "orders_count": 16, "date": "2024-12-03" },
    { "orders_count": 17, "date": "2024-12-04" },
    { "orders_count": 15, "date": "2024-12-05" },
    { "orders_count": 13, "date": "2024-12-06" },
    { "orders_count": 3, "date": "2024-12-07" },
    { "orders_count": 4, "date": "2024-12-08" },
    { "orders_count": 14, "date": "2024-12-09" },
    { "orders_count": 14, "date": "2024-12-10" },
    { "orders_count": 14, "date": "2024-12-11" },
    { "orders_count": 20, "date": "2024-12-12" },
    { "orders_count": 20, "date": "2024-12-13" },
    { "orders_count": 11, "date": "2024-12-14" },
    { "orders_count": 6, "date": "2024-12-15" },
    { "orders_count": 17, "date": "2024-12-16" },
    { "orders_count": 28, "date": "2024-12-17" },
    { "orders_count": 25, "date": "2024-12-18" },
    { "orders_count": 21, "date": "2024-12-19" },
    { "orders_count": 16, "date": "2024-12-20" },
    { "orders_count": 12, "date": "2024-12-21" },
    { "orders_count": 5, "date": "2024-12-22" },
    { "orders_count": 21, "date": "2024-12-23" },
    { "orders_count": 30, "date": "2024-12-24" },
    { "orders_count": 30, "date": "2024-12-25" },
    { "orders_count": 29, "date": "2024-12-26" }
];

const StatisticsPage: React.FC = () => {
    // Calculate total orders
    const totalOrders = orderData.reduce((acc, order) => acc + order.orders_count, 0);

    // Prepare data for the chart
    const chartData = {
        labels: orderData.map(order => order.date),
        datasets: [
            {
                label: 'Orders Count',
                data: orderData.map(order => order.orders_count),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                type: 'category' as const,
            },
            y: {
                beginAtZero: true,
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

    return (
        <BackButtonLayout title={"Статистика"}>
            <Card>
                <CardHeader>Total Orders: {totalOrders}</CardHeader>
                <Line data={chartData} options={chartOptions} />
            </Card>
        </BackButtonLayout>
    );
};

export default StatisticsPage;
