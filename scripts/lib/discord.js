// discord.js
import axios from "axios"
import FormData from "form-data"
import fs from "fs"
import path from "path"
import takeScreenshot from "./screenshot.js"
import https from 'https';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

const insecureAxiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

const getMimetype = (ext) => {
  const mimeTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
  }
  return mimeTypes[ext.toLowerCase()] || ""
}

const uploadFiles = async (files) => {
  const fileUrlMap = {}
  const formData = new FormData()

  files.forEach((file) => {
    formData.append("files", file.data, file.filename)
  })


  try {
    const response = await insecureAxiosInstance.post(DISCORD_WEBHOOK_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      params: { wait: true },
    })

    response.data.attachments.forEach((attachment, index) => {
      fileUrlMap[files[index].filename] = attachment.url
    })

    return fileUrlMap
  } catch (error) {
    console.error("Error uploading files to Discord:", error)
    throw error
  }
}

const discordSender = async (options) => {
  try {
    let message = options.message
    const files = []

    if (options.imageDir) {
      const imageDir = path.resolve(options.imageDir)
      if (!fs.existsSync(imageDir)) {
        console.log(`Image directory '${imageDir}' does not exist. Skipping file upload.`)
      } else {
        fs.readdirSync(imageDir)
          .map((file) => {
            const filePath = path.join(imageDir, file)
            const ext = path.extname(file)
            const mimetype = getMimetype(ext)
            if (mimetype) {
              const fileBuffer = fs.readFileSync(filePath)
              return { filename: file, data: fileBuffer, mimetype }
            }
            return null
          })
          .filter(Boolean)
          .forEach((file) => files.push(file))
      }
    }

    if (options.url) {
      // Screenshot logic remains the same as in mattermost.js
      const screenshotPath = await takeScreenshot(options.url, options.imageDir)
      if (!screenshotPath) {
        console.error("Failed to take screenshot. Exiting...")
        process.exit(1)
      }
      const screenshotBuffer = fs.readFileSync(screenshotPath)
      files.push({ filename: path.basename(screenshotPath), data: screenshotBuffer, mimetype: "image/png" })
    }

    const payload = { content: message }

    if (files.length > 0) {
      const fileUrlMap = await uploadFiles(files)
      /*
      Object.keys(fileUrlMap).forEach((filename) => {
        message += `\n\n${fileUrlMap[filename]}`
      })
      payload.content = message
      */
    }

    await insecureAxiosInstance.post(DISCORD_WEBHOOK_URL, payload)
    console.log("Message sent to Discord successfully.")
  } catch (error) {
    console.error("Error sending message to Discord:", error)
    throw error
  }
}

export default discordSender
