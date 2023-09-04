/**
 * AuthHeader interface
 */
export interface AuthHeader {
  Authorization: string;
  "Accept-Encoding": string;
  accept: string;
}

export interface ghItem {
  name: string;
  html_url: string;
  fork: boolean;
  description: string;
  language: string | null;
  archived: boolean;
  visibility: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
}

export interface ghData {
  total_count: boolean;
  incomplete_results: boolean;
  items: ghItem[];
}

export interface Item {
  name: string;
  html_url: string;
  fork: boolean;
  description: string;
  language: string;
  archived: boolean;
  visibility: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

/**
 * UserQuery interface
 */
export interface UserQuery {
  username: string;
  perPage: number;
  page: number;
}
