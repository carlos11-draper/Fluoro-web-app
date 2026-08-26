import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, LogOut, RotateCcw, Save, ShieldCheck, Trash2, Upload, FileText, ExternalLink } from "lucide-react";
import { DEFAULT_IMAGES, MEDIA_FIELDS } from "@/data/company";
import { resolveMediaUrl } from "@/context/SiteImages";
import { uploadMedia } from "@/lib/upload";
import { ADMIN, BROCHURE } from "@/constants/testIds";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "fs_admin_token";

const errText = (detail) => {
  if (!detail) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg || JSON.stringify(d)).join(" ");
  return String(detail);
};

const LoginCard = ({ onAuthed }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      onAuthed(data.token);
    } catch (err) {
      setError(errText(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      data-testid={ADMIN.loginForm}
      onSubmit={submit}
      className="max-w-md w-full border border-white/12 bg-white/[0.03] backdrop-blur-sm p-8"
    >
      <ShieldCheck className="h-7 w-7 text-blue-400" strokeWidth={1.5} />
      <h1 className="mt-5 font-oswald font-medium uppercase text-white text-2xl tracking-tight">
        Site image manager
      </h1>
      <p className="mt-3 text-sm text-white/60">
        Sign in with your admin account to replace any photo on the website.
      </p>

      <label className="block mt-8">
        <span className="font-ibm-plex-mono text-[0.7rem] tracking-[0.2em] uppercase text-white/50">
          Email
        </span>
        <input
          data-testid={ADMIN.email}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-2 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-white outline-none focus:border-blue-400 transition-colors"
        />
      </label>
      <label className="block mt-5">
        <span className="font-ibm-plex-mono text-[0.7rem] tracking-[0.2em] uppercase text-white/50">
          Password
        </span>
        <input
          data-testid={ADMIN.password}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-2 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-white outline-none focus:border-blue-400 transition-colors"
        />
      </label>

      {error && (
        <p data-testid={ADMIN.error} className="mt-5 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        data-testid={ADMIN.submit}
        disabled={loading}
        className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 text-white text-sm px-6 py-3.5 hover:bg-white hover:text-slate-950 transition-colors duration-300 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
      </button>
    </form>
  );
};

const MediaSlot = ({ field, value, token, onChange }) => {
  const [progress, setProgress] = useState(null);
  const isVideo = field.kind === "video";

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setProgress(1);
    try {
      const url = await uploadMedia(file, token, setProgress);
      onChange(url);
      toast.success(`${field.label} uploaded — remember to save.`);
    } catch (err) {
      toast.error(errText(err.response?.data?.detail) || "Upload failed");
    } finally {
      setProgress(null);
    }
  };

  return (
    <div className="border border-white/12 bg-white/[0.03] p-5 flex gap-5">
      {isVideo ? (
        <video
          data-testid={ADMIN.preview(field.key)}
          src={resolveMediaUrl(value)}
          muted
          loop
          autoPlay
          playsInline
          className="h-28 w-28 object-cover shrink-0 border border-white/10 bg-black"
        />
      ) : (
        <img
          data-testid={ADMIN.preview(field.key)}
          src={resolveMediaUrl(value)}
          alt={field.label}
          className="h-28 w-28 object-cover shrink-0 border border-white/10"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="font-oswald uppercase text-white text-lg tracking-tight">
          {field.label}
        </div>
        {field.note && (
          <div className="font-ibm-plex-mono text-[0.6rem] tracking-[0.15em] uppercase text-white/40 mt-1">
            {field.note}
          </div>
        )}

        <input
          data-testid={ADMIN.input(field.key)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste a link, or upload below"
          className="mt-3 w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 font-ibm-plex-mono text-xs text-white outline-none focus:border-blue-400 transition-colors"
        />

        <div className="mt-3 flex flex-wrap items-center gap-4">
          <label
            data-testid={ADMIN.upload(field.key)}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 font-ibm-plex-mono text-[0.65rem] tracking-[0.15em] uppercase text-white cursor-pointer hover:bg-white/10 transition-colors"
          >
            <Upload className="h-3.5 w-3.5" />
            {progress != null ? `Uploading ${progress}%` : isVideo ? "Upload video" : "Upload photo"}
            <input
              type="file"
              accept={isVideo ? "video/mp4,video/webm,video/quicktime" : "image/*"}
              onChange={pick}
              disabled={progress != null}
              className="hidden"
            />
          </label>
          <button
            data-testid={ADMIN.reset(field.key)}
            onClick={() => onChange(DEFAULT_IMAGES[field.key])}
            className="inline-flex items-center gap-2 font-ibm-plex-mono text-[0.65rem] tracking-[0.15em] uppercase text-blue-300 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset to original
          </button>
        </div>

        {progress != null && (
          <div className="mt-3 h-1 w-full bg-white/10 overflow-hidden rounded-full">
            <div
              className="h-full bg-blue-500 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const MAX_PDF_BYTES = 25 * 1024 * 1024;

const BrochureSlot = ({ token, onLogout }) => {
  const [settings, setSettings] = useState({ brochure_url: "", brochure_filename: "" });
  const [progress, setProgress] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    axios.get(`${API}/site-settings`).then(({ data }) => setSettings(data)).catch(() => {});
  }, []);

  const persist = async (brochure_url, brochure_filename) => {
    setBusy(true);
    try {
      const { data } = await axios.put(
        `${API}/site-settings`,
        { brochure_url, brochure_filename },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettings(data);
      toast.success(brochure_url ? "Brochure updated — live now." : "Brochure removed.");
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
        toast.error("Session expired. Please sign in again.");
      } else {
        toast.error(errText(err.response?.data?.detail));
      }
    } finally {
      setBusy(false);
    }
  };

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are allowed for the brochure.");
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      toast.error("PDF is too large — the limit is 25MB.");
      return;
    }
    setProgress(1);
    try {
      const url = await uploadMedia(file, token, setProgress);
      await persist(url, file.name);
    } catch (err) {
      toast.error(errText(err.response?.data?.detail) || "Upload failed");
    } finally {
      setProgress(null);
    }
  };

  const hasPdf = Boolean(settings.brochure_url);

  return (
    <div data-testid={BROCHURE.adminSlot} className="mt-12 border border-white/12 bg-white/[0.03] p-6">
      <div className="flex items-start gap-5">
        <div className="h-14 w-14 shrink-0 border border-white/10 bg-white/5 flex items-center justify-center">
          <FileText className={`h-6 w-6 ${hasPdf ? "text-blue-400" : "text-white/30"}`} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-oswald uppercase text-white text-lg tracking-tight">
            Company brochure (PDF)
          </div>
          <div className="font-ibm-plex-mono text-[0.6rem] tracking-[0.15em] uppercase text-white/40 mt-1">
            Powers the "Download portfolio" buttons — PDF only, up to 25MB
          </div>

          <p data-testid={BROCHURE.adminFilename} className="mt-3 font-ibm-plex-mono text-xs text-white/70 break-all">
            {hasPdf
              ? `Current file: ${settings.brochure_filename || settings.brochure_url.split("/").pop()}`
              : "No brochure set — the download buttons are hidden on the site."}
          </p>
          <p data-testid={BROCHURE.adminDownloads} className="mt-1.5 font-ibm-plex-mono text-xs text-blue-300">
            Downloaded {settings.brochure_downloads || 0}{" "}
            {(settings.brochure_downloads || 0) === 1 ? "time" : "times"} from the site
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <label
              data-testid={BROCHURE.adminUpload}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 font-ibm-plex-mono text-[0.65rem] tracking-[0.15em] uppercase text-white cursor-pointer hover:bg-white/10 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              {progress != null ? `Uploading ${progress}%` : hasPdf ? "Replace PDF" : "Upload PDF"}
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={pick}
                disabled={progress != null || busy}
                className="hidden"
              />
            </label>
            {hasPdf && (
              <>
                <a
                  data-testid={BROCHURE.adminOpen}
                  href={resolveMediaUrl(settings.brochure_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-ibm-plex-mono text-[0.65rem] tracking-[0.15em] uppercase text-blue-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open current PDF
                </a>
                <button
                  data-testid={BROCHURE.adminRemove}
                  onClick={() => persist("", "")}
                  disabled={busy || progress != null}
                  className="inline-flex items-center gap-2 font-ibm-plex-mono text-[0.65rem] tracking-[0.15em] uppercase text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </>
            )}
          </div>

          {progress != null && (
            <div className="mt-3 h-1 w-full bg-white/10 overflow-hidden rounded-full">
              <div
                className="h-full bg-blue-500 transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ImageEditor = ({ token, onLogout }) => {
  const [values, setValues] = useState(DEFAULT_IMAGES);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/site-images`)
      .then(({ data }) => setValues({ ...DEFAULT_IMAGES, ...(data.images || {}) }))
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await axios.put(
        `${API}/site-images`,
        { images: values },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Saved — reload the site to see it live.");
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
        toast.error("Session expired. Please sign in again.");
      } else {
        toast.error(errText(err.response?.data?.detail));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid={ADMIN.editor} className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h1 className="font-oswald font-medium uppercase text-white text-3xl sm:text-4xl tracking-tight">
            Edit site media
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/70 max-w-2xl">
            Upload a photo straight from your phone, or paste an image link. The hero
            background video can be replaced the same way — change anything, any time,
            and it goes live on save.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            data-testid={ADMIN.save}
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white text-sm px-6 py-3 hover:bg-white hover:text-slate-950 transition-colors duration-300 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </button>
          <button
            data-testid={ADMIN.logout}
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 text-white text-sm px-5 py-3 hover:bg-white/10 transition-colors duration-300"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MEDIA_FIELDS.map((f) => (
          <MediaSlot
            key={f.key}
            field={f}
            value={values[f.key] || ""}
            token={token}
            onChange={(url) => setValues((v) => ({ ...v, [f.key]: url }))}
          />
        ))}
      </div>

      <BrochureSlot token={token} onLogout={onLogout} />
    </div>
  );
};

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [checking, setChecking] = useState(Boolean(token));

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .catch(logout)
      .finally(() => setChecking(false));
  }, [token, logout]);

  return (
    <div
      data-testid={ADMIN.page}
      className="min-h-screen pt-[76px] bg-slate-950 blueprint-grid-dark"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 flex justify-center">
        {checking ? (
          <Loader2 className="h-6 w-6 text-blue-400 animate-spin mt-20" />
        ) : token ? (
          <ImageEditor token={token} onLogout={logout} />
        ) : (
          <LoginCard
            onAuthed={(t) => {
              setToken(t);
              setChecking(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
