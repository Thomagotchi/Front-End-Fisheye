export function displayContactModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";
  modal.style.position = "fixed";
}

export function closeContactModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
}
