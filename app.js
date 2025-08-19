// Dados de recomendação NPK do manual RS/SC
const NPK_DATA = {
    "interpretacao_P": {
        "argila_0_20": {
            "muito_baixo": [0, 3.0],
            "baixo": [3.1, 6.0],
            "medio": [6.1, 12.0],
            "alto": [12.1, 18.0],
            "muito_alto": [18.1, 999]
        },
        "argila_21_40": {
            "muito_baixo": [0, 5.0],
            "baixo": [5.1, 10.0],
            "medio": [10.1, 20.0],
            "alto": [20.1, 30.0],
            "muito_alto": [30.1, 999]
        },
        "argila_41_60": {
            "muito_baixo": [0, 8.0],
            "baixo": [8.1, 16.0],
            "medio": [16.1, 32.0],
            "alto": [32.1, 48.0],
            "muito_alto": [48.1, 999]
        },
        "argila_maior_60": {
            "muito_baixo": [0, 10.0],
            "baixo": [10.1, 20.0],
            "medio": [20.1, 40.0],
            "alto": [40.1, 60.0],
            "muito_alto": [60.1, 999]
        }
    },
    "interpretacao_K": {
        "CTC_baixa_0_5": {
            "muito_baixo": [0, 15],
            "baixo": [16, 30],
            "medio": [31, 60],
            "alto": [61, 90],
            "muito_alto": [91, 999]
        },
        "CTC_media_5_15": {
            "muito_baixo": [0, 20],
            "baixo": [21, 40],
            "medio": [41, 80],
            "alto": [81, 120],
            "muito_alto": [121, 999]
        },
        "CTC_alta_maior_15": {
            "muito_baixo": [0, 25],
            "baixo": [26, 50],
            "medio": [51, 100],
            "alto": [101, 150],
            "muito_alto": [151, 999]
        }
    },
    "interpretacao_MO": {
        "muito_baixo": [0, 2.5],
        "baixo": [2.6, 5.0],
        "medio": [5.1, 10.0],
        "alto": [10.1, 20.0],
        "muito_alto": [20.1, 100]
    },
    "recomendacoes_NPK": {
        "Soja": {
            "N": {
                "pos_leguminosa": 20,
                "pos_graminea": 20,
                "base": 20
            },
            "P2O5": {
                "muito_baixo": [120, 80],
                "baixo": [80, 60],
                "medio": [70, 40],
                "alto": [40, 40],
                "muito_alto": [0, 40]
            },
            "K2O": {
                "muito_baixo": [90, 60],
                "baixo": [60, 40],
                "medio": [50, 25],
                "alto": [25, 25],
                "muito_alto": [0, 25]
            },
            "rendimento_ref": 3.0,
            "exportacao": { "P2O5": 15, "K2O": 20 }
        },
        "Milho": {
            "N": {
                "pos_leguminosa": 100,
                "pos_graminea": 150,
                "base": 150
            },
            "P2O5": {
                "muito_baixo": [140, 90],
                "baixo": [90, 70],
                "medio": [80, 45],
                "alto": [45, 45],
                "muito_alto": [0, 45]
            },
            "K2O": {
                "muito_baixo": [100, 70],
                "baixo": [70, 50],
                "medio": [60, 30],
                "alto": [30, 30],
                "muito_alto": [0, 30]
            },
            "rendimento_ref": 8.0,
            "exportacao": { "P2O5": 15, "K2O": 10 }
        },
        "Trigo": {
            "N": {
                "pos_leguminosa": 60,
                "pos_graminea": 80,
                "base": 80
            },
            "P2O5": {
                "muito_baixo": [155, 95],
                "baixo": [95, 75],
                "medio": [85, 45],
                "alto": [45, 45],
                "muito_alto": [0, 45]
            },
            "K2O": {
                "muito_baixo": [110, 70],
                "baixo": [70, 50],
                "medio": [60, 30],
                "alto": [30, 30],
                "muito_alto": [0, 30]
            },
            "rendimento_ref": 3.0,
            "exportacao": { "P2O5": 15, "K2O": 10 }
        },
        "Arroz irrigado": {
            "N": {
                "pos_leguminosa": 90,
                "pos_graminea": 120,
                "base": 120
            },
            "P2O5": {
                "muito_baixo": [120, 80],
                "baixo": [80, 60],
                "medio": [70, 40],
                "alto": [40, 40],
                "muito_alto": [0, 40]
            },
            "K2O": {
                "muito_baixo": [90, 60],
                "baixo": [60, 40],
                "medio": [50, 25],
                "alto": [25, 25],
                "muito_alto": [0, 25]
            },
            "rendimento_ref": 7.0,
            "exportacao": { "P2O5": 12, "K2O": 10 }
        }
    }
};

