export function checkWin(squares) {
  var check = [];
  for (let i = 0; i < 9; i++) {
    check.push(squares.slice(i * 9, i * 9 + 9));
  }
  for (let i = 0; i < 9; i++) {
    let array = []
    for (let j = 0; j < 9; j++) {
      array = array.concat(squares[j * 9 + i])
    }
    check.push(array);
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let array = []
      for (let k = 0; k < 3; k++) {
        for (let m = 0; m < 3; m++) {
          const index = (i * 3 + k) * 9 + (j * 3 + m);
          array = array.concat(squares[index]);
        }
      }
      check.push(array);
    }
  }
  for (const one of check) {
    for (let i = 1; i <= 9; i++) {
      if (!one.includes(i)) {
        return false;
      }
    }
  }
  return true;
}

export function getTimeString(startTime, timeSpent) {
  var time = new Date()
  time.setHours(startTime.hours + timeSpent.hours)
  time.setMinutes(startTime.minutes + timeSpent.minutes)
  time.setSeconds(startTime.seconds + timeSpent.seconds)
  const pad = (n) => {
    return n < 10 ? '0' + n : n;
  }
  return pad(time.getHours()) + ":" + pad(time.getMinutes()) + ":" + pad(time.getSeconds())
}

export function getTimeJson(time) {
  // time input has to be in the format "hh:mm:ss" 
  const timeArray = time.split(":");
  return ({
    hours: parseInt(timeArray[0]),
    minutes: parseInt(timeArray[1]),
    seconds: parseInt(timeArray[2])
  })
}