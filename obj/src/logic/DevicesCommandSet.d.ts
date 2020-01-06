import { CommandSet } from 'pip-services3-commons-node';
import { IDevicesController } from './IDevicesController';
export declare class DevicesCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IDevicesController);
    private makeGetDevicesCommand;
    private makeGetDeviceByIdCommand;
    private makeGetDeviceByUdiCommand;
    private makeGetOrCreateDeviceCommand;
    private makeCreateDeviceCommand;
    private makeUpdateDeviceCommand;
    private makeDeleteDeviceByIdCommand;
    private makeSetObjectCommand;
    private makeUnsetObjectCommand;
}
