import { MongoClient } from "mongodb";
import { logger } from "./logger.js";

export class MongoService {
  constructor({ uri, dbName }) {
    this.uri = uri;
    this.dbName = dbName;
    this.client = null;
    this.db = null;
  }

  isEnabled() {
    return Boolean(this.uri);
  }

  async connect() {
    if (!this.isEnabled()) {
      logger.info("MongoDB is disabled (MONGODB_URI not set).");
      return null;
    }

    if (this.db) {
      return this.db;
    }

    this.client = new MongoClient(this.uri, {
      maxPoolSize: 10,
    });

    await this.client.connect();
    this.db = this.client.db(this.dbName || undefined);

    await this.db.command({ ping: 1 });

    logger.info("Connected to MongoDB.", {
      dbName: this.db.databaseName,
    });

    return this.db;
  }

  async disconnect() {
    if (!this.client) {
      return;
    }

    await this.client.close();
    this.client = null;
    this.db = null;

    logger.info("Disconnected from MongoDB.");
  }
}
