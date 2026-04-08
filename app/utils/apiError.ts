import { isAxiosError } from "axios";

interface ApiValidationError {
  field?: string;
  message?: string;
}

interface ApiErrorPayload {
  status?: boolean;
  message?: string;
  errors?: ApiValidationError[];
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (isAxiosError<ApiErrorPayload>(error)) {
    const payload = error.response?.data;

    if (payload?.errors?.length) {
      const messages = payload.errors
        .map((item) => item.message?.trim())
        .filter((message): message is string => Boolean(message));

      if (messages.length) {
        return messages.join(", ");
      }
    }

    return payload?.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
