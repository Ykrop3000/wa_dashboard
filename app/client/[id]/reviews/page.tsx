'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import BackButtonLayout from '@/components/ui/layouts/back_button_layout';
import ReviewsDashboard from '@/components/ReviewsDashboard'

const ReviewsPage: React.FC = () => {
    const params = useParams();
    const id = params.id; // Get the client ID from the URL


    return (
        <BackButtonLayout title='Отзывы'>
            <ReviewsDashboard user_id={Number(id)} />
        </BackButtonLayout>
    );
};

export default ReviewsPage;
