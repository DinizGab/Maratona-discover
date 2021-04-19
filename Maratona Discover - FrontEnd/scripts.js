// Criando uma funcionalidade em JS para abrir e fechar o modal (Um objeto)
const Modal = {                                                      // Const === cria uma constante (Não altera o resultado)
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

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,              // Não precisa da formatação do dinheiro, é possível fazer isso depois    
        date: '23/01/2021'
    },
    {
        id: 2,
        description: 'Criação Website',
        amount: 500000,                  
        date: '23/01/2021'
    },
    {
        id: 3,
        description: 'Internet',
        amount: -20000,                 
        date: '23/01/2021'
    },
    {
        id: 4,
        description: 'App',
        amount: 200000,                 
        date: '23/01/2021'
    }
]

const Transaction = {
    all: transactions,          // Refatorando o código para facilitar a utilização depois

    add(transaction){
        Transaction.all.push(transaction)
    },

    incomes() {                 // Para cada transação, pegar os amounts maiores que 0 e somar a uma variavel
        let income = 0;
        Transaction.all.forEach(transaction => {            // Arrow function
            if ( transactions.amount > 0 ) {
                income += transactions.amount; 
            }
        })
        return income;
    },

    expenses() {                // Para cada transação, pegar os amounts menores que 0 e somar a uma variavel
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if ( transactions.amount < 0 ) {
                expense += transactions.amount;
            }
        })
        return expense;
    },

    total() {                  // Total = Entradas - Saídas
        return Transaction.incomes() + Transaction.expenses();
    } 
}

const DOM = {                                                                // DOM não é uma palavra reservada do JS, então é possível usar como variáveis
    transactionsContainer: document.querySelector('#data-table tbody'),      // Transforma o tbody do HTML em um container para as transações (As transações serãp jogadas dentro do tbody)
    
    addTransaction(transaction, index) {                                     // Adiciona as transações
        const tr = document.createElement('tr')                              // Criará o elemento Tr para usar nas transações
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)                 // Substituirá o interior do tr com a transação dentro da função

        DOM.transactionsContainer.appendChild(tr)                                   // Adicionará as informações dentro da tabela
    },
    
    innerHTMLTransaction(transaction) {  
        const CSSclass = transaction.amount > 0 ? "income" : "expense"                // Usando um ternário
                                                                                      // Preciso pegar as informações da constante Transaction e jogar dentro da DOM para mudar as informações no site
        const amount = Utils.formatCurrency(transaction.amount)                       // Constante que tá capturando o resultado da função de formatação

        const html = `                                                                  
        <td class="description">${transaction.description}</td>                                 
        <td class=${CSSclass}>${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img src="./assets/minus.svg" alt="Remover Transação">
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
    }
}

transactions.forEach(function(transaction){
    DOM.addTransaction(transaction)              // Para cada transação dentro do array ele irá rodar essa função, rodando a função de adicionar a transação na DOM
}) 

DOM.updateBalance()