const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5001/api";

import type {
  LibraryEntry,
  ReadingStatus,
} from "@/types/library";

export const LIBRARY_SORT_OPTIONS = [
  "recently_updated",
  "recently_added",
  "title_asc",
  "title_desc",
  "author_asc",
  "author_desc",
] as const;

export type LibrarySort =
  (typeof LIBRARY_SORT_OPTIONS)[number];

export interface Book {
  id: string;
  externalId: string;
  source: string;

  title: string;
  author: string;

  description?: string;
  coverUrl?: string;

  pageCount?: number;
  publishedAt?: string;
  isbn?: string;
  language?: string;
  publisher?: string;

  externalRating?: number;
  externalRatingCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface AuthResponse {
  user: User;
}


export async function searchBooks(
  query: string,
): Promise<Book[]> {
  const response = await fetch(
    `${API_URL}/books/search?query=${encodeURIComponent(query)}`,
  );

  const result =
    (await response.json()) as ApiResponse<Book[]>;

  if (!response.ok) {
    throw new Error(
      result.success
        ? "Failed to search books"
        : "Failed to search books",
    );
  }

  return result.data;
}

export async function getBookByGoogleId(
  externalId: string,
): Promise<Book> {
  const response = await fetch(
    `${API_URL}/books/google/${encodeURIComponent(externalId)}`,
  );

  const result =
    (await response.json()) as ApiResponse<Book>;

  if (!response.ok) {
    throw new Error(
      result.success
        ? "Failed to fetch book"
        : "Failed to fetch book",
    );
  }

  return result.data;
}

export async function getBookById(
  id: string,
): Promise<Book> {
  const response = await fetch(
    `${API_URL}/books/${encodeURIComponent(id)}`,
    {
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Failed to fetch book",
    );
  }

  return result.data;
}


export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Failed to register",
    );
  }

  return result.data;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Failed to login",
    );
  }

  return result.data;
}


export async function addBookToLibrary(
  bookId: string,
  status: ReadingStatus = "WANT_TO_READ",
): Promise<LibraryEntry> {
  const response = await fetch(
    `${API_URL}/library`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        bookId,
        status,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Failed to add book to library",
    );
  }

  return result.data;
}

export async function getUserLibrary(
  status?: ReadingStatus,
  search?: string,
  sort?: LibrarySort,
): Promise<LibraryEntry[]> {
  const searchParams = new URLSearchParams();

  if (status) {
    searchParams.set("status", status);
  }

  if (search?.trim()) {
    searchParams.set("search", search.trim());
  }

  if (sort) {
    searchParams.set("sort", sort);
  }

  const queryString = searchParams.toString();

  const response = await fetch(
    `${API_URL}/library${
      queryString ? `?${queryString}` : ""
    }`,
    {
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Failed to fetch library",
    );
  }

  return result.data;
}

export async function updateLibraryEntry(
  bookId: string,
  data: {
    status?: ReadingStatus;
    currentPage?: number;
    startedAt?: string | null;
    finishedAt?: string | null;
  },
): Promise<LibraryEntry> {
  const response = await fetch(
    `${API_URL}/library/${encodeURIComponent(bookId)}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Failed to update library entry",
    );
  }

  return result.data;
}

export async function removeBookFromLibrary(
  bookId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/library/${encodeURIComponent(bookId)}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Failed to remove book from library",
    );
  }
}

export async function getLibraryEntry(
  bookId: string,
): Promise<LibraryEntry | null> {
  const response = await fetch(
    `${API_URL}/library/${encodeURIComponent(bookId)}`,
    {
      credentials: "include",
    },
  );

  if (response.status === 404) {
    return null;
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Failed to fetch library entry",
    );
  }

  return result.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await fetch(
    `${API_URL}/auth/me`,
    {
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Failed to fetch current user",
    );
  }

  return result.data;
}

export async function logoutUser(): Promise<void> {
  const response = await fetch(
    `${API_URL}/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const result = await response.json();

    throw new Error(
      result.message ?? "Failed to logout",
    );
  }
}