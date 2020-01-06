"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const DevicesServiceFactory_1 = require("../build/DevicesServiceFactory");
const pip_clients_organizations_node_1 = require("pip-clients-organizations-node");
const pip_clients_sms_node_1 = require("pip-clients-sms-node");
const pip_clients_msgtemplates_node_1 = require("pip-clients-msgtemplates-node");
class DevicesLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("devices", "IoT devices function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('iqs-services-devices', 'controller', 'default', '*', '*'));
        this._factories.add(new DevicesServiceFactory_1.DevicesServiceFactory());
        this._factories.add(new pip_clients_sms_node_1.SmsClientFactory());
        this._factories.add(new pip_clients_msgtemplates_node_1.MessageTemplatesClientFactory());
        this._factories.add(new pip_clients_organizations_node_1.OrganizationsClientFactory());
    }
}
exports.DevicesLambdaFunction = DevicesLambdaFunction;
exports.handler = new DevicesLambdaFunction().getHandler();
//# sourceMappingURL=DevicesLambdaFunction.js.map