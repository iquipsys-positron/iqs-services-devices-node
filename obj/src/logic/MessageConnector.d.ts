import { ILogger } from 'pip-services3-components-node';
import { ISmsClientV1 } from 'pip-clients-sms-node';
import { MessageTemplatesResolverV1 } from 'pip-clients-msgtemplates-node';
import { OrganizationV1 } from 'pip-clients-organizations-node';
export declare class MessageConnector {
    private _logger;
    private _templatesResolver;
    private _smsClient;
    constructor(_logger: ILogger, _templatesResolver: MessageTemplatesResolverV1, _smsClient: ISmsClientV1);
    sendSmsWelcomeNotification(correlationId: string, phone: string, organization: OrganizationV1): void;
}
