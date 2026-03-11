module.exports = {
    command: "inspect",
    desc: "Check WhatsApp group or channel information using an invite link",
    category: "Utility",
    usage: ".inspect <group/channel link>",

    run: async ({ m, sock, args, xreply }) => {

        const text = args.join(" ").trim()

        if (!text) {
            return xreply(
                🔍 *INSPECT COMMAND*\n\n +
                Check information about a WhatsApp group or channel using a link.\n\n +
                Example:\n +
                .inspect https://chat.whatsapp.com/xxxx\n +
                .inspect https://whatsapp.com/channel/xxxx
            )
        }

        const groupPattern = /chat\.whatsapp\.com\/([\w\d]*)/
        const channelPattern = /whatsapp\.com\/channel\/([\w\d]*)/

        await m.react("🔍")

        try {

            if (groupPattern.test(text)) {

                const inviteCode = text.match(groupPattern)[1]
                const groupInfo = await sock.groupGetInviteInfo(inviteCode)

                let message =
                    📋 *GROUP INFORMATION*\n\n +
                    Name: ${groupInfo.subject}\n +
                    ID: ${groupInfo.id}\n +
                    Created: ${new Date(groupInfo.creation * 1000).toLocaleString()}\n

                if (groupInfo.owner) {
                    message += Creator: @${groupInfo.owner.split("@")[0]}\n
                }

                message +=
                    Restricted: ${groupInfo.restrict ? "Yes" : "No"}\n +
                    Announcement Only: ${groupInfo.announce ? "Yes" : "No"}\n +
                    Community: ${groupInfo.isCommunity ? "Yes" : "No"}\n +
                    Join Approval: ${groupInfo.joinApprovalMode ? "Yes" : "No"}\n +
                    Members: ${groupInfo.participants?.length || 0}\n\n

                if (groupInfo.desc) {
                    message += Description:\n${groupInfo.desc}\n\n
                }

                if (groupInfo.participants?.length > 0) {
                    const admins = groupInfo.participants.filter(p => p.admin)

                    if (admins.length > 0) {
                        message += Admins:\n
                        admins.forEach(a => {
                            message += - @${a.id.split("@")[0]} (${a.admin})\n
                        })
                    }
                }

                const mentions = []
                if (groupInfo.owner) mentions.push(groupInfo.owner)

                if (groupInfo.participants) {
                    groupInfo.participants
                        .filter(p => p.admin)
                        .forEach(a => mentions.push(a.id))
                }

                await m.react("✅")

                return sock.sendMessage(
                    m.chat,
                    { text: message, mentions },
                    { quoted: m }
                )

            }

            else if (channelPattern.test(text)) {

                const channelId = text.match(channelPattern)[1]
                const channelInfo = await sock.newsletterMsg(channelId)

                const message =
                   📺 *CHANNEL INFORMATION*\n\n` +
                    ID: ${channelInfo.id}\n +
                    State: ${channelInfo.state?.type || "-"}\n +
                    Name: ${channelInfo.thread_metadata?.name?.text || "-"}\n +
                    Created: ${new Date((channelInfo.thread_metadata?.creation_time || 0) * 1000).toLocaleString()}\n +
                    Subscribers: ${channelInfo.thread_metadata?.subscribers_count || 0}\n +
                    Verification: ${channelInfo.thread_metadata?.verification || "-"}\n\n +
                    Description:\n${channelInfo.thread_metadata?.description?.text || "No description"}

                await m.react("✅")

                return xreply(message)

            }

            else {
                return xreply("❌ Only WhatsApp Group or Channel links are supported.")
            }

        } catch (error) {

            await m.react("❌")

            if (error.data) {

                if ([400, 406].includes(error.data)) {
                    return xreply("❌ Group or channel not found.")
                }

                if (error.data === 401) {
                    return xreply("❌ The bot was removed from that group.")
                }

                if (error.data === 410) {
                    return xreply("❌ The group invite link has been reset.")
                }

            }

            return xreply(❌ Error: ${error.message})
        }
    }
}
