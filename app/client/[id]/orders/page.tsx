'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
} from '@fluentui/react-components';
import { apiManager } from '@/services';
import { Order } from '@/types/order';
import BackButtonLayout from '@/components/ui/layouts/back_button_layout';

const OrdersPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id; // Get the client ID from the URL
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Set the number of items per page

    useEffect(() => {
        if (id) {
            fetchOrders();
        }
    }, [id, currentPage]); // Add currentPage to the dependency array

    const fetchOrders = async () => {
        try {
            const fetchedOrders = await apiManager.getOrders(Number(id), (currentPage - 1) * itemsPerPage, itemsPerPage); // Pass pagination parameters
            setOrders(orders => [...orders, ...fetchedOrders]);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadNextPage = () => {
        setCurrentPage(page => page + 1);
    };

    // Calculate total pages based on the total number of orders
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    const columns: TableColumnDefinition<Order>[] = [
        createTableColumn<Order>({
            columnId: 'code',
            compare: (a, b) => a.code - b.code,
            renderHeaderCell: () => 'Code',
            renderCell: (item) => item.code,
        }),
        createTableColumn<Order>({
            columnId: 'status',
            compare: (a, b) => a.status.localeCompare(b.status),
            renderHeaderCell: () => 'Status',
            renderCell: (item) => item.status,
        }),
        createTableColumn<Order>({
            columnId: 'state',
            compare: (a, b) => a.state.localeCompare(b.state),
            renderHeaderCell: () => 'State',
            renderCell: (item) => item.state,
        }),
        createTableColumn<Order>({
            columnId: 'phone',
            compare: (a, b) => (a.phone || '').localeCompare(b.phone || ''),
            renderHeaderCell: () => 'Phone',
            renderCell: (item) => item.phone || 'N/A',
        }),
        createTableColumn<Order>({
            columnId: 'is_sended',
            compare: (a, b) => (a.is_sended === b.is_sended ? 0 : a.is_sended ? 1 : -1),
            renderHeaderCell: () => 'Send?',
            renderCell: (item) => item.is_sended ? 'Yes' : 'No',
        }),
        // Add more columns as needed for other order fields
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <BackButtonLayout title='Client detail'>
            <div style={{ marginBottom: '1rem' }}>
                <Button appearance="primary" onClick={() => router.push(`/client/${id}/orders/create`)}>
                    Add New Order
                </Button>
            </div>
            <DataGrid
                items={orders}
                columns={columns}
                sortable
            >
                <DataGridHeader>
                    <DataGridRow>
                        {({ renderHeaderCell }) => (
                            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                        )}
                    </DataGridRow>
                </DataGridHeader>
                <DataGridBody<Order>>
                    {({ item, rowId }) => (
                        <DataGridRow<Order>
                            key={rowId}
                        >
                            {({ renderCell }) => (
                                <DataGridCell>{renderCell(item)}</DataGridCell>
                            )}
                        </DataGridRow>
                    )}
                </DataGridBody>
            </DataGrid>
            <div style={{ textAlign: 'center', paddingTop: '12px' }}>
                <Button onClick={() => loadNextPage()}>
                    Load more
                </Button>
            </div>
        </BackButtonLayout>
    );
};

export default OrdersPage;
