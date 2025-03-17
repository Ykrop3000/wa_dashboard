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
    Spinner,
} from '@fluentui/react-components';
import { OpenRegular } from '@fluentui/react-icons';

import { apiManager } from '@/services';
import { Customer } from '@/types/customer';
import BackButtonLayout from '@/components/ui/layouts/back_button_layout';


const CustomersPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id; // Get the client ID from the URL
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Set the number of items per page


    useEffect(() => {
        console.log("fetchCustomer")
        if (id) {
            fetchCustomers();
        }
    }, [id, currentPage]);


    const fetchCustomers = async () => {
        try {
            const fetchedCustomers = await apiManager.getCustomersAndStat(
                Number(id),
                (currentPage - 1) * itemsPerPage,
                itemsPerPage,
            );
            setCustomers(prevCustomers => currentPage === 1 ? fetchedCustomers : [...prevCustomers, ...fetchedCustomers]);

        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadNextPage = () => {
        setCurrentPage(page => page + 1);
    };

    const columns: TableColumnDefinition<Customer>[] = [
        createTableColumn<Customer>({
            columnId: 'first_name',
            compare: (a, b) => a.first_name.localeCompare(b.first_name),
            renderHeaderCell: () => 'Имя',
            renderCell: (item) => item.first_name,
        }),
        createTableColumn<Customer>({
            columnId: 'last_name',
            compare: (a, b) => a.last_name.localeCompare(b.last_name),
            renderHeaderCell: () => 'Фамилия',
            renderCell: (item) => item.last_name,
        }),
        createTableColumn<Customer>({
            columnId: 'phone',
            compare: (a, b) => a.phone.localeCompare(b.phone),
            renderHeaderCell: () => 'Телефон',
            renderCell: (item) => item.phone,
        }),
        createTableColumn<Customer>({
            columnId: 'orders_count',
            compare: (a, b) => (a.orders_count ?? 0) - (b.orders_count ?? 0),
            renderHeaderCell: () => 'Кол-во заказов',
            renderCell: (item) => item.orders_count ?? 0,
        }),
        createTableColumn<Customer>({
            columnId: "openAction",
            renderHeaderCell: () => {
                return "Открыть";
            },
            renderCell: (item) => {
                return <Button
                    icon={<OpenRegular />}
                    onClick={() => router.push(`/client/${params.id}/customers/${item.id}`)}
                >
                    Open
                </Button>;
            },
        }),

    ];

    return (
        <BackButtonLayout title='Клиенты'>
            {loading && <Spinner />}
            {!loading && <>

                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <DataGrid
                        resizableColumns={true}
                        items={customers}
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
                        <DataGridBody<Customer>>
                            {({ item, rowId }) => (
                                <DataGridRow<Customer>
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
            </>}
        </BackButtonLayout>
    );
};

export default CustomersPage;
