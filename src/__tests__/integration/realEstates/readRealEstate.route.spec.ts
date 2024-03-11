import supertest from "supertest";
import { DataSource, DeepPartial } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { RealEstate } from "../../../entities";
import { readRealEstateRouteMock } from "../../mocks";

describe("GET /realEstate", () => {
  let connection: DataSource;

  const baseUrl: string = "/realEstate";
  let readRealEstate: Array<DeepPartial<RealEstate>>;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then(async (res) => {
        connection = res;
        readRealEstate = await readRealEstateRouteMock.manyRealStations();
      })
      .catch((error) => console.error(error));
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Success: Must be able list all real estates", async () => {
    const response = await supertest(app).get(baseUrl).send();

    const expectResults = {
      status: 200,
      expectBody: readRealEstate,
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(expectResults.expectBody);
  });
});
