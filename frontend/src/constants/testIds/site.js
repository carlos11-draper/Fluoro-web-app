// Test IDs for the Fluoro Seals marketing site

export const NAV = {
  logo: "nav-logo",
  pill: "nav-pill",
  link: (slug) => `nav-link-${slug}`,
  mobileToggle: "nav-mobile-toggle",
  mobileLink: (slug) => `nav-mobile-link-${slug}`,
  ctaContact: "nav-cta-quote",
};

export const HERO = {
  section: "hero-section",
  video: "hero-video",
  eyebrow: "hero-eyebrow",
  heading: "hero-heading",
  primaryCta: "hero-primary-cta",
  secondaryCta: "hero-secondary-cta",
  intro: "hero-intro",
  trust: "hero-trust",
};

export const SECTION = {
  trustBar: "trust-bar",
  stat: (i) => `trust-stat-${i}`,
  services: "services-section",
  serviceCard: (no) => `service-card-${no}`,
  importStrip: "import-strip",
  importStripCta: "import-strip-cta",
  capabilities: "capabilities-section",
  story: "story-section",
  clients: "clients-section",
  proof: "proof-section",
  caseCard: (no) => `case-card-${no}`,
  rfq: "rfq-section",
};

export const CONTACT = {
  form: "contact-form",
  name: "contact-input-name",
  email: "contact-input-email",
  phone: "contact-input-phone",
  company: "contact-input-company",
  subject: "contact-input-subject",
  message: "contact-input-message",
  submit: "contact-submit-btn",
  success: "contact-success-message",
};

export const FOOTER = {
  section: "site-footer",
  contactCta: "footer-contact-cta",
};

export const ADMIN = {
  page: "page-admin",
  loginForm: "admin-login-form",
  email: "admin-input-email",
  password: "admin-input-password",
  submit: "admin-login-submit",
  error: "admin-login-error",
  editor: "admin-image-editor",
  input: (key) => `admin-image-input-${key}`,
  upload: (key) => `admin-upload-${key}`,
  preview: (key) => `admin-image-preview-${key}`,
  save: "admin-save-images",
  reset: (key) => `admin-image-reset-${key}`,
  logout: "admin-logout",
};

export const BROCHURE = {
  heroButton: "brochure-hero-button",
  rfqButton: "brochure-rfq-button",
  footerButton: "brochure-footer-button",
  adminSlot: "admin-brochure-slot",
  adminUpload: "admin-brochure-upload",
  adminRemove: "admin-brochure-remove",
  adminOpen: "admin-brochure-open",
  adminFilename: "admin-brochure-filename",
};

export const PAGE = {
  home: "page-home",
  about: "page-about",
  founder: "page-founder",
  services: "page-services",
  capabilities: "page-capabilities",
  importSubstitution: "page-import-substitution",
  projects: "page-projects",
  contact: "page-contact",
};
