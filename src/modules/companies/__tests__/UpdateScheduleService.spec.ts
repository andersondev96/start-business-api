import { FakeUsersRepository } from "@modules/users/repositories/Fakes/FakeUsersRepository";
import { AppError } from "@shared/errors/AppError";

import { ContactsRepository } from "../infra/prisma/repositories/ContactsRepository";
import { FakeCompaniesRepository } from "../repositories/fakes/FakeCompaniesRepository";
import { FakeSchedulesRepository } from "../repositories/fakes/FakeSchedulesRepository";
import { ICompaniesRepository } from "../repositories/ICompaniesRepository";
import { IContactsRepository } from "../repositories/IContactsRepository";
import { ISchedulesRepository } from "../repositories/ISchedulesRepository"
import { UpdateScheduleService } from "../services/UpdateScheduleService";

let fakeUsersRepository = new FakeUsersRepository();
let fakeSchedulesRepository: ISchedulesRepository;
let fakeContactsRepository: IContactsRepository;
let fakeCompaniesRepository: ICompaniesRepository;
let updateScheduleService: UpdateScheduleService;


describe("UpdateSchedulesService", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeSchedulesRepository = new FakeSchedulesRepository();
    fakeContactsRepository = new ContactsRepository();
    fakeCompaniesRepository = new FakeCompaniesRepository();
    updateScheduleService = new UpdateScheduleService(
      fakeSchedulesRepository
    );
  });

  it("Should be able to update the schedules", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456"
    });

    const contact = await fakeContactsRepository.create({
      email: "business@example.com",
      telephone: "1234567",
      whatsapp: "12345685",
      website: "www.example.com",
    });

    const company = await fakeCompaniesRepository.create({
      name: "Business Company 1",
      cnpj: "123456",
      category: "Supermarket",
      description: "Supermarket description",
      services: ["Supermarket", "Shopping"],
      contact_id: contact.id,
      physical_localization: false,
      user_id: user.id,
    });

    const schedule = {
      day_of_week: "Sunday",
      opening_time: "08:00",
      closing_time: "13:00",
      company_id: company.id
    };

    const createSchedule = await fakeSchedulesRepository.create(schedule);

    schedule.day_of_week = "Saturday";
    schedule.closing_time = "16:00";

    const updateSchedule = await updateScheduleService.execute(schedule);
    const findSchedule = await fakeSchedulesRepository.findById(createSchedule.id);

    expect(updateSchedule.day_of_week).toEqual(findSchedule.day_of_week);
    expect(updateSchedule.closing_time).toEqual(findSchedule.closing_time);
  });

  it("Should not be able to update a non existing schedule", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456"
    });

    const contact = await fakeContactsRepository.create({
      email: "business@example.com",
      telephone: "1234567",
      whatsapp: "12345685",
      website: "www.example.com",
    });

    const company = await fakeCompaniesRepository.create({
      name: "Business Company 1",
      cnpj: "123456",
      category: "Supermarket",
      description: "Supermarket description",
      services: ["Supermarket", "Shopping"],
      contact_id: contact.id,
      physical_localization: false,
      user_id: user.id,
    });

    const schedule = {
      id: 'non-existing-id',
      day_of_week: 'Wednesday',
      opening_time: '08:00',
      closing_time: '18:00',
      lunch_time: '13:00-14:00',
      company_id: company.id,
    }

    await expect(
      updateScheduleService.execute(schedule)
    ).rejects.toBeInstanceOf(AppError)
  });

  it("Should not be able to update a schedule with invalid company", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456"
    });

    const contact = await fakeContactsRepository.create({
      email: "business@example.com",
      telephone: "1234567",
      whatsapp: "12345685",
      website: "www.example.com",
    });

    const company = await fakeCompaniesRepository.create({
      name: "Business Company 1",
      cnpj: "123456",
      category: "Supermarket",
      description: "Supermarket description",
      services: ["Supermarket", "Shopping"],
      contact_id: contact.id,
      physical_localization: false,
      user_id: user.id,
    });

    const schedule = await fakeSchedulesRepository.create({
      day_of_week: 'Wednesday',
      opening_time: '08:00',
      closing_time: '18:00',
      lunch_time: '13:00-14:00',
      company_id: company.id,
    });

    await expect(
      updateScheduleService.execute({
        id: schedule.id,
        day_of_week: 'Wednesday',
        opening_time: '08:00',
        closing_time: '18:00',
        lunch_time: '13:00-14:00',
        company_id: 'invalid-company',
      })
    ).rejects.toBeInstanceOf(AppError)
  });
})