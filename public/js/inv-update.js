const form = document.querySelector("#inventory-form");
form.addEventListener("change", () => {
    const updateBtn = document.querySelector("button");
    updateBtn.removeAttribute("disabled");
});
