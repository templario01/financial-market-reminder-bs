import { startOfWeek, addDays, subDays } from 'date-fns';
import { subMonths } from 'date-fns';

/**
 * Devuelve 2 fechas de acuerdo al día de la semana enviado.
 * @param dayOfWeek número de 0 (domingo) a 6 (sábado)
 * @returns { startDate: Date, fecha2: Date }
 */
export function getWeeklyDatesLimitsByDate(date: Date) {
  const dayOfWeek = date.getDay();
  const mondayThisWeek = startOfWeek(date, { weekStartsOn: 1 });

  let startDate: Date;
  let endDate: Date;

  switch (dayOfWeek) {
    case 1: // lunes
      startDate = subDays(mondayThisWeek, 7); // lunes semana pasada
      endDate = addDays(startDate, 4); // viernes semana pasada
      break;
    case 2: // martes
      startDate = subDays(mondayThisWeek, 6); // martes semana pasada
      endDate = mondayThisWeek; // lunes de esta semana
      break;
    case 3: // miércoles
      startDate = subDays(mondayThisWeek, 5); // miércoles semana pasada
      endDate = addDays(mondayThisWeek, 1); // martes de esta semana
      break;
    case 4: // jueves
      startDate = subDays(mondayThisWeek, 4); // jueves semana pasada
      endDate = addDays(mondayThisWeek, 2); // miércoles de esta semana
      break;
    case 5: // viernes
      startDate = subDays(mondayThisWeek, 3); // viernes semana pasada
      endDate = addDays(mondayThisWeek, 3); // jueves de esta semana
      break;
    case 6: // sábado
      startDate = mondayThisWeek; // lunes de esta semana
      endDate = addDays(mondayThisWeek, 4); // viernes de esta semana
      break;
    case 0: // domingo
      startDate = mondayThisWeek; // lunes de esta semana
      endDate = addDays(mondayThisWeek, 4); // viernes de esta semana
      break;
    default:
      throw new Error('Día inválido, debe ser 0-6');
  }

  return { startDate, endDate };
}

export function getLastMonthPeriodByDate(date: Date) {
  const lastMonthDate = subMonths(date, 1);

  const year = lastMonthDate.getUTCFullYear();
  const month = lastMonthDate.getUTCMonth();

  const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

  return { startDate, endDate };
}

export function deleteDuplicatedDays<T>(
  getDate: (item: T) => Date,
): (item: T, index: number, array: T[]) => boolean {
  return (item, index, array) => {
    const currentDay = getDate(item).toISOString().split('T')[0];
    return !array
      .slice(0, index)
      .some(
        (prevItem) =>
          getDate(prevItem).toISOString().split('T')[0] === currentDay,
      );
  };
}
