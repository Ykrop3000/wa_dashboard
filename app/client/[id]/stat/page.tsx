'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChartData, Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from "react-chartjs-2";
import { SelectionEvents, OptionOnSelectData } from '@fluentui/react-components';

import BackButtonLayout from '@/components/ui/layouts/back_button_layout';
import { Card, CardHeader, Field, makeStyles, Button, CardFooter, Text, Dropdown, Option } from '@fluentui/react-components';
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { OrdersCountPrice, GroupStatuses } from '@/types/statistic';
import { apiManager } from '@/services';

// Register necessary components for Chart.js
ChartJS.register(...registerables);

const useStyles = makeStyles({
    section: {
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: "12px"
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        gap: "12px"
    },
    field: {
        justifyItems: 'center'
    }
})

function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const StatisticsPage: React.FC = () => {
    const styles = useStyles();
    const params = useParams();

    const [ordersCountPrice, setOrdersCountPrice] = useState<OrdersCountPrice[]>([])
    const [avgPrice, setAvgPrice] = useState<number>(0)
    const [startDate, setStartDate] = useState<Date | null | undefined>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // Default to current date - 30 days
    const [endDate, setEndDate] = useState<Date | null | undefined>(new Date());
    const [statuses, setStatuses] = useState<string[]>([])

    // Calculate total orders
    const totalOrders = ordersCountPrice.reduce((acc, order) => acc + order.orders_count, 0);
    const totalPrice = ordersCountPrice.reduce((acc, order) => acc + order.price, 0)
    // const totalDays = ordersCountPrice.length

    const fetchOrdersCountPrice = async () => {
        const data = await apiManager.getOrdersCountPriceStatistics(
            Number(params.id),
            Math.ceil((startDate ? startDate.getTime() : new Date().getTime()) / 1000),
            Math.ceil((endDate ? endDate.getTime() : new Date().getTime()) / 1000),
            statuses
        )
        setOrdersCountPrice(data)
    }
    const fetchAvgPrice = async () => {
        const data = await apiManager.getAvgPriceStatistics(
            Number(params.id),
            Math.ceil((startDate ? startDate.getTime() : new Date().getTime()) / 1000),
            Math.ceil((endDate ? endDate.getTime() : new Date().getTime()) / 1000),
            statuses
        )
        setAvgPrice(data.avg_price)
    }

    const setParams = () => {
        fetchOrdersCountPrice()
        fetchAvgPrice()
    }

    useEffect(() => {
        setParams();
    }, [params.id])



    // Prepare data for the chart
    const chartData: ChartData<'line' | 'bar', number[], string> = {
        labels: ordersCountPrice.map(order => order.date),
        datasets: [
            {
                label: 'Кол-во заказов',
                data: ordersCountPrice.map(order => order.orders_count),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                type: 'line' as const,
                fill: false,
                yAxisID: 'count_y'
            },
            {
                label: 'Сумма заказов',
                data: ordersCountPrice.map(order => order.price),
                borderColor: 'rgba(235, 109, 84, 1)',
                backgroundColor: 'rgba(235, 135, 84, 0.2)',
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
    const handleStatusChange = (event: SelectionEvents, data: OptionOnSelectData) => {
        const selectedOptions = data.selectedOptions;
        setStatuses(selectedOptions);
        console.log(selectedOptions)
    };
    return (
        <BackButtonLayout title={"Статистика"}>
            <Card orientation="horizontal" className={styles.section}>
                <Field label="Статус заказа">
                    <Dropdown multiselect={true} defaultSelectedOptions={["completed"]} onOptionSelect={handleStatusChange}>
                        {Object.entries(GroupStatuses).map(([key, value]) => (
                            <Option key={key} value={key}>
                                {value}
                            </Option>
                        ))}
                    </Dropdown>
                </Field>
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

            <Card className={styles.section} style={{ width: 'fit-content', padding: '24px' }}>
                <CardHeader>Заказы общие, за период (свод)</CardHeader>
                <div className={styles.row}>
                    <Field label="Сумма (тг.)" className={styles.field}>
                        <Text size={600}>{numberWithSpaces(totalPrice)}</Text>
                    </Field>
                    <Field label="Средний чек" className={styles.field}>
                        <Text size={600}>{numberWithSpaces(avgPrice)}</Text>
                    </Field>
                </div>
                <div className={styles.row}>
                    <Field label="Кол-во заказов" className={styles.field}>
                        <Text size={600}>{totalOrders}</Text>
                    </Field>
                </div>
            </Card>

            <Card className={styles.section}>
                <Chart type='bar' data={chartData} options={chartOptions} />
            </Card>
        </BackButtonLayout>
    );
};

export default StatisticsPage;
