import PubSubService from "../pub-sub";

const titles: Record<number, Api.EventMessage> = {
  404: { title: "Not Found", messages: ["Resource not found."] },
  400: { title: "Bad Request", messages: [""] },
  401: {
    title: "Login Required",
    messages: ["You must log in"],
    requiresLogin: true,
  },
  403: {
    title: "Access Denied",
    messages: ["You cannot access this resource."],
  },
  500: {
    title: "Server Issue",
    messages: ["There seems to be a server issue."],
  },
  503: {
    title: "API Service Unavailable",
    messages: ["API service seems to be not available."],
  },
};

function getValidationErrors(errors: Api.TypedValidationError[]) {
  return {
    title: "Validation problem",
    errors: errors.map((e) => ({
      field: e.identifier,
      text: e.errorMessage,
    })),
  };
}

function getUnknowError(status: number): Api.EventMessage {
  const message = titles[status];

  return message ?? { title: "Unknow error", messages: [] };
}

interface ApiError {
  code?: string | { code: string };
  detail?: string;
  errors?: Api.TypedValidationError[];
}

export async function handleNotOkResponse(response: Response) {
  if (response.headers.get("content-length") === "0") {
    const error = getUnknowError(response.status);
    PubSubService.publish("@event/api-not-ok", error);
    return error.messages[0];
  }

  const json = await response.json();
  if (!json) {
    return;
  }

  const typedJson = json as ApiError;
  const code =
    typeof typedJson.code === "object" ? typedJson.code.code : typedJson.code;

  if (!code) {
    PubSubService.publish("@event/api-error", json as string);
    return json as string;
  }

  if (code === "validation_failure") {
    const errors = getValidationErrors(typedJson.errors!);
    PubSubService.publish("@event/api-validation-error", errors.errors);
    return typedJson;
  }

  if (code === "unauthorized") {
    PubSubService.publish("@event/api-unauthorized", typedJson.detail);
    return typedJson;
  }

  PubSubService.publish("@event/api-error", typedJson.detail || json);
  return typedJson;
}

export async function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  PubSubService.publish("@event/api-error", {
    title: "Unknow error",
    messages: [message],
  });
}
