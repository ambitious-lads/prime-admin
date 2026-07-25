import { NextResponse } from "next/server";

export function GET() {
  const directApkFingerprint =
    "5D:F7:B0:B2:5F:69:09:0F:67:10:E7:9D:0E:73:BC:9F:23:C9:00:95:8C:D0:AF:8F:3C:D5:91:10:4A:83:15:08";
  const configuredFingerprints = (
    process.env.ANDROID_APP_SHA256_CERT_FINGERPRINT || ""
  )
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const fingerprints = Array.from(
    new Set([directApkFingerprint, ...configuredFingerprints]),
  );
  const body = fingerprints.length
    ? [
        {
          relation: ["delegate_permission/common.handle_all_urls"],
          target: {
            namespace: "android_app",
            package_name: "com.primely.app",
            sha256_cert_fingerprints: fingerprints,
          },
        },
      ]
    : [];

  return NextResponse.json(body, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
