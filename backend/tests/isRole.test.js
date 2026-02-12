import express from "express";
import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import { isRole } from "../middleware/isRole.js";

const buildApp = (user) => {
  const app = express();
  app.use((req, _res, next) => {
    req.user = user;
    next();
  });
  app.get("/teacher-only", isRole("teacher"), (_req, res) =>
    res.status(200).json({ ok: true })
  );
  app.get("/student-only", isRole("student"), (_req, res) =>
    res.status(200).json({ ok: true })
  );
  return app;
};

describe("isRole middleware", () => {
  it("allows teacher to access teacher route", async () => {
    const app = buildApp({ role: "teacher" });
    const res = await request(app).get("/teacher-only");
    expect(res.status).toBe(200);
  });

  it("denies student to access teacher route", async () => {
    const app = buildApp({ role: "student" });
    const res = await request(app).get("/teacher-only");
    expect(res.status).toBe(403);
  });

  it("denies missing role", async () => {
    const app = buildApp({});
    const res = await request(app).get("/teacher-only");
    expect(res.status).toBe(401);
  });
});

