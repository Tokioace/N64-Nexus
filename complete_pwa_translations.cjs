const fs = require('fs');
const path = require('path');

const translationDir = 'src/translations';

// Define all PWA-related translations for each language
const pwaTranslations = {
  es: {
    // PWA Installation Prompt
    'pwa.installTitle': 'Instalar Battle64',
    'pwa.installDescription': '¡Obtén la experiencia completa de la app con acceso offline y carga más rápida!',
    'pwa.install': 'Instalar App',
    'pwa.gotIt': '¡Entendido!',
    'pwa.iosStep1': 'Toca el botón Compartir',
    'pwa.iosStep2': 'Luego "Añadir a pantalla de inicio"',
    'common.later': 'Más tarde',

    // Offline Functionality
    'offline.workingOffline': 'Trabajando sin conexión',
    'offline.backOnline': '¡De vuelta en línea!',
    'offline.cachedDataAvailable': 'Datos en caché disponibles',
    'offline.cachedData': 'Datos en caché',

    // Enhanced Chat
    'chat.communityChat': 'Chat de la Comunidad',
    'chat.activeUsers': 'usuarios activos',
    'chat.loading': 'Cargando mensajes...',
    'chat.noMessages': 'Aún no hay mensajes',
    'chat.startConversation': '¡Sé el primero en iniciar la conversación!',
    'chat.typeMessage': 'Escribe un mensaje...',
    'chat.emoji': 'Añadir emoji',
    'chat.scrollToBottom': 'Desplazarse hacia abajo',
    'chat.errorLoading': 'Error al cargar mensajes',
    'time.today': 'Hoy',
    'time.yesterday': 'Ayer',

    // Realtime Events
    'events.nowLive': '¡El evento está en vivo!'
  },

  fr: {
    // PWA Installation Prompt
    'pwa.installTitle': 'Installer Battle64',
    'pwa.installDescription': 'Obtenez l\'expérience complète de l\'app avec accès hors ligne et chargement plus rapide !',
    'pwa.install': 'Installer l\'App',
    'pwa.gotIt': 'Compris !',
    'pwa.iosStep1': 'Appuyez sur le bouton Partager',
    'pwa.iosStep2': 'Puis "Ajouter à l\'écran d\'accueil"',
    'common.later': 'Plus tard',

    // Offline Functionality
    'offline.workingOffline': 'Travail hors ligne',
    'offline.backOnline': 'De retour en ligne !',
    'offline.cachedDataAvailable': 'Données mises en cache disponibles',
    'offline.cachedData': 'Données mises en cache',

    // Enhanced Chat
    'chat.communityChat': 'Chat Communautaire',
    'chat.activeUsers': 'utilisateurs actifs',
    'chat.loading': 'Chargement des messages...',
    'chat.noMessages': 'Aucun message pour le moment',
    'chat.startConversation': 'Soyez le premier à commencer la conversation !',
    'chat.typeMessage': 'Tapez un message...',
    'chat.emoji': 'Ajouter un emoji',
    'chat.scrollToBottom': 'Faire défiler vers le bas',
    'chat.errorLoading': 'Erreur lors du chargement des messages',
    'time.today': 'Aujourd\'hui',
    'time.yesterday': 'Hier',

    // Realtime Events
    'events.nowLive': 'L\'événement est maintenant en direct !'
  },

  it: {
    // PWA Installation Prompt
    'pwa.installTitle': 'Installa Battle64',
    'pwa.installDescription': 'Ottieni l\'esperienza completa dell\'app con accesso offline e caricamento più veloce!',
    'pwa.install': 'Installa App',
    'pwa.gotIt': 'Capito!',
    'pwa.iosStep1': 'Tocca il pulsante Condividi',
    'pwa.iosStep2': 'Poi "Aggiungi alla schermata Home"',
    'common.later': 'Più tardi',

    // Offline Functionality
    'offline.workingOffline': 'Lavoro offline',
    'offline.backOnline': 'Di nuovo online!',
    'offline.cachedDataAvailable': 'Dati memorizzati nella cache disponibili',
    'offline.cachedData': 'Dati memorizzati nella cache',

    // Enhanced Chat
    'chat.communityChat': 'Chat della Comunità',
    'chat.activeUsers': 'utenti attivi',
    'chat.loading': 'Caricamento messaggi...',
    'chat.noMessages': 'Nessun messaggio ancora',
    'chat.startConversation': 'Sii il primo a iniziare la conversazione!',
    'chat.typeMessage': 'Digita un messaggio...',
    'chat.emoji': 'Aggiungi emoji',
    'chat.scrollToBottom': 'Scorri verso il basso',
    'chat.errorLoading': 'Errore nel caricamento dei messaggi',
    'time.today': 'Oggi',
    'time.yesterday': 'Ieri',

    // Realtime Events
    'events.nowLive': 'L\'evento è ora dal vivo!'
  },

  pt: {
    // PWA Installation Prompt
    'pwa.installTitle': 'Instalar Battle64',
    'pwa.installDescription': 'Obtenha a experiência completa do app com acesso offline e carregamento mais rápido!',
    'pwa.install': 'Instalar App',
    'pwa.gotIt': 'Entendi!',
    'pwa.iosStep1': 'Toque no botão Compartilhar',
    'pwa.iosStep2': 'Depois "Adicionar à Tela de Início"',
    'common.later': 'Mais tarde',

    // Offline Functionality
    'offline.workingOffline': 'Trabalhando offline',
    'offline.backOnline': 'De volta online!',
    'offline.cachedDataAvailable': 'Dados em cache disponíveis',
    'offline.cachedData': 'Dados em cache',

    // Enhanced Chat
    'chat.communityChat': 'Chat da Comunidade',
    'chat.activeUsers': 'usuários ativos',
    'chat.loading': 'Carregando mensagens...',
    'chat.noMessages': 'Ainda não há mensagens',
    'chat.startConversation': 'Seja o primeiro a iniciar a conversa!',
    'chat.typeMessage': 'Digite uma mensagem...',
    'chat.emoji': 'Adicionar emoji',
    'chat.scrollToBottom': 'Rolar para baixo',
    'chat.errorLoading': 'Erro ao carregar mensagens',
    'time.today': 'Hoje',
    'time.yesterday': 'Ontem',

    // Realtime Events
    'events.nowLive': 'O evento está ao vivo agora!'
  },

  ru: {
    // PWA Installation Prompt
    'pwa.installTitle': 'Установить Battle64',
    'pwa.installDescription': 'Получите полный опыт приложения с офлайн-доступом и быстрой загрузкой!',
    'pwa.install': 'Установить приложение',
    'pwa.gotIt': 'Понятно!',
    'pwa.iosStep1': 'Нажмите кнопку "Поделиться"',
    'pwa.iosStep2': 'Затем "Добавить на экран "Домой""',
    'common.later': 'Позже',

    // Offline Functionality
    'offline.workingOffline': 'Работа в автономном режиме',
    'offline.backOnline': 'Снова в сети!',
    'offline.cachedDataAvailable': 'Кэшированные данные доступны',
    'offline.cachedData': 'Кэшированные данные',

    // Enhanced Chat
    'chat.communityChat': 'Чат сообщества',
    'chat.activeUsers': 'активных пользователей',
    'chat.loading': 'Загрузка сообщений...',
    'chat.noMessages': 'Пока нет сообщений',
    'chat.startConversation': 'Будьте первым, кто начнет разговор!',
    'chat.typeMessage': 'Введите сообщение...',
    'chat.emoji': 'Добавить эмодзи',
    'chat.scrollToBottom': 'Прокрутить вниз',
    'chat.errorLoading': 'Ошибка загрузки сообщений',
    'time.today': 'Сегодня',
    'time.yesterday': 'Вчера',

    // Realtime Events
    'events.nowLive': 'Событие сейчас в прямом эфире!'
  },

  ja: {
    // PWA Installation Prompt
    'pwa.installTitle': 'Battle64をインストール',
    'pwa.installDescription': 'オフラインアクセスと高速読み込みで完全なアプリ体験を！',
    'pwa.install': 'アプリをインストール',
    'pwa.gotIt': '分かりました！',
    'pwa.iosStep1': '共有ボタンをタップ',
    'pwa.iosStep2': '「ホーム画面に追加」をタップ',
    'common.later': '後で',

    // Offline Functionality
    'offline.workingOffline': 'オフラインで作業中',
    'offline.backOnline': 'オンラインに復帰！',
    'offline.cachedDataAvailable': 'キャッシュされたデータが利用可能',
    'offline.cachedData': 'キャッシュされたデータ',

    // Enhanced Chat
    'chat.communityChat': 'コミュニティチャット',
    'chat.activeUsers': 'アクティブユーザー',
    'chat.loading': 'メッセージを読み込み中...',
    'chat.noMessages': 'まだメッセージがありません',
    'chat.startConversation': '最初に会話を始めましょう！',
    'chat.typeMessage': 'メッセージを入力...',
    'chat.emoji': '絵文字を追加',
    'chat.scrollToBottom': '下にスクロール',
    'chat.errorLoading': 'メッセージの読み込みエラー',
    'time.today': '今日',
    'time.yesterday': '昨日',

    // Realtime Events
    'events.nowLive': 'イベントが開始されました！'
  },

  ko: {
    // PWA Installation Prompt
    'pwa.installTitle': 'Battle64 설치',
    'pwa.installDescription': '오프라인 액세스와 빠른 로딩으로 완전한 앱 경험을 얻으세요!',
    'pwa.install': '앱 설치',
    'pwa.gotIt': '알겠습니다!',
    'pwa.iosStep1': '공유 버튼을 탭하세요',
    'pwa.iosStep2': '그런 다음 "홈 화면에 추가"를 탭하세요',
    'common.later': '나중에',

    // Offline Functionality
    'offline.workingOffline': '오프라인으로 작업 중',
    'offline.backOnline': '다시 온라인!',
    'offline.cachedDataAvailable': '캐시된 데이터 사용 가능',
    'offline.cachedData': '캐시된 데이터',

    // Enhanced Chat
    'chat.communityChat': '커뮤니티 채팅',
    'chat.activeUsers': '활성 사용자',
    'chat.loading': '메시지 로딩 중...',
    'chat.noMessages': '아직 메시지가 없습니다',
    'chat.startConversation': '첫 번째로 대화를 시작해보세요!',
    'chat.typeMessage': '메시지를 입력하세요...',
    'chat.emoji': '이모지 추가',
    'chat.scrollToBottom': '아래로 스크롤',
    'chat.errorLoading': '메시지 로딩 오류',
    'time.today': '오늘',
    'time.yesterday': '어제',

    // Realtime Events
    'events.nowLive': '이벤트가 지금 라이브 중입니다!'
  },

  zh: {
    // PWA Installation Prompt
    'pwa.installTitle': '安装 Battle64',
    'pwa.installDescription': '获得完整的应用体验，支持离线访问和快速加载！',
    'pwa.install': '安装应用',
    'pwa.gotIt': '知道了！',
    'pwa.iosStep1': '点击分享按钮',
    'pwa.iosStep2': '然后点击"添加到主屏幕"',
    'common.later': '稍后',

    // Offline Functionality
    'offline.workingOffline': '离线工作',
    'offline.backOnline': '重新上线！',
    'offline.cachedDataAvailable': '缓存数据可用',
    'offline.cachedData': '缓存数据',

    // Enhanced Chat
    'chat.communityChat': '社区聊天',
    'chat.activeUsers': '活跃用户',
    'chat.loading': '加载消息中...',
    'chat.noMessages': '还没有消息',
    'chat.startConversation': '成为第一个开始对话的人！',
    'chat.typeMessage': '输入消息...',
    'chat.emoji': '添加表情',
    'chat.scrollToBottom': '滚动到底部',
    'chat.errorLoading': '加载消息出错',
    'time.today': '今天',
    'time.yesterday': '昨天',

    // Realtime Events
    'events.nowLive': '活动现在直播中！'
  },

  ar: {
    // PWA Installation Prompt
    'pwa.installTitle': 'تثبيت Battle64',
    'pwa.installDescription': 'احصل على تجربة التطبيق الكاملة مع الوصول دون اتصال والتحميل السريع!',
    'pwa.install': 'تثبيت التطبيق',
    'pwa.gotIt': 'فهمت!',
    'pwa.iosStep1': 'اضغط على زر المشاركة',
    'pwa.iosStep2': 'ثم "إضافة إلى الشاشة الرئيسية"',
    'common.later': 'لاحقاً',

    // Offline Functionality
    'offline.workingOffline': 'العمل دون اتصال',
    'offline.backOnline': 'العودة إلى الاتصال!',
    'offline.cachedDataAvailable': 'البيانات المخزنة مؤقتاً متاحة',
    'offline.cachedData': 'البيانات المخزنة مؤقتاً',

    // Enhanced Chat
    'chat.communityChat': 'دردشة المجتمع',
    'chat.activeUsers': 'المستخدمون النشطون',
    'chat.loading': 'تحميل الرسائل...',
    'chat.noMessages': 'لا توجد رسائل بعد',
    'chat.startConversation': 'كن أول من يبدأ المحادثة!',
    'chat.typeMessage': 'اكتب رسالة...',
    'chat.emoji': 'إضافة رمز تعبيري',
    'chat.scrollToBottom': 'التمرير إلى الأسفل',
    'chat.errorLoading': 'خطأ في تحميل الرسائل',
    'time.today': 'اليوم',
    'time.yesterday': 'أمس',

    // Realtime Events
    'events.nowLive': 'الحدث مباشر الآن!'
  },

  tr: {
    // PWA Installation Prompt
    'pwa.installTitle': 'Battle64 Yükle',
    'pwa.installDescription': 'Çevrimdışı erişim ve hızlı yükleme ile tam uygulama deneyimi yaşayın!',
    'pwa.install': 'Uygulamayı Yükle',
    'pwa.gotIt': 'Anladım!',
    'pwa.iosStep1': 'Paylaş düğmesine dokunun',
    'pwa.iosStep2': 'Sonra "Ana Ekrana Ekle"yi seçin',
    'common.later': 'Daha sonra',

    // Offline Functionality
    'offline.workingOffline': 'Çevrimdışı çalışıyor',
    'offline.backOnline': 'Tekrar çevrimiçi!',
    'offline.cachedDataAvailable': 'Önbelleğe alınmış veriler mevcut',
    'offline.cachedData': 'Önbelleğe alınmış veriler',

    // Enhanced Chat
    'chat.communityChat': 'Topluluk Sohbeti',
    'chat.activeUsers': 'aktif kullanıcı',
    'chat.loading': 'Mesajlar yükleniyor...',
    'chat.noMessages': 'Henüz mesaj yok',
    'chat.startConversation': 'Konuşmayı başlatan ilk kişi ol!',
    'chat.typeMessage': 'Bir mesaj yazın...',
    'chat.emoji': 'Emoji ekle',
    'chat.scrollToBottom': 'Aşağı kaydır',
    'chat.errorLoading': 'Mesajlar yüklenirken hata',
    'time.today': 'Bugün',
    'time.yesterday': 'Dün',

    // Realtime Events
    'events.nowLive': 'Etkinlik şimdi canlı!'
  },

  hi: {
    // PWA Installation Prompt
    'pwa.installTitle': 'Battle64 इंस्टॉल करें',
    'pwa.installDescription': 'ऑफ़लाइन एक्सेस और तेज़ लोडिंग के साथ पूरा ऐप अनुभव पाएं!',
    'pwa.install': 'ऐप इंस्टॉल करें',
    'pwa.gotIt': 'समझ गया!',
    'pwa.iosStep1': 'शेयर बटन पर टैप करें',
    'pwa.iosStep2': 'फिर "होम स्क्रीन पर जोड़ें" चुनें',
    'common.later': 'बाद में',

    // Offline Functionality
    'offline.workingOffline': 'ऑफ़लाइन काम कर रहा है',
    'offline.backOnline': 'वापस ऑनलाइन!',
    'offline.cachedDataAvailable': 'कैश्ड डेटा उपलब्ध',
    'offline.cachedData': 'कैश्ड डेटा',

    // Enhanced Chat
    'chat.communityChat': 'कम्यूनिटी चैट',
    'chat.activeUsers': 'सक्रिय उपयोगकर्ता',
    'chat.loading': 'संदेश लोड हो रहे हैं...',
    'chat.noMessages': 'अभी तक कोई संदेश नहीं',
    'chat.startConversation': 'बातचीत शुरू करने वाले पहले व्यक्ति बनें!',
    'chat.typeMessage': 'एक संदेश टाइप करें...',
    'chat.emoji': 'इमोजी जोड़ें',
    'chat.scrollToBottom': 'नीचे स्क्रॉल करें',
    'chat.errorLoading': 'संदेश लोड करने में त्रुटि',
    'time.today': 'आज',
    'time.yesterday': 'कल',

    // Realtime Events
    'events.nowLive': 'इवेंट अब लाइव है!'
  },

  el: {
    // PWA Installation Prompt
    'pwa.installTitle': 'Εγκατάσταση Battle64',
    'pwa.installDescription': 'Αποκτήστε την πλήρη εμπειρία εφαρμογής με offline πρόσβαση και γρήγορη φόρτωση!',
    'pwa.install': 'Εγκατάσταση Εφαρμογής',
    'pwa.gotIt': 'Κατάλαβα!',
    'pwa.iosStep1': 'Πατήστε το κουμπί Κοινοποίηση',
    'pwa.iosStep2': 'Στη συνέχεια "Προσθήκη στην Αρχική Οθόνη"',
    'common.later': 'Αργότερα',

    // Offline Functionality
    'offline.workingOffline': 'Εργασία εκτός σύνδεσης',
    'offline.backOnline': 'Επιστροφή σε σύνδεση!',
    'offline.cachedDataAvailable': 'Διαθέσιμα δεδομένα cache',
    'offline.cachedData': 'Δεδομένα cache',

    // Enhanced Chat
    'chat.communityChat': 'Chat Κοινότητας',
    'chat.activeUsers': 'ενεργοί χρήστες',
    'chat.loading': 'Φόρτωση μηνυμάτων...',
    'chat.noMessages': 'Δεν υπάρχουν μηνύματα ακόμη',
    'chat.startConversation': 'Γίνετε ο πρώτος που θα ξεκινήσει τη συνομιλία!',
    'chat.typeMessage': 'Πληκτρολογήστε ένα μήνυμα...',
    'chat.emoji': 'Προσθήκη emoji',
    'chat.scrollToBottom': 'Κύλιση προς τα κάτω',
    'chat.errorLoading': 'Σφάλμα φόρτωσης μηνυμάτων',
    'time.today': 'Σήμερα',
    'time.yesterday': 'Χθες',

    // Realtime Events
    'events.nowLive': 'Το γεγονός είναι τώρα ζωντανό!'
  }
};

