const API_KEY = "AIzaSyC7zXzCZJ-nVCgzjIqeiMAlrcck7_Doxm8";
const PROJECT = "qeleme-exams-application";
const DATABASE = encodeURIComponent("(default)");
const BUCKET = "qeleme-exams-application.firebasestorage.app";

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/${DATABASE}/documents`;
const STORAGE_BASE = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o`;

export type SwipeReport = {
  collections: string[];
  docsDeleted: number;
  filesDeleted: number;
};

export type SwipeProgress = {
  phase: string;
  docsListed: number;
  docsDeleted: number;
  filesListed: number;
  filesDeleted: number;
};

type ListDocsResponse = {
  documents?: { name: string }[];
  nextPageToken?: string;
};

type ListFilesResponse = {
  items?: { name: string }[];
  nextPageToken?: string;
};

type ListCollectionIdsResponse = {
  collectionIds?: string[];
};

async function fireFetch<T>(
  url: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  if (init.body) headers["Content-Type"] = "application/json";

  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let detail = text;
    try {
      const parsed = JSON.parse(text);
      detail = parsed?.error?.message ?? parsed?.message ?? text;
    } catch {
      // keep raw text
    }
    throw new Error(`Firebase request failed (HTTP ${res.status}): ${detail}`);
  }
  return res.json().catch(() => ({} as T));
}

async function createFirebaseToken(): Promise<string> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `swipe_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`,
        password: "SwipeP@ss!x",
        returnSecureToken: true,
      }),
    },
  );
  const data: {
    idToken?: string;
    error?: { message?: string };
  } = await res.json().catch(() => ({}));
  if (!res.ok || !data.idToken) {
    const message = data.error?.message ?? `HTTP ${res.status}`;
    throw new Error(`Could not start a Firebase session: ${message}`);
  }
  return data.idToken;
}

async function listCollections(token: string): Promise<string[]> {
  try {
    const data = await fireFetch<ListCollectionIdsResponse>(
      `${FIRESTORE_BASE}:listCollectionIds`,
      token,
      { method: "POST", body: JSON.stringify({}) },
    );
    const ids = data.collectionIds ?? [];
    if (ids.length > 0) return ids;
  } catch {
    // fall back to the known collection names below
  }
  return ["users", "packages", "config"];
}

async function listDocs(
  collection: string,
  token: string,
): Promise<string[]> {
  const names: string[] = [];
  let pageToken: string | null = null;
  for (;;) {
    const query =
      pageToken === null ? "" : `&pageToken=${encodeURIComponent(pageToken)}`;
    const url: string = `${FIRESTORE_BASE}/${encodeURIComponent(collection)}?pageSize=300${query}`;
    const data = await fireFetch<ListDocsResponse>(url, token);
    for (const doc of data.documents ?? []) names.push(doc.name);
    pageToken = data.nextPageToken ?? null;
    if (!pageToken) break;
  }
  return names;
}

async function deleteDocs(
  names: string[],
  token: string,
  onBatch: (deletedSoFar: number) => void,
): Promise<number> {
  let deleted = 0;
  for (let i = 0; i < names.length; i += 500) {
    const batch = names.slice(i, i + 500);
    await fireFetch<Record<string, unknown>>(`${FIRESTORE_BASE}:commit`, token, {
      method: "POST",
      body: JSON.stringify({ writes: batch.map((name) => ({ delete: name })) }),
    });
    deleted += batch.length;
    onBatch(deleted);
  }
  return deleted;
}

async function listFiles(token: string): Promise<string[]> {
  const names: string[] = [];
  let pageToken: string | null = null;
  for (;;) {
    const query =
      pageToken === null ? "" : `&pageToken=${encodeURIComponent(pageToken)}`;
    const url: string = `${STORAGE_BASE}?maxResults=1000${query}`;
    const data = await fireFetch<ListFilesResponse>(url, token);
    for (const item of data.items ?? []) names.push(item.name);
    pageToken = data.nextPageToken ?? null;
    if (!pageToken) break;
  }
  return names;
}

async function deleteFile(name: string, token: string): Promise<void> {
  await fireFetch<Record<string, unknown>>(
    `${STORAGE_BASE}/${encodeURIComponent(name)}`,
    token,
    { method: "DELETE" },
  );
}

export async function swipeQeleme(
  onProgress?: (progress: SwipeProgress) => void,
): Promise<SwipeReport> {
  const token = await createFirebaseToken();

  let docsListed = 0;
  let docsDeleted = 0;

  const collections = await listCollections(token);
  for (const collection of collections) {
    const names = await listDocs(collection, token);
    docsListed += names.length;
    onProgress?.({
      phase: `Deleting Firestore "${collection}"`,
      docsListed,
      docsDeleted,
      filesListed: 0,
      filesDeleted: 0,
    });
    docsDeleted += await deleteDocs(names, token, (deletedSoFar) => {
      onProgress?.({
        phase: `Deleting Firestore "${collection}"`,
        docsListed,
        docsDeleted: docsDeleted + deletedSoFar,
        filesListed: 0,
        filesDeleted: 0,
      });
    });
  }

  let filesListed = 0;
  let filesDeleted = 0;

  const files = await listFiles(token);
  filesListed = files.length;
  for (const name of files) {
    await deleteFile(name, token);
    filesDeleted += 1;
    if (filesDeleted % 20 === 0 || filesDeleted === files.length) {
      onProgress?.({
        phase: "Deleting storage files",
        docsListed,
        docsDeleted,
        filesListed,
        filesDeleted,
      });
    }
  }

  return { collections, docsDeleted, filesDeleted };
}