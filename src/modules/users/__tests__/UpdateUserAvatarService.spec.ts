import { FakeEntrepreneursRepository } from "@modules/companies/repositories/fakes/FakeEntrepreneursRepository";
import { IEntrepreneursRepository } from "@modules/companies/repositories/IEntrepreneursRepository";
import { FakeStorageProvider } from "@shared/container/providers/StorageProvider/fakes/FakerStorageProvider";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/models/IStorageProvider";

import { FakeHashProvider } from "../providers/HashProvider/Fakes/FakeHashProvider";
import { IHashProvider } from "../providers/HashProvider/models/IHashProvider";
import { FakeUsersRepository } from "../repositories/Fakes/FakeUsersRepository";
import { IUsersRepository } from "../repositories/IUsersRepository";
import { CreateUserService } from "../services/CreateUserService";
import { UpdateUserAvatarService } from "../services/UpdateUserAvatarService";

let usersRepositoryFake: IUsersRepository;
let fakeHashProvider: IHashProvider;
let fakeStorageProvider: IStorageProvider;
let fakeEntrepreneurRepository: IEntrepreneursRepository;
let createUserService: CreateUserService;
let updateUserAvatarService: UpdateUserAvatarService;

describe("Update User Avatar Service", () => {
  beforeEach(() => {
    usersRepositoryFake = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeStorageProvider = new FakeStorageProvider();
    fakeEntrepreneurRepository = new FakeEntrepreneursRepository();
    createUserService = new CreateUserService(
      usersRepositoryFake,
      fakeEntrepreneurRepository,
      fakeHashProvider,
    );

    updateUserAvatarService = new UpdateUserAvatarService(
      usersRepositoryFake,
      fakeStorageProvider
    );
  });

  it("Should be able to update user avatar", async () => {
    const user = await createUserService.execute({
      name: "John doe",
      email: "john@example.com",
      password: "123456",
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatar_url: 'IMG_12345678.jpg',

    });

    expect(user.avatar).toEqual("IMG_12345678.jpg");
  });

  it("should be able to update user avatar when user not exist", async () => {
    const user = await createUserService.execute({
      name: "John doe",
      email: "john@example.com",
      password: "123456",
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatar_url: 'image.jpg',

    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatar_url: 'IMG_12345678.jpg',
    });


    expect(user.avatar).toEqual('IMG_12345678.jpg');
  });
})