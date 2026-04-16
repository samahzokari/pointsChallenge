function startGame() {
  showNickname();
}

function showNickname() {
  document.getElementById('screen-start').style.display = 'none';
  document.getElementById('screen-nickname').style.display = 'block';
  document.getElementById('nickname').focus();
}

function submitNickname() {
  const name = document.getElementById('nickname').value.trim();
  if (!name) {
    document.getElementById('error-msg').textContent = 'Please enter a nickname.';
    return;
  }
  // Proceed to the actual game here
  console.log('Nickname:', name);
}
