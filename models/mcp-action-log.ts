import { ObjectId } from 'mongodb';

/**
 * Audit trail for every write the remote MCP connector makes. The connector is
 * drafts-only, but this row is written for reads too when useful, so there is a
 * full record of what Claude did against the live site.
 */
export interface McpActionLog {
  _id?: ObjectId;
  tool: string; // "create_draft" | "update_draft" | "list_posts" | "get_post"
  slug?: string;
  actor: 'mcp';
  ok: boolean;
  meta?: Record<string, unknown>; // e.g. { fields: [...], reason: "not a draft" }
  createdAt: Date;
}
