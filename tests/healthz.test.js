
const request = require("supertest");
const { sequelize } = require("../config/sequelize");
const app = require("../config/express");

let server; 

describe("🔹 Health Check API Tests", () => {
  beforeAll(async () => {
    await sequelize.sync(); 
    
  });

  afterAll(async () => {
    await sequelize.close(); 
    
  });

  
  it("should return 200 OK for GET /healthz", async () => {
    const res = await request(app).get("/healthz");
    expect(res.headers["cache-control"]).toBe("no-cache, no-store, must-revalidate");
    expect(res.statusCode).toBe(201); 
    expect(res.text).toBe(""); 
  });

  
  it("should return 503 Status when Sequelize connection fails", async () => {
    jest.spyOn(sequelize, "authenticate").mockImplementation(() => {
      throw new Error("Database connection error");
    });

    const res = await request(app).get("/healthz");
    expect(res.statusCode).toBe(503); 
    sequelize.authenticate.mockRestore(); 
  });

 
  it("should return 400 Bad Request when payload is included", async () => {
    const resQuery = await request(app).get("/healthz?abc=23");
    expect(resQuery.statusCode).toBe(400);

    const resBody = await request(app).get("/healthz").send({ "abc": "ball" });
    expect(resBody.statusCode).toBe(400);
  });

  
  it("should return 405 for POST /healthz", async () => {
    const res = await request(app).post("/healthz");
    expect(res.statusCode).toBe(405);
  });

  it("should return 405 for PUT /healthz", async () => {
    const res = await request(app).put("/healthz");
    expect(res.statusCode).toBe(405);
  });

  it("should return 405 for PATCH /healthz", async () => {
    const res = await request(app).patch("/healthz");
    expect(res.statusCode).toBe(405);
  });

  it("should return 405 for DELETE /healthz", async () => {
    const res = await request(app).delete("/healthz");
    expect(res.statusCode).toBe(405);
  });

  it("should return 405 for HEAD /healthz", async () => {
    const res = await request(app).head("/healthz");
    expect(res.statusCode).toBe(405);
    // expect(res.headers["content-length"]).toBe("0"); // Ensures no response body
  });

  it("should return 405 for OPTIONS /healthz", async () => {
    const res = await request(app).options("/healthz");
    expect(res.statusCode).toBe(405);
  });

  


  
});
