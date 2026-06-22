"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonsModule = void 0;
class PersonsModule {
    constructor(client) {
        this.client = client;
    }
    async list(tenantId, page = 1, pageSize = 50) {
        const { data } = await this.client.http.get('/v1/persons', {
            params: { tenantId, page, pageSize },
        });
        return data;
    }
    async get(personId) {
        const { data } = await this.client.http.get(`/v1/persons/${personId}`);
        return data;
    }
    async enroll(personId, frame) {
        const { data } = await this.client.http.post(`/v1/persons/${personId}/enroll`, { frame });
        return data;
    }
    async delete(personId) {
        await this.client.http.delete(`/v1/persons/${personId}`);
    }
}
exports.PersonsModule = PersonsModule;