// Estado da aplicação
let appState = {
    samples: [],
    sampleCounter: 0
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateSampleCounter();
});

function setupEventListeners() {
    // Listeners para configurações globais
    const globalFields = ['municipio', 'fazenda', 'talhao', 'cultura', 'sistema_manejo', 'area_total', 'expectativa_produtividade'];
    globalFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener('input', validateGlobalConfig);
            element.addEventListener('change', validateGlobalConfig);
        }
    });
}

// Função para toggle do "Como usar"
function toggleHowTo() {
    const content = document.getElementById('howToContent');
    const toggle = document.querySelector('.how-to-toggle');

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        toggle.classList.add('active');
    } else {
        content.classList.add('hidden');
        toggle.classList.remove('active');
    }
}

// Função para adicionar nova amostra
function addSample() {
    if (appState.samples.length >= 100) {
        alert('Limite máximo de 100 amostras atingido.');
        return;
    }

    appState.sampleCounter++;
    const sampleId = appState.sampleCounter;

    const sample = {
        id: sampleId,
        local: '',
        ph: '',
        mo: '',
        p: '',
        k: '',
        ca: '',
        mg: '',
        al: '',
        ctc: '',
        argila: '',
        results: null
    };

    appState.samples.push(sample);
    renderSample(sample);
    updateSampleCounter();
}

// Função para renderizar uma amostra
function renderSample(sample) {
    const container = document.getElementById('samplesContainer');

    const sampleDiv = document.createElement('div');
    sampleDiv.className = 'sample-card';
    sampleDiv.id = `sample-${sample.id}`;

    sampleDiv.innerHTML = `
    <div class="sample-header">
      <h3 class="sample-title">Amostra ${sample.id}</h3>
      <button class="remove-sample" onclick="removeSample(${sample.id})" title="Remover amostra">×</button>
    </div>
    <div class="sample-content">
      <div class="sample-inputs">
        <div class="form-group">
          <label class="form-label">ID/Local da Amostra *</label>
          <input type="text" id="local-${sample.id}" class="form-control" placeholder="Ex: Quadra A" oninput="updateSampleField(${sample.id}, 'local', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">pH em água *</label>
          <input type="number" id="ph-${sample.id}" class="form-control" step="0.1" min="3" max="9" placeholder="Ex: 6.2" oninput="updateSampleField(${sample.id}, 'ph', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Matéria Orgânica (%) *</label>
          <input type="number" id="mo-${sample.id}" class="form-control" step="0.1" min="0" placeholder="Ex: 3.5" oninput="updateSampleField(${sample.id}, 'mo', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">P disponível (mg/dm³) *</label>
          <input type="number" id="p-${sample.id}" class="form-control" step="0.1" min="0" placeholder="Ex: 12.5" oninput="updateSampleField(${sample.id}, 'p', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">K disponível (mg/dm³) *</label>
          <input type="number" id="k-${sample.id}" class="form-control" step="1" min="0" placeholder="Ex: 85" oninput="updateSampleField(${sample.id}, 'k', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Ca trocável (cmolc/dm³) *</label>
          <input type="number" id="ca-${sample.id}" class="form-control" step="0.1" min="0" placeholder="Ex: 4.2" oninput="updateSampleField(${sample.id}, 'ca', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Mg trocável (cmolc/dm³) *</label>
          <input type="number" id="mg-${sample.id}" class="form-control" step="0.1" min="0" placeholder="Ex: 1.8" oninput="updateSampleField(${sample.id}, 'mg', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Al trocável (cmolc/dm³)</label>
          <input type="number" id="al-${sample.id}" class="form-control" step="0.1" min="0" placeholder="Ex: 0.2" oninput="updateSampleField(${sample.id}, 'al', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">CTC pH 7.0 (cmolc/dm³) *</label>
          <input type="number" id="ctc-${sample.id}" class="form-control" step="0.1" min="0" placeholder="Ex: 12.5" oninput="updateSampleField(${sample.id}, 'ctc', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Argila (%) *</label>
          <input type="number" id="argila-${sample.id}" class="form-control" step="1" min="0" max="100" placeholder="Ex: 35" oninput="updateSampleField(${sample.id}, 'argila', this.value)">
        </div>
      </div>
      <div class="sample-results" id="results-${sample.id}">
        <div class="results-title">Resultados</div>
        <div class="result-item">
          <span class="result-label">Preencha os campos obrigatórios para ver os resultados</span>
        </div>
      </div>
    </div>
  `;

    container.appendChild(sampleDiv);
}

