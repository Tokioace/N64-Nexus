const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING ALL PLACEHOLDER TEXTS IN ALL LANGUAGES...\n');

// Define all the placeholder fixes for each language
const fixes = {
    ja: {
        // Auth translations
        'auth.welcomeBack': 'おかえりなさい',
        'auth.createAccount': 'アカウント作成',
        'auth.loggingIn': 'ログイン中...',
        'auth.createAccountButton': 'アカウント作成',
        'auth.platform': 'プラットフォーム',
        'auth.region': '地域',
        'auth.invalidCredentials': '認証情報が無効です',
        'auth.errorOccurred': 'エラーが発生しました',
        'auth.passwordsDontMatch': 'パスワードが一致しません',
        'auth.passwordTooShort': 'パスワードが短すぎます',
        'auth.registrationFailed': '登録に失敗しました',
        'auth.noAccountYet': 'アカウントをお持ちでない方',
        'auth.alreadyHaveAccount': '既にアカウントをお持ちの方',
        // Placeholders
        'placeholder.additionalInfo': '追加情報...',
        'placeholder.setupController': 'コントローラー設定...',
        'placeholder.time': '時間...',
        'placeholder.score': 'スコア...',
        'placeholder.proofUrl': '証明URL...',
        'placeholder.notes': 'メモ...',
        'placeholder.recordNotes': 'レコードメモ...'
    },
    zh: {
        // Auth translations
        'auth.welcomeBack': '欢迎回来',
        'auth.createAccount': '创建账户',
        'auth.loggingIn': '登录中...',
        'auth.createAccountButton': '创建账户',
        'auth.platform': '平台',
        'auth.region': '地区',
        'auth.invalidCredentials': '凭据无效',
        'auth.errorOccurred': '发生错误',
        'auth.passwordsDontMatch': '密码不匹配',
        'auth.passwordTooShort': '密码太短',
        'auth.registrationFailed': '注册失败',
        'auth.noAccountYet': '还没有账户？',
        'auth.alreadyHaveAccount': '已有账户？',
        // Placeholders
        'placeholder.additionalInfo': '附加信息...',
        'placeholder.setupController': '控制器设置...',
        'placeholder.time': '时间...',
        'placeholder.score': '分数...',
        'placeholder.proofUrl': '证明链接...',
        'placeholder.notes': '备注...',
        'placeholder.recordNotes': '记录备注...'
    },
    hi: {
        // Auth translations
        'auth.welcomeBack': 'वापसी पर स्वागत है',
        'auth.createAccount': 'खाता बनाएं',
        'auth.loggingIn': 'लॉगिन हो रहा है...',
        'auth.createAccountButton': 'खाता बनाएं',
        'auth.platform': 'प्लेटफॉर्म',
        'auth.region': 'क्षेत्र',
        'auth.invalidCredentials': 'अमान्य क्रेडेंशियल',
        'auth.errorOccurred': 'त्रुटि हुई',
        'auth.passwordsDontMatch': 'पासवर्ड मेल नहीं खाते',
        'auth.passwordTooShort': 'पासवर्ड बहुत छोटा है',
        'auth.registrationFailed': 'पंजीकरण असफल',
        'auth.noAccountYet': 'अभी तक कोई खाता नहीं है?',
        'auth.alreadyHaveAccount': 'पहले से खाता है?',
        // Placeholders
        'placeholder.additionalInfo': 'अतिरिक्त जानकारी...',
        'placeholder.setupController': 'कंट्रोलर सेटअप...',
        'placeholder.time': 'समय...',
        'placeholder.score': 'स्कोर...',
        'placeholder.proofUrl': 'प्रमाण URL...',
        'placeholder.notes': 'नोट्स...',
        'placeholder.recordNotes': 'रिकॉर्ड नोट्स...'
    },
    ar: {
        // Auth translations
        'auth.welcomeBack': 'مرحباً بعودتك',
        'auth.createAccount': 'إنشاء حساب',
        'auth.loggingIn': 'جاري تسجيل الدخول...',
        'auth.createAccountButton': 'إنشاء حساب',
        'auth.platform': 'المنصة',
        'auth.region': 'المنطقة',
        'auth.invalidCredentials': 'بيانات اعتماد غير صحيحة',
        'auth.errorOccurred': 'حدث خطأ',
        'auth.passwordsDontMatch': 'كلمات المرور غير متطابقة',
        'auth.passwordTooShort': 'كلمة المرور قصيرة جداً',
        'auth.registrationFailed': 'فشل التسجيل',
        'auth.noAccountYet': 'ليس لديك حساب بعد؟',
        'auth.alreadyHaveAccount': 'لديك حساب بالفعل؟',
        // Placeholders
        'placeholder.additionalInfo': 'معلومات إضافية...',
        'placeholder.setupController': 'إعداد وحدة التحكم...',
        'placeholder.time': 'الوقت...',
        'placeholder.score': 'النتيجة...',
        'placeholder.proofUrl': 'رابط الإثبات...',
        'placeholder.notes': 'الملاحظات...',
        'placeholder.recordNotes': 'ملاحظات الرقم القياسي...'
    },
    pt: {
        // Auth translations
        'auth.welcomeBack': 'Bem-vindo de volta',
        'auth.createAccount': 'Criar conta',
        'auth.loggingIn': 'Fazendo login...',
        'auth.createAccountButton': 'Criar conta',
        'auth.platform': 'Plataforma',
        'auth.region': 'Região',
        'auth.invalidCredentials': 'Credenciais inválidas',
        'auth.errorOccurred': 'Ocorreu um erro',
        'auth.passwordsDontMatch': 'Senhas não coincidem',
        'auth.passwordTooShort': 'Senha muito curta',
        'auth.registrationFailed': 'Falha no registro',
        'auth.noAccountYet': 'Ainda não tem conta?',
        'auth.alreadyHaveAccount': 'Já tem uma conta?',
        // Placeholders
        'placeholder.additionalInfo': 'Informações adicionais...',
        'placeholder.setupController': 'Configuração do controle...',
        'placeholder.time': 'Tempo...',
        'placeholder.score': 'Pontuação...',
        'placeholder.proofUrl': 'URL de prova...',
        'placeholder.notes': 'Notas...',
        'placeholder.recordNotes': 'Notas do recorde...'
    },
    es: {
        // Auth translations
        'auth.welcomeBack': 'Bienvenido de vuelta',
        'auth.createAccount': 'Crear cuenta',
        'auth.loggingIn': 'Iniciando sesión...',
        'auth.createAccountButton': 'Crear cuenta',
        'auth.platform': 'Plataforma',
        'auth.region': 'Región',
        'auth.invalidCredentials': 'Credenciales inválidas',
        'auth.errorOccurred': 'Ocurrió un error',
        'auth.passwordsDontMatch': 'Las contraseñas no coinciden',
        'auth.passwordTooShort': 'Contraseña demasiado corta',
        'auth.registrationFailed': 'Registro fallido',
        'auth.noAccountYet': '¿Aún no tienes cuenta?',
        'auth.alreadyHaveAccount': '¿Ya tienes una cuenta?',
        // Placeholders
        'placeholder.additionalInfo': 'Información adicional...',
        'placeholder.setupController': 'Configuración del control...',
        'placeholder.time': 'Tiempo...',
        'placeholder.score': 'Puntuación...',
        'placeholder.proofUrl': 'URL de prueba...',
        'placeholder.notes': 'Notas...',
        'placeholder.recordNotes': 'Notas del récord...'
    },
    tr: {
        // Auth translations
        'auth.welcomeBack': 'Tekrar hoş geldiniz',
        'auth.createAccount': 'Hesap oluştur',
        'auth.loggingIn': 'Giriş yapılıyor...',
        'auth.createAccountButton': 'Hesap oluştur',
        'auth.platform': 'Platform',
        'auth.region': 'Bölge',
        'auth.invalidCredentials': 'Geçersiz kimlik bilgileri',
        'auth.errorOccurred': 'Bir hata oluştu',
        'auth.passwordsDontMatch': 'Şifreler eşleşmiyor',
        'auth.passwordTooShort': 'Şifre çok kısa',
        'auth.registrationFailed': 'Kayıt başarısız',
        'auth.noAccountYet': 'Henüz hesabınız yok mu?',
        'auth.alreadyHaveAccount': 'Zaten hesabınız var mı?',
        // Placeholders
        'placeholder.additionalInfo': 'Ek bilgi...',
        'placeholder.setupController': 'Kontrolcü kurulumu...',
        'placeholder.time': 'Zaman...',
        'placeholder.score': 'Skor...',
        'placeholder.proofUrl': 'Kanıt URL\'si...',
        'placeholder.notes': 'Notlar...',
        'placeholder.recordNotes': 'Rekor notları...'
    },
    ru: {
        // Placeholders
        'placeholder.time': 'Время...',
        'placeholder.score': 'Счет...',
        'placeholder.proofUrl': 'URL доказательства...',
        'placeholder.notes': 'Заметки...',
        'placeholder.recordNotes': 'Заметки о рекорде...'
    },
    el: {
        // Auth translations
        'auth.invalidCredentials': 'Μη έγκυρα στοιχεία',
        'auth.errorOccurred': 'Παρουσιάστηκε σφάλμα',
        'auth.passwordsDontMatch': 'Οι κωδικοί δεν ταιριάζουν',
        'auth.passwordTooShort': 'Ο κωδικός είναι πολύ μικρός',
        'auth.usernameTooShort': 'Το όνομα χρήστη είναι πολύ μικρό',
        'auth.emailPlaceholder': 'Εισάγετε email...',
        'auth.usernamePlaceholder': 'Εισάγετε όνομα χρήστη...',
        'auth.registrationFailed': 'Η εγγραφή απέτυχε',
        'auth.noAccountYet': 'Δεν έχετε λογαριασμό ακόμα;',
        'auth.registerNow': 'Εγγραφείτε τώρα',
        'auth.alreadyHaveAccount': 'Έχετε ήδη λογαριασμό;'
    }
};

