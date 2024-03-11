import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { Category } from "../../../entities";
import { createCategoryRouteMock, errorsMock, tokenMock } from "../../mocks";

describe("POST /categories", () => {
  let connection: DataSource;

  const baseUrl: string = "/categories";
  const categoryRepo = AppDataSource.getRepository(Category);

  const adminToken: string = tokenMock.genToken(true, 1);
  const userToken: string = tokenMock.genToken(false, 2);

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error));
  });

  beforeEach(async () => {
    const categories: Array<Category> = await categoryRepo.find();
    await categoryRepo.remove(categories);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Success: Must be able to create a category - Admin token", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(createCategoryRouteMock.category);

    const expectResults = {
      status: 201,
      bodyEqual: expect.objectContaining({
        ...createCategoryRouteMock.category,
        id: expect.any(Number),
      }),
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must be able to create a category - Unique name", async () => {
    await categoryRepo.save(createCategoryRouteMock.categoryUnique);

    const response = await supertest(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(createCategoryRouteMock.categoryUnique);

    const expectResults = {
      status: 409,
      bodyEqual: { message: "Category already exists" },
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual(expectResults.bodyEqual);
  });

  it("Error: Must be able to create a category - User token", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${userToken}`)
      .send(createCategoryRouteMock.category);

    expect(response.status).toBe(errorsMock.forbidden.status);
    expect(response.body).toStrictEqual(errorsMock.forbidden.error);
  });

  it("Error: Must be able to create a category - Missing bearer", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .send(createCategoryRouteMock.category);

    expect(response.status).toBe(errorsMock.missingBearer.status);
    expect(response.body).toStrictEqual(errorsMock.missingBearer.error);
  });

  it("Error: Must be able to create a category - Invalid signature", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${tokenMock.invalidSignature}`)
      .send(createCategoryRouteMock.category);

    expect(response.status).toBe(errorsMock.invalidSignature.status);
    expect(response.body).toStrictEqual(errorsMock.invalidSignature.error);
  });

  it("Error: Must be able to create a category - JWT malformed", async () => {
    const response = await supertest(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`)
      .send(createCategoryRouteMock.category);

    expect(response.status).toBe(errorsMock.jwtMalformed.status);
    expect(response.body).toStrictEqual(errorsMock.jwtMalformed.error);
  });
});
