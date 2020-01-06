"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
const UdiConverter_1 = require("../data/version1/UdiConverter");
class DevicesMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('devices');
        super.ensureIndex({ org_id: 1, udi: 1 }, { unique: true });
        this._maxPageSize = 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let criteria = [];
        let search = filter.getAsNullableString('search');
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            let searchCriteria = [];
            searchCriteria.push({ label: { $regex: searchRegex } });
            criteria.push({ $or: searchCriteria });
        }
        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });
        let orgId = filter.getAsNullableString('org_id');
        if (orgId != null)
            criteria.push({ org_id: orgId });
        // Filter org_ids
        let orgIds = filter.getAsObject('org_ids');
        if (_.isString(orgIds))
            orgIds = orgIds.split(',');
        if (_.isArray(orgIds))
            criteria.push({ org_id: { $in: orgIds } });
        let udi = filter.getAsNullableString('udi');
        if (udi != null) {
            udi = UdiConverter_1.UdiConverter.fromString(udi);
            criteria.push({ udi: udi });
        }
        let type = filter.getAsNullableString('type');
        if (type != null)
            criteria.push({ type: type });
        let label = filter.getAsNullableString('label');
        if (label != null)
            criteria.push({ label: label });
        let objectId = filter.getAsNullableString('object_id');
        if (objectId != null)
            criteria.push({ object_id: objectId });
        let status = filter.getAsNullableString('status');
        if (status != null)
            criteria.push({ status: status });
        // Filter statuses
        let statuses = filter.getAsObject('statuses');
        if (_.isString(statuses))
            statuses = statuses.split(',');
        if (_.isArray(statuses))
            criteria.push({ status: { $in: statuses } });
        let deleted = filter.getAsBooleanWithDefault('deleted', false);
        if (!deleted)
            criteria.push({ $or: [{ deleted: false }, { deleted: { $exists: false } }] });
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    getOneByUdi(correlationId, orgId, udi, callback) {
        let criteria = {
            org_id: orgId,
            udi: udi,
            $or: [{ deleted: false }, { deleted: { $exists: false } }]
        };
        this._collection.findOne(criteria, (err, item) => {
            item = this.convertToPublic(item);
            if (item)
                this._logger.trace(correlationId, "Found device by %s and %s", orgId, udi);
            else
                this._logger.trace(correlationId, "Cannot find device by %s and %s", orgId, udi);
            callback(err, item);
        });
    }
}
exports.DevicesMongoDbPersistence = DevicesMongoDbPersistence;
//# sourceMappingURL=DevicesMongoDbPersistence.js.map