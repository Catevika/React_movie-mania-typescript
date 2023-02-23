/// <reference types="vite/client" />

type ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly VITE_EMAILJS_PUBLIC_KEY: string;
  readonly VITE_EMAILJS_SERVICE_ID: string;
  readonly VITE_EMAILJS_TEMPLATE_ID: string;
};

type ImportMeta {
  readonly env: ImportMetaEnv;
};