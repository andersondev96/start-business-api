import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { DayjsDateProvider } from './DayjsDateProvider'

dayjs.extend(utc)

let dateProvider: DayjsDateProvider

describe('DayjsDateProvider', () => {
  beforeEach(() => {
    dateProvider = new DayjsDateProvider()

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get current date (dateNow)', () => {
    const mockDate = new Date('2024-01-01T12:00:00Z')
    vi.setSystemTime(mockDate)

    const now = dateProvider.dateNow()

    expect(now).toEqual(mockDate)
  })

  it('should be able to convert a date to UTC string format', () => {
    const date = new Date('2024-02-01T15:00:00Z')

    const utcString = dateProvider.convertToUTC(date)

    expect(utcString).toBe(dayjs(date).utc().format())
    expect(utcString).toContain('2024-02-01T15:00:00')
    expect(utcString).toMatch(/Z$|\+00:00$/)
  })

  it('should be able to format date to national format (DD/MM/YYYY HH:mm:ss)', () => {
    const date = new Date('2024-12-25T12:30:45Z')

    const formatted = dateProvider.convertToNacionalFormat(date)

    expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/)
  })

  it('should be able to compare difference in hours', () => {
    const startDate = new Date('2024-01-01T10:00:00')
    const endDate = new Date('2024-01-01T12:00:00')

    const hours = dateProvider.compareInHours(startDate, endDate)

    expect(hours).toBe(2)
  })

  it('should be able to compare difference in days', () => {
    const startDate = new Date('2024-01-01T12:00:00')
    const endDate = new Date('2024-01-05T12:00:00')

    const days = dateProvider.compareInDays(startDate, endDate)

    expect(days).toBe(4)
  })

  it('should be able to add days to current date', () => {
    const mockDate = new Date('2024-01-01T12:00:00Z')
    vi.setSystemTime(mockDate)

    const addedDate = dateProvider.addDays(5)

    const expectedDate = new Date('2024-01-06T12:00:00Z')

    expect(addedDate).toEqual(expectedDate)
  })

  it('should be able to add hours to current date', () => {
    const mockDate = new Date('2024-01-01T12:00:00Z')
    vi.setSystemTime(mockDate)

    const addedDate = dateProvider.addHours(3)

    const expectedDate = new Date('2024-01-01T15:00:00Z')

    expect(addedDate).toEqual(expectedDate)
  })

  it('should return true if start date is before end date', () => {
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-01-02')

    const isBefore = dateProvider.compareIsBefore(startDate, endDate)

    expect(isBefore).toBe(true)
  })

  it('should return false if start date is after end date', () => {
    const startDate = new Date('2024-01-05')
    const endDate = new Date('2024-01-01')

    const isBefore = dateProvider.compareIsBefore(startDate, endDate)

    expect(isBefore).toBe(false)
  })
})
