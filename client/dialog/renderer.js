const setButton = document.getElementById("btn");
const roomIdInput = document.getElementById("roomId");
setButton.addEventListener("click", () => {
  const roomId = roomIdInput.value;
  setButton.innerHTML = roomId;
  window.electronAPI.setroomId(roomId);
});
