import {PrinterModel} from "../model/printer-model";

class PrintJob {
    deviceModel: PrinterModel;
    data: string;
    resolve: () => void;
    reject: (err: any) => void;
}

export {PrintJob};