const request = require("supertest");
const app = require("../src/server");

function uniqEmail() {
  return `test_${Date.now()}_${Math.floor(Math.random() * 100000)}@mail.com`;
}

describe("Auth", () => {
  it("POST /api/auth/register -> 201 and POST /api/auth/login -> token", async () => {
    const email = uniqEmail();
    const password = "123456";
    const name = "Test User";

    const register = await request(app)
      .post("/api/auth/register")
      .send({ name, email, password });

    expect([201, 200]).toContain(register.status); // 201 esperado
    expect(register.body.email).toBe(email);

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email, password });

    expect(login.status).toBe(200);
    expect(typeof login.body.token).toBe("string");
    expect(login.body.token.length).toBeGreaterThan(50);
  });
});