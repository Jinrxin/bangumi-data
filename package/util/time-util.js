/**
 * 将 UTC 时间字符串转换为指定时区的时间字符串
 * @param utcDateString UTC 时间字符串
 * @param timeZone 目标时区字符串，例如 "Asia/Shanghai"、"Asia/Tokyo" 等
 * @returns 指定时区的时间字符串
 */
export function convertUTCtoTimeZone(utcDateString, timeZone) {
    // 创建一个日期对象，指定 UTC 时间
    const utcDate = new Date(utcDateString);

    // 创建一个日期格式化对象，指定目标时区
    const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
        timeZone: timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    // 格式化日期为目标时区时间字符串
    const timeString = dateFormatter.format(utcDate);

    return timeString;
}
