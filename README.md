# Projeto ConecTalento - MOBILE

Este repositório fornece a estrutura do aplicativo ConecTalento do grupo composto por Arthur Caramori Coutinho, Evelyn Rissio de Andrade, Guilherme Negrijo, João Pedro Alexandre da Silva, João Pedro Vidal, Pedro Lemos Bonini e Rhuan Lima.


## Instalação do Projeto

- Aplicativo:

1. Instale o aplicativo pelo link: https://drive.google.com/file/d/1rkYk_r6mYXpcTDFuADpuy5XH-wLYUOAQ/view?usp=sharing

- Código / Desenvolvimento:

1. Clone o repositório:
   ```sh
   git clone https://github.com/Arthur16800/Mobile_ConecTalento.git
   cd Mobile_ConecTalento
   code .

2. Abra o terminal e rode o comando:

   ```sh
   npm i
   ```

3. Após instalar as dependências:

Rode o comando para iniciar a aplicação:

   ```sh
   npx expo start
   ```

4. Abra o aplicativo "Android Studio", vá em "More Actions", selecione "Virtual Device Manager" e clique na opção "Galaxy Mini API 33".

5. Após ligar o emulador, clique no primeiro botão da barra para o aparelho começar a funcionar.

6. Abra novamente o Terminal e pressione a tecla "a" para abrir a aplicação no Android. 

## Páginas do Projeto:

- **Login**: Loga um usuário com E-mail e senha corretas.
- **Cadastro**: Cadastra um novo usuário com Nome, E-mail, Senha e confirmar senha e uma validação de E-mail.
- **Home**: Após o Login você estará na página Home com imagens de alguma das ideias propostas por terceiros.
- **Premium**: Após o Login você poderá atualizar sua conta para premium, ao efetuar um pagamento.
- **CriarProjeto**: Após o Login você poderá criar um projeto que qualquer um poderá ver.
- **Portfólio**: Após o Login você poderá Ver todos os seus projetos listados em uma tela separada.
- **ProjetoInfo**: Ao clicar em um projeto, você poderá ver detalhes do projeto.
- **Perfil**: Ao clicar no perfil de alguém, ou na opção do menu para ver o próprio, poderá ver o perfil da pessoa.

## Componentes do Projeto:

- **Header**: Título do projeto com o ícone do usuário ao lado;
- **HeaderKeyboard**: Título do projeto com o ícone do usuário e uma barra de pesquisa com filtragem ao lado para mais facilidade;
- **InputPassword**: Componente básico de input de senha com botão de visualização da senha;
- **InputObj**: Input de qualquer informação de um objeto qualquer.
- **BarraLateral**: Modal que disponibiliza navegação pelo app.
- **Card**: Componente que renderiza um projeto, chamado na página Home e Portfólio.
- **InputUser**: Input de qualquer informação do usuário.
- **ModalConfirmEmail**: Modal de confirmação no cadastro do e-mail por envio de código.
