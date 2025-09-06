export const getDefaultImageUrl = (ticker: string): string => {
  const splitTickerName = ticker.split(' ').join('+');
  return `https://ui-avatars.com/api/?name=${splitTickerName}`;
};
