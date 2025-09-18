const notificationBox = document.getElementById('notification-box');

/*
 *
 * Hiển thị một thông báo tạm thời cho người dùng.
 * 
 */
export const showNotification = (message, isNotif = true) => {
    notificationBox.innerHTML = message;

    if (!isNotif)
        notificationBox.style.backgroundColor = "#f44336";
    else
        notificationBox.style.backgroundColor = "#2196f3";

    setTimeout(() => {
        notificationBox.classList.add('visible');
    }, 10);
    setTimeout(() => {
        notificationBox.classList.remove('visible');
    }, 3000);

};