// Função para atualizar campo da amostra
function updateSampleField(sampleId, field, value) {
    const sample = appState.samples.find(s => s.id === sampleId);
    if (sample) {
        sample[field] = value;
        calculateSampleResults(sample);
    }
}

// Função para remover amostra
function removeSample(sampleId) {
    const sampleIndex = appState.samples.findIndex(s => s.id === sampleId);
    if (sampleIndex !== -1) {
        appState.samples.splice(sampleIndex, 1);
        const element = document.getElementById(`sample-${sampleId}`);
        if (element) {
            element.remove();
        }
        updateSampleCounter();
        updateGlobalResults();
    }
}

// Função para calcular resultados da amostra
function calculateSampleResults(sample) {
    // Verificar se todos os campos obrigatórios estão preenchidos
    const requiredFields = ['local', 'ph', 'mo', 'p', 'k', 'ca', 'mg', 'ctc', 'argila'];
    const isComplete = requiredFields.every(field => sample[field] && sample[field] !== '');

    if (!isComplete) {
        updateSampleResultsDisplay(sample.id, null);
        return;
    }

    const cultura = document.getElementById('cultura').value;
    const expectativaProd = parseFloat(document.getElementById('expectativa_produtividade').value);

    if (!cultura || !expectativaProd) {
        updateSampleResultsDisplay(sample.id, null);
        return;
    }

    // Converter valores para números
    const values = {
        ph: parseFloat(sample.ph),
        mo: parseFloat(sample.mo),
        p: parseFloat(sample.p),
        k: parseFloat(sample.k),
        ca: parseFloat(sample.ca),
        mg: parseFloat(sample.mg),
        al: parseFloat(sample.al) || 0,
        ctc: parseFloat(sample.ctc),
        argila: parseFloat(sample.argila)
    };

    // Classificar P baseado na argila
    const nivelP = classifyP(values.p, values.argila);

    // Classificar K baseado na CTC
    const nivelK = classifyK(values.k, values.ctc);

    // Classificar MO
    const nivelMO = classifyMO(values.mo);

    // Calcular recomendações NPK
    const recomendacoes = calculateNPKRecommendations(cultura, nivelP, nivelK, nivelMO, expectativaProd);

    if (recomendacoes) {
        const results = {
            nivelP,
            nivelK,
            nivelMO,
            ...recomendacoes
        };

        sample.results = results;
        updateSampleResultsDisplay(sample.id, results);
        updateGlobalResults();
    }
}

// Função para classificar P baseado na argila
function classifyP(pValue, argilaValue) {
    let argilaClass;
    if (argilaValue <= 20) argilaClass = 'argila_0_20';
    else if (argilaValue <= 40) argilaClass = 'argila_21_40';
    else if (argilaValue <= 60) argilaClass = 'argila_41_60';
    else argilaClass = 'argila_maior_60';

    const ranges = NPK_DATA.interpretacao_P[argilaClass];

    for (const [level, range] of Object.entries(ranges)) {
        if (pValue >= range[0] && pValue <= range[1]) {
            return level;
        }
    }
    return 'muito_alto';
}

// Função para classificar K baseado na CTC
function classifyK(kValue, ctcValue) {
    let ctcClass;
    if (ctcValue <= 5) ctcClass = 'CTC_baixa_0_5';
    else if (ctcValue <= 15) ctcClass = 'CTC_media_5_15';
    else ctcClass = 'CTC_alta_maior_15';

    const ranges = NPK_DATA.interpretacao_K[ctcClass];

    for (const [level, range] of Object.entries(ranges)) {
        if (kValue >= range[0] && kValue <= range[1]) {
            return level;
        }
    }
    return 'muito_alto';
}

// Função para classificar MO
function classifyMO(moValue) {
    const ranges = NPK_DATA.interpretacao_MO;

    for (const [level, range] of Object.entries(ranges)) {
        if (moValue >= range[0] && moValue <= range[1]) {
            return level;
        }
    }
    return 'muito_alto';
}

