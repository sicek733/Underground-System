import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

async function openModal(interaction, type) {
  const modal = new ModalBuilder()
    .setCustomId(`ticket_modal:${type}`)
    .setTitle('فتح تذكرة');

  const input = new TextInputBuilder()
    .setCustomId('reason')
    .setLabel('اكتب مشكلتك')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  modal.addComponents(new ActionRowBuilder().addComponents(input));

  await interaction.showModal(modal);
}

export default [
  {
    name: 'ticket_tech',
    execute: (i) => openModal(i, 'tech')
  },
  {
    name: 'ticket_store',
    execute: (i) => openModal(i, 'store')
  },
  {
    name: 'ticket_player',
    execute: (i) => openModal(i, 'player')
  },
  {
    name: 'ticket_admin',
    execute: (i) => openModal(i, 'admin')
  },
  {
    name: 'ticket_unban',
    execute: (i) => openModal(i, 'unban')
  },
  {
    name: 'ticket_refund',
    execute: (i) => openModal(i, 'refund')
  },
  {
    name: 'ticket_high',
    execute: (i) => openModal(i, 'high')
  },
  {
    name: 'ticket_creator',
    execute: (i) => openModal(i, 'creator')
  }
];
