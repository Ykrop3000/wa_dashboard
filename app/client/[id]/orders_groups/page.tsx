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
} from '@fluentui/react-components';
import { OpenRegular } from '@fluentui/react-icons';

import { apiManager } from '@/services';
import BackButtonLayout from '@/components/ui/layouts/back_button_layout';
import { OrdersGroup } from '@/types/orders_group';

const OrdersGroupsPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id; // Get the client ID from the URL
    const [ordersGroups, setOrdersGroups] = useState<OrdersGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Set the number of items per page

    useEffect(() => {
        fetchOrdersGroups()
    }, [params.id]);

    const fetchOrdersGroups = async () => {
        try {
            const fetchedOrdersGroups = await apiManager.getOrdersGroupsByUser(Number(id), (currentPage - 1) * itemsPerPage, itemsPerPage); // Pass pagination parameters
            setOrdersGroups(ordersGroups => [...ordersGroups, ...fetchedOrdersGroups]);

        } catch (error) {
            console.error('Failed to fetch ordersGroups:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadNextPage = () => {
        setCurrentPage(page => page + 1);
    };


    const columns: TableColumnDefinition<OrdersGroup>[] = [
        createTableColumn<OrdersGroup>({
            columnId: 'id',
            compare: (a, b) => a.id - b.id,
            renderHeaderCell: () => 'Id',
            renderCell: (item) => item.id,
        }),
        createTableColumn<OrdersGroup>({
            columnId: 'name',
            compare: (a, b) => a.name.localeCompare(b.name),
            renderHeaderCell: () => 'Name',
            renderCell: (item) => item.name,
        }),
        createTableColumn<OrdersGroup>({
            columnId: "openAction",
            renderHeaderCell: () => {
                return "Open";
            },
            renderCell: (item) => {
                return <Button
                    icon={<OpenRegular />}
                    onClick={() => router.push(`/client/${params.id}/orders_groups/${item.id}`)}
                >
                    Open
                </Button>;
            },
        }),
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <BackButtonLayout title='Группы заказов'>
            <DataGrid
                items={ordersGroups}
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
                <DataGridBody<OrdersGroup>>
                    {({ item, rowId }) => (
                        <DataGridRow<OrdersGroup>
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
                    Загрузить больше
                </Button>
            </div>
        </BackButtonLayout>
    );
};

export default OrdersGroupsPage;
