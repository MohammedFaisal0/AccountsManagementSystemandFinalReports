// src/app/api/files/upload/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";

// Ensure the upload directory exists
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

async function ensureUploadDirExists() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // Directory doesn't exist, create it
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      console.log(`Created upload directory: ${UPLOAD_DIR}`);
    } else {
      // Other error
      console.error("Error accessing upload directory:", error);
      throw error; // Rethrow to handle upstream
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDirExists();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null; // Assuming sent in form data
    const directorateId = formData.get("directorateId") as string | null; // Assuming sent
    const month = formData.get("month") as string | null; // Assuming sent
    const year = formData.get("year") as string | null; // Assuming sent

    // --- Basic Validation ---
    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }
    if (!userId || !directorateId || !month || !year) {
      return NextResponse.json(
        { message: "Missing required metadata (userId, directorateId, month, year)" },
        { status: 400 }
      );
    }

    // --- File Handling ---
    const originalFilename = file.name;
    // Create a safe filename (e.g., timestamp + original name)
    const timestamp = Date.now();
    const safeFilename = `${timestamp}_${originalFilename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const filePath = path.join(UPLOAD_DIR, safeFilename);

    // Convert file to buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // --- Database Record Creation ---
    const createdFileRecord = await prisma.importedFile.create({
      data: {
        file_name: safeFilename, // Store the saved filename
        original_file_name: originalFilename,
        user_id: parseInt(userId, 10),
        directorate_id: parseInt(directorateId, 10),
        month: parseInt(month, 10),
        year: parseInt(year, 10),
        status: "Uploaded", // Initial status
        // upload_timestamp, created_at, updated_at are handled by Prisma defaults/triggers
      },
    });

    return NextResponse.json(
      { 
        message: "File uploaded successfully", 
        fileInfo: createdFileRecord 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("File upload error:", error);
    // Handle potential Prisma errors (e.g., invalid user/directorate ID)
    if (error instanceof Error && error.message.includes("Foreign key constraint failed")) {
        return NextResponse.json(
            { message: "Invalid user or directorate ID provided" },
            { status: 400 }
        );
    }
    // Handle potential parsing errors for IDs/month/year
    if (error instanceof TypeError || error instanceof SyntaxError) {
        return NextResponse.json(
            { message: "Invalid metadata format provided" },
            { status: 400 }
        );
    }
    return NextResponse.json(
      { message: "An internal server error occurred during file upload" },
      { status: 500 }
    );
  }
}

