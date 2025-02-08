const form = document.querySelector("#account-update-form");
const accountForm = document.getElementById('account-update-form');
const input = document.getElementById('updated_email');
const originalValue = document.getElementById('original-email');

form.addEventListener("change", () => {
    const updateBtn = document.querySelector("button");
    updateBtn.removeAttribute("disabled");
});

input.addEventListener("change", () => {
    if (input.value != originalValue.value) {
    input.setAttribute("disabled", "disabled");
    }
})
