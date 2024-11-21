'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
    Card,
    CardHeader,
    Text,
    Label,
    Spinner,
    makeStyles,
    Button,
} from '@fluentui/react-components';

import BackButtonLayout from '@/components/ui/layouts/back_button_layout'
import { User } from '@/types/user';
import { apiManager } from '@/services';
import SwitchableInput from '@/components/ui/fields/editable_field'

const useStyles = makeStyles({

    section: {
        marginBottom: '20px',
        padding: '16px',
    },
    field: {
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gap: '16px',
        marginBottom: '8px',
    },
    label: {
        fontWeight: 'bold',
    },
});

export default function UserDetail() {
    const styles = useStyles();
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<Partial<User>>({});
    const [isEditing, setEditing] = useState<boolean>(false)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await apiManager.getUser(Number(params.id));
                setUser(user);
            } catch {
                setError('An error occurred while fetching user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [params.id]);

    const handleOnChangeField = (name: string, value: string | boolean | number) => {
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
        console.log(user)
    }

    const handleSave = async () => {
        await apiManager.updateUser(Number(params.id), user);
        setEditing(false)
    }

    if (error) return <Text color="red">{error}</Text>;
    if (!user) return <Text>User not found</Text>;

    return (
        <BackButtonLayout title='Client detail'>
            {loading && <Spinner />}
            {!loading && <>
                <Button
                    appearance="primary"
                    onClick={() => setEditing(!isEditing)}
                    style={{ marginBottom: '10px', marginRight: '10px' }}
                >
                    Edit
                </Button>
                <Button
                    appearance="secondary"
                    onClick={() => router.push(`/client/${params.id}/orders`)}
                    style={{ marginBottom: '10px', marginRight: '10px' }}
                >
                    Orders
                </Button>
                <Button
                    appearance="secondary"
                    onClick={() => router.push(`/client/${params.id}/templates`)}
                    style={{ marginBottom: '10px', marginRight: '10px' }}
                >
                    Templates
                </Button>
                {isEditing &&
                    <Button
                        appearance="primary"
                        onClick={handleSave}
                        style={{ marginBottom: '10px' }}
                    >
                        Save
                    </Button>
                }
                <Card className={styles.section}>
                    <CardHeader header={<Text size={500}>{user.name}</Text>} />
                    <div className={styles.field}>
                        <Label className={styles.label}>Phone</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            initialValue={user.phone || ''}
                            onChange={handleOnChangeField}
                            name='phone'
                        />
                    </div>
                </Card>

                <Card className={styles.section}>
                    <CardHeader header={<Text size={400}>Notification Settings</Text>} />
                    <div className={styles.field}>
                        <Label className={styles.label}>Start Time</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            initialValue={user.start_notification_time?.toString() || ''}
                            onChange={handleOnChangeField}
                            name='start_notification_time'
                        />
                    </div>
                    <div className={styles.field}>
                        <Label className={styles.label}>End Time</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            initialValue={user.end_notification_time?.toString() || ''}
                            onChange={handleOnChangeField}
                            name='end_notification_time'
                        />
                    </div>
                </Card>

                <Card className={styles.section}>
                    <CardHeader header={<Text size={400}>Categories</Text>} />
                    <div className={styles.field}>
                        <Label className={styles.label}>Include Categories</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            initialValue={user.include_category?.join(', ') || ''}
                            onChange={handleOnChangeField}
                            name='include_category'
                        />
                    </div>
                    <div className={styles.field}>
                        <Label className={styles.label}>Exclude Categories</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            initialValue={user.exclude_category?.join(', ') || ''}
                            onChange={handleOnChangeField}
                            name='exclude_category'
                        />
                    </div>
                </Card>

                <Card className={styles.section}>
                    <CardHeader header={<Text size={400}>Telegram Settings</Text>} />
                    <div className={styles.field}>
                        <Label className={styles.label}>Telegram ID</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            initialValue={user.telegram_id || ''}
                            onChange={handleOnChangeField}
                            name='telegram_id'
                        />
                    </div>
                    <div className={styles.field}>
                        <Label className={styles.label}>Telegram password</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            initialValue={user.telegram_password || ''}
                            onChange={handleOnChangeField}
                            name='telegram_password'
                        />
                    </div>
                </Card>


                <Card className={styles.section}>
                    <CardHeader header={<Text size={400}>Kaspi Settings</Text>} />
                    <div className={styles.field}>
                        <Label className={styles.label}>Username</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            initialValue={user.kaspi_username || ''}
                            onChange={handleOnChangeField}
                            name='kaspi_username'
                        />
                    </div>
                    <div className={styles.field}>
                        <Label className={styles.label}>Password</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            initialValue={user.kaspi_password || ''}
                            onChange={handleOnChangeField}
                            name='kaspi_password'
                        />
                    </div>
                    <div className={styles.field}>
                        <Label className={styles.label}>API Key</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            initialValue={user.kaspi_api_key || ''}
                            onChange={handleOnChangeField}
                            name='kaspi_api_key'
                        />
                    </div>
                </Card>

                <Card className={styles.section}>
                    <CardHeader header={<Text size={400}>Green API Settings</Text>} />
                    <div className={styles.field}>
                        <Label className={styles.label}>Instance ID</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            initialValue={user.green_api_instance_id || ''}
                            onChange={handleOnChangeField}
                            name='green_api_instance_id'
                        />
                    </div>
                    <div className={styles.field}>
                        <Label className={styles.label}>Instance Token</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            initialValue={user.green_api_instance_token || ''}
                            onChange={handleOnChangeField}
                            name='green_api_instance_token'
                        />
                    </div>
                    <div className={styles.field}>
                        <Label className={styles.label}>URL</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            initialValue={user.green_api_url || ''}
                            onChange={handleOnChangeField}
                            name='green_api_url'
                        />
                    </div>
                    <div className={styles.field}>
                        <Label className={styles.label}>Media URL</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            initialValue={user.green_api_media_url || ''}
                            onChange={handleOnChangeField}
                            name='green_api_media_url'
                        />
                    </div>
                </Card>

                <Card className={styles.section}>
                    <CardHeader header={<Text size={400}>Status</Text>} />
                    <div className={styles.field}>
                        <Label className={styles.label}>Authorized</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            isBoolean={true}
                            initialValue={user.authorized || false}
                            onChange={handleOnChangeField}
                            name='authorized'
                        />
                    </div>
                    <div className={styles.field}>
                        <Label className={styles.label}>Disabled</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            isBoolean={true}
                            initialValue={user.disable || false}
                            onChange={handleOnChangeField}
                            name='disable'
                        />
                    </div>
                    <div className={styles.field}>
                        <Label className={styles.label}>Test Mode</Label>
                        <SwitchableInput
                            isEditing={isEditing}
                            isBoolean={true}
                            initialValue={user.test || false}
                            onChange={handleOnChangeField}
                            name='test'
                        />
                    </div>
                </Card>
            </>}
        </BackButtonLayout>
    );
} 