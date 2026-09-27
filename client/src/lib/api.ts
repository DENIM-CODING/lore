const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5001/api";

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

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function searchBooks(
  query: string,
): Promise<Book[]> {
  const response = await fetch(
    `${API_URL}/books/search?query=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to search books");
  }

  const result =
    (await response.json()) as ApiResponse<Book[]>;

  return result.data;
}

export async function getBookByGoogleId(
  externalId: string,
): Promise<Book> {
  const response = await fetch(
    `${API_URL}/books/google/${encodeURIComponent(externalId)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch book");
  }

  const result =
    (await response.json()) as ApiResponse<Book>;

  return result.data;
}