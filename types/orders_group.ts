import { Order } from "./order";
import { Template } from "./template";

export interface OrdersGroup {
    id: number;
    name: string;
    user_id: number;
    total_orders: number;
    template: Template;
}