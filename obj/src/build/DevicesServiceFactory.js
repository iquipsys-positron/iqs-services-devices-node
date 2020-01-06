"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const DevicesMongoDbPersistence_1 = require("../persistence/DevicesMongoDbPersistence");
const DevicesFilePersistence_1 = require("../persistence/DevicesFilePersistence");
const DevicesMemoryPersistence_1 = require("../persistence/DevicesMemoryPersistence");
const DevicesController_1 = require("../logic/DevicesController");
const DevicesHttpServiceV1_1 = require("../services/version1/DevicesHttpServiceV1");
class DevicesServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(DevicesServiceFactory.MemoryPersistenceDescriptor, DevicesMemoryPersistence_1.DevicesMemoryPersistence);
        this.registerAsType(DevicesServiceFactory.FilePersistenceDescriptor, DevicesFilePersistence_1.DevicesFilePersistence);
        this.registerAsType(DevicesServiceFactory.MongoDbPersistenceDescriptor, DevicesMongoDbPersistence_1.DevicesMongoDbPersistence);
        this.registerAsType(DevicesServiceFactory.ControllerDescriptor, DevicesController_1.DevicesController);
        this.registerAsType(DevicesServiceFactory.HttpServiceDescriptor, DevicesHttpServiceV1_1.DevicesHttpServiceV1);
    }
}
exports.DevicesServiceFactory = DevicesServiceFactory;
DevicesServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-devices", "factory", "default", "default", "1.0");
DevicesServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-devices", "persistence", "memory", "*", "1.0");
DevicesServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-devices", "persistence", "file", "*", "1.0");
DevicesServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-devices", "persistence", "mongodb", "*", "1.0");
DevicesServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-devices", "controller", "default", "*", "1.0");
DevicesServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-devices", "service", "http", "*", "1.0");
//# sourceMappingURL=DevicesServiceFactory.js.map