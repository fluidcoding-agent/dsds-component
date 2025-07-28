import { Command } from "commander"

import takeScreenshot from "./lib/screenshot.js"

const program = new Command()

program
  .requiredOption("-u, --url <url>", "URL to capture screenshot")
  .option("-o, --output-dir <outputDir>", "Directory to save screenshot", "images")

program.parse(process.argv)

const options = program.opts()

const main = async () => {
  const filepath = await takeScreenshot(options.url, options.outputDir)
  if (!filepath) {
    console.error("Failed to take screenshot.")
    process.exit(1)
  }
}

main()
