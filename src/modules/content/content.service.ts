import { prisma } from "../../config/prisma.js";

const DEFAULT_ABOUT = {
  id: "default",
  title: "About Verigo Essential",
  description: "Apparel sourcing and export solutions for global brands.",
};

export const getStorefrontContent = async (): Promise<Record<string, string>> => {
  try {
    const about = await prisma.aboutPage.findUnique({
      where: { id: "default" },
      select: { whyChooseUs: true },
    });

    if (about?.whyChooseUs) {
      try {
        const parsed = JSON.parse(about.whyChooseUs);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed as Record<string, string>;
        }
      } catch {
        // not valid json
      }
    }
  } catch (error) {
    console.error("Failed to read storefront content:", error);
  }

  return {};
};

export const updateStorefrontContent = async (
  updates: Record<string, string>,
): Promise<Record<string, string>> => {
  const current = await getStorefrontContent();
  const merged = { ...current, ...updates };

  await prisma.aboutPage.upsert({
    where: { id: "default" },
    update: {
      whyChooseUs: JSON.stringify(merged),
    },
    create: {
      ...DEFAULT_ABOUT,
      whyChooseUs: JSON.stringify(merged),
    },
  });

  return merged;
};

