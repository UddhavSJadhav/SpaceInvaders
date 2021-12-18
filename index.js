document.addEventListener("DOMContentLoaded", () => {
  const squares = document.querySelectorAll("#main div");
  const displayResult = document.querySelector("#result");
  let width = 15;
  let currentShooterIndex = 202;
  let currentInvaderIndex = 0;
  let alienInvadersTakenDown = [];
  let result = 0;
  let direction = 1;
  let invaderId;

  //Adding alien invaders
  const alienInvaders = [
    0, 1, 3, 4, 5, 6, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 34, 35,
    39,
  ];

  //deploying aliens
  alienInvaders.forEach((alien) =>
    squares[currentInvaderIndex + alien].classList.add("invader")
  );

  //deploying shooter
  squares[currentShooterIndex].classList.add("shooter");

  //move Shooter
  function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter");
    switch (e.keyCode) {
      case 37:
        if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
        break;
      case 39:
        if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
        break;
    }
    squares[currentShooterIndex].classList.add("shooter");
  }
  document.addEventListener("keydown", moveShooter);

  function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge =
      alienInvaders[alienInvaders.length - 1] % width === width - 1;
    if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
      direction = width;
    } else if (direction === width) {
      if (leftEdge) direction = 1;
      else direction = -1;
    }
    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      squares[alienInvaders[i]].classList.remove("invader");
    }
    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      alienInvaders[i] += direction;
    }
    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      if (!alienInvadersTakenDown.includes(i)) {
        squares[alienInvaders[i]].classList.add("invader");
      }
    }
    //gameOver
    if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
      displayResult.textContent = "Game Over";
      squares[currentShooterIndex].classList.add("boom");
      clearInterval(invaderId);
    }

    for (let i = 0; i <= alienInvaders.length - 1; i++) {
      if (alienInvaders[i] > squares.length - (width - 1)) {
        displayResult.textContent = "Game Over";
        clearInterval(invaderId);
      }
    }

    if (alienInvadersTakenDown.length === alienInvaders.length) {
      displayResult.textContent = "You Win!!!";
      clearInterval(invaderId);
    }
  }
  invaderId = setInterval(moveInvaders, 500);

  //shooot aliens
  function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
      squares[currentLaserIndex].classList.remove("laser");
      currentLaserIndex -= width;
      squares[currentLaserIndex].classList.add("laser");
      if (squares[currentLaserIndex].classList.contains("invader")) {
        squares[currentLaserIndex].classList.remove("laser");
        squares[currentLaserIndex].classList.remove("invader");
        squares[currentLaserIndex].classList.add("boom");

        setTimeout(
          () => squares[currentLaserIndex].classList.remove("boom"),
          250
        );
        clearInterval(laserId);

        const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
        alienInvadersTakenDown.push(alienTakenDown);
        result++;
        displayResult.textContent = result;
      }

      if (currentLaserIndex < width) {
        clearInterval(laserId);
        setTimeout(
          () => squares[currentLaserIndex].classList.remove("laser"),
          100
        );
      }
    }

    switch (e.keyCode) {
      case 38:
        laserId = setInterval(moveLaser, 100);
    }
  }
  document.addEventListener("keyup", shoot);
});
