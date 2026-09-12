const request = require("supertest");
const express = require("express");

// On mock la db pour ne pas faire les test sur la vrai db
const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

jest.mock("../script/DB", () => ({
  connect: jest.fn(() => Promise.resolve(mockClient)),
  query: jest.fn(), // Au cas où
}));

const router = require("../script/Routes/register");

const app = express();
app.use(express.json());
app.use("/auth", router);

// On reset les mocks a chaque test pour pas alterer un test
afterEach(() => {
  jest.clearAllMocks();
  mockClient.query.mockReset();
  mockClient.release.mockReset();
});

// =================    TEST REGISTER  ========================= //
const user = {
  name: "Dupont",
  firstname: "Jean",
  email: "jean@example.com",
  password: "1234",
};

test("201 - inscription réussie", async () => {
  mockClient.query
    .mockResolvedValueOnce({})
    .mockResolvedValueOnce({ rows: [] })
    .mockResolvedValueOnce({ rows: [{ id_utilisateur: 42 }] })
    .mockResolvedValueOnce({})
    .mockResolvedValueOnce({});

  const res = await request(app).post("/auth/register").send(user);

  expect(res.statusCode).toBe(201);
  expect(mockClient.release).toHaveBeenCalledTimes(1);
});

test("409 - email déjà utilisé", async () => {
  mockClient.query
    .mockResolvedValueOnce({})
    .mockResolvedValueOnce({ rows: [user] });

  const res = await request(app).post("/auth/register").send(user);

  expect(res.statusCode).toBe(409);
  expect(mockClient.release).toHaveBeenCalledTimes(1);
});

test("500 - internal server error", async () => {
  mockClient.query.mockRejectedValueOnce(new Error("DB crash"));

  const res = await request(app).post("/auth/register").send(user);

  expect(res.statusCode).toBe(500);
  expect(mockClient.release).toHaveBeenCalledTimes(1);
});
// =============================================================== //
