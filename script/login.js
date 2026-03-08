document.querySelectorAll(".no-space").forEach((e) => {
  e.addEventListener("input", function () {
    this.value = this.value.replace(/\s/g, "");
  });
});

document.getElementById("login-btn").addEventListener("click", function () {
  const user = document.getElementById("login-user");
  const password = document.getElementById("login-password");

  if (user.value !== "admin" || password.value !== "admin123") {
    document.getElementById("error-msg").classList.remove("hidden");
    return;
  }
  window.location.assign("/home.html");
  password.value = "";
});
