import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"


export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit.bind(this))
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }

  handleSubmit = async e => {
    e.preventDefault();

    const fileInput = e.target.querySelector(`input[data-testid="file"]`);
    const file = fileInput.files[0];

    const type = e.target.querySelector(`select[data-testid="expense-type"]`).value;
    const name = e.target.querySelector(`input[data-testid="expense-name"]`).value;
    const amount = parseInt(e.target.querySelector(`input[data-testid="amount"]`).value);
    const date = e.target.querySelector(`input[data-testid="datepicker"]`).value;
    const vat = e.target.querySelector(`input[data-testid="vat"]`).value;
    const pct = parseInt(e.target.querySelector(`input[data-testid="pct"]`).value);
    const commentary = e.target.querySelector(`textarea[data-testid="commentary"]`).value;

    if (!type || !name || isNaN(amount) || !date || !vat || !pct) {
      console.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }


    if (file) {
      const filePath = fileInput.value.split(/\\/g);
      this.fileName = filePath[filePath.length - 1];

      const formData = new FormData();
      const email = JSON.parse(localStorage.getItem("user")).email;
      formData.append('file', file);
      formData.append('email', email);

      try {

        const { fileUrl, key } = await this.store.bills().create({
          data: formData,
          headers: {
            noContentType: true
          }

        });

        console.log(this.billId)
        this.billId = key;
        this.fileUrl = fileUrl;


      } catch (error) {
        console.error(error);
      }
    }

    const email = JSON.parse(localStorage.getItem("user")).email;
    const bill = {
      email,
      type,
      name,
      amount,
      date,
      vat: vat,
      pct: pct,
      commentary: commentary,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    };

    this.updateBill(bill);
    this.onNavigate(ROUTES_PATH['Bills']);
  }

  // not need to cover this function by tests
  updateBill = async (bill) => {
    if (this.store) {
      try {
        await this.store.bills().update({ data: JSON.stringify(bill), selector: this.billId });
        this.onNavigate(ROUTES_PATH['Bills']);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
