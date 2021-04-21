const Modal = {                                                             // Funcionalidades para a abertura do formulário
    open() {
        // Abrir o modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')                      // Procurar no documento todo o seletor que você quer
            .classList                                            // Chama a lista de classes do objeto chamado
            .add('active')                                        // Adiciona a class que está entre parênteses
    },
    close() {
        // Fechar o modal
        // Retirar a class active do modal
        document
            .querySelector('.modal-overlay')                      // Procurar no documento todo o seletor que você quer
            .classList
            .remove('active')                                     // Remove a class que está entre parênteses
    }
}

const Storage = {                                                           // Salvar as transações no local storage
    get() {                                                                                       // Pegar as transações 
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []                // O parse transforma de string para array ou ele irá retornar o array vazio caso o item não exista no localstorage
    },
    
    set(transactions) {                                                                           // Guardar as transações
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))           // Ele sempre guarda a string no local storage, então eu tenho que transformar o array transactions em uma string com o JSON.stringify
    }                          // Nome, valor
}

const Transaction = {                                                       // Funcionalidades das transações (remoção, adição, subtração...)
    all: Storage.get(),     

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {                                             // Função para remover a transação da lista
        Transaction.all.splice(index, 1)                        // Essa função funciona com base na posição das informações do array, o splice remove elementos do array
        
        App.reload()
    },

    incomes() {                                                 // Para cada transação, pegar os amounts maiores que 0 e somar a uma variavel
        let income = 0;
        Transaction.all.forEach(transaction => {            // Arrow function
            if ( transaction.amount > 0 ) {
                income += transaction.amount; 
            }
        })
        return income;
    },

    expenses() {                                                // Para cada transação, pegar os amounts menores que 0 e somar a uma variavel
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if ( transaction.amount < 0 ) {
                expense += transaction.amount;
            }
        })
        return expense;
    },

    total() {                                                   // Total = Entradas - Saídas
        return Transaction.incomes() + Transaction.expenses();
    } 
}

const DOM = {                                                               // Colocando as transações para aparecerem na tela no formato da lista
    transactionsContainer: document.querySelector('#data-table tbody'),      // Transforma o tbody do HTML em um container para as transações (As transações serãp jogadas dentro do tbody)
    
    addTransaction(transaction, index) {                                     // Adiciona as transações
        const tr = document.createElement('tr')                              // Criará o elemento Tr para usar nas transações
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)          // Substituirá o interior do tr com a transação dentro da função
        tr.dataset.index = index                                             // O index é a posição da transação no array

        DOM.transactionsContainer.appendChild(tr)                                   // Adicionará as informações dentro da tabela
    },
    
    innerHTMLTransaction(transaction, index) {  
        const CSSclass = transaction.amount > 0 ? "income" : "expense"                // Usando um ternário
                                                                                      // Preciso pegar as informações da constante Transaction e jogar dentro da DOM para mudar as informações no site
        const amount = Utils.formatCurrency(transaction.amount)                       // Constante que tá capturando o resultado da função de formatação

        const html = `                                                                  
        <td class="description">${transaction.description}</td>                                 
        <td class=${CSSclass}>${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
        </td>
        `                       // Essa função é quem irá alterar o HTML, essa é a base para a tabela
        return html             // É preciso usar o return para usar o resultado da função fora da função    
    },

    updateBalance() {           // Atualizando os cards, já formatando os números que aparecerão neles
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {                                                             // Formatando os números que aparecerão na tela
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""                         // Se o número for menor que zero ele recebe o negativo, senão ele não recebe nenhum sinal
    
        value = String(value).replace(/\D/g, "")                            // Procura tudo que é caractere diferente na string e transforma em outra coisa

        value = Number(value) / 100

        value = value.toLocaleString('pt-BR', {                             // Formatando o amount em formatação de moeda
            style: 'currency',
            currency: 'BRL'
        })
        
        return signal + value
    },

    formatAmount(value) {                                                   // Formatará o valor enviado pelo formulário
        value = value * 100

        return Math.round(value)
    },

    formatDate(date) {                                                       // Formatará o valor da data que chegará
        const splittedDate = date.split("-")                                 // Dividindo a data em partes para arrumar sua forma e jogará em um array
    
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`    // Formatando os dados do array no formato de data que eu quero
    },
}

const Form = {                                                              // Capturando as informações do formulário
    description: document.querySelector('input#description'),                    // Propriedades para capturar os dados
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {                                                           // Irá devolver um objeto com os valores dos campos
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {                                                      // 1 - Verificar os campos do formulário
        const { description, amount, date } = Form.getValues()              // Desconstruindo o objeto em 3 variáveis diferentes
        
        if ( description.trim() === "" ||
             amount.trim() === "" ||                                        // Irá comparar se o valor interno das variáveis são iguais ao vazio e se alguma for ele irá jogar um erro
             date.trim() === "" ) {
                 throw new Error("Por favor preencha todos os campos")
             }
    },

    formatValues() {                                                        // 2 - Formatar os dados
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)                                          // Preço formatado

        date = Utils.formatDate(date)                                                // Data formatada

        return {                                                                     // retornando os dados formatados de dentro da função
            description,
            amount,
            date
        }
    },

    clearFields() {                                                         // 4 - Apagar os dados antigos
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
       event.preventDefault()                                               // Interrompe o funcionamento padrão do evento de submit
        try {
            Form.validateFields()                                           // 1 - Validar os campos
            const transaction = Form.formatValues()                         // 2 - Formatar os dados
            Transaction.add(transaction)                                    // 3 - Salvar / Adicionar a transação
            Form.clearFields()                                              // 4 - Limpar os campos
            Modal.close()                                                   // 5 - Fechar o modal
        } catch (error) {
            alert(error.message)                                            // Se ele não conseguir fazer o evento anterior, ele joga esse erro
        }
    }
}

const App = {                                                               // Inicialização e atualização do aplicativo para atualização dos dados
    init() {                                             // Inicia a aplicação, populando ela com as informações já existentes
        Transaction.all.forEach(DOM.addTransaction)      // Usando a função para adicionar a transação como atalho para a adição de dados com o index, já que ela tinha os mesmos valores da função anterior a ela 

        DOM.updateBalance()                              // Atualiza os cartões
        
        Storage.set(Transaction.all)                     // Atualizando o localstorage
    },                 
    reload() {                                           // Reinicia a aplicação para popular ela com dados novos
        DOM.clearTransactions(),                         // Limpa toda a aplicação para poder popular ela com as informações apenas uma vez
        App.init()                                       // Inicia a aplicação novamente, para poder colocar novas informações computadas no modal
    }
}

App.init() 