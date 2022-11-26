export const checkRole = (roles: Array<string>, userRoles: any) => {
    let authorized = false;
    roles.forEach((el: any, i: number) => {
        if (userRoles.cache.has(el)) {
            authorized = true;
            return;
        }
    })
    return authorized;
}