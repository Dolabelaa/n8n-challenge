import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

export class Random implements INodeType {
	// Define a aparência e as propriedades do nó na interface do n8n.
	description: INodeTypeDescription = {
		displayName: 'Random',
		name: 'random',
		icon: 'file:random.svg',
		group: ['transform'],
		version: 1,
		description: 'True Random Number Generator',
		defaults: {
			name: 'Random',
		},

		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],

		// Define os campos que o usuário irá preencher.
		properties: [
			{
				displayName: 'ValorMinimo',
				name: 'valorMinimo',
				type: 'number',
				default: 1,
				required: true,
				description: 'Valor mínimo para o número aleatório (random)',
			},
			{
				displayName: 'ValorMaximo',
				name: 'valorMaximo',
				type: 'number',
				default: 100,
				required: true,
				description: 'Valor máximo para o número aleatório (random)',
			},
		],
	};

	// Função principal que executa a lógica do nó.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const entrada = this.getInputData();
		const retornoDosDados: INodeExecutionData[] = [];

		for (let i = 0; i < entrada.length; i++) {
			try {
				const valorMinimo = this.getNodeParameter('valorMinimo', i) as number;
				const valorMaximo = this.getNodeParameter('valorMaximo', i) as number;

				// Validação para retornar um erro amigável em vez de quebrar a execução.
				if (valorMinimo > valorMaximo) {
					retornoDosDados.push({
						json: {
							erro: 'O Valor Mínimo não pode ser maior que o Valor Máximo.',
						},
					});
					return this.prepareOutputData(retornoDosDados);
				}

				// Constrói a URL para a chamada da API externa.
				const url = `https://www.random.org/integers/?num=1&min=${valorMinimo}&max=${valorMaximo}&col=1&base=10&format=plain&rnd=new`;

				const response = await this.helpers.httpRequest({
					method: 'GET',
					url: url,
					json: false, // A API retorna texto puro, não JSON.
				});

				const numeroAleatorio = parseInt(response as string, 10);

				// Enriquece o resultado com dados adicionais para maior utilidade.
				const timestamp = new Date().toISOString();
				const parOuImpar = numeroAleatorio % 2 === 0 ? 'Par' : 'Ímpar';

				retornoDosDados.push({
					json: {
						numeroAleatorio: numeroAleatorio,
						verificacao: parOuImpar,
						geradoEm: timestamp,
					},
				});
			} catch (error) {
				// Tratamento de erros padrão do n8n para falhas inesperadas.
				if (this.continueOnFail()) {
					retornoDosDados.push({
						json: this.getInputData(i)[0].json,
						error: error,
					});
				} else {
					if (error.context) {
						error.context.itemIndex = i;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex: i,
					});
				}
			}
		}

		return this.prepareOutputData(retornoDosDados);
	}
}
