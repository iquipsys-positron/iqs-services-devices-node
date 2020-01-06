import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';
import { DeviceV1 } from '../data/version1/DeviceV1';
import { IDevicesPersistence } from './IDevicesPersistence';
export declare class DevicesMemoryPersistence extends IdentifiableMemoryPersistence<DeviceV1, string> implements IDevicesPersistence {
    constructor();
    private matchString;
    private matchSearch;
    private contains;
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<DeviceV1>) => void): void;
    getOneByUdi(correlationId: string, orgId: string, udi: string, callback: (err: any, item: DeviceV1) => void): void;
}
