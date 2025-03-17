'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';

import OrdersDashboard from '@/components/OrdersDashboard'
import BackButtonLayout from '@/components/ui/layouts/back_button_layout';

const OrdersPage: React.FC = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id;
    const group = searchParams.get('group')


    return (
        <BackButtonLayout title='Заказы'>
            <OrdersDashboard
                group_id={group ? Number(group) : undefined}
                user_id={Number(id)} />
        </BackButtonLayout>
    );
};

export default OrdersPage;
