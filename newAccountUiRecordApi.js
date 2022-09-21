import { LightningElement, track } from 'lwc';

/*IMPORTANDO O OBJETO E CAMPOS DO PROPRIO SCHEMA DA ORG, GARANTEM QUE SEMPRE VENHA AS INFORMAÇÕES SEMPRE CORRETINHAS */
//importando o schema do objeto account de dentro da ORG
import Account from '@salesforce/schema/Account';

//importando os campos necessários para a inserção de account
import Name from '@salesforce/schema/Account.Name';
import Phone from '@salesforce/schema/Account.Phone';

//biblioteca que dispara a mensagem em caso de sucesso
import {ShowToastEvent} from   'lightning/platformShowToastEvent';

//método que envia os dados para a ORG
import { createRecord } from 'lightning/uiRecordApi';

export default class NewAccountUiRecordApi extends LightningElement {
    account = {
        Name: "",
        Phone: ""
    };

    handleInputChange(event){
        console.log(event);
        console.log(event.target);
        let name_ = event.target.name;
        let value_ = event.target.value;

        this.account = {...this.account, [name_]:value_};
        console.log(this.account);
    }

    createAccount(){
        //cria um objeto vazio dos campos
        const fields = {};
        console.log('obj fields vazio');
        console.log(fields);
        
        //monta um objeto com chave baseado no nome da api do campo, de acordo com a org, com o value
        fields[Name.fieldApiName] = this.account.Name;
        fields[Phone.fieldApiName] = this.account.Phone;

        //analise o resultado do objeto montado no console.log
        console.log('obj fields montado');
        console.log(fields);
        
        //montagem do objeto completinho para envio de dados para ORG
        const recordInput = {apiName: Account.objectApiName, fields};
        
        //analise o resultado do objeto montado no console.log
        console.log('recordInput Montado');
        console.log(recordInput);
        
        /** O método createRecord, pode ter dois caminhos 
         * .then() - caminho do sucesso - quando obtemos sucesso na requisição
         * .catch() - caminho da falha - quando obtemos falha na requisição
         * 
         * Elas são conhecidas como Promessas, que são executadas automaticamente, após a requisição.
         * 
         * Ambos os métodos precisam de uma função anonima em seu escopo
         * em cada uma delas, elas recebem parametros, para cada situação, uma resposta diferente.
         * 
         * 
         * .then(
         *      (event) => {ações de sucesso}
         * ).catch(
         *      (error) => {ações de erro}
         * )
         * 
         * dentro do (event) ----> parametros de sucesso
         * dentro do (error) ----> parametros de falha
         * */
        createRecord(recordInput).then(
            (event)=>{
                /*
                    a variável confirm irá montar o alerta do Show Toast Event
                   
                    ShowToastEvent ->
                    cria uma caixa de alerta para emissão da mensagem de sucesso
                    o Show Toast Event contem um objeto montado como parametro
                    onde possui

                    title -> titulo da mensagem
                    message -> mensagem a ser exibida
                    variant -> determina que tipo de alerta (cor) será a caixa (success , warning, error)
                */

                const confirm = new ShowToastEvent({
                    title:'Conta criada',
                    message: 'ID da Conta: ' + event.id,
                    variant: 'success'
                });

                
                //dispara o envento da mensagem após a conclusão da promessa
                this.dispatchEvent(confirm);
            }
        ).catch(
            (error)=>{
                const erro = new ShowToastEvent({
                    title:'Erro',
                    message: error.body.message, 
                    variant: 'error'
                });


                //dispara o evento da mensagem após a conclusão da promessa
                this.dispatchEvent(erro);
            }
        )
    }
}