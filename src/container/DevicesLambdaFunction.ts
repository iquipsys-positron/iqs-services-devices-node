import { Descriptor } from 'pip-services3-commons-node';
import { CommandableLambdaFunction } from 'pip-services3-aws-node';
import { DevicesServiceFactory } from '../build/DevicesServiceFactory';
import { OrganizationsClientFactory } from 'pip-clients-organizations-node';
import { SmsClientFactory } from 'pip-clients-sms-node';
import { MessageTemplatesClientFactory } from 'pip-clients-msgtemplates-node';

export class DevicesLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("devices", "IoT devices function");
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-devices', 'controller', 'default', '*', '*'));
        this._factories.add(new DevicesServiceFactory());
        this._factories.add(new SmsClientFactory());
        this._factories.add(new MessageTemplatesClientFactory());
        this._factories.add(new OrganizationsClientFactory());
    }
}

export const handler = new DevicesLambdaFunction().getHandler();