let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { OrganizationsNullClientV1 } from 'pip-clients-organizations-node';

import { DeviceV1 } from '../../../src/data/version1/DeviceV1';
import { DevicesMemoryPersistence } from '../../../src/persistence/DevicesMemoryPersistence';
import { DevicesController } from '../../../src/logic/DevicesController';
import { DevicesHttpServiceV1 } from '../../../src/services/version1/DevicesHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

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

suite('DevicesHttpServiceV1', ()=> {
    let service: DevicesHttpServiceV1;
    let rest: any;

    suiteSetup((done) => {
        let persistence = new DevicesMemoryPersistence();
        let controller = new DevicesController();

        service = new DevicesHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-devices', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-devices', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('iqs-services-devices', 'service', 'http', 'default', '1.0'), service,
            new Descriptor('pip-services-organizations', 'client', 'null', 'default', '1.0'), new OrganizationsNullClientV1()
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    
    
    test('CRUD Operations', (done) => {
        let device1, device2: DeviceV1;

        async.series([
        // Create one device
            (callback) => {
                rest.post('/v1/devices/create_device',
                    {
                        device: DEVICE1
                    },
                    (err, req, res, device) => {
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
                rest.post('/v1/devices/create_device', 
                    {
                        device: DEVICE2
                    },
                    (err, req, res, device) => {
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
                rest.post('/v1/devices/get_devices',
                    {},
                    (err, req, res, page) => {
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

                rest.post('/v1/devices/update_device',
                    { 
                        device: device1
                    },
                    (err, req, res, device) => {
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
                rest.post('/v1/devices/set_object',
                    {
                        device_id: device1.id,
                        object_id: '5'
                    },
                    (err, req, res, device) => {
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
                rest.post('/v1/devices/unset_object',
                    {
                        device_id: device1.id
                    },
                    (err, req, res, device) => {
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
                rest.post('/v1/devices/delete_device_by_id',
                    {
                        device_id: device1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
        // Try to get delete device
            (callback) => {
                rest.post('/v1/devices/get_device_by_id',
                    {
                        device_id: device1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            }
        ], done);
    });
});