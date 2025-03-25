export interface PaginationResult<T> {
  data: T[];
  nextCursor: string | null;
  currentPage: string;
}

export interface PageGroup {
  start: string;
  end: string;
  characters: string[];
}
