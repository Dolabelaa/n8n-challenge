import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

export class Random implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Random',
		name: 'random',
		icon: 'file:random.svg',
		group: ['transform'],
		version: 1,
		description: 'True Random Number Generator', // <-- SUGESTÃO 2 APLICADA
		defaults: {
			name: 'Random',
		},

		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],

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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const entrada = this.getInputData();
		const retornoDosDados: INodeExecutionData[] = [];

		for (let i = 0; i < entrada.length; i++) {
			try {
				// V CORREÇÃO CRÍTICA APLICADA AQUI V
				const valorMinimo = this.getNodeParameter('valorMinimo', i) as number;
				const valorMaximo = this.getNodeParameter('valorMaximo', i) as number;

				if (valorMinimo > valorMaximo) {
					throw new NodeOperationError(this.getNode(), 'Checagem para o valor mínimo não ser maior, que o máximo.');
				}

				const url = `https://www.random.org/integers/?num=1&min=${valorMinimo}&max=${valorMaximo}&col=1&base=10&format=plain&rnd=new`;

				const response = await this.helpers.httpRequest({
					method: 'GET',
					url: url,
					json: false,
				});

				const numeroAleatorio = parseInt(response as string, 10);

				// V SUGESTÃO 1 APLICADA AQUI V
				retornoDosDados.push({
					json: {
						numeroAleatorio: numeroAleatorio,
					},
				});
			} catch (error) {
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