// Função para calcular recomendações NPK
function calculateNPKRecommendations(cultura, nivelP, nivelK, nivelMO, expectativaProd) {
    const culturaData = NPK_DATA.recomendacoes_NPK[cultura];
    if (!culturaData) return null;

    // Recomendação de N (simplificado - usando base)
    const recomendacaoN = culturaData.N.base;

    // Recomendação de P2O5
    const doseP = culturaData.P2O5[nivelP] || [0, 0];
    let recomendacaoP1 = doseP[0];
    let recomendacaoP2 = doseP[1];

    // Recomendação de K2O
    const doseK = culturaData.K2O[nivelK] || [0, 0];
    let recomendacaoK1 = doseK[0];
    let recomendacaoK2 = doseK[1];

    // Ajuste para expectativa de produtividade diferente da referência (manual RS/SC)
    const prodExtra = Math.max(0, expectativaProd - culturaData.rendimento_ref);

    // Valores por tonelada adicional (se existirem na sua tabela)
    const exportacaoP = culturaData.exportacao && culturaData.exportacao.P2O5 ? culturaData.exportacao.P2O5 : 0;
    const exportacaoK = culturaData.exportacao && culturaData.exportacao.K2O ? culturaData.exportacao.K2O : 0;

    recomendacaoP1 += Math.round(exportacaoP * prodExtra);
    recomendacaoK1 += Math.round(exportacaoK * prodExtra);
    // Se desejar ajustar também recomendacaoP2 e K2 para o segundo cultivo, aplique lógica similar (só faça se o manual indicar!)


    return {
        recomendacaoN,
        recomendacaoP1,
        recomendacaoP2,
        recomendacaoK1,
        recomendacaoK2
    };
}

// Função para atualizar display dos resultados da amostra
function updateSampleResultsDisplay(sampleId, results) {
    const resultsDiv = document.getElementById(`results-${sampleId}`);

    if (!results) {
        resultsDiv.innerHTML = `
      <div class="results-title">Resultados</div>
      <div class="result-item">
        <span class="result-label">Preencha os campos obrigatórios e configure a cultura para ver os resultados</span>
      </div>
    `;
        return;
    }

    const nivelPLabel = formatNivelLabel(results.nivelP);
    const nivelKLabel = formatNivelLabel(results.nivelK);
    const nivelMOLabel = formatNivelLabel(results.nivelMO);

    resultsDiv.innerHTML = `
    <div class="results-title">Resultados</div>
    <div class="result-item">
      <span class="result-label">Nível P:</span>
      <span class="result-value nivel-${results.nivelP}">${nivelPLabel}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Nível K:</span>
      <span class="result-value nivel-${results.nivelK}">${nivelKLabel}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Nível MO:</span>
      <span class="result-value nivel-${results.nivelMO}">${nivelMOLabel}</span>
    </div>
    <div class="result-item">
      <span class="result-label">N (kg/ha):</span>
      <span class="result-value">${results.recomendacaoN}</span>
    </div>
    <div class="result-item">
      <span class="result-label">P₂O₅ 1º cultivo:</span>
      <span class="result-value">${results.recomendacaoP1} kg/ha</span>
    </div>
    <div class="result-item">
      <span class="result-label">P₂O₅ 2º cultivo:</span>
      <span class="result-value">${results.recomendacaoP2} kg/ha</span>
    </div>
    <div class="result-item">
      <span class="result-label">K₂O 1º cultivo:</span>
      <span class="result-value">${results.recomendacaoK1} kg/ha</span>
    </div>
    <div class="result-item">
      <span class="result-label">K₂O 2º cultivo:</span>
      <span class="result-value">${results.recomendacaoK2} kg/ha</span>
    </div>
  `;
}

// Função para formatar labels dos níveis
function formatNivelLabel(nivel) {
    const labels = {
        'muito_baixo': 'Muito Baixo',
        'baixo': 'Baixo',
        'medio': 'Médio',
        'alto': 'Alto',
        'muito_alto': 'Muito Alto'
    };
    return labels[nivel] || nivel;
}

// Função para calcular todas as amostras
function calculateAll() {
    appState.samples.forEach(sample => {
        calculateSampleResults(sample);
    });
}

// Função para limpar tudo
function clearAll() {
    if (confirm('Tem certeza que deseja limpar todas as amostras e configurações?')) {
        appState.samples = [];
        appState.sampleCounter = 0;
        document.getElementById('samplesContainer').innerHTML = '';

        // Limpar configurações globais
        const globalFields = ['municipio', 'fazenda', 'talhao', 'cultura', 'sistema_manejo', 'area_total', 'expectativa_produtividade'];
        globalFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) element.value = '';
        });

        updateSampleCounter();
        updateGlobalResults();
    }
}

// Função para atualizar contador de amostras
function updateSampleCounter() {
    const counterElement = document.getElementById('samplesCount');
    if (counterElement) {
        counterElement.textContent = appState.samples.length;
    }
}

