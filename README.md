# Projeto ConecTalento - MOBILE

Este repositório fornece a estrutura do aplicativo ConecTalento do grupo Arthur Caramori Coutinho, Evelyn Rissio de Andrade, Guilherme Negrijo, João Pedro Alexandre da Silva, João Pedro Vidal, Pedro Lemos Bonini e Rhuan Lima.

## Objetivo da Sprint

-  Protótipo Mobile utilizando a ferramenta FIGMA; 
- Construção das interfaces inicias incluindo Cadastro e Login com validação de CPF via API externa;

## Instalação do Projeto

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

- Abra novamente o Terminal e pressione a tecla "a" para abrir a aplicação no Android. 

## Páginas do Projeto:

- **Login**: Loga um usuário com E-mail e senha corretas;
- **Cadastro**: Cadastra um novo usuário com Nome, E-mail, Senha e confirmar senha e uma validação de E-mail;
- **Home**: Após o Login você estará na página Home com imagens de alguma das ideias propostas por terceiros.

## Componentes do Projeto:

- **Header**: Título do projeto com o ícone do usuário ao lado, uma barra de pesquisa com filtragem ao lado para mais facilidade;
- **InputPassword**: Componente básico de input de senha com botão de visualização da senha;
- **InputUser**: Input de qualquer informação do usuário.
