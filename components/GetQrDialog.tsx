'use client';

import {
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
    Button,
    Spinner
} from "@fluentui/react-components";

import { apiManager } from "@/services";
import { DialogOpenChangeEventHandler } from '@fluentui/react-dialog'
import { useState } from 'react';

const GetQrDialog: React.FC<{
    open: boolean | undefined;
    onOpenChange: DialogOpenChangeEventHandler;
    id: number
}> = ({ open, onOpenChange, id }) => {
    const [qr, setQr] = useState<string | undefined>()

    const getCode = async () => {
        try {
            const qr = await apiManager.getQR(id)
            setQr(qr)
        } catch (error) {
            console.log("Error bind whatsapp:", error)
        }
    }

    return (
        <Dialog surfaceMotion={null} open={open} onOpenChange={onOpenChange}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>QR Код:</DialogTitle>
                    <DialogContent>
                        {qr ? <img src={`data:image/png;base64, ${qr}`} alt="QR Code" /> : <Spinner />}

                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Закрыть</Button>
                        </DialogTrigger>
                        <Button appearance="primary" onClick={getCode}>Получить QR код</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default GetQrDialog;