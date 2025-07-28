// noti_message.js
import { Command } from "commander"
import dotenv from "dotenv"

import discordSender from "./lib/discord.js"
import mattermostSender from "./lib/mattermost.js"

dotenv.config()

const program = new Command()

program
  .requiredOption("-m, --message <message>", "Message to be sent")
  .option("-t, --target <target>", "Target platform (mattermost or discord)")
  .option("-u, --url <url>", "URL to capture screenshot")
  .option("-i, --image-dir <imageDir>", "Directory containing image files to be uploaded")

program.parse(process.argv)

const options = program.opts()

const main = async () => {
  try {
    options.message = options.message.replace(/\\n/g, "\n")
    switch (options.target) {
      case "mattermost":
        await mattermostSender(options)
        break
      case "discord":
        await discordSender(options)
        break
      default:
        console.error("Unsupported target:", options.target)
        process.exit(1)
    }
  } catch (error) {
    console.error("Error sending message:", error)
    process.exit(1)
  }
}

main()
