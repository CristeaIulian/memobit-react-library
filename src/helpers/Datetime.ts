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
