/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { newBillFixture } from "../fixtures/newBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import store from "../app/Store.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"



const fieldsMapping = {
  'expense-type': 'type',
  'expense-name': 'nom',
  'datepicker': 'datepicker',
  'amount': 'amount',
  'vat': 'vat',
  'pct': 'pct',
  'file': 'file',
  'commentary': 'commentary'
};


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page, all fields are empty, and I submit the form", () => {
    test("Then I stay on the page creating a new expense report", () => {


      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      document.body.innerHTML = NewBillUI();
      const parser = new DOMParser();

      const dom = parser.parseFromString(document.body.innerHTML, 'text/html');

      const newbill = new NewBill({
        document: dom, onNavigate: onNavigate, store: store, localStorage: window.localStorage
      })

      const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
      const fileInput = {
        files: [file],
      };

      const e = {
        preventDefault: jest.fn(),
        target: {
          querySelector: jest.fn().mockImplementation((selector) => {
            if (selector === 'input[data-testid="file"]') {
              return fileInput;

            } else if (selector === 'select[data-testid="expense-type"]') {
              return { value: '' };
            } else if (selector === 'input[data-testid="expense-name"]') {
              return { value: '' };
            } else if (selector === 'input[data-testid="amount"]') {
              return { value: '' };
            } else if (selector === 'input[data-testid="datepicker"]') {
              return { value: '' };
            } else if (selector === 'input[data-testid="vat"]') {
              return { value: '' };
            } else if (selector === 'input[data-testid="pct"]') {
              return { value: '' };
            } else if (selector === 'textarea[data-testid="commentary"]') {
              return { value: '' };
            }
          }),
        },
      };

      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(newbill, 'updateBill').mockImplementation();
      jest.spyOn(newbill, 'onNavigate').mockImplementation();

      const boutonEnvoyee = screen.getByTestId("btn-send-bill")
      boutonEnvoyee.addEventListener("submit", () => newbill.handleSubmit(e))
      fireEvent.submit(boutonEnvoyee)
      expect(console.error).toHaveBeenCalled();
      expect(newbill.updateBill).not.toHaveBeenCalled();
      expect(newbill.onNavigate).not.toHaveBeenCalledWith(ROUTES_PATH['Bills']);

    });
  });
  describe("When I am on NewBill Page, At least one field is not filled in, and I submit the form", () => {
    test("Then I stay on the page creating a new expense report", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;


      const fields = ['expense-type', 'expense-name', 'datepicker', 'amount', 'vat', 'pct', 'file'];

      for (let i = 0; i < fields.length; i++) {
        for (let u = 0; u < fields.length; u++) {
          if (i === u) {
            const inputField = screen.getByTestId(fields[u]);
            fireEvent.change(inputField, { target: { value: '' } });
          } else {
            const inputField = screen.getByTestId(fields[u]);

            if (inputField.type === 'file') {
              const file = newBillFixture[fieldsMapping[fields[u]]]
              userEvent.upload(inputField, file);
              expect(inputField.files[0].name).toBe('fileLondres.png');
            }
            else {
              fireEvent.change(inputField, { target: { value: newBillFixture[fieldsMapping[fields[u]]] } });
            }
          }
        }

        const form = screen.getByTestId('form-new-bill');
        fireEvent.submit(form);

        expect(form).toBeInTheDocument();
      }
    });
    describe("When I am on NewBill Page, All fields are correctly filled in but the extension of my document is not a png or jpeg or jpg, and I submit the form", () => {
      test("Then I stay on the page creating a new expense report", () => {
        const html = NewBillUI();
        document.body.innerHTML = html;
        const fields = ['expense-type', 'expense-name', 'datepicker', 'amount', 'vat', 'pct', 'commentary'];
        for (let i = 0; i < fields.length; i++) {
          const inputField = screen.getByTestId(fields[i]);
          if (inputField.type === 'file') {
            const file = newBillFixture[fieldsMapping[fields[i]]]
            userEvent.upload(inputField, file);
            expect(inputField.files[0].name).toBe('fileLondres.png');
          }
          else {
            fireEvent.change(inputField, { target: { value: newBillFixture[fields[i]] } });
          }

        }

        const form = screen.getByTestId('form-new-bill');
        fireEvent.submit(form);

        expect(form).toBeInTheDocument();

      });
    });
  });
});
