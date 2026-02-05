import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "0.1.0",
    node: process.version,
    uptime: Math.floor(process.uptime()),
    env: process.env.NODE_ENV,
  });
}
