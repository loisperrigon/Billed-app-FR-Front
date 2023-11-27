/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { handleClickIconEye } from "../containers/Bills.js"

const mockIcon = {
  getAttribute: jest.fn(),
};

import userEvent from '@testing-library/user-event';

import router from "../app/Router.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      screen.debug();

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const datesSorted = [...dates].sort((a, b) => new Date(a) - new Date(b));
      console.log(datesSorted);
      expect(dates).toEqual(datesSorted)
    })
    describe("I click on the visualization of the invoice proof", () => {
      test("Then the proof of the invoice is displayed", () => {
        document.body.innerHTML = BillsUI({ data: bills });


        const eyeIcons = screen.queryAllByTestId("icon-eye");


        expect(eyeIcons.length).toBeGreaterThan(0);

        eyeIcons[0].addEventListener('click', () => handleClickIconEye(eyeIcons[0]));
        userEvent.click(eyeIcons[0])


        expect(screen.getByTestId("bill-proof-container")).toBeTruthy();
      });
    });
    describe("I click on the creation of the new bill", () => {
      test("Then the page of new bills is displayed", () => {

      });
    });
  })
})
