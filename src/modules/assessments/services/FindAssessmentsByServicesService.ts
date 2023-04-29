import { inject, injectable } from "tsyringe";

import { IServicesRepository } from "@modules/services/repositories/IServicesRepository";
import { AppError } from "@shared/errors/AppError";

import { Assessment } from "../infra/prisma/entities/Assessment";
import { IAssessmentsRepository } from "../repositories/IAssessmentsRepository";

@injectable()
export class FindAssessmentsByServicesService {

  constructor(
    @inject("AssessmentsRepository")
    private assessmentRepository: IAssessmentsRepository,
    @inject("ServicesRepository")
    private serviceRepository: IServicesRepository
  ) { }

  public async execute(service_id: string): Promise<Assessment[]> {

    const service = await this.serviceRepository.findServiceById(service_id);

    if (!service) {
      throw new AppError("Service not found");
    }

    const assessments = await this.assessmentRepository.findAssessments(service_id);

    const assessmentsUserAvatar = assessments.map((assessment) => {
      return {
        ...assessment,
        user: {
          ...assessment.user,
          avatar: assessment.user.avatar
            ? `${process.env.APP_API_URL}/avatar/${assessment.user.avatar}`
            : undefined
        }
      }
    });

    return assessmentsUserAvatar;
  }
}