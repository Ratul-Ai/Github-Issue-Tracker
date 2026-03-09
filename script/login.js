document.querySelectorAll(".no-space").forEach((e) => {
  e.addEventListener("input", function () {
    this.value = this.value.replace(/\s/g, "");
  });
});

document.getElementById("login-btn").addEventListener("click", function () {
  const user = document.getElementById("login-user");
  const password = document.getElementById("login-password");
  const errorMsg = document.getElementById("error-msg"); 

  errorMsg.classList.add("hidden"); 

  if (user.value !== "admin" || password.value !== "admin123") {
    errorMsg.classList.remove("hidden"); 
    return;
  }

  window.location.assign("./home.html");
  password.value = "";
});

document.getElementById("login-password").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("login-btn").click();
});
