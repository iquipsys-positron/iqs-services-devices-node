"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UdiConverter {
    static fromString(udi) {
        if (udi == null)
            return null;
        return udi.replace(/[^0-9a-fA-F\+]/g, '').toLowerCase();
    }
}
exports.UdiConverter = UdiConverter;
//# sourceMappingURL=UdiConverter.js.map