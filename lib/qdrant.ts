const QDRANT_URL = (process.env.QDRANT_URL || "").replace(/\/$/, "");
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || "";
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION || "center";

if (!QDRANT_URL) {
  console.warn("[qdrant] QDRANT_URL is not set. Vector operations will fail.");
}

async function qdrantFetch(path: string, init: RequestInit = {}) {
  if (!QDRANT_URL) {
    throw new Error("QDRANT_URL is not configured");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (QDRANT_API_KEY) {
    headers["api-key"] = QDRANT_API_KEY;
  }

  const res = await fetch(`${QDRANT_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Qdrant error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function ensureCollection(vectorSize: number) {
  return qdrantFetch(`/collections/${QDRANT_COLLECTION}`, {
    method: "PUT",
    body: JSON.stringify({
      vectors: {
        size: vectorSize,
        distance: "Cosine",
      },
    }),
  });
}

export type QdrantPoint = {
  id: string | number;
  vector: number[];
  payload?: Record<string, any>;
};

export async function upsertPoints(points: QdrantPoint[]) {
  return qdrantFetch(`/collections/${QDRANT_COLLECTION}/points`, {
    method: "PUT",
    body: JSON.stringify({ points }),
  });
}

export const qdrantConfig = {
  collection: QDRANT_COLLECTION,
  url: QDRANT_URL,
};

export async function searchPoints(options: {
  vector: number[];
  topK?: number;
  filter?: any;
}) {
  const { vector, topK = 3, filter } = options;
  return qdrantFetch(`/collections/${QDRANT_COLLECTION}/points/search`, {
    method: "POST",
    body: JSON.stringify({
      vector,
      limit: topK,
      filter,
    }),
  });
}
