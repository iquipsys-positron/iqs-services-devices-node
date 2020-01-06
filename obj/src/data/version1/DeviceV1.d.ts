import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class DeviceV1 implements IStringIdentifiable {
    id: string;
    org_id: string;
    type?: string;
    profile_id?: string;
    status?: string;
    version?: number;
    udi: string;
    label?: string;
    create_time?: Date;
    deleted?: boolean;
    object_id?: string;
    rec_time?: Date;
    ping_time?: Date;
}
