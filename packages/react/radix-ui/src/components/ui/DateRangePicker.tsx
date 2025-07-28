import { useEffect, useState } from "react"
import { addMonths, differenceInDays, isAfter, isBefore } from "date-fns"
import { DateRange, DayPicker } from "react-day-picker"

import "react-day-picker/dist/style.css"

import { cn } from "@/lib/utils"

export interface DateRangePickerProps {
  /**
   * 초기 날짜 범위를 설정합니다.
   * @default undefined
   */
  initialRange?: DateRange

  /**
   * 날짜 범위가 변경될 때 호출되는 콜백 함수입니다.
   * @param range 선택된 날짜 범위
   */
  onChange?: (range: DateRange | undefined) => void

  /**
   * 외부에서 제어하는 날짜 범위 값입니다.
   * 이 값이 제공되면 controlled 모드로 동작합니다.
   */
  value?: DateRange

  /**
   * 커스텀 클래스명을 적용합니다.
   */
  className?: string

  /**
   * 선택 가능한 최대 일수를 설정합니다.
   * @default 60 (2개월)
   */
  maxDays?: number

  /**
   * 시작 날짜를 제한합니다.
   * @default new Date() (오늘)
   */
  fromDate?: Date

  /**
   * 종료 날짜를 제한합니다.
   * @default 오늘로부터 2개월 후
   */
  toDate?: Date
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  initialRange,
  onChange,
  value,
  className,
  maxDays = 60,
  fromDate,
  toDate,
}) => {
  const today = new Date() // 베이스 타임 기준: 2025-06-28 (현재: 2025-07-15)
  const defaultFromDate = fromDate ?? today
  const defaultToDate = toDate ?? addMonths(today, 2)

  // Controlled vs Uncontrolled 모드 처리
  const [internalRange, setInternalRange] = useState<DateRange | undefined>(initialRange)

  const currentRange = value ?? internalRange

  useEffect(() => {
    // initialRange가 변경되면 내부 상태 업데이트 (uncontrolled 모드에서만)
    if (initialRange && !value) {
      setInternalRange(initialRange)
    }
  }, [initialRange, value])

  const handleSelect = (selectedRange: DateRange | undefined) => {
    // 범위 검증 로직
    if (selectedRange?.from && selectedRange?.to) {
      const daysDiff = differenceInDays(selectedRange.to, selectedRange.from)

      // 최대 일수 초과 검사
      if (daysDiff > maxDays) {
        return // 선택 무시
      }

      // 날짜 범위 초과 검사
      if (isAfter(selectedRange.to, defaultToDate) || isBefore(selectedRange.from, defaultFromDate)) {
        return // 선택 무시
      }
    }

    // Controlled 모드가 아닌 경우에만 내부 상태 업데이트
    if (!value) {
      setInternalRange(selectedRange)
    }

    // 외부 콜백 호출
    onChange?.(selectedRange)
  }

  return (
    <div className={cn("date-range-picker rounded-sm bg-white p-4 shadow-md", className)}>
      <DayPicker
        mode="range"
        numberOfMonths={2}
        selected={currentRange}
        onSelect={handleSelect}
        fromDate={defaultFromDate}
        toDate={defaultToDate}
        disabled={(date) => isBefore(date, defaultFromDate) || isAfter(date, defaultToDate)}
        className={cn("")}
        classNames={{
          months: "flex flex-row space-x-4",
          day: cn("p-2 rounded"),
          day_selected: "bg-blue-500 text-white",
          day_range_start: "bg-blue-600 text-white rounded-l rounded-full",
          day_range_end: "bg-blue-600 text-white rounded-r",
          day_range_middle: "bg-blue-100",
          caption: "text-lg font-bold",
        }}
      />

      <p className="mt-4 text-center font-sans">
        {/* 선택된 범위 표시 */}
        {currentRange?.from && currentRange?.to && (
          <>
            선택 범위: {currentRange.from.toLocaleDateString()} ~ {currentRange.to.toLocaleDateString()}{" "}
            <span className="text-gray-500">(총 {differenceInDays(currentRange.to, currentRange.from) + 1}일)</span>
          </>
        )}
        {/* 범위 선택 중일 때 표시 */}
        {!currentRange?.from && <span className="text-blue-600">시작 날짜를 선택해주세요</span>}
        {currentRange?.from && !currentRange?.to && <span className="text-blue-600">종료 날짜를 선택해주세요</span>}
      </p>
    </div>
  )
}

export default DateRangePicker
