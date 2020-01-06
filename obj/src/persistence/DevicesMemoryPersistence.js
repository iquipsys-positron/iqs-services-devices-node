"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
const UdiConverter_1 = require("../data/version1/UdiConverter");
class DevicesMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
        this._maxPageSize = 1000;
    }
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }
    matchSearch(item, search) {
        search = search.toLowerCase();
        if (this.matchString(item.id, search))
            return true;
        if (this.matchString(item.label, search))
            return true;
        return false;
    }
    contains(array1, array2) {
        if (array1 == null || array2 == null)
            return false;
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1])
                    return true;
        }
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let search = filter.getAsNullableString('search');
        let id = filter.getAsNullableString('id');
        let orgId = filter.getAsNullableString('org_id');
        let orgIds = filter.getAsObject('org_ids');
        let udi = filter.getAsNullableString('udi');
        udi = UdiConverter_1.UdiConverter.fromString(udi);
        let type = filter.getAsNullableString('type');
        let label = filter.getAsNullableString('label');
        let object_id = filter.getAsNullableString('object_id');
        let status = filter.getAsNullableString('status');
        let statuses = filter.getAsObject('statuses');
        let deleted = filter.getAsBooleanWithDefault('deleted', false);
        // Process org_ids filter
        if (_.isString(orgIds))
            orgIds = orgIds.split(',');
        if (!_.isArray(orgIds))
            orgIds = null;
        // Process statuses filter
        if (_.isString(statuses))
            statuses = statuses.split(',');
        if (!_.isArray(statuses))
            statuses = null;
        return (item) => {
            if (id && item.id != id)
                return false;
            if (orgId && item.org_id != orgId)
                return false;
            if (orgIds && _.indexOf(orgIds, item.org_id) < 0)
                return false;
            if (object_id && item.object_id != object_id)
                return false;
            if (label && item.label != label)
                return false;
            if (udi && item.udi != udi)
                return false;
            if (type && item.type != type)
                return false;
            if (status && item.status != status)
                return false;
            if (statuses && _.indexOf(statuses, item.status) < 0)
                return false;
            if (!deleted && item.deleted)
                return false;
            if (search && !this.matchSearch(item, search))
                return false;
            return true;
        };
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    getOneByUdi(correlationId, orgId, udi, callback) {
        let item = _.find(this._items, (item) => item.org_id == orgId && item.udi == udi && !item.deleted);
        if (item)
            this._logger.trace(correlationId, "Found device by %s and %s", orgId, udi);
        else
            this._logger.trace(correlationId, "Cannot find device by %s and %s", orgId, udi);
        callback(null, item);
    }
}
exports.DevicesMemoryPersistence = DevicesMemoryPersistence;
//# sourceMappingURL=DevicesMemoryPersistence.js.map