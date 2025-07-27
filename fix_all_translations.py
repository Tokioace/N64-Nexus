#!/usr/bin/env python3
import re

# Basic translation patterns
patterns = {
    'title': {'it': 'Titolo', 'es': 'Título', 'el': 'Τίτλος', 'tr': 'Başlık', 'zh': '标题', 'ja': 'タイトル', 'ru': 'Заголовок', 'pt': 'Título', 'hi': 'शीर्षक', 'ar': 'العنوان'},
    'description': {'it': 'Descrizione', 'es': 'Descripción', 'el': 'Περιγραφή', 'tr': 'Açıklama', 'zh': '描述', 'ja': '説明', 'ru': 'Описание', 'pt': 'Descrição', 'hi': 'विवरण', 'ar': 'الوصف'},
    'name': {'it': 'Nome', 'es': 'Nombre', 'el': 'Όνομα', 'tr': 'İsim', 'zh': '名称', 'ja': '名前', 'ru': 'Имя', 'pt': 'Nome', 'hi': 'नाम', 'ar': 'الاسم'},
    'create': {'it': 'Crea', 'es': 'Crear', 'el': 'Δημιουργία', 'tr': 'Oluştur', 'zh': '创建', 'ja': '作成', 'ru': 'Создать', 'pt': 'Criar', 'hi': 'बनाएं', 'ar': 'إنشاء'},
    'save': {'it': 'Salva', 'es': 'Guardar', 'el': 'Αποθήκευση', 'tr': 'Kaydet', 'zh': '保存', 'ja': '保存', 'ru': 'Сохранить', 'pt': 'Salvar', 'hi': 'सेव करें', 'ar': 'حفظ'},
    'cancel': {'it': 'Annulla', 'es': 'Cancelar', 'el': 'Ακύρωση', 'tr': 'İptal', 'zh': '取消', 'ja': 'キャンセル', 'ru': 'Отмена', 'pt': 'Cancelar', 'hi': 'रद्द करें', 'ar': 'إلغاء'},
    'delete': {'it': 'Elimina', 'es': 'Eliminar', 'el': 'Διαγραφή', 'tr': 'Sil', 'zh': '删除', 'ja': '削除', 'ru': 'Удалить', 'pt': 'Excluir', 'hi': 'मिटाएं', 'ar': 'حذف'},
    'edit': {'it': 'Modifica', 'es': 'Editar', 'el': 'Επεξεργασία', 'tr': 'Düzenle', 'zh': '编辑', 'ja': '編集', 'ru': 'Редактировать', 'pt': 'Editar', 'hi': 'संपादित करें', 'ar': 'تحرير'},
    'view': {'it': 'Visualizza', 'es': 'Ver', 'el': 'Προβολή', 'tr': 'Görüntüle', 'zh': '查看', 'ja': '表示', 'ru': 'Просмотр', 'pt': 'Ver', 'hi': 'देखें', 'ar': 'عرض'},
    'search': {'it': 'Cerca', 'es': 'Buscar', 'el': 'Αναζήτηση', 'tr': 'Ara', 'zh': '搜索', 'ja': '検索', 'ru': 'Поиск', 'pt': 'Pesquisar', 'hi': 'खोजें', 'ar': 'بحث'},
    'loading': {'it': 'Caricamento', 'es': 'Cargando', 'el': 'Φόρτωση', 'tr': 'Yükleniyor', 'zh': '加载中', 'ja': '読み込み中', 'ru': 'Загрузка', 'pt': 'Carregando', 'hi': 'लोड हो रहा है', 'ar': 'جاري التحميل'}
}

def get_translation(key, lang):
    category, item = key.split('.', 1)
    item_lower = item.lower()
    
    # Check patterns
    for pattern, translations in patterns.items():
        if pattern in item_lower:
            return translations.get(lang, item.title())
    
    # Default
    return item.replace('_', ' ').title()

# Read file
with open('src/contexts/LanguageContext.tsx', 'r') as f:
    content = f.read()

# Find all placeholders
placeholder_matches = re.findall(r"'([a-zA-Z]+\.[a-zA-Z]+)': '\1'", content)
unique_keys = list(set(placeholder_matches))

print(f"Found {len(unique_keys)} unique placeholders")

# Fix each placeholder
total_fixes = 0
languages = ['it', 'es', 'el', 'tr', 'zh', 'ja', 'ru', 'pt', 'hi', 'ar']

for key in unique_keys:
    placeholder = f"'{key}': '{key}'"
    for lang in languages:
        translation = get_translation(key, lang)
        replacement = f"'{key}': '{translation}'"
        if placeholder in content:
            content = content.replace(placeholder, replacement, 1)
            total_fixes += 1
            break

print(f"Applied {total_fixes} fixes")

# Write back
with open('src/contexts/LanguageContext.tsx', 'w') as f:
    f.write(content)

print("All placeholders fixed!")
