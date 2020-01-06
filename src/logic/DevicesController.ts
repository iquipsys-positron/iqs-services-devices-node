let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { NotFoundException } from 'pip-services3-commons-node';
import { BadRequestException } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';
import { MessageResolverV1 } from 'pip-clients-msgdistribution-node';
import { ISmsClientV1 } from 'pip-clients-sms-node';
import { CompositeLogger } from 'pip-services3-components-node';

import { IControlObjectsClientV1 } from 'iqs-clients-controlobjects-node';
import { IOrganizationsClientV1 } from 'pip-clients-organizations-node';
import { OrganizationV1 } from 'pip-clients-organizations-node';

import { DeviceV1 } from '../data/version1/DeviceV1';
import { DeviceTypeV1 } from '../data/version1/DeviceTypeV1';
import { DeviceStatusV1 } from '../data/version1/DeviceStatusV1';
import { UdiConverter } from '../data/version1/UdiConverter';
import { IDevicesPersistence } from '../persistence/IDevicesPersistence';
import { IDevicesController } from './IDevicesController';
import { DevicesCommandSet } from './DevicesCommandSet';
import { ControlObjectsConnector } from './ControlObjectsConnector';
import { MessageTemplatesResolverV1 } from 'pip-clients-msgtemplates-node';
import { MessageConnector } from './MessageConnector';


import { ConfigException } from 'pip-services3-commons-node';
import { SmsRecipientV1 } from 'pip-clients-sms-node';
import { SmsMessageV1 } from 'pip-clients-sms-node';


