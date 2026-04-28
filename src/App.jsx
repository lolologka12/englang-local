import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Plus, X, BookOpen, BrainCircuit, Filter, BarChart3, Trash2, Search, Volume2, Gauge, Globe, Languages, ArrowRightLeft, ArrowDownToLine } from 'lucide-react';
import './App.css';

// =========================================
// СЛОВАРЬ ПЕРЕВОДОВ ИНТЕРФЕЙСА
// =========================================
const TRANSLATIONS = {
  ru: {
    appTitle: "Мой Словарь", tabDict: "Словарь", tabTrain: "Тренировка", tabStats: "Статистика", tabTrans: "Переводчик", logout: "Выйти",
    search: "Найти слово...", filterAll: "Все темы", sortNew: "Новые", sortEn: "А-Я (Англ)", sortRu: "А-Я (Перевод)",
    emptyDict: "Ничего не найдено.", newWord: "Новое слово", phEng: "Английское слово*", phTrans: "Перевод*", phPhrase: "Пример (необязательно)",
    phTheme: "Тема (необязательно)", btnAdd: "Добавить", btnSave: "Сохранить", btnLoading: "Загрузка...", btnPhoto: "Фото",
    editTitle: "Характеристика", confirmDel: "Точно удалить слово?", errExists: "уже есть!", errEngReq: "Впиши слово на английском!", errImg: "Ошибка поиска",
    trainModeEnRu: "🇬🇧 Англ ➔ Перевод", trainModeRuEn: "🇷🇺 Перевод ➔ Англ", trainModeRand: "🔀 Вперемешку", trainLeft: "Осталось:",
    clickFlip: "Нажми, чтобы перевернуть", rateAgain: "Снова", rateHard: "Трудно", rateGood: "Хорошо", rateEasy: "Легко",
    finishTitle: "Отличная работа!", finishAll: "Тренировать ВСЕ", finishNew: "Проверить новые", trainThemes: "Тренировка по темам:",
    statTitle: "Твой прогресс", statWords: "Слов:", statLearned: "Выучено навсегда (>21 дня)", statLearning: "В процессе", statNew: "Новые",
    hardTitle: "Самые сложные слова", hardSubAll: "Слова, на которых ты нажимал 'Снова'", hardSubTheme: "Сложные слова в теме", hardEmpty: "Отличная работа, сложных слов нет!",
    themeAnalysis: "Анализ тем", themeSub: "Уровень освоения", tGood: "Хорошо", tOk: "Средне", tHard: "Сложно",
    authLog: "Вход", authReg: "Регистрация", authEmail: "Email", authPass: "Пароль", authBtnLog: "Войти", authBtnReg: "Создать", authTogReg: "Регистрация", authTogLog: "Вход", authOk: "Успешно! Теперь нажми 'Войти'",
    trPlaceholder: "Введите текст...", trTranslateBtn: "Перевести", trAddDictBtn: "Добавить в словарь", errTrans: "Ошибка перевода"
  },
  uk: {
    appTitle: "Мій Словник", tabDict: "Словник", tabTrain: "Тренування", tabStats: "Статистика", tabTrans: "Перекладач", logout: "Вийти",
    search: "Знайти слово...", filterAll: "Всі теми", sortNew: "Нові", sortEn: "А-Я (Англ)", sortRu: "А-Я (Переклад)",
    emptyDict: "Нічого не знайдено.", newWord: "Нове слово", phEng: "Англійське слово*", phTrans: "Переклад*", phPhrase: "Приклад (необов'язково)",
    phTheme: "Тема (необов'язково)", btnAdd: "Додати", btnSave: "Зберегти", btnLoading: "Завантаження...", btnPhoto: "Фото",
    editTitle: "Характеристика", confirmDel: "Точно видалити слово?", errExists: "вже є!", errEngReq: "Впиши слово англійською!", errImg: "Помилка пошуку",
    trainModeEnRu: "🇬🇧 Англ ➔ Переклад", trainModeRuEn: "🇺🇦 Переклад ➔ Англ", trainModeRand: "🔀 Упереміш", trainLeft: "Залишилось:",
    clickFlip: "Натисни, щоб перевернути", rateAgain: "Знову", rateHard: "Важко", rateGood: "Добре", rateEasy: "Легко",
    finishTitle: "Відмінна робота!", finishAll: "Тренувати ВСІ", finishNew: "Перевірити нові", trainThemes: "Тренування за темами:",
    statTitle: "Твій прогрес", statWords: "Слів:", statLearned: "Вивчено назавжди (>21 дня)", statLearning: "В процесі", statNew: "Нові",
    hardTitle: "Найскладніші слова", hardSubAll: "Слова, на яких ти натискав 'Знову'", hardSubTheme: "Складні слова в темі", hardEmpty: "Відмінна робота, складних слів немає!",
    themeAnalysis: "Аналіз тем", themeSub: "Рівень засвоєння", tGood: "Добре", tOk: "Середньо", tHard: "Складно",
    authLog: "Вхід", authReg: "Реєстрація", authEmail: "Email", authPass: "Пароль", authBtnLog: "Увійти", authBtnReg: "Створити", authTogReg: "Реєстрація", authTogLog: "Вхід", authOk: "Успішно! Тепер натисни 'Увійти'",
    trPlaceholder: "Введіть текст...", trTranslateBtn: "Перекласти", trAddDictBtn: "Додати до словника", errTrans: "Помилка перекладу"
  },
  en: {
    appTitle: "My Dictionary", tabDict: "Dictionary", tabTrain: "Training", tabStats: "Statistics", tabTrans: "Translator", logout: "Logout",
    search: "Search word...", filterAll: "All themes", sortNew: "Newest", sortEn: "A-Z (English)", sortRu: "A-Z (Translation)",
    emptyDict: "Nothing found.", newWord: "New Word", phEng: "English word*", phTrans: "Translation*", phPhrase: "Example phrase (optional)",
    phTheme: "Theme (optional)", btnAdd: "Add", btnSave: "Save", btnLoading: "Loading...", btnPhoto: "Photo",
    editTitle: "Word Details", confirmDel: "Are you sure you want to delete?", errExists: "already exists!", errEngReq: "Enter an English word first!", errImg: "Error searching images",
    trainModeEnRu: "🇬🇧 Eng ➔ Trans", trainModeRuEn: "🔄 Trans ➔ Eng", trainModeRand: "🔀 Random", trainLeft: "Remaining:",
    clickFlip: "Click to flip", rateAgain: "Again", rateHard: "Hard", rateGood: "Good", rateEasy: "Easy",
    finishTitle: "Great job!", finishAll: "Train ALL words", finishNew: "Check new words", trainThemes: "Train by themes:",
    statTitle: "Your Progress", statWords: "Words:", statLearned: "Learned forever (>21 days)", statLearning: "Learning", statNew: "New",
    hardTitle: "Hardest Words", hardSubAll: "Words where you clicked 'Again'", hardSubTheme: "Hard words in theme", hardEmpty: "Great job, no hard words!",
    themeAnalysis: "Theme Analysis", themeSub: "Mastery level", tGood: "Good", tOk: "Ok", tHard: "Hard",
    authLog: "Login", authReg: "Register", authEmail: "Email", authPass: "Password", authBtnLog: "Login", authBtnReg: "Create", authTogReg: "Register", authTogLog: "Login", authOk: "Success! Now click 'Login'",
    trPlaceholder: "Enter text...", trTranslateBtn: "Translate", trAddDictBtn: "Add to dictionary", errTrans: "Translation error"
  },
  es: {
    appTitle: "Mi Diccionario", tabDict: "Diccionario", tabTrain: "Entrenamiento", tabStats: "Estadísticas", tabTrans: "Traductor", logout: "Salir",
    search: "Buscar palabra...", filterAll: "Todos los temas", sortNew: "Nuevos", sortEn: "A-Z (Inglés)", sortRu: "A-Z (Traducción)",
    emptyDict: "No se encontró nada.", newWord: "Nueva palabra", phEng: "Palabra en inglés*", phTrans: "Traducción*", phPhrase: "Frase de ejemplo (opcional)",
    phTheme: "Tema (opcional)", btnAdd: "Añadir", btnSave: "Guardar", btnLoading: "Cargando...", btnPhoto: "Foto",
    editTitle: "Detalles", confirmDel: "¿Seguro que quieres borrarlo?", errExists: "¡ya existe!", errEngReq: "¡Escribe la palabra en inglés primero!", errImg: "Error al buscar",
    trainModeEnRu: "🇬🇧 Ing ➔ Trad", trainModeRuEn: "🔄 Trad ➔ Ing", trainModeRand: "🔀 Aleatorio", trainLeft: "Restante:",
    clickFlip: "Haz clic para girar", rateAgain: "Otra vez", rateHard: "Difícil", rateGood: "Bien", rateEasy: "Fácil",
    finishTitle: "¡Gran trabajo!", finishAll: "Entrenar TODAS", finishNew: "Revisar nuevas", trainThemes: "Entrenar por temas:",
    statTitle: "Tu Progreso", statWords: "Palabras:", statLearned: "Aprendidas (>21 días)", statLearning: "Aprendiendo", statNew: "Nuevas",
    hardTitle: "Palabras difíciles", hardSubAll: "Marcadas 'Otra vez'", hardSubTheme: "Difíciles en tema", hardEmpty: "¡Bien hecho, no hay palabras difíciles!",
    themeAnalysis: "Análisis de temas", themeSub: "Nivel de dominio", tGood: "Bien", tOk: "Medio", tHard: "Difícil",
    authLog: "Entrar", authReg: "Registro", authEmail: "Email", authPass: "Contraseña", authBtnLog: "Entrar", authBtnReg: "Crear", authTogReg: "Registro", authTogLog: "Entrar", authOk: "¡Éxito! Ahora pulsa 'Entrar'",
    trPlaceholder: "Ingrese texto...", trTranslateBtn: "Traducir", trAddDictBtn: "Añadir al diccionario", errTrans: "Error de traducción"
  },
  fr: {
    appTitle: "Mon Dico", tabDict: "Dictionnaire", tabTrain: "Entraînement", tabStats: "Statistiques", tabTrans: "Traducteur", logout: "Quitter",
    search: "Chercher...", filterAll: "Tous", sortNew: "Nouveaux", sortEn: "A-Z (Anglais)", sortRu: "A-Z (Traduction)",
    emptyDict: "Rien trouvé.", newWord: "Nouveau mot", phEng: "Mot en anglais*", phTrans: "Traduction*", phPhrase: "Exemple (optionnel)",
    phTheme: "Thème (optionnel)", btnAdd: "Ajouter", btnSave: "Sauvegarder", btnLoading: "Chargement...", btnPhoto: "Photo",
    editTitle: "Détails", confirmDel: "Voulez-vous supprimer ?", errExists: "existe déjà !", errEngReq: "Entrez le mot en anglais !", errImg: "Erreur",
    trainModeEnRu: "🇬🇧 Ang ➔ Trad", trainModeRuEn: "🔄 Trad ➔ Ang", trainModeRand: "🔀 Aléatoire", trainLeft: "Reste:",
    clickFlip: "Cliquez pour retourner", rateAgain: "Encore", rateHard: "Difficile", rateGood: "Bien", rateEasy: "Facile",
    finishTitle: "Bon travail !", finishAll: "Entraîner TOUT", finishNew: "Vérifier nouveaux", trainThemes: "Entraîner par thème:",
    statTitle: "Ton Progrès", statWords: "Mots:", statLearned: "Appris (>21 jours)", statLearning: "En cours", statNew: "Nouveaux",
    hardTitle: "Mots difficiles", hardSubAll: "Mots 'Encore'", hardSubTheme: "Difficiles du thème", hardEmpty: "Aucun mot difficile !",
    themeAnalysis: "Analyse des thèmes", themeSub: "Niveau de maîtrise", tGood: "Bien", tOk: "Moyen", tHard: "Difficile",
    authLog: "Connexion", authReg: "Inscription", authEmail: "Email", authPass: "Mot de passe", authBtnLog: "Connexion", authBtnReg: "Créer", authTogReg: "Inscription", authTogLog: "Connexion", authOk: "Succès ! Cliquez sur 'Connexion'",
    trPlaceholder: "Entrez le texte...", trTranslateBtn: "Traduire", trAddDictBtn: "Ajouter au dictionnaire", errTrans: "Erreur de traduction"
  },
  de: {
    appTitle: "Mein Wörterbuch", tabDict: "Wörterbuch", tabTrain: "Training", tabStats: "Statistik", tabTrans: "Übersetzer", logout: "Abmelden",
    search: "Suchen...", filterAll: "Alle Themen", sortNew: "Neu", sortEn: "A-Z (Englisch)", sortRu: "A-Z (Übersetzung)",
    emptyDict: "Nichts gefunden.", newWord: "Neues Wort", phEng: "Englisches Wort*", phTrans: "Übersetzung*", phPhrase: "Beispielsatz (optional)",
    phTheme: "Thema (optional)", btnAdd: "Hinzufügen", btnSave: "Speichern", btnLoading: "Laden...", btnPhoto: "Foto",
    editTitle: "Details", confirmDel: "Wirklich löschen?", errExists: "existiert bereits!", errEngReq: "Englisches Wort eingeben!", errImg: "Fehler",
    trainModeEnRu: "🇬🇧 Eng ➔ Über", trainModeRuEn: "🔄 Über ➔ Eng", trainModeRand: "🔀 Zufällig", trainLeft: "Übrig:",
    clickFlip: "Zum Umdrehen klicken", rateAgain: "Nochmal", rateHard: "Schwer", rateGood: "Gut", rateEasy: "Einfach",
    finishTitle: "Tolle Arbeit!", finishAll: "ALLE trainieren", finishNew: "Neue prüfen", trainThemes: "Nach Themen:",
    statTitle: "Dein Fortschritt", statWords: "Wörter:", statLearned: "Gelernt (>21 Tage)", statLearning: "Im Prozess", statNew: "Neu",
    hardTitle: "Schwerste Wörter", hardSubAll: "Wörter mit 'Nochmal'", hardSubTheme: "Schwer im Thema", hardEmpty: "Keine schweren Wörter!",
    themeAnalysis: "Themen-Analyse", themeSub: "Beherrschungsgrad", tGood: "Gut", tOk: "Mittel", tHard: "Schwer",
    authLog: "Anmelden", authReg: "Registrieren", authEmail: "E-Mail", authPass: "Passwort", authBtnLog: "Anmelden", authBtnReg: "Erstellen", authTogReg: "Registrieren", authTogLog: "Anmelden", authOk: "Erfolg! Klicke 'Anmelden'",
    trPlaceholder: "Text eingeben...", trTranslateBtn: "Übersetzen", trAddDictBtn: "Zum Wörterbuch hinzufügen", errTrans: "Übersetzungsfehler"
  },
  ja: {
    appTitle: "私の辞書", tabDict: "辞書", tabTrain: "トレーニング", tabStats: "統計", tabTrans: "翻訳者", logout: "ログアウト",
    search: "検索...", filterAll: "すべてのテーマ", sortNew: "新しい順", sortEn: "A-Z (英語)", sortRu: "A-Z (翻訳)",
    emptyDict: "見つかりません。", newWord: "新しい単語", phEng: "英単語*", phTrans: "翻訳*", phPhrase: "例文（任意）",
    phTheme: "テーマ（任意）", btnAdd: "追加", btnSave: "保存", btnLoading: "ロード中...", btnPhoto: "写真",
    editTitle: "詳細", confirmDel: "本当に削除しますか？", errExists: "すでに存在します！", errEngReq: "まず英単語を入力してください！", errImg: "エラー",
    trainModeEnRu: "🇬🇧 英 ➔ 訳", trainModeRuEn: "🔄 訳 ➔ 英", trainModeRand: "🔀 ランダム", trainLeft: "残り:",
    clickFlip: "クリックして裏返す", rateAgain: "もう一度", rateHard: "難しい", rateGood: "普通", rateEasy: "簡単",
    finishTitle: "よくできました！", finishAll: "すべてトレーニング", finishNew: "新しい単語を確認", trainThemes: "テーマ別:",
    statTitle: "進捗状況", statWords: "単語数:", statLearned: "習得済み (>21日)", statLearning: "学習中", statNew: "新規",
    hardTitle: "苦手な単語", hardSubAll: "「もう一度」を押した単語", hardSubTheme: "テーマ内の苦手な単語", hardEmpty: "苦手な単語はありません！",
    themeAnalysis: "テーマ分析", themeSub: "習熟度", tGood: "良い", tOk: "普通", tHard: "難しい",
    authLog: "ログイン", authReg: "登録", authEmail: "メール", authPass: "パスワード", authBtnLog: "ログイン", authBtnReg: "作成", authTogReg: "登録", authTogLog: "ログイン", authOk: "成功！",
    trPlaceholder: "テキストを入力...", trTranslateBtn: "翻訳する", trAddDictBtn: "辞書に追加", errTrans: "翻訳エラー"
  },
  zh: {
    appTitle: "我的字典", tabDict: "字典", tabTrain: "训练", tabStats: "统计", tabTrans: "翻译", logout: "登出",
    search: "搜索...", filterAll: "所有主题", sortNew: "最新", sortEn: "A-Z (英语)", sortRu: "A-Z (翻译)",
    emptyDict: "未找到。", newWord: "新单词", phEng: "英语单词*", phTrans: "翻译*", phPhrase: "例句 (可选)",
    phTheme: "主题 (可选)", btnAdd: "添加", btnSave: "保存", btnLoading: "加载中...", btnPhoto: "照片",
    editTitle: "详情", confirmDel: "确定要删除吗？", errExists: "已存在！", errEngReq: "请输入英语单词！", errImg: "错误",
    trainModeEnRu: "🇬🇧 英 ➔ 译", trainModeRuEn: "🔄 译 ➔ 英", trainModeRand: "🔀 随机", trainLeft: "剩余:",
    clickFlip: "点击翻转", rateAgain: "重来", rateHard: "困难", rateGood: "良好", rateEasy: "容易",
    finishTitle: "干得好！", finishAll: "训练所有", finishNew: "检查新词", trainThemes: "按主题训练:",
    statTitle: "你的进度", statWords: "单词数:", statLearned: "已掌握 (>21天)", statLearning: "学习中", statNew: "新词",
    hardTitle: "最难单词", hardSubAll: "你点击'重来'的单词", hardSubTheme: "主题中的难词", hardEmpty: "没有难词！",
    themeAnalysis: "主题分析", themeSub: "掌握程度", tGood: "好", tOk: "中等", tHard: "难",
    authLog: "登录", authReg: "注册", authEmail: "邮箱", authPass: "密码", authBtnLog: "登录", authBtnReg: "创建", authTogReg: "注册", authTogLog: "登录", authOk: "成功！",
    trPlaceholder: "输入文本...", trTranslateBtn: "翻译", trAddDictBtn: "添加到字典", errTrans: "翻译错误"
  }
};

