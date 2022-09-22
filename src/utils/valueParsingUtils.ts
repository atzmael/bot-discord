export const getUserById = (id: string) => {
    return id.match(/[0-9]+/) !== null ? id.match(/[0-9]+/)![0] : null;
}

export const isNumeric = (n: any) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export const sanitizeString = (str: string) => {
    str = str.replace(/[^a-zA-Z0-9áéíóúñü \.,_'#-]/gim, "");
    return str.trim();
}

export const slugifyString = (str: string) => {
    str = str.toLowerCase().replace(/[#]+/g, "");
    str = str.replace(/[ \s'"]+/g, "_");
    str = str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    return str.trim();
}

export const getFirstGroup = (regexp: RegExp, str: string) => {
    return Array.from(str.matchAll(regexp), (m: any) => m[1]);
}