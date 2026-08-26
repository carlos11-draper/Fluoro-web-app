import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CHUNK_SIZE = 4 * 1024 * 1024;

// Chunked upload — keeps every request small enough for the ingress proxy.
export async function uploadMedia(file, token, onProgress) {
  const uploadId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const total = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
  let last;

  for (let i = 0; i < total; i++) {
    const body = new FormData();
    body.append("chunk", file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE));
    body.append("upload_id", uploadId);
    body.append("index", String(i));
    body.append("total", String(total));
    body.append("filename", file.name);
    body.append("content_type", file.type || "application/octet-stream");

    const { data } = await axios.post(`${API}/uploads/chunk`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    last = data;
    onProgress?.(Math.round(((i + 1) / total) * 100));
  }

  return last.url;
}
