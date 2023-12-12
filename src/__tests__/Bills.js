/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect';

import { screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills, billsFormated } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import BillsContainers from "../containers/Bills.js"


import router from "../app/Router.js";

import $ from 'jquery';
import 'bootstrap';

describe("Given I am connected as an employee", () => {
  describe("getBills method", () => {
    test("should return formatted bills from the store", async () => {

      const mockStore = {
        bills: jest.fn(() => ({
          list: jest.fn(() => Promise.resolve(bills))
        }))
      };

      const billsContainers = new BillsContainers({
        document: document,
        onNavigate: jest.fn(),
        store: mockStore,
        localStorage: localStorageMock
      });

      const result = await billsContainers.getBills();

      expect(result).toEqual(billsFormated);
    });
  });
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
      expect(windowIcon).toHaveClass('active-icon')

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const datesSorted = [...dates].sort((a, b) => new Date(a) - new Date(b));
      expect(dates).toEqual(datesSorted)
    })
    describe("I click on the visualization of the invoice proof", () => {
      test("Then the proof of the invoice is displayed", () => {

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        document.body.innerHTML = BillsUI({ data: bills[0] })
        const store = null
        const billsContainers = new BillsContainers({
          document, onNavigate, store, bills, localStorage: window.localStorage
        })

        const eye = screen.getByTestId('icon-eye')
        eye.addEventListener('click', billsContainers.handleClickIconEye(eye))
        userEvent.click(eye)


        const modale = screen.getByTestId('bill-proof-container')
        expect(modale).toBeTruthy()
        const billUrl = eye.getAttribute('data-bill-url');

        const imageModal = screen.getByTestId('imageModal')
        expect(decodeURIComponent(billUrl)).toEqual(decodeURIComponent(imageModal.src))
      });
    });
    describe("I click on the creation of the new bill", () => {
      test("Then the page of new bills is displayed", () => {

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }

        document.body.innerHTML = BillsUI({ data: bills });

        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }));

        const store = null;
        const billsContainers = new BillsContainers({
          document, onNavigate, store, bills, localStorage: window.localStorage
        });

        const btnNewBill = screen.getByTestId('btn-new-bill');
        expect(btnNewBill).toBeTruthy();

        jest.spyOn(billsContainers, 'handleClickNewBill').mockImplementation();

        btnNewBill.addEventListener('click', billsContainers.handleClickNewBill())
        userEvent.click(btnNewBill)

        expect(billsContainers.handleClickNewBill).toHaveBeenCalled()

        const formNewBill = screen.getByTestId('form-new-bill');
        expect(formNewBill).toBeTruthy();

      })
    });
  })
})
