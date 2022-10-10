# ToDo - NodeJS
- [Introdução](#introdução)
- [Desenvolvimento](#processo-de-desenvolvimento)
- [Debugging](#debugging)
- [Conclusão](#conclusão)

# Introdução
Projeto para por em prática os fundamentos do Node e protocolos HTTP, a premissa é de um uma lista de tarefas em que cada tarefa seja associada a um usuário. O código inicial recebido foi este a seguir, onde as rotas necessárias já estão descritas, sendo necessário criar as rotinas do sistema e fazer com que corresponda aos requisitos necessários para passar nos testes.
```jsx
const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
}

app.post('/users', (request, response) => {
  // Complete aqui
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
```
[Voltar ao index](#todo---nodejs)

# Processo de desenvolvimento
Quais foram as minhas tomadas de descisão durante o desenvolvimento do projeto.

## checksExistsUserAccount( )
*Função middleware que estará fazendo a validação de usuário pelo username, impedindo assim fazer requisições para contas de usuários que não existem.*
- uma variável para receber o username pelo header da request
- método find( ) que vai procurar outro usuário no array com o mesmo username
- if( ) que retorna uma mensagem de erro caso nenhum usuário exista no banco
- atribuindo o request a um nome, para que passe essa informação para toda rota que use essa middleware
- OBS 1: No caso de não atribuir algo ao ‘request.nome = variavel’, em toda requisição que use essa middlew. será preciso indicar o request.params
- OBS 2: Percebe-se que nesta validação está sendo feita a verificação no caso de não existência de usuário, necessário para casos onde será preciso encontrar um cliente no banco de dados para gerar uma ação. Diferente da validação de cadastro, que só aplica a ação caso o cliente não exista, por isso são duas maneiras distintas de validação.

## app.POST(’users’)
*Rota que fará o cadastro do usuário, em que irá ser armazenado as tasks, para esse processo é preciso identificar o usuário pelo nome, id e username. Neste caso estamos trabalhando com geração aleatória de ID’s, então as validações únicas devem ser feitas pelo username do cliente.*
- Neste caso, temos um array vazio simulando um banco de clientes, onde dentro do post está sendo feito a validação e registro de novos clientes.
- A rota está recebendo os valores de nome e username através do corpo do JSON.
- A validação é feita pelo método ‘some( )’, onde procura se há um usuário dentro do array ‘users’ que tenha um username igual ao aquele que está sendo criado - este método é usado para retornar um true ou false
- Esse valor boolean está sendo verificado pelo ‘if ( )’, onde em caso de que exista um username - no caso seja true - é retornado o código de erro
- Feito isso - o recebimento de dados pelo body JSON da rota, e a validação pelo some( ) - o método que vai registrar esse corpo no array é o push
- Fazendo o push das variáveis nome e username vindas do corpo da requisição, o id chamando a função do uuid para gerar um id aleatório e por fim um novo array de tasks, que iniciará vazio para que o cliente insira nele suas tarefas.

## app.GET(’todos’)
*Uma rota para ler as tarefas - dentro do objeto ‘todo: [ ]’ vazio que é cadastrado em cada usuário. - fezendo a verificação através do username*
- variável que recebe o valor de request do params
- método ‘find( )’ atribuído a uma váriavel que faz a busca pelo usuário relativo a aquele username
- response com o valor do objeto todo, a partir do ‘user.todos’

## app.POST(’todos’)
Alimentar o array *passando através do username pela rota, aqui será adicionado as tasks de cada usuário separadamente, as taks são passadas pelo corpo do JSON contendo título e data - formato aa-mm-dd, id criado pela função uuid e estado ‘done’ como falso.* 
- Recebendo e atribuindo as variáveis ao corpo JSON da requisição
- No caso a maioria dos campos já estão se auto completando - id, done, create_at
- deadline recebendo o new date(variavel), enquanto no corpo está sendo passado a data de entrega no formato ano-mes-dia
- Na requisição está sendo passado os headers params do usuário, e não foi necessário atribuir a uma variável

## app.PUT(’\todos\:id’)
Aqui o id da task será o criado pelo uuid, não esquecendo de passar o usuário pelo header. Essa requisição deverá permitir editar o título e a data limite da task
- Mesmo processo feito no POST, dessa vez só recebendo os valores que serão alterados
- Sempre lembrar de criar usuário-criar task-pegar o id da taks que está sendo retornado na requisição do POST
- Novamente atribuídos a variáveis enquanto os indicadores do usuários sendo passados pelo headers - beaseado no valor de username

## app.PATCH(’\todos\:id\done’)
Rota responsável por alterar o valor de cada task para true ou false, o processo é semelhante ao feito antes. Nesse caso separando o PUT para valores da task e o PATCH para o estado atual.
- Passando apenas um objeto com o valor do campo que será alterado.

## app.DELETE(’\todos\id:’)
- Recebendo o request do usuário e tentei acessar os valores do campo de todo.

[Voltar ao index](#todo---nodejs)

# Debugging
A partir do ponto em que eu não estava conseguindo fazer o get nem o delete no meu projeto, passei a investigar os motivos disso, após dois dias procurando soluções resolvi buscar um direcionamento na resolução do projeto, lá aprendi a investigar a partir dos testes e entender o que estava errado, resolvi então listar aqui para pontuar onde estavam as falhas antes de simplesmente ir corrigindo sem fixar os motivos dos erros antes.

## middleware checkUserExists( )
**Aqui não existiu a necessidade de nenhuma correção**

## app.POST(users)
- Método some(  ) ao invés do find(  ), sendo que ambos os métodos não retornam o mesmo tipo de resposta - NO MEU CÓDIGO LOCAL ESSE TRECHO JÁ HAVIA SIDO ALTERADO.
- No meu caso estou fazendo o push(  ) direto pelo objeto, enquanto no código oficial está sendo passada uma constante com os valores dos objetos. Não creio que isso faça grande diferença - AO TESTAR O CÓDIGO, PROVOU SIM A NECESSIDADE.
- Faltou indicar o return antes do response, e ainda estou retornando os dados de json( ) entre “{ }”, em algum momento o sistema me retornou um erro semelhante, mas até então eu não havia identificado
- Outro detalhe diferente foi que poderia ter feito o retorni implicito no método find

## app.GET(todos)
**Aqui não existiu a necessidade de nenhuma correção**
*Visto que, apesar dessa rota não estar funcionando na versão original do meu projeto, a syntax estava correta, o erro causado era justamente no uso de métodos e declarações erradas em outras rotas.*

## app.POST(todos)
- Novamente um erro de processos, eu estava fazendo a requisição de usuário no método GET mas não no POST, inclusive por esse motivo fiz apenas a apresentação das tasks e nenhum push( ) para dentro do array - NO MEU CÓDIGO LOCAL ESSE TRECHO JÁ HAVIA SIDO ALTERADO
- Esse erro demonstra mais uma vez que na rota GET eu não estava errado, porém não seria possível atualizar - muito menos acessar - o array com as tarefas, visto que estavam sendo criadas mas em nenhum momento inseridas.
- Visto que no meu código local eu já havia arrumado o primeiro erro, mas estava retornando a variável errada pelo response

## app.PUT(todos:id)
- Outro caso de divergência de processos, porém o processo em si não estava errado, apenas diferente. Eu passei um objeto com as informações assim como nas rotas anteriores, no código oficial isso não acontece, mas é apenas por questão de escolha.
- Entretanto eu acabei não fazendo a validação da tarefa, já que ainda não estava retornando nenhuma eu acabei passando batido por esse processo, mas ele deveria dar erro pelo motivo de que as tarefas estavam sendo criadas mas não registradas.

## app.PATCH(todos)
- O mesmo que a rota PUT, novamente escolhi um processo diferente criando um novo objeto e também não fiz a validação especifica já que estava me baseando nas respostas no insomnia
- Durante o debug houve dois problemas tanto no PUT como o PATCH das tarefas, a rotina era concluída mas um erro nos testes permanecia pois o processo encerrava com o objeto editado, mais um outro objeto vazio. Tentei alterar o método para tentar evitar isso, mas não se provou eficiente. Foi feita apenas uma atribuição dos campos requisitados a variáveis com os valores de body.

## app.DELETE(todos\id)
- Nessa rota era preciso passar em dois testes, a minha validação passou em todos os testes. Mas a forma em que foi aplicada não foi possível definir a remoção da task.
- Para a resolução foi necessário o uso de dois métodos, o que não foi compatível com a minha validação.

[Voltar ao index](#todo---nodejs)

# Conclusão
A finalização deste projeto deixou uma sensação mista, eu que iniciei muito bem e consegui obter respostas positivas através do Insomnia durante a maior parte do desenvolvimento, mas no final só estava passando em 1 teste foi meio frustrante. No final das contas eu deveria ter dado uma atenção aos testes enquanto criava as rotas e não ter deixado para o final. Apesar disso eu tive um bom primeiro contato com testes JEST, ainda fica a sensação de que meu desempenho poderia ter sido melhor, mas agora o importante é levar o aprendizado.