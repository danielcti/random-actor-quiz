import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

test("renders the home page", () => {
    render(<App />);
    const title = screen.getByText(/Random Actor Quiz/i);

    expect(title).toBeInTheDocument();
});

test(`should render 5 actors name in the home page`, async () => {
    render(<App />);
    await waitFor(() => {
        const element = screen.getByTestId("actors-list");
        expect(element.children.length).toEqual(5);
    }, { timeout: 3000 });
});

// test(`should filter the pokemons list to show only 'bu' occurrences(2 cases)`, async () => {
//   render(<Home />);
//   await waitFor(() => {
//     const element = screen.getByTestId("pokemon-list");
//     expect(element.children.length).toEqual(50);
//   });
//   const input = screen.getByTestId("input");
//   await fireEvent.change(input, { target: { value: 'bu' } })
//   const elements = screen.getByTestId("pokemon-list");
//   expect(elements.children.length).toEqual(2);
// });

// test(`should filter the pokemons list to show only 'xxx' occurrences(0 cases)`, async () => {
//   render(<Home />);
//   await waitFor(() => {
//     const element = screen.getByTestId("pokemon-list");
//     expect(element.children.length).toEqual(50);
//   });
//   const input = screen.getByTestId("input");
//   await fireEvent.change(input, { target: { value: 'xxx' } })
//   const elements = screen.getByTestId("pokemon-list");
//   expect(elements.children.length).toEqual(0);
// });