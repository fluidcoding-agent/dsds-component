import React, { useCallback, useEffect, useState } from "react"

import { cn } from "../../../lib/utils"

interface Position {
  x: number
  y: number
}

interface Direction {
  dx: number
  dy: number
}

interface CuteAnimalboxProps {
  className?: string
  animalType?: "dog" | "rabbit" | "cat"
  speed?: number
  containerWidth?: number
  containerHeight?: number
}

export const CuteAnimalbox: React.FC<CuteAnimalboxProps> = ({
  className,
  animalType = "dog",
  speed = 1,
  containerWidth = 200,
  containerHeight = 30,
}) => {
  const [position, setPosition] = useState<Position>({ x: 30, y: 5 })
  const [direction, setDirection] = useState<Direction>({ dx: 1, dy: 0.2 })
  const [isMoving, setIsMoving] = useState(true)
  const [facingDirection, setFacingDirection] = useState<"left" | "right">("right")

  // 동물별 이모지 및 색상 설정
  const animalConfig = {
    dog: { emoji: "🐕", color: "#8B4513" },
    rabbit: { emoji: "🐰", color: "#FFB6C1" },
    cat: { emoji: "🐱", color: "#D2691E" },
  }

  const currentAnimal = animalConfig[animalType]

  // 랜덤 방향 변경 함수
  const getRandomDirection = useCallback((): Direction => {
    const angle = Math.random() * 2 * Math.PI
    // 헤더에 맞게 수직 움직임을 제한
    const verticalLimit = 0.3
    return {
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed * verticalLimit,
    }
  }, [speed])

  // 움직임 로직
  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (!isMoving) return

      setPosition((prev) => {
        let newX = prev.x + direction.dx
        let newY = prev.y + direction.dy
        const newDirection = { ...direction }

        // 경계 충돌 감지 및 방향 반전
        if (newX <= 30 || newX >= containerWidth - 20) {
          newDirection.dx = -newDirection.dx
          newX = Math.max(0, Math.min(containerWidth - 20, newX))
        }

        if (newY <= 0 || newY >= containerHeight - 25) {
          newDirection.dy = -newDirection.dy
          newY = Math.max(0, Math.min(containerHeight - 25, newY))
        }

        // 방향 업데이트
        if (newDirection.dx !== direction.dx || newDirection.dy !== direction.dy) {
          setDirection(newDirection)
        }

        // 얼굴 방향 업데이트
        if (newDirection.dx > 0) {
          setFacingDirection("right")
        } else if (newDirection.dx < 0) {
          setFacingDirection("left")
        }

        return { x: newX, y: newY }
      })
    }, 50)

    return () => clearInterval(moveInterval)
  }, [direction, isMoving, containerWidth, containerHeight])

  // 랜덤 방향 변경
  useEffect(() => {
    const directionChangeInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        // 30% 확률로 방향 변경
        setDirection(getRandomDirection())
      }
    }, 2000)

    return () => clearInterval(directionChangeInterval)
  }, [getRandomDirection])

  // 잠시 멈춤 동작
  useEffect(() => {
    const pauseInterval = setInterval(() => {
      if (Math.random() < 0.2) {
        // 20% 확률로 잠시 멈춤
        setIsMoving(false)
        setTimeout(() => setIsMoving(true), 1000 + Math.random() * 2000)
      }
    }, 3000)

    return () => clearInterval(pauseInterval)
  }, [])

  return (
    <div
      className={cn(
        "relative mr-2 ml-1 overflow-hidden rounded-md border border-green-200 bg-gradient-to-r from-green-50 to-blue-50",
        className
      )}
      style={{ width: containerWidth, height: containerHeight }}
    >
      {/* 배경 장식 - 헤더에 맞게 작게 조정 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1 text-xl text-yellow-400">☀️</div>
        <div className="absolute top-0 right-1 text-xl text-blue-400">☁️</div>
        <div className="absolute bottom-1 left-8 text-xs text-green-400">🌱</div>
        <div className="absolute right-4 bottom-1 text-xs text-pink-400">🌸</div>
      </div>

      {/* 동물 캐릭터 */}
      <div
        className={cn("absolute transition-all duration-100 ease-linear", !isMoving && "animate-pulse")}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: facingDirection === "left" ? "scaleX(-1)" : "scaleX(1)",
        }}
      >
        <div className="relative">
          {/* 그림자 */}
          <div className="absolute top-4 left-1/2 h-1 w-3 -translate-x-1/2 transform rounded-full bg-black/20"></div>

          {/* 동물 이모지 - 헤더에 맞게 작게 조정 */}
          <div className="text-sm drop-shadow-sm filter">{currentAnimal.emoji}</div>

          {/* 움직임 표시 */}
          {isMoving && <div className="absolute -top-1 -right-1 text-xs opacity-60">💨</div>}
        </div>
      </div>
    </div>
  )
}
