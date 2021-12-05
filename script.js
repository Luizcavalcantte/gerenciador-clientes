const nome = document.getElementById("nome");
const vencimento = document.getElementById("vencimento");
const telefone = document.getElementById("telefone");

const cadastrar = document.getElementById("cadastrar");

const tabela = document.getElementById("tabela");
const editando = document.getElementById("editando");

//

const firebaseConfig = {
  apiKey: "AIzaSyDUU1jLBxznGue9bt2TkVC4CR_l2-k6EZc",
  authDomain: "cadastro-clientes-felipe.firebaseapp.com",
  projectId: "cadastro-clientes-felipe",
  storageBucket: "cadastro-clientes-felipe.appspot.com",
  messagingSenderId: "1072947916224",
  appId: "1:1072947916224:web:85204f031331034993ac25",
  measurementId: "G-FZ8RHNHXEF",
};

firebase.initializeApp(firebaseConfig);

//pegando dados do fb  vv
let db = firebase.firestore();

// firebase

function addUsuario() {
  // escrevendo no fb vv

  db.collection("dados-clientes")
    .doc("EoFbN8D2PNYrjMh7Wwjh")
    .update({
      //tem q ter pelomenos 1 dado diferente, se nao, nada acontece vv
      clientes: firebase.firestore.FieldValue.arrayUnion({
        Nome: nome.value,
        Vencimento: vencimento.value,
        Telefone: telefone.value,
        Pago: "Sim",
      }),
    })
    .then((doc) => {
      atualizarTabela();
      console.log("update feito com sucesso", doc);
    })
    .catch((err) => {
      console.log(err);
    });

  nome.value = "";
  vencimento.value = "";
  telefone.value = "";
}

function atualizarTabela() {
  db.collection("dados-clientes")
    .get()
    .then((snapshot) =>
      snapshot.forEach((doc) => {
        let todosUsuarios = doc.data().clientes;

        function render() {
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
        <button class="btn apagar" onclick="apagar(
          '${todosUsuarios[i].Nome}',
          '${todosUsuarios[i].Vencimento}',
          '${todosUsuarios[i].Telefone}',
          '${todosUsuarios[i].Pago}'
        )">Apagar</button></td>
      </tr>`;

            tabela.innerHTML += formato;
          }
        }

        render();
      })
    );
}
atualizarTabela();

function apagar(nome, vencimento, telefone, pago) {
  db.collection("dados-clientes")
    .doc("EoFbN8D2PNYrjMh7Wwjh")
    .update({
      //tem q ter pelomenos 1 dado diferente, se nao, nada acontece vv
      clientes: firebase.firestore.FieldValue.arrayRemove({
        Nome: nome,
        Vencimento: vencimento,
        Telefone: telefone,
        Pago: pago,
      }),
    })

    .then((doc) => {
      atualizarTabela();
      console.log("item deletado com sucesso", doc);
    })
    .catch((err) => {
      console.log(err);
    });
}

//
//
//
function editar(i) {
  editando.style.display = "flex";

  db.collection("dados-clientes")
    .get()
    .then((snapshot) =>
      snapshot.forEach((doc) => {
        let todosUsuarios = doc.data().clientes;
        let temporario = ` <div id="${i}">
  <h3>Editando dados</h3>
  <div class="inputsEditando"><div> <input id="editNome" type="text" value="${todosUsuarios[i].Nome}" placeholder="Nome" /> <input id="editVencimento" type="text" value="${todosUsuarios[i].Vencimento}" placeholder="Vencimento" /></div>
  
  <div>  <input id="editTelefone" type="text" value="${todosUsuarios[i].Telefone}" placeholder="Telefone" /> <input id="editPago" type="text" value="${todosUsuarios[i].Pago}" placeholder="Pago" /></div>
  </div>
  <p><button id="confirmar" class="btn editar" onclick="confirmar('${i}')">Confirmar</button>
  <button id="cancelar" class="btn apagar" onclick="cancelar()">Cancelar</button></p>
</div>`;

        editando.innerHTML += temporario;
      })
    );
}

function cancelar() {
  editando.style.display = "none";
  editando.innerHTML = "";
}

function confirmar(i) {
  editando.style.display = "none";

  const editNome = document.getElementById("editNome");
  const editVencimento = document.getElementById("editVencimento");
  const editTelefone = document.getElementById("editTelefone");
  const editPago = document.getElementById("editPago");

  todosUsuarios[i].Nome = editNome.value;
  todosUsuarios[i].Telefone = editVencimento.value;
  todosUsuarios[i].Vencimento = editTelefone.value;
  todosUsuarios[i].Pago = editPago.value;

  editando.innerHTML = "";

  atualizarTabela();

  db.collection("dados-clientes")
    .get()
    .then((snapshot) =>
      snapshot.forEach((doc) => {
        let todosUsuarios = doc.data().clientes;
      })
    );
}
