$(document).ready(function() {
    let minhasAlertas = JSON.parse(localStorage.getItem('notificacao'));
    preencherTabela(minhasAlertas);
});

function preencherTabela(minhasAlertas) {
    let tabela = $("table");
    minhasAlertas.forEach(mAlerta => {
        adicionarLinha(mAlerta, tabela);
    });
}

function adicionarLinha(mAlerta, tabela) {
    let tbody = tabela.find("tbody");
    let linha = $("<tr></tr>");

    $("<td></td>").text(mAlerta.descricao).appendTo(linha);
    $("<td></td>").text(mAlerta.valor).appendTo(linha);

    tbody.append(linha);
}