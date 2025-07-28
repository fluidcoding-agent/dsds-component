import { useEffect, useState } from "react"

export type PlatformType = "windows" | "macos" | "linux" | "ios" | "android" | "unknown"

export interface PlatformInfo {
  platform: PlatformType
  isWindows: boolean
  isMacOS: boolean
  isLinux: boolean
  isIOS: boolean
  isAndroid: boolean
  isMobile: boolean
  isDesktop: boolean
}

/**
 * Browser platform detection hook
 * @returns PlatformInfo object with platform type and boolean flags
 */
export function usePlatform(): PlatformInfo {
  const [platform, setPlatform] = useState<PlatformType>("unknown")

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return
    }

    const userAgent = navigator.userAgent.toLowerCase()
    const platform = navigator.platform?.toLowerCase() || ""

    let detectedPlatform: PlatformType = "unknown"

    // iOS detection
    if (/iphone|ipad|ipod/.test(userAgent) || (platform.includes("mac") && "ontouchend" in document)) {
      detectedPlatform = "ios"
    }
    // Android detection
    else if (/android/.test(userAgent)) {
      detectedPlatform = "android"
    }
    // Windows detection
    else if (/windows|win32|win64/.test(userAgent) || platform.includes("win")) {
      detectedPlatform = "windows"
    }
    // macOS detection
    else if (/macintosh|mac os x/.test(userAgent) || platform.includes("mac")) {
      detectedPlatform = "macos"
    }
    // Linux detection
    else if (/linux/.test(userAgent) || platform.includes("linux")) {
      detectedPlatform = "linux"
    }

    setPlatform(detectedPlatform)
  }, [])

  const isWindows = platform === "windows"
  const isMacOS = platform === "macos"
  const isLinux = platform === "linux"
  const isIOS = platform === "ios"
  const isAndroid = platform === "android"
  const isMobile = isIOS || isAndroid
  const isDesktop = isWindows || isMacOS || isLinux

  return {
    platform,
    isWindows,
    isMacOS,
    isLinux,
    isIOS,
    isAndroid,
    isMobile,
    isDesktop,
  }
}
