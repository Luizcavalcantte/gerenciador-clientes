const nome = document.getElementById("nome");
const vencimento = document.getElementById("vencimento");
const telefone = document.getElementById("telefone");

const cadastrar = document.getElementById("cadastrar");

const tabela = document.getElementById("tabela");
const editando = document.getElementById("editando");

let todosUsuarios = JSON.parse(localStorage.getItem("usuarios")) ?? [];

atualizarTabela();

function addUsuario() {
  const usuario = {
    Nome: nome.value,
    Vencimento: vencimento.value,
    Telefone: telefone.value,
    Pago: "Sim",
  };

  todosUsuarios.push(usuario);

  localStorage.setItem("usuarios", JSON.stringify(todosUsuarios));

  nome.value = "";
  vencimento.value = "";
  telefone.value = "";

  atualizarTabela();
}

function apagar(i) {
  todosUsuarios.splice(i, 1);

  localStorage.setItem("usuarios", JSON.stringify(todosUsuarios));

  atualizarTabela();
}

function atualizarTabela() {
  tabela.innerHTML = `<tr>
  <td>Nome</td>
  <td>Data</td>
  <td>Telefone</td>
  <td>Pago</td>
  <td>Opções</td>
</tr>`;

  for (let i = 0; i < todosUsuarios.length; i++) {
    let formato = ` <tr id="${i}">
  <td>${todosUsuarios[i].Nome}</td>
  <td>${todosUsuarios[i].Vencimento}</td>
  <td>${todosUsuarios[i].Telefone}</td>
  <td class=${todosUsuarios[i].Pago}>${todosUsuarios[i].Pago}</td>
  <td><button class="btn editar" onclick="editar('${i}')">Editar</button>
  <button class="btn apagar" onclick="apagar('${i}')">Apagar</button></td>
</tr>`;

    tabela.innerHTML += formato;
  }
}

function editar(i) {
  editando.style.display = "flex";

  let temporario = ` <div id="${i}">
  <h3>Editando dados</h3>
  <div class="inputsEditando"><div> <input id="editnome" type="text" value="${todosUsuarios[i].Nome}" placeholder="Nome" /> <input id="editVencimento" type="text" value="${todosUsuarios[i].Vencimento}" placeholder="Vencimento" /></div>
  
  <div>  <input id="edittelefone" type="text" value="${todosUsuarios[i].Telefone}" placeholder="Telefone" /> <input id="editPago" type="text" value="${todosUsuarios[i].Pago}" placeholder="Pago" /></div>
  </div>
  <p><button id="confirmar" class="btn editar" onclick="confirmar('${i}')">Confirmar</button>
  <button id="cancelar" class="btn apagar" onclick="cancelar()">Cancelar</button></p>
</div>`;

  editando.innerHTML += temporario;
}

function confirmar(i) {
  editando.style.display = "none";

  const editnome = document.getElementById("editnome");
  const editVencimento = document.getElementById("editVencimento");
  const edittelefone = document.getElementById("edittelefone");
  const editPago = document.getElementById("editPago");

  todosUsuarios[i].Nome = editnome.value;
  todosUsuarios[i].Telefone = editVencimento.value;
  todosUsuarios[i].Vencimento = edittelefone.value;
  todosUsuarios[i].Pago = editPago.value;

  localStorage.setItem("usuarios", JSON.stringify(todosUsuarios));

  editando.innerHTML = "";

  atualizarTabela();
}

function cancelar() {
  editando.style.display = "none";
  editando.innerHTML = "";
}
