import { PAYLOAD_API_URL } from "../config";

interface PayloadListResponse<T> {
  docs: T[];
  hasNextPage: boolean;
  nextPage: number | null;
}

export async function payloadFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${PAYLOAD_API_URL}${path}${qs ? `?${qs}` : ""}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Payload API error ${res.status} on ${path}`);
  return res.json();
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.errors) && typeof data.errors[0]?.message === "string") return data.errors[0].message;
  } catch {
    // el body no era JSON — se usa el mensaje genérico
  }
  return `Payload API error ${res.status}`;
}

export async function payloadPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${PAYLOAD_API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await readErrorMessage(res));
  return res.json();
}

export async function payloadFind<T>(collection: string, params: Record<string, string> = {}): Promise<T[]> {
  const data = await payloadFetch<PayloadListResponse<T>>(`/${collection}`, params);
  return data.docs;
}

export async function payloadList<T>(collection: string, params: Record<string, string> = {}): Promise<T[]> {
  const docs: T[] = [];
  let page = 1;
  while (true) {
    const data = await payloadFetch<PayloadListResponse<T>>(`/${collection}`, {
      limit: "0",
      ...params,
      page: String(page),
    });
    docs.push(...data.docs);
    if (!data.hasNextPage || !data.nextPage) break;
    page = data.nextPage;
  }
  return docs;
}

export async function payloadFindOneBySlug<T>(
  collection: string,
  slug: string,
  params: Record<string, string> = {},
): Promise<T | null> {
  const docs = await payloadList<T>(collection, { "where[slug][equals]": slug, ...params });
  console.log("payloadFindOneBySlug", collection, slug, JSON.stringify(docs, null, 2));
  return docs[0] ?? null;
}

export async function payloadGlobal<T>(slug: string, params: Record<string, string> = {}): Promise<T> {
  return payloadFetch<T>(`/globals/${slug}`, { depth: "2", ...params });
}
