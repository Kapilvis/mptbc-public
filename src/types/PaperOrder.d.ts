declare namespace PaperOrder {
  type OrderStatus = "Approved" | "Pending" | "In Process" | "Rejected";

  interface PaperSupplyOrderItem {
    orderId: number;
    orderNo: string;
    orderDate: string;
    vendorId: number;
    vendorName: string;
    paperMillName: string;
    paperTypeId: string;
    paperType: string;
    orderedQtyMT: number;
    ratePerMT: number;
    basicAmount: number;
    gstPercent: number;
    totalAmount: number;
    deliveryLocation: string;
    deliveryDate: string;
    millBillNo?: string;
    billDate?: string;
    billCopyPath?: string;
    isActive: boolean;
    status: OrderStatus;
    createdDate?: string;
  }

  interface PaperSupplyOrderForm {
    orderNo: string;
    orderDate: string;
    vendorId: number;
    vendorName: string;
    paperMillName: string;
    paperTypeId: string;
    paperType: string;
    orderedQtyMT: number;
    ratePerMT: number;
    basicAmount: number;
    gstPercent: number;
    totalAmount: number;
    deliveryLocation: string;
    deliveryDate: string;
    millBillNo?: string;
    billDate?: string;
    billCopyPath?: string;
  }

  interface Filter {
    vendorId?: number;
    paperType?: string;
    status?: string;
    search?: string;
  }
}
