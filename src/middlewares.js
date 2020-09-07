export const isAuthenticated = (request) => {
    if(request.user) {

    } else {
        throw Error("You need to login.")
        return;
    }
}
