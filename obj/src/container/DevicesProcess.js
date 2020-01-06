"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
//import { ControlObjectsClientFactory } from 'iqs-clients-controlobjects-node';
const pip_clients_msgdistribution_node_1 = require("pip-clients-msgdistribution-node");
const pip_clients_msgtemplates_node_1 = require("pip-clients-msgtemplates-node");
const pip_clients_sms_node_1 = require("pip-clients-sms-node");
const pip_clients_organizations_node_1 = require("pip-clients-organizations-node");
const DevicesServiceFactory_1 = require("../build/DevicesServiceFactory");
class DevicesProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("devices", "IoT devices microservice");
        this._factories.add(new DevicesServiceFactory_1.DevicesServiceFactory);
        //this._factories.add(new ControlObjectsClientFactory());
        this._factories.add(new pip_clients_msgdistribution_node_1.MessageDistributionClientFactory());
        this._factories.add(new pip_clients_msgtemplates_node_1.MessageTemplatesClientFactory());
        this._factories.add(new pip_clients_sms_node_1.SmsClientFactory());
        this._factories.add(new pip_clients_organizations_node_1.OrganizationsClientFactory());
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.DevicesProcess = DevicesProcess;
//# sourceMappingURL=DevicesProcess.js.map