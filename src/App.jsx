import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Plus, X, BookOpen, BrainCircuit, Filter, BarChart3, Trash2, Search, Volume2, Gauge, Globe, Languages, ArrowRightLeft, ArrowDownToLine, Clock, Flame, Settings, Download, Upload, LogOut, User, Eye, EyeOff } from 'lucide-react';
import './App.css';

// =========================================
// СЛОВАРЬ ПЕРЕВОДОВ ИНТЕРФЕЙСА (ТОЛЬКО УКР И АНГЛ)
// =========================================
const TRANSLATIONS = {
  uk: {
    appTitle: "Мій Словник", tabDict: "Словник", tabTrain: "Тренування", tabStats: "Статистика", tabTrans: "Перекладач", tabSettings: "Налаштування", logout: "Вийти",
    search: "Знайти слово...", filterAll: "Всі теми", sortNew: "Нові", sortEn: "А-Я (Англ)", sortRu: "А-Я (Переклад)",
    emptyDict: "Нічого не знайдено.", newWord: "Нове слово", phEng: "Англійське слово*", phTrans: "Переклад*", phPhrase: "Приклад (необов'язково)",
    phTheme: "Тема (необов'язково)", btnAdd: "Додати", btnSave: "Зберегти", btnLoading: "Завантаження...", btnPhoto: "Фото", customImg: "Або посилання на картинку",
    editTitle: "Характеристика", confirmDel: "Точно видалити слово?", errExists: "вже є!", errEngReq: "Впиши слово англійською!", errImg: "Помилка пошуку",
    trainModeEnRu: "🇬🇧 Англ ➔ Переклад", trainModeRuEn: "🇺🇦 Переклад ➔ Англ", trainModeRand: "🔀 Упереміш", trainLeft: "Залишилось:",
    clickFlip: "Натисни, щоб перевернути", rateAgain: "Знову", rateHard: "Важко", rateGood: "Добре", rateEasy: "Легко",
    finishTitle: "Відмінна робота!", finishAll: "Тренувати ВСІ", finishNew: "На сьогодні", trainThemes: "Тренування за темами:",
    statTitle: "Твій прогрес", statWords: "Слів:", statLearned: "Вивчено назавжди (>21 дня)", statLearning: "В процесі", statNew: "Нові",
    hardTitle: "Найскладніші слова", hardSubAll: "Слова, на яких ти натискав 'Знову'", hardSubTheme: "Складні слова в темі", hardEmpty: "Відмінна робота, складних слів немає!",
    themeAnalysis: "Аналіз тем", themeSub: "Рівень засвоєння", tGood: "Добре", tOk: "Середньо", tHard: "Складно",
    authLog: "Вхід", authReg: "Реєстрація", authEmail: "Email", authPass: "Пароль", authBtnLog: "Увійти", authBtnReg: "Створити", authTogReg: "Реєстрація", authTogLog: "Вхід", authOk: "Успішно! Тепер натисни 'Увійти'",
    trPlaceholder: "Введіть текст...", trTranslateBtn: "Перекласти", trAddDictBtn: "Додати до словника", errTrans: "Помилка перекладу",
    timerPrefix: "Нові картки з'являться через:", trainHardBtn: "Тренувати складні", sessionTitle: "Підсумки тренування", sessionKnown: "Успішно:", sessionHard: "Помилки:", sessionReview: "Слова для повторення:", btnClose: "Закрити",
    setExportTitle: "Резервна копія (Експорт)", setExportDesc: "Завантажити всі слова. Буде завантажено 2 файли: технічний бекап і простий список для читання.", btnExport: "Завантажити слова",
    setImportTitle: "Завантажити слова (Імпорт)", setImportDesc: "Завантажити список слів з технічного CSV файлу (бекапу).", btnImport: "Вибрати файл CSV", importOk: "Успішно завантажено слів:", importErr: "Помилка файлу", importFmtErr: "Невірний формат",
    exportWarn: "Увага! Зараз почнеться завантаження ДВОХ файлів:\n1. Повний бекап бази (для імпорту).\n2. Чистий словник (для читання в Excel).\n\nДозволити завантаження?",
    setAccount: "Акаунт", setInterface: "Інтерфейс", setLang: "Мова додатку", setSpeed: "Швидкість озвучення", setData: "Управління даними"
  },
  en: {
    appTitle: "My Dictionary", tabDict: "Dictionary", tabTrain: "Training", tabStats: "Statistics", tabTrans: "Translator", tabSettings: "Settings", logout: "Logout",
    search: "Search word...", filterAll: "All themes", sortNew: "Newest", sortEn: "A-Z (English)", sortRu: "A-Z (Translation)",
    emptyDict: "Nothing found.", newWord: "New Word", phEng: "English word*", phTrans: "Translation*", phPhrase: "Example phrase (optional)",
    phTheme: "Theme (optional)", btnAdd: "Add", btnSave: "Save", btnLoading: "Loading...", btnPhoto: "Photo", customImg: "Or direct image link",
    editTitle: "Word Details", confirmDel: "Are you sure you want to delete?", errExists: "already exists!", errEngReq: "Enter an English word first!", errImg: "Error searching images",
    trainModeEnRu: "🇬🇧 Eng ➔ Trans", trainModeRuEn: "🔄 Trans ➔ Eng", trainModeRand: "🔀 Random", trainLeft: "Remaining:",
    clickFlip: "Click to flip", rateAgain: "Again", rateHard: "Hard", rateGood: "Good", rateEasy: "Easy",
    finishTitle: "Great job!", finishAll: "Train ALL words", finishNew: "Due today", trainThemes: "Train by themes:",
    statTitle: "Your Progress", statWords: "Words:", statLearned: "Learned forever (>21 days)", statLearning: "Learning", statNew: "New",
    hardTitle: "Hardest Words", hardSubAll: "Words where you clicked 'Again'", hardSubTheme: "Hard words in theme", hardEmpty: "Great job, no hard words!",
    themeAnalysis: "Theme Analysis", themeSub: "Mastery level", tGood: "Good", tOk: "Ok", tHard: "Hard",
    authLog: "Login", authReg: "Register", authEmail: "Email", authPass: "Password", authBtnLog: "Login", authBtnReg: "Create", authTogReg: "Register", authTogLog: "Login", authOk: "Success! Now click 'Login'",
    trPlaceholder: "Enter text...", trTranslateBtn: "Translate", trAddDictBtn: "Add to dictionary", errTrans: "Translation error",
    timerPrefix: "New cards available in:", trainHardBtn: "Train Hard Words", sessionTitle: "Session Summary", sessionKnown: "Known:", sessionHard: "Errors:", sessionReview: "Words to review:", btnClose: "Close",
    setExportTitle: "Backup (Export)", setExportDesc: "Download all words. 2 files will be downloaded: a technical backup and a simple list.", btnExport: "Download Words",
    setImportTitle: "Upload Words (Import)", setImportDesc: "Upload words from a technical CSV file (backup).", btnImport: "Select CSV File", importOk: "Successfully uploaded words:", importErr: "File upload error", importFmtErr: "Invalid file format",
    exportWarn: "Attention! TWO files will be downloaded now:\n1. Full database backup (for import).\n2. Clean dictionary (for reading in Excel).\n\nAllow downloads?",
    setAccount: "Account", setInterface: "Interface", setLang: "App Language", setSpeed: "Voice Speed", setData: "Data Management"
  }
};

