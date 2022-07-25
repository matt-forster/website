import { render, fireEvent } from 'solid-testing-library';

import { ParallaxMountainScene } from '.';

describe('<ParallaxMountainScene />', () => {
  test('it renders', () => {
    const { getByAltText, unmount } = render(() => <ParallaxMountainScene position={{x: 0, y: 0}} />);

    expect(getByAltText('Mountain Foreground')).toBeInTheDocument();
    expect(getByAltText('Mountain Background')).toBeInTheDocument();

    unmount();
  });

  // test('it will add a new todo', async () => {
  //   const { getByPlaceholderText, getByText, unmount } = render(() => <ParallaxMountainScene />);

  //   const input = getByPlaceholderText('new todo here') as HTMLInputElement;
  //   const button = getByText('Add Todo');
  //   input.value = 'test new todo';
  //   fireEvent.click(button as HTMLInputElement);
  //   expect(input.value).toBe('');
  //   expect(getByText(/test new todo/)).toBeInTheDocument();
  //   unmount();
  // });
  
  // test('it will mark a todo as completed', async () => {
  //   const { getByPlaceholderText, findByRole, getByText, unmount } = render(() => <ParallaxMountainScene />);

  //   const input = getByPlaceholderText('new todo here') as HTMLInputElement;
  //   const button = getByText('Add Todo') as HTMLButtonElement;
  //   input.value = 'mark new todo as completed';
  //   fireEvent.click(button);
  //   const completed = await findByRole('checkbox') as HTMLInputElement;
  //   expect(completed?.checked).toBe(false);
  //   fireEvent.click(completed);
  //   expect(completed?.checked).toBe(true);
  //   const text = getByText('mark new todo as completed') as HTMLSpanElement;
  //   expect(text).toHaveStyle({ 'text-decoration': 'line-through' });
  //   unmount();
  // });
});
