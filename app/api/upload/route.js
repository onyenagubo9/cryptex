import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: "dn0hikijy",
  api_key: "495358545397912",
  api_secret: "AU5i-vgkveby4WlM2JtxDaLWOSc",
});

// ✅ Handle image upload
export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "cryptex-profiles" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
