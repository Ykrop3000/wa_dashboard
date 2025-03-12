'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FormContextType } from '@rjsf/utils';
import { apiManager } from '@/services';
import Detail from '@/components/Detail';
import { Dialog, Spinner, DialogTitle, DialogContent, DialogActions, Button, DialogBody, DialogSurface, ToolbarButton } from '@fluentui/react-components';

export default function TemplateDetail() {
    const params = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState<FormContextType>({});
    const [previewData, setPreviewData] = useState<string | null>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUpdate = async (data: FormContextType) => {
        await apiManager.updateTemplate(Number(params.template_id), data);
    }
    const handleRemove = async () => {
        try {
            await apiManager.deleteTemplate(Number(params.template_id));
            router.push(`/client/${params.id}/templates`)
        } catch (error) {
            console.error('Error remove template:', error);
        }
    }

    const openModal = async () => {
        setIsModalOpen(true);
        const preview = await apiManager.previewTemplate(Number(params.id), formData)
        setPreviewData(preview)

    }
    const closeModal = () => {
        setPreviewData(null)
        setIsModalOpen(false)
    };

    return (
        <>
            <Detail
                title='Шаблон'
                getSchema={async () => await apiManager.getTemplateSchema()}
                getFormData={async () => await apiManager.getTemplate(Number(params.template_id))}
                setFormData={setFormData}
                handleRemove={handleRemove}
                handleUpdate={handleUpdate}
                formData={formData}
                toolbar={<ToolbarButton
                    aria-label="Template pro mod"
                    onClick={openModal}
                    style={{ marginRight: "5px" }}
                >
                    Предпросмотр
                </ToolbarButton>}
            />

            <Dialog open={isModalOpen} onOpenChange={closeModal} surfaceMotion={null}>
                <DialogSurface>

                    <DialogBody>
                        <DialogTitle>Предпросмотр</DialogTitle>
                        <DialogContent>
                            {!previewData && <Spinner />}
                            <pre>{previewData}</pre>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeModal}>Close</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>

            </Dialog>
        </>
    );
} 