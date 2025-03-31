// tests/hooks/useMultiStepForm.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useMultiStepForm } from '../../src/hooks/useMultistepForm';
import React from 'react';

describe('useMultiStepForm', () => {
  const steps = [<div key="1">Step 1</div>, <div key="2">Step 2</div>];

  test('manages step navigation correctly', () => {
    const { result } = renderHook(() => useMultiStepForm(steps));
    
    expect(result.current.currentStepIndex).toBe(0);
    
    act(() => result.current.nextStep());
    expect(result.current.currentStepIndex).toBe(1);
    
    act(() => result.current.previousStep());
    expect(result.current.currentStepIndex).toBe(0);
  });

  test('does not go out of bounds', () => {
    const { result } = renderHook(() => useMultiStepForm(steps));
    
    act(() => result.current.previousStep());
    expect(result.current.currentStepIndex).toBe(0);
    
    act(() => result.current.nextStep());
    act(() => result.current.nextStep());
    expect(result.current.currentStepIndex).toBe(1);
  });
});