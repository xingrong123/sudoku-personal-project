import React, { useEffect } from 'react'
import { useStopwatch } from 'react-timer-hook'

export const Timer = (props) => {
  const {
    seconds,
    minutes,
    hours,
    pause,
    reset,
  } = useStopwatch({ autoStart: true });

  const setTime = props.setTime;

  useEffect(() => {
    setTime(hours, minutes, seconds)
  }, [hours, minutes, seconds, setTime])

  useEffect(() => {
    if (props.winState === true) {
      pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.winState])

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.startTime])

  return (
    <div style={{ fontSize: '90px' }}>
      <span>{props.startTime.hours + hours}</span>:<span>{props.startTime.minutes + minutes}</span>:<span>{props.startTime.seconds + seconds}</span>
    </div>
  );
}
