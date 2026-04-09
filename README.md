# Keetlio.Note

Aplicação web de organização pessoal com sistema de login, notas, tarefas e diário.

## Autor

| Campo | Info |
|-------|------|
| **Nome** | Guilherme Espicoz Almeida |

---

## Sobre o Projeto

O Keetlio.Note é um sistema de organização pessoal totalmente no navegador, sem necessidade de servidor. Os dados são salvos localmente via `localStorage`. O acesso é protegido por login com cadastro de usuários.

---

## Tecnologias Utilizadas

- **HTML5** — estrutura das páginas
- **CSS3** — estilização e layout
- **JavaScript** — lógica, manipulação do DOM e armazenamento local
- **localStorage** — persistência dos dados no navegador
- **Google Identity API** — integração com Google Agenda

---

## Estrutura do Projeto

```
Keetlio.Note/
├── login.html       # Tela de login e cadastro de usuários
├── index.html       # Página principal — tarefas, notas e organização
├── pagina2.html     # Quadro Branco
├── pagina3.html     # Diário
├── pagina4.html     # Contato
├── pagina5.html     # Atualizações
├── script.js        # Toda a lógica da aplicação
└── styles.css       # Estilos da aplicação
```

---

## Como Rodar

Por ser um projeto **100% frontend**, não precisa instalar nada.

1. Baixe ou clone o repositório
2. Abra o arquivo `login.html` no navegador
3. Cadastre um usuário e faça login

> Nenhum servidor é necessário — tudo roda direto no navegador.

---

## Funcionalidades

- Login e cadastro de usuários (dados salvos no localStorage)
- Cada usuário tem seus próprios dados separados
- Tarefas diárias com sistema de pontos
- Notas pessoais
- Tarefas adicionais
- Quadro Branco para anotações livres
- Diário pessoal
- Exportar e importar dados em arquivo
- Integração com Google Agenda
- Página de atualizações do sistema
