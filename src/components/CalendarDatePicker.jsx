import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  formatSelectedDate,
  toDateString,
  toLocalDate,
  WEEKDAYS,
} from "./calendarDateUtils";

export default function CalendarDatePicker({
  label,
  date,
  onDateChange,
  isOpen,
  onOpenChange,
  minDate = "",
  id,
  describedBy,
  portal = false,
}) {
  const pickerRef = useRef(null);
  const popoverRef = useRef(null);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const selectedDate = toLocalDate(date);
    const initialDate = selectedDate || new Date();
    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  });

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (
        !pickerRef.current?.contains(event.target) &&
        !popoverRef.current?.contains(event.target)
      ) {
        onOpenChange(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onOpenChange]);

  useLayoutEffect(() => {
    if (!isOpen || !portal) return undefined;

    const positionPopover = () => {
      const trigger = pickerRef.current?.querySelector("button");
      const popover = popoverRef.current;
      if (!trigger || !popover) return;

      const triggerRect = trigger.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();
      const bottomClearance = 16;
      const maxTop = window.innerHeight - bottomClearance - popoverRect.height;
      const top = Math.max(
        12,
        Math.min(triggerRect.bottom + 10, maxTop),
      );
      const left = Math.max(
        12,
        Math.min(triggerRect.left, window.innerWidth - popoverRect.width - 12),
      );

      popover.style.top = `${top}px`;
      popover.style.left = `${left}px`;
    };

    positionPopover();
    window.addEventListener("resize", positionPopover);
    window.addEventListener("scroll", positionPopover, true);
    return () => {
      window.removeEventListener("resize", positionPopover);
      window.removeEventListener("scroll", positionPopover, true);
    };
  }, [date, isOpen, portal, visibleMonth]);

  const changeMonth = (offset) => {
    setVisibleMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + offset, 1),
    );
  };

  const selectDate = (selectedDate) => {
    onDateChange(toDateString(selectedDate));
    setVisibleMonth(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
    );
    onOpenChange(false);
  };

  const toggleCalendar = () => {
    if (!isOpen) {
      const selectedDate = toLocalDate(date) || new Date();
      setVisibleMonth(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
      );
    }
    onOpenChange(!isOpen);
  };

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);
  const calendarStart = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1 - visibleMonth.getDay(),
  );
  const today = toDateString(new Date());
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const calendarDate = new Date(
      calendarStart.getFullYear(),
      calendarStart.getMonth(),
      calendarStart.getDate() + index,
    );
    return {
      date: calendarDate,
      dateString: toDateString(calendarDate),
      isCurrentMonth: calendarDate.getMonth() === visibleMonth.getMonth(),
    };
  });

  const popover = (
    <div
      aria-label={`${label} calendar`}
      className={`billing-picker-popover billing-calendar-popover${portal ? " rr-concierge-widget__calendar-popover" : ""}`}
      ref={popoverRef}
      role="dialog"
    >
      <div className="billing-calendar-heading">
        <div>
          <span className="billing-picker-eyebrow">SELECT DATE</span>
          <h3>{monthLabel}</h3>
        </div>
        <div className="billing-calendar-navigation">
          <button
            aria-label="Previous month"
            className="billing-calendar-nav"
            onClick={() => changeMonth(-1)}
            type="button"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            aria-label="Next month"
            className="billing-calendar-nav"
            onClick={() => changeMonth(1)}
            type="button"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
      <div className="billing-calendar-grid billing-calendar-weekdays">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>
      <div className="billing-calendar-grid">
        {calendarDays.map(
          ({ date: calendarDate, dateString, isCurrentMonth }) => {
            const isBeforeMinimum = minDate && dateString < minDate;
            return (
              <button
                aria-label={new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "full",
                }).format(calendarDate)}
                aria-pressed={date === dateString}
                className={[
                  "billing-calendar-day",
                  isCurrentMonth ? "" : "is-outside-month",
                  date === dateString ? "is-selected" : "",
                  today === dateString ? "is-today" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                disabled={isBeforeMinimum}
                key={dateString}
                onClick={() => selectDate(calendarDate)}
                type="button"
              >
                {calendarDate.getDate()}
              </button>
            );
          },
        )}
      </div>
      <div className="billing-calendar-footer">
        <button
          className="billing-picker-text-button"
          disabled={minDate > today}
          onClick={() => selectDate(new Date())}
          type="button"
        >
          Today
        </button>
        {date && (
          <button
            className="billing-picker-text-button"
            onClick={() => {
              onDateChange("");
              onOpenChange(false);
            }}
            type="button"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="billing-date-picker" ref={pickerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Choose ${label.toLowerCase()} date`}
        aria-required={Boolean(minDate)}
        className={`billing-datetime-trigger billing-date-trigger${isOpen ? " is-active" : ""}`}
        id={id}
        onClick={toggleCalendar}
        aria-describedby={describedBy}
        type="button"
      >
        <span className="material-symbols-outlined">calendar_month</span>
        <span className={date ? "" : "is-placeholder"}>
          {formatSelectedDate(date)}
        </span>
        <span className="material-symbols-outlined billing-picker-chevron">
          expand_more
        </span>
      </button>

      {isOpen && (portal ? createPortal(popover, document.body) : popover)}
    </div>
  );
}
