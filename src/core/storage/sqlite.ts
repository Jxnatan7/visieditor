import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync('visieditor.db');
  }
  return db;
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS repos (
    id INTEGER PRIMARY KEY,
    owner TEXT NOT NULL,
    name TEXT NOT NULL,
    default_branch TEXT NOT NULL,
    last_synced_at INTEGER NOT NULL,
    starred INTEGER NOT NULL DEFAULT 0,
    cached_size_bytes INTEGER NOT NULL DEFAULT 0,
    UNIQUE(owner, name)
  );

  CREATE TABLE IF NOT EXISTS ai_conversations (
    id TEXT PRIMARY KEY,
    repo_id INTEGER REFERENCES repos(id),
    file_path TEXT,
    model TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ai_messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES ai_conversations(id),
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    tokens_in INTEGER,
    tokens_out INTEGER,
    created_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON ai_messages(conversation_id);

  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    operation TEXT NOT NULL,
    owner TEXT NOT NULL,
    repo TEXT NOT NULL,
    details TEXT,
    created_at INTEGER NOT NULL
  );
`;

export async function initDb(): Promise<void> {
  const database = getDb();
  await database.execAsync(SCHEMA);
}
