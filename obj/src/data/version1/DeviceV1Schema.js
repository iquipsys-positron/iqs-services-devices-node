"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class DeviceV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('org_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('type', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('profile_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('status', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('version', pip_services3_commons_node_2.TypeCode.Integer);
        this.withRequiredProperty('udi', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('label', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('create_time', pip_services3_commons_node_2.TypeCode.DateTime);
        this.withOptionalProperty('deleted', pip_services3_commons_node_2.TypeCode.Boolean);
        this.withOptionalProperty('object_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('rec_time', pip_services3_commons_node_2.TypeCode.DateTime);
        this.withOptionalProperty('ping_time', pip_services3_commons_node_2.TypeCode.DateTime);
    }
}
exports.DeviceV1Schema = DeviceV1Schema;
//# sourceMappingURL=DeviceV1Schema.js.map