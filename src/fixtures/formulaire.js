export let formulaire =
{
    type: "",
    nom: "",
    datepicker: "",
    amount: '',
    pct: '',
    vat: '',
    file: { files: [] },
    commentary: "",

    eventForm: {
        preventDefault: jest.fn(),
        target: {
            querySelector: jest.fn().mockImplementation((selector) => {
                if (selector === 'select[data-testid="expense-type"]') {
                    return { value: formulaire.type };
                } else if (selector === 'input[data-testid="expense-name"]') {
                    return { value: formulaire.nom };
                } else if (selector === 'input[data-testid="datepicker"]') {
                    return { value: formulaire.datepicker };
                } else if (selector === 'input[data-testid="amount"]') {
                    return { value: formulaire.amount };
                } else if (selector === 'input[data-testid="vat"]') {
                    return { value: formulaire.vat };
                } else if (selector === 'input[data-testid="pct"]') {
                    return { value: formulaire.pct };
                } else if (selector === 'textarea[data-testid="commentary"]') {
                    return { value: formulaire.commentary };
                } else if (selector === 'input[data-testid="file"]') {
                    return formulaire.file;
                }
            }),
        },
    },

    initFormulaireVide: function () {
        this.type = "";  // Remplacez ces valeurs par les valeurs initiales souhaitées
        this.nom = "";
        this.datepicker = "";
        this.amount = "";
        this.pct = "";
        this.vat = "";
        this.file = { files: [] }; // Réinitialiser les fichiers si nécessaire
        this.commentary = "";
    },

    initFormulaireFileTypeEmpty: function () {
        this.type = "",
            this.nom = "Train Lyon",
            this.datepicker = "20/03/2023", this.amount = 45,
            this.pct = 70,
            this.vat = 30,
            this.file = { files: [new File(['(⌐□_□)'], 'facture.png', { type: 'image/png' })] },
            this.commentary = "Merci"

    },
    initFormulaireFileNomEmpty: function () {
        this.type = "Transport",
            this.nom = "",
            this.datepicker = "20/03/2023", this.amount = 45,
            this.pct = 70,
            this.vat = 30,
            this.file = { files: [new File(['(⌐□_□)'], 'facture.png', { type: 'image/png' })] },
            this.commentary = "Merci"

    },
    initFormulaireFileDateEmpty: function () {
        this.type = "Transport",
            this.nom = "Train Lyon",
            this.datepicker = "",
            this.amount = 45,
            this.pct = 70,
            this.vat = 30,
            this.file = { files: [new File(['(⌐□_□)'], 'facture.png', { type: 'image/png' })] },
            this.commentary = "Merci"

    },

    initFormulaireFileAmountEmpty: function () {
        this.type = "Transport",
            this.nom = "Train Lyon",
            this.datepicker = "20/03/2023",
            this.amount = "",
            this.pct = 70,
            this.vat = 30,
            this.file = { files: [new File(['(⌐□_□)'], 'facture.png', { type: 'image/png' })] },
            this.commentary = "Merci"

    },

    initFormulaireFilePctEmpty: function () {
        this.type = "Transport",
            this.nom = "Train Lyon",
            this.datepicker = "20/03/2023",
            this.amount = 45,
            this.pct = "",
            this.vat = 30,
            this.file = { files: [new File(['(⌐□_□)'], 'facture.png', { type: 'image/png' })] },
            this.commentary = "Merci"

    },

    initFormulaireFileVatEmpty: function () {
        this.type = "Transport",
            this.nom = "Train Lyon",
            this.datepicker = "20/03/2023",
            this.amount = 45,
            this.pct = 70,
            this.vat = "",
            this.file = { files: [new File(['(⌐□_□)'], 'facture.png', { type: 'image/png' })] },
            this.commentary = "Merci"

    },


    initFormulaireErrorExtension: function () {
        this.type = "Transport",
            this.nom = "Train Lyon",
            this.datepicker = "20/03/2023",
            this.amount = 45,
            this.pct = 70,
            this.vat = 30,
            this.file = { files: [new File(['(⌐□_□)'], 'facture.txt', { type: 'text/plain' })] },
            this.commentary = "Merci"

    },

    initFormulaireNoError: function () {
        this.type = "Transport",
            this.nom = "Train Lyon",
            this.datepicker = "20/03/2023",
            this.amount = 45,
            this.pct = 70,
            this.vat = 30,
            this.file = { files: [new File(['(⌐□_□)'], 'facture.png', { type: 'image/png' })] },
            this.commentary = "Merci"

    }

}
