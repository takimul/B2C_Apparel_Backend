import { Readable } from "node:stream";

import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
): Promise<{
  url: string;
  publicId: string;
}> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,

        resource_type: "image",

        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },

      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));

          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};
