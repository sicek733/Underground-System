import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags } from 'discord.js';
import { createEmbed, errorEmbed, successEmbed } from '../utils/embeds.js';
import { createTicket, closeTicket, claimTicket, updateTicketPriority } from '../services/ticket.js';
import { getGuildConfig } from '../services/guildConfig.js';
import { logger } from '../utils/logger.js';
import { InteractionHelper } from '../utils/interactionHelper.js';
import { checkRateLimit } from '../utils/rateLimiter.js';
import { getTicketPermissionContext } from '../utils/ticketPermissions.js';

/* =========================
   🎯 CREATE TICKET (BUTTONS)
========================= */

async function openTicket(interaction, client, type) {
  try {
    const rateLimitKey = `${interaction.user.id}:create_ticket`;
    const allowed = await checkRateLimit(rateLimitKey, 3, 60000);

    if (!allowed) {
      return interaction.reply({
        embeds: [errorEmbed('Rate Limited', 'حاول بعد دقيقة')],
        flags: MessageFlags.Ephemeral
      });
    }

    const modal = new ModalBuilder()
      .setCustomId(`ticket_modal_${type}`)
      .setTitle('فتح تذكرة');

    const input = new TextInputBuilder()
      .setCustomId('reason')
      .setLabel('اكتب مشكلتك')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));

    await interaction.showModal(modal);
  } catch (err) {
    logger.error(err);
  }
}

/* =========================
   🎯 BUTTON HANDLERS
========================= */

export const ticket_tech = {
  name: 'ticket_tech',
  execute: (i, c) => openTicket(i, c, 'tech')
};

export const ticket_store = {
  name: 'ticket_store',
  execute: (i, c) => openTicket(i, c, 'store')
};

export const ticket_player = {
  name: 'ticket_player',
  execute: (i, c) => openTicket(i, c, 'player')
};

export const ticket_admin = {
  name: 'ticket_admin',
  execute: (i, c) => openTicket(i, c, 'admin')
};

export const ticket_unban = {
  name: 'ticket_unban',
  execute: (i, c) => openTicket(i, c, 'unban')
};

export const ticket_refund = {
  name: 'ticket_refund',
  execute: (i, c) => openTicket(i, c, 'refund')
};

export const ticket_high = {
  name: 'ticket_high',
  execute: (i, c) => openTicket(i, c, 'high')
};

export const ticket_creator = {
  name: 'ticket_creator',
  execute: (i, c) => openTicket(i, c, 'creator')
};

/* =========================
   🎯 MODAL (CREATE CHANNEL)
========================= */

export const ticket_modal_handler = {
  name: 'ticket_modal_tech', // بنمسك الكل تحت
  async execute(interaction, client) {
    try {
      await InteractionHelper.safeDefer(interaction, { flags: MessageFlags.Ephemeral });

      const type = interaction.customId.replace('ticket_modal_', '');
      const reason = interaction.fields.getTextInputValue('reason');

      const config = await getGuildConfig(client, interaction.guildId);

      const categoryId = config?.ticketCategoryId || null;

      const result = await createTicket(
        interaction.guild,
        interaction.member,
        categoryId,
        `(${type}) ${reason}`
      );

      if (result.success) {
        await interaction.editReply({
          embeds: [successEmbed('تم إنشاء التذكرة', `${result.channel}`)]
        });
      } else {
        await interaction.editReply({
          embeds: [errorEmbed('خطأ', result.error)]
        });
      }
    } catch (err) {
      logger.error(err);
    }
  }
};
