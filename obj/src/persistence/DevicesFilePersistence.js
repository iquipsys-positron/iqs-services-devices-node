"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_data_node_1 = require("pip-services3-data-node");
const DevicesMemoryPersistence_1 = require("./DevicesMemoryPersistence");
class DevicesFilePersistence extends DevicesMemoryPersistence_1.DevicesMemoryPersistence {
    constructor(path) {
        super();
        this._persister = new pip_services3_data_node_1.JsonFilePersister(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }
    configure(config) {
        super.configure(config);
        this._persister.configure(config);
    }
}
exports.DevicesFilePersistence = DevicesFilePersistence;
//# sourceMappingURL=DevicesFilePersistence.js.map