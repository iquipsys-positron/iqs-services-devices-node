import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';
import { IWriter } from 'pip-services3-data-node';
import { DeviceV1 } from '../data/version1/DeviceV1';
export interface IDevicesPersistence extends IGetter<DeviceV1, string>, IWriter<DeviceV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<DeviceV1>) => void): void;
    getOneById(correlationId: string, id: string, callback: (err: any, item: DeviceV1) => void): void;
    getOneByUdi(correlationId: string, org_id: string, udi: string, callback: (err: any, item: DeviceV1) => void): void;
    create(correlationId: string, item: DeviceV1, callback: (err: any, item: DeviceV1) => void): void;
    update(correlationId: string, item: DeviceV1, callback: (err: any, item: DeviceV1) => void): void;
    deleteById(correlationId: string, id: string, callback: (err: any, item: DeviceV1) => void): void;
}