export default function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('dictionary');
  const [speechRate, setSpeechRate] = useState(0.8);
  
  // По умолчанию ставим украинский
  const [lang, setLang] = useState(() => localStorage.getItem('appLang') || 'uk');
  const [prefilledWordData, setPrefilledWordData] = useState(null);

  const [dueCount, setDueCount] = useState(0);
  const [nextReviewDate, setNextReviewDate] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { localStorage.setItem('appLang', lang); }, [lang]);

  const fetchGlobalStats = async () => {
    if (!session) return;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('words').select('next_review_date');
    if (data) {
      const due = data.filter(w => !w.next_review_date || w.next_review_date <= today);
      setDueCount(due.length);
      const futureDates = data.filter(w => w.next_review_date > today).map(w => w.next_review_date);
      setNextReviewDate(futureDates.length > 0 ? futureDates.sort()[0] : null);
    }
  };

  useEffect(() => { fetchGlobalStats(); }, [session, activeTab]);

  const safeLang = TRANSLATIONS[lang] ? lang : 'uk';
  const t = (key) => TRANSLATIONS[safeLang][key] || TRANSLATIONS['en'][key] || key;

  const handleTransferToDict = (eng, trans) => {
    setPrefilledWordData({ eng, trans }); setActiveTab('dictionary');
  };

  if (!session) return <Auth t={t} lang={lang} setLang={setLang} />;

  return (
    <div className="app-container">
      <header className="main-header" style={{ borderBottom: 'none', marginBottom: '16px' }}>
        <div className="logo">
          <BookOpen size={28} />
          <h1>{t('appTitle')}</h1>
        </div>
      </header>
      
      <div className="tabs" style={{ marginBottom: '24px', width: '100%', maxWidth: '100%' }}>
        <button className={`tab-btn ${activeTab === 'dictionary' ? 'active' : ''}`} onClick={() => setActiveTab('dictionary')}>
          <BookOpen size={18} /> <span className="tab-text">{t('tabDict')}</span>
        </button>
        <button className={`tab-btn ${activeTab === 'training' ? 'active' : ''} ${dueCount > 0 ? 'tab-has-due' : ''}`} onClick={() => setActiveTab('training')}>
          <BrainCircuit size={18} /> <span className="tab-text">{t('tabTrain')}</span>
          {dueCount > 0 && <span className="due-badge">{dueCount}</span>}
        </button>
        <button className={`tab-btn ${activeTab === 'statistics' ? 'active' : ''}`} onClick={() => setActiveTab('statistics')}>
          <BarChart3 size={18} /> <span className="tab-text">{t('tabStats')}</span>
        </button>
        <button className={`tab-btn ${activeTab === 'translator' ? 'active' : ''}`} onClick={() => setActiveTab('translator')}>
          <Languages size={18} /> <span className="tab-text">{t('tabTrans')}</span>
        </button>
        <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <Settings size={18} /> <span className="tab-text">{t('tabSettings')}</span>
        </button>
      </div>
      
      <main className="content">
        {activeTab === 'dictionary' && <Dictionary session={session} speechRate={speechRate} t={t} prefilledWordData={prefilledWordData} setPrefilledWordData={setPrefilledWordData} onUpdateGlobal={fetchGlobalStats} />}
        {activeTab === 'training' && <Training session={session} speechRate={speechRate} t={t} nextReviewDate={nextReviewDate} onUpdateGlobal={fetchGlobalStats} />}
        {activeTab === 'statistics' && <Statistics session={session} t={t} />}
        {activeTab === 'translator' && <Translator t={t} onTransfer={handleTransferToDict} />}
        {activeTab === 'settings' && <SettingsTab session={session} t={t} lang={lang} setLang={setLang} speechRate={speechRate} setSpeechRate={setSpeechRate} onUpdateGlobal={fetchGlobalStats} />}
      </main>
    </div>
  );
}

