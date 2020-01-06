import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';
import { DevicesMemoryPersistence } from './DevicesMemoryPersistence';
import { DeviceV1 } from '../data/version1/DeviceV1';
export declare class DevicesFilePersistence extends DevicesMemoryPersistence {
    protected _persister: JsonFilePersister<DeviceV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
