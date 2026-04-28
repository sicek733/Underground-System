import { ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getGuildConfig } from '../../services/guildConfig.js';

export default {
    id: 'ticket',

    async execute(interaction, client, args) {
        const type = args[0];
        const { guild, user } = interaction;

        const config = await getGuildConfig(client, guild.id);

        const channel = await guild.channels.create({
            name: `${type}-${user.username}`,
            type: ChannelType.GuildText,
            parent: config?.ticketCategoryId || null,
            topic: user.id,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: user.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                    ],
                },
                ...(config?.ticketStaffRoleId ? [{
                    id: config.ticketStaffRoleId,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                }] : [])
            ],
        });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`close:${channel.id}`)
                .setLabel('إغلاق التكت')
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId(`claim:${channel.id}`)
                .setLabel('استلام التكت')
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            content: `✅ تم فتح التكت: ${channel}`,
            ephemeral: true
        });

        await channel.send({
            content: `👋 أهلاً ${user}\n📌 نوع التذكرة: ${type}`,
            components: [row]
        });
    }
};
