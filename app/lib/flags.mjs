// Read at build time: the home page is prerendered, so a change needs a redeploy.
export const flags = {
  oura: process.env.FEATURE_OURA === 'true',
}
