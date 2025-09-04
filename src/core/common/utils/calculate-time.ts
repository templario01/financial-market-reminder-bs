export const calculateTimeFromNowUntil = (minutes: number) => {
  const { currentTime, MILISECONDS } = {
    currentTime: new Date(),
    MILISECONDS: 60000,
  };
  return new Date(currentTime.getTime() + minutes * MILISECONDS);
};
