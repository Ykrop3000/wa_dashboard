import React, { RefObject, useEffect, useState } from "react";
import { Textarea, Label, Button } from "@fluentui/react-components";


const TemplateTextarea: React.FC<{
    value: string;
    onChange: (value: string) => void;
    label: string,
    textareaRef: RefObject<HTMLTextAreaElement>
    required?: boolean
    readonly?: boolean
}> = ({ value = "", onChange, label, textareaRef, readonly = false, required = false }) => {

    const [shortcuts] = useState([
        { label: "Имя клиента", text: "{{ customer.firstName or '-' }}" },
        { label: "Товар", text: "{% for product in products %}{{ product.attributes.name or '-' }} {% endfor %}" },
        { label: "Номер заказа", text: "{{ code or '-' }}" },
        { label: "Планируемая дата доставки", text: "{{plannedDeliveryDate}}" },
        { label: "Ссылки на отзыв", text: "{% for product in products %}https://kaspi.kz/shop/review/productreview?orderCode={{code}}=&productCode={{product.attributes.code}}&rating=5{% endfor %}" },
        { label: "Сумма заказа", text: "{{totalPrice}}" },
    ]);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const element = event.target;
        onChange(element.value);
    };

    const adjustWidth = (element: HTMLTextAreaElement) => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        element.style.height = "auto"; // Сброс ширины перед расчетом
        element.style.height = `${element.scrollHeight}px`; // Установка ширины по содержимому
        element.style.maxHeight = `${element.scrollHeight + 50}px`; // Установка ширины по содержимому

        window.scrollTo(0, scrollTop);
    };

    const insertText = (text: string) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue = value.substring(0, start) + text + value.substring(end);
            onChange(newValue);
            // Устанавливаем курсор после вставленного текста
            setTimeout(() => {
                textarea.setSelectionRange(start + text.length, start + text.length);
            }, 0);
        }
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
            <div style={{ marginTop: '10px', marginBottom: "10px" }}>
                {shortcuts.map((shortcut, index) => (
                    <Button
                        key={index}
                        onClick={() => insertText(shortcut.text)}
                        type="button"
                        disabled={readonly}
                        style={{ marginRight: '5px', marginBottom: '5px' }}
                    >
                        {shortcut.label}
                    </Button>
                ))}
            </div>
        </>
    );
};

export default TemplateTextarea;