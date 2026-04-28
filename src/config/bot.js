import { logger } from '../utils/logger.js';

export const botConfig = {

  presence: {
    status: "online",
    activities: [
      {
        name: "UG1 | FiveM Server",
        type: 0,
      },
    ],
  },

  commands: {
    owners: process.env.OWNER_IDS?.split(",") || [],
    defaultCooldown: 3,
    deleteCommands: false,
    testGuildId: process.env.TEST_GUILD_ID,
  },

  // =========================
  // 🎫 TICKET SYSTEM (UG1)
  // =========================
  tickets: {
    defaultCategory: "1497915076491870262",
    logChannel: "1498437284020748339",

    supportRoles: ["SUPPORT_ROLE_ID"],
    adminRoles: ["ADMIN_ROLE_ID"],

    // 🔥 أنواع التذاكر
    types: {
      tech: {
        label: "🔔 الدعم الفني",
        description: "مشاكل تقنية داخل السيرفر",
        emoji: "🔔",
        roles: ["SUPPORT_ROLE_ID"]
      },
      store: {
        label: "💚 تذكرة متجر",
        description: "مشاكل المتجر والشراء",
        emoji: "💚",
        roles: ["SUPPORT_ROLE_ID"]
      },
      player: {
        label: "🚨 شكوى على لاعب",
        description: "الإبلاغ عن لاعب",
        emoji: "🚨",
        roles: ["ADMIN_ROLE_ID"]
      },
      admin: {
        label: "🔵 شكوى على إداري",
        description: "شكوى ضد إداري",
        emoji: "🔵",
        roles: ["ADMIN_ROLE_ID"]
      },
      unban: {
        label: "🧾 طلب فك باند",
        description: "طلب إزالة الحظر",
        emoji: "🧾",
        roles: ["ADMIN_ROLE_ID"]
      },
      refund: {
        label: "💰 طلب تعويض",
        description: "طلب تعويض",
        emoji: "💰",
        roles: ["SUPPORT_ROLE_ID"]
      },
      high: {
        label: "👑 الإدارة العليا",
        description: "تواصل مع الإدارة العليا",
        emoji: "👑",
        roles: ["ADMIN_ROLE_ID"]
      },
      creator: {
        label: "🎬 صانع محتوى",
        description: "التقديم كصانع محتوى",
        emoji: "🎬",
        roles: ["ADMIN_ROLE_ID"]
      }
    },

    priorities: {
      none: { emoji: "⚪", color: "#95A5A6", label: "None" },
      low: { emoji: "🟢", color: "#2ECC71", label: "Low" },
      medium: { emoji: "🟡", color: "#F1C40F", label: "Medium" },
      high: { emoji: "🔴", color: "#E74C3C", label: "High" },
      urgent: { emoji: "🚨", color: "#E91E63", label: "Urgent" },
    },

    defaultPriority: "none",
    archiveCategory: null,
  },

  // =========================
  // 🎨 EMBEDS
  // =========================
  embeds: {
    colors: {
      primary: "#5865F2",
      success: "#57F287",
      error: "#ED4245",
      warning: "#FEE75C",
      info: "#3498DB",

      ticket: {
        open: "#57F287",
        closed: "#ED4245",
      }
    },
    footer: {
      text: "UG1 System",
      icon: null,
    },
  },

  // =========================
  // 🛠️ FEATURES
  // =========================
  features: {
    tickets: true,
    moderation: true,
    logging: true,
    welcome: true,
  },
};


// =========================
// VALIDATION
// =========================
export function validateConfig(config) {
  const errors = [];

  if (!process.env.DISCORD_TOKEN && !process.env.TOKEN) {
    errors.push("Bot token is required");
  }

  if (!process.env.CLIENT_ID) {
    errors.push("Client ID is required");
  }

  return errors;
}

const configErrors = validateConfig(botConfig);
if (configErrors.length > 0) {
  logger.error("Config errors:", configErrors.join("\n"));
}

export const BotConfig = botConfig;


// =========================
// 🎨 COLOR HELPERS
// =========================
export function getColor(path, fallback = "#99AAB5") {
  if (typeof path === "string" && path.startsWith("#")) {
    return parseInt(path.replace("#", ""), 16);
  }

  const result = path
    .split(".")
    .reduce((obj, key) => obj?.[key], botConfig.embeds.colors);

  if (!result) return parseInt(fallback.replace("#", ""), 16);

  return parseInt(result.replace("#", ""), 16);
}

export default botConfig;
