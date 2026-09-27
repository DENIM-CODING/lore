const GOOGLE_BOOKS_API_URL =
  "https://www.googleapis.com/books/v1/volumes";

interface GoogleBooksResponse {
  totalItems?: number;
  items?: GoogleBookItem[];
}

interface GoogleBookItem {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    pageCount?: number;
    publishedDate?: string;
    industryIdentifiers?: {
      type: string;
      identifier: string;
    }[];
    language?: string;
    publisher?: string;
    averageRating?: number;
    ratingsCount?: number;
  };
}

export interface BookSearchResult {
  externalId: string;
  source: "GOOGLE_BOOKS";

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

export async function searchGoogleBooks(
  query: string,
): Promise<BookSearchResult[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_BOOKS_API_KEY is not defined");
  }

  const url = new URL(GOOGLE_BOOKS_API_URL);

  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", "20");
  url.searchParams.set("printType", "books");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Google Books API request failed: ${response.status}`,
    );
  }

  const data =
    (await response.json()) as GoogleBooksResponse;

  return (data.items ?? [])
    .map((item): BookSearchResult | null => {
      const info = item.volumeInfo;

      if (!info?.title) {
        return null;
      }

      const isbn =
        info.industryIdentifiers?.find(
          (identifier) => identifier.type === "ISBN_13",
        )?.identifier ??
        info.industryIdentifiers?.find(
          (identifier) => identifier.type === "ISBN_10",
        )?.identifier;

      return {
        externalId: item.id,
        source: "GOOGLE_BOOKS",

        title: info.title,

        author:
          info.authors?.join(", ") ??
          "Unknown Author",

        description: info.description,

        coverUrl:
          info.imageLinks?.thumbnail?.replace(
            "http://",
            "https://",
          ),

        pageCount: info.pageCount,

        publishedAt: info.publishedDate,

        isbn,

        language: info.language,

        publisher: info.publisher,

        externalRating: info.averageRating,

        externalRatingCount: info.ratingsCount,
      };
    })
    .filter(
      (book): book is BookSearchResult =>
        book !== null,
    );
}

export async function getGoogleBookById(
  externalId: string,
): Promise<BookSearchResult> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_BOOKS_API_KEY is not defined");
  }

  const url = new URL(
    `${GOOGLE_BOOKS_API_URL}/${encodeURIComponent(externalId)}`,
  );

  url.searchParams.set("key", apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Google Book not found");
    }

    throw new Error(
      `Google Books API request failed: ${response.status}`,
    );
  }

  const item = (await response.json()) as GoogleBookItem;

  const info = item.volumeInfo;

  if (!info?.title) {
    throw new Error("Google Book has no title");
  }

  const isbn =
    info.industryIdentifiers?.find(
      (identifier) => identifier.type === "ISBN_13",
    )?.identifier ??
    info.industryIdentifiers?.find(
      (identifier) => identifier.type === "ISBN_10",
    )?.identifier;

  return {
    externalId: item.id,
    source: "GOOGLE_BOOKS",

    title: info.title,

    author:
      info.authors?.join(", ") ??
      "Unknown Author",

    description: info.description,

    coverUrl:
      info.imageLinks?.thumbnail?.replace(
        "http://",
        "https://",
      ),

    pageCount:
      info.pageCount && info.pageCount > 0
        ? info.pageCount
        : undefined,

    publishedAt: info.publishedDate,

    isbn,

    language: info.language,

    publisher: info.publisher,

    externalRating: info.averageRating,

    externalRatingCount: info.ratingsCount,
  };
}