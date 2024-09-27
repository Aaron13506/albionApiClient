export interface getPricesInterface {
    location: string;
    item_id:  string;
    quality:  number;
    data:     Data;
}


export interface Data {
    timestamps: Date[];
    prices_avg: number[];
    item_count: number[];
}