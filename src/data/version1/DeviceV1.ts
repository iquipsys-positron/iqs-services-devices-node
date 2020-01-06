import { IStringIdentifiable } from 'pip-services3-commons-node';

export class DeviceV1 implements IStringIdentifiable {
    public id: string;
    public org_id: string;
    public type?: string;
    public profile_id?: string;
    public status?: string;
    public version?: number;
    public udi: string;
    public label?: string;
    public create_time?: Date;
    public deleted?: boolean;
    public object_id?: string;
    public rec_time?: Date;
    public ping_time?: Date;
}