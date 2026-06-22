"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckinModule = void 0;
class CheckinModule {
    constructor(client) {
        this.client = client;
    }
    async facial(eventId, frame, options) {
        const { data } = await this.client.http.post(`/v1/events/${eventId}/checkin`, {
            method: 'facial',
            frame,
            ...options,
        });
        return data;
    }
    async qrCode(eventId, token, options) {
        const { data } = await this.client.http.post(`/v1/events/${eventId}/checkin`, {
            method: 'qr_code',
            qr_token: token,
            ...options,
        });
        return data;
    }
    async manual(eventId, personId, operatorId) {
        const { data } = await this.client.http.post(`/v1/events/${eventId}/checkin`, {
            method: 'manual',
            person_id: personId,
            operator_id: operatorId,
        });
        return data;
    }
    async getHistory(eventId, page = 1, pageSize = 50) {
        const { data } = await this.client.http.get(`/v1/events/${eventId}/checkins`, {
            params: { page, pageSize },
        });
        return data;
    }
}
exports.CheckinModule = CheckinModule;
