/**
 * Extract a user-facing message from an Axios error.
 */
export function getApiErrorMessage(error) {
  const msg = error?.response?.data?.message;
  if (typeof msg === "string" && msg.trim()) return msg;
  if (error?.message) return error.message;
  return "Something went wrong. Please try again.";
}
