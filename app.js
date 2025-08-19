// Dados das tabelas de interpretação e recomendação
const NPK_DATA = {
  interpretacao_P: {
    argila_0_20: {
      muito_baixo: [0, 3.0],
      baixo: [3.1, 6.0], 
      medio: [6.1, 12.0],
      alto: [12.1, 18.0],
      muito_alto: [18.1, 999]
    },
    argila_21_40: {
      muito_baixo: [0, 5.0],
      baixo: [5.1, 10.0],
      medio: [10.1, 20.0], 
      alto: [20.1, 30.0],
      muito_alto: [30.1, 999]
    },
    argila_41_60: {
      muito_baixo: [0, 8.0],
      baixo: [8.1, 16.0],
      medio: [16.1, 32.0],
      alto: [32.1, 48.0], 
      muito_alto: [48.1, 999]
    },
    argila_maior_60: {
      muito_baixo: [0, 10.0],
      baixo: [10.1, 20.0],
      medio: [20.1, 40.0],
      alto: [40.1, 60.0],
      muito_alto: [60.1, 999]
    }
  },
  interpretacao_K: {
    CTC_baixa_0_5: {
      muito_baixo: [0, 15],
      baixo: [16, 30],
      medio: [31, 60], 
      alto: [61, 90],
      muito_alto: [91, 999]
    },
    CTC_media_5_15: {
      muito_baixo: [0, 20],
      baixo: [21, 40],
      medio: [41, 80],
      alto: [81, 120],
      muito_alto: [121, 999]
    },
    CTC_alta_maior_15: {
      muito_baixo: [0, 25],
      baixo: [26, 50], 
      medio: [51, 100],
      alto: [101, 150],
      muito_alto: [151, 999]
    }
  },
  correcao_P2O5: {
    muito_baixo: 160,
    baixo: 80,
    medio: 40,
    alto: 0,
    muito_alto: 0
  },
  correcao_K2O: {
    muito_baixo: 120,
    baixo: 60,
    medio: 30,
    alto: 0,
    muito_alto: 0
  },
  exportacao_culturas: {
    "Soja": {"P2O5": 15, "K2O": 25},
    "Milho": {"P2O5": 15, "K2O": 10},
    "Trigo": {"P2O5": 15, "K2O": 10},
    "Arroz irrigado": {"P2O5": 10, "K2O": 10}
  },
  recomendacao_N: {
    "Milho": {
      doses_base: {
        leguminosa: [70, 50, 40],
        consorciacao: [80, 60, 40], 
        graminea: [90, 70, 50]
      },
      rendimento_base: 6,
      incremento_por_tonelada: 15
    },
    "Soja": {
      doses_base: {
        leguminosa: [20, 15, 10],
        consorciacao: [20, 15, 10],
        graminea: [20, 15, 10]
      },
      rendimento_base: 3,
      incremento_por_tonelada: 5
    },
    "Trigo": {
      doses_base: {
        leguminosa: [60, 40, 30],
        consorciacao: [70, 50, 40],
        graminea: [80, 60, 50]
      },
      rendimento_base: 3,
      incremento_por_tonelada: 15
    },
    "Arroz irrigado": {
      doses_base: {
        leguminosa: [90, 70, 60],
        consorciacao: [110, 90, 80],
        graminea: [120, 100, 90]
      },
      rendimento_base: 7,
      incremento_por_tonelada: 15
    }
  }
};

// Variáveis globais
let samples = [];
let sampleCounter = 0;
let calculatedResults = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  updateSampleCount();
  console.log('Sistema NPK inicializado');
});

// Funções de UI
function toggleHowTo() {
  const content = document.getElementById('how-to-content');
  const icon = document.getElementById('toggle-icon');
  
  if (content.classList.contains('open')) {
    content.classList.remove('open');
    icon.textContent = '▼';
  } else {
    content.classList.add('open');
    icon.textContent = '▲';
  }
}

function addSample() {
  console.log('Adicionando amostra...');
  
  if (samples.length >= 100) {
    showAlert('Limite máximo', 'Não é possível adicionar mais de 100 amostras.');
    return;
  }
  
  sampleCounter++;
  const sampleId = `amostra-${sampleCounter}`;
  
  const sample = {
    id: sampleId,
    local: '',
    ph: '',
    materia_organica: '',
    p_disponivel: '',
    k_disponivel: '',
    ca_trocavel: '',
    mg_trocavel: '',
    al_trocavel: '',
    ctc_ph7: '',
    argila: ''
  };
  
  samples.push(sample);
  renderSample(sample);
  updateSampleCount();
  
  console.log(`Amostra ${sampleId} adicionada. Total: ${samples.length}`);
}

