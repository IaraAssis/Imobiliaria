import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { Category } from "../../../entities";
import { readCategoryRouteMock } from "../../mocks";

describe("GET /categories", () => {
  let connection: DataSource;

  let categories: Array<Category>;
  let baseUrl: string = "/categories";

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then(async (res) => {
        connection = res;
        categories = await readCategoryRouteMock.manyCategories();
      })
      .catch((error) => {
        console.error(error);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Success: Must be able to list all real states from a category", async () => {
    const response = await supertest(app).get(baseUrl);

    const expectResults = {
      status: 200,
      bodyEqual: expect.arrayContaining(categories),
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(expectResults.bodyEqual);
  });
});
