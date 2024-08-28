const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",

  run: async (client, message) => {
    const ping = client.ws.ping
    const embed = new EmbedBuilder()
      .setTitle(`Latência:`)
      .setDescription(`A latência do WebSocket é de: \`${ping}ms\`!`)
      .setColor('Purple')
      // .setFooter({
      //   text: ``,
      //   iconURL: interaction.user.displayAvatarURL({ format: "png" })
      // });
    message.reply({ content: `${message.author}`, embeds: [embed] });

  }
}