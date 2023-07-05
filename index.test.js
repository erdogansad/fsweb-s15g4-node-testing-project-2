const request = require("supertest");
const server = require("./api/server");
const db = require("./data/db-config");
const { users } = require("./data/seeds/01-users");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db.seed.run();
});
afterAll(async () => {
  await db.destroy();
});

test("[0] sanity check", () => {
  expect(true).not.toBe(false);
});

describe("API Control", () => {
  describe("[POST] /api/auth/register", () => {
    test("[1] veritabanında yeni bir kullanıcı oluşturuluyor", async () => {
      const res = await request(server).post("/api/auth/register").send({ username: "foo", password: "bar", permission: 0 });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("user_id", 4);
    });
    test("[2] yeni kullanıcı oluşturulduğunda permission gönderilmezse, varsayılan olarak 0 atanıyor", async () => {
      const res = await request(server).post("/api/auth/register").send({ username: "foo", password: "bar" });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("permission", 0);
    });
    test("[3] username veya password boş gönderilirse 400 döndürülüyor", async () => {
      const res = await request(server).post("/api/auth/register").send({ username: "foo" });
      expect(res.status).toBe(400);
      const res2 = await request(server).post("/api/auth/register").send({ password: "baz" });
      expect(res2.status).toBe(400);
    });
    test("[4] username veritabanında varsa 409 döndürülüyor", async () => {
      const res = await request(server).post("/api/auth/register").send({ username: "foo", password: "bar", permission: 0 });
      expect(res.status).toBe(201);
      const res2 = await request(server).post("/api/auth/register").send({ username: "foo", password: "bar", permission: 0 });
      expect(res2.status).toBe(409);
    });
  });
  describe("[POST] /api/auth/login", () => {
    test("[5] veritabanında var olan bir kullanıcı ile giriş yapılıyor", async () => {
      const res = await request(server).post("/api/auth/register").send({ username: "foo", password: "bar", permission: 0 });
      expect(res.status).toBe(201);
      const res2 = await request(server).post("/api/auth/login").send({ username: "foo", password: "bar" });
      expect(res2.status).toBe(200);
      expect(res2.body).toHaveProperty("message", expect.stringMatching(/welcome, foo. Your token is:/i));
    });
    test("[6] veritabanında olmayan bir kullanıcı ile giriş yapılmaya çalışıldığında 401 döndürülüyor", async () => {
      const res = await request(server).post("/api/auth/login").send({ username: "foo", password: "bar" });
      expect(res.status).toBe(401);
    });
    test("[7] username veya password boş gönderilirse 400 döndürülüyor", async () => {
      const res = await request(server).post("/api/auth/login").send({ username: "foo" });
      expect(res.status).toBe(400);
      const res2 = await request(server).post("/api/auth/login").send({ password: "baz" });
      expect(res2.status).toBe(400);
    });
  });
  describe("[GET] /api/users", () => {
    test("[8] kullanıcılar listeleniyor", async () => {
      const res = await request(server).post("/api/auth/login").send({ username: "admin", password: "1234" }),
        token = res.body.message.split(" "),
        res2 = await request(server)
          .get("/api/users")
          .set("Authorization", `Bearer ${token[token.length - 1]}`);
      expect(res2.status).toBe(200);
      expect(res2.body).toHaveLength(3);
    });
    test("[9] token gönderilmezse 403 döndürülüyor", async () => {
      const res = await request(server).get("/api/users");
      expect(res.status).toBe(403);
    });
    test("[10] token geçersizse 401 döndürülüyor", async () => {
      const res = await request(server).get("/api/users").set("Authorization", "Bearer foo");
      expect(res.status).toBe(401);
    });
  });
  describe("[GET] /api/users/:id", () => {
    test("[11] kullanıcı id'si verilen kullanıcı listeleniyor", async () => {
      const res = await request(server).post("/api/auth/login").send({ username: "admin", password: "1234" }),
        token = res.body.message.split(" "),
        res2 = await request(server)
          .get("/api/users/1")
          .set("Authorization", `Bearer ${token[token.length - 1]}`);
      expect(res2.status).toBe(200);
      expect(res2.body).toHaveProperty("username", "admin");
    });
    test("[12] id'si verilen kullanıcı veritabanında yoksa 404 döndürülüyor", async () => {
      const res = await request(server).post("/api/auth/login").send({ username: "admin", password: "1234" }),
        token = res.body.message.split(" "),
        res2 = await request(server)
          .get("/api/users/4")
          .set("Authorization", `Bearer ${token[token.length - 1]}`);
      expect(res2.status).toBe(404);
    });
    test("[13] token gönderilmezse 403 döndürülüyor", async () => {
      const res = await request(server).get("/api/users/1");
      expect(res.status).toBe(403);
    });
    test("[14] token geçersizse 401 döndürülüyor", async () => {
      const res = await request(server).get("/api/users").set("Authorization", "Bearer foo");
      expect(res.status).toBe(401);
    });
  });
});
