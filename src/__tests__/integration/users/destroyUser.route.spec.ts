import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../entities";
import { destroyUserRouteMock, errorsMock, tokenMock } from "../../mocks";

describe("DELETE /users", () => {
  let connection: DataSource;

  const userRepo = AppDataSource.getRepository(User);

  const baseUrl: string = "/users";
  const destroyInvalidIDUrl: string = baseUrl + "/123456";

  let userAdmin: User;
  let userNotAdmin: User;

  let destroyAdminUrl: string;
  let destroyUserUrl: string;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error));
  });

  beforeEach(async () => {
    const users: User[] = await userRepo.find();
    await userRepo.remove(users);

    userAdmin = await userRepo.save(destroyUserRouteMock.userAdminTemplate);
    userNotAdmin = await userRepo.save(
      destroyUserRouteMock.userNotAdminTemplate
    );

    destroyAdminUrl = baseUrl + `/${userAdmin.id}`;
    destroyUserUrl = baseUrl + `/${userNotAdmin.id}`;
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Success: Admin must be able to destroy a user - Admin token - Full body", async () => {
    const response = await supertest(app)
      .delete(destroyUserUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(userAdmin.admin, userAdmin.id)}`
      );

    const expectResults = { status: 204 };

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toStrictEqual({});
  });

  it("Error: User must not be able to destroy admin - User token", async () => {
    const response = await supertest(app)
      .delete(destroyAdminUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(userNotAdmin.admin, userNotAdmin.id)}`
      );

    expect(response.status).toBe(errorsMock.forbidden.status);
    expect(response.body).toStrictEqual(errorsMock.forbidden.error);
  });

  it("Error: Must not be able to destroy - Invalid ID", async () => {
    const response = await supertest(app)
      .delete(destroyInvalidIDUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(userNotAdmin.admin, userNotAdmin.id)}`
      );

    const expectResults = {
      status: 404,
      bodyEqual: { message: "User not found" },
    };

    expect(response.status).toBe(errorsMock.notFound.user.status);
    expect(response.body).toStrictEqual(errorsMock.notFound.user.error);
  });

  it("Error: Must not be able to destroy - User soft deleted", async () => {
    await userRepo.softRemove(userNotAdmin);

    const response = await supertest(app)
      .delete(destroyUserUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(userAdmin.admin, userAdmin.id)}`
      );

    expect(response.status).toBe(errorsMock.notFound.user.status);
    expect(response.body).toStrictEqual(errorsMock.notFound.user.error);
  });

  it("Error: Must not be able to destroy - Missing bearer", async () => {
    const response = await supertest(app).delete(destroyAdminUrl);

    expect(response.status).toBe(errorsMock.missingBearer.status);
    expect(response.body).toStrictEqual(errorsMock.missingBearer.error);
  });

  it("Error: Must not be able to destroy - Invalid signature", async () => {
    const response = await supertest(app)
      .delete(destroyAdminUrl)
      .set("Authorization", `Bearer ${tokenMock.invalidSignature}`);

    expect(response.status).toBe(errorsMock.invalidSignature.status);
    expect(response.body).toStrictEqual(errorsMock.invalidSignature.error);
  });

  it("Error: Must not be able to destroy - JWT malformed", async () => {
    const response = await supertest(app)
      .delete(destroyAdminUrl)
      .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`);

    expect(response.status).toBe(errorsMock.jwtMalformed.status);
    expect(response.body).toStrictEqual(errorsMock.jwtMalformed.error);
  });
});
