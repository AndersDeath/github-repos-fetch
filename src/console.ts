import { countLanguagesAndSize, fetchData } from "./engine";
import { DisplayResultsParams } from "./interfaces";
import { colorize } from "./utils";

/**
 * Format and display the results.
 * @param {DisplayResultsParams} params - Parameters for displaying results.
 */
export const displayResults = ({
  counterMap,
  sum,
  size,
}: DisplayResultsParams) => {
  const sortedMap = new Map(
    [...counterMap.entries()].sort((a, b) => b[1] - a[1])
  );

  console.log(colorize("--------------", "cyan"));

  for (const [element, count] of sortedMap.entries()) {
    const percentage = ((count / sum) * 100).toFixed(2);
    const formattedCount = colorize(count.toString(), "cyan");

    if (element === "Number of repositories") {
      console.log(`${element}: ${formattedCount}`);
      console.log(colorize("--------------", "cyan"));
    } else {
      const formattedPercentage = colorize(`(${percentage}%)`, "magenta");
      console.log(`${element}: ${formattedCount} ${formattedPercentage}`);
    }
  }

  console.log(colorize("--------------", "cyan"));
  console.log(
    `Total size: ${colorize(`${(size / 1024).toFixed(2) + " MB"}`, "magenta")}`
  );
};

/**
 * Main function to execute the program.
 */
export const main = async () => {
  try {
    const data = await fetchData();
    const { counterMap, sum, size } = countLanguagesAndSize(data);
    displayResults({ counterMap, sum, size });
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
