import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DeviceV1 } from '../data/version1/DeviceV1';
export interface IDevicesController {
    getDevices(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<DeviceV1>) => void): void;
    getDeviceById(correlationId: string, device_id: string, callback: (err: any, device: DeviceV1) => void): void;
    getDeviceByUdi(correlationId: string, org_id: string, udi: string, callback: (err: any, device: DeviceV1) => void): void;
    getOrCreateDevice(correlationId: string, org_id: string, type: string, version: number, udi: string, callback: (err: any, device: DeviceV1) => void): void;
    createDevice(correlationId: string, device: DeviceV1, callback: (err: any, device: DeviceV1) => void): void;
    updateDevice(correlationId: string, device: DeviceV1, callback: (err: any, device: DeviceV1) => void): void;
    deleteDeviceById(correlationId: string, device_id: string, callback: (err: any, device: DeviceV1) => void): void;
    setObject(correlationId: string, device_id: string, object_id: string, callback: (err: any, device: DeviceV1) => void): void;
    unsetObject(correlationId: string, device_id: string, callback: (err: any, device: DeviceV1) => void): void;
}
