import { MongoClient, Db } from "mongodb";

// architecture.md §2, §6. One client per process; reused across hot reloads in dev.
const uri = process.env.MONGODB_URI || "";

declare global {
  // eslint-disable-next-line no-var
  var __ayurMongo: Promise<MongoClient> | undefined;
}

export function hasDb(): boolean {
  return uri.length > 0;
}

export async function getDb(): Promise<Db> {
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!global.__ayurMongo) {
    global.__ayurMongo = new MongoClient(uri, { maxPoolSize: 10 }).connect();
  }
  const client = await global.__ayurMongo;
  return client.db();
}

export async function ensureIndexes(): Promise<void> {
  const db = await getDb();
  await Promise.all([
    db.collection("pages").createIndex({ slug: 1 }, { unique: true }),
    db.collection("pages").createIndex({ status: 1, section: 1 }),
    db.collection("articles").createIndex({ slug: 1 }, { unique: true }),
    db.collection("articles").createIndex({ status: 1, publish_at: 1 }),
    db.collection("articles").createIndex({ payload_hash: 1 }),
    db.collection("articles").createIndex({ primary_keyword: 1 }),
    db.collection("redirects").createIndex({ from: 1 }, { unique: true }),
    db.collection("subscribers").createIndex({ email: 1 }, { unique: true }),
    db.collection("leads").createIndex({ created_at: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 730 }),
    db.collection("ingest_log").createIndex({ created_at: -1 }),
  ]);
}
