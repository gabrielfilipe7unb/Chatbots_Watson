//INICIALIZAÇÃO DO CHAT
const prompt = require('prompt-sync')();
const watson = require('watson-developer-cloud/assistant/v1'); // importa/inclui o watson sdk
require('dotenv').config()

const ASSISTANT_IAM_URL = process.env.ASSISTANT_IAM_URL;
const ASSISTANT_IAM_APIKEY = process.env.ASSISTANT_IAM_APIKEY;
 
const chatbot = new watson({
    'version': process.env.VERSION,
    'url': ASSISTANT_IAM_URL || '<url>',
    'iam_apikey': ASSISTANT_IAM_APIKEY || '<iam_apikey>',
    'iam_url': 'https://iam.bluemix.net/identity/token'
  });
 
  var payload = {
    workspace_id: process.env.WORKSPACE_ID,
    context: {},
    input: {}
  };

  let fimDeConversa = false;
 
  //Começando a conversação com a mensagem vazia;
  chatbot.message(payload, function trataResposta(err, resposta){
 
    if(err){
        console.log(err);
        return;
    }
    
    //indentifica a intent
    if(resposta.intents.length > 0){
        console.log('Eu detectei a intenção: ' + resposta.intents[0].intent);
        if (resposta.intents[0].intent == 'despedida') {
            fimDeConversa = true;
        }
    }

    // exibe a resposta inicial do dialogo, caso exista
    if(resposta.output.text.length > 0){
        console.log(resposta.output.text[0]);
    }

    if (!fimDeConversa){
    // interage com o usuário
        const mensagemUsuario = prompt('>> ');

        chatbot.message({
            workspace_id: process.env.WORKSPACE_ID,
            input: {text: mensagemUsuario},
            context: resposta.context //contexto faz com que ele se lembre de informações interiores
        }, trataResposta);
    }
  });