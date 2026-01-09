import { load } from "cheerio";
import { HotItem } from "../types";

export async function fetchWithTimeout(
  url: string,
  timeout = 10000,
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    clearTimeout(timeoutId);
    return html;
  } catch (error) {
    clearTimeout(timeoutId);
    if ((error as any).name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
}

export function extractWithSelector(
  html: string,
  selector: string,
  titleAttr: string = "text",
): HotItem[] {
  const $ = load(html);
  const items: HotItem[] = [];

  $(selector).each((index, element) => {
    let title = "";
    let url = "";

    if (titleAttr === "text") {
      title = $(element).text().trim();
    } else {
      title = $(element).attr(titleAttr) || "";
    }

    // Get href attribute if element is an anchor tag
    if ($(element).is("a")) {
      url = $(element).attr("href") || "";
    } else {
      const linkElement = $(element).find("a").first();
      if (linkElement.length > 0) {
        url = linkElement.attr("href") || "";
      }
    }

    // Make sure URL is absolute if it's relative
    if (url && !url.startsWith("http")) {
      // This is a simplification - in real implementation you'd want to use the base URL
      url = url.startsWith("/") ? `https://example.com${url}` : url;
    }

    if (title) {
      items.push({
        index: index + 1,
        title,
        url: url || undefined,
      });
    }
  });

  return items;
}

export function extractMatches(
  html: string,
  pattern: RegExp | string,
): string[][] {
  const regex =
    typeof pattern === "string" ? new RegExp(pattern, "g") : pattern;
  const matches: string[][] = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    matches.push(match);
    // 避免无限循环，特别是当正则表达式可以匹配空字符串时
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
  }

  return matches;
}
