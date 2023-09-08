/**
 * Colorizes text using ANSI escape codes based on color names.
 *
 * @param {string} text - The text to be colorized.
 * @param {string} colorName - The name of the color to apply to the text.
 * @returns {string} - The colorized text.
 */
export const colorize = (text: string, colorName: string): string => {
  const colorMap: Record<string, string> = {
    reset: "0",
    black: "30",
    red: "31",
    green: "32",
    yellow: "33",
    blue: "34",
    magenta: "35",
    cyan: "36",
    white: "37",
  };

  const selectedColor = colorMap[colorName.toLowerCase()] || colorMap.reset;
  return `\x1b[${selectedColor}m${text}\x1b[0m`;
};
