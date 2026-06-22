import { VelixClient } from '../client';
import { CheckinModule } from '../modules/checkin';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CheckinModule', () => {
  let client: VelixClient;
  let checkin: CheckinModule;

  beforeEach(() => {
    mockedAxios.create.mockReturnValue({
      post: jest.fn(),
      get: jest.fn(),
    } as any);
    client = new VelixClient({ apiUrl: 'http://test', apiKey: 'test-key' });
    checkin = new CheckinModule(client);
  });

  it('should call facial checkin endpoint', async () => {
    (client.http.post as jest.Mock).mockResolvedValue({
      data: { success: true, personId: 'p1', eventId: 'e1', method: 'facial', timestamp: '2026-01-01T00:00:00Z' },
    });
    const result = await checkin.facial('e1', 'frame_base64');
    expect(client.http.post).toHaveBeenCalledWith('/v1/events/e1/checkin', expect.objectContaining({ method: 'facial' }));
    expect(result.success).toBe(true);
  });

  it('should include gps when provided', async () => {
    (client.http.post as jest.Mock).mockResolvedValue({
      data: { success: true, personId: 'p1', eventId: 'e1', method: 'facial', timestamp: '2026-01-01T00:00:00Z' },
    });
    await checkin.facial('e1', 'frame', { lat: -23.5, lng: -46.6 });
    expect(client.http.post).toHaveBeenCalledWith(
      '/v1/events/e1/checkin',
      expect.objectContaining({ lat: -23.5, lng: -46.6 }),
    );
  });

  it('should call qrCode checkin endpoint', async () => {
    (client.http.post as jest.Mock).mockResolvedValue({
      data: { success: true, personId: 'p1', eventId: 'e1', method: 'qr_code', timestamp: '2026-01-01T00:00:00Z' },
    });
    const result = await checkin.qrCode('e1', 'QR_TOKEN_123');
    expect(client.http.post).toHaveBeenCalledWith(
      '/v1/events/e1/checkin',
      expect.objectContaining({ method: 'qr_code', qr_token: 'QR_TOKEN_123' }),
    );
    expect(result.method).toBe('qr_code');
  });

  it('should call manual checkin endpoint', async () => {
    (client.http.post as jest.Mock).mockResolvedValue({
      data: { success: true, personId: 'p1', eventId: 'e1', method: 'manual', timestamp: '2026-01-01T00:00:00Z' },
    });
    await checkin.manual('e1', 'person-1', 'operator-1');
    expect(client.http.post).toHaveBeenCalledWith(
      '/v1/events/e1/checkin',
      expect.objectContaining({ method: 'manual', person_id: 'person-1', operator_id: 'operator-1' }),
    );
  });
});
