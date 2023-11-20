import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon))
    })
    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url")
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
    $('#modaleFile').modal('show')
  }

  getBills = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then(snapshot => {
          const bills = snapshot
            .map(doc => {
              try {
                return {
                  ...doc,
                  date: formatDate(doc.date),
                  status: formatStatus(doc.status)
                }
              } catch (e) {
                // if for some reason, corrupted data was introduced, we manage here failing formatDate function
                // log the error and return unformatted date in that case
                console.log(e, 'for', doc)
                return {
                  ...doc,
                  date: doc.date,
                  status: formatStatus(doc.status)
                }
              }
            })
          // Trier les factures par date de la plus récente à la moins récente
          const sortedBills = bills.sort((a, b) => {
            // Convertir les dates en chaînes au format "YY MM DD" pour la comparaison
            const formatDateForComparison = (dateString) => {
              const months = {
                'Jan.': '01',
                'Feb.': '02',
                'Mar.': '03',
                'Apr.': '04',
                'May': '05',
                'Jun.': '06',
                'Jul.': '07',
                'Aug.': '08',
                'Sep.': '09',
                'Oct.': '10',
                'Nov.': '11',
                'Dec.': '12',
              };

              const [day, month, year] = dateString.split(' ');

              return `${year} ${months[month]} ${day}`;
            };

            const dateA = formatDateForComparison(a.date);
            const dateB = formatDateForComparison(b.date);

            // Comparer les dates au format "YY MM DD"
            if (dateA < dateB) {
              return -1; // Retourner -1 pour indiquer que a doit venir avant b (inversé par rapport à avant)
            } else if (dateA > dateB) {
              return 1; // Retourner 1 pour indiquer que b doit venir avant a (inversé par rapport à avant)
            } else {
              return 0; // Les dates sont égales
            }
          });

          console.log(sortedBills);
          return sortedBills;

        })
    }
  }
}