function renderSample(sample) {
  const container = document.getElementById('samples-container');
  
  if (!container) {
    console.error('Container de amostras não encontrado');
    return;
  }
  
  const sampleDiv = document.createElement('div');
  sampleDiv.className = 'sample-card';
  sampleDiv.id = `sample-${sample.id}`;
  
  sampleDiv.innerHTML = `
    <div class="sample-header">
      <h4>Amostra ${sample.id.split('-')[1]}</h4>
      <button class="sample-remove" onclick="removeSample('${sample.id}')">❌</button>
    </div>
    <div class="sample-body">
      <div class="sample-grid">
        <div class="form-group">
          <label class="form-label">ID/Local da Amostra *</label>
          <input type="text" class="form-control" 
                 data-sample="${sample.id}" 
                 data-field="local" 
                 placeholder="Ex: Talhão A1" 
                 required 
                 onchange="updateSampleData(this)"
                 oninput="updateSampleData(this)">
        </div>
        <div class="form-group">
          <label class="form-label">pH em água *</label>
          <input type="number" class="form-control" 
                 data-sample="${sample.id}" 
                 data-field="ph" 
                 placeholder="Ex: 6.5" 
                 step="0.01" 
                 min="0" 
                 max="14" 
                 required 
                 onchange="updateSampleData(this)"
                 oninput="updateSampleData(this)">
        </div>
        <div class="form-group">
          <label class="form-label">Matéria Orgânica % *</label>
          <input type="number" class="form-control" 
                 data-sample="${sample.id}" 
                 data-field="materia_organica" 
                 placeholder="Ex: 3.5" 
                 step="0.01" 
                 min="0" 
                 required 
                 onchange="updateSampleData(this)"
                 oninput="updateSampleData(this)">
        </div>
        <div class="form-group">
          <label class="form-label">P disponível mg/dm³ - Mehlich-1 *</label>
          <input type="number" class="form-control" 
                 data-sample="${sample.id}" 
                 data-field="p_disponivel" 
                 placeholder="Ex: 15.5" 
                 step="0.01" 
                 min="0" 
                 required 
                 onchange="updateSampleData(this)"
                 oninput="updateSampleData(this)">
        </div>
        <div class="form-group">
          <label class="form-label">K disponível mg/dm³ - Mehlich-1 *</label>
          <input type="number" class="form-control" 
                 data-sample="${sample.id}" 
                 data-field="k_disponivel" 
                 placeholder="Ex: 85" 
                 step="0.01" 
                 min="0" 
                 required 
                 onchange="updateSampleData(this)"
                 oninput="updateSampleData(this)">
        </div>
        <div class="form-group">
          <label class="form-label">Ca trocável cmolc/dm³ *</label>
          <input type="number" class="form-control" 
                 data-sample="${sample.id}" 
                 data-field="ca_trocavel" 
                 placeholder="Ex: 4.2" 
                 step="0.01" 
                 min="0" 
                 required 
                 onchange="updateSampleData(this)"
                 oninput="updateSampleData(this)">
        </div>
        <div class="form-group">
          <label class="form-label">Mg trocável cmolc/dm³ *</label>
          <input type="number" class="form-control" 
                 data-sample="${sample.id}" 
                 data-field="mg_trocavel" 
                 placeholder="Ex: 1.8" 
                 step="0.01" 
                 min="0" 
                 required 
                 onchange="updateSampleData(this)"
                 oninput="updateSampleData(this)">
        </div>
        <div class="form-group">
          <label class="form-label">Al trocável cmolc/dm³</label>
          <input type="number" class="form-control" 
                 data-sample="${sample.id}" 
                 data-field="al_trocavel" 
                 placeholder="Ex: 0.2" 
                 step="0.01" 
                 min="0" 
                 onchange="updateSampleData(this)"
                 oninput="updateSampleData(this)">
        </div>
        <div class="form-group">
          <label class="form-label">CTC pH 7.0 cmolc/dm³ *</label>
          <input type="number" class="form-control" 
                 data-sample="${sample.id}" 
                 data-field="ctc_ph7" 
                 placeholder="Ex: 8.5" 
                 step="0.01" 
                 min="0" 
                 required 
                 onchange="updateSampleData(this)"
                 oninput="updateSampleData(this)">
        </div>
        <div class="form-group">
          <label class="form-label">Argila % *</label>
          <input type="number" class="form-control" 
                 data-sample="${sample.id}" 
                 data-field="argila" 
                 placeholder="Ex: 35" 
                 step="0.01" 
                 min="0" 
                 max="100" 
                 required 
                 onchange="updateSampleData(this)"
                 oninput="updateSampleData(this)">
        </div>
      </div>
    </div>
  `;
  
  container.appendChild(sampleDiv);
  
  // Scroll para a nova amostra
  sampleDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function removeSample(sampleId) {
  console.log(`Removendo amostra: ${sampleId}`);
  
  const index = samples.findIndex(s => s.id === sampleId);
  if (index !== -1) {
    samples.splice(index, 1);
    const sampleElement = document.getElementById(`sample-${sampleId}`);
    if (sampleElement) {
      sampleElement.remove();
    }
    updateSampleCount();
    
    // Remove resultado se existir
    const resultIndex = calculatedResults.findIndex(r => r.sampleId === sampleId);
    if (resultIndex !== -1) {
      calculatedResults.splice(resultIndex, 1);
      updateResults();
      updateSummary();
    }
    
    console.log(`Amostra ${sampleId} removida. Total: ${samples.length}`);
  }
}

function updateSampleData(input) {
  const sampleId = input.dataset.sample;
  const field = input.dataset.field;
  const value = input.value;
  
  const sample = samples.find(s => s.id === sampleId);
  if (sample) {
    sample[field] = value;
    console.log(`Amostra ${sampleId}, campo ${field} atualizado para: ${value}`);
  }
  
  // Remover classe de erro se valor foi preenchido
  if (value.trim() !== '') {
    input.classList.remove('error');
    const errorMsg = input.parentNode.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
  }
}

function clearAll() {
  if (samples.length === 0) {
    showAlert('Nenhuma amostra', 'Não há amostras para limpar.');
    return;
  }
  
  if (confirm('Tem certeza que deseja limpar todas as amostras? Esta ação não pode ser desfeita.')) {
    samples = [];
    calculatedResults = [];
    document.getElementById('samples-container').innerHTML = '';
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('summary-section').style.display = 'none';
    updateSampleCount();
    console.log('Todas as amostras foram limpas');
  }
}

function updateSampleCount() {
  const countElement = document.getElementById('sample-count');
  if (countElement) {
    countElement.textContent = samples.length;
  }
}

// Funções de validação
function validateGlobalConfig() {
  const required = ['cultura', 'sistema-manejo', 'cultura-antecessora', 'expectativa-produtividade'];
  let valid = true;
  const errors = [];
  
  for (const fieldId of required) {
    const field = document.getElementById(fieldId);
    if (!field.value.trim()) {
      field.classList.add('error');
      errors.push(field.previousElementSibling.textContent.replace(' *', ''));
      valid = false;
    } else {
      field.classList.remove('error');
    }
  }
  
  if (!valid) {
    showAlert('Campos obrigatórios', `Preencha os seguintes campos: ${errors.join(', ')}`);
  }
  
  return valid;
}

function validateSample(sample) {
  const required = ['local', 'ph', 'materia_organica', 'p_disponivel', 'k_disponivel', 
                   'ca_trocavel', 'mg_trocavel', 'ctc_ph7', 'argila'];
  let valid = true;
  
  for (const field of required) {
    if (!sample[field] || sample[field].toString().trim() === '') {
      const input = document.querySelector(`[data-sample="${sample.id}"][data-field="${field}"]`);
      if (input) {
        input.classList.add('error');
        if (!input.parentNode.querySelector('.error-message')) {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'error-message';
          errorMsg.textContent = 'Campo obrigatório';
          input.parentNode.appendChild(errorMsg);
        }
      }
      valid = false;
    }
  }
  
  return valid;
}

// Funções de cálculo
function calculateAll() {
  console.log('Iniciando cálculos...');
  
  if (!validateGlobalConfig()) {
    return;
  }
  
  if (samples.length === 0) {
    showAlert('Nenhuma amostra', 'Adicione pelo menos uma amostra para calcular.');
    return;
  }
  
  let hasValidSamples = false;
  calculatedResults = [];
  
  for (const sample of samples) {
    if (validateSample(sample)) {
      try {
        const result = calculateSampleNPK(sample);
        calculatedResults.push(result);
        hasValidSamples = true;
        console.log(`Amostra ${sample.id} calculada com sucesso`);
      } catch (error) {
        console.error(`Erro ao calcular amostra ${sample.id}:`, error);
        showAlert('Erro no cálculo', `Erro ao calcular amostra ${sample.id}: ${error.message}`);
      }
    } else {
      console.log(`Amostra ${sample.id} possui campos obrigatórios vazios`);
    }
  }
  
  if (!hasValidSamples) {
    showAlert('Amostras inválidas', 'Preencha todos os campos obrigatórios das amostras antes de calcular.');
    return;
  }
  
  updateResults();
  updateSummary();
  
  console.log(`${calculatedResults.length} amostras calculadas com sucesso`);
}

function calculateSampleNPK(sample) {
  const cultura = document.getElementById('cultura').value;
  const culturaAntecessora = document.getElementById('cultura-antecessora').value;
  const expectativa = parseFloat(document.getElementById('expectativa-produtividade').value);
  
  const p = parseFloat(sample.p_disponivel);
  const k = parseFloat(sample.k_disponivel);
  const mo = parseFloat(sample.materia_organica);
  const argila = parseFloat(sample.argila);
  const ctc = parseFloat(sample.ctc_ph7);
  
  // Validar valores numéricos
  if (isNaN(p) || isNaN(k) || isNaN(mo) || isNaN(argila) || isNaN(ctc) || isNaN(expectativa)) {
    throw new Error('Valores numéricos inválidos');
  }
  
  // Classificação do P
  let p_classe = 'medio';
  if (argila <= 20) {
    p_classe = classifyNutrient(p, NPK_DATA.interpretacao_P.argila_0_20);
  } else if (argila <= 40) {
    p_classe = classifyNutrient(p, NPK_DATA.interpretacao_P.argila_21_40);
  } else if (argila <= 60) {
    p_classe = classifyNutrient(p, NPK_DATA.interpretacao_P.argila_41_60);
  } else {
    p_classe = classifyNutrient(p, NPK_DATA.interpretacao_P.argila_maior_60);
  }
  
  // Classificação do K
  let k_classe = 'medio';
  if (ctc <= 5) {
    k_classe = classifyNutrient(k, NPK_DATA.interpretacao_K.CTC_baixa_0_5);
  } else if (ctc <= 15) {
    k_classe = classifyNutrient(k, NPK_DATA.interpretacao_K.CTC_media_5_15);
  } else {
    k_classe = classifyNutrient(k, NPK_DATA.interpretacao_K.CTC_alta_maior_15);
  }
  
  // Classificação da MO
  let mo_classe = 'baixo';
  if (mo <= 2.5) {
    mo_classe = 'baixo';
  } else if (mo <= 5.0) {
    mo_classe = 'medio';
  } else {
    mo_classe = 'alto';
  }
  
  // Cálculo do N
  const nData = NPK_DATA.recomendacao_N[cultura];
  if (!nData) {
    throw new Error(`Dados de N não encontrados para a cultura: ${cultura}`);
  }
  
  let indice_mo = 0;
  if (mo <= 2.5) indice_mo = 0;
  else if (mo <= 5.0) indice_mo = 1;
  else indice_mo = 2;
  
  const dose_base_n = nData.doses_base[culturaAntecessora][indice_mo];
  const incremento_n = Math.max(0, expectativa - nData.rendimento_base) * nData.incremento_por_tonelada;
  const n_total = dose_base_n + incremento_n;
  
  // Cálculo do P2O5
  const p_correcao = NPK_DATA.correcao_P2O5[p_classe];
  const p_manutencao = expectativa * NPK_DATA.exportacao_culturas[cultura].P2O5;
  const p2o5_total = p_correcao + p_manutencao;
  
  // Cálculo do K2O
  const k_correcao = NPK_DATA.correcao_K2O[k_classe];
  const k_manutencao = expectativa * NPK_DATA.exportacao_culturas[cultura].K2O;
  const k2o_total = k_correcao + k_manutencao;
  
  return {
    sampleId: sample.id,
    sampleName: sample.local || `Amostra ${sample.id.split('-')[1]}`,
    classifications: {
      p: p_classe,
      k: k_classe,
      mo: mo_classe
    },
    nutrients: {
      n: Math.round(n_total),
      p2o5: {
        correcao: p_correcao,
        manutencao: Math.round(p_manutencao),
        total: Math.round(p2o5_total)
      },
      k2o: {
        correcao: k_correcao,
        manutencao: Math.round(k_manutencao),
        total: Math.round(k2o_total)
      }
    }
  };
}

function classifyNutrient(value, ranges) {
  for (const [level, range] of Object.entries(ranges)) {
    if (value >= range[0] && value <= range[1]) {
      return level;
    }
  }
  return 'medio';
}

function updateResults() {
  const container = document.getElementById('results-container');
  const section = document.getElementById('results-section');
  
  if (!container || !section) {
    console.error('Elementos de resultado não encontrados');
    return;
  }
  
  if (calculatedResults.length === 0) {
    section.style.display = 'none';
    return;
  }
  
  container.innerHTML = '';
  
  for (const result of calculatedResults) {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'result-card';
    
    resultDiv.innerHTML = `
      <div class="result-header">
        <h4>${result.sampleName}</h4>
      </div>
      <div class="result-body">
        <div class="result-grid">
          <div class="result-item">
            <h5>Classificações</h5>
            <p>P: <span class="classification classification--${result.classifications.p}">${formatClassification(result.classifications.p)}</span></p>
            <p>K: <span class="classification classification--${result.classifications.k}">${formatClassification(result.classifications.k)}</span></p>
            <p>MO: <span class="classification classification--${result.classifications.mo}">${formatClassification(result.classifications.mo)}</span></p>
          </div>
          <div class="result-item">
            <h5>Recomendações</h5>
            <p><strong>N:</strong> ${result.nutrients.n} kg/ha</p>
            <p><strong>P₂O₅:</strong> ${result.nutrients.p2o5.total} kg/ha</p>
            <p><strong>K₂O:</strong> ${result.nutrients.k2o.total} kg/ha</p>
          </div>
        </div>
        
        <div class="nutrient-detail">
          <h6>Detalhamento P₂O₅</h6>
          <p>Correção: ${result.nutrients.p2o5.correcao} kg/ha + Manutenção: ${result.nutrients.p2o5.manutencao} kg/ha = Total: ${result.nutrients.p2o5.total} kg/ha</p>
        </div>
        
        <div class="nutrient-detail">
          <h6>Detalhamento K₂O</h6>
          <p>Correção: ${result.nutrients.k2o.correcao} kg/ha + Manutenção: ${result.nutrients.k2o.manutencao} kg/ha = Total: ${result.nutrients.k2o.total} kg/ha</p>
        </div>
      </div>
    `;
    
    container.appendChild(resultDiv);
  }
  
  section.style.display = 'block';
  
  // Scroll para os resultados
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateSummary() {
  const container = document.getElementById('summary-container');
  const section = document.getElementById('summary-section');
  
  if (!container || !section) {
    console.error('Elementos de resumo não encontrados');
    return;
  }
  
  if (calculatedResults.length === 0) {
    section.style.display = 'none';
    return;
  }
  
  const totalAmostras = calculatedResults.length;
  const mediaN = calculatedResults.reduce((sum, r) => sum + r.nutrients.n, 0) / totalAmostras;
  const mediaP = calculatedResults.reduce((sum, r) => sum + r.nutrients.p2o5.total, 0) / totalAmostras;
  const mediaK = calculatedResults.reduce((sum, r) => sum + r.nutrients.k2o.total, 0) / totalAmostras;
  
  // Custo estimado (valores aproximados em R$/kg)
  const custoN = 3.5;
  const custoP = 4.2;
  const custoK = 3.8;
  const area = parseFloat(document.getElementById('area-total').value) || 1;
  
  const custoTotal = (mediaN * custoN + mediaP * custoP + mediaK * custoK) * area;
  
  container.innerHTML = `
    <div class="summary-grid">
      <div class="summary-item">
        <h4>Total de Amostras</h4>
        <div class="summary-value">${totalAmostras}</div>
        <p>amostras calculadas</p>
      </div>
      <div class="summary-item">
        <h4>Média N</h4>
        <div class="summary-value">${Math.round(mediaN)}</div>
        <p>kg/ha</p>
      </div>
      <div class="summary-item">
        <h4>Média P₂O₅</h4>
        <div class="summary-value">${Math.round(mediaP)}</div>
        <p>kg/ha</p>
      </div>
      <div class="summary-item">
        <h4>Média K₂O</h4>
        <div class="summary-value">${Math.round(mediaK)}</div>
        <p>kg/ha</p>
      </div>
      <div class="summary-item">
        <h4>Custo Estimado</h4>
        <div class="summary-value">R$ ${custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        <p>para ${area} ha</p>
      </div>
    </div>
  `;
  
  section.style.display = 'block';
}

function formatClassification(classification) {
  const labels = {
    muito_baixo: 'Muito Baixo',
    baixo: 'Baixo',
    medio: 'Médio',
    alto: 'Alto',
    muito_alto: 'Muito Alto'
  };
  return labels[classification] || classification;
}

// Função de exportação CSV
function exportCSV() {
  console.log('Iniciando exportação CSV...');
  
  if (calculatedResults.length === 0) {
    showAlert('Nenhum resultado', 'Execute os cálculos antes de exportar os dados.');
    return;
  }
  
  try {
    const csv = generateCSVContent();
    downloadCSV(csv, 'recomendacao_npk.csv');
    console.log('CSV exportado com sucesso');
  } catch (error) {
    console.error('Erro na exportação CSV:', error);
    showAlert('Erro na exportação', 'Ocorreu um erro ao gerar o arquivo CSV: ' + error.message);
  }
}

function generateCSVContent() {
  let csv = '';
  const now = new Date().toLocaleString('pt-BR');
  
  // Cabeçalho com configurações globais
  csv += '# RELATÓRIO DE RECOMENDAÇÃO DE ADUBAÇÃO NPK\n';
  csv += `# Gerado em: ${now}\n`;
  csv += `# Município: ${document.getElementById('municipio').value || 'Não informado'}\n`;
  csv += `# Fazenda: ${document.getElementById('fazenda').value || 'Não informado'}\n`;
  csv += `# Talhão: ${document.getElementById('talhao').value || 'Não informado'}\n`;
  csv += `# Cultura: ${document.getElementById('cultura').value}\n`;
  csv += `# Sistema de Manejo: ${document.getElementById('sistema-manejo').value}\n`;
  csv += `# Cultura Antecessora: ${document.getElementById('cultura-antecessora').value}\n`;
  csv += `# Área Total (ha): ${document.getElementById('area-total').value || 'Não informado'}\n`;
  csv += `# Expectativa de Produtividade (t/ha): ${document.getElementById('expectativa-produtividade').value}\n`;
  csv += '\n';
  
  // Cabeçalhos das colunas
  const headers = [
    'ID_Amostra', 'Local', 'pH', 'MO_%', 'P_mg_dm3', 'K_mg_dm3', 
    'Ca_cmolc_dm3', 'Mg_cmolc_dm3', 'Al_cmolc_dm3', 'CTC_pH7', 'Argila_%',
    'Nivel_P', 'Nivel_K', 'Nivel_MO', 'N_kg_ha', 'P2O5_Total_kg_ha', 
    'P2O5_Correcao', 'P2O5_Manutencao', 'K2O_Total_kg_ha', 'K2O_Correcao', 'K2O_Manutencao'
  ];
  csv += headers.join(',') + '\n';
  
  // Dados das amostras
  for (const result of calculatedResults) {
    const sample = samples.find(s => s.id === result.sampleId);
    if (sample) {
      const row = [
        result.sampleId,
        `"${sample.local}"`,
        sample.ph,
        sample.materia_organica,
        sample.p_disponivel,
        sample.k_disponivel,
        sample.ca_trocavel,
        sample.mg_trocavel,
        sample.al_trocavel || '',
        sample.ctc_ph7,
        sample.argila,
        formatClassification(result.classifications.p),
        formatClassification(result.classifications.k),
        formatClassification(result.classifications.mo),
        result.nutrients.n,
        result.nutrients.p2o5.total,
        result.nutrients.p2o5.correcao,
        result.nutrients.p2o5.manutencao,
        result.nutrients.k2o.total,
        result.nutrients.k2o.correcao,
        result.nutrients.k2o.manutencao
      ];
      csv += row.join(',') + '\n';
    }
  }
  
  return csv;
}

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Funções de modal
function showAlert(title, message) {
  const modal = document.getElementById('alert-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  
  if (modal && modalTitle && modalMessage) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.remove('hidden');
  } else {
    // Fallback para alert nativo se modal não estiver disponível
    alert(`${title}: ${message}`);
  }
}

function closeModal() {
  const modal = document.getElementById('alert-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}