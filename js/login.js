$(document).ready(function() {
    if (!localStorage.contas) {
        let contas = [];
        localStorage.setItem('contas', JSON.stringify(contas));
    }
});


$("#forms").validate({
    rules: {
        login: {
            required: true
        },
        senha: {
            required: true
        }
    },
    messages: {
        login: {
            required: "campo obrigatório"
        },
        snha: {
            required: "campo obrigatório"
        }
    }
});

async function autenticar() {
    if($("#forms").valid()) {
        let login = $("#login").val();
        let senha = $("#senha").val();

        try {
            let resposta = await fetch(`https://api-odinline.odiloncorrea.com/usuario/${login}/${senha}/autenticar`);
            let usuario = await resposta.json();

            if(usuario.id > 0) {
                localStorage.setItem('contas', JSON.stringify(usuario));
                localStorage.removeItem("notificacao");
                localStorage.removeItem("minhasCompras");
                window.location.href = "alerta.html";
            } else {
                alert("Usuário ou senha inválidos.");
            }
        } catch (e) {
            alert("Erro ao tentar autenticar.");
        }


    }
}