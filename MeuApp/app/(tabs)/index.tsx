import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  Platform
} from "react-native";
// Importando ícones (Lucide)
import { 
  Plus, 
  Image as ImageIcon, 
  MessageSquare, 
  Vote as VoteIcon, 
  X, 
  ChevronRight, 
  ArrowLeft,
  Heart,
  UserCircle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const IS_WEB = Platform.OS === 'web';

// --- CORES E TEMA ---
const MARROM = "#6b4226";
const BEGE = "#fcf9f7";
const BORDA = "#ede1d9";

export default function App() {
  const [tela, setTela] = useState<"pessoal" | "beneficios">("pessoal");
  
  // --- ESTADOS DE DADOS ---
  const [murais, setMurais] = useState([
    "Campanha do agasalho começa segunda-feira",
    "Treinamento de segurança disponível no app",
    "Nova linha de perfumes Verão 2026"
  ]);
  const [avisos, setAvisos] = useState([
    { id: 1, titulo: "AVISO IMPORTANTE", descricao: "Terá vistoria amanhã às 9h." },
  ]);
  const [votacao, setVotacao] = useState({
    ativa: true,
    pergunta: "Você concorda com a troca da folga do feriado?",
  });

  // --- ESTADOS DE INTERAÇÃO ---
  const [muralAtual, setMuralAtual] = useState(0);
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState<null | 'Mural' | 'Aviso' | 'Votação'>(null);
  const [beneficioSelecionado, setBeneficioSelecionado] = useState<any>(null);

  // Estados dos formulários
  const [tempTitulo, setTempTitulo] = useState("");
  const [tempDesc, setTempDesc] = useState("");

  const mensagemMural = useMemo(() => murais[muralAtual], [muralAtual, murais]);

  // --- FUNÇÕES DE LOGICA ---
  const salvarNovoConteudo = () => {
    if (!tempTitulo) return Alert.alert("Erro", "Preencha o campo principal.");
    if (modalTipo === 'Mural') setMurais([tempTitulo, ...murais]);
    if (modalTipo === 'Aviso') setAvisos([{ id: Date.now(), titulo: tempTitulo, descricao: tempDesc }, ...avisos]);
    if (modalTipo === 'Votação') setVotacao({ ativa: true, pergunta: tempTitulo });
    
    setModalTipo(null);
    setMenuAberto(false);
    setTempTitulo("");
    setTempDesc("");
  };

  // --- RENDERIZAÇÃO DE TELAS ---

  const renderPessoal = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>Olá, colaborador</Text>
      <Text style={styles.pageSubtitle}>Confira seus avisos e atualizações</Text>

      {/* MURAL */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Mural</Text>
        <View style={styles.carouselCard}>
          <Text style={styles.carouselText}>{mensagemMural}</Text>
          <View style={styles.carouselActions}>
            <TouchableOpacity style={styles.smallButton} onPress={() => setMuralAtual((prev) => (prev - 1 + murais.length) % murais.length)}>
              <Text style={styles.smallButtonText}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={() => setMuralAtual((prev) => (prev + 1) % murais.length)}>
              <Text style={styles.smallButtonText}>Próximo</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.carouselIndicator}>{muralAtual + 1} de {murais.length}</Text>
        </View>
      </View>

      {/* AVISOS */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Avisos</Text>
        {avisos.map((aviso) => (
          <View key={aviso.id} style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>{aviso.titulo}</Text>
            <Text style={styles.noticeDescription}>{aviso.descricao}</Text>
          </View>
        ))}
      </View>

      {/* VOTAÇÃO */}
      {votacao.ativa && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Votação</Text>
          <View style={styles.voteCard}>
            <Text style={styles.voteQuestion}>{votacao.pergunta}</Text>
            <View style={styles.voteActions}>
              <TouchableOpacity style={styles.voteButtonOutline} onPress={() => Alert.alert("Votado", "Não")}><Text style={styles.voteButtonOutlineText}>Não</Text></TouchableOpacity>
              <TouchableOpacity style={styles.voteButton} onPress={() => Alert.alert("Votado", "Sim")}><Text style={styles.voteButtonText}>Sim</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderBeneficios = () => {
   const lista = [
      { id: 1, titulo: "Vale transporte", emoji: "🚌", descricao: "Consulte regras e solicite alteração." },
      { id: 2, titulo: "Convênio", emoji: "🏥", descricao: "Veja dependentes e informações do plano." },
      { id: 3, titulo: "Cesta básica", emoji: "🧺", descricao: "Consulte datas e regras de recebimento." },
      { id: 4, titulo: "Auxílio creche", emoji: "🍼", descricao: "Consulte elegibilidade e prazos." },
    ];

  // 2. ADICIONE ISSO: Se clicou em Convênio, chama a função do Convênio
  if (beneficioSelecionado?.titulo === "Convênio") {
    return <RenderConvenio onBack={() => setBeneficioSelecionado(null)} />;
  }

  if (beneficioSelecionado?.titulo === "Cesta básica") {
    return <RenderCestaBasica onBack={() => setBeneficioSelecionado(null)} />;
  }


  // 3. Se tiver algo selecionado que não criamos tela específica ainda (Tela Genérica)
  if (beneficioSelecionado) {
    return (
      <View style={styles.detalheFull}>
        <TouchableOpacity onPress={() => setBeneficioSelecionado(null)} style={styles.backBtn}>
          <ArrowLeft size={20} color={MARROM} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <View style={styles.detalheContent}>
          <Text style={{ fontSize: 60 }}>{beneficioSelecionado.emoji}</Text>
          <Text style={styles.detalheTitle}>{beneficioSelecionado.titulo}</Text>
          <Text style={styles.detalheDesc}>Informações de {beneficioSelecionado.titulo} em breve.</Text>
        </View>
      </View>
    );
  }

  // 4. Se não tiver nada selecionado, mostra a lista de cards (Grid)
 return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>Benefícios</Text>
      <View style={styles.grid}>
        {lista.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.benefitCard} 
            onPress={() => setBeneficioSelecionado(item)}
          >
            <View style={styles.iconBox}>
              <Text style={{fontSize: 22}}>{item.emoji}</Text>
            </View>
            <Text style={styles.benefitTitle}>{item.titulo}</Text>
            <ChevronRight size={14} color={MARROM} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
  };

const RenderConvenio = ({ onBack }: { onBack: () => void }) => {
  // Dados simulando o que viria das tabelas 'funcionario' e 'beneficios'
  const [dadosFuncionario] = useState({
    nome: "João Silva",        // funcionario.nome
    status: "ATIVO",           // (Lógica baseada no vínculo da tabela)
    totalDependentes: 1        // (Contagem de dependentes)
  });

  return (
    <View style={styles.detalheFull}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <ArrowLeft size={20} color={MARROM} />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.detalheContent}>
        <Text style={{ fontSize: 60 }}>🏥</Text>
        <Text style={styles.detalheTitle}>Convênio Médico</Text>
        
        {/* CARD PRINCIPAL COM NOME E INDICADORES */}
        <View style={styles.cardStatusContainer}>
          <View style={styles.cardStatusHeader}>
             <View>
                <Text style={styles.statusLabel}>Funcionário</Text>
                <Text style={styles.statusNome}>{dadosFuncionario.nome}</Text>
             </View>
             <View style={styles.badgeAtivo}>
                <Text style={styles.badgeText}>{dadosFuncionario.status}</Text>
             </View>
          </View>
          
          <View style={styles.cardStatusFooter}>
             <View style={styles.indicadorItem}>
                <Text style={styles.indicadorValor}>{dadosFuncionario.totalDependentes}</Text>
                <Text style={styles.indicadorLabel}>Dependentes</Text>
             </View>
             <View style={styles.indicadorDivider} />
             <View style={styles.indicadorItem}>
                <Text style={styles.indicadorValor}>Enfermaria</Text>
                <Text style={styles.indicadorLabel}>Plano</Text>
             </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
const RenderCestaBasica = ({ onBack }: { onBack: () => void }) => {
  // Filtro: 'todos' ou 'pendentes' (amarelos)
  const [filtro, setFiltro] = useState<'todos' | 'pendentes'>('todos');

  // Dados simulados baseados na sua tabela 'funcionario' e 'beneficios'
  const [listaPedidos] = useState([
    { id: 1, nome: "João Silva", tipo: "Porta a Porta", mudanca: false },
    { id: 2, nome: "Ana Beatriz", tipo: "Retirada", mudanca: true }, // Amarelo
    { id: 3, nome: "Carlos Eduardo", tipo: "Retirada", mudanca: false },
    { id: 4, nome: "Mariana Costa", tipo: "Porta a Porta", mudanca: true }, // Amarelo
  ]);

  const pedidosFiltrados = filtro === 'pendentes' 
    ? listaPedidos.filter(p => p.mudanca) 
    : listaPedidos;

  return (
    <View style={styles.detalheFull}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <ArrowLeft size={20} color={MARROM} />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
      
      <View style={styles.filtroContainer}>
        <TouchableOpacity 
          style={[styles.filtroBtn, filtro === 'todos' && styles.filtroBtnAtivo]}
          onPress={() => setFiltro('todos')}
        >
          <Text style={[styles.filtroBtnText, filtro === 'todos' && styles.filtroBtnTextAtivo]}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filtroBtn, filtro === 'pendentes' && styles.filtroBtnAtivo]}
          onPress={() => setFiltro('pendentes')}
        >
          <Text style={[styles.filtroBtnText, filtro === 'pendentes' && styles.filtroBtnTextAtivo]}>Solicitações</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.detalheContent}>
        <Text style={{ fontSize: 40, textAlign: 'center' }}>🧺</Text>
        <Text style={styles.detalheTitle}>Cesta Básica</Text>
        
        {pedidosFiltrados.map((item) => (
          <View 
            key={item.id} 
            style={[styles.cestaCard, item.mudanca && styles.cestaCardAlerta]}
          >
            <View>
              <Text style={styles.cestaNome}>{item.nome}</Text>
              <Text style={styles.cestaTipo}>Modalidade: {item.tipo}</Text>
            </View>
            {item.mudanca && (
              <View style={styles.tagAlerta}>
                <Text style={styles.tagAlertaText}>PEDIDO DE MUDANÇA</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const RenderAuxilioCreche = ({ onBack }: { onBack: () => void }) => {
  const [pessoaSelecionada, setPessoaSelecionada] = useState<any>(null);

  // Dados baseados na estrutura de 'funcionario' (id, nome, idade/filho)
  const [listaCreche] = useState([
    { id: 1, nome: "Mariana Costa", status: "ATIVO", filho: "Enzo", idadeFilho: 2 },
    { id: 2, nome: "Roberto Souza", status: "PENDENTE", filho: "Julia", idadeFilho: 4 },
  ]);

  // Sub-tela de envio de arquivo
  if (pessoaSelecionada) {
    return (
      <View style={styles.detalheFull}>
        <TouchableOpacity onPress={() => setPessoaSelecionada(null)} style={styles.backBtn}>
          <ArrowLeft size={20} color={MARROM} />
          <Text style={styles.backText}>Voltar para Lista</Text>
        </TouchableOpacity>
        
        <ScrollView contentContainerStyle={styles.detalheContent}>
          <View style={styles.avatarGrande}><Text style={{fontSize: 40}}>👶</Text></View>
          <Text style={styles.detalheTitle}>{pessoaSelecionada.nome}</Text>
          <Text style={styles.detalheDesc}>Dependente: {pessoaSelecionada.filho} ({pessoaSelecionada.idadeFilho} anos)</Text>

          <View style={styles.uploadArea}>
            <ImageIcon size={32} color="#cbd5e1" />
            <Text style={styles.uploadText}>Comprovante de Vínculo / Idade</Text>
            <TouchableOpacity style={styles.uploadBtn}>
              <Text style={styles.uploadBtnText}>Selecionar Arquivo</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={() => {
              Alert.alert("Sucesso", "Documento enviado para análise.");
              setPessoaSelecionada(null);
            }}
          >
            <Text style={styles.saveButtonText}>Enviar Comprovação</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.detalheFull}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <ArrowLeft size={20} color={MARROM} />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.detalheContent}>
        <Text style={{ fontSize: 40, textAlign: 'center' }}>🍼</Text>
        <Text style={styles.detalheTitle}>Auxílio Creche</Text>
        
        {listaCreche.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.crecheCard}
            onPress={() => setPessoaSelecionada(item)}
          >
            <View>
              <Text style={styles.cestaNome}>{item.nome}</Text>
              <Text style={styles.statusLabel}>Status: {item.status}</Text>
            </View>
            <View style={[styles.badgeStatus, item.status === 'PENDENTE' && { backgroundColor: '#fef9c3' }]}>
              <ChevronRight size={16} color={MARROM} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

  return (
    <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>RH Cosmetics</Text>
              <Text style={styles.headerSubtitle}>Portal do Colaborador</Text>
            </View>
            <View style={styles.avatar}><Text>🙂</Text></View>
          </View>

          {/* CONTEÚDO DINÂMICO */}
          {tela === "pessoal" ? renderPessoal() : renderBeneficios()}

          {/* FAB & SPINNER */}
          <View style={styles.fabContainer}>
            {menuAberto && (
              <View style={styles.spinnerMenu}>
                <TouchableOpacity style={styles.spinnerItem} onPress={() => setModalTipo('Mural')}><ImageIcon color="white" size={20} /></TouchableOpacity>
                <TouchableOpacity style={styles.spinnerItem} onPress={() => setModalTipo('Aviso')}><MessageSquare color="white" size={20} /></TouchableOpacity>
                <TouchableOpacity style={styles.spinnerItem} onPress={() => setModalTipo('Votação')}><VoteIcon color="white" size={20} /></TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={[styles.fab, menuAberto && {backgroundColor: '#333'}]} onPress={() => setMenuAberto(!menuAberto)}>
              <Plus color="white" size={30} style={menuAberto ? {transform: [{rotate: '45deg'}]} : {}} />
            </TouchableOpacity>
          </View>

          {/* BOTTOM NAV */}
          <View style={styles.nav}>
            <TouchableOpacity style={[styles.navItem, tela === "beneficios" && styles.navItemActive]} onPress={() => {setTela("beneficios"); setBeneficioSelecionado(null)}}>
              <Heart color="white" size={24} opacity={tela === "beneficios" ? 1 : 0.5} />
              <Text style={[styles.navText, {opacity: tela === "beneficios" ? 1 : 0.5}]}>Benefícios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navItem, tela === "pessoal" && styles.navItemActive]} onPress={() => setTela("pessoal")}>
              <UserCircle color="white" size={24} opacity={tela === "pessoal" ? 1 : 0.5} />
              <Text style={[styles.navText, {opacity: tela === "pessoal" ? 1 : 0.5}]}>Pessoal</Text>
            </TouchableOpacity>
          </View>

          {/* MODAL DE CRIAÇÃO */}
          <Modal visible={modalTipo !== null} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Novo {modalTipo}</Text>
                  <TouchableOpacity onPress={() => setModalTipo(null)}><X size={24} color="#666" /></TouchableOpacity>
                </View>
                <TextInput placeholder="Título ou Pergunta..." style={styles.input} value={tempTitulo} onChangeText={setTempTitulo} />
                {modalTipo === 'Aviso' && <TextInput placeholder="Descrição..." style={[styles.input, {height: 80}]} multiline value={tempDesc} onChangeText={setTempDesc} />}
                <TouchableOpacity style={styles.saveButton} onPress={salvarNovoConteudo}><Text style={styles.saveButtonText}>Publicar</Text></TouchableOpacity>
              </View>
            </View>
          </Modal>

        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    // Limita a largura no Web para não esticar, mas mantém 100% no celular
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    alignSelf: 'center',
  },
  scrollContent: {
    // flexGrow: 1 garante que o conteúdo possa expandir para scrollar
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  // Reajuste do card do convênio para não esticar demais
  cardStatusContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 20,
    overflow: 'hidden',
  },
  header: { height: 70, backgroundColor: MARROM, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },
  headerSubtitle: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  pageTitle: { fontSize: 28, fontWeight: "900", color: MARROM, marginBottom: 5 },
  pageSubtitle: { fontSize: 14, color: "#64748b", marginBottom: 20 },
  sectionCard: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "900", marginBottom: 10 },
  carouselCard: { backgroundColor: BEGE, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: BORDA, minHeight: 160, justifyContent: 'space-between' },
  carouselText: { fontSize: 16, fontWeight: "700", color: "#444" },
  carouselActions: { flexDirection: "row", gap: 10 },
  smallButton: { flex: 1, backgroundColor: "#fff", padding: 10, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: BORDA },
  smallButtonText: { color: MARROM, fontWeight: "800", fontSize: 12 },
  carouselIndicator: { textAlign: 'center', fontSize: 10, color: '#999', marginTop: 10 },
  noticeCard: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#eee", borderRadius: 15, padding: 15, marginBottom: 10 },
  noticeTitle: { fontSize: 14, fontWeight: "900", color: MARROM },
  noticeDescription: { fontSize: 13, color: "#666" },
  voteCard: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#eee", borderRadius: 15, padding: 15 },
  voteQuestion: { fontWeight: "800", marginBottom: 15 },
  voteActions: { flexDirection: "row", gap: 10 },
  voteButton: { flex: 1, backgroundColor: MARROM, padding: 12, borderRadius: 10, alignItems: "center" },
  voteButtonText: { color: "white", fontWeight: "900" },
  voteButtonOutline: { flex: 1, borderWidth: 1, borderColor: BORDA, padding: 12, borderRadius: 10, alignItems: "center" },
  voteButtonOutlineText: { color: MARROM, fontWeight: "900" },
  // BENEFICIOS
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  benefitCard: { width: '100%', backgroundColor: '#fff', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#eee', marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBox: { width: 45, height: 45, backgroundColor: BEGE, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  benefitTitle: { flex: 1, marginLeft: 15, fontWeight: '800', color: '#333' },
  backBtn: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backText: { marginLeft: 10, fontWeight: '800', color: MARROM },
  detalheContent: { padding: 40, alignItems: 'center' },
  detalheTitle: { fontSize: 24, fontWeight: '900', color: MARROM, marginTop: 20 },
  detalheDesc: { textAlign: 'center', color: '#666', marginTop: 10 },
  // FAB
  fabContainer: { position: 'absolute', bottom: 100, right: 20, alignItems: 'center' },
  fab: { width: 60, height: 60, borderRadius: 30, backgroundColor: MARROM, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  spinnerMenu: { marginBottom: 10, gap: 10 },
  spinnerItem: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: MARROM, justifyContent: 'center', alignItems: 'center' },
  // NAV
  nav: { position: 'absolute', bottom: 0, width: '100%', height: 80, backgroundColor: MARROM, flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  navItem: { alignItems: 'center' },
  navItemActive: { opacity: 1 },
  navText: { color: "white", fontWeight: "900", fontSize: 10, marginTop: 4 },
  // MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: MARROM },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 15, marginBottom: 15 },
  saveButton: { backgroundColor: MARROM, padding: 18, borderRadius: 15, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: '900' },

  //TRANSPORTE  
  cardStatus: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  statusLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusNome: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
  },
  badgeAtivo: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '900',
  },
  sectionDependente: {
    width: '100%',
    marginTop: 25,
    marginBottom: 20,
  },
  sectionTitleInterno: {
    fontSize: 14,
    fontWeight: '900',
    color: MARROM,
    marginBottom: 10,
  },
  itemDependente: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 15,
    gap: 10,
  },
  nomeDependente: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  semDependente: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  detalheFull: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardStatusHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cardStatusFooter: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc', // Cor de fundo levemente diferente para o rodapé do card
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  indicadorItem: {
    flex: 1,
    alignItems: 'center',
  },
  indicadorValor: {
    fontSize: 16,
    fontWeight: '900',
    color: MARROM,
  },
  indicadorLabel: {
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  indicadorDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e2e8f0',
  },

  //CESTA BASICA
  filtroContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#f8fafc',
  },
  filtroBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filtroBtnAtivo: {
    backgroundColor: MARROM,
    borderColor: MARROM,
  },
  filtroBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666',
  },
  filtroBtnTextAtivo: {
    color: '#fff',
  },
  cestaCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cestaCardAlerta: {
    backgroundColor: '#fefce8', // Amarelo claro
    borderColor: '#fef08a',     // Borda amarela
    borderWidth: 2,
  },
  cestaNome: {
    fontSize: 15,
    fontWeight: '900',
    color: '#333',
  },
  cestaTipo: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  tagAlerta: {
    backgroundColor: '#facc15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagAlertaText: {
    fontSize: 8,
    fontWeight: '900',
    color: MARROM,
  },
  //CESTA BASICA
  crecheCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarGrande: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: BEGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  uploadArea: {
    width: '100%',
    height: 180,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  uploadText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '600',
  },
  uploadBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  uploadBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: MARROM,
  },
  badgeStatus: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  }
});