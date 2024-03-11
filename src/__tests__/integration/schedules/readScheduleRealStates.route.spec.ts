import supertest from "supertest";
import { DataSource, DeepPartial } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { RealEstate } from "../../../entities";
import { errorsMock, readScheduleRouteMock, tokenMock } from "../../mocks";

describe("GET /schedules/realEstate/:id", () => {
  let connection: DataSource;

  const baseUrl: string = "/schedules/realEstate";
  let realEstateID: string;
  let realEstateInvalidID: string = baseUrl + "/123456";
  let readRealEstate: DeepPartial<RealEstate>;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then(async (res) => {
        connection = res;
        readRealEstate = await readScheduleRouteMock.manySchedules();
        realEstateID = baseUrl + `/${readRealEstate.id}`;
      })
      .catch((error) => console.error(error));
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Success: Must be able list all real estates schedules - Admin token", async () => {
    const response = await supertest(app)
      .get(realEstateID)
      .set("Authorization", `Bearer ${tokenMock.genToken(true, 1)}`);

    const expectResults = {
      status: 200,
      expectBody: readRealEstate,
    };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(expectResults.expectBody);
  });

  it("Error: Must not be able list all real estates schedules - User token", async () => {
    const response = await supertest(app)
      .get(realEstateInvalidID)
      .set("Authorization", `Bearer ${tokenMock.genToken(true, 1)}`);

    expect(response.body).toEqual(errorsMock.notFound.realEstate.error);
    expect(response.status).toBe(errorsMock.notFound.realEstate.status);
  });

  it("Error: Must not be able list all real estates schedules - User token", async () => {
    const response = await supertest(app)
      .get(realEstateID)
      .set("Authorization", `Bearer ${tokenMock.genToken(false, 1)}`);

    expect(response.body).toEqual(errorsMock.forbidden.error);
    expect(response.status).toBe(errorsMock.forbidden.status);
  });

  it("Error: Must not be able list all real estates schedules - Missing bearer", async () => {
    const response = await supertest(app).get(realEstateID);

    expect(response.body).toEqual(errorsMock.missingBearer.error);
    expect(response.status).toBe(errorsMock.missingBearer.status);
  });

  it("Error: Must not be able list all real estates schedules - Invalid signature", async () => {
    const response = await supertest(app)
      .get(realEstateID)
      .set("Authorization", `Bearer ${tokenMock.invalidSignature}`);

    expect(response.body).toEqual(errorsMock.invalidSignature.error);
    expect(response.status).toBe(errorsMock.invalidSignature.status);
  });

  it("Error: Must not be able list all real estates schedules - JWT malformed", async () => {
    const response = await supertest(app)
      .get(realEstateID)
      .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`);

    expect(response.body).toEqual(errorsMock.jwtMalformed.error);
    expect(response.status).toBe(errorsMock.jwtMalformed.status);
  });
});
