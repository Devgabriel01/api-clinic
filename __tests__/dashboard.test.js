const request = require("supertest");
const app = require("../src/server");

describe("Dashboard auth", () => {
  it("GET /api/dashboard/stats without token -> 401 missing_auth", async () => {
    const res = await request(app).get("/api/dashboard/stats");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("missing_auth");
  });
});