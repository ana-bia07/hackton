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
} from "react-native";
// Importando ícones para o FAB (instale lucide-react-native)
import { Plus, Image as ImageIcon, MessageSquare, Vote as VoteIcon, X } from 'lucide-react-native';

type Tela = "pessoal" | "beneficios";

type Aviso = {
  id: number;
  titulo: string;
  descricao: string;
};

const MARROM = "#6b4226";
const BEGE = "#fcf9f7";
const BORDA = "#ede1d9";

export default function Index() {
  const [tela, setTela] = useState<Tela>("pessoal");
  const [muralAtual, setMuralAtual] = useState(0);

  // ESTADOS PARA DINAMISMO (Iniciados com seus dados originais)
  const [listaMurais, setListaMurais] = useState([
    "Campanha do agasalho começa segunda-feira",
    "Treinamento de segurança disponível no app",
    "Atualização de benefícios do mês de maio",
  ]);

  const [listaAvisos, setListaAvisos] = useState<Aviso[]>([
    {
      id: 1,
      titulo: "Aviso importante",
      descricao: "Terá vistoria no setor de produção amanhã às 9h.",
    },
  ]);

  const [votacao, setVotacao] = useState({
    ativa: true,
    pergunta: "Você concorda com a troca da folga do feriado?",
  });

  // ESTADOS DO FAB E MODAL
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState<null | 'Mural' | 'Aviso' | 'Votação'>(null);
  const [tempTitulo, setTempTitulo] = useState("");
  const [tempDesc, setTempDesc] = useState("");

  const mensagemMural = useMemo(() => listaMurais[muralAtual], [muralAtual, listaMurais]);

  function proximoMural() {
    setMuralAtual((prev) => (prev + 1) % listaMurais.length);
  }

  function muralAnterior() {
    setMuralAtual((prev) => (prev - 1 + listaMurais.length) % listaMurais.length);
  }

  // FUNÇÃO PARA ADICIONAR CONTEÚDO
  const salvarNovoConteudo = () => {
    if (!tempTitulo) return Alert.alert("Erro", "Preencha o campo principal.");

    if (modalTipo === 'Mural') {
      setListaMurais([tempTitulo, ...listaMurais]);
    } else if (modalTipo === 'Aviso') {
      setListaAvisos([{ id: Date.now(), titulo: tempTitulo, descricao: tempDesc }, ...listaAvisos]);
    } else if (modalTipo === 'Votação') {
      setVotacao({ ativa: true, pergunta: tempTitulo });
    }

    fecharModais();
  };

  const fecharModais = () => {
    setModalTipo(null);
    setMenuAberto(false);
    setTempTitulo("");
    setTempDesc("");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={MARROM} />
      <View style={styles.container}>
        <Header />

        {tela === "pessoal" && (
          <PessoalScreen
            mensagemMural={mensagemMural}
            muralAtual={muralAtual}
            totalMurais={listaMurais.length}
            onProximo={proximoMural}
            onAnterior={muralAnterior}
            avisos={listaAvisos}
            votacao={votacao}
          />
        )}

        {tela === "beneficios" && <BeneficiosScreen />}

        {/* --- O FAB E SPINNER --- */}
        <View style={styles.fabContainer}>
          {menuAberto && (
            <View style={styles.spinnerMenu}>
              <TouchableOpacity style={styles.spinnerItem} onPress={() => setModalTipo('Mural')}>
                <ImageIcon color="white" size={22} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.spinnerItem} onPress={() => setModalTipo('Aviso')}>
                <MessageSquare color="white" size={22} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.spinnerItem} onPress={() => setModalTipo('Votação')}>
                <VoteIcon color="white" size={22} />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.fab, menuAberto && { backgroundColor: "#333" }]}
            onPress={() => setMenuAberto(!menuAberto)}
          >
            <Plus color="white" size={32} style={menuAberto ? { transform: [{ rotate: '45deg' }] } : {}} />
          </TouchableOpacity>
        </View>

        <BottomNav tela={tela} setTela={setTela} />

        {/* --- MODAL DE CRIAÇÃO --- */}
        <Modal visible={modalTipo !== null} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Criar {modalTipo}</Text>
                <TouchableOpacity onPress={fecharModais}><X size={24} color="#666" /></TouchableOpacity>
              </View>

              <TextInput
                placeholder={modalTipo === 'Votação' ? "Qual a pergunta?" : "Título ou Mensagem..."}
                style={styles.input}
                value={tempTitulo}
                onChangeText={setTempTitulo}
              />
              
              {modalTipo === 'Aviso' && (
                <TextInput
                  placeholder="Descrição do aviso..."
                  style={[styles.input, { height: 100 }]}
                  multiline
                  value={tempDesc}
                  onChangeText={setTempDesc}
                />
              )}

              <TouchableOpacity style={styles.saveButton} onPress={salvarNovoConteudo}>
                <Text style={styles.saveButtonText}>Publicar no Portal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

// --- SEUS COMPONENTES ORIGINAIS (ESTILO MANTIDO) ---

function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>RH Cosmetics</Text>
        <Text style={styles.headerSubtitle}>Portal do colaborador</Text>
      </View>
      <View style={styles.avatar}><Text style={styles.avatarText}>🙂</Text></View>
    </View>
  );
}

