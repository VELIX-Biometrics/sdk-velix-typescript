import { VelixClient } from '../client';
import { EventsModule } from '../modules/events';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('EventsModule', () => {
  let client: VelixClient;
  let events: EventsModule;

  beforeEach(() => {
    mockedAxios.create.mockReturnValue({
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    } as any);
    client = new VelixClient({ apiUrl: 'http://test', apiKey: 'test-key' });
    events = new EventsModule(client);
  });

  it('should list events with pagination', async () => {
    (client.http.get as jest.Mock).mockResolvedValue({
      data: {
        items: [{ id: 'evt-1', name: 'Tech Summit', status: 'active' }],
        total: 1, page: 1, limit: 20,
      },
    });
    const result = await events.list({ page: 1, limit: 20 });
    expect(client.http.get).toHaveBeenCalledWith('/v1/events', expect.objectContaining({ params: { page: 1, limit: 20 } }));
    expect(result.total).toBe(1);
    expect(result.items[0].id).toBe('evt-1');
  });

  it('should get event by id', async () => {
    (client.http.get as jest.Mock).mockResolvedValue({
      data: { id: 'evt-1', name: 'Tech Summit', status: 'active' },
    });
    const event = await events.get('evt-1');
    expect(client.http.get).toHaveBeenCalledWith('/v1/events/evt-1');
    expect(event.id).toBe('evt-1');
  });

  it('should create a new event', async () => {
    (client.http.post as jest.Mock).mockResolvedValue({
      data: { id: 'evt-new', name: 'New Event', status: 'draft' },
    });
    const event = await events.create({ name: 'New Event' });
    expect(client.http.post).toHaveBeenCalledWith('/v1/events', expect.objectContaining({ name: 'New Event' }));
    expect(event.id).toBe('evt-new');
    expect(event.status).toBe('draft');
  });

  it('should configure event settings', async () => {
    (client.http.patch as jest.Mock).mockResolvedValue({
      data: { id: 'evt-1', checkInOpen: true },
    });
    await events.configure('evt-1', { checkInOpen: true });
    expect(client.http.patch).toHaveBeenCalledWith('/v1/events/evt-1/config', expect.objectContaining({ checkInOpen: true }));
  });
});
