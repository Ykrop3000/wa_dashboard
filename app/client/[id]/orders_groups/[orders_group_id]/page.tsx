'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { FormContextType } from '@rjsf/utils';

import { apiManager } from '@/services';
import Detail from '@/components/Detail'
import {
    Spinner,
    DialogContent,
    DialogTitle,
    DialogBody,
    DialogSurface,
    Dialog,
    ToolbarButton,
    Button
} from '@fluentui/react-components';
import { DialogActions, DialogOpenChangeEventHandler } from '@fluentui/react-dialog'



const SendDialog: React.FC<{
    open: boolean | undefined;
    onOpenChange: DialogOpenChangeEventHandler;
    sendTaskId: string | undefined
    setSendTaskId: (task_id: string | undefined) => void
}> = ({ open, onOpenChange, sendTaskId, setSendTaskId }) => {

    const [done, setDone] = useState<boolean>(false)

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (sendTaskId) {
            intervalId = setInterval(async () => {
                try {
                    const taskStatus = await apiManager.getTaskStatus(sendTaskId);
                    if (taskStatus.status === 'SUCCESS') {
                        setDone(true)
                        setSendTaskId(undefined)
                    } else if (taskStatus.status === 'PENDING') {
                        setDone(true)
                        setSendTaskId(undefined)
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
    }, [sendTaskId]);

    const handleStop = async () => {
        if (sendTaskId) {
            await apiManager.stopTask(sendTaskId);
        } else {
            console.error('sendTaskId is undefined');
        }
    }

    return (
        <Dialog surfaceMotion={null} open={open} onOpenChange={onOpenChange}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Отправка...</DialogTitle>
                    <DialogContent>
                        {done ? "Done" : <Spinner />}
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="primary" onClick={handleStop}>Stop</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};


export default function OrdersGroupDetail() {
    const params = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState<FormContextType>({});
    const [sendDialogOpen, setSednDialogOpen] = useState<boolean>(false);
    const [sendTaskId, setSendTaskId] = useState<string | undefined>()


    const handleUpdate = async (data: FormContextType) => {
        console.log(data)
        // await apiManager.updateTemplate(Number(params.template_id), data);
    }
    const handleRemove = async () => {
        try {
            await apiManager.deleteOrdersGroup(Number(params.orders_group_id));
            router.push(`/client/${params.id}/orders_groups`)
        } catch (error) {
            console.error('Error remove orders group:', error);
        }

    }

    const send = async () => {
        const task_id = await apiManager.sendOrdersGroup(Number(params.orders_group_id))
        setSendTaskId(task_id)
        setSednDialogOpen(true)
    }

    return (
        <>
            <SendDialog
                open={sendDialogOpen}
                onOpenChange={(e, data) => setSednDialogOpen(data.open)}
                sendTaskId={sendTaskId}
                setSendTaskId={setSendTaskId}
            />
            <Detail
                title='Группа заказов'
                getSchema={async () => await apiManager.getOrdersGroupSchema()}
                getFormData={async () => await apiManager.getOrdersGroup(Number(params.orders_group_id))}
                setFormData={setFormData}
                handleRemove={handleRemove}
                handleUpdate={handleUpdate}
                formData={formData}
                toolbar={
                    <ToolbarButton
                        aria-label="Send"
                        appearance="primary"
                        onClick={send}
                    >
                        Отправить заказы
                    </ToolbarButton>
                }
            />
        </>
    );
} 