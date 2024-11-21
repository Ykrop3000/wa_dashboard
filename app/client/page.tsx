'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    Badge,
    OnSelectionChangeData,
} from '@fluentui/react-components';
import {
    StopRegular,
    DeleteRegular,
    CheckmarkCircleRegular,
    DismissCircleRegular,
    BeakerRegular,
    OpenRegular,
} from '@fluentui/react-icons';

import { User } from '@/types/user'
import { apiManager } from '@/services';


const ClientDashboard: React.FC = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsClient(true);
        (async () => {
            await fetchUsers();
            setLoading(false);
        })();
    }, []);

    const fetchUsers = async () => {
        try {
            const users = await apiManager.getUsers();
            setUsers(users)
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    }

    const columns: TableColumnDefinition<User>[] = [
        createTableColumn<User>({
            columnId: 'id',
            compare: (a, b) => a.id - b.id,
            renderHeaderCell: () => 'Id',
            renderCell: (item) => item.id,
        }),
        createTableColumn<User>({
            columnId: 'name',
            compare: (a, b) => a.name.localeCompare(b.name),
            renderHeaderCell: () => 'Name',
            renderCell: (item) => item.name,
        }),
        createTableColumn<User>({
            columnId: 'phone',
            compare: (a, b) => a.phone.localeCompare(b.phone),
            renderHeaderCell: () => 'Phone',
            renderCell: (item) => item.phone,
        }),
        createTableColumn<User>({
            columnId: 'authorized',
            compare: (a, b) => (a.authorized === b.authorized ? 0 : a.authorized ? -1 : 1),
            renderHeaderCell: () => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckmarkCircleRegular />
                    Authorized
                </div>
            ),
            renderCell: (item) => (
                <Badge
                    appearance="filled"
                    color={item.authorized ? 'success' : 'danger'}
                >
                    {item.authorized ? 'Yes' : 'No'}
                </Badge>
            ),
        }),
        createTableColumn<User>({
            columnId: 'disable',
            compare: (a, b) => (a.disable === b.disable ? 0 : a.disable ? -1 : 1),
            renderHeaderCell: () => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <DismissCircleRegular />
                    Disabled
                </div>
            ),
            renderCell: (item) => (
                <Badge
                    appearance="filled"
                    color={item.disable ? 'danger' : 'success'}
                >
                    {item.disable ? 'Yes' : 'No'}
                </Badge>
            ),
        }),
        createTableColumn<User>({
            columnId: 'test',
            compare: (a, b) => (a.test === b.test ? 0 : a.test ? -1 : 1),
            renderHeaderCell: () => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BeakerRegular />
                    Test
                </div>
            ),
            renderCell: (item) => (
                <Badge
                    appearance="filled"
                    color={item.test ? 'danger' : 'success'}
                >
                    {item.test ? 'Yes' : 'No'}
                </Badge>
            ),
        }),
        createTableColumn<User>({
            columnId: 'count_messages_sent',
            compare: (a, b) => (a.count_messages_sent ?? 0) - (b.count_messages_sent ?? 0),
            renderHeaderCell: () => 'Messages today',
            renderCell: (item) => item.count_messages_sent,
        }),
        createTableColumn<User>({
            columnId: "openAction",
            renderHeaderCell: () => {
                return "Open";
            },
            renderCell: (item) => {
                return <Button
                    icon={<OpenRegular />}
                    onClick={() => router.push(`/client/${item.id}`)}
                >
                    Open
                </Button>;
            },
        }),
    ];

    const handleSelectionChange = (
        e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
        data: OnSelectionChangeData
    ) => {
        setSelectedItems(data.selectedItems);
    };


    const handleStop = async () => {
        const selectedIds = Array.from(selectedItems).map(Number);
        try {
            console.log('Stopping clients:', selectedIds);
            for (const selectedId of selectedIds) {
                const user = users[selectedId];
                const fetchedUser = await apiManager.getUser(user.id);
                fetchedUser.disable = true;
                await apiManager.updateUser(user.id, fetchedUser);
            }
            await fetchUsers()
            setSelectedItems(new Set());
        } catch (error) {
            console.error('Error stopping clients:', error);
        }
    };

    const handleRemove = async () => {
        const selectedIds = Array.from(selectedItems).map(Number);
        try {
            console.log('Removing clients:', selectedIds);
            for (let selectedId of selectedIds) {
                const userId = users[selectedId].id;
                await apiManager.deleteUser(userId);
                setUsers(users.filter(i => i.id != userId));
            }
            setSelectedItems(new Set()); // Reset selection
        } catch (error) {
            console.error('Error removing clients:', error);
        }
    };

    const handleStart = async () => {
        const selectedIds = Array.from(selectedItems).map(Number);
        try {
            console.log('Starting clients:', selectedIds);
            for (let selectedId of selectedIds) {
                const user = users[selectedId];
                const fetchedUser = await apiManager.getUser(user.id);
                fetchedUser.disable = false; // Enable the user
                await apiManager.updateUser(user.id, fetchedUser);
            }
            await fetchUsers();
            setSelectedItems(new Set()); // Reset selection
        } catch (error) {
            console.error('Error starting clients:', error);
        }
    };



    if (!isClient) {
        return null; // or return a loading state
    }

    return (
        <div>
            <div style={{
                marginBottom: '1rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
            }}>
                <Button appearance="primary"
                    onClick={() => router.push('/client/create')}
                >
                    Add New Client
                </Button>
                {selectedItems.size > 0 && (
                    <>
                        <Button
                            appearance="secondary"
                            icon={<StopRegular />}
                            onClick={handleStop}
                        >
                            Stop Selected
                        </Button>
                        <Button
                            appearance="secondary"
                            icon={<CheckmarkCircleRegular />}
                            onClick={handleStart}
                        >
                            Start Selected
                        </Button>
                        <Button
                            appearance="secondary"
                            icon={<DeleteRegular />}
                            onClick={handleRemove}
                        >
                            Remove Selected
                        </Button>

                    </>
                )}
            </div>
            <DataGrid
                items={users}
                columns={columns}
                sortable
                selectionMode="multiselect"
                selectedItems={selectedItems}
                onSelectionChange={handleSelectionChange}
            >
                <DataGridHeader>
                    <DataGridRow>
                        {({ renderHeaderCell }) => (
                            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                        )}
                    </DataGridRow>
                </DataGridHeader>
                {loading &&
                    <Spinner />
                }
                {!loading && <DataGridBody<User>>
                    {({ item, rowId }) => (
                        <DataGridRow<User>
                            key={rowId}
                            selectionCell={{
                                checkboxIndicator: { "aria-label": "Select row" },
                            }}
                        >
                            {({ renderCell }) => (
                                <DataGridCell>{renderCell(item)}</DataGridCell>
                            )}
                        </DataGridRow>
                    )}
                </DataGridBody>}
            </DataGrid>
        </div>
    );
};

export default ClientDashboard;