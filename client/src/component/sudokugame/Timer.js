import React, { useEffect } from 'react'
import { useStopwatch } from 'react-timer-hook'

export const Timer = (props) => {
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    pause,
    reset,
  } = useStopwatch({ autoStart: true });

  useEffect(() => {
    if (props.win) {
      pause();
    }
  }, [props.win, pause])

  return (
    <div style={{ fontSize: '90px' }}>
      <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
    </div>
  );
}
