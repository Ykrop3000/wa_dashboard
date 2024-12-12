import React, { useEffect, useRef } from "react";
import { Textarea, Label } from "@fluentui/react-components";

const DynamicTextarea: React.FC<{
    value: string;
    onChange: (value: string) => void;
    label: string,
    required?: boolean
    readonly?: boolean
}> = ({ value = "", onChange, label, readonly = false, required = false }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const element = event.target;
        onChange(element.value);
    };

    const adjustWidth = (element: HTMLTextAreaElement) => {
        element.style.height = "auto"; // Сброс ширины перед расчетом
        element.style.height = `${element.scrollHeight}px`; // Установка ширины по содержимому
        element.style.maxHeight = `${element.scrollHeight + 50}px`; // Установка ширины по содержимому

    };

    useEffect(() => {
        if (textareaRef.current) {
            adjustWidth(textareaRef.current); // Установка ширины при загрузке компонента
        }
    }, [value]);

    return (
        <>
            <Label required={required}>{label}</Label>
            <Textarea
                ref={textareaRef}
                value={value}
                disabled={readonly}
                onChange={handleInput}
                style={{
                    minWidth: "50px", // Минимальная ширина
                    maxWidth: "100%", // Максимальная ширина
                    maxHeight: "auto",
                    resize: "none", // Отключение изменения размера пользователем
                    overflow: "hidden", // Убираем прокрутку
                }}
            />
        </>

    );
};

export default DynamicTextarea;
