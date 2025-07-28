// screenshot.js
import fs from "fs"
import path from "path"
import { Builder, By, until } from "selenium-webdriver"
import chrome from "selenium-webdriver/chrome.js"

const takeScreenshot = async (url, outputDir = "images") => {
  try {
    // Set up Chrome options
    const options = new chrome.Options()
    options.addArguments("--headless")
    options.addArguments("--disable-gpu")
    options.addArguments(`--window-size=1080,720`)

    // Enable verbose logging
    options.setLoggingPrefs({ browser: "ALL" })

    const service = new chrome.ServiceBuilder(`${process.env.HOME}/bin/chromedriver`)

    // Create a new instance of the Chrome driver
    const driver = await new Builder().forBrowser("chrome").setChromeService(service).setChromeOptions(options).build()

    driver
      .manage()
      .logs()
      .get("browser")
      .then((logs) => {
        logs.forEach((log) => {
          console.log(`${log.level.name}: ${log.message}`)
        })
      })

    // Navigate to the given URL
    await driver.get(url)

    // Wait for the page to load
    await driver.wait(until.elementLocated(By.css("body")), 1000)

    // Set the zoom level to 90%
    await driver.executeScript(`
      document.body.style.zoom='90%';
      document.getElementById("root").style.minHeight = "1080px"
      document.querySelector("#root>div").style.minHeight = "inherit"
    `)

    await driver.wait(until.elementLocated(By.css('[aria-label="Go full screen"]')), 1000)

    // Click the "Go full screen" button if it exists
    try {
      const fullscreenBtn = await driver.findElement(By.css('[aria-label="Go full screen"]'))
      await fullscreenBtn.click()
    } catch (e) {
      console.warn("Full screen button not found or could not be clicked.")
    }

    // Switch to the iframe
    await driver.switchTo().frame(driver.findElement(By.css("#storybook-preview-iframe")))

    // Wait for the iframe content to load
    await driver.wait(until.elementLocated(By.css(".sb-show-main")), 1000)

    // Capture the screenshot
    const screenshot = await driver.takeScreenshot()

    // Save the screenshot to a file
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14)
    const filename = `screenshot-${timestamp}.png`
    const filepath = path.join(outputDir, filename)
    fs.mkdirSync(path.dirname(filepath), { recursive: true })
    fs.writeFileSync(filepath, Buffer.from(screenshot, "base64"))

    console.log(`Screenshot saved to ${filepath}`)

    // Close the browser
    await driver.quit()

    return filepath
  } catch (error) {
    console.error("Error taking screenshot:", error)
    return null
  }
}

export default takeScreenshot
