const nameInput = document.getElementById("nameInput");
const confirmButton = document.getElementById("confirmButton");
const inputBox = document.getElementById("inputBox");
const welcomeBox = document.getElementById("welcomeBox");
const welcomeMessage = document.getElementById("welcomeMessage");

nameInput.addEventListener("input", () => {
    if (nameInput.value.trim() !== "") {
        confirmButton.classList.add("active");
        confirmButton.disabled = false;
    } else {
        confirmButton.classList.remove("active");
        confirmButton.disabled = true;
    }
});

confirmButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (name) {
        localStorage.setItem("username", name);
        inputBox.style.display = "none";
        welcomeMessage.textContent = `Добро пожаловать, ${name}!`;
        welcomeBox.style.display = "block";
    }
});