// Function to add translations to a file
function addTranslationsToFile(filePath, langCode) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove the closing brace and export statement
  const lines = content.split('\n');
  const lastBraceIndex = lines.lastIndexOf('}');
  const exportIndex = lines.findIndex(line => line.includes('export default'));
  
  if (lastBraceIndex === -1 || exportIndex === -1) {
    console.log(`Warning: Could not find closing brace or export in ${filePath}`);
    return;
  }
  
  // Get translations for this language
  const translations = pwaTranslations[langCode];
  if (!translations) {
    console.log(`Warning: No translations found for language ${langCode}`);
    return;
  }
  
  // Insert new translations before the closing brace
  const beforeClosing = lines.slice(0, lastBraceIndex);
  const afterClosing = lines.slice(lastBraceIndex);
  
  // Add a comma to the last line if it doesn't have one
  if (beforeClosing.length > 0 && !beforeClosing[beforeClosing.length - 1].trim().endsWith(',')) {
    beforeClosing[beforeClosing.length - 1] += ',';
  }
  
  // Add new translations
  const newTranslations = [];
  newTranslations.push('');
  newTranslations.push('  // PWA Installation Prompt');
  Object.entries(translations).forEach(([key, value]) => {
    if (key.startsWith('pwa.') || key === 'common.later') {
      newTranslations.push(`  '${key}': '${value}',`);
    }
  });
  
  newTranslations.push('');
  newTranslations.push('  // Offline Functionality');
  Object.entries(translations).forEach(([key, value]) => {
    if (key.startsWith('offline.')) {
      newTranslations.push(`  '${key}': '${value}',`);
    }
  });
  
  newTranslations.push('');
  newTranslations.push('  // Enhanced Chat');
  Object.entries(translations).forEach(([key, value]) => {
    if (key.startsWith('chat.') || key.startsWith('time.')) {
      newTranslations.push(`  '${key}': '${value}',`);
    }
  });
  
  newTranslations.push('');
  newTranslations.push('  // Realtime Events');
  Object.entries(translations).forEach(([key, value]) => {
    if (key.startsWith('events.nowLive')) {
      // Remove comma from last entry
      newTranslations.push(`  '${key}': '${value}'`);
    }
  });
  
  // Combine all parts
  const finalContent = [...beforeClosing, ...newTranslations, ...afterClosing].join('\n');
  
  fs.writeFileSync(filePath, finalContent);
  console.log(`✅ Added PWA translations to ${langCode}.ts`);
}

// Process all language files
const languageFiles = [
  'es.ts', 'fr.ts', 'it.ts', 'pt.ts', 'ru.ts', 
  'ja.ts', 'ko.ts', 'zh.ts', 'ar.ts', 'tr.ts', 
  'hi.ts', 'el.ts'
];

languageFiles.forEach(file => {
  const langCode = file.replace('.ts', '');
  const filePath = path.join(translationDir, file);
  
  if (fs.existsSync(filePath)) {
    addTranslationsToFile(filePath, langCode);
  } else {
    console.log(`Warning: File ${filePath} does not exist`);
  }
});

console.log('\n🎉 All PWA translations have been added to all 14 languages!');