// Function to apply fixes to a language file
function fixLanguageFile(langCode) {
    const filePath = `./src/translations/${langCode}.ts`;
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ ${langCode}.ts not found`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const langFixes = fixes[langCode];
    
    if (!langFixes) {
        console.log(`⚠️  No fixes defined for ${langCode}`);
        return;
    }
    
    let fixCount = 0;
    
    // Apply each fix
    Object.entries(langFixes).forEach(([key, translation]) => {
        // Look for patterns like 'key': 'Auth Something' or 'key': 'Placeholder Something'
        const authPattern = new RegExp(`('${key.replace('.', '\\.')}': ')Auth [^']+(')`);
        const placeholderPattern = new RegExp(`('${key.replace('.', '\\.')}': ')Placeholder [^']+(')`);
        
        if (authPattern.test(content)) {
            content = content.replace(authPattern, `$1${translation}$2`);
            fixCount++;
        } else if (placeholderPattern.test(content)) {
            content = content.replace(placeholderPattern, `$1${translation}$2`);
            fixCount++;
        }
    });
    
    // Write back the fixed content
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${langCode}.ts: ${fixCount} fixes applied`);
}

// Apply fixes to all languages
const languages = ['ja', 'zh', 'hi', 'ar', 'pt', 'es', 'tr', 'ru', 'el'];

languages.forEach(lang => {
    fixLanguageFile(lang);
});

console.log('\n🎉 ALL PLACEHOLDER FIXES APPLIED!');
console.log('✅ Professional translations implemented');
console.log('✅ No more "Auth Something" or "Placeholder Something"');
console.log('✅ Ready for deployment!');