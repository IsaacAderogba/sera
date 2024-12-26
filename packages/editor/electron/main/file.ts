import fs from "fs/promises";
import mime from "mime";

export const getFileHeaders = async (
  pathname: string
): Promise<HeadersInit> => {
  try {
    const headers: HeadersInit = {};

    const contentType = mime.getType(pathname);
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    const stats = await fs.stat(pathname);
    if (stats.size) {
      headers["Content-Length"] = `${stats.size}`;
    }

    return headers;
  } catch (err) {
    console.log("error retrieving headers", err);
    return {};
  }
};
