import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockCreateClient } = vi.hoisted(() => ({
  mockCreateClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mockCreateClient,
}));

import { getSupabaseAdmin } from "@/lib/supabase";

describe("getSupabaseAdmin", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    mockCreateClient.mockReset();
  });

  it("returns null when URL is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key-123");

    const client = getSupabaseAdmin();
    expect(client).toBeNull();
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it("returns null when key is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");

    const client = getSupabaseAdmin();
    expect(client).toBeNull();
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it("returns a client when both URL and key are configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key-123");

    const fakeClient = { from: vi.fn() };
    mockCreateClient.mockReturnValue(fakeClient);

    const client = getSupabaseAdmin();
    expect(client).toBe(fakeClient);
    expect(mockCreateClient).toHaveBeenCalledWith(
      "https://project.supabase.co",
      "service-role-key-123",
      { auth: { persistSession: false } }
    );
  });
});
