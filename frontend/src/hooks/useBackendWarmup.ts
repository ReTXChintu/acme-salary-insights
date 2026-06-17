const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const WARMUP_SESSION_KEY = "acme-backend-awake";
const WARMUP_TIMEOUT_MS = 55_000;

export type WarmupState = {
  isWarmingUp: boolean;
  message: string;
  showSlowHint: boolean;
  error: string | null;
};

export async function pingBackendHealth(): Promise<void> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), WARMUP_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}/health`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("Backend health check failed");
    }
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function hasWarmSessionFlag(): boolean {
  return sessionStorage.getItem(WARMUP_SESSION_KEY) === "true";
}

export function markBackendAwake(): void {
  sessionStorage.setItem(WARMUP_SESSION_KEY, "true");
}

export function clearWarmSessionFlag(): void {
  sessionStorage.removeItem(WARMUP_SESSION_KEY);
}
