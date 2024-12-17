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
} from '@fluentui/react-components';
import { MoreHorizontal24Filled } from "@fluentui/react-icons"
import { FormContextType } from '@rjsf/utils';

import { apiManager } from '@/services';
import Detail from '@/components/Detail'
import GetCodeDialog from '@/components/GetCodeDialog'

export default function UserDetail() {
    const params = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState<FormContextType>({});
    const [codeDialogOpen, setCodeDialogOpen] = useState<boolean>(false);


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

    const bindWhatsapp = async () => {
        try {
            await apiManager.bindWhatsapp(Number(params.id))
        } catch (error) {
            console.log("Error bind whatsapp:", error)
        }
    }


    return (
        <>
            <GetCodeDialog open={codeDialogOpen} onOpenChange={(e, data) => setCodeDialogOpen(data.open)} />
            <Detail
                title='Клиент'
                getSchema={async () => await apiManager.getUserSchema()}
                getFormData={async () => await apiManager.getUser(Number(params.id))}
                setFormData={setFormData}
                handleRemove={handleRemove}
                handleUpdate={handleUpdate}
                formData={formData}
                toolbar={<>
                    {(!formData.green_api_instance_id || !formData.green_api_instance_token) &&
                        <ToolbarButton
                            aria-label="Create whatsapp instance"
                            appearance='transparent'
                            onClick={bindWhatsapp}
                        >
                            Create whatsapp instance
                        </ToolbarButton>
                    }

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
                                <MenuItem onClick={() => router.push(`/client/${params.id}/templates`)}>
                                    Шаблоны
                                </MenuItem>
                                <MenuItem onClick={() => router.push(`/client/${params.id}/period_notification`)}>
                                    Создать группу заказов за период
                                </MenuItem>
                                <MenuItem onClick={() => router.push(`/client/${params.id}/orders_groups`)}>
                                    Группы заказов
                                </MenuItem>
                                <MenuItem onClick={() => setCodeDialogOpen(true)}>
                                    Получить код
                                </MenuItem>
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                </>}
            />
        </>
    );
} 