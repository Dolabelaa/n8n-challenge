// Importa a classe do nó e os tipos do n8n para simulação.
import { Random } from './Random.node';
import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

// Descreve a suíte de testes para o nó Random.
describe('Nó Aleatório', () => {
  // Declara variáveis para a simulação do contexto de execução e da requisição HTTP.
  let mockContexto: IExecuteFunctions;
  let mockRequisicaoHttp: jest.Mock;

  // Configura o ambiente de simulação antes de todos os testes.
  beforeAll(() => {
    mockRequisicaoHttp = jest.fn();

    //Configura o objeto de contexto de simulação.
    mockContexto = {
      getNodeParameter: jest.fn(),
      getInputData: jest.fn().mockReturnValue([{} as INodeExecutionData]),
      prepareOutputData: jest.fn((dados) => [dados]),
      continueOnFail: jest.fn().mockReturnValue(false),
      getNode: jest.fn().mockReturnValue({}),
      helpers: {
        httpRequest: mockRequisicaoHttp,
      },
      item: 0,
    } as unknown as IExecuteFunctions;
  });

  // Limpa o estado dos mocks antes de cada teste.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Caso de Teste 1: Sucesso ---
  it('deve retornar um número aleatório com valores válidos', async () => {
    // Simula uma resposta de sucesso da API.
    mockRequisicaoHttp.mockResolvedValueOnce('50');

    // Simula os parâmetros de entrada do nó.
    (mockContexto.getNodeParameter as jest.Mock)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(100);

    const no = new Random();
    const resultado = await no.execute.call(mockContexto);

    // Verifica se a requisição foi feita com a URL correta.
    const urlEsperada = 'https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new';
    expect(mockRequisicaoHttp).toHaveBeenCalledWith(
      expect.objectContaining({ url: urlEsperada }),
    );

    // Verifica se o resultado de saída está no formato esperado.
    const dadosSaida = resultado[0][0].json as any;
    expect(dadosSaida.numeroAleatorio).toBe(50);
    expect(dadosSaida).toHaveProperty('verificacao');
    expect(dadosSaida).toHaveProperty('geradoEm');
  });

  // --- Caso de Teste 2: Validação de Parâmetros ---
  it('deve retornar um erro quando o valor mínimo for maior que o máximo', async () => {
    // Simula uma entrada de parâmetros inválida.
    (mockContexto.getNodeParameter as jest.Mock)
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(5);

    const no = new Random();
    const resultado = await no.execute.call(mockContexto);

    // Verifica que a requisição à API não foi acionada.
    expect(mockRequisicaoHttp).not.toHaveBeenCalled();

    // Confirma que a saída contém a mensagem de erro esperada.
    const dadosSaida = resultado[0][0].json as any;
    expect(dadosSaida).toEqual({
      erro: 'O Valor Mínimo não pode ser maior que o Valor Máximo.',
    });
  });

  // --- Caso de Teste 3: Tratamento de Erros da API ---
  it('deve tratar falhas na requisição HTTP de forma adequada', async () => {
    // Simula uma falha na requisição.
    mockRequisicaoHttp.mockRejectedValue(new Error('API indisponível'));

    // Simula parâmetros válidos para o teste.
    (mockContexto.getNodeParameter as jest.Mock)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(100);

    const no = new Random();

    // Espera que a execução lance um erro.
    await expect(no.execute.call(mockContexto)).rejects.toThrow('API indisponível');
  });
});
