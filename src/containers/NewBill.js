import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }
  handleChangeFile = e => {
    e.preventDefault()
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const filePath = e.target.value.split(/\\/g)
    const fileName = filePath[filePath.length - 1]
    const formData = new FormData()
    const email = JSON.parse(localStorage.getItem("user")).email
    formData.append('file', file)
    formData.append('email', email)

    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true
        }
      })
      .then(({ fileUrl, key }) => {
        console.log(fileUrl)
        this.billId = key
        this.fileUrl = fileUrl
        this.fileName = fileName
      }).catch(error => console.error(error))
  }

  handleSubmit = e => {
    e.preventDefault();
    // Récupération du fichier depuis le formulaire
    const fileInput = e.target.querySelector(`input[data-testid="file"]`);
    const file = fileInput.files[0];


    // Vérification de l'extension du fichier
    if (file) {
      const allowedExtensions = ['png', 'jpeg', 'jpg'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        // Afficher un message d'erreur ou prendre toute autre action nécessaire
        console.error('Le fichier doit avoir une extension PNG, JPEG ou JPG.');
        return;
      }
    }

    // Vérification des champs requis
    const type = e.target.querySelector(`select[data-testid="expense-type"]`).value;
    const name = e.target.querySelector(`input[data-testid="expense-name"]`).value;
    const amount = parseInt(e.target.querySelector(`input[data-testid="amount"]`).value);
    const date = e.target.querySelector(`input[data-testid="datepicker"]`).value;
    const vat = e.target.querySelector(`input[data-testid="vat"]`).value;
    const pct = parseInt(e.target.querySelector(`input[data-testid="pct"]`).value);

    if (!type || !name || isNaN(amount) || !date || !vat || !pct) {
      // Afficher un message d'erreur ou prendre toute autre action nécessaire
      console.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    // Reste du code pour gérer la soumission du formulaire si le fichier est correct
    const email = JSON.parse(localStorage.getItem("user")).email;
    const bill = {
      email,
      type,
      name,
      amount,
      date,
      vat: vat,
      pct: pct,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    };

    console.log('test')

    this.updateBill(bill);
    this.onNavigate(ROUTES_PATH['Bills']);
  }



  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH['Bills'])
        })
        .catch(error => console.error(error))
    }
  }
}