let _ = require('lodash');
let async = require('async');

// import { IControlObjectsClientV1 } from 'iqs-clients-controlobjects-node';

import { DeviceV1 } from '../data/version1/DeviceV1';

export class ControlObjectsConnector {

    public constructor(
        private _objectsClient: object //IControlObjectsClientV1
    ) {}

    public setObject(correlationId: string, device: DeviceV1,
        callback: (err: any) => void) : void {
        
        // if (this._objectsClient == null || device == null || device.object_id == null) {
        //     callback(null);
        //     return;
        // }

        // this._objectsClient.setDevice(correlationId, device.object_id, device.id, callback);
        if (callback) callback(null);
    }

    public updateObjects(correlationId: string, oldDevice: DeviceV1,
        newDevice: DeviceV1, callback: (err: any) => void) : void {
        
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

        if (callback) callback(null);
    }

    public unsetObject(correlationId: string, device: DeviceV1,
        callback: (err: any) => void) : void {
        
        // if (this._objectsClient == null || device == null || device.object_id == null) {
        //     callback(null);
        //     return;
        // }

        // this._objectsClient.unsetDevice(correlationId, device.object_id, callback);

        if (callback) callback(null);
    }

}