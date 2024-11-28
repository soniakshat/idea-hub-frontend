import React, { useEffect, useRef } from "react";
import { CountUp } from "countup.js";

interface CountUpOnLoadProps {
  value: number;
}

const CountUpOnLoad: React.FC<CountUpOnLoadProps> = ({ value }) => {
  const countUpRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (countUpRef.current) {
      const countUpInstance = new CountUp(countUpRef.current, value);
      if (!countUpInstance.error) {
        countUpInstance.start();
      } else {
        console.error(countUpInstance.error);
      }
    }
  }, []); // Empty dependency array ensures this runs only on mount

  return <span ref={countUpRef}>{value}</span>;
};

export default CountUpOnLoad;
