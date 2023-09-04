require("dotenv").config();
import express from "express";
import axios from "axios";
import { AuthHeader, Item, UserQuery } from "./interfaces";


// Express app setup
const app = express();
const port = process.env.PORT || 3000;


/**
 * Request data from GitHub.
 * @param {number} perPage - Repositories per page
 * @param {number} pageNumber - Page number
 * @returns {Promise<{ count: number, items: Item[] }>} - Data from GitHub
 */
export const getGithubData = async (
  perPage: number,
  pageNumber: number
): Promise<{ count: number; items: Item[] }> => {
  const { data } = await axios.get(
    ghUserQuery({
      username: process.env.GH_USERNAME,
      perPage,
      page: pageNumber,
    }),
    {
      headers: ghAuthHeader(process.env.GH_TOKEN),
    }
  );

  return {
    count: data.total_count,
    items: ghParseData(data),
  };
};

/**
 * Build a GitHub API query URL.
 * @param {UserQuery} param0 - UserQuery parameters
 * @returns {string} - GitHub API query URL
 */
export const ghUserQuery = ({ username, perPage, page }: UserQuery): string =>
  `https://api.github.com/search/repositories?q=user:${username}&per_page=${perPage}&page=${page}`;

/**
 * Create GitHub authorization headers.
 * @param {string} ghToken - GitHub auth token
 * @returns {Partial<AuthHeader>} - AuthHeader for the request
 */
export const ghAuthHeader = (ghToken: string): Partial<AuthHeader> => ({
  Authorization: `token ${ghToken}`,
  accept: "application/vnd.github+json",
});

/**
 * Colorizes text using ANSI escape codes.
 *
 * @param {string} text - The text to be colorized.
 * @param {string} colorCode - The ANSI color code to apply to the text.
 * @returns {string} - The colorized text.
 */
const colorize = (text: string, colorCode: string) =>
  `\x1b[${colorCode}m${text}\x1b[0m`;

/**
 *
 * @param data data from github
 * @returns parsed data for pushing to Notion
 */
export const ghParseData = (data: Partial<{ items: Item[] }>): Item[] => {
  return data.items.map((element: Item) => ({
    name: element.name,
    html_url: element.html_url,
    fork: element.fork,
    description: element.description,
    language: element.language || "Unknown",
    archived: element.archived,
    visibility: element.visibility,
    created_at: element.created_at,
    updated_at: element.updated_at,
    pushed_at: element.pushed_at,
    size: element.size,
  }));
};

/**
 * Fetches data from GitHub.
 * @returns {Promise<Item[]>} - An array of repository data.
 */
const fetchData = async (): Promise<Item[]> => {
  const perPage: number = 20;
  let pageNumber: number = 1;

  try {
    const firstPageData = await getGithubData(perPage, pageNumber);
    const totalNumber: number = firstPageData.count;
    let data: Item[] = firstPageData.items;

    for (
      let page = pageNumber + 1;
      page <= Math.ceil(totalNumber / perPage);
      page++
    ) {
      const nextPageData = await getGithubData(perPage, page);
      data = data.concat(nextPageData.items);
    }

    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Type definition for counting language occurrences.
 */
type LanguageCounts = Map<string, number>;

/**
 * Count occurrences of languages and calculate total size.
 * @param {Item[]} data - An array of repository data.
 * @returns {{counterMap: LanguageCounts; sum: number; size: number}} - An object containing counts, sum, and size.
 */
const countLanguagesAndSize = (
  data: Item[]
): {
  counterMap: LanguageCounts;
  sum: number;
  size: number;
} => {
  const counterMap: LanguageCounts = new Map<string, number>();
  let sum = 0;
  let size = 0;

  for (const element of data) {
    size += element.size;
    if (counterMap.has(element.language)) {
      counterMap.set(element.language, counterMap.get(element.language)! + 1);
    } else {
      counterMap.set(element.language, 1);
    }
    sum++;
  }

  // Include the count of repositories in the map
  counterMap.set("Number of repositories", sum);

  return { counterMap, sum, size };
};

/**
 * Type definition for displaying results.
 */
type DisplayResultsParams = {
  counterMap: LanguageCounts;
  sum: number;
  size: number;
};

/**
 * Format and display the results.
 * @param {DisplayResultsParams} params - Parameters for displaying results.
 */
const displayResults = ({ counterMap, sum, size }: DisplayResultsParams) => {
  const sortedMap = new Map(
    [...counterMap.entries()].sort((a, b) => b[1] - a[1])
  );

  console.log(colorize("--------------", "36")); // Cyan color

  for (const [element, count] of sortedMap.entries()) {
    const percentage = ((count / sum) * 100).toFixed(2);
    const formattedCount = colorize(count.toString(), "36"); // Cyan color

    if (element === "Number of repositories") {
      console.log(`${element}: ${formattedCount}`);
      console.log(colorize("--------------", "36")); // Cyan color
    } else {
      const formattedPercentage = colorize(`(${percentage}%)`, "35"); // Magenta color
      console.log(`${element}: ${formattedCount} ${formattedPercentage}`);
    }
  }

  console.log(colorize("--------------", "36")); // Cyan color
  console.log(
    `Total size: ${colorize(`${(size / 1024).toFixed(2) + " MB"}`, "35")}` // Magenta color
  );
};

/**
 * Main function to execute the program.
 */
const main = async () => {
  try {
    const data = await fetchData();
    const { counterMap, sum, size } = countLanguagesAndSize(data);
    displayResults({ counterMap, sum, size });
  } catch (error) {
    console.error("Error:", error);
  }
};

main();

/**
 * Generate HTML code to display the results.
 * @param {DisplayResultsParams} params - Parameters for generating HTML.
 * @returns {string} - HTML code for displaying results.
 */
const generateHtmlResults = ({ counterMap, sum, size }: DisplayResultsParams): string => {
  const sortedMap = new Map(
    [...counterMap.entries()].sort((a, b) => b[1] - a[1])
  );

  let html = `<h2>GitHub Repository Data</h2>`;
  html += `<table border="1"><tr><th>Language</th><th>Count</th><th>Percentage</th></tr>`;

  for (const [element, count] of sortedMap.entries()) {
    const percentage = ((count / sum) * 100).toFixed(2);
    const formattedCount = count.toString();

    if (element === 'Number of repositories') {
      html += `<tr><td>${element}</td><td>${formattedCount}</td><td></td></tr>`;
    } else {
      html += `<tr><td>${element}</td><td>${formattedCount}</td><td>(${percentage}%)</td></tr>`;
    }
  }

  html += `</table>`;
  html += `<p>Total size: ${(size / 1024).toFixed(2)} MB</p>`;

  return html;
};

const renderHtml = (formattedData: string): string => {

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Github Data</title>
    </head>
    <body>
      <pre>${formattedData}</pre>
    </body>
    </html>
  `;
};

app.get("/", async (req, res) => {
 try {
   const data = await fetchData();

   const htmlResults = generateHtmlResults(countLanguagesAndSize(data));

   res.send(renderHtml(htmlResults));
 } catch (error) {
   console.error("Error:", error);
   res.status(500).send("Internal Server Error");
 }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
