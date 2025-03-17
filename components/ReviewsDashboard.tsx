'use client';

import React, { useEffect, useState } from 'react';
import {
    DataGrid,
    DataGridHeader,
    DataGridRow,
    DataGridHeaderCell,
    DataGridCell,
    DataGridBody,
    TableColumnDefinition,
    createTableColumn,
    Button,
    Badge,
    Spinner,
    Card,
} from '@fluentui/react-components';
import { apiManager } from '@/services';
import { Review } from '@/types/review';

const ReviewsDashboard: React.FC<{
    user_id: number;
    customer_id?: number;
}> = ({ user_id, customer_id = null }) => {

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Set the number of items per page


    useEffect(() => {
        console.log("fetchReview")
        if (user_id) {
            fetchReviews();
        }
    }, [user_id, currentPage]);


    const fetchReviews = async () => {
        try {
            const fetchedReviews = await apiManager.getReviews(
                user_id,
                (currentPage - 1) * itemsPerPage,
                itemsPerPage,
                customer_id
            );
            setReviews(prevReviews => currentPage === 1 ? fetchedReviews : [...prevReviews, ...fetchedReviews]);

        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadNextPage = () => {
        setCurrentPage(page => page + 1);
    };

    const columns: TableColumnDefinition<Review>[] = [
        createTableColumn<Review>({
            columnId: 'order_code',
            compare: (a, b) => a.order_code.localeCompare(b.order_code),
            renderHeaderCell: () => 'Код заказа',
            renderCell: (item) => item.order_code,
        }),
        createTableColumn<Review>({
            columnId: 'text',
            renderHeaderCell: () => 'Текст',
            renderCell: (item) => item.text,
        }),
        createTableColumn<Review>({
            columnId: 'rating',
            compare: (a, b) => a.rating - b.rating,
            renderHeaderCell: () => 'Рейтинг',
            renderCell: (item) => {
                const rating = item.rating;
                let color: 'danger' | 'warning' | 'success' = 'danger';

                if (rating >= 3 && rating < 4) {
                    color = 'warning'; // Yellow for ratings between 3 and 4
                } else if (rating >= 4) {
                    color = 'success'; // Green for ratings 4 and above
                }

                return (
                    <Badge
                        appearance="filled"
                        color={color}
                    >
                        {rating}
                    </Badge>
                );
            },
        }),
        createTableColumn<Review>({
            columnId: 'created_at',
            compare: (a, b) => (a.created_at?.getTime() || 0) - (b.created_at?.getTime() || 0),
            renderHeaderCell: () => 'Создано в',
            renderCell: (item) => {
                const createdAt = item.created_at ? new Date(item.created_at) : null; // Ensure created_at is a Date object
                return createdAt
                    ? `${createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour12: false, minute: '2-digit', hour: '2-digit' })}`
                    : 'N/A'; // Format without seconds
            },
        })
    ];

    return (
        <>
            {loading && <Spinner />}
            {!loading &&
                <Card>
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                        <DataGrid
                            resizableColumns={true}
                            items={reviews}
                            columns={columns}
                            sortable
                            resizableColumnsOptions={{ autoFitColumns: true }}
                            style={{ minWidth: '600px' }} // Ensure minimum width for DataGrid
                        >
                            <DataGridHeader>
                                <DataGridRow>
                                    {({ renderHeaderCell }) => (
                                        <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                                    )}
                                </DataGridRow>
                            </DataGridHeader>
                            <DataGridBody<Review>>
                                {({ item, rowId }) => (
                                    <DataGridRow<Review>
                                        key={rowId}
                                    >
                                        {({ renderCell }) => (
                                            <DataGridCell>{renderCell(item)}</DataGridCell>
                                        )}
                                    </DataGridRow>
                                )}
                            </DataGridBody>
                        </DataGrid>
                    </div>
                    <div style={{ textAlign: 'center', paddingTop: '12px' }}>
                        <Button onClick={() => loadNextPage()}>
                            Загрузить больше
                        </Button>
                    </div>
                </Card>
            }
        </>
    );
};

export default ReviewsDashboard;
