import { startOfWeek, addDays, subDays } from 'date-fns';

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
