// API:n perusyksikkötesti (supertest)
// Testaa että /api/ping vastaa statuskoodilla 200 ja sisältää tekstin "Finansee API"

const request = require('supertest');
const app = require('../app');

describe('Finansee API basic tests', () => {
  it('GET /api/ping returns OK', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Finansee API/i);
  });
});
