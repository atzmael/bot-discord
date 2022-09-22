export const getWeekNumber = (currentDate: any) => {
    const startDate: any = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

    return Math.ceil(days / 7);
}

export const getDayBetweenTwoDates = (date1: Date, date2: Date) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    return Math.floor((utc2 - utc1) / msPerDay);
}

export const getFullDate = (date: Date, sep = "/") => {
    return `${date.getDate()}${sep}${date.getMonth()}${sep}${date.getFullYear()}`
}