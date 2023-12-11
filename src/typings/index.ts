export interface DefaultUrlParam {
  id: string;
}

export interface Pagination {
  take: string;
  skip: string;
}

export type TransactionPagination = Pagination & {accountId: string}

