"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
class ControlObjectsConnector {
    constructor(_objectsClient //IControlObjectsClientV1
    ) {
        this._objectsClient = _objectsClient;
    }
    setObject(correlationId, device, callback) {
        // if (this._objectsClient == null || device == null || device.object_id == null) {
        //     callback(null);
        //     return;
        // }
        // this._objectsClient.setDevice(correlationId, device.object_id, device.id, callback);
        if (callback)
            callback(null);
    }
    updateObjects(correlationId, oldDevice, newDevice, callback) {
        // if (this._objectsClient == null || oldDevice == null || newDevice == null
        //     || oldDevice.object_id == newDevice.object_id) {
        //     callback(null);
        //     return;
        // }
        // async.parallel([
        //     (callback) => {
        //         if (oldDevice.object_id != null)
        //             this._objectsClient.unsetDevice(correlationId, oldDevice.object_id, callback);
        //         else callback();
        //     },
        //     (callback) => {
        //         if (newDevice.object_id != null)
        //             this._objectsClient.setDevice(correlationId, newDevice.object_id, newDevice.id, callback);
        //         else callback();
        //     }
        // ], callback);
        if (callback)
            callback(null);
    }
    unsetObject(correlationId, device, callback) {
        // if (this._objectsClient == null || device == null || device.object_id == null) {
        //     callback(null);
        //     return;
        // }
        // this._objectsClient.unsetDevice(correlationId, device.object_id, callback);
        if (callback)
            callback(null);
    }
}
exports.ControlObjectsConnector = ControlObjectsConnector;
//# sourceMappingURL=ControlObjectsConnector.js.map