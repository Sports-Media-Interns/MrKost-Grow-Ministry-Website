import { test, expect } from "@playwright/test";

test.describe("API Health", () => {
  test("GET /api/health returns ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBe(true);

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.timestamp).toBeTruthy();
    expect(body.version).toBeTruthy();
    expect(body.node).toBeTruthy();
    expect(typeof body.uptime).toBe("number");
  });
});
