import { IControlObjectsClientV1 } from 'iqs-clients-controlobjects-node';
import { DeviceV1 } from '../data/version1/DeviceV1';
export declare class ControlObjectsConnector {
    private _objectsClient;
    constructor(_objectsClient: IControlObjectsClientV1);
    setObject(correlationId: string, device: DeviceV1, callback: (err: any) => void): void;
    updateObjects(correlationId: string, oldDevice: DeviceV1, newDevice: DeviceV1, callback: (err: any) => void): void;
    unsetObject(correlationId: string, device: DeviceV1, callback: (err: any) => void): void;
}
