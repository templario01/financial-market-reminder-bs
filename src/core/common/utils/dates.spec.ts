import { getWeeklyDatesLimitsByDate } from './dates';

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