function PessoalScreen({
  mensagemMural, muralAtual, totalMurais, onProximo, onAnterior, avisos, votacao
}: any) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Olá, colaborador</Text>
      <Text style={styles.pageSubtitle}>Confira seus avisos, mural e atualizações</Text>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Mural</Text>
        <View style={styles.carouselCard}>
          <Text style={styles.carouselText}>{mensagemMural}</Text>
          <View style={styles.carouselActions}>
            <TouchableOpacity style={styles.smallButton} onPress={onAnterior}><Text style={styles.smallButtonText}>Anterior</Text></TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={onProximo}><Text style={styles.smallButtonText}>Próximo</Text></TouchableOpacity>
          </View>
          <Text style={styles.carouselIndicator}>{muralAtual + 1} de {totalMurais}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Aviso</Text>
        {avisos.map((aviso: any) => (
          <View key={aviso.id} style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>{aviso.titulo}</Text>
            <Text style={styles.noticeDescription}>{aviso.descricao}</Text>
          </View>
        ))}
      </View>

      {votacao.ativa && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Votação</Text>
          <View style={styles.voteCard}>
            <Text style={styles.voteQuestion}>{votacao.pergunta}</Text>
            <View style={styles.voteActions}>
              <TouchableOpacity style={styles.voteButtonOutline} onPress={() => Alert.alert("Voto registrado", "Não")}>
                <Text style={styles.voteButtonOutlineText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.voteButton} onPress={() => Alert.alert("Voto registrado", "Sim")}>
                <Text style={styles.voteButtonText}>Sim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function BeneficiosScreen() {
  return (
    <View style={styles.content}><Text style={styles.pageTitle}>Benefícios</Text></View>
  );
}

function BottomNav({ tela, setTela }: { tela: Tela; setTela: (value: Tela) => void; }) {
  return (
    <View style={styles.nav}>
      <TouchableOpacity style={[styles.navItem, tela === "beneficios" && styles.navItemActive]} onPress={() => setTela("beneficios")}>
        <Text style={styles.navIcon}>💟</Text><Text style={styles.navText}>Benefícios</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navItem, tela === "pessoal" && styles.navItemActive]} onPress={() => setTela("pessoal")}>
        <Text style={styles.navIcon}>👤</Text><Text style={styles.navText}>Pessoal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f3f4f6" },
  container: { flex: 1, backgroundColor: "#fff", width: "100%", maxWidth: 480, alignSelf: "center" },
  header: { height: 68, backgroundColor: MARROM, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },
  headerSubtitle: { color: "rgba(255,255,255,0.78)", fontSize: 11, marginTop: 2, fontWeight: "700" },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 20 },
  content: { padding: 16, paddingBottom: 150 }, // Aumentado para não cobrir o FAB
  pageTitle: { fontSize: 28, fontWeight: "900", color: MARROM },
  pageSubtitle: { fontSize: 14, color: "#64748b", marginTop: 4, marginBottom: 16 },
  sectionCard: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: "#1f2937", marginBottom: 10 },
  carouselCard: { backgroundColor: BEGE, borderColor: BORDA, borderWidth: 1, borderRadius: 20, padding: 18, minHeight: 180, justifyContent: "space-between" },
  carouselText: { fontSize: 17, fontWeight: "700", color: "#334155", lineHeight: 24 },
  carouselActions: { flexDirection: "row", gap: 10, marginTop: 20 },
  smallButton: { flex: 1, backgroundColor: "#fff", borderColor: BORDA, borderWidth: 1, paddingVertical: 12, borderRadius: 14, alignItems: "center" },
  smallButtonText: { color: MARROM, fontWeight: "800", fontSize: 13 },
  carouselIndicator: { textAlign: "center", marginTop: 14, color: "#64748b", fontSize: 12, fontWeight: "700" },
  noticeCard: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 18, padding: 16, marginBottom: 10 },
  noticeTitle: { fontSize: 15, fontWeight: "900", color: MARROM, marginBottom: 6 },
  noticeDescription: { fontSize: 14, color: "#475569", lineHeight: 20 },
  voteCard: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 18, padding: 16 },
  voteQuestion: { fontSize: 15, fontWeight: "800", color: "#1f2937", marginBottom: 14, lineHeight: 22 },
  voteActions: { flexDirection: "row", gap: 10 },
  voteButton: { flex: 1, backgroundColor: MARROM, borderRadius: 14, paddingVertical: 13, alignItems: "center" },
  voteButtonText: { color: "#fff", fontWeight: "900", fontSize: 14 },
  voteButtonOutline: { flex: 1, backgroundColor: "#fff", borderWidth: 1, borderColor: BORDA, borderRadius: 14, paddingVertical: 13, alignItems: "center" },
  voteButtonOutlineText: { color: MARROM, fontWeight: "900", fontSize: 14 },
  nav: { position: "absolute", bottom: 0, left: 0, right: 0, height: 84, backgroundColor: MARROM, flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: 8 },
  navItem: { width: "44%", alignItems: "center", justifyContent: "center", opacity: 0.58, borderRadius: 16, paddingVertical: 8 },
  navItemActive: { backgroundColor: "rgba(255,255,255,0.12)", opacity: 1 },
  navIcon: { fontSize: 22, marginBottom: 4 },
  navText: { color: "#fff", fontSize: 12, fontWeight: "900" },
  
  // ESTILOS NOVOS DO FAB
  fabContainer: { position: 'absolute', bottom: 100, right: 20, alignItems: 'center' },
  fab: { width: 64, height: 64, borderRadius: 32, backgroundColor: MARROM, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5 },
  spinnerMenu: { marginBottom: 15, gap: 12 },
  spinnerItem: { width: 50, height: 50, borderRadius: 25, backgroundColor: MARROM, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  
  // ESTILOS NOVOS DO MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', padding: 24, borderTopLeftRadius: 30, borderTopRightRadius: 30, minHeight: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: '900', color: MARROM },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 16, padding: 18, marginBottom: 16, fontSize: 16, backgroundColor: '#f9f9f9' },
  saveButton: { backgroundColor: MARROM, padding: 20, borderRadius: 18, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: 'white', fontWeight: '900', fontSize: 16 },
});