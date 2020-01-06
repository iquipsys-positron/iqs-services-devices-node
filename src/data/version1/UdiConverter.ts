export class UdiConverter {

    public static fromString(udi: string): string {
        if (udi == null) return null;
        return udi.replace(/[^0-9a-fA-F\+]/g, '').toLowerCase();
    }

}