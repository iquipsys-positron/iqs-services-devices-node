import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class DevicesHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/devices');
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-devices', 'controller', 'default', '*', '1.0'));
    }
}