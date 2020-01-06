let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { OrganizationsNullClientV1 } from 'pip-clients-organizations-node';

import { DeviceV1 } from '../../src/data/version1/DeviceV1';
import { DevicesMemoryPersistence } from '../../src/persistence/DevicesMemoryPersistence';
import { DevicesController } from '../../src/logic/DevicesController';
import { DevicesLambdaFunction } from '../../src/container/DevicesLambdaFunction';

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

suite('DevicesLambdaFunction', ()=> {
    let lambda: DevicesLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'iqs-services-devices:persistence:memory:default:1.0',
            'controller.descriptor', 'iqs-services-devices:controller:default:default:1.0',
            'organizations.descriptor', 'pip-services-organizations:client:null:default:1.0'
        );

        lambda = new DevicesLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
        var device1, device2;

        async.series([
        // Create one device
            (callback) => {
                lambda.act(
                    {
                        role: 'devices',
                        cmd: 'create_device',
                        device: DEVICE1
                    },
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.equal(device.org_id, DEVICE1.org_id);
                        assert.equal(device.status, DEVICE1.status);
                        assert.equal(device.type, DEVICE1.type);
                        assert.equal(device.label, DEVICE1.label);

                        device1 = device;

                        callback();
                    }
                );
            },
        // Create another device
            (callback) => {
                lambda.act(
                    {
                        role: 'devices',
                        cmd: 'create_device',
                        device: DEVICE2
                    },
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.equal(device.org_id, DEVICE2.org_id);
                        assert.equal(device.type, DEVICE2.type);
                        assert.equal(device.status, DEVICE2.status);
                        assert.equal(device.label, DEVICE2.label);

                        device2 = device;

                        callback();
                    }
                );
            },
        // Get all devices
            (callback) => {
                lambda.act(
                    {
                        role: 'devices',
                        cmd: 'get_devices' 
                    },
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
        // Get device by UDI
            (callback) => {
                lambda.act(
                    {
                        role: 'devices',
                        cmd: 'get_device_by_udi',
                        org_id: device1.org_id,
                        udi: device1.udi
                    },
                    (err, device) => {
                        assert.isNull(err);

                        assert.isNotNull(device);
                        assert.equal(device.id, device1.id);

                        callback();
                    }
                );
            },
        // Update the device
            (callback) => {
                device1.label = 'Updated device 1';

                lambda.act(
                    {
                        role: 'devices',
                        cmd: 'update_device',
                        device: device1
                    },
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
        // Set object to device
            (callback) => {
                lambda.act(
                    {
                        role: 'devices',
                        cmd: 'set_object',
                        device_id: device1.id,
                        object_id: '5'
                    },
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
                lambda.act(
                    {
                        role: 'devices',
                        cmd: 'unset_object',
                        device_id: device1.id
                    },
                    (err, device) => {
                        assert.isNull(err);

                        assert.isObject(device);
                        assert.isNull(device.object_id);
                        assert.equal(device.id, device1.id);

                        device1 = device;

                        callback();
                    }
                );
            },
        // Delete device
            (callback) => {
                lambda.act(
                    {
                        role: 'devices',
                        cmd: 'delete_device_by_id',
                        device_id: device1.id
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete device
            (callback) => {
                lambda.act(
                    {
                        role: 'devices',
                        cmd: 'get_device_by_id',
                        device_id: device1.id
                    },
                    (err, device) => {
                        assert.isNull(err);

                        assert.isNotNull(device);
                        assert.isTrue(device.deleted);

                        callback();
                    }
                );
            }
        ], done);
    });
});