import request from "supertest";
import app from "../src/app";
import * as loginRepo from "../src/repositories/auth.repository";

jest.mock("../src/services/auth.service", () => ({
  ...jest.requireActual("../src/services/auth.service"),
  getLoginInfo: jest.fn(),
  compareHash: jest.fn(),
}));

describe("Test call endpoint", () => {
  it("GET /api/status debería de responder con un not found", async () => {
    const res = await request(app).get("/api/status");

    expect(res.status).toBe(404);
  });
 
  it("login fallido por usuario incorrecto", async () => {
    jest.spyOn(loginRepo, "getLoginInfo").mockResolvedValue(null);

    const res = await request(app).post("/api/auth/login").send({
      username: "usuario_incorrecto",
      password: "contraseña_incorrecta",
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Invalid credentials" });
  });

  it("login correcto", async () => {
    jest.spyOn(loginRepo, "getLoginInfo").mockResolvedValue({
      id: 1,
      rol: "1",
      password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", // hashed password for "password"
    });

    const res = await request(app).post("/api/auth/login").send({
      username: "usuario_correcto",
      password: "password",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  }
);
});
