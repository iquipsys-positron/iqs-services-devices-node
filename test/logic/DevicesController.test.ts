let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

//import { ControlObjectsNullClientV1 } from 'iqs-clients-controlobjects-node';
import { OrganizationsNullClientV1 } from 'pip-clients-organizations-node';

import { DeviceV1 } from '../../src/data/version1/DeviceV1';
import { DevicesMemoryPersistence } from '../../src/persistence/DevicesMemoryPersistence';
import { DevicesController } from '../../src/logic/DevicesController';
import { DevicesHttpServiceV1 } from '../../src/services/version1/DevicesHttpServiceV1';

let DEVICE1: DeviceV1 = {
    id: '1',
    org_id: '1',
    type: 'simulated',
    udi: '111',
    label: '3456',
    status: 'active',
    object_id: '1'
};
let DEVICE2: DeviceV1 = {
    id: '2',
    org_id: '1',
    type: 'simulated',
    udi: '222',
    label: '2334',
    status: 'active',
    object_id: '1'
};

suite('DevicesController', () => {
    let persistence: DevicesMemoryPersistence;
    let controller: DevicesController;

    suiteSetup((done) => {
        persistence = new DevicesMemoryPersistence();
        controller = new DevicesController();
        //let objectsClient = new ControlObjectsNullClientV1();

        let references: References = References.fromTuples(
            //new Descriptor('iqs-services-controlobjects', 'client', 'null', 'default', '1.0'), objectsClient,
            new Descriptor('pip-services-organizations', 'client', 'null', 'default', '1.0'), new OrganizationsNullClientV1(),
            new Descriptor('iqs-services-devices', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-devices', 'controller', 'default', 'default', '1.0'), controller
        );
        controller.setReferences(references);

        persistence.open(null, done);
    });

    setup((done) => {
        persistence.clear(null, done);
    });


    test('CRUD Operations', (done) => {
        let device1, device2;

        async.series([
            // Create one device
            (callback) => {
                controller.createDevice(
                    null, DEVICE1,
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.equal(device.org_id, DEVICE1.org_id);
                        assert.equal(device.type, DEVICE1.type);
                        assert.equal(device.label, DEVICE1.label);

                        device1 = device;

                        callback();
                    }
                );
            },
            // Create another device
            (callback) => {
                controller.createDevice(
                    null, DEVICE2,
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.equal(device.org_id, DEVICE2.org_id);
                        assert.equal(device.type, DEVICE2.type);
                        assert.equal(device.label, DEVICE2.label);

                        device2 = device;

                        callback();
                    }
                );
            },
            // Get all devices
            (callback) => {
                controller.getDevices(
                    null, new FilterParams(), new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
            // Update the device
            (callback) => {
                device1.label = 'Updated device 1';

                controller.updateDevice(
                    null, device1,
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.equal(device.label, 'Updated device 1');
                        assert.equal(device.status, DEVICE1.status);

                        device1 = device;

                        callback();
                    }
                );
            },
            // Delete device
            (callback) => {
                controller.deleteDeviceById(
                    null, device1.id,
                    (err, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
            // Try to get delete device
            (callback) => {
                controller.getDeviceById(
                    null, device1.id,
                    (err, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            }
        ], done);
    });

    test('Set and unset objects', (done) => {
        let device1;

        async.series([
            // Create one device
            (callback) => {
                controller.createDevice(
                    null, DEVICE1,
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.equal(device.org_id, DEVICE1.org_id);
                        assert.equal(device.type, DEVICE1.type);
                        assert.equal(device.label, DEVICE1.label);

                        device1 = device;

                        callback();
                    }
                );
            },
            // Set object to device
            (callback) => {
                controller.setObject(
                    null, device1.id, '5',
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.equal(device.object_id, '5');
                        assert.equal(device.id, device1.id);

                        device1 = device;

                        callback();
                    }
                );
            },
            // Unset object from device
            (callback) => {
                controller.unsetObject(
                    null, device1.id,
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.isNull(device.object_id);
                        assert.equal(device.id, device1.id);

                        device1 = device;

                        callback();
                    }
                );
            }
        ], done);
    });

    test('Get or create device', (done) => {
        let device1;

        async.series([
            // Create one device
            (callback) => {
                controller.getOrCreateDevice(
                    null, '1', 'simulated', 1, 'ABC',
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);

                        device1 = device;

                        callback();
                    }
                );
            },
            // Get created device
            (callback) => {
                controller.getDeviceById(
                    null, device1.id,
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.equal(device.org_id, '1');
                        assert.equal(device.udi, 'abc');
                        assert.equal(device.id, device1.id);

                        device1 = device;

                        callback();
                    }
                );
            }
        ], done);
    });

});