import express from "express";
import { countLanguagesAndSize, fetchData } from "./engine";
import { DisplayResultsParams } from "./interfaces";

// Express app setup
const app = express();
const port = process.env.PORT || 3000;

/**
 * Generate HTML code to display the results.
 * @param {DisplayResultsParams} params - Parameters for generating HTML.
 * @returns {string} - HTML code for displaying results.
 */
const generateHtmlResults = ({
  counterMap,
  sum,
  size,
}: DisplayResultsParams): string => {
  const sortedMap = new Map(
    [...counterMap.entries()].sort((a, b) => b[1] - a[1])
  );

  let html = `<h2>GitHub Repository Data</h2>`;
  html += `<table border="1"><tr><th>Language</th><th>Count</th><th>Percentage</th></tr>`;

  for (const [element, count] of sortedMap.entries()) {
    const percentage = ((count / sum) * 100).toFixed(2);
    const formattedCount = count.toString();

    if (element === "Number of repositories") {
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

export const server = () => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};
