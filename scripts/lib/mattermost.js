// mattermost.js
import fs from "fs"
import path from "path"
import axios from "axios"
import FormData from "form-data"
import https from 'https';

import takeScreenshot from "./screenshot.js"

const MATTERMOST_URL = process.env.MATTERMOST_URL
const MATTERMOST_ACCESS_TOKEN = process.env.MATTERMOST_ACCESS_TOKEN
const MATTERMOST_CHANNEL_ID = process.env.MATTERMOST_CHANNEL_ID

const insecureAxiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

const getMimetype = (ext) => {
  const mimeTypes = {
    ".svg": "image/svg+xml",
    ".png": "image/png",
  }
  return mimeTypes[ext.toLowerCase()] || ""
}

const uploadFiles = async (files) => {
  const fileUrlMap = {}

  const uploadPromises = files.map((file) => {
    const formData = new FormData()
    formData.append("files", file.data, file.filename)
    return insecureAxiosInstance.post(`${MATTERMOST_URL}/api/v4/files`, formData, {
      headers: {
        Authorization: `Bearer ${MATTERMOST_ACCESS_TOKEN}`,
        ...formData.getHeaders(),
      },
      params: { channel_id: MATTERMOST_CHANNEL_ID },
    })
  })

  const responses = await Promise.all(uploadPromises)
  responses.forEach((response, index) => {
    const fileInfo = response.data.file_infos[0]
    fileUrlMap[files[index].filename] = `/api/v4/files/${fileInfo.id}`
  })

  return fileUrlMap
}

const postMessage = async (message) => {
  await insecureAxiosInstance.post(
    `${MATTERMOST_URL}/api/v4/posts`,
    {
      channel_id: MATTERMOST_CHANNEL_ID,
      message,
    },
    {
      headers: {
        Authorization: `Bearer ${MATTERMOST_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  )
}

const mattermostSender = async (options) => {
  try {
    let message = options.message
    const files = []

    if (options.url) {
      const screenshotPath = await takeScreenshot(options.url, options.imageDir)
      if (!screenshotPath) {
        console.error("Failed to take screenshot. Exiting...")
        process.exit(1)
      }
      const screenshotBuffer = fs.readFileSync(screenshotPath)
      files.push({ filename: path.basename(screenshotPath), data: screenshotBuffer, mimetype: "image/png" })
    }

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

    if (files.length > 0) {
      const fileUrlMap = await uploadFiles(files)
      Object.keys(fileUrlMap).forEach((filename) => {
        message += `\n\n![Screenshot](${fileUrlMap[filename]})`
      })
    }

    await postMessage(message.trim())
  } catch (error) {
    console.error("Error sending message to Mattermost:", error)
    throw error
  }
}

export default mattermostSender
