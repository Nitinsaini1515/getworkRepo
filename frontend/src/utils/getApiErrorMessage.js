/**
 * Extract a user-facing message from an Axios error.
 */
export function getApiErrorMessage(error) {
  if (error?.code === "ERR_NETWORK" || error?.message === "Network Error") {
    return "Cannot reach the server. Check your connection and that the API URL and CORS settings are correct.";
  }
  const msg = error?.response?.data?.message;
  if (typeof msg === "string" && msg.trim()) return msg;
  if (error?.message) return error.message;
  return "Something went wrong. Please try again.";
}
