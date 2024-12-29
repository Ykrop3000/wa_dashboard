'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
    ToolbarDivider,
    MenuList,
    ToolbarButton,
    MenuTrigger,
    MenuItem,
    Menu,
    MenuPopover,
    DialogContent,
    DialogBody,
    DialogSurface,
    DialogTitle,
    Dialog,
    Spinner,
} from '@fluentui/react-components';
import { DialogOpenChangeEventHandler } from '@fluentui/react-dialog'
import { MoreHorizontal24Filled } from "@fluentui/react-icons"
import { FormContextType } from '@rjsf/utils';

import { apiManager } from '@/services';
import Detail from '@/components/Detail'
import GetCodeDialog from '@/components/GetCodeDialog'



const CreateInstanceDialog: React.FC<{
    open: boolean | undefined;
    onOpenChange: DialogOpenChangeEventHandler;
}> = ({ open, onOpenChange }) => {
    return (
        <Dialog surfaceMotion={null} open={open} onOpenChange={onOpenChange}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Создание инстанса...</DialogTitle>
                    <DialogContent>
                        <Spinner />
                    </DialogContent>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};


export default function UserDetail() {
    const params = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState<FormContextType>({});
    const [codeDialogOpen, setCodeDialogOpen] = useState<boolean>(false);
    const [instanceDilogOpen, setInstanceDialogOpen] = useState<boolean>(false);
    const [createInstanceTaskId, setCreateInstanceTaskId] = useState<string>()


    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (createInstanceTaskId) {
            intervalId = setInterval(async () => {
                try {
                    const taskStatus = await apiManager.getTaskStatus(createInstanceTaskId);
                    if (taskStatus.status === 'SUCCESS') {
                        setInstanceDialogOpen(false);
                        setCreateInstanceTaskId(undefined);
                        router.refresh();
                    } else if (taskStatus.status === 'PENDING') {
                        setInstanceDialogOpen(false);
                        setCreateInstanceTaskId(undefined);
                    }
                } catch (error) {
                    console.error('Error checking task status:', error);
                }
            }, 2000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [createInstanceTaskId, router]);

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
            setInstanceDialogOpen(true);
            const taskId = await apiManager.bindWhatsapp(Number(params.id));
            setCreateInstanceTaskId(taskId);
        } catch (error) {
            console.log("Error bind whatsapp:", error)
        }
    }


    return (
        <>
            <GetCodeDialog open={codeDialogOpen} onOpenChange={(e, data) => setCodeDialogOpen(data.open)} />
            <CreateInstanceDialog open={instanceDilogOpen} onOpenChange={(e, data) => setInstanceDialogOpen(data.open)} />
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