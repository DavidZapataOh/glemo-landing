/** Tailwind 4 ships its own PostCSS plugin and vendors autoprefixing, so the
 *  tailwindcss + autoprefixer pair from v3 is replaced by this single entry. */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
