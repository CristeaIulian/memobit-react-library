export const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}min`;
};

/**
 * Converts seconds to a human-readable time format
 * @param seconds - The number of seconds to convert
 * @returns Formatted time string (e.g., "1:23:45" or "3:45")
 */
export const formatSecondsToMediaTime = (seconds: number | undefined): string => {
    if (seconds === undefined || seconds === null || isNaN(seconds)) {
        return '0:00';
    }

    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    // Format with leading zeros for minutes and seconds
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = secs.toString().padStart(2, '0');

    // If less than an hour, show m:ss format
    if (hours === 0) {
        return `${minutes}:${formattedSeconds}`;
    }

    // If an hour or more, show h:mm:ss format
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Formats a date according to the specified format string
 * Supported tokens: YYYY, MMM, MM, DD, HH, mm, ss
 */
export const formatDate = (date: Date, format: string): string => {
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const month = String(monthIndex + 1).padStart(2, '0');
    const monthName = MONTH_NAMES[monthIndex];
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', String(year))
        .replace('MMM', monthName)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
};

export const formatDateLocale = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US');
};

export const getTodayDateString = (): string => {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);

    return localDate.toISOString().slice(0, 10);
};

export const APP_DATE_FORMAT = 'DD MMM YYYY';
export const APP_DATE_TIME_FORMAT = 'DD MMM YYYY HH:mm';

export const formatAppDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return formatDate(new Date(year, month - 1, day), APP_DATE_FORMAT);
};

export const formatAppDateTime = (dateStr: string): string => {
    const d = new Date(dateStr.replace(' ', 'T'));
    if (isNaN(d.getTime())) return dateStr;
    return formatDate(d, APP_DATE_TIME_FORMAT);
};

export const formatRelativeDuration = (days: number): string => {
    const years = Math.floor(days / 365);
    const months = Math.round((days - years * 365) / 30);
    if (years > 0 && months > 0) return `${years}y ${months}m`;
    if (years > 0) return `${years}y`;
    return `${months}m`;
};

/**
 * Checks if two dates are the same day (ignoring time)
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};

/**
 * Checks if a date is within a range (inclusive)
 */
export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
    const dateTime = date.getTime();
    return dateTime >= start.getTime() && dateTime <= end.getTime();
};

/**
 * Gets the number of days in a specific month
 */
export const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

/**
 * Generates a matrix of dates for calendar display
 * Returns a 2D array where each sub-array represents a week
 */
export const getMonthMatrix = (year: number, month: number, firstDayOfWeek: 0 | 1 = 0): Date[][] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startDay = firstDay.getDay();
    // Adjust for firstDayOfWeek (0=Sunday, 1=Monday)
    if (firstDayOfWeek === 1) {
        startDay = startDay === 0 ? 6 : startDay - 1;
    }

    const weeks: Date[][] = [];
    let week: Date[] = [];

    // Fill in days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
        week.push(new Date(year, month - 1, prevMonthLastDay - i));
    }

    // Fill in days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        week.push(new Date(year, month, day));
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    }

    // Fill in days from next month
    if (week.length > 0) {
        const remainingDays = 7 - week.length;
        for (let day = 1; day <= remainingDays; day++) {
            week.push(new Date(year, month + 1, day));
        }
        weeks.push(week);
    }

    return weeks;
};

/**
 * Checks if a date is today
 */
export const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
};

/**
 * Checks if a date is a weekend (Saturday or Sunday)
 */
export const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
};

/**
 * Adds days to a date
 */
export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

/**
 * Adds months to a date
 */
export const addMonths = (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};

/**
 * Checks if date is before another date (ignoring time)
 */
export const isBefore = (date: Date, compareDate: Date): boolean => {
    const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const d2 = new Date(compareDate.getFullYear(), compareDate.getMonth(), compareDate.getDate());
    return d1.getTime() < d2.getTime();
};

/**
 * Checks if date is after another date (ignoring time)
 */
export const isAfter = (date: Date, compareDate: Date): boolean => {
    const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const d2 = new Date(compareDate.getFullYear(), compareDate.getMonth(), compareDate.getDate());
    return d1.getTime() > d2.getTime();
};

export const formatRelativeTime = (dateValue?: string): string | null => {
    if (!dateValue) {
        return null;
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const diffMs = date.getTime() - Date.now();
    const diffMinutes = Math.round(diffMs / 60000);

    if (Math.abs(diffMinutes) < 1) return 'just now';
    if (Math.abs(diffMinutes) < 60) return `${Math.abs(diffMinutes)}m ago`;

    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) return `${Math.abs(diffHours)}h ago`;

    const diffDays = Math.round(diffHours / 24);
    return `${Math.abs(diffDays)}d ago`;
};
