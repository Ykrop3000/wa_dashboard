
import { Card } from '@fluentui/react-components';
import { JsonPathPicker } from "react-json-path-picker"



const json_example = {
    "code": "406352533",
    "totalPrice": 21399.0,
    "paymentMode": "PAY_WITH_CREDIT",
    "creationDate": 1725362998405,
    "deliveryCostForSeller": 1231.0,
    "isKaspiDelivery": true,
    "deliveryMode": "DELIVERY_PICKUP",
    "signatureRequired": false,
    "creditTerm": 6,
    "preOrder": false,
    "pickupPointId": "15843453_PP2",
    "state": "KASPI_DELIVERY",
    "assembled": true,
    "approvedByBankDate": 1725363063281,
    "status": "ACCEPTED_BY_MERCHANT",
    "customer": {
        "id": "Nzc1NjY5MTQ5NQ",
        "name": null,
        "cellPhone": "7756691495",
    },
    "deliveryCost": 0.0
}


const JsonDataPicker: React.FC<{ onInsert: (text: string) => void }> = ({ onInsert }) => {
    const insertText = (text: string) => {
        text = text.replaceAll('"', '');
        text = text.replace(".", "");
        text = "{{ " + text + " }}";
        onInsert(text);
    };

    return <Card style={{ marginTop: "20px" }}>
        <JsonPathPicker json={JSON.stringify(json_example)} onChoose={insertText} />
    </Card>

};

export default JsonDataPicker;