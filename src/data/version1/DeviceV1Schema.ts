import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class DeviceV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('id', TypeCode.String);
        this.withRequiredProperty('org_id', TypeCode.String);
        this.withOptionalProperty('type', TypeCode.String);
        this.withOptionalProperty('profile_id', TypeCode.String);
        this.withOptionalProperty('status', TypeCode.String);
        this.withOptionalProperty('version', TypeCode.Integer);
        this.withRequiredProperty('udi', TypeCode.String);
        this.withOptionalProperty('label', TypeCode.String);
        this.withOptionalProperty('create_time', TypeCode.DateTime);
        this.withOptionalProperty('deleted', TypeCode.Boolean);
        this.withOptionalProperty('object_id', TypeCode.String);
        this.withOptionalProperty('rec_time', TypeCode.DateTime);
        this.withOptionalProperty('ping_time', TypeCode.DateTime);
    }
}
