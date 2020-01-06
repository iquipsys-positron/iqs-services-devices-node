import { DeviceV1 } from '../data/version1/DeviceV1';
export declare class ControlObjectsConnector {
    private _objectsClient;
    constructor(_objectsClient: object);
    setObject(correlationId: string, device: DeviceV1, callback: (err: any) => void): void;
    updateObjects(correlationId: string, oldDevice: DeviceV1, newDevice: DeviceV1, callback: (err: any) => void): void;
    unsetObject(correlationId: string, device: DeviceV1, callback: (err: any) => void): void;
}
