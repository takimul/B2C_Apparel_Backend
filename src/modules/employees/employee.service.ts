import { prisma } from "../../config/prisma.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinaryUpload.js";

export interface EmployeeProfile {
  name: string;
  role: string;
  badge?: string;
  bio: string;
  email: string;
  phone: string;
  linkedin: string;
  credentials: string[];
  imageUrl: string | null;
  imagePublicId: string | null;
}

const DEFAULT_EMPLOYEE: EmployeeProfile = {
  name: "Md. Managing Director",
  role: "Founder & Head of Global Sourcing",
  badge: "",
  bio: "With over a decade of hands-on experience across Bangladesh's premier apparel manufacturing units, I founded Verigo Essential to give global brands direct, transparent, and uncompromising access to quality garment production. We operate with zero intermediaries—giving your brand direct factory pricing, stringent multi-point quality audits, and clear, transparent timelines from sample development to final shipment.",
  email: "verigoessential@gmail.com",
  phone: "+880 1918-243120",
  linkedin: "https://linkedin.com",
  credentials: [
    "12+ Years Garment Industry Experience",
    "Direct Factory Partnerships Across Dhaka & Chittagong",
    "100% Pre-Shipment Quality Audits",
    "Full Compliance & Ethical Standards",
  ],
  imageUrl: null,
  imagePublicId: null,
};

export const getEmployeeProfile = async (): Promise<EmployeeProfile> => {
  try {
    const about = await prisma.aboutPage.findUnique({
      where: { id: "default" },
      select: { whyChooseUs: true, imageUrl: true, imagePublicId: true },
    });

    if (about?.whyChooseUs) {
      try {
        const parsed = JSON.parse(about.whyChooseUs);
        if (parsed?.employee && typeof parsed.employee === "object") {
          return {
            ...DEFAULT_EMPLOYEE,
            ...parsed.employee,
            imageUrl:
              parsed.employee.imageUrl || about.imageUrl || null,
            imagePublicId:
              parsed.employee.imagePublicId || about.imagePublicId || null,
          };
        }
      } catch {
        // not valid json
      }
    }

    if (about?.imageUrl) {
      return {
        ...DEFAULT_EMPLOYEE,
        imageUrl: about.imageUrl,
        imagePublicId: about.imagePublicId,
      };
    }
  } catch (error) {
    console.error("Failed to fetch employee profile:", error);
  }

  return DEFAULT_EMPLOYEE;
};

export const updateEmployeeProfile = async (
  updates: Partial<EmployeeProfile>,
): Promise<EmployeeProfile> => {
  const current = await getEmployeeProfile();
  const updated: EmployeeProfile = {
    ...current,
    ...updates,
  };

  const about = await prisma.aboutPage.findUnique({
    where: { id: "default" },
    select: { whyChooseUs: true },
  });

  let existingJson: Record<string, unknown> = {};
  if (about?.whyChooseUs) {
    try {
      existingJson = JSON.parse(about.whyChooseUs);
    } catch {
      existingJson = {};
    }
  }

  existingJson.employee = updated;

  await prisma.aboutPage.upsert({
    where: { id: "default" },
    update: {
      whyChooseUs: JSON.stringify(existingJson),
    },
    create: {
      id: "default",
      title: "About Verigo Essential",
      description: "Apparel sourcing and export solutions for global brands.",
      whyChooseUs: JSON.stringify(existingJson),
    },
  });

  return updated;
};

export const uploadEmployeeImage = async (
  file: Express.Multer.File,
): Promise<EmployeeProfile> => {
  const current = await getEmployeeProfile();

  const uploaded = await uploadToCloudinary(
    file.buffer,
    "verigo-essential/team",
  );

  if (current.imagePublicId) {
    try {
      await deleteFromCloudinary(current.imagePublicId);
    } catch (err) {
      console.error(
        "Failed to delete previous employee image from Cloudinary:",
        err,
      );
    }
  }

  // Also sync with AboutPage.imageUrl so about page image is consistent
  await prisma.aboutPage.upsert({
    where: { id: "default" },
    update: {
      imageUrl: uploaded.url,
      imagePublicId: uploaded.publicId,
    },
    create: {
      id: "default",
      title: "About Verigo Essential",
      description: "Apparel sourcing and export solutions for global brands.",
      imageUrl: uploaded.url,
      imagePublicId: uploaded.publicId,
    },
  });

  return updateEmployeeProfile({
    imageUrl: uploaded.url,
    imagePublicId: uploaded.publicId,
  });
};

export const deleteEmployeeImage = async (): Promise<EmployeeProfile> => {
  const current = await getEmployeeProfile();

  if (current.imagePublicId) {
    try {
      await deleteFromCloudinary(current.imagePublicId);
    } catch (err) {
      console.error("Failed to delete employee image from Cloudinary:", err);
    }
  }

  return updateEmployeeProfile({
    imageUrl: null,
    imagePublicId: null,
  });
};

