const CACHE_VERSION = "v20250731";

export const loadJson = async (path) => {
  try {
    path = path + "?cache_version=" + CACHE_VERSION;
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return await res.json();
  } catch (err) {
    console.error("loadJson error:", err);
    return null;
  }
};
