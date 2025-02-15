// src/components/Counter.tsx

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  increment,
  decrement,
  incrementByAmount,
} from "../../slices/counter/counterSlice";

const Counter: React.FC = () => {
  // Access the Redux state
  const count = useSelector((state: RootState) => state.counter.value);

  // Get the dispatch function
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>
        Increment by 5
      </button>
    </div>
  );
};

export default Counter;
