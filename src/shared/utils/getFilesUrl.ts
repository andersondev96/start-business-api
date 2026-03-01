import { Company } from '@modules/companies/infra/prisma/entities/Company'
import { EntrepreneurSettings } from '@modules/entrepreneurs/infra/prisma/entities/EntrepreneurSettings'
import { Budget } from '@modules/proposals/infra/prisma/entities/Budget'
import { Service } from '@modules/services/infra/prisma/entities/Service'
import { User } from '@modules/users/infra/prisma/entities/User'
import { env } from 'env'

function getBaseUrl(): string {
  return env.disk === 'local' ? env.APP_API_URL : env.AWS_BUCKET_URL
}

function buildUrl(
  filename: string | null | undefined,
  segment: string
): string | null {
  if (!filename || filename.trim() === '') {
    return null
  }
  return `${getBaseUrl()}/${segment}/${filename}`
}

export function getUserAvatarUrl(user: User, segment: string): string | null {
  return buildUrl(user.avatar, segment)
}

export function getCompanyImages(company: Company, segment: string): string[] {
  if (!company.ImageCompany) {
    return []
  }

  return company.ImageCompany.map((file) =>
    buildUrl(file.image_name, segment)
  ).filter((url): url is string => url !== null)
}

export function getServiceImageUrl(
  service: Service,
  segment: string
): string | null {
  return buildUrl(service.image_url, segment)
}

export function getBudgetFiles(budget: Budget, segment: string): string[] {
  if (!budget.files) {
    return []
  }

  return budget.files
    .map((file) => buildUrl(file, segment))
    .filter((url): url is string => url !== null)
}

export function getCompanyLogo(
  settings: EntrepreneurSettings,
  segment: string
): string | null {
  return buildUrl(settings.company_logo, segment)
}
