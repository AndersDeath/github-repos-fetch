# GitHub Repository Data Analyzer

The **GitHub Repository Data Analyzer** is a Node.js script designed to help you gain insights into your GitHub repositories. It fetches data from your GitHub account, analyzes the programming languages used in your repositories, and calculates the total size of your projects. This README provides a guide on how to use the code and what it accomplishes.

## What It Does

The Analyzer offers the following features:

1. **GitHub Data Retrieval**: It connects to your GitHub account using your username and personal access token to fetch information about your repositories.

2. **Language Analysis**: It counts the occurrences of programming languages used across all your repositories, providing valuable insights into which languages you use most frequently.

3. **Size Calculation**: It calculates the total size of your repositories, giving you an idea of the storage space your projects occupy.

4. **Console Output**: The program displays the analysis results in the console, making it easy to view and assess your GitHub data.

5. **HTML Report (Optional)**: It can also generate an HTML report that presents the analysis results in a more visually appealing format via a local web server.

## How to Use

Follow these steps to use the GitHub Repository Data Analyzer:

### 1. Set Up Environment Variables

Before running the code, you need to set up environment variables to provide authentication and configuration information:

- **GH_USERNAME**: Your GitHub username.
- **GH_TOKEN**: Your GitHub personal access token.
- **PORT** (Optional): The port on which the Express server will listen (default is 3000).

Create a `.env` file in the project directory and set these variables with your credentials.

### 2. Install Dependencies

Use the following command to install the required dependencies:

```bash
npm install
```

### 3. Run the Analyzer

To start the analysis and view the results in the console, run:

```bash
npm start
```

The program will fetch data from your GitHub repositories, analyze it, and display the findings in the console.

### 4. Generate an HTML Report (Optional)

If you want to view the analysis results in a web-based HTML report, you can start the Express server with the following command:

```bash
npm run server
```

This will launch a local web server that serves the HTML report. You can access it by opening a web browser and navigating to `http://localhost:3000` (or the port you specified).

## License

This code is provided under the MIT License, allowing you to use, modify, and distribute it as needed. Refer to the [LICENSE](LICENSE) file for detailed licensing information.

Enjoy gaining insights into your GitHub repositories using the GitHub Repository Data Analyzer!