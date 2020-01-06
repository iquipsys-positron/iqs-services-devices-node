"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const DeviceTypeV1_1 = require("../data/version1/DeviceTypeV1");
const DeviceStatusV1_1 = require("../data/version1/DeviceStatusV1");
const UdiConverter_1 = require("../data/version1/UdiConverter");
const DevicesCommandSet_1 = require("./DevicesCommandSet");
const ControlObjectsConnector_1 = require("./ControlObjectsConnector");
const pip_clients_msgtemplates_node_1 = require("pip-clients-msgtemplates-node");
const MessageConnector_1 = require("./MessageConnector");
class DevicesController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(DevicesController._defaultConfig);
        this._templatesResolver = new pip_clients_msgtemplates_node_1.MessageTemplatesResolverV1();
        this._logger = new pip_services3_components_node_1.CompositeLogger();
    }
    configure(config) {
        config = config.setDefaults(DevicesController._defaultConfig);
        this._dependencyResolver.configure(config);
        this._templatesResolver.configure(config);
        this._logger.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._logger.setReferences(references);
        this._templatesResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
        this._smsClient = this._dependencyResolver.getOneOptional('smsdelivery');
        this._organizationsClient = this._dependencyResolver.getOneRequired('organizations');
        this._objectsClient = this._dependencyResolver.getOneOptional('control-objects');
        this._objectsConnector = new ControlObjectsConnector_1.ControlObjectsConnector(this._objectsClient);
        this._messageConnector = new MessageConnector_1.MessageConnector(this._logger, 
        // this._messageResolver,
        this._templatesResolver, this._smsClient);
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new DevicesCommandSet_1.DevicesCommandSet(this);
        return this._commandSet;
    }
    getDevices(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    getDeviceById(correlationId, id, callback) {
        this._persistence.getOneById(correlationId, id, callback);
    }
    getDeviceByUdi(correlationId, org_id, udi, callback) {
        udi = UdiConverter_1.UdiConverter.fromString(udi);
        this._persistence.getOneByUdi(correlationId, org_id, udi, callback);
    }
    getOrCreateDevice(correlationId, org_id, type, version, udi, callback) {
        let device;
        udi = UdiConverter_1.UdiConverter.fromString(udi);
        async.series([
            (callback) => {
                this._persistence.getOneByUdi(correlationId, org_id, udi, (err, data) => {
                    device = data;
                    callback(err);
                });
            },
            (callback) => {
                if (device == null) {
                    device = {
                        id: pip_services3_commons_node_5.IdGenerator.nextLong(),
                        org_id: org_id,
                        object_id: null,
                        type: type || DeviceTypeV1_1.DeviceTypeV1.Unknown,
                        version: version,
                        udi: udi,
                        create_time: new Date(),
                        status: DeviceStatusV1_1.DeviceStatusV1.Pending
                    };
                    this._persistence.create(correlationId, device, (err, data) => {
                        device = data;
                        callback(err);
                    });
                }
                else
                    callback();
            }
        ], (err) => {
            callback(err, device);
        });
    }
    fixDevice(device) {
        device.type = device.type || DeviceTypeV1_1.DeviceTypeV1.Unknown;
        device.status = device.status || DeviceStatusV1_1.DeviceStatusV1.Active;
        device.udi = UdiConverter_1.UdiConverter.fromString(device.udi);
    }
    createDevice(correlationId, device, callback) {
        let newDevice;
        this.fixDevice(device);
        device.id = pip_services3_commons_node_5.IdGenerator.nextLong();
        device.create_time = new Date();
        async.series([
            // Check for existing UDI
            (callback) => {
                this._persistence.getOneByUdi(correlationId, device.org_id, device.udi, (err, data) => {
                    if (err == null && data != null) {
                        err = new pip_services3_commons_node_4.BadRequestException(correlationId, 'DEVICE_UDI_USED', 'Device UDI ' + device.udi + ' has already been used').withDetails('udi', device.udi);
                    }
                    callback(err);
                });
            },
            // Create object
            (callback) => {
                this._persistence.create(correlationId, device, (err, data) => {
                    newDevice = data;
                    callback(err);
                });
            },
            // Set object from the other side
            (callback) => {
                this._objectsConnector.setObject(correlationId, newDevice, callback);
            },
            // Send sms messages to phones
            (callback) => {
                // Skip if there is no smartphone or no SMS client
                if (device.type != DeviceTypeV1_1.DeviceTypeV1.Smartphone) {
                    callback();
                    return;
                }
                this._organizationsClient.getOrganizationById(correlationId, device.org_id, (err, organization) => {
                    if (err == null) {
                        this._messageConnector.sendSmsWelcomeNotification(correlationId, device.udi, organization);
                    }
                    callback(err);
                });
            }
        ], (err) => {
            callback(err, err == null ? newDevice : null);
        });
    }
    updateDevice(correlationId, device, callback) {
        let oldDevice;
        let newDevice;
        this.fixDevice(device);
        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, device.id, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services3_commons_node_3.NotFoundException(correlationId, 'DEVICE_NOT_FOUND', 'Tracking device ' + device.id + ' was not found').withDetails('device_id', device.id);
                    }
                    oldDevice = data;
                    callback(err);
                });
            },
            // Check for existing UDI
            (callback) => {
                if (oldDevice.udi != device.udi) {
                    this._persistence.getOneByUdi(correlationId, device.org_id, device.udi, (err, data) => {
                        if (err == null && data != null) {
                            err = new pip_services3_commons_node_4.BadRequestException(correlationId, 'DEVICE_UDI_USED', 'Device UDI ' + device.udi + ' has already been used').withDetails('udi', device.udi);
                        }
                        callback(err);
                    });
                }
                else
                    callback();
            },
            // Perform update
            (callback) => {
                device.create_time = oldDevice.create_time;
                this._persistence.update(correlationId, device, (err, data) => {
                    newDevice = data;
                    callback(err);
                });
            },
            // Change object association
            (callback) => {
                this._objectsConnector.updateObjects(correlationId, oldDevice, newDevice, callback);
            }
        ], (err) => {
            callback(err, err == null ? newDevice : null);
        });
    }
    deleteDeviceById(correlationId, id, callback) {
        let oldDevice;
        let newDevice;
        async.series([
            // Get device
            (callback) => {
                this._persistence.getOneById(correlationId, id, (err, data) => {
                    oldDevice = data;
                    callback(err);
                });
            },
            // Set logical deletion flag
            (callback) => {
                if (oldDevice == null) {
                    callback();
                    return;
                }
                newDevice = _.clone(oldDevice);
                newDevice.deleted = true;
                newDevice.object_id = null;
                this._persistence.update(correlationId, newDevice, (err, data) => {
                    newDevice = data;
                    callback(err);
                });
            },
            // Unset object from the other side
            (callback) => {
                this._objectsConnector.unsetObject(correlationId, oldDevice, callback);
            }
        ], (err) => {
            callback(err, err == null ? newDevice : null);
        });
    }
    setObject(correlationId, device_id, object_id, callback) {
        let oldDevice;
        let newDevice;
        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, device_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services3_commons_node_3.NotFoundException(correlationId, 'DEVICE_NOT_FOUND', 'Tracking device ' + device_id + ' was not found').withDetails('device_id', device_id);
                    }
                    oldDevice = data;
                    callback(err);
                });
            },
            // Perform update
            (callback) => {
                newDevice = _.clone(oldDevice);
                newDevice.object_id = object_id;
                this._persistence.update(correlationId, newDevice, (err, data) => {
                    newDevice = data;
                    callback(err);
                });
            },
            // Unset previously set object
            (callback) => {
                this._objectsConnector.unsetObject(correlationId, oldDevice, callback);
            }
        ], (err) => {
            callback(err, err == null ? newDevice : null);
        });
    }
    unsetObject(correlationId, device_id, callback) {
        let oldDevice;
        let newDevice;
        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, device_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services3_commons_node_3.NotFoundException(correlationId, 'DEVICE_NOT_FOUND', 'Tracking device ' + device_id + ' was not found').withDetails('device_id', device_id);
                    }
                    oldDevice = data;
                    callback(err);
                });
            },
            // Perform update
            (callback) => {
                newDevice = _.clone(oldDevice);
                newDevice.object_id = null;
                this._persistence.update(correlationId, newDevice, (err, data) => {
                    newDevice = data;
                    callback(err);
                });
            }
        ], (err) => {
            callback(err, err == null ? newDevice : null);
        });
    }
}
exports.DevicesController = DevicesController;
DevicesController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'iqs-services-devices:persistence:*:*:1.0', 'dependencies.control-objects', 'iqs-services-controlobjects:client:*:*:1.0', 'dependencies.organizations', 'pip-services-organizations:client:*:*:1.0', 'dependencies.msgtemplates', 'pip-services-msgtemplates:client:*:*:1.0', 'dependencies.smsdelivery', 'pip-services-sms:client:*:*:1.0', 'message_templates.phone_connect_welcome.subject', 'You were connected to organization', 'message_templates.phone_connect_welcome.text', 'You were connected on the {{ org_name }} organization, organization code: {{ org_code }}.');
//# sourceMappingURL=DevicesController.js.map