export default function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('dictionary');
  const [speechRate, setSpeechRate] = useState(0.8);
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'ru');
  
  // Состояние для передачи слов из Переводчика в Словарь
  const [prefilledWordData, setPrefilledWordData] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('appLang', lang);
  }, [lang]);

  const t = (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS['ru'][key] || key;

  // Функция срабатывает, когда в Переводчике жмут "Добавить в словарь"
  const handleTransferToDict = (eng, trans) => {
    setPrefilledWordData({ eng, trans });
    setActiveTab('dictionary'); // Автоматически переключаем вкладку
  };

  if (!session) return <Auth t={t} lang={lang} setLang={setLang} />;

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="logo-and-logout">
          <div className="logo">
            <BookOpen size={28} />
            <h1>{t('appTitle')}</h1>
          </div>
          <button className="btn-outline btn-logout mobile-only" onClick={() => supabase.auth.signOut()}>{t('logout')}</button>
        </div>
        
        <div className="tabs">
          <button className={`tab-btn ${activeTab === 'dictionary' ? 'active' : ''}`} onClick={() => setActiveTab('dictionary')}>
            <BookOpen size={18} /> {t('tabDict')}
          </button>
          <button className={`tab-btn ${activeTab === 'training' ? 'active' : ''}`} onClick={() => setActiveTab('training')}>
            <BrainCircuit size={18} /> {t('tabTrain')}
          </button>
          <button className={`tab-btn ${activeTab === 'statistics' ? 'active' : ''}`} onClick={() => setActiveTab('statistics')}>
            <BarChart3 size={18} /> {t('tabStats')}
          </button>
          {/* НОВАЯ ВКЛАДКА: Переводчик */}
          <button className={`tab-btn ${activeTab === 'translator' ? 'active' : ''}`} onClick={() => setActiveTab('translator')}>
            <Languages size={18} /> {t('tabTrans')}
          </button>
        </div>

        <div className="header-controls">
          <div className="lang-control">
            <Globe size={16} color="#868e96" />
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="uk">🇺🇦 Укр</option>
              <option value="ru">🇷🇺 Рус</option>
              <option value="en">🇬🇧 Eng</option>
              <option value="es">🇪🇸 Esp</option>
              <option value="fr">🇫🇷 Fra</option>
              <option value="de">🇩🇪 Deu</option>
              <option value="ja">🇯🇵 日本語</option>
              <option value="zh">🇨🇳 中文</option>
            </select>
          </div>

          <div className="speed-control">
            <Gauge size={16} color="#868e96" />
            <input type="range" min="0.5" max="1.5" step="0.1" value={speechRate} onChange={(e) => setSpeechRate(parseFloat(e.target.value))} />
            <span className="speed-value">{speechRate}x</span>
          </div>
          <button className="btn-outline btn-logout desktop-only" onClick={() => supabase.auth.signOut()}>{t('logout')}</button>
        </div>
      </header>
      
      <main className="content">
        {activeTab === 'dictionary' && <Dictionary session={session} speechRate={speechRate} t={t} prefilledWordData={prefilledWordData} setPrefilledWordData={setPrefilledWordData} />}
        {activeTab === 'training' && <Training session={session} speechRate={speechRate} t={t} />}
        {activeTab === 'statistics' && <Statistics session={session} t={t} />}
        {activeTab === 'translator' && <Translator t={t} onTransfer={handleTransferToDict} />}
      </main>
    </div>
  );
}

