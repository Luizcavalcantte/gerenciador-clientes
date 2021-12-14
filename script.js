const inputNomeCadastro = document.getElementById("inputNomeCadastro");
const inputVencimentoCadastro = document.getElementById(
  "inputVencimentoCadastro"
);
const inputTelefoneCadastro = document.getElementById("inputTelefoneCadastro");

const dadosClientes = document.getElementById("dadosClientes");

const janelaEditar = document.getElementById("janelaEditar");
const janelaCadastro = document.getElementById("janelaCadastro");

const fundoJanelas = document.getElementById("fundoJanelas");

const inputEmailLogin = document.getElementById("inputEmailLogin");
const inputSenhaLogin = document.getElementById("inputSenhaLogin");

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

let db = firebase.firestore();

function cadastrarCliente() {
  janelaCadastro.style.display = "none";
  fundoJanelas.style.display = "none";

  // escrevendo no fb vv

  db.collection("dados-clientes")
    .doc("EoFbN8D2PNYrjMh7Wwjh")
    .update({
      //tem q ter pelomenos 1 dado diferente, se nao, nada acontece vv
      clientes: firebase.firestore.FieldValue.arrayUnion({
        Nome: inputNomeCadastro.value,
        Vencimento: inputVencimentoCadastro.value,
        Telefone: inputTelefoneCadastro.value,
        Pago: "Pagou",
      }),
    })
    .then((doc) => {
      atualizarDadosClientes();
      console.log("update feito com sucesso", doc);
    })
    .catch((err) => {
      console.log(err);
    });

  inputNomeCadastro.value = "";
  inputVencimentoCadastro.value = "";
  inputTelefoneCadastro.value = "";
}

function atualizarDadosClientes() {
  dadosClientes.innerHTML = "";
  db.collection("dados-clientes")
    .get()
    .then((snapshot) =>
      snapshot.forEach((doc) => {
        let todosClientes = doc.data().clientes;

        function render() {
          for (let i = 0; i < todosClientes.length; i++) {
            let formato = ` <div class="cliente" id="${i}">
        <h3 class="nomeClientes">${todosClientes[i].Nome}</h3>
        <p>${todosClientes[i].Telefone}</p>
        <p> Dia ${todosClientes[i].Vencimento}</p>
        
        <p class=${todosClientes[i].Pago}>${todosClientes[i].Pago}</p>
        <p><button class="btnEditar" onclick="editar('${i}')">Editar</button>
        <button class="btnApagar" onclick="apagar(
          '${todosClientes[i].Nome}',
          '${todosClientes[i].Vencimento}',
          '${todosClientes[i].Telefone}',
          '${todosClientes[i].Pago}'
        )">Apagar</button></p>
      </tr>`;

            dadosClientes.innerHTML += formato;
          }
        }

        render();
      })
    );
}
atualizarDadosClientes();

function apagar(nome, vencimento, telefone, pago) {
  let confirmacao = prompt(
    "Confirme o nome do cliente para apagalo " + '"' + nome + '"'
  );
  confirmacao;
  if (confirmacao === nome) {
    db.collection("dados-clientes")
      .doc("EoFbN8D2PNYrjMh7Wwjh")
      .update({
        clientes: firebase.firestore.FieldValue.arrayRemove({
          Nome: nome,
          Vencimento: vencimento,
          Telefone: telefone,
          Pago: pago,
        }),
      })

      .then((doc) => {
        atualizarDadosClientes();
        console.log("item deletado com sucesso", doc);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

//
//
//
function editar(i) {
  fundoJanelas.style.display = "flex";
  janelaEditar.style.display = "flex";

  db.collection("dados-clientes")
    .get()
    .then((snapshot) =>
      snapshot.forEach((doc) => {
        let todosClientes = doc.data().clientes;
        let temporario = ` <div id="${i}">
  <h3>Editando dados</h3>
  <div class="inputsEditando"><div> <input id="editNome" value="${todosClientes[i].Nome}" type="text"  placeholder="Nome" /> <input id="editVencimento" type="text" value="${todosClientes[i].Vencimento}" placeholder="Vencimento" /></div>
  
  <div>  <input id="editTelefone" type="text" value="${todosClientes[i].Telefone}" placeholder="Telefone" /> <input id="editPago" type="text" value="${todosClientes[i].Pago}" placeholder="Pago" /></div>
  </div>
  <p><button id="confirmar" class="btns" onclick="confirmar('${i}')">Confirmar</button>
  <button id="cancelar" class="btns" onclick="cancelar()">Cancelar</button></p>
</div>`;

        janelaEditar.innerHTML += temporario;
      })
    );
}

function cancelar() {
  fundoJanelas.style.display = "none";
  janelaEditar.style.display = "none";
  janelaEditar.innerHTML = "";
}

function confirmar(i) {
  const editandoNome = document.getElementById("editNome").value;
  const editandoVencimento = document.getElementById("editVencimento").value;
  const editandoTelefone = document.getElementById("editTelefone").value;
  const editandoPago = document.getElementById("editPago").value;

  janelaEditar.style.display = "none";
  fundoJanelas.style.display = "none";

  //
  db.collection("dados-clientes")
    .get()
    .then((snapshot) =>
      snapshot.forEach((doc) => {
        console.log(editandoNome.value);

        let todosUsuarios = doc.data().clientes;

        todosUsuarios[i].Nome = editandoNome;
        todosUsuarios[i].Vencimento = editandoVencimento;
        todosUsuarios[i].Telefone = editandoTelefone;
        todosUsuarios[i].Pago = editandoPago;

        //
        db.collection("dados-clientes")
          .doc("EoFbN8D2PNYrjMh7Wwjh")
          .set({
            //tem q ter pelomenos 1 dado diferente, se nao, nada acontece vv
            clientes: todosUsuarios,
          })
          .then((doc) => {
            atualizarDadosClientes();
            console.log("update feito com sucesso", doc);
          })
          .catch((err) => {
            console.log(err);
          });
        //

        console.log(todosUsuarios);
      })
    );

  //

  janelaEditar.innerHTML = "";

  atualizarDadosClientes();
}

function abrirCadastro() {
  fundoJanelas.style.display = "flex";

  janelaCadastro.style.display = "flex";
}

function fecharJanelaCadastro() {
  fundoJanelas.style.display = "none";

  janelaCadastro.style.display = "none";
}

function abrirLogin() {
  fundoJanelas.style.display = "flex";
  let login = document.getElementById("janelaLogin");
  login.style.display = "flex";
}

function fecharJanelaLogin() {
  fundoJanelas.style.display = "none";
  let login = document.getElementById("janelaLogin");
  login.style.display = "none";
}

function fazerLogin() {
  fundoJanelas.style.display = "none";

  console.log(inputEmailLogin.value, inputSenhaLogin.value);
  firebase
    .auth()
    .signInWithEmailAndPassword(inputEmailLogin.value, inputSenhaLogin.value)
    .then((loggedUser) => {
      console.log(firebase.auth().currentUser);
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          alert("Logado com sucesso");
        } else {
          console.log("ninguem logado");
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
  let login = document.getElementById("janelaLogin");
  login.style.display = "none";
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("usuario deslogado");

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          alert("Logado com sucesso");
        } else {
          alert("ninguem logado");
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
