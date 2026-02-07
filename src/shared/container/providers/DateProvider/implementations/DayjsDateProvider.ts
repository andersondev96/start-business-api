import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import utc from 'dayjs/plugin/utc'

import { IDateProvider } from '../models/IDateProvider'

dayjs.extend(utc)

export class DayjsDateProvider implements IDateProvider {
  convertToUTC(date: Date): string {
    return dayjs(date).utc().format()
  }

  convertToNacionalFormat(date: Date): string {
    return dayjs(date).locale('pt-br').format('DD/MM/YYYY HH:mm:ss')
  }

  dateNow(): Date {
    return dayjs().toDate()
  }

  compareInHours(start_date: Date, end_date: Date): number {
    return dayjs(end_date).diff(start_date, 'hours')
  }

  compareInDays(start_date: Date, end_date: Date): number {
    return dayjs(end_date).diff(start_date, 'days')
  }

  addDays(days: number) {
    return dayjs().add(days, 'days').toDate()
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, 'hour').toDate()
  }

  compareIsBefore(start_date: Date, end_date: Date): boolean {
    return dayjs(start_date).isBefore(end_date)
  }
}
