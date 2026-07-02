import { VelixClient } from '../client';
import { TenantsModule } from '../modules/tenants';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TenantsModule', () => {
  let client: VelixClient;
  let tenants: TenantsModule;

  beforeEach(() => {
    mockedAxios.create.mockReturnValue({
      get: jest.fn(),
      put: jest.fn(),
    } as any);
    client = new VelixClient({ apiUrl: 'http://test', apiKey: 'test-key' });
    tenants = new TenantsModule(client);
  });

  it('should get current tenant (me)', async () => {
    (client.http.get as jest.Mock).mockResolvedValue({
      data: { id: 'tenant-uuid', name: 'Acme Corp', slug: 'acme', plan: 'enterprise', maxPersons: 1000 },
    });
    const tenant = await tenants.me();
    expect(client.http.get).toHaveBeenCalledWith('/v1/tenants/me');
    expect(tenant.id).toBe('tenant-uuid');
    expect(tenant.slug).toBe('acme');
  });

  it('should update tenant settings', async () => {
    (client.http.put as jest.Mock).mockResolvedValue({
      data: { id: 'tenant-uuid', requireLiveness: true, timezone: 'America/Sao_Paulo' },
    });
    const tenant = await tenants.updateSettings({ requireLiveness: true, timezone: 'America/Sao_Paulo' });
    expect(client.http.put).toHaveBeenCalledWith(
      '/v1/tenants/me/settings',
      expect.objectContaining({ requireLiveness: true, timezone: 'America/Sao_Paulo' }),
    );
    expect(tenant.requireLiveness).toBe(true);
    expect(tenant.timezone).toBe('America/Sao_Paulo');
  });
});
