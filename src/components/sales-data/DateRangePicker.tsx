
import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { ja } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  className?: string
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "yyyy/MM/dd", { locale: ja })} -{" "}
                  {format(date.to, "yyyy/MM/dd", { locale: ja })}
                </>
              ) : (
                format(date.from, "yyyy/MM/dd", { locale: ja })
              )
            ) : (
              <span>期間を選択</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            locale={ja}
          />
          <div className="flex justify-between p-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange({
                from: new Date(new Date().setDate(new Date().getDate() - 7)),
                to: new Date(),
              })}
            >
              直近7日間
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange({
                from: new Date(new Date().setDate(new Date().getDate() - 30)),
                to: new Date(),
              })}
            >
              直近30日間
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange({
                from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
                to: new Date(),
              })}
            >
              直近3ヶ月
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
