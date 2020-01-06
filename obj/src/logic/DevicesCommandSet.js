"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const DeviceV1Schema_1 = require("../data/version1/DeviceV1Schema");
class DevicesCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetDevicesCommand());
        this.addCommand(this.makeGetDeviceByIdCommand());
        this.addCommand(this.makeGetDeviceByUdiCommand());
        this.addCommand(this.makeGetOrCreateDeviceCommand());
        this.addCommand(this.makeCreateDeviceCommand());
        this.addCommand(this.makeUpdateDeviceCommand());
        this.addCommand(this.makeDeleteDeviceByIdCommand());
        this.addCommand(this.makeSetObjectCommand());
        this.addCommand(this.makeUnsetObjectCommand());
    }
    makeGetDevicesCommand() {
        return new pip_services3_commons_node_2.Command("get_devices", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getDevices(correlationId, filter, paging, callback);
        });
    }
    makeGetDeviceByIdCommand() {
        return new pip_services3_commons_node_2.Command("get_device_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('device_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let device_id = args.getAsString("device_id");
            this._logic.getDeviceById(correlationId, device_id, callback);
        });
    }
    makeGetDeviceByUdiCommand() {
        return new pip_services3_commons_node_2.Command("get_device_by_udi", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('org_id', pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty('udi', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let org_id = args.getAsString("org_id");
            let udi = args.getAsString("udi");
            this._logic.getDeviceByUdi(correlationId, org_id, udi, callback);
        });
    }
    makeGetOrCreateDeviceCommand() {
        return new pip_services3_commons_node_2.Command("get_or_create_device", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('org_id', pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty('udi', pip_services3_commons_node_6.TypeCode.String)
            .withOptionalProperty('type', pip_services3_commons_node_6.TypeCode.String)
            .withOptionalProperty('version', pip_services3_commons_node_6.TypeCode.Integer), (correlationId, args, callback) => {
            let org_id = args.getAsString("org_id");
            let udi = args.getAsString("udi");
            let type = args.getAsString("type");
            let version = args.getAsNullableInteger("version");
            this._logic.getOrCreateDevice(correlationId, org_id, type, version, udi, callback);
        });
    }
    makeCreateDeviceCommand() {
        return new pip_services3_commons_node_2.Command("create_device", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('device', new DeviceV1Schema_1.DeviceV1Schema()), (correlationId, args, callback) => {
            let device = args.get("device");
            this._logic.createDevice(correlationId, device, callback);
        });
    }
    makeUpdateDeviceCommand() {
        return new pip_services3_commons_node_2.Command("update_device", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('device', new DeviceV1Schema_1.DeviceV1Schema()), (correlationId, args, callback) => {
            let device = args.get("device");
            this._logic.updateDevice(correlationId, device, callback);
        });
    }
    makeDeleteDeviceByIdCommand() {
        return new pip_services3_commons_node_2.Command("delete_device_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('device_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let deviceId = args.getAsNullableString("device_id");
            this._logic.deleteDeviceById(correlationId, deviceId, callback);
        });
    }
    makeSetObjectCommand() {
        return new pip_services3_commons_node_2.Command("set_object", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('device_id', pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty('object_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let deviceId = args.getAsNullableString("device_id");
            let objectId = args.getAsNullableString("object_id");
            this._logic.setObject(correlationId, deviceId, objectId, callback);
        });
    }
    makeUnsetObjectCommand() {
        return new pip_services3_commons_node_2.Command("unset_object", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('device_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let deviceId = args.getAsNullableString("device_id");
            this._logic.unsetObject(correlationId, deviceId, callback);
        });
    }
}
exports.DevicesCommandSet = DevicesCommandSet;
//# sourceMappingURL=DevicesCommandSet.js.map