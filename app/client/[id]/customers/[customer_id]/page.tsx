'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import {
    Card,
    CardHeader,
    Spinner,
    Caption1,
    Divider,
    Avatar,
} from '@fluentui/react-components';

import BackButtonLayout from '@/components/ui/layouts/back_button_layout';
import OrdersDashboard from '@/components/OrdersDashboard'
import ReviewsDashboard from '@/components/ReviewsDashboard'

import { apiManager } from '@/services';
import { Customer } from '@/types/customer';


const CustomerPage: React.FC = () => {
    const params = useParams();

    const [customer, setCustomer] = useState<Customer>();

    const [loading, setLoading] = useState(true);

    const customer_id = params.customer_id;
    const user_id = params.id;

    useEffect(() => {
        console.log("fetchCustomer")
        if (customer_id) {
            fetchCustomer();
        }
    }, [customer_id]);

    const fetchCustomer = async () => {
        try {
            const fetchedCustomer = await apiManager.getCustomer(Number(customer_id));
            setCustomer(fetchedCustomer);

        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!customer) return "Not found"

    return (
        <BackButtonLayout title='Клиент'>
            {loading && <Spinner />}
            {!loading &&
                <>
                    <Card>
                        <CardHeader
                            image={<Avatar aria-label="Guest" />}
                            header={<b>{customer.first_name} {customer.last_name}</b>}
                            description={<Caption1>Телефон: {customer.phone}</Caption1>}
                        />
                    </Card>
                    <Divider style={{ paddingBottom: "12px", paddingTop: "12px" }}>Заказы</Divider>
                    <OrdersDashboard
                        user_id={Number(user_id)}
                        customer_id={Number(customer_id)}
                        filters={false} />
                    <Divider style={{ paddingBottom: "12px", paddingTop: "12px" }}>Отзывы</Divider>
                    <ReviewsDashboard
                        user_id={Number(user_id)}
                        customer_id={Number(customer_id)}
                    />
                </>
            }
        </BackButtonLayout>
    )
}

export default CustomerPage