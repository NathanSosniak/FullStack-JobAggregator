const request = require("supertest");
const express = require("express");

jest.mock("../script/DB", () => ({ query: jest.fn() }));
jest.mock("../script/Middleware", () => ({
  auth: (req, res, next) => next(),
  isAdmin: (req, res, next) => next(),
}));

const connection = require("../script/DB");
const deleteRoute = require("../script/Routes/admin/delete_enterprise");

const app = express();
app.use(express.json());
app.use(deleteRoute);

afterEach(() => {
  jest.clearAllMocks();
  connection.query.mockReset();
});

// =================    TEST DELETE ENTERPRISE  ========================= //

test("400 - id is not an integer", async () => {
  const res = await request(app).delete("/enterprise/abc");
  expect(res.statusCode).toBe(400);
  expect(res.body.msg).toBe("The id parameter must be an Integer");
});

test("404 - enterprise does not exist", async () => {
  connection.query.mockResolvedValueOnce({ rowCount: 0 });

  const res = await request(app).delete("/enterprise/999");
  expect(res.statusCode).toBe(404);
  expect(res.body.msg).toBe("The enterprise does not exist");
});

test("200 - enterprise deleted", async () => {
  connection.query.mockResolvedValueOnce({ rowCount: 1 });

  const res = await request(app).delete("/enterprise/1");
  expect(res.statusCode).toBe(200);
  expect(res.body.msg).toBe("Enterprise deleted");
});

test("500 - internal server error", async () => {
  connection.query.mockRejectedValueOnce(new Error("DB down"));

  const res = await request(app).delete("/enterprise/1");
  expect(res.statusCode).toBe(500);
  expect(res.body.msg).toBe("Internal server error");
});

// ====================================================================== //
