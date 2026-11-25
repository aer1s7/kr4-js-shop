let announcementTimer;

function announce(message, persistent = false) {
  const status = document.querySelector(".cart-msg");
  status.hidden = false;
  status.textContent = message;
  clearTimeout(announcementTimer);
  if (!persistent) {
    announcementTimer = setTimeout(() => {
      status.textContent = "";
      status.hidden = true;
    }, 6000);
  }
}
