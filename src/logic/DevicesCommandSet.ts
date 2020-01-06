import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';

import { DeviceV1 } from '../data/version1/DeviceV1';
import { DeviceV1Schema } from '../data/version1/DeviceV1Schema';
import { IDevicesController } from './IDevicesController';

export class DevicesCommandSet extends CommandSet {
    private _logic: IDevicesController;

    constructor(logic: IDevicesController) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetDevicesCommand());
		this.addCommand(this.makeGetDeviceByIdCommand());
		this.addCommand(this.makeGetDeviceByUdiCommand());
		this.addCommand(this.makeGetOrCreateDeviceCommand());
		this.addCommand(this.makeCreateDeviceCommand());
		this.addCommand(this.makeUpdateDeviceCommand());
		this.addCommand(this.makeDeleteDeviceByIdCommand());
		this.addCommand(this.makeSetObjectCommand());
		this.addCommand(this.makeUnsetObjectCommand());
    }

	private makeGetDevicesCommand(): ICommand {
		return new Command(
			"get_devices",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getDevices(correlationId, filter, paging, callback);
            }
		);
	}

	private makeGetDeviceByIdCommand(): ICommand {
		return new Command(
			"get_device_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('device_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let device_id = args.getAsString("device_id");
                this._logic.getDeviceById(correlationId, device_id, callback);
            }
		);
	}

	private makeGetDeviceByUdiCommand(): ICommand {
		return new Command(
			"get_device_by_udi",
			new ObjectSchema(true)
				.withRequiredProperty('org_id', TypeCode.String)
				.withRequiredProperty('udi', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let org_id = args.getAsString("org_id");
                let udi = args.getAsString("udi");
                this._logic.getDeviceByUdi(correlationId, org_id, udi, callback);
            }
		);
	}

	private makeGetOrCreateDeviceCommand(): ICommand {
		return new Command(
			"get_or_create_device",
			new ObjectSchema(true)
				.withRequiredProperty('org_id', TypeCode.String)
				.withRequiredProperty('udi', TypeCode.String)
				.withOptionalProperty('type', TypeCode.String)
				.withOptionalProperty('version', TypeCode.Integer),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let org_id = args.getAsString("org_id");
				let udi = args.getAsString("udi");
				let type = args.getAsString("type");
				let version = args.getAsNullableInteger("version");
                this._logic.getOrCreateDevice(correlationId, org_id, type, version, udi, callback);
            }
		);
	}

	private makeCreateDeviceCommand(): ICommand {
		return new Command(
			"create_device",
			new ObjectSchema(true)
				.withRequiredProperty('device', new DeviceV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let device = args.get("device");
                this._logic.createDevice(correlationId, device, callback);
            }
		);
	}

	private makeUpdateDeviceCommand(): ICommand {
		return new Command(
			"update_device",
			new ObjectSchema(true)
				.withRequiredProperty('device', new DeviceV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let device = args.get("device");
                this._logic.updateDevice(correlationId, device, callback);
            }
		);
	}
	
	private makeDeleteDeviceByIdCommand(): ICommand {
		return new Command(
			"delete_device_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('device_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let deviceId = args.getAsNullableString("device_id");
                this._logic.deleteDeviceById(correlationId, deviceId, callback);
			}
		);
	}

	private makeSetObjectCommand(): ICommand {
		return new Command(
			"set_object",
			new ObjectSchema(true)
				.withRequiredProperty('device_id', TypeCode.String)
				.withRequiredProperty('object_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let deviceId = args.getAsNullableString("device_id");
                let objectId = args.getAsNullableString("object_id");
                this._logic.setObject(correlationId, deviceId, objectId, callback);
			}
		);
	}

	private makeUnsetObjectCommand(): ICommand {
		return new Command(
			"unset_object",
			new ObjectSchema(true)
				.withRequiredProperty('device_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let deviceId = args.getAsNullableString("device_id");
                this._logic.unsetObject(correlationId, deviceId, callback);
			}
		);
	}

}