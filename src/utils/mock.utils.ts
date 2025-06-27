import { vi } from "vitest";

export const mockContext = {
  log: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
  reportProgress: vi.fn(),
  session: undefined,
  streamContent: vi.fn(),
};
