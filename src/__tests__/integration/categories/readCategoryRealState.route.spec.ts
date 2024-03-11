import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { RealEstate } from "../../../entities";
import { errorsMock, readCategoryRealStateRouteMock } from "../../mocks";

describe("GET /categories/:id/realEstate", () => {
  let connection: DataSource;

  let categoryRealEstate: Array<RealEstate>;
  let baseUrl: string = "/categories";
  const readInvalidIDUrl: string = baseUrl + "/123456/realEstate";

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then(async (res) => {
        connection = res;
        const category =
          await readCategoryRealStateRouteMock.categoryRealStation();

        categoryRealEstate = category;
        baseUrl = baseUrl + `/${category.id}/realEstate`;
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
      bodyEqual: expect.objectContaining(categoryRealEstate),
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(expectResults.bodyEqual);
  });

  it("Error: Must be not able to list all real states from a category - Invalid ID", async () => {
    const response = await supertest(app).get(readInvalidIDUrl);

    expect(response.status).toBe(errorsMock.notFound.category.status);
    expect(response.body).toStrictEqual(errorsMock.notFound.category.error);
  });
});
