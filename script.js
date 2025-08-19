const API_URL = "http://127.0.0.1:3000/investimentos";

let editId = null;

// Carregar lista ao abrir
window.onload = listarInvestimentos;

// Listar investimentos
async function listarInvestimentos() {
  const resp = await fetch(API_URL);
  const dados = await resp.json();
  const tabela = document.getElementById("lista-investimentos");
  tabela.innerHTML = "";
  dados.forEach(inv => {
    tabela.innerHTML += `
      <tr>
        <td>${inv.nome}</td>
        <td>${inv.tipo}</td>
        <td>R$ ${inv.valor}</td>
        <td>${inv.data}</td>
        <td>
          <button onclick="editarInvestimento(${inv.id})">Editar</button>
          <button onclick="deletarInvestimento(${inv.id})">Excluir</button>
        </td>
      </tr>
    `;
  });

  // Atualiza o texto do botão do formulário
  document.getElementById("btn-submit").textContent = editId ? "Atualizar" : "Cadastrar";
}

// Cadastrar ou atualizar
document.getElementById("form-investimento").addEventListener("submit", async (e) => {
  e.preventDefault();
  const investimento = {
    nome: document.getElementById("nome").value,
    tipo: document.getElementById("tipo").value,
    valor: parseFloat(document.getElementById("valor").value),
    data: document.getElementById("data").value
  };

  if (editId) {
    // Atualizar
    await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(investimento)
    });
    editId = null;
  } else {
    // Cadastrar
    await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(investimento)
    });
  }

  e.target.reset();
  listarInvestimentos();
});

// Excluir
async function deletarInvestimento(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  listarInvestimentos();
}

// Preparar edição
async function editarInvestimento(id) {
  const resp = await fetch(API_URL);
  const dados = await resp.json();
  const inv = dados.find(i => i.id === id);

  document.getElementById("nome").value = inv.nome;
  document.getElementById("tipo").value = inv.tipo;
  document.getElementById("valor").value = inv.valor;
  document.getElementById("data").value = inv.data;

  editId = id;
  document.getElementById("btn-submit").textContent = "Atualizar";
}