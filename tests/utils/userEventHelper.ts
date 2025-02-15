import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const clickButton = async (buttonName: string) => {
  await userEvent.click(screen.getByRole('button', { name: buttonName }));
};

export const typeIntoInput = async (label: string, value: string) => {
  await userEvent.type(screen.getByLabelText(label), value);
};
