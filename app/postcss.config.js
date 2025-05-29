const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-preset-env": {
      stage: 3,
      features: {
        "has-pseudo": true
      }
    }
  },
};
export default config;
