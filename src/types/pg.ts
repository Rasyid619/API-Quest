import type { PoolClient, QueryResult, QueryResultRow } from 'pg'

export interface PgQueryRunner {
  query: <T extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]) => Promise<QueryResult<T>>
}

export interface PgClient extends PgQueryRunner {
  release: PoolClient['release']
}

export interface PgClientPool extends PgQueryRunner {
  connect: () => Promise<PgClient>
  end: () => Promise<void>
}