// Função para validar configurações globais
function validateGlobalConfig() {
    // Recalcular todas as amostras quando configurações globais mudarem
    appState.samples.forEach(sample => {
        calculateSampleResults(sample);
    });
}

// Função para atualizar resultados globais
function updateGlobalResults() {
    const globalResults = document.getElementById('globalResults');
    const samplesWithResults = appState.samples.filter(s => s.results);

    if (samplesWithResults.length === 0) {
        globalResults.classList.add('hidden');
        return;
    }

    // Calcular médias e totais
    const totalN = samplesWithResults.reduce((sum, s) => sum + s.results.recomendacaoN, 0);
    const totalP1 = samplesWithResults.reduce((sum, s) => sum + s.results.recomendacaoP1, 0);
    const totalK1 = samplesWithResults.reduce((sum, s) => sum + s.results.recomendacaoK1, 0);

    const avgN = Math.round(totalN / samplesWithResults.length);
    const avgP1 = Math.round(totalP1 / samplesWithResults.length);
    const avgK1 = Math.round(totalK1 / samplesWithResults.length);

    const summary = document.getElementById('globalSummary');
    if (summary) {
        summary.innerHTML = `
      <div class="summary-grid">
        <div class="summary-item">
          <h4>Amostras Calculadas</h4>
          <div class="value">${samplesWithResults.length}</div>
        </div>
        <div class="summary-item">
          <h4>Média N (kg/ha)</h4>
          <div class="value">${avgN}</div>
        </div>
        <div class="summary-item">
          <h4>Média P₂O₅ (kg/ha)</h4>
          <div class="value">${avgP1}</div>
        </div>
        <div class="summary-item">
          <h4>Média K₂O (kg/ha)</h4>
          <div class="value">${avgK1}</div>
        </div>
      </div>
    `;
    }

    globalResults.classList.remove('hidden');
}

// Função para exportar CSV
function exportCSV() {
    if (appState.samples.length === 0) {
        alert('Não há amostras para exportar.');
        return;
    }

    let csv = '';

    // Cabeçalho com configurações globais
    csv += 'CONFIGURAÇÕES GLOBAIS\n';
    csv += `Município,${document.getElementById('municipio').value || 'N/A'}\n`;
    csv += `Fazenda,${document.getElementById('fazenda').value || 'N/A'}\n`;
    csv += `Talhão,${document.getElementById('talhao').value || 'N/A'}\n`;
    csv += `Cultura,${document.getElementById('cultura').value || 'N/A'}\n`;
    csv += `Sistema de Manejo,${document.getElementById('sistema_manejo').value || 'N/A'}\n`;
    csv += `Área Total (ha),${document.getElementById('area_total').value || 'N/A'}\n`;
    csv += `Expectativa Produtividade (t/ha),${document.getElementById('expectativa_produtividade').value || 'N/A'}\n`;
    csv += `Data/Hora,${new Date().toLocaleString('pt-BR')}\n\n`;

    // Cabeçalho das amostras
    csv += 'DADOS DAS AMOSTRAS\n';
    csv += 'ID,Local,pH,MO(%),P(mg/dm³),K(mg/dm³),Ca(cmolc/dm³),Mg(cmolc/dm³),Al(cmolc/dm³),CTC(cmolc/dm³),Argila(%),Nível P,Nível K,Nível MO,N(kg/ha),P₂O₅ 1º(kg/ha),P₂O₅ 2º(kg/ha),K₂O 1º(kg/ha),K₂O 2º(kg/ha)\n';

    // Dados das amostras
    appState.samples.forEach(sample => {
        const results = sample.results;
        csv += `${sample.id},`;
        csv += `${sample.local || ''},`;
        csv += `${sample.ph || ''},`;
        csv += `${sample.mo || ''},`;
        csv += `${sample.p || ''},`;
        csv += `${sample.k || ''},`;
        csv += `${sample.ca || ''},`;
        csv += `${sample.mg || ''},`;
        csv += `${sample.al || ''},`;
        csv += `${sample.ctc || ''},`;
        csv += `${sample.argila || ''},`;

        if (results) {
            csv += `${formatNivelLabel(results.nivelP)},`;
            csv += `${formatNivelLabel(results.nivelK)},`;
            csv += `${formatNivelLabel(results.nivelMO)},`;
            csv += `${results.recomendacaoN},`;
            csv += `${results.recomendacaoP1},`;
            csv += `${results.recomendacaoP2},`;
            csv += `${results.recomendacaoK1},`;
            csv += `${results.recomendacaoK2}`;
        } else {
            csv += ',,,,,,,';
        }
        csv += '\n';
    });

    // Download do arquivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `recomendacao_npk_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}