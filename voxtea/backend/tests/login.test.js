const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("@node-rs/bcrypt");

jest.mock("@node-rs/bcrypt", () => ({
  compare: jest.fn()
}));

const User = require("../models/User");
jest.mock("../models/User");

const loginRoute = require("../routes/users/login");

const app = express();
app.use(express.json());
app.use("/api/users", loginRoute);

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked-jwt-token"),
  verify: jest.fn((token, secret) => ({ id: "user123" })),
}));

describe("POST /api/users/login", () => {
  const mockUser = {
    _id: "user123",
    email: "test@email.com",
    password: "hashedPassword",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if email or password is missing", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "test@email.com" }); // no password

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please provide both email and password.");
  });

  it("should return 404 if user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "notfound@email.com", password: "123456" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found. Please register first.");
  });

  it("should return 401 if password is invalid", async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post("/api/users/login")
      .send({ email: mockUser.email, password: "wrongpassword" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid email or password.");
  });

  it("should return a token if credentials are valid", async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
  
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: mockUser.email, password: "correctpassword" });
  
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe("mocked-jwt-token");
  });
  

  it("should handle server error gracefully", async () => {
    User.findOne.mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "test@email.com", password: "123456" });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Server error. Please try again.");
  });
});
