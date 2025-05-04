$(document).ready(function () {
    if(!localStorage.notificacao) {
        let notificacao = [];
        localStorage.setItem('notificacao', JSON.stringify(notificacao));
    }

    if (!localStorage.minhasCompras) {
        let minhasCompras = [];
        localStorage.setItem('minhasCompras', JSON.stringify(minhasCompras));
    }

    let contas = JSON.parse(localStorage.getItem('contas'));

    buscar(contas.chave);

    // a cada 10 segundos a função verifica se os precos estão compatíveis
    // com o desejado e notifica por meio de um alerta na tela
    setInterval(alerta, 10000);
});

async function buscar(chave) {
    try {
        let resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${chave}/usuario`);
        var compras = await resposta.json();
    } catch (e) {
        alert("Falha ao buscar compras");
    }

    var tabela = $("table");
    compras.forEach(compra => {
        adicionarLinha(tabela, compra);
    });
}

function adicionarLinha(tabela, compra) {
    let tbody = tabela.find("tbody");
    let linha = $("<tr></tr>");

    $("<td></td>").text(compra.descricao).appendTo(linha);
    $("<td></td>").text(compra.valor).appendTo(linha);

    tbody.append(linha);
}

async function salvar() {
    if($("#forms").valid()) {
        let notificacao = JSON.parse(localStorage.getItem('notificacao'));
        let contas = JSON.parse(localStorage.getItem('contas'));

        try {
            let resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${contas.chave}/usuario`);
            var compras = await resposta.json();
        } catch (e) {
            alert("Falha ao buscar compras");
        }

        var note = new Object();
        note.descricao = $("#descricao").val();
        note.valor = $("#valor").val();

        if(notificacao.some(n => n.descricao == note.descricao)) {
            // percorre o vetor de notificação, se achar que já existe uma notificação para o item desejado
            // irá apenas atualizar o valor desejado
            notificacao.forEach(n => {
                if(n.descricao == note.descricao) {
                    n.valor = note.valor;
                }
            });

            // salva a alteração no localStorage
            localStorage.setItem('notificacao', JSON.stringify(notificacao));
            alert("Valor atualizado com sucesso.");

        } else if(verificar(compras, note)) {
            // adiciona a notificacao no vetor de notificações
            notificacao.push(note);

            // salva a alteração no localStorage
            localStorage.setItem('notificacao', JSON.stringify(notificacao));
            alert("Notificação adicionada com sucesso");

        } else {
            alert("Essa compra não existe");
        }

        // limpa os capos do formulário
        $("#descricao").val("");
        $("#valor").val("");
    }
}

function verificar(compras, note) {
    return compras.some(compra => compra.descricao == note.descricao);
}

$("#forms").validate({
    rules: {
        descricao: {
            required: true
        },
        valor: {
            required: true,
            min: 0
        }
    },
    messages: {
        descricao: {
            required: "Campo obrigatório"
        },
        valor: {
            required: "Capo obrigatório",
            min: "O valor mínimo é 0"
        }
    }
});

async function comprar() {
    if ($("#forms").valid()) {
        let minhasCompras = JSON.parse(localStorage.getItem('minhasCompras'));
        let contas = JSON.parse(localStorage.getItem('contas'));
        let notificacao = JSON.parse(localStorage.getItem('notificacao'));

        try {
            let resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${contas.chave}/usuario`);
            var compras = await resposta.json();
        } catch (e) {
            alert("Falha ao buscar compras");
        }

        var mCompra = new Object();
        mCompra.descricao = $("#descricao").val();
        mCompra.valor = $("#valor").val();

        // verifica se existe o item disponível para compra
        if (verificar(compras, mCompra)) {

            // adiciona a compra feita no vetor de minhas compras
            minhasCompras.push(mCompra);
            // salva as minhas compras no localStorage
            localStorage.setItem('minhasCompras', JSON.stringify(minhasCompras));
            alert("Compra realisada com sucesso.");

            if (removerNotificacao(notificacao, mCompra)) {
                alert("Notificação removida.");
            } else {
                alert("Não havia uma notificação para esse item");
            }
        } else {
            alert("Este item não está disponível");
        }
    }
}

// função verifica se existe um alerta para o item comprado
// se existir esse alerta é removido
function removerNotificacao(notificacao, mCompra) {
    notificacao.forEach(not => {
        if (not.descricao == mCompra.descricao) {
            notificacao = notificacao.filter(not => not.descricao != mCompra.descricao);
            localStorage.setItem('notificacao', JSON.stringify(notificacao));
            return 1;
        }
    });
    return 0;
}

async function alerta() {
    let contas = JSON.parse(localStorage.getItem('contas'));
    let notificacao = JSON.parse(localStorage.getItem('notificacao'));

    try {
        let resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${contas.chave}/usuario`);
        var compras = await resposta.json();
    } catch (e) {
        alert("Falha ao buscar compras");
    }

    compras.forEach(compra => {
        notificacao.forEach(not => {
            if (compra.descricao == not.descricao && compra.valor <= not.valor) {
                alert("O item " + not.descricao + " atingiu a faixa de preço desejada");
            }
        });
    });
}