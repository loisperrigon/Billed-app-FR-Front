/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { formulaire } from "../fixtures/formulaire.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import store from "../app/Store.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"


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

function spyOnUpdateAndonNavigateAndSubmit() {
  jest.spyOn(newbill, 'updateBill').mockImplementation();
  jest.spyOn(newbill, 'onNavigate').mockImplementation();

  const boutonEnvoyee = screen.getByTestId("btn-send-bill")
  boutonEnvoyee.addEventListener("submit", () => newbill.handleSubmit(formulaire.eventForm))
  fireEvent.submit(boutonEnvoyee)
}

function spyOnAndExpectCalled() {
  spyOnUpdateAndonNavigateAndSubmit();
  expect(newbill.updateBill).toHaveBeenCalled();
  expect(newbill.onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
}

function spyOnAndExpectnotCalled() {

  spyOnUpdateAndonNavigateAndSubmit();

  expect(newbill.updateBill).not.toHaveBeenCalled();
  expect(newbill.onNavigate).not.toHaveBeenCalledWith(ROUTES_PATH['Bills']);
}

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page, all fields are empty, and I submit the form", () => {
    test("Then I stay on the page creating a new expense report", () => {
      spyOnAndExpectnotCalled();

    });
  });
  describe("When I am on NewBill Page, At least one field is not filled in, and I submit the form", () => {
    test("Then I stay on the page creating a new expense report", () => {
      formulaire.initFormulaireFileTypeEmpty();
      spyOnAndExpectnotCalled();

      formulaire.initFormulaireFileNomEmpty();
      spyOnAndExpectnotCalled();

      formulaire.initFormulaireFileDateEmpty();
      spyOnAndExpectnotCalled();

      formulaire.initFormulaireFileAmountEmpty();
      spyOnAndExpectnotCalled();

      formulaire.initFormulaireFilePctEmpty();
      spyOnAndExpectnotCalled();

      formulaire.initFormulaireFileVatEmpty();
      spyOnAndExpectnotCalled();

    });
  });
  describe("When I am on NewBill Page, All fields are correctly filled in but the extension of my document is not a png or jpeg or jpg, and I submit the form", () => {
    test("Then I stay on the page creating a new expense report", () => {

      formulaire.initFormulaireErrorExtension();
      spyOnAndExpectnotCalled();

    });
  });
  describe("When I am on NewBill Page, All fields are correctly filled in but and the extension of my document is a png or jpeg or jpg, and I submit the form", () => {
    test("I valid my form and return ", () => {
      formulaire.initFormulaireNoError();
      spyOnAndExpectCalled();

    });
  });
});

