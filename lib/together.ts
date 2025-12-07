import { VideoGenerationStatus } from "@/types";

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY || "";
const TOGETHER_BASE_URL =
  process.env.TOGETHER_BASE_URL || "https://api.together.ai/v1";

const TOGETHER_VIDEO_MODEL =
  process.env.TOGETHER_VIDEO_MODEL || "openai/sora-2";
const TOGETHER_IMAGE_MODEL =
  process.env.TOGETHER_IMAGE_MODEL || "black-forest-labs/FLUX.1-krea-dev";

const DEFAULT_HEADERS = {
  Authorization: `Bearer ${TOGETHER_API_KEY}`,
  "Content-Type": "application/json",
};

async function togetherRequest<T>(path: string, init: RequestInit): Promise<T> {
  if (!TOGETHER_API_KEY) {
    throw new Error("TOGETHER_API_KEY is missing");
  }

  const res = await fetch(`${TOGETHER_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...DEFAULT_HEADERS,
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Together API error ${res.status}: ${text || res.statusText}`
    );
  }

  return (await res.json()) as T;
}

function normalizeStatus(rawStatus: string | undefined): VideoGenerationStatus {
  const normalized = (rawStatus || "").toLowerCase();
  if (["completed", "succeeded", "success"].includes(normalized)) {
    return "completed";
  }
  if (["failed", "error"].includes(normalized)) {
    return "failed";
  }
  if (["generating", "processing", "running", "queued"].includes(normalized)) {
    return "generating";
  }
  return "pending";
}

function pickVideoUrl(data: any): string | undefined {
  return (
    data?.video_url ||
    data?.video ||
    data?.url ||
    data?.output?.[0]?.url ||
    data?.data?.[0]?.url
  );
}

function pickImageB64(data: any): string | undefined {
  const first =
    data?.data?.[0] ||
    data?.output?.[0] ||
    data?.images?.[0] ||
    data?.results?.[0];
  return first?.b64_json || first?.base64;
}

function pickImageUrl(data: any): string | undefined {
  const first =
    data?.data?.[0] ||
    data?.output?.[0] ||
    data?.images?.[0] ||
    data?.results?.[0];
  return first?.url;
}

export async function createTogetherVideo(prompt: string) {
  return togetherRequest<any>("/videos", {
    method: "POST",
    body: JSON.stringify({
      model: TOGETHER_VIDEO_MODEL,
      prompt,
    }),
  });
}

export async function getTogetherVideo(taskId: string) {
  return togetherRequest<any>(`/videos/${taskId}`, { method: "GET" });
}

export async function generateTogetherImage(prompt: string): Promise<string> {
  // Together image generation (Flux) — matches OpenAI-style endpoint
  const data = await togetherRequest<any>("/images/generations", {
    method: "POST",
    body: JSON.stringify({
      model: TOGETHER_IMAGE_MODEL,
      prompt,
      steps: 10,
      n: 1,
    }),
  });

  const b64 = pickImageB64(data);
  const url = pickImageUrl(data);
  if (b64) {
    return `data:image/png;base64,${b64}`;
  }
  if (url) {
    return url;
  }

  console.error("Together image: unexpected response shape", data);
  throw new Error("Together image: no image returned");
}

export async function generateVideoWithFallback(
  prompt: string,
  options: {
    pollIntervalMs?: number;
    maxAttempts?: number;
  } = {}
): Promise<{
  status: VideoGenerationStatus;
  url?: string;
  videoId?: string;
  fallbackImage?: string;
  error?: string;
}> {
  const pollIntervalMs = options.pollIntervalMs ?? 5000;
  const maxAttempts = options.maxAttempts ?? 12;

  try {
    const createRes = await createTogetherVideo(prompt);
    const videoId = createRes?.id || createRes?.task_id || createRes?.taskId;
    if (!videoId) {
      throw new Error("Together video: missing task id");
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const statusRes = await getTogetherVideo(videoId);
      const status = normalizeStatus(
        statusRes?.status ||
          statusRes?.state ||
          statusRes?.task?.status ||
          statusRes?.output?.status
      );
      const url = pickVideoUrl(statusRes);

      if (status === "completed" && url) {
        return { status, url, videoId };
      }
      if (status === "failed") {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    // Video failed or missing URL -> fallback to image
    const fallbackImage = await generateTogetherImage(prompt);
    return { status: "completed", fallbackImage, videoId };
  } catch (error: any) {
    console.error("Together video failed, falling back to image:", error);
    try {
      const fallbackImage = await generateTogetherImage(prompt);
      return { status: "completed", fallbackImage };
    } catch (imgError: any) {
      console.error("Together image fallback failed:", imgError);
      return {
        status: "failed",
        error:
          imgError?.message ||
          error?.message ||
          "Unable to generate video or image",
      };
    }
  }
}
