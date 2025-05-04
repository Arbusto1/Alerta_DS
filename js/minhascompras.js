$(document).ready(function() {
    let minhasCompras = JSON.parse(localStorage.getItem('minhasCompras'));
    preencherTabela(minhasCompras);
});

function preencherTabela(minhasCompras) {
    let tabela = $("table");
    minhasCompras.forEach(mCompra => {
        adicionarLinha(mCompra, tabela);
    });
}

function adicionarLinha(mCompra, tabela) {
    let tbody = tabela.find("tbody");
    let linha = $("<tr></tr>");

    $("<td></td>").text(mCompra.descricao).appendTo(linha);
    $("<td></td>").text(mCompra.valor).appendTo(linha);

    tbody.append(linha);
}