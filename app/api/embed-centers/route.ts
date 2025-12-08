import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ensureCollection, upsertPoints, qdrantConfig, createPayloadIndex } from "@/lib/qdrant";
import centersData from "@/data/center.json";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = "text-embedding-3-small";
const VECTOR_SIZE = 1536; // text-embedding-3-small output size

type Center = (typeof centersData)["centers"][number];

function buildPayload(center: Center) {
  return {
    center_id: center.id,
    name: center.name,
    name_ko: center.name_ko,
    type: center.type,
    city: center.location?.city,
    city_ko: center.location?.city_ko,
    district: center.location?.district,
    district_ko: center.location?.district_ko,
    services: center.services,
    services_ko: center.services_ko,
    target_audience: center.target_audience,
    languages: center.languages,
    cost_type: center.cost_type,
    session_type: center.session_type,
    website: center.website,
    phone: (center as any).phone,
    address: (center as any).address,
    description: center.description,
    description_ko: center.description_ko,
  };
}

function buildText(center: Center) {
  // Prefer embedding_text if provided, otherwise build from key fields
  if (center.embedding_text) return center.embedding_text;
  return [
    center.name,
    center.name_ko,
    center.description,
    center.description_ko,
    (center.services_ko || center.services || []).join(", "),
    (center.target_audience || []).join(", "),
    (center.languages || []).join(", "),
  ]
    .filter(Boolean)
    .join(" ");
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 400 });
    }
    if (!process.env.QDRANT_URL) {
      return NextResponse.json({ error: "QDRANT_URL missing" }, { status: 400 });
    }

    // Try to ensure collection exists, but continue if it fails (might lack global permissions)
    try {
      await ensureCollection(VECTOR_SIZE);
    } catch (err: any) {
      console.warn("[embed-centers] ensureCollection failed (might already exist or lack permissions):", err.message);
    }

  const centers: Center[] = centersData.centers || [];
  const texts = centers.map((c) => buildText(c));

    const embeddings = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
    });

    const vectors = embeddings.data.map((item) => item.embedding);
    const points = centers.map((center, idx) => ({
      id: idx + 1, // Qdrant expects integer or UUID; use sequential integer
      vector: vectors[idx],
      payload: buildPayload(center),
    }));

    await upsertPoints(points);

    // Create index for session_type field to enable filtering
    try {
      await createPayloadIndex("session_type", "keyword");
      console.log("[embed-centers] Created index for session_type");
    } catch (err: any) {
      console.warn("[embed-centers] Failed to create index (might already exist):", err.message);
    }

    return NextResponse.json({
      collection: qdrantConfig.collection,
      upserted: points.length,
    });
  } catch (error: any) {
    console.error("Embed centers failed:", error);
    return NextResponse.json(
      { error: error?.message || "Embedding failed" },
      { status: 500 }
    );
  }
}