// =========================================
// 1. СЛОВАРЬ
// =========================================
function Dictionary({ session, speechRate, t, prefilledWordData, setPrefilledWordData }) {
  const [words, setWords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [engWord, setEngWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [phrase, setPhrase] = useState('');
  const [theme, setTheme] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [editingWord, setEditingWord] = useState(null);
  const [editEng, setEditEng] = useState('');
  const [editTrans, setEditTrans] = useState('');
  const [editPhrase, setEditPhrase] = useState('');
  const [editTheme, setEditTheme] = useState('');

  const [filterTheme, setFilterTheme] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); 
  const [searchQuery, setSearchQuery] = useState(''); 

  const UNSPLASH_KEY = 'Wc1HVHqjSrjNuz5xCRbLNbduz5jr3zFNSH4a_s15z98';

  useEffect(() => { fetchWords(); }, []);

  // Ловим переданные данные из переводчика
  useEffect(() => {
    if (prefilledWordData) {
      setEngWord(prefilledWordData.eng);
      setTranslation(prefilledWordData.trans);
      setIsModalOpen(true);
      setPrefilledWordData(null); // Очищаем после открытия модалки
    }
  }, [prefilledWordData, setPrefilledWordData]);

  const fetchWords = async () => {
    const { data, error } = await supabase.from('words').select('*').order('created_at', { ascending: false });
    if (!error) setWords(data);
  };

  const handleSearchImages = async () => {
    if (!engWord.trim()) return alert(t('errEngReq'));
    setIsSearching(true);
    try {
      const res = await fetch(`https://api.unsplash.com/search/photos?query=${engWord.trim()}&per_page=6&orientation=landscape&client_id=${UNSPLASH_KEY}`);
      const data = await res.json();
      setSearchResults(data.results);
    } catch (err) { alert(t('errImg')); }
    setIsSearching(false);
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    setLoading(true);
    const cleanWord = engWord.trim();
    if (words.some(w => w.english_word.toLowerCase() === cleanWord.toLowerCase())) {
      alert(`"${cleanWord}" ${t('errExists')}`);
      setLoading(false); return;
    }

    const { error } = await supabase.from('words').insert([{
      user_id: session.user.id, english_word: cleanWord, translation: translation.trim(),
      example_phrase: phrase.trim(), theme: theme.trim(), image_url: selectedImage,
    }]);

    setLoading(false);
    if (!error) {
      setEngWord(''); setTranslation(''); setPhrase(''); setTheme('');
      setSelectedImage(''); setSearchResults([]); setIsModalOpen(false); fetchWords();
    }
  };

  const openEditModal = (word) => {
    setEditingWord(word); setEditEng(word.english_word); setEditTrans(word.translation); setEditPhrase(word.example_phrase || ''); setEditTheme(word.theme || '');
  };

  const handleUpdateWord = async (e) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.from('words').update({
      english_word: editEng.trim(), translation: editTrans.trim(), example_phrase: editPhrase.trim(), theme: editTheme.trim(),
    }).eq('id', editingWord.id);
    setLoading(false);
    if (!error) { setEditingWord(null); fetchWords(); } else alert(error.message);
  };

  const handleDeleteWord = async () => {
    if (!window.confirm(t('confirmDel'))) return;
    setLoading(true);
    const { error } = await supabase.from('words').delete().eq('id', editingWord.id);
    setLoading(false);
    if (!error) { setEditingWord(null); fetchWords(); }
  };

  const playAudio = (text, e) => {
    e.stopPropagation(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; 
    utterance.rate = speechRate; 
    window.speechSynthesis.speak(utterance);
  };

  const uniqueThemes = [...new Set(words.map(w => w.theme).filter(t => t && t.trim() !== ''))];
  let displayedWords = [...words];
  
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedWords = displayedWords.filter(w => w.english_word.toLowerCase().includes(q) || w.translation.toLowerCase().includes(q));
  }
  if (filterTheme !== 'all') displayedWords = displayedWords.filter(w => w.theme === filterTheme);
  if (sortBy === 'az-eng') displayedWords.sort((a, b) => a.english_word.localeCompare(b.english_word));
  else if (sortBy === 'az-ru') displayedWords.sort((a, b) => a.translation.localeCompare(b.translation));

  return (
    <div className="dictionary-wrapper">
      <div className="dict-header">
        <h2>{t('tabDict')} ({displayedWords.length})</h2>
        <button className="btn-icon" onClick={() => setIsModalOpen(true)}><Plus size={24} color="#fff" /></button>
      </div>

      <div className="search-bar">
        <Search size={20} color="#adb5bd" />
        <input 
          type="text" 
          placeholder={t('search')} 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          name="dict_search_field" 
          autoComplete="nope" 
          data-lpignore="true" 
        />
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <Filter size={16} color="#868e96" />
          <select value={filterTheme} onChange={(e) => setFilterTheme(e.target.value)}>
            <option value="all">{t('filterAll')}</option>
            {uniqueThemes.map((th, i) => <option key={i} value={th}>{th}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">{t('sortNew')}</option>
            <option value="az-eng">{t('sortEn')}</option>
            <option value="az-ru">{t('sortRu')}</option>
          </select>
        </div>
      </div>

      <div className="words-grid">
        {displayedWords.length === 0 ? <p className="empty-state">{t('emptyDict')}</p> : (
          displayedWords.map((word) => (
            <div key={word.id} className="word-card clickable-card" onClick={() => openEditModal(word)}>
              <div className="word-content">
                <div className="word-main">
                  <div className="word-main-left">
                    <h3>{word.english_word}</h3>
                    <button className="btn-audio" onClick={(e) => playAudio(word.english_word, e)}><Volume2 size={18} /></button>
                  </div>
                  <span className="translation">{word.translation}</span>
                </div>
                {word.example_phrase && <p className="phrase">"{word.example_phrase}"</p>}
                {word.theme && <span className="theme-tag">{word.theme}</span>}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>{t('newWord')}</h3>
              <button className="close-btn" onClick={() => { setIsModalOpen(false); setEngWord(''); setTranslation(''); setPhrase(''); }}><X size={24} /></button>
            </div>
            <form onSubmit={handleAddWord} className="auth-form" role="presentation">
              <div className="input-with-button">
                <input type="text" name="dummy_eng_word" placeholder={t('phEng')} value={engWord} onChange={(e) => setEngWord(e.target.value)} required autoComplete="nope" data-lpignore="true" />
                <button type="button" className="btn-search-img" onClick={handleSearchImages} disabled={isSearching}>{isSearching ? '...' : t('btnPhoto')}</button>
              </div>
              {searchResults.length > 0 && (
                <div className="image-results">
                  {searchResults.map((img) => (
                    <img key={img.id} src={img.urls.small} className={`search-img ${selectedImage === img.urls.regular ? 'selected' : ''}`} onClick={() => setSelectedImage(img.urls.regular)} />
                  ))}
                </div>
              )}
              <input type="text" name="dummy_trans_word" placeholder={t('phTrans')} value={translation} onChange={(e) => setTranslation(e.target.value)} required autoComplete="nope" data-lpignore="true" />
              <input type="text" name="dummy_phrase_word" placeholder={t('phPhrase')} value={phrase} onChange={(e) => setPhrase(e.target.value)} autoComplete="nope" data-lpignore="true" />
              <input type="text" name="dummy_theme_word" list="theme-options" placeholder={t('phTheme')} value={theme} onChange={(e) => setTheme(e.target.value)} autoComplete="nope" data-lpignore="true" />
              <datalist id="theme-options">{uniqueThemes.map((th, i) => <option key={i} value={th} />)}</datalist>
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? t('btnLoading') : t('btnAdd')}</button>
            </form>
          </div>
        </div>
      )}

      {editingWord && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>{t('editTitle')}</h3>
              <button className="close-btn" onClick={() => setEditingWord(null)}><X size={24} /></button>
            </div>
            {editingWord.image_url && <div className="edit-image-preview" style={{ backgroundImage: `url(${editingWord.image_url})` }}></div>}
            <form onSubmit={handleUpdateWord} className="auth-form" role="presentation">
              <input type="text" name="edit_eng_word" placeholder={t('phEng')} value={editEng} onChange={(e) => setEditEng(e.target.value)} required autoComplete="nope" data-lpignore="true" />
              <input type="text" name="edit_trans_word" placeholder={t('phTrans')} value={editTrans} onChange={(e) => setEditTrans(e.target.value)} required autoComplete="nope" data-lpignore="true" />
              <input type="text" name="edit_phrase_word" placeholder={t('phPhrase')} value={editPhrase} onChange={(e) => setEditPhrase(e.target.value)} autoComplete="nope" data-lpignore="true" />
              <input type="text" name="edit_theme_word" list="theme-options" placeholder={t('phTheme')} value={editTheme} onChange={(e) => setEditTheme(e.target.value)} autoComplete="nope" data-lpignore="true" />
              <div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
                <button type="button" className="btn-outline" style={{padding: '14px', flexShrink: 0, color: '#e03131', borderColor: '#e03131'}} onClick={handleDeleteWord} disabled={loading}><Trash2 size={20} /></button>
                <button type="submit" className="btn-primary" style={{marginTop: '0'}} disabled={loading}>{loading ? '...' : t('btnSave')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================
// 2. ТРЕНИРОВКА
// =========================================
function Training({ session, speechRate, t }) {
  const [dueWords, setDueWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trainingMode, setTrainingMode] = useState('due');
  const [currentTheme, setCurrentTheme] = useState('');
  const [allThemes, setAllThemes] = useState([]);
  const [directionMode, setDirectionMode] = useState('eng-to-ru');
  const [currentCardIsEngFront, setCurrentCardIsEngFront] = useState(true);

  useEffect(() => {
    supabase.from('words').select('theme').then(({ data }) => {
      if (data) setAllThemes([...new Set(data.map(w => w.theme).filter(th => th && th.trim() !== ''))]);
    });
    fetchWords('due');
  }, []);

  useEffect(() => {
    if (directionMode === 'eng-to-ru') setCurrentCardIsEngFront(true);
    else if (directionMode === 'ru-to-eng') setCurrentCardIsEngFront(false);
    else setCurrentCardIsEngFront(Math.random() > 0.5); 
  }, [currentIndex, directionMode, dueWords]);

  const fetchWords = async (mode, themeStr = null) => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    let query = supabase.from('words').select('*');
    if (mode === 'due') query = query.or(`next_review_date.lte.${today},next_review_date.is.null`);
    else if (mode === 'theme' && themeStr) query = query.eq('theme', themeStr);

    const { data, error } = await query;
    if (!error && data) {
      setDueWords(data.sort(() => Math.random() - 0.5));
      setCurrentIndex(0); setIsFlipped(false); setTrainingMode(mode); setCurrentTheme(themeStr);
    }
    setLoading(false);
  };

  const handleRate = async (quality) => {
    const word = dueWords[currentIndex];
    let ease = word.ease_factor || 2.5; let interval = word.interval || 0;
    if (quality === 1) { ease = Math.max(1.3, ease - 0.2); interval = 1; } 
    else if (quality === 2) { ease = Math.max(1.3, ease - 0.15); interval = interval === 0 ? 1 : Math.round(interval * 1.2); } 
    else if (quality === 3) { interval = interval === 0 ? 1 : Math.round(interval * ease); } 
    else if (quality === 4) { ease += 0.15; interval = interval === 0 ? 4 : Math.round(interval * ease * 1.3); }

    const nextDate = new Date(); nextDate.setDate(nextDate.getDate() + interval);
    await supabase.from('words').update({ interval, ease_factor: ease, next_review_date: nextDate.toISOString().split('T')[0] }).eq('id', word.id);
    setIsFlipped(false); setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
  };

  const playAudio = (text, e) => {
    e.stopPropagation(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; utterance.rate = speechRate;
    window.speechSynthesis.speak(utterance);
  };

  if (loading) return <p className="empty-state">{t('btnLoading')}</p>;

  if (currentIndex >= dueWords.length) {
    return (
      <div className="finish-state">
        <BrainCircuit size={64} color="#4dabf7" />
        <h2>{trainingMode === 'due' ? t('finishTitle') : t('finishTitle')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginTop: '32px' }}>
          <button className="btn-primary" style={{ width: '100%', maxWidth: '280px' }} onClick={() => fetchWords('all')}>{t('finishAll')}</button>
          <button className="btn-outline" style={{ width: '100%', maxWidth: '280px' }} onClick={() => fetchWords('due')}>{t('finishNew')}</button>
        </div>
        {allThemes.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <p style={{ fontSize: '14px', color: '#868e96', marginBottom: '16px' }}>{t('trainThemes')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '400px', margin: '0 auto' }}>
              {allThemes.map(th => <button key={th} onClick={() => fetchWords('theme', th)} className="theme-btn-train">{th}</button>)}
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentWord = dueWords[currentIndex];
  const frontText = currentCardIsEngFront ? currentWord.english_word : currentWord.translation;
  const backText = currentCardIsEngFront ? currentWord.translation : currentWord.english_word;

  return (
    <div className="training-wrapper">
      <div className="training-controls">
        <select value={directionMode} onChange={(e) => setDirectionMode(e.target.value)}>
          <option value="eng-to-ru">{t('trainModeEnRu')}</option>
          <option value="ru-to-eng">{t('trainModeRuEn')}</option>
          <option value="random">{t('trainModeRand')}</option>
        </select>
        <div className="progress-bar">{t('trainLeft')} {dueWords.length - currentIndex}</div>
      </div>

      <div className={`flashcard-container ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(true)}>
        <div className="flashcard-front">
          {currentWord.image_url && <div className="card-image" style={{ backgroundImage: `url(${currentWord.image_url})` }}></div>}
          <div className="card-content-front">
            <h2>{frontText}</h2>
            {currentCardIsEngFront && (
              <button className="btn-audio-large" onClick={(e) => playAudio(currentWord.english_word, e)}><Volume2 size={28} color="#4dabf7" /></button>
            )}
            <p className="click-hint">{t('clickFlip')}</p>
          </div>
        </div>
        <div className="flashcard-back">
          <div className="card-content-back">
            <h3>{backText}</h3>
            {!currentCardIsEngFront && (
              <button className="btn-audio-large" style={{ marginTop: '0', marginBottom: '16px', padding: '10px' }} onClick={(e) => playAudio(currentWord.english_word, e)}>
                <Volume2 size={24} color="#4dabf7" />
              </button>
            )}
            {currentWord.example_phrase && <p className="phrase">"{currentWord.example_phrase}"</p>}
            <div className="rating-buttons">
              <button className="rate-btn again" onClick={(e) => { e.stopPropagation(); handleRate(1); }}>{t('rateAgain')}<br/><span>(1 дн)</span></button>
              <button className="rate-btn hard" onClick={(e) => { e.stopPropagation(); handleRate(2); }}>{t('rateHard')}</button>
              <button className="rate-btn good" onClick={(e) => { e.stopPropagation(); handleRate(3); }}>{t('rateGood')}</button>
              <button className="rate-btn easy" onClick={(e) => { e.stopPropagation(); handleRate(4); }}>{t('rateEasy')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================
// 3. СТАТИСТИКА
// =========================================
function Statistics({ session, t }) {
  const [rawData, setRawData] = useState([]);
  const [uniqueThemes, setUniqueThemes] = useState([]);
  const [statTheme, setStatTheme] = useState('all');
  const [stats, setStats] = useState({ total: 0, new: 0, learning: 0, learned: 0, hardWords: [], themeStats: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('words').select('english_word, translation, interval, ease_factor, theme');
      if (data) {
        setRawData(data); setUniqueThemes([...new Set(data.map(w => w.theme).filter(th => th && th.trim() !== ''))]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    const filteredData = statTheme === 'all' ? rawData : rawData.filter(w => w.theme === statTheme);
    const total = filteredData.length;
    const newWords = filteredData.filter(w => !w.interval || w.interval === 0).length;
    const learned = filteredData.filter(w => w.interval > 21).length; 
    const learning = total - newWords - learned;
    const hardWords = [...filteredData].filter(w => w.interval > 0 && w.ease_factor < 2.5).sort((a, b) => a.ease_factor - b.ease_factor);

    let themeStats = [];
    if (statTheme === 'all') {
      const themeMap = {};
      rawData.forEach(w => {
        if (!w.theme) return;
        if (!themeMap[w.theme]) themeMap[w.theme] = { total: 0, sumEase: 0 };
        themeMap[w.theme].total++; themeMap[w.theme].sumEase += (w.ease_factor || 2.5);
      });
      themeStats = Object.keys(themeMap).map(th => ({
        theme: th, total: themeMap[th].total, avgEase: themeMap[th].sumEase / themeMap[th].total
      })).sort((a, b) => a.avgEase - b.avgEase);
    }
    setStats({ total, new: newWords, learning, learned, hardWords, themeStats });
  }, [rawData, statTheme]);

  if (loading) return <p className="empty-state">{t('btnLoading')}</p>;

  const learnedPercent = stats.total === 0 ? 0 : Math.round((stats.learned / stats.total) * 100);
  const learningPercent = stats.total === 0 ? 0 : Math.round((stats.learning / stats.total) * 100);
  const newPercent = stats.total === 0 ? 0 : Math.round((stats.new / stats.total) * 100);

  return (
    <div className="stats-wrapper">
      <div className="stats-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h2>{t('statTitle')}</h2>
          <select className="stat-theme-select" value={statTheme} onChange={(e) => setStatTheme(e.target.value)}>
            <option value="all">{t('filterAll')}</option>
            {uniqueThemes.map((th, i) => <option key={i} value={th}>{th}</option>)}
          </select>
        </div>
        <p className="total-badge">{t('statWords')} <strong>{stats.total}</strong></p>
      </div>

      <div className="stats-bars-container">
        <div className="stat-row">
          <div className="stat-label"><span className="dot dot-learned"></span>{t('statLearned')}</div>
          <div className="stat-bar-track"><div className="stat-bar-fill fill-learned" style={{ width: `${learnedPercent}%` }}></div></div>
          <div className="stat-value">{stats.learned} ({learnedPercent}%)</div>
        </div>
        <div className="stat-row">
          <div className="stat-label"><span className="dot dot-learning"></span>{t('statLearning')}</div>
          <div className="stat-bar-track"><div className="stat-bar-fill fill-learning" style={{ width: `${learningPercent}%` }}></div></div>
          <div className="stat-value">{stats.learning} ({learningPercent}%)</div>
        </div>
        <div className="stat-row">
          <div className="stat-label"><span className="dot dot-new"></span>{t('statNew')}</div>
          <div className="stat-bar-track"><div className="stat-bar-fill fill-new" style={{ width: `${newPercent}%` }}></div></div>
          <div className="stat-value">{stats.new} ({newPercent}%)</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="hard-words-section">
          <h3>{t('hardTitle')}</h3>
          <p className="subtitle">{statTheme === 'all' ? t('hardSubAll') : `${t('hardSubTheme')} "${statTheme}"`}</p>
          {stats.hardWords.length === 0 ? (
            <p style={{ color: '#40c057', fontSize: '14px', textAlign: 'center' }}>{t('hardEmpty')}</p>
          ) : (
            <div className="hard-words-list">
              {stats.hardWords.map((w, i) => (
                <div key={i} className="hard-word-item">
                  <span className="hw-eng">{w.english_word}</span>
                  <span className="hw-ru">{w.translation}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {statTheme === 'all' && stats.themeStats.length > 0 && (
          <div className="hard-words-section">
            <h3>{t('themeAnalysis')}</h3>
            <p className="subtitle">{t('themeSub')}</p>
            <div className="hard-words-list">
              {stats.themeStats.map((th, i) => {
                let colorClass = 'theme-good'; let label = t('tGood');
                if (th.avgEase < 2.4) { colorClass = 'theme-hard'; label = t('tHard'); }
                else if (th.avgEase < 2.5) { colorClass = 'theme-ok'; label = t('tOk'); }
                return (
                  <div key={i} className="hard-word-item" style={{ alignItems: 'center' }}>
                    <div>
                      <span className="hw-ru" style={{ display: 'block', fontWeight: '600', color: '#212529' }}>{th.theme}</span>
                      <span style={{ fontSize: '12px', color: '#868e96' }}>{t('statWords')} {th.total}</span>
                    </div>
                    <span className={`theme-badge ${colorClass}`}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================
// 4. ПЕРЕВОДЧИК (НОВАЯ ВКЛАДКА)
// =========================================
function Translator({ t, onTransfer }) {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ru');
  const [isTranslating, setIsTranslating] = useState(false);

  const langs = [
    { code: 'en', name: 'English' }, { code: 'ru', name: 'Русский' },
    { code: 'uk', name: 'Українська' }, { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }, { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' }, { code: 'zh', name: '中文' }
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;
      const res = await fetch(url);
      const data = await res.json();
      setTranslatedText(data[0][0][0]);
    } catch (e) {
      alert(t('errTrans'));
    }
    setIsTranslating(false);
  };

  const handleSwapLangs = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText('');
  };

  const handleAddClick = () => {
    if (!sourceText || !translatedText) return;
    let eng = ''; let trans = '';
    if (sourceLang === 'en') { eng = sourceText; trans = translatedText; }
    else if (targetLang === 'en') { eng = translatedText; trans = sourceText; }
    else { eng = sourceText; trans = translatedText; } 
    onTransfer(eng, trans);
  };

  return (
    <div className="translator-wrapper">
      <div className="translator-card">
        
        <div className="trans-controls">
          <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
            {langs.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
          
          <button className="btn-icon-swap" onClick={handleSwapLangs}>
            <ArrowRightLeft size={20} color="#495057" />
          </button>
          
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
            {langs.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>

        <div className="trans-boxes">
          <textarea 
            placeholder={t('trPlaceholder')} 
            value={sourceText} 
            onChange={(e) => setSourceText(e.target.value)} 
          />
          <div className="trans-divider"></div>
          <div className="trans-result-box">
            <p>{translatedText}</p>
          </div>
        </div>

      </div>

      <div className="trans-actions">
        {translatedText && (
          <button className="btn-add-dict" onClick={handleAddClick}>
            <ArrowDownToLine size={20} /> {t('trAddDictBtn')}
          </button>
        )}
        <button className="btn-translate-main" onClick={handleTranslate} disabled={isTranslating}>
          {isTranslating ? '...' : t('trTranslateBtn')}
        </button>
      </div>
    </div>
  );
}
// =========================================
// АВТОРИЗАЦИЯ
// =========================================
function Auth({ t, lang, setLang }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e) => {
    e.preventDefault(); setLoading(true);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message); else alert(t('authOk'));
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-panel" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
          <Globe size={16} color="#868e96" />
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', color: '#495057', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            <option value="uk">🇺🇦 Укр</option>
            <option value="ru">🇷🇺 Рус</option>
            <option value="en">🇬🇧 Eng</option>
            <option value="es">🇪🇸 Esp</option>
            <option value="fr">🇫🇷 Fra</option>
            <option value="de">🇩🇪 Deu</option>
            <option value="ja">🇯🇵 日本語</option>
            <option value="zh">🇨🇳 中文</option>
          </select>
        </div>
        <h2>{isLogin ? t('authLog') : t('authReg')}</h2>
        <form onSubmit={handleAuth} className="auth-form" autoComplete="nope" role="presentation">
          <input type="email" placeholder={t('authEmail')} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="nope" data-lpignore="true" />
          <input type="password" placeholder={t('authPass')} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" data-lpignore="true" />
          <button className="btn-primary" type="submit" disabled={loading}>{loading ? '...' : isLogin ? t('authBtnLog') : t('authBtnReg')}</button>
        </form>
        <p className="toggle-auth" onClick={() => setIsLogin(!isLogin)}>{isLogin ? t('authTogReg') : t('authTogLog')}</p>
      </div>
    </div>
  );
}
