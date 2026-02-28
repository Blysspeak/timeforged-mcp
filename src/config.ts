export const SERVER_URL = process.env.TF_SERVER_URL || "http://127.0.0.1:6175";
export const API_KEY = process.env.TF_API_KEY || "";

if (!API_KEY) {
  console.error(
    "Warning: TF_API_KEY not set. Requests will be sent without authentication."
  );
}
