import express from "express";
import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import { isRole } from "../middleware/isRole.js";

// Simulate auth by assigning req.user
const isAuthMock = (user) => (req, _res, next) => {
  req.user = user;
  next();
};

describe("Role-protected routes", () => {
  it("student cannot access teacher dashboard", async () => {
    const app = express();
    app.get(
      "/api/v1/teacher/dashboard",
      isAuthMock({ role: "student" }),
      isRole("teacher"),
      (_req, res) => res.json({ message: "Welcome Teacher!" })
    );
    const res = await request(app).get("/api/v1/teacher/dashboard");
    expect(res.status).toBe(403);
  });

  it("teacher can access teacher dashboard", async () => {
    const app = express();
    app.get(
      "/api/v1/teacher/dashboard",
      isAuthMock({ role: "teacher" }),
      isRole("teacher"),
      (_req, res) => res.json({ message: "Welcome Teacher!" })
    );
    const res = await request(app).get("/api/v1/teacher/dashboard");
    expect(res.status).toBe(200);
    expect(res.body.message).toContain("Welcome Teacher");
  });

  it("teacher cannot access student dashboard", async () => {
    const app = express();
    app.get(
      "/api/v1/student/dashboard",
      isAuthMock({ role: "teacher" }),
      isRole("student"),
      (_req, res) => res.json({ message: "Welcome Student!" })
    );
    const res = await request(app).get("/api/v1/student/dashboard");
    expect(res.status).toBe(403);
  });
});

