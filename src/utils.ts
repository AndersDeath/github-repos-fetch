/**
 * Colorizes text using ANSI escape codes.
 *
 * @param {string} text - The text to be colorized.
 * @param {string} colorCode - The ANSI color code to apply to the text.
 * @returns {string} - The colorized text.
 */
export const colorize = (text: string, colorCode: string) =>
  `\x1b[${colorCode}m${text}\x1b[0m`;
