export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isCelebration: boolean;
  daysRemaining: number;
  effectiveTarget: Date;
};

function sameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function calendarDayInYear(date: Date, year: number): Date {
  return new Date(year, date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export function getEffectiveTargetDate(
  targetDate: Date,
  isRecurringYearly: boolean,
  now: Date = new Date(),
): Date {
  if (!isRecurringYearly) {
    return new Date(targetDate);
  }

  const thisYear = calendarDayInYear(targetDate, now.getFullYear());
  if (now.getTime() < thisYear.getTime()) {
    return thisYear;
  }
  if (sameCalendarDay(now, targetDate)) {
    return thisYear;
  }
  return calendarDayInYear(targetDate, now.getFullYear() + 1);
}

export function isBirthdayToday(
  targetDate: Date,
  isRecurringYearly: boolean,
  now: Date = new Date(),
): boolean {
  if (isRecurringYearly) {
    return sameCalendarDay(now, targetDate);
  }
  return sameCalendarDay(now, targetDate) && now >= targetDate;
}

export function getCountdownParts(
  targetDate: Date,
  isRecurringYearly: boolean,
  now: Date = new Date(),
): CountdownParts {
  const isCelebration = isBirthdayToday(targetDate, isRecurringYearly, now);

  if (isCelebration) {
    const nextTarget = isRecurringYearly
      ? calendarDayInYear(targetDate, now.getFullYear() + 1)
      : new Date(targetDate);
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isCelebration: true,
      daysRemaining: 0,
      effectiveTarget: nextTarget,
    };
  }

  const effectiveTarget = getEffectiveTargetDate(
    targetDate,
    isRecurringYearly,
    now,
  );
  const totalMs = Math.max(0, effectiveTarget.getTime() - now.getTime());

  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs,
    isCelebration: false,
    daysRemaining: days,
    effectiveTarget,
  };
}

export function padTwo(n: number): string {
  return n.toString().padStart(2, "0");
}

export function getMilestoneThreshold(
  daysRemaining: number,
): 30 | 7 | 3 | 1 | null {
  if (daysRemaining === 30) return 30;
  if (daysRemaining === 7) return 7;
  if (daysRemaining === 3) return 3;
  if (daysRemaining === 1) return 1;
  return null;
}
