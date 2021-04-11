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

