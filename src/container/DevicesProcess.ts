import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

//import { ControlObjectsClientFactory } from 'iqs-clients-controlobjects-node';
import { MessageDistributionClientFactory } from 'pip-clients-msgdistribution-node';
import { MessageTemplatesClientFactory } from 'pip-clients-msgtemplates-node';
import { SmsClientFactory } from 'pip-clients-sms-node';
import { OrganizationsClientFactory } from 'pip-clients-organizations-node';

import { DevicesServiceFactory } from '../build/DevicesServiceFactory';

export class DevicesProcess extends ProcessContainer {

    public constructor() {
        super("devices", "IoT devices microservice");
        this._factories.add(new DevicesServiceFactory);
        //this._factories.add(new ControlObjectsClientFactory());
        this._factories.add(new MessageDistributionClientFactory());
        this._factories.add(new MessageTemplatesClientFactory());
        this._factories.add(new SmsClientFactory());
        this._factories.add(new OrganizationsClientFactory());
        this._factories.add(new DefaultRpcFactory);
    }

}
