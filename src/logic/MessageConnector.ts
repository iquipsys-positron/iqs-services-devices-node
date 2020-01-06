import { ILogger } from 'pip-services3-components-node';
import { ConfigParams } from 'pip-services3-commons-node';

import { MessageV1 } from 'pip-clients-msgdistribution-node';
import { MessageResolverV1 } from 'pip-clients-msgdistribution-node';
import { ISmsClientV1 } from 'pip-clients-sms-node';
import { MessageTemplatesResolverV1 } from 'pip-clients-msgtemplates-node';
import { ConfigException } from 'pip-services3-commons-node';
import { SmsRecipientV1 } from 'pip-clients-sms-node';
import { SmsMessageV1 } from 'pip-clients-sms-node';
import { OrganizationV1 } from 'pip-clients-organizations-node'

export class MessageConnector {
    public constructor(
        private _logger: ILogger,
        private _templatesResolver: MessageTemplatesResolverV1,
        private _smsClient: ISmsClientV1
    ) {
        if (_smsClient == null)
            this._logger.error(null, null, 'Sms message distribution client was not found. Welcome to organization notifications are disabled');
    }

    public sendSmsWelcomeNotification(correlationId: string, phone: string, organization: OrganizationV1): void {
        this._templatesResolver.resolve('phone_connect_welcome', (err, template) => {
            if (err == null && template == null) {
                err = new ConfigException(
                    correlationId,
                    'MISSING_PHONE_CONNECT_WELCOME',
                    'Message template "phone_connect_welcome" is missing'
                );
            }

            if (err) {
                this._logger.error(correlationId, err, 'Cannot find phone_connect_welcome message template');
                return;
            }

            let message = <SmsMessageV1>{
                subject: template.subject,
                text: template.text,
                html: template.html
            };

            let recipient = <SmsRecipientV1>{
                id: organization.creator_id,
                name: organization.name,
                phone: phone,
                language: organization ? organization.language : null
            };

            let parameters = ConfigParams.fromTuples(
                'org_name', organization.name,
                'org_code', organization.code
            );

            if (this._smsClient) {
                this._smsClient.sendMessageToRecipient(correlationId, recipient, message, parameters, (err) => {
                    if (err)
                        this._logger.error(correlationId, err, 'Failed to send phone welcome message');
                });
            }
        });
    }

}