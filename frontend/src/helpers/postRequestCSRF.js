// finds the Django CSRF token from the cookies
const findCookie = name => {
    const cookies = document.cookie.split('=')
    let cookie = ''
    cookies.filter((el, i) => {
        if (el === name) {
            cookie = cookies[i + 1]
        }
    })
    return cookie
}

const findToken = () => {
    return findCookie('csrftoken')
}


export function PostRequestData() {
    return {
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
            'X-CSRFToken': findToken()
        },
    }
}