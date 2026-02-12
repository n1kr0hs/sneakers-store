/**
 * Форматирует число в строку с разделителями тысяч (очень тонкий пробел)
 * @param {number} price - Цена для форматирования
 * @returns {string} Отформатированная цена
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return "0";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u200A");
};
