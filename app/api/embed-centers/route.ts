import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ensureCollection, upsertPoints, qdrantConfig } from "@/lib/qdrant";
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
    phone: center.phone,
    address: center.address,
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

    await ensureCollection(VECTOR_SIZE);

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
