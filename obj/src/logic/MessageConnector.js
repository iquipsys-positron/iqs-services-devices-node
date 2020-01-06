"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class MessageConnector {
    constructor(_logger, _templatesResolver, _smsClient) {
        this._logger = _logger;
        this._templatesResolver = _templatesResolver;
        this._smsClient = _smsClient;
        if (_smsClient == null)
            this._logger.error(null, null, 'Sms message distribution client was not found. Welcome to organization notifications are disabled');
    }
    sendSmsWelcomeNotification(correlationId, phone, organization) {
        this._templatesResolver.resolve('phone_connect_welcome', (err, template) => {
            if (err == null && template == null) {
                err = new pip_services3_commons_node_2.ConfigException(correlationId, 'MISSING_PHONE_CONNECT_WELCOME', 'Message template "phone_connect_welcome" is missing');
            }
            if (err) {
                this._logger.error(correlationId, err, 'Cannot find phone_connect_welcome message template');
                return;
            }
            let message = {
                subject: template.subject,
                text: template.text,
                html: template.html
            };
            let recipient = {
                id: organization.creator_id,
                name: organization.name,
                phone: phone,
                language: organization ? organization.language : null
            };
            let parameters = pip_services3_commons_node_1.ConfigParams.fromTuples('org_name', organization.name, 'org_code', organization.code);
            if (this._smsClient) {
                this._smsClient.sendMessageToRecipient(correlationId, recipient, message, parameters, (err) => {
                    if (err)
                        this._logger.error(correlationId, err, 'Failed to send phone welcome message');
                });
            }
        });
    }
}
exports.MessageConnector = MessageConnector;
//# sourceMappingURL=MessageConnector.js.map