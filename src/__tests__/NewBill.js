/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { formulaire } from "../fixtures/formulaire.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../app/Store.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import router from "../app/Router.js";
import fetchMock from 'jest-fetch-mock';


const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname });
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
window.localStorage.setItem('user', JSON.stringify({
  type: 'Employee'
}));

function setupNewBill() {
  document.body.innerHTML = NewBillUI();
  const parser = new DOMParser();
  const dom = parser.parseFromString(document.body.innerHTML, 'text/html');
  const newbill = new NewBill({ document: dom, onNavigate: onNavigate, store: store, localStorage: window.localStorage });
  jest.spyOn(newbill, 'updateBill').mockImplementation();
  jest.spyOn(newbill, 'onNavigate').mockImplementation();
  return newbill;
}

function submitForm() {
  const boutonEnvoyee = screen.getByTestId("btn-send-bill");
  boutonEnvoyee.addEventListener("submit", () => {
    newbill.handleSubmit(formulaire.eventForm);
  });
  fireEvent.submit(boutonEnvoyee);
}

function simulationFetch(status = 200) {

  fetchMock.enableMocks();
  const mockResponse = { key: 'mockedKey', fileUrl: 'mockedFileUrl' };


  if (status !== 200) {
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status });
  } else {

    fetchMock.mockResponse(JSON.stringify(mockResponse));
  }
}

function updateBillANDonNavigateExpectNotCalled() {
  submitForm();

  expect(newbill.updateBill).not.toHaveBeenCalled();
  expect(newbill.onNavigate).not.toHaveBeenCalledWith(ROUTES_PATH['Bills']);

}

let newbill;

beforeEach(() => {
  jest.clearAllMocks()
  newbill = setupNewBill();
  jest.spyOn(console, 'error').mockImplementation(() => { });
});

afterEach(() => {
  console.error.mockRestore();
});

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then Newbill icon in vertical layout should be highlighted", () => {
      document.body.innerHTML = "";
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH['NewBill']);

      const iconMail = screen.getByTestId('icon-mail');
      expect(iconMail).toHaveClass('active-icon');
    });
  });
  describe("When I am on NewBill Page, all fields are empty, and I submit the form", () => {
    test("Then I stay on the page creating a new expense report", () => {
      document.body.innerHTML = NewBillUI();
      updateBillANDonNavigateExpectNotCalled();
    });
  });
  describe("When I am on NewBill Page, At least one field is not filled in, and I submit the form", () => {
    test("Then I stay on the page creating a new expense report", () => {
      formulaire.initFormulaireFileTypeEmpty();
      updateBillANDonNavigateExpectNotCalled();

      formulaire.initFormulaireFileNomEmpty();
      updateBillANDonNavigateExpectNotCalled();

      formulaire.initFormulaireFileDateEmpty();
      updateBillANDonNavigateExpectNotCalled();

      formulaire.initFormulaireFileAmountEmpty();
      updateBillANDonNavigateExpectNotCalled();

      formulaire.initFormulaireFilePctEmpty();
      updateBillANDonNavigateExpectNotCalled();

      formulaire.initFormulaireFileVatEmpty();
      updateBillANDonNavigateExpectNotCalled();
    });
  });
  describe("When I am on NewBill Page, All fields are correctly filled in but the extension of my document is not a png or jpeg or jpg, and I submit the form", () => {
    test("Then I stay on the page creating a new expense report", () => {
      formulaire.initFormulaireErrorExtension();
      updateBillANDonNavigateExpectNotCalled();
    });
  });
  describe("When I am on NewBill Page, All fields are correctly filled in but and the extension of my document is a png or jpeg or jpg, and I submit the form", () => {
    test("I validate my form but I have Error 404", async () => {
      formulaire.initFormulaireNoError();
      simulationFetch(404);

      submitForm();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(newbill.updateBill).not.toHaveBeenCalled();
      expect(newbill.onNavigate).not.toHaveBeenCalledWith(ROUTES_PATH['Bills']);

    });
    test("I validate my form but I have Error 505", async () => {
      formulaire.initFormulaireNoError();
      simulationFetch(505);

      submitForm();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(newbill.updateBill).not.toHaveBeenCalled();
      expect(newbill.onNavigate).not.toHaveBeenCalledWith(ROUTES_PATH['Bills']);

    });
    test("I validate my form and I return dashboard", async () => {
      formulaire.initFormulaireNoError();

      simulationFetch(200);

      submitForm();


      await new Promise((resolve) => setTimeout(resolve, 0));


      expect(newbill.updateBill).toHaveBeenCalled();
      expect(newbill.onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
    });

  });
});