export class DevicesController implements IConfigurable, IReferenceable, ICommandable, IDevicesController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'iqs-services-devices:persistence:*:*:1.0',
        'dependencies.control-objects', 'iqs-services-controlobjects:client:*:*:1.0',
        'dependencies.organizations', 'pip-services-organizations:client:*:*:1.0',
        'dependencies.msgtemplates', 'pip-services-msgtemplates:client:*:*:1.0',
        'dependencies.smsdelivery', 'pip-services-sms:client:*:*:1.0',

        'message_templates.phone_connect_welcome.subject', 'You were connected to organization',
        'message_templates.phone_connect_welcome.text', 'You were connected on the {{ org_name }} organization, organization code: {{ org_code }}.'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(DevicesController._defaultConfig);
    private _templatesResolver: MessageTemplatesResolverV1 = new MessageTemplatesResolverV1();
    private _logger: CompositeLogger = new CompositeLogger();
    private _organizationsClient: IOrganizationsClientV1;
    private _smsClient: ISmsClientV1;
    private _messageConnector: MessageConnector;

    private _objectsClient: IControlObjectsClientV1;
    private _objectsConnector: ControlObjectsConnector;
    private _persistence: IDevicesPersistence;
    private _commandSet: DevicesCommandSet;

    public configure(config: ConfigParams): void {
        config = config.setDefaults(DevicesController._defaultConfig);

        this._dependencyResolver.configure(config);
        this._templatesResolver.configure(config);
        this._logger.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._logger.setReferences(references);
        this._templatesResolver.setReferences(references);

        this._persistence = this._dependencyResolver.getOneRequired<IDevicesPersistence>('persistence');
        this._smsClient = this._dependencyResolver.getOneOptional<ISmsClientV1>('smsdelivery');
        this._organizationsClient = this._dependencyResolver.getOneRequired<IOrganizationsClientV1>('organizations');
        this._objectsClient = this._dependencyResolver.getOneOptional<IControlObjectsClientV1>('control-objects');
        this._objectsConnector = new ControlObjectsConnector(this._objectsClient);

        this._messageConnector = new MessageConnector(
            this._logger,
            // this._messageResolver,
            this._templatesResolver,
            this._smsClient
        );
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new DevicesCommandSet(this);
        return this._commandSet;
    }

    public getDevices(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<DeviceV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getDeviceById(correlationId: string, id: string,
        callback: (err: any, device: DeviceV1) => void): void {
        this._persistence.getOneById(correlationId, id, callback);
    }

    public getDeviceByUdi(correlationId: string, org_id: string, udi: string,
        callback: (err: any, device: DeviceV1) => void): void {
        udi = UdiConverter.fromString(udi);
        this._persistence.getOneByUdi(correlationId, org_id, udi, callback);
    }

    public getOrCreateDevice(correlationId: string, org_id: string,
        type: string, version: number, udi: string,
        callback: (err: any, device: DeviceV1) => void): void {
        let device: DeviceV1;

        udi = UdiConverter.fromString(udi);

        async.series([
            (callback) => {
                this._persistence.getOneByUdi(correlationId, org_id, udi, (err, data) => {
                    device = data;
                    callback(err);
                });
            },
            (callback) => {
                if (device == null) {
                    device = <DeviceV1>{
                        id: IdGenerator.nextLong(),
                        org_id: org_id,
                        object_id: null,
                        type: type || DeviceTypeV1.Unknown,
                        version: version,
                        udi: udi,
                        create_time: new Date(),
                        status: DeviceStatusV1.Pending
                    };

                    this._persistence.create(correlationId, device, (err, data) => {
                        device = data;
                        callback(err);
                    });
                } else callback();
            }
        ], (err) => {
            callback(err, device);
        });
    }

    private fixDevice(device: DeviceV1): void {
        device.type = device.type || DeviceTypeV1.Unknown;
        device.status = device.status || DeviceStatusV1.Active;
        device.udi = UdiConverter.fromString(device.udi);
    }

    public createDevice(correlationId: string, device: DeviceV1,
        callback: (err: any, device: DeviceV1) => void): void {
        let newDevice: DeviceV1;

        this.fixDevice(device);
        device.id = IdGenerator.nextLong();
        device.create_time = new Date();

        async.series([
            // Check for existing UDI
            (callback) => {
                this._persistence.getOneByUdi(correlationId, device.org_id, device.udi, (err, data) => {
                    if (err == null && data != null) {
                        err = new BadRequestException(
                            correlationId,
                            'DEVICE_UDI_USED',
                            'Device UDI ' + device.udi + ' has already been used'
                        ).withDetails('udi', device.udi);
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
                if (device.type != DeviceTypeV1.Smartphone) {
                    callback();
                    return;
                }
                this._organizationsClient.getOrganizationById(
                    correlationId, device.org_id,
                    (err, organization) => {
                          if (err == null) {
                            this._messageConnector.sendSmsWelcomeNotification(
                                correlationId, device.udi, organization);
                        }
                        callback(err);
                    }
                );
            }
        ], (err) => {
            callback(err, err == null ? newDevice : null);
        });
    }

    public updateDevice(correlationId: string, device: DeviceV1,
        callback: (err: any, device: DeviceV1) => void): void {
        let oldDevice: DeviceV1;
        let newDevice: DeviceV1;

        this.fixDevice(device);

        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, device.id, (err, data) => {
                    if (err == null && data == null) {
                        err = new NotFoundException(
                            correlationId,
                            'DEVICE_NOT_FOUND',
                            'Tracking device ' + device.id + ' was not found'
                        ).withDetails('device_id', device.id);
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
                            err = new BadRequestException(
                                correlationId,
                                'DEVICE_UDI_USED',
                                'Device UDI ' + device.udi + ' has already been used'
                            ).withDetails('udi', device.udi);
                        }
                        callback(err);
                    });
                } else callback();
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

    public deleteDeviceById(correlationId: string, id: string,
        callback: (err: any, device: DeviceV1) => void): void {
        let oldDevice: DeviceV1;
        let newDevice: DeviceV1;

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

    public setObject(correlationId: string, device_id: string, object_id: string,
        callback: (err: any, device: DeviceV1) => void): void {
        let oldDevice: DeviceV1;
        let newDevice: DeviceV1;

        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, device_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new NotFoundException(
                            correlationId,
                            'DEVICE_NOT_FOUND',
                            'Tracking device ' + device_id + ' was not found'
                        ).withDetails('device_id', device_id);
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

    public unsetObject(correlationId: string, device_id: string,
        callback: (err: any, device: DeviceV1) => void): void {
        let oldDevice: DeviceV1;
        let newDevice: DeviceV1;

        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, device_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new NotFoundException(
                            correlationId,
                            'DEVICE_NOT_FOUND',
                            'Tracking device ' + device_id + ' was not found'
                        ).withDetails('device_id', device_id);
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
