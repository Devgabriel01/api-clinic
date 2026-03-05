const request = require("supertest");
const app = require("../src/server");

describe("Health", () => {
  it("GET /health -> 200 { ok: true }", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.service).toBe("api-clinic");
  });
});