declare global {
  const CODEABZ_VERSION: string
  const CODEABZ_CHANNEL: string
}

export const InstallationVersion = typeof CODEABZ_VERSION === "string" ? CODEABZ_VERSION : "local"
export const InstallationChannel = typeof CODEABZ_CHANNEL === "string" ? CODEABZ_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
