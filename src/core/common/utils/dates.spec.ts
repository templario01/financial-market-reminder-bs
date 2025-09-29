import { getLastMonthPeriodByDate, getWeeklyDatesLimitsByDate } from './dates';

describe('getWeeklyDatesLimits', () => {
  it('should return correct dates for Monday (dayOfWeek = 1)', () => {
    const result = getWeeklyDatesLimitsByDate(
      new Date('2025-09-22T05:00:00.000Z'),
    );

    expect(result).toMatchObject({
      startDate: new Date('2025-09-15T05:00:00.000Z'),
      endDate: new Date('2025-09-19T05:00:00.000Z'),
    });
  });

  it('should return correct dates for Tuesday (dayOfWeek = 2)', () => {
    const result = getWeeklyDatesLimitsByDate(
      new Date('2025-09-23T05:00:00.000Z'),
    );

    expect(result).toMatchObject({
      startDate: new Date('2025-09-16T05:00:00.000Z'),
      endDate: new Date('2025-09-22T05:00:00.000Z'),
    });
  });

  it('should return correct dates for Wednesday (dayOfWeek = 3)', () => {
    const result = getWeeklyDatesLimitsByDate(
      new Date('2025-09-24T05:00:00.000Z'),
    );

    expect(result).toMatchObject({
      startDate: new Date('2025-09-17T05:00:00.000Z'),
      endDate: new Date('2025-09-23T05:00:00.000Z'),
    });
  });

  it('should return correct dates for Thursday (dayOfWeek = 4)', () => {
    const result = getWeeklyDatesLimitsByDate(
      new Date('2025-09-25T05:00:00.000Z'),
    );

    expect(result).toMatchObject({
      startDate: new Date('2025-09-18T05:00:00.000Z'),
      endDate: new Date('2025-09-24T05:00:00.000Z'),
    });
  });

  it('should return correct dates for Friday (dayOfWeek = 5)', () => {
    const result = getWeeklyDatesLimitsByDate(
      new Date('2025-09-26T05:00:00.000Z'),
    );

    expect(result).toMatchObject({
      startDate: new Date('2025-09-19T05:00:00.000Z'),
      endDate: new Date('2025-09-25T05:00:00.000Z'),
    });
  });

  it('should return correct dates for Saturday (dayOfWeek = 6)', () => {
    const result = getWeeklyDatesLimitsByDate(
      new Date('2025-09-27T05:00:00.000Z'),
    );

    expect(result).toMatchObject({
      startDate: new Date('2025-09-22T05:00:00.000Z'),
      endDate: new Date('2025-09-26T05:00:00.000Z'),
    });
  });

  it('should return correct dates for Sunday (dayOfWeek = 0)', () => {
    const result = getWeeklyDatesLimitsByDate(
      new Date('2025-09-28T05:00:00.000Z'),
    );

    expect(result).toMatchObject({
      startDate: new Date('2025-09-22T05:00:00.000Z'),
      endDate: new Date('2025-09-26T05:00:00.000Z'),
    });
  });
});

describe('getLastMonthPeriodByDate', () => {
  it('should return correct dates for last month when current date is October 1, 2025', () => {
    const currentDate = new Date('2025-10-01T10:00:00.000Z');
    const result = getLastMonthPeriodByDate(currentDate);

    expect(result).toMatchObject({
      startDate: new Date('2025-09-01T00:00:00.000Z'),
      endDate: new Date('2025-09-30T23:59:59.999Z'),
    });
  });

  it('should handle year transition correctly', () => {
    const currentDate = new Date('2025-01-01T10:00:00.000Z');
    const result = getLastMonthPeriodByDate(currentDate);

    expect(result).toMatchObject({
      startDate: new Date('2024-12-01T00:00:00.000Z'),
      endDate: new Date('2024-12-31T23:59:59.999Z'),
    });
  });

  it('should handle February in leap year', () => {
    const currentDate = new Date('2024-03-01T10:00:00.000Z');
    const result = getLastMonthPeriodByDate(currentDate);

    expect(result).toMatchObject({
      startDate: new Date('2024-02-01T00:00:00.000Z'),
      endDate: new Date('2024-02-29T23:59:59.999Z'),
    });
  });

  it('should handle February in non-leap year', () => {
    const currentDate = new Date('2025-03-01T10:00:00.000Z');
    const result = getLastMonthPeriodByDate(currentDate);

    expect(result).toMatchObject({
      startDate: new Date('2025-02-01T00:00:00.000Z'),
      endDate: new Date('2025-02-28T23:59:59.999Z'),
    });
  });
});