// =========================================
// 1. СЛОВАРЬ
// =========================================
function Dictionary({ session, speechRate, t, prefilledWordData, setPrefilledWordData, onUpdateGlobal }) {
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
  const [editImage, setEditImage] = useState('');
  const [editSearchResults, setEditSearchResults] = useState([]);
  const [isEditSearching, setIsEditSearching] = useState(false);

  const [filterTheme, setFilterTheme] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); 
  const [searchQuery, setSearchQuery] = useState(''); 

  const UNSPLASH_KEY = 'Wc1HVHqjSrjNuz5xCRbLNbduz5jr3zFNSH4a_s15z98';

  useEffect(() => { fetchWords(); }, []);

  useEffect(() => {
    if (prefilledWordData) {
      setEngWord(prefilledWordData.eng); setTranslation(prefilledWordData.trans);
      setIsModalOpen(true); setPrefilledWordData(null);
    }
  }, [prefilledWordData, setPrefilledWordData]);

  const fetchWords = async () => {
    const { data, error } = await supabase.from('words').select('*').order('created_at', { ascending: false });
    if (!error) { setWords(data); onUpdateGlobal(); }
  };

  const searchUnsplash = async (query, setResults, setLoader) => {
    if (!query.trim()) return alert(t('errEngReq'));
    setLoader(true);
    try {
      const res = await fetch(`https://api.unsplash.com/search/photos?query=${query.trim()}&per_page=6&orientation=landscape&client_id=${UNSPLASH_KEY}`);
      const data = await res.json();
      setResults(data.results);
    } catch (err) { alert(t('errImg')); }
    setLoader(false);
  };

  const openGoogleImages = (word) => {
    if (!word.trim()) return alert(t('errEngReq'));
    const query = encodeURIComponent(`${word.trim()} clipart`);
    window.open(`https://www.google.com/search?tbm=isch&q=${query}`, '_blank');
  };

  const handleAddWord = async (e) => {
    e.preventDefault(); setLoading(true);
    const cleanWord = engWord.trim();
    if (words.some(w => w.english_word.toLowerCase() === cleanWord.toLowerCase())) {
      alert(`"${cleanWord}" ${t('errExists')}`); setLoading(false); return;
    }
    const { error } = await supabase.from('words').insert([{
      user_id: session.user.id, english_word: cleanWord, translation: translation.trim(),
      example_phrase: phrase.trim(), theme: theme.trim(), image_url: selectedImage.trim()
    }]);
    setLoading(false);
    if (!error) {
      setEngWord(''); setTranslation(''); setPhrase(''); setTheme(''); setSelectedImage(''); setSearchResults([]); 
      setIsModalOpen(false); fetchWords();
    }
  };

  const openEditModal = (word) => {
    setEditingWord(word); setEditEng(word.english_word); setEditTrans(word.translation);
    setEditPhrase(word.example_phrase || ''); setEditTheme(word.theme || ''); 
    setEditImage(word.image_url || ''); setEditSearchResults([]);
  };

  const handleUpdateWord = async (e) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.from('words').update({
      english_word: editEng.trim(), translation: editTrans.trim(), example_phrase: editPhrase.trim(), 
      theme: editTheme.trim(), image_url: editImage.trim()
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
    const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'en-US'; utterance.rate = speechRate; 
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
        <input type="text" placeholder={t('search')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} name="dict_search_field" autoComplete="nope" data-lpignore="true" />
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
              <button className="close-btn" onClick={() => { setIsModalOpen(false); setEngWord(''); setTranslation(''); setPhrase(''); setSelectedImage(''); }}><X size={24} /></button>
            </div>
            <form onSubmit={handleAddWord} className="auth-form" role="presentation">
              <div className="input-with-button">
                <input type="text" name="dummy_eng_word" placeholder={t('phEng')} value={engWord} onChange={(e) => setEngWord(e.target.value)} required autoComplete="nope" data-lpignore="true" />
                <button type="button" className="btn-search-img" onClick={() => searchUnsplash(engWord, setSearchResults, setIsSearching)} disabled={isSearching}>{isSearching ? '...' : t('btnPhoto')}</button>
              </div>
              {searchResults.length > 0 && (
                <div className="image-results">
                  {searchResults.map((img) => (
                    <img key={img.id} src={img.urls.small} className={`search-img ${selectedImage === img.urls.regular ? 'selected' : ''}`} onClick={() => setSelectedImage(img.urls.regular)} />
                  ))}
                </div>
              )}
              <div className="input-with-icon">
                <input type="text" placeholder={t('customImg')} value={selectedImage} onChange={(e) => setSelectedImage(e.target.value)} style={{fontSize: '13px'}} autoComplete="nope" />
                <button type="button" className="btn-icon-inside" onClick={() => openGoogleImages(engWord)} title="Искать в Google"><Search size={18} color="#adb5bd" /></button>
              </div>
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
            {editImage && <div className="edit-image-preview" style={{ backgroundImage: `url(${editImage})` }}></div>}
            <form onSubmit={handleUpdateWord} className="auth-form" role="presentation">
              <div className="input-with-button">
                <input type="text" name="edit_eng_word" placeholder={t('phEng')} value={editEng} onChange={(e) => setEditEng(e.target.value)} required autoComplete="nope" data-lpignore="true" />
                <button type="button" className="btn-search-img" onClick={() => searchUnsplash(editEng, setEditSearchResults, setIsEditSearching)} disabled={isEditSearching}>{isEditSearching ? '...' : t('btnPhoto')}</button>
              </div>
              {editSearchResults.length > 0 && (
                <div className="image-results">
                  {editSearchResults.map((img) => (
                    <img key={img.id} src={img.urls.small} className={`search-img ${editImage === img.urls.regular ? 'selected' : ''}`} onClick={() => setEditImage(img.urls.regular)} />
                  ))}
                </div>
              )}
              <div className="input-with-icon">
                <input type="text" placeholder={t('customImg')} value={editImage} onChange={(e) => setEditImage(e.target.value)} style={{fontSize: '13px'}} autoComplete="nope" />
                <button type="button" className="btn-icon-inside" onClick={() => openGoogleImages(editEng)} title="Искать в Google"><Search size={18} color="#adb5bd" /></button>
              </div>
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
// 2. ТРЕНИРОВКА (ДОБАВЛЕНА КНОПКА СКРЫТИЯ КАРТИНОК)
// =========================================
function Training({ session, speechRate, t, nextReviewDate, onUpdateGlobal }) {
  const [dueWords, setDueWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trainingMode, setTrainingMode] = useState('due');
  const [currentTheme, setCurrentTheme] = useState('');
  const [allThemes, setAllThemes] = useState([]);
  const [directionMode, setDirectionMode] = useState('eng-to-ru');
  const [currentCardIsEngFront, setCurrentCardIsEngFront] = useState(true);
  
  // Новое состояние: показывать ли картинку
  const [showImages, setShowImages] = useState(true);

  const [timeLeft, setTimeLeft] = useState('');
  const [sessionLog, setSessionLog] = useState([]);
  const [showSessionStats, setShowSessionStats] = useState(false);

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

  useEffect(() => {
    if (!nextReviewDate || dueWords.length > 0) return;
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(nextReviewDate + 'T00:00:00');
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft('00:00:00'); clearInterval(timer); fetchWords('due'); 
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
        const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
        setTimeLeft(`${h}:${m}:${s}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [nextReviewDate, dueWords.length]);

  const fetchWords = async (mode, themeStr = null) => {
    setLoading(true); setShowSessionStats(false); setSessionLog([]);
    const today = new Date().toISOString().split('T')[0];
    let query = supabase.from('words').select('*');
    if (mode === 'due') query = query.or(`next_review_date.lte.${today},next_review_date.is.null`);
    else if (mode === 'hard') query = query.lt('ease_factor', 2.5);
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
    setSessionLog(prev => [...prev, { word, quality }]);
    let ease = word.ease_factor || 2.5; let interval = word.interval || 0;
    if (quality === 1) { ease = Math.max(1.3, ease - 0.2); interval = 1; } 
    else if (quality === 2) { ease = Math.max(1.3, ease - 0.15); interval = interval === 0 ? 1 : Math.round(interval * 1.2); } 
    else if (quality === 3) { interval = interval === 0 ? 1 : Math.round(interval * ease); } 
    else if (quality === 4) { ease += 0.15; interval = interval === 0 ? 4 : Math.round(interval * ease * 1.3); }

    const nextDate = new Date(); nextDate.setDate(nextDate.getDate() + interval);
    await supabase.from('words').update({ interval, ease_factor: ease, next_review_date: nextDate.toISOString().split('T')[0] }).eq('id', word.id);
    setIsFlipped(false);
    setTimeout(() => {
      const nextIdx = currentIndex + 1; setCurrentIndex(nextIdx);
      if (nextIdx >= dueWords.length && nextIdx > 0) { onUpdateGlobal(); setShowSessionStats(true); }
    }, 150);
  };

  const playAudio = (text, e) => {
    e.stopPropagation(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'en-US'; utterance.rate = speechRate; window.speechSynthesis.speak(utterance);
  };

  if (loading) return <p className="empty-state">{t('btnLoading')}</p>;

  if (showSessionStats && sessionLog.length > 0) {
    const knownCount = sessionLog.filter(l => l.quality >= 3).length;
    const knownPercent = Math.round((knownCount / sessionLog.length) * 100);
    const hardWordsList = sessionLog.filter(l => l.quality <= 2).map(l => l.word);
    return (
      <div className="session-stats-container">
        <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '30px' }}>
          <h2 style={{marginTop: 0, textAlign: 'center', color: '#212529'}}>{t('sessionTitle')}</h2>
          <div className="session-progress">
            <div className="sp-bar-bg"><div className="sp-bar-fill" style={{ width: `${knownPercent}%` }}></div></div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '14px', fontWeight: '600'}}>
              <span style={{color: '#40c057'}}>{t('sessionKnown')} {knownPercent}%</span><span style={{color: '#fa5252'}}>{t('sessionHard')} {100 - knownPercent}%</span>
            </div>
          </div>
          {hardWordsList.length > 0 && (
            <div className="session-hard-list">
              <h4 style={{margin: '0 0 12px 0', color: '#495057'}}>{t('sessionReview')}</h4>
              <div className="hard-words-scroll">{hardWordsList.map((w, i) => (<div key={i} className="session-hw-item"><strong>{w.english_word}</strong><span>{w.translation}</span></div>))}</div>
            </div>
          )}
          <button className="btn-primary" style={{marginTop: '24px'}} onClick={() => setShowSessionStats(false)}>{t('btnClose')}</button>
        </div>
      </div>
    );
  }

  const topControls = (
    <div className="training-controls" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '400px', margin: '0 auto 20px auto' }}>
      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
        <select style={{ flex: 1 }} value={directionMode} onChange={(e) => setDirectionMode(e.target.value)}>
          <option value="eng-to-ru">{t('trainModeEnRu')}</option><option value="ru-to-eng">{t('trainModeRuEn')}</option><option value="random">{t('trainModeRand')}</option>
        </select>
        
        {/* КНОПКА ТУМБЛЕР ДЛЯ КАРТИНОК */}
        <button 
          className="btn-icon-small" 
          onClick={() => setShowImages(!showImages)}
          style={{ background: showImages ? '#f1f3f5' : '#fff5f5', color: showImages ? '#495057' : '#e03131', border: `1px solid ${showImages ? '#dee2e6' : '#ffc9c9'}` }}
        >
          {showImages ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>

        <select style={{ flex: 1 }} value={trainingMode === 'theme' ? currentTheme : trainingMode} onChange={(e) => { const val = e.target.value; if (['due', 'all', 'hard'].includes(val)) fetchWords(val); else fetchWords('theme', val); }}>
          <option value="due">📅 {t('finishNew')}</option><option value="all">📚 {t('finishAll')}</option><option value="hard">🔥 {t('trainHardBtn')}</option>
          {allThemes.length > 0 && <optgroup label={t('trainThemes')}>{allThemes.map(th => <option key={th} value={th}>{th}</option>)}</optgroup>}
        </select>
      </div>
      {currentIndex < dueWords.length && <div className="progress-bar" style={{ textAlign: 'center', margin: 0 }}>{t('trainLeft')} {dueWords.length - currentIndex}</div>}
    </div>
  );

  if (currentIndex >= dueWords.length) {
    return (
      <div className="training-wrapper">
        {topControls}
        <div className="finish-state">
          {trainingMode === 'due' && timeLeft ? (
            <div className="timer-box"><Clock size={48} color="#adb5bd" style={{marginBottom: '16px'}} /><p>{t('timerPrefix')}</p><h2 className="timer-text">{timeLeft}</h2></div>
          ) : (<><BrainCircuit size={64} color="#4dabf7" /><h2>{t('finishTitle')}</h2></>)}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginTop: '32px' }}>
            {trainingMode !== 'due' && <button className="btn-primary" style={{ width: '100%', maxWidth: '280px' }} onClick={() => fetchWords('due')}>{t('finishNew')}</button>}
            <button className="btn-outline-hard" style={{ width: '100%', maxWidth: '280px', display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={() => fetchWords('hard')}><Flame size={18} /> {t('trainHardBtn')}</button>
          </div>
        </div>
      </div>
    );
  }

  const currentWord = dueWords[currentIndex];
  const frontText = currentCardIsEngFront ? currentWord.english_word : currentWord.translation;
  const backText = currentCardIsEngFront ? currentWord.translation : currentWord.english_word;

  return (
    <div className="training-wrapper">
      {topControls}
      <div className={`flashcard-container ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(true)}>
        <div className="flashcard-front">
          {/* КАРТИНКА ПОКАЗЫВАЕТСЯ ТОЛЬКО ЕСЛИ SHOWIMAGES = TRUE */}
          {showImages && currentWord.image_url && <div className="card-image" style={{ backgroundImage: `url(${currentWord.image_url})` }}></div>}
          <div className="card-content-front">
            <h2>{frontText}</h2>
            {currentCardIsEngFront && <button className="btn-audio-large" onClick={(e) => playAudio(currentWord.english_word, e)}><Volume2 size={28} color="#4dabf7" /></button>}
            <p className="click-hint">{t('clickFlip')}</p>
          </div>
        </div>
        <div className="flashcard-back">
          <div className="card-content-back">
            <h3>{backText}</h3>
            {!currentCardIsEngFront && <button className="btn-audio-large" style={{ marginTop: '0', marginBottom: '16px', padding: '10px' }} onClick={(e) => playAudio(currentWord.english_word, e)}><Volume2 size={24} color="#4dabf7" /></button>}
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
      if (data) { setRawData(data); setUniqueThemes([...new Set(data.map(w => w.theme).filter(th => th && th.trim() !== ''))]); }
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
                  <span className="hw-eng">{w.english_word}</span><span className="hw-ru">{w.translation}</span>
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
// 4. ПЕРЕВОДЧИК
// =========================================
function Translator({ t, onTransfer }) {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('uk');
  const [isTranslating, setIsTranslating] = useState(false);

  // ВЕРНУЛ РУССКИЙ ТОЛЬКО ДЛЯ ПЕРЕВОДЧИКА
  const langs = [
    { code: 'en', name: 'English' }, { code: 'uk', name: 'Українська' }, { code: 'ru', name: 'Русский' },
    { code: 'es', name: 'Español' }, { code: 'fr', name: 'Français' }, { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' }, { code: 'zh', name: '中文' }
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;
      const res = await fetch(url); const data = await res.json();
      setTranslatedText(data[0][0][0]);
    } catch (e) { alert(t('errTrans')); }
    setIsTranslating(false);
  };

  const handleSwapLangs = () => {
    setSourceLang(targetLang); setTargetLang(sourceLang); setSourceText(translatedText); setTranslatedText('');
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
          <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>{langs.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}</select>
          <button className="btn-icon-swap" onClick={handleSwapLangs}><ArrowRightLeft size={20} color="#495057" /></button>
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>{langs.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}</select>
        </div>
        <div className="trans-boxes">
          <textarea placeholder={t('trPlaceholder')} value={sourceText} onChange={(e) => setSourceText(e.target.value)} />
          <div className="trans-divider"></div>
          <div className="trans-result-box"><p>{translatedText}</p></div>
        </div>
      </div>
      <div className="trans-actions">
        {translatedText && <button className="btn-add-dict" onClick={handleAddClick}><ArrowDownToLine size={20} /> {t('trAddDictBtn')}</button>}
        <button className="btn-translate-main" onClick={handleTranslate} disabled={isTranslating}>{isTranslating ? '...' : t('trTranslateBtn')}</button>
      </div>
    </div>
  );
}

// =========================================
// 5. НАСТРОЙКИ (ЭКСПОРТ И ИМПОРТ) 
// =========================================
function SettingsTab({ session, t, lang, setLang, speechRate, setSpeechRate, onUpdateGlobal }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!window.confirm(t('exportWarn'))) return;
    
    setLoading(true);
    const { data, error } = await supabase.from('words').select('*').order('created_at', { ascending: true });
    
    if (error || !data) {
      alert("Error fetching data"); setLoading(false); return;
    }

    const BOM = "\uFEFF"; 

    let csvBackup = "english_word,translation,example_phrase,theme,image_url,interval,ease_factor,next_review_date\n";
    let csvSimple = "Слово,Перевод,Пример,Тема\n"; 
    
    data.forEach(row => {
      const escapeCsv = (str) => {
        if (str == null) return '';
        const stringVal = String(str);
        if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
          return `"${stringVal.replace(/"/g, '""')}"`;
        }
        return stringVal;
      };

      csvBackup += [
        escapeCsv(row.english_word), escapeCsv(row.translation), escapeCsv(row.example_phrase),
        escapeCsv(row.theme), escapeCsv(row.image_url),
        row.interval || 0, row.ease_factor || 2.5, row.next_review_date || ''
      ].join(',') + "\n";

      csvSimple += [
        escapeCsv(row.english_word), escapeCsv(row.translation), 
        escapeCsv(row.example_phrase), escapeCsv(row.theme)
      ].join(',') + "\n";
    });

    const downloadFile = (content, filename) => {
      const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const dateStr = new Date().toISOString().split('T')[0];
    
    downloadFile(csvBackup, `dictionary_backup_${dateStr}.csv`);
    
    setTimeout(() => {
      downloadFile(csvSimple, `my_words_list_${dateStr}.csv`);
      setLoading(false);
    }, 500);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const { data: existingWords } = await supabase.from('words').select('english_word');
    const existingSet = new Set((existingWords || []).map(w => w.english_word.toLowerCase()));

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      
      if (lines.length < 2 || !lines[0].includes('english_word') || !lines[0].includes('translation')) {
        alert(t('importFmtErr') + " (Ожидается файл backup, а не простой список)"); setLoading(false); return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const engIdx = headers.indexOf('english_word'); const transIdx = headers.indexOf('translation');
      const phraseIdx = headers.indexOf('example_phrase'); const themeIdx = headers.indexOf('theme');
      const imgIdx = headers.indexOf('image_url');

      const newWordsToInsert = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const row = []; let currentVal = ''; let inQuotes = false;
        for (let char of lines[i]) {
          if (char === '"') inQuotes = !inQuotes;
          else if (char === ',' && !inQuotes) { row.push(currentVal); currentVal = ''; }
          else currentVal += char;
        }
        row.push(currentVal);

        const eng = row[engIdx]?.replace(/^"|"$/g, '').trim();
        const trans = row[transIdx]?.replace(/^"|"$/g, '').trim();

        if (eng && trans && !existingSet.has(eng.toLowerCase())) {
          newWordsToInsert.push({
            user_id: session.user.id, english_word: eng, translation: trans,
            example_phrase: phraseIdx !== -1 ? row[phraseIdx]?.replace(/^"|"$/g, '').trim() : null,
            theme: themeIdx !== -1 ? row[themeIdx]?.replace(/^"|"$/g, '').trim() : null,
            image_url: imgIdx !== -1 ? row[imgIdx]?.replace(/^"|"$/g, '').trim() : null,
          });
          existingSet.add(eng.toLowerCase()); 
        }
      }

      if (newWordsToInsert.length > 0) {
        const { error } = await supabase.from('words').insert(newWordsToInsert);
        if (error) { alert(t('importErr')); } else { alert(`${t('importOk')} ${newWordsToInsert.length}`); onUpdateGlobal(); }
      } else {
        alert("0 нових слів знайдено (можливо, всі вже є у словнику).");
      }
      setLoading(false); e.target.value = null; 
    };
    reader.readAsText(file);
  };

  return (
    <div className="stats-wrapper">
      <div className="stats-header">
        <h2>{t('tabSettings')}</h2>
      </div>

      <div className="settings-section">
        <h3>{t('setAccount')}</h3>
        <div className="settings-row">
          <div className="settings-info">
            <User size={20} color="#868e96" />
            <span>{session.user.email}</span>
          </div>
          <button className="btn-outline-hard" style={{padding: '8px 16px', display: 'flex', gap: '8px'}} onClick={() => supabase.auth.signOut()}>
            <LogOut size={16} /> {t('logout')}
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3>{t('setInterface')}</h3>
        <div className="settings-row">
          <div className="settings-info">
            <Globe size={20} color="#868e96" />
            <span>{t('setLang')}</span>
          </div>
          {/* УБРАЛИ РУССКИЙ ИЗ ВЫБОРА ЯЗЫКОВ */}
          <select className="settings-select" value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="uk">🇺🇦 Українська</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <Volume2 size={20} color="#868e96" />
            <span>{t('setSpeed')} ({speechRate}x)</span>
          </div>
          <input type="range" min="0.5" max="1.5" step="0.1" value={speechRate} onChange={(e) => setSpeechRate(parseFloat(e.target.value))} style={{width: '120px'}} />
        </div>
      </div>

      <div className="settings-section">
        <h3>{t('setData')}</h3>
        <div className="stats-grid" style={{marginTop: '16px'}}>
          <div className="hard-words-section" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
              <div style={{padding: '12px', background: '#e7f5ff', borderRadius: '12px', color: '#1864ab'}}><Download size={24} /></div>
              <div><h3 style={{margin: 0, color: '#212529'}}>{t('setExportTitle')}</h3></div>
            </div>
            <p style={{color: '#868e96', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5}}>{t('setExportDesc')}</p>
            <button className="btn-primary" onClick={handleExport} disabled={loading} style={{marginTop: 'auto', width: '100%'}}>
              {loading ? '...' : t('btnExport')}
            </button>
          </div>

          <div className="hard-words-section" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
              <div style={{padding: '12px', background: '#ebfbee', borderRadius: '12px', color: '#2b8a3e'}}><Upload size={24} /></div>
              <div><h3 style={{margin: 0, color: '#212529'}}>{t('setImportTitle')}</h3></div>
            </div>
            <p style={{color: '#868e96', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5}}>{t('setImportDesc')}</p>
            <label className="btn-outline" style={{marginTop: 'auto', width: '100%', textAlign: 'center', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1}}>
              {loading ? '...' : t('btnImport')}
              <input type="file" accept=".csv" onChange={handleImport} disabled={loading} style={{ display: 'none' }} />
            </label>
          </div>
        </div>
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
            <option value="uk">🇺🇦 Укр</option><option value="en">🇬🇧 Eng</option>
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
