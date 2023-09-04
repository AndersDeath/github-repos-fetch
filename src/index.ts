require("dotenv").config();

/**
 * AuthHeader interface
 */
export interface AuthHeader {
  Authorization: string;
  "Accept-Encoding": string;
  accept: string;
}
import axios from "axios";
import { Item, UserQuery } from "./interfaces";

/**
 * Bunch of requests to Github
 * @param pageNumber number of page
 * @param totalNumber
 * @param perPage repos per page
 * @returns array with data from Github
 */
export const getGithubDataGroup = async (
  pageNumber: number,
  totalNumber: number,
  perPage: number
) => {
  const promises: Promise<any>[] = [];
  let data: Item[] = [];
  for (let index = pageNumber; index <= Math.ceil(totalNumber / 20); index++) {
    promises.push(getGithubData(perPage, index));
  }
  return await Promise.all(promises).then((res) => {
    res.forEach((q) => {
      data = [...data, ...q.items];
    });
    return data;
  });
};

/**
 * Request to Guthub
 * @param perPage repos per page
 * @param pageNumber number of page
 * @returns data from github
 */
export const getGithubData = async (
  perPage: number,
  pageNumber: number
): Promise<any> => {
  const res = await axios.get(
    ghUserQuery({
      username: process.env.GH_USERNAME,
      perPage: perPage,
      page: pageNumber,
    }),
    {
      headers: ghAuthHeader(process.env.GH_TOKEN),
    }
  );
  return {
    count: res.data.total_count,
    items: ghParseData(res.data),
  };
};

/**
 * Query's builder
 * @param param0 UserQuery
 * @returns url address for fetching data from github
 */
export const ghUserQuery = ({ username, perPage, page }: UserQuery): string => {
  return `https://api.github.com/search/repositories?q=user:${username}&per_page=${perPage}&page=${page}`;
};

/**
 *
 * @param ghToken Github auth token
 * @returns AuthHeader for request
 */
export const ghAuthHeader = (ghToken: string): Partial<AuthHeader> => {
  return {
    Authorization: `token ${ghToken}`,
    accept: "application/vnd.github+json",
  };
};

/**
 *
 * @param data data from github
 * @returns parsed data for pushing to Notion
 */
export const ghParseData = (data: Partial<{ items: Item[] }>): Item[] => {
  const box: Item[] = [];
  data.items.forEach((element: Item) => {
    box.push({
      name: element.name,
      html_url: element.html_url,
      fork: element.fork,
      description: element.description,
      language: element.language,
      archived: element.archived,
      visibility: element.visibility,
      created_at: element.created_at,
      updated_at: element.updated_at,
      pushed_at: element.pushed_at,
    });
  });
  return box;
};

const perPage: number = 20;
let pageNumber: number = 1;

const fetchData = async () => {
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

    console.log("Total repositories:", data.length);

    // You can iterate through data if needed
    // data.forEach((element: Partial<Item>) => {
    //   console.log(element);
    // });
  } catch (error) {
    console.error("Error:", error);
  }
};

fetchData();
