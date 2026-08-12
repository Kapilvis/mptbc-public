import { handleError, handleNotOkResponse } from "./handle-error";

let apiRoot: string | undefined = undefined;
let bearerToken: string | undefined = undefined;

const DEFAULT_LOCALE = "en";
const LANGUAGE_STORAGE_KEY = "user-language";

function setApiRoot(value: string) {
  apiRoot = value;
}

function setBearerToken(token: string | undefined) {
  bearerToken = token;
}

function getLocale(): string {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }
  return localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? DEFAULT_LOCALE;
}

function setLocale(locale: string) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
}

async function request<T>(
  method: string,
  url: string,
  body?: FormData | unknown,
  suppressErrorToast: boolean = false,
): Promise<Api.ApiResult<T>> {
  if (!apiRoot) {
    throw Error("Api Root not available.");
  }

  try {
    const isFormData = body instanceof FormData;
    const headers: Record<string, string> = isFormData
      ? { Origin: window.location.host }
      : {
          Origin: window.location.host,
          "Content-Type": "application/json; charset=utf-8",
          "Accept-Language": getLocale(),
        };

    if (bearerToken) {
      headers["Authorization"] = `Bearer ${bearerToken}`;
    }

    const response = await fetch(`${apiRoot}${url}`, {
      method: method,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      let errorMessage: string | undefined;
      if (!suppressErrorToast) {
        errorMessage = (await handleNotOkResponse(response)) as string;
      }
      return { error: true, message: errorMessage };
    }

    const result = await getJsonOrUndefined<T>(response);
    return { error: false, data: result };
  } catch (error) {
    if (!suppressErrorToast) {
      const message = error instanceof Error ? error.message : String(error);
      handleError(message);
    }
    return { error: true };
  }
}

async function getJsonOrUndefined<T>(response: Response) {
  try {
    const result = await response.json();
    return result as T;
  } catch {
    return undefined;
  }
}

async function get<T>(url: string, suppressErrorToast: boolean = false) {
  return await request<T>("get", url, undefined, suppressErrorToast);
}

async function getList<T>(url: string): Promise<T[]> {
  return request<T>("get", url).then((result) => (result?.data as T[]) ?? []);
}

async function post<T>(url: string, body: unknown) {
  return await request<T>("post", url, body);
}

async function put<T>(url: string, body: unknown) {
  return await request<T>("put", url, body);
}

async function del<T>(url: string) {
  return await request<T>("delete", url);
}

async function patch<T>(url: string, body: unknown) {
  return await request<T>("patch", url, body);
}

const ApiService = {
  get,
  getList,
  post,
  put,
  del,
  patch,
  setApiRoot,
  setBearerToken,
  setLocale,
};

export default ApiService;
