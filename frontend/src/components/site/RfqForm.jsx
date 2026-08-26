import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { CONTACT } from "@/constants/testIds";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const initial = { name: "", company: "", email: "", phone: "", message: "" };

const Field = ({ label, name, testId, value, onChange, type = "text", required, textarea, light }) => {
  const base = `mt-2 w-full rounded-xl px-4 py-3 font-ibm-plex-sans outline-none transition-colors ${
    light
      ? "bg-white/5 border border-white/15 text-white placeholder-white/30 focus:border-blue-400"
      : "bg-white border border-slate-300 text-slate-900 focus:border-blue-600"
  }`;
  return (
    <label className="block">
      <span
        className={`font-ibm-plex-mono text-[0.7rem] tracking-[0.2em] uppercase ${
          light ? "text-white/50" : "text-slate-500"
        }`}
      >
        {label} {required && <span className="text-blue-500">*</span>}
      </span>
      {textarea ? (
        <textarea
          data-testid={testId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={5}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          data-testid={testId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={base}
        />
      )}
    </label>
  );
};

export const RfqForm = ({ light = false }) => {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, {
        ...form,
        subject: "Website RFQ — part / job requirement",
      });
      setSent(true);
      setForm(initial);
      toast.success("Requirement received — we'll respond within 24 hours.");
    } catch (err) {
      toast.error("Something went wrong. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div data-testid={CONTACT.success} className="text-center py-14">
        <CheckCircle2 className={`h-14 w-14 mx-auto ${light ? "text-blue-400" : "text-blue-600"}`} />
        <h3
          className={`mt-6 font-oswald font-bold uppercase text-2xl sm:text-3xl tracking-tight ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          Requirement received
        </h3>
        <p
          className={`mt-4 font-ibm-plex-sans text-sm md:text-base max-w-md mx-auto ${
            light ? "text-white/70" : "text-slate-600"
          }`}
        >
          Our engineering team will review your requirement and come back to you within 24 hours.
        </p>
        <button
          onClick={() => setSent(false)}
          className={`mt-8 inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm transition-colors duration-300 ${
            light
              ? "border-white/25 text-white hover:bg-white hover:text-slate-950"
              : "border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
          }`}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form data-testid={CONTACT.form} onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field light={light} label="Your name" name="name" testId={CONTACT.name} value={form.name} onChange={onChange} required />
        <Field light={light} label="Company name" name="company" testId={CONTACT.company} value={form.company} onChange={onChange} />
        <Field light={light} label="Email" name="email" type="email" testId={CONTACT.email} value={form.email} onChange={onChange} required />
        <Field light={light} label="Phone" name="phone" testId={CONTACT.phone} value={form.phone} onChange={onChange} />
      </div>
      <Field
        light={light}
        label="Describe the part or job — machine make/model, tonnage, what's needed"
        name="message"
        testId={CONTACT.message}
        value={form.message}
        onChange={onChange}
        required
        textarea
      />
      <button
        type="submit"
        data-testid={CONTACT.submit}
        disabled={loading}
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 text-white text-sm px-6 md:px-8 py-3 md:py-4 hover:bg-slate-900 transition-colors duration-300 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending
          </>
        ) : (
          <>
            Send requirement
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
    </form>
  );
};
