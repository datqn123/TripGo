import homeApi from "../api/homeApi";
import { destinationsData } from "./data";

function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Fetch locations from API and return the JSON shape:
 * {
 *   code: number,
 *   message: string,
 *   result: [{ id, name, slug, thumbnail }]
 * }
 *
 * If the API returns fewer items than local images, the remaining local
 * items are appended. On error the function returns a fallback using
 * `destinationsData`.
 */
export async function fetchLocations() {
  try {
    const res = await homeApi.getLocations();
    const api = res?.data || {};
    const apiResult = Array.isArray(api.result) ? api.result : [];

    const mapped = apiResult.map((loc, idx) => {
      const local = destinationsData[idx] || {};
      const name = loc.name || local.name || "";
      return {
        id: typeof loc.id !== "undefined" ? loc.id : local.id ?? idx,
        name,
        slug: loc.slug || slugify(name),
        thumbnail: loc.thumbnail || (local.image ? local.image : ""),
      };
    });

    // append remaining local items if api returned fewer entries
    if (apiResult.length < destinationsData.length) {
      for (let i = apiResult.length; i < destinationsData.length; i++) {
        const d = destinationsData[i];
        mapped.push({
          id: d.id ?? i,
          name: d.name || "",
          slug: slugify(d.name || ""),
          thumbnail: d.image || "",
        });
      }
    }

    return {
      code: typeof api.code !== "undefined" ? api.code : 0,
      message: api.message || "",
      result: mapped,
    };
  } catch (err) {
    console.error("fetchLocations error:", err);
    // fallback to local data
    const mapped = destinationsData.map((d, idx) => ({
      id: d.id ?? idx,
      name: d.name,
      slug: slugify(d.name),
      thumbnail: d.image || "",
    }));
    return {
      code: -1,
      message: err?.message || "Failed to fetch locations",
      result: mapped,
    };
  }
}

export default { fetchLocations };
