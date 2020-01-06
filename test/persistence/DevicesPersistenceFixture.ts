let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { DeviceV1 } from '../../src/data/version1/DeviceV1';

import { IDevicesPersistence } from '../../src/persistence/IDevicesPersistence';

let DEVICE1: DeviceV1 = {
    id: '1',
    org_id: '1',
    udi: '111',
    type: 'simulated',
    profile_id: 'smartphone',
    label: '3456',
    status: 'active',
    object_id: '1'
};
let DEVICE2: DeviceV1 = {
    id: '2',
    org_id: '1',
    udi: '222',
    type: 'simulated',
    profile_id: 'smartphone',
    label: '2334',
    status: 'active',
    object_id: '1'
};
let DEVICE3: DeviceV1 = {
    id: '3',
    org_id: '2',
    udi: '333',
    type: 'simulated',
    profile_id: 'iqx',
    status: 'inactive'
};

export class DevicesPersistenceFixture {
    private _persistence: IDevicesPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testCreateDevices(done) {
        async.series([
        // Create one device
            (callback) => {
                this._persistence.create(
                    null,
                    DEVICE1,
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.equal(device.org_id, DEVICE1.org_id);
                        assert.equal(device.type, DEVICE1.type);
                        assert.equal(device.profile_id, DEVICE1.profile_id);
                        assert.equal(device.udi, DEVICE1.udi);
                        assert.equal(device.label, DEVICE1.label);

                        callback();
                    }
                );
            },
        // Create another device
            (callback) => {
                this._persistence.create(
                    null,
                    DEVICE2,
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.equal(device.org_id, DEVICE2.org_id);
                        assert.equal(device.type, DEVICE2.type);
                        assert.equal(device.profile_id, DEVICE2.profile_id);
                        assert.equal(device.udi, DEVICE2.udi);
                        assert.equal(device.label, DEVICE2.label);

                        callback();
                    }
                );
            },
        // Create yet another device
            (callback) => {
                this._persistence.create(
                    null,
                    DEVICE3,
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.equal(device.org_id, DEVICE3.org_id);
                        assert.equal(device.type, DEVICE3.type);
                        assert.equal(device.profile_id, DEVICE3.profile_id);
                        assert.equal(device.udi, DEVICE3.udi);
                        assert.equal(device.status, DEVICE3.status);

                        callback();
                    }
                );
            }
        ], done);
    }
                
    public testCrudOperations(done) {
        let device1: DeviceV1;

        async.series([
        // Create items
            (callback) => {
                this.testCreateDevices(callback);
            },
        // Get all devices
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        device1 = page.data[0];

                        callback();
                    }
                );
            },
        // Get device by udi
            (callback) => {
                this._persistence.getOneByUdi(
                    null,
                    '1', '111',
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.equal('1', device.org_id);
                        assert.equal('111', device.udi);

                        callback();
                    }
                );
            },
        // Update the device
            (callback) => {
                device1.label = 'Updated device 1';

                this._persistence.update(
                    null,
                    device1,
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.equal(device.label, 'Updated device 1');
                        assert.equal(device.id, device1.id);

                        callback();
                    }
                );
            },
        // Delete device
            (callback) => {
                this._persistence.deleteById(
                    null,
                    device1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete device
            (callback) => {
                this._persistence.getOneById(
                    null,
                    device1.id,
                    (err, device) => {
                        assert.isNull(err);

                        assert.isNull(device || null);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testGetWithFilter(done) {
        async.series([
        // Create devices
            (callback) => {
                this.testCreateDevices(callback);
            },
        // Get devices filtered by tags
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        search: '34'
                    }),
                    new PagingParams(),
                    (err, devices) => {
                        assert.isNull(err);

                        assert.isObject(devices);
                        assert.lengthOf(devices.data, 2);

                        callback();
                    }
                );
            },
        // Get devices by organization id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        org_id: '1'
                    }),
                    new PagingParams(),
                    (err, devices) => {
                        assert.isNull(err);

                        assert.isObject(devices);
                        assert.lengthOf(devices.data, 2);

                        callback();
                    }
                );
            },
        // Get devices by organization ids
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        org_ids: '1,9'
                    }),
                    new PagingParams(),
                    (err, devices) => {
                        assert.isNull(err);

                        assert.isObject(devices);
                        assert.lengthOf(devices.data, 2);

                        callback();
                    }
                );
            },
    // Get devices filtered by status
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        statuses: 'active'
                    }),
                    new PagingParams(),
                    (err, devices) => {
                        assert.isNull(err);

                        assert.isObject(devices);
                        assert.lengthOf(devices.data, 2);

                        callback();
                    }
                );
            },
        ], done);
    }

}
