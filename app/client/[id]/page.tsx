'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
    ToolbarDivider,
    MenuList,
    ToolbarButton,
    MenuTrigger,
    MenuItem,
    Menu,
    MenuPopover,
    Button,
} from '@fluentui/react-components';
import { MoreHorizontal24Filled, AlignBottom24Regular } from "@fluentui/react-icons"
import { FormContextType } from '@rjsf/utils';

import { apiManager } from '@/services';
import Detail from '@/components/Detail'
import ArrayFieldItemTemplateCustom from '@/components/templates/ArrayFieldItemTemplateCustom'




export default function UserDetail() {
    const params = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState<FormContextType>({});



    const handleUpdate = async (data: FormContextType) => {
        try {
            await apiManager.updateUser(Number(params.id), data);
        } catch (error) {
            console.error('Error update client:', error);
        }

    }
    const handleRemove = async () => {
        try {
            await apiManager.deleteUser(Number(params.id));
            router.push('/client')
        } catch (error) {
            console.error('Error remove client:', error);
        }

    }


    return (
        <>
            <Detail
                title='Клиент'
                getSchema={async () => await apiManager.getUserSchema()}
                getFormData={async () => await apiManager.getUser(Number(params.id))}
                setFormData={setFormData}
                handleRemove={handleRemove}
                handleUpdate={handleUpdate}
                formData={formData}
                arrayFieldItemTemplate={ArrayFieldItemTemplateCustom}
                toolbar={<>
                    {/* {(!formData.green_api_instance_id || !formData.green_api_instance_token) &&
                        <ToolbarButton
                            aria-label="Create whatsapp instance"
                            appearance='transparent'
                            onClick={bindWhatsapp}
                        >
                            Create whatsapp instance
                        </ToolbarButton>
                    } */}

                    <ToolbarDivider />
                    <Menu>
                        <MenuTrigger>
                            <ToolbarButton aria-label="More" icon={<MoreHorizontal24Filled />} />
                        </MenuTrigger>

                        <MenuPopover>
                            <MenuList>
                                <MenuItem onClick={() => router.push(`/client/${params.id}/orders`)}>
                                    Заказы
                                </MenuItem>
                                <MenuItem onClick={() => router.push(`/client/${params.id}/reviews`)}>
                                    Отзывы
                                </MenuItem>
                                <MenuItem onClick={() => router.push(`/client/${params.id}/customers`)}>
                                    Клиенты
                                </MenuItem>
                                <MenuItem onClick={() => router.push(`/client/${params.id}/templates`)}>
                                    Шаблоны
                                </MenuItem>
                                <MenuItem onClick={() => router.push(`/client/${params.id}/period_notification`)}>
                                    Создать группу заказов за период
                                </MenuItem>
                                <MenuItem onClick={() => router.push(`/client/${params.id}/orders_groups`)}>
                                    Группы заказов
                                </MenuItem>

                            </MenuList>
                        </MenuPopover>
                    </Menu>

                    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                        <Button
                            icon={<AlignBottom24Regular />}
                            aria-label='Аналитика'
                            onClick={() => router.push(`/client/${params.id}/stat`)}
                        />
                    </div>
                </>}
            />
        </>
    );
} 