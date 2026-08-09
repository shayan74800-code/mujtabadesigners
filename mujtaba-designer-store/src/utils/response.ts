export async function parseJSONSafe(res: Response): Promise<any> {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  // If not JSON, attempt to read text. Return null for empty bodies.
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (err) {
    return { _text: text };
  }
}
