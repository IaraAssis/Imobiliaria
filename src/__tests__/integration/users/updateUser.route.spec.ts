import supertest from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../entities";
import { errorsMock, tokenMock, updateUserRouteMock } from "../../mocks";

describe("PATCH /users", () => {
  let connection: DataSource;

  let updateAdminUrl: string;
  let updateUserUrl: string;
  const baseUrl: string = "/users";
  const updateInvalidIDUrl: string = baseUrl + "/123456";

  const userRepo = AppDataSource.getRepository(User);
  let userAdmin: User;
  let userNotAdmin: User;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((error) => console.error(error));
  });

  beforeEach(async () => {
    const users: User[] = await userRepo.find();
    await userRepo.remove(users);

    userAdmin = await userRepo.save(updateUserRouteMock.userAdminTemplate);
    userNotAdmin = await userRepo.save(
      updateUserRouteMock.userNotAdminTemplate
    );

    updateAdminUrl = baseUrl + `/${userAdmin.id}`;
    updateUserUrl = baseUrl + `/${userNotAdmin.id}`;
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Success: Admin must be able to update a user - Admin token - Full body", async () => {
    const response = await supertest(app)
      .patch(updateUserUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(userAdmin.admin, userAdmin.id)}`
      )
      .send(updateUserRouteMock.userComplete);

    const expectResults = {
      status: 200,
    };

    const { password, ...payload } = updateUserRouteMock.userComplete;

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(
      expect.objectContaining({ ...payload, id: userNotAdmin.id })
    );
    expect(response.body).not.toEqual(
      expect.objectContaining({ password: expect.any(String) })
    );
  });

  it("Success: Admin must be able to self update - Admin token - Full body", async () => {
    const response = await supertest(app)
      .patch(updateAdminUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(userAdmin.admin, userAdmin.id)}`
      )
      .send(updateUserRouteMock.userComplete);

    const expectResults = {
      status: 200,
    };

    const { password, ...payload } = updateUserRouteMock.userComplete;

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(
      expect.objectContaining({ ...payload, id: userAdmin.id })
    );
    expect(response.body).not.toEqual(
      expect.objectContaining({ password: expect.any(String) })
    );
  });

  it("Success: User must be able to self update - User token - Full body", async () => {
    const response = await supertest(app)
      .patch(updateUserUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(userNotAdmin.admin, userNotAdmin.id)}`
      )
      .send(updateUserRouteMock.userComplete);

    const expectResults = {
      status: 200,
    };

    const { password, ...payload } = updateUserRouteMock.userComplete;

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(
      expect.objectContaining({ ...payload, id: userNotAdmin.id })
    );
    expect(response.body).not.toEqual(
      expect.objectContaining({ password: expect.any(String) })
    );
  });

  it("Success: Admin must be able to self update - Admin token - Partial", async () => {
    const response = await supertest(app)
      .patch(updateAdminUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(userAdmin.admin, userAdmin.id)}`
      )
      .send(updateUserRouteMock.userPartial);

    const expectResults = {
      status: 200,
    };

    const { password, ...payload } = userAdmin;

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(expect.objectContaining(payload));
    expect(response.body).not.toEqual(
      expect.objectContaining({ password: expect.any(String) })
    );
  });

  it("Success: User must be able to self update - User token - Partial", async () => {
    const response = await supertest(app)
      .patch(updateUserUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(userAdmin.admin, userNotAdmin.id)}`
      )
      .send(updateUserRouteMock.userPartial);

    const expectResults = {
      status: 200,
    };

    const { password, ...payload } = userNotAdmin;

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(expect.objectContaining(payload));
    expect(response.body).not.toEqual(
      expect.objectContaining({ password: expect.any(String) })
    );
  });

  it("Success: Admin must not be able to update 'admin' field - Admin token - Partial", async () => {
    const response = await supertest(app)
      .patch(updateAdminUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(userAdmin.admin, userAdmin.id)}`
      )
      .send(updateUserRouteMock.userAdmin);

    const expectResults = {
      status: 200,
    };

    const { password, ...payload } = userAdmin;

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(expect.objectContaining(payload));
    expect(response.body).not.toEqual(
      expect.objectContaining({ password: expect.any(String) })
    );
  });

  it("Success: User must not be able to update 'admin' field - Admin token - Partial", async () => {
    const response = await supertest(app)
      .patch(updateUserUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(userNotAdmin.admin, userNotAdmin.id)}`
      )
      .send(updateUserRouteMock.userAdmin);

    const expectResults = {
      status: 200,
    };

    const { password, ...payload } = userNotAdmin;

    expect(response.status).toBe(expectResults.status);
    expect(response.body).toEqual(expect.objectContaining(payload));
    expect(response.body).not.toEqual(
      expect.objectContaining({ password: expect.any(String) })
    );
  });

  it("Error: User must not be able to update admin - User token", async () => {
    const response = await supertest(app)
      .patch(updateAdminUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(userNotAdmin.admin, userNotAdmin.id)}`
      )
      .send(updateUserRouteMock.userComplete);

    expect(response.status).toBe(errorsMock.forbidden.status);
    expect(response.body).toStrictEqual(errorsMock.forbidden.error);
  });

  it("Error: Must not be able to update - Missing bearer", async () => {
    const response = await supertest(app)
      .patch(updateAdminUrl)
      .send(updateUserRouteMock.userComplete);

    expect(response.status).toBe(errorsMock.missingBearer.status);
    expect(response.body).toStrictEqual(errorsMock.missingBearer.error);
  });

  it("Error: Must not be able to update - Invalid signature", async () => {
    const response = await supertest(app)
      .patch(updateAdminUrl)
      .set("Authorization", `Bearer ${tokenMock.invalidSignature}`)
      .send(updateUserRouteMock.userComplete);

    expect(response.status).toBe(errorsMock.invalidSignature.status);
    expect(response.body).toStrictEqual(errorsMock.invalidSignature.error);
  });

  it("Error: Must not be able to update - JWT malformed", async () => {
    const response = await supertest(app)
      .patch(updateAdminUrl)
      .set("Authorization", `Bearer ${tokenMock.jwtMalformed}`)
      .send(updateUserRouteMock.userComplete);

    expect(response.status).toBe(errorsMock.jwtMalformed.status);
    expect(response.body).toStrictEqual(errorsMock.jwtMalformed.error);
  });

  it("Error: Must not be able to update - Invalid ID", async () => {
    const response = await supertest(app)
      .patch(updateInvalidIDUrl)
      .set(
        "Authorization",
        `Bearer ${tokenMock.genToken(userNotAdmin.admin, userNotAdmin.id)}`
      )
      .send(updateUserRouteMock.userComplete);

    expect(response.status).toBe(errorsMock.notFound.user.status);
    expect(response.body).toStrictEqual(errorsMock.notFound.user.error);
  });
});
