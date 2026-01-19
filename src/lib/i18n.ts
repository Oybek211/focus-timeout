export type Locale = "uz" | "ru" | "en";

export const locales: { code: Locale; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

export const translations = {
  uz: {
    // Header & Navigation
    home: "Bosh sahifa",
    statistics: "Statistika",
    settings: "Sozlamalar",
    help: "Yordam",
    about: "Haqida",

    // Help banner
    helpBanner: {
      newTo: "Yangi foydalanuvchimisiz?",
      learnHow: "Qanday ishlashini o'rganing",
    },

    // Timer Card
    timer: {
      focusSession: "Fokus sessiyasi",
      focus: "Fokus",
      timeout: "Tanaffus",
      start: "Boshlash",
      pause: "To'xtatish",
      resume: "Davom ettirish",
      sessionComplete: "Sessiya tugadi. Yana bir marta tayyormisiz.",
      allSessionsComplete: "Barcha {count} sessiya tugadi!",
      quickSettings: "Tez sozlamalar",
      allSettings: "Barcha sozlamalar",
      repeat: "Takrorlash",
      once: "Bir marta",
      loop: "Cheksiz",
      custom: "Maxsus",
      notificationsEnabled: "Bildirishnomalar yoqilgan",
      notificationsDenied: "Bildirishnomalar rad etilgan",
      enableNotifications: "Bildirishnomalarni yoqish",
    },

    // Time picker
    timePicker: {
      setFocusTime: "Fokus vaqtini belgilash",
      setTimeout: "Tanaffus vaqtini belgilash",
      hours: "soat",
      min: "daq",
      sec: "son",
      cancel: "Bekor qilish",
      confirm: "Tasdiqlash",
    },

    // Settings page
    settingsPage: {
      title: "Sozlamalar",
      description: "Fokus davomiyligini, tanaffus nisbatini va audio signallarni sozlang.",
      timerConfig: "Taymer sozlamalari",
      focusDuration: "Fokus davomiyligi",
      tapToChange: "O'zgartirish uchun bosing",
      timeoutMode: "Tanaffus rejimi",
      percentOfFocus: "Fokusning foizi",
      fixedDuration: "Belgilangan davomiylik",
      timeoutPercent: "Tanaffus foizi",
      timeoutDuration: "Tanaffus davomiyligi",
      repeatSettings: "Takrorlash sozlamalari",
      repeatMode: "Takrorlash rejimi",
      loopInfinite: "Cheksiz takrorlash",
      customCount: "Maxsus son",
      numberOfSessions: "Sessiyalar soni",
      willRun: "{count} fokus + tanaffus sessiyasi ishlaydi",
      audioCues: "Audio signallar",
      focusStart: "Fokus boshlanishi",
      focusEnd: "Fokus tugashi",
      timeoutStart: "Tanaffus boshlanishi",
      timeoutEnd: "Tanaffus tugashi",
      selectSound: "Ovoz tanlang",
      customSounds: "Maxsus ovozlar",
      uploadDescription: "O'z audio fayllaringizni bildirishnoma ovozlari sifatida yuklang.",
      uploadSound: "Ovoz yuklash",
      cancelChanges: "Bekor qilish",
      saveSettings: "Saqlash",
    },

    // Statistics page
    statsPage: {
      title: "Statistika",
      description: "Fokus va tanaffus vaqtlaringizni kuzating.",
      totalFocus: "Jami fokus",
      totalTimeout: "Jami tanaffus",
      completedSessions: "Tugatilgan sessiyalar",
      todayFocus: "Bugungi fokus",
      todayTimeout: "Bugungi tanaffus",
      todaySessions: "Bugungi sessiyalar",
      minutes: "daqiqa",
      hours: "soat",
      today: "Bugun",
      thisWeek: "Shu hafta",
      allTime: "Jami",
      focusMinutes: "Fokus daqiqalari",
      timeoutMinutes: "Tanaffus daqiqalari",
      sessions: "Sessiyalar",
    },

    // Quick Stats
    quickStats: {
      title: "Bugungi statistika",
      focus: "Fokus",
      timeout: "Tanaffus",
      sessions: "Sessiyalar",
    },

    // Help page
    helpPage: {
      title: "Yordam",
      description: "Focus Timeout dan maksimal foydalanish uchun tez javoblar.",
      howToUse: "Focus Timeout qanday ishlatiladi?",
      howToUseAnswer: "Tez sozlamalar yordamida fokus davomiyligini va tanaffus uzunligini belgilang, so'ng Boshlash tugmasini bosing. Taymer sizni fokus bosqichi, keyin esa tanaffus bosqichidan o'tkazadi. Har bir o'tishda audio signal eshitiladi.",
      repeatOptions: "Takrorlash variantlari nima?",
      repeatOptionsAnswer: "Bitta sessiya uchun \"Bir marta\", uzluksiz sikl uchun \"Cheksiz\" yoki ma'lum sondagi sessiyalar uchun \"Maxsus\" ni tanlang.",
      timerAccuracy: "Taymer fonida ham aniq ishlaydi?",
      timerAccuracyAnswer: "Ha, ortga hisoblash vaqt belgilariga asoslangan, shuning uchun brauzer fonga o'tganda ham vaqt aniq qoladi.",
      dataSync: "Ma'lumotlarim sinxronlanadimi?",
      dataSyncAnswer: "Yo'q. Barcha sozlamalar va statistika faqat brauzeringizda localStorage orqali saqlanadi.",
      howToInstall: "Ilovani qanday o'rnatish mumkin?",
      howToInstallAnswer: "Brauzer menyusini oching va \"Focus Timeout ni o'rnatish\" ni tanlang. O'rnatilgandan so'ng, u to'liq oflayn ishlaydi.",
    },

    // About page
    aboutPage: {
      title: "Haqida",
      description: "Focus Timeout - fokuslanish va samaradorlikni oshirish uchun oddiy taymer.",
      whatIs: "Focus Timeout nima?",
      whatIsAnswer: "Focus Timeout - bu Pomodoro texnikasiga asoslangan vaqtni boshqarish ilovasi. U sizga chuqur ishlash va dam olish o'rtasida muvozanat saqlashga yordam beradi.",
      features: "Asosiy xususiyatlar",
      feature1: "Moslashuvchan fokus va tanaffus vaqtlari",
      feature2: "Takrorlanadigan sessiyalar (bir marta, cheksiz yoki maxsus)",
      feature3: "Audio bildirishnomalar har bir bosqichda",
      feature4: "Statistika va tarix kuzatuvi",
      feature5: "To'liq oflayn ishlash (PWA)",
      feature6: "3 tilda mavjud: O'zbekcha, Ruscha, Inglizcha",
      howItWorks: "Qanday ishlaydi?",
      howItWorksAnswer: "Fokus vaqtini belgilang, Boshlash tugmasini bosing va ishga kirishin. Vaqt tugaganda audio signal eshitiladi va tanaffus bosqichi boshlanadi. Tanaffusdan keyin yangi fokus sessiyasi avtomatik boshlanadi.",
      offline: "Oflayn ishlash",
      offlineAnswer: "Focus Timeout Progressive Web App (PWA) sifatida yaratilgan. Bir marta yuklagandan so'ng, internet bo'lmasa ham to'liq ishlaydi. Barcha ma'lumotlar brauzeringizda saqlanadi.",
    },
  },

  ru: {
    // Header & Navigation
    home: "Главная",
    statistics: "Статистика",
    settings: "Настройки",
    help: "Помощь",
    about: "О приложении",

    // Help banner
    helpBanner: {
      newTo: "Новый пользователь?",
      learnHow: "Узнайте как это работает",
    },

    // Timer Card
    timer: {
      focusSession: "Сессия фокуса",
      focus: "Фокус",
      timeout: "Перерыв",
      start: "Старт",
      pause: "Пауза",
      resume: "Продолжить",
      sessionComplete: "Сессия завершена. Готовы к ещё одной?",
      allSessionsComplete: "Все {count} сессий завершены!",
      quickSettings: "Быстрые настройки",
      allSettings: "Все настройки",
      repeat: "Повтор",
      once: "Один раз",
      loop: "Цикл",
      custom: "Свой",
      notificationsEnabled: "Уведомления включены",
      notificationsDenied: "Уведомления отклонены",
      enableNotifications: "Включить уведомления",
    },

    // Time picker
    timePicker: {
      setFocusTime: "Установить время фокуса",
      setTimeout: "Установить время перерыва",
      hours: "час",
      min: "мин",
      sec: "сек",
      cancel: "Отмена",
      confirm: "Подтвердить",
    },

    // Settings page
    settingsPage: {
      title: "Настройки",
      description: "Настройте длительность фокуса, соотношение перерыва и звуковые сигналы.",
      timerConfig: "Настройки таймера",
      focusDuration: "Длительность фокуса",
      tapToChange: "Нажмите для изменения",
      timeoutMode: "Режим перерыва",
      percentOfFocus: "Процент от фокуса",
      fixedDuration: "Фиксированная длительность",
      timeoutPercent: "Процент перерыва",
      timeoutDuration: "Длительность перерыва",
      repeatSettings: "Настройки повтора",
      repeatMode: "Режим повтора",
      loopInfinite: "Бесконечный цикл",
      customCount: "Своё количество",
      numberOfSessions: "Количество сессий",
      willRun: "Будет выполнено {count} сессий фокус + перерыв",
      audioCues: "Звуковые сигналы",
      focusStart: "Начало фокуса",
      focusEnd: "Конец фокуса",
      timeoutStart: "Начало перерыва",
      timeoutEnd: "Конец перерыва",
      selectSound: "Выберите звук",
      customSounds: "Свои звуки",
      uploadDescription: "Загрузите свои аудиофайлы для уведомлений.",
      uploadSound: "Загрузить звук",
      cancelChanges: "Отмена",
      saveSettings: "Сохранить",
    },

    // Statistics page
    statsPage: {
      title: "Статистика",
      description: "Отслеживайте время фокуса и перерывов.",
      totalFocus: "Всего фокуса",
      totalTimeout: "Всего перерывов",
      completedSessions: "Завершённые сессии",
      todayFocus: "Фокус сегодня",
      todayTimeout: "Перерывы сегодня",
      todaySessions: "Сессии сегодня",
      minutes: "минут",
      hours: "часов",
      today: "Сегодня",
      thisWeek: "Эта неделя",
      allTime: "За всё время",
      focusMinutes: "Минуты фокуса",
      timeoutMinutes: "Минуты перерыва",
      sessions: "Сессии",
    },

    // Quick Stats
    quickStats: {
      title: "Статистика за сегодня",
      focus: "Фокус",
      timeout: "Перерыв",
      sessions: "Сессии",
    },

    // Help page
    helpPage: {
      title: "Помощь",
      description: "Быстрые ответы для максимальной пользы от Focus Timeout.",
      howToUse: "Как использовать Focus Timeout?",
      howToUseAnswer: "Установите длительность фокуса и перерыва через быстрые настройки, затем нажмите Старт. Таймер проведёт вас через фазу фокуса, а затем фазу перерыва. Звуковые сигналы воспроизводятся при каждом переходе.",
      repeatOptions: "Что такое варианты повтора?",
      repeatOptionsAnswer: "Выберите \"Один раз\" для одной сессии, \"Цикл\" для непрерывных циклов или \"Свой\" для определённого количества сессий.",
      timerAccuracy: "Почему таймер точен в фоновом режиме?",
      timerAccuracyAnswer: "Обратный отсчёт основан на временных метках, поэтому время остаётся точным, когда браузер переходит в фоновый режим.",
      dataSync: "Мои данные синхронизируются?",
      dataSyncAnswer: "Нет. Все настройки и статистика хранятся только в вашем браузере через localStorage.",
      howToInstall: "Как установить приложение?",
      howToInstallAnswer: "Откройте меню браузера и выберите \"Установить Focus Timeout\". После установки приложение работает полностью офлайн.",
    },

    // About page
    aboutPage: {
      title: "О приложении",
      description: "Focus Timeout - простой таймер для повышения концентрации и продуктивности.",
      whatIs: "Что такое Focus Timeout?",
      whatIsAnswer: "Focus Timeout - это приложение для управления временем, основанное на технике Помодоро. Оно помогает вам найти баланс между глубокой работой и отдыхом.",
      features: "Основные возможности",
      feature1: "Гибкие настройки времени фокуса и перерыва",
      feature2: "Повторяющиеся сессии (один раз, бесконечно или своё количество)",
      feature3: "Звуковые уведомления на каждом этапе",
      feature4: "Статистика и отслеживание истории",
      feature5: "Полная офлайн работа (PWA)",
      feature6: "Доступно на 3 языках: Узбекский, Русский, Английский",
      howItWorks: "Как это работает?",
      howItWorksAnswer: "Установите время фокуса, нажмите Старт и приступайте к работе. Когда время закончится, прозвучит сигнал и начнётся фаза перерыва. После перерыва автоматически начнётся новая сессия фокуса.",
      offline: "Офлайн режим",
      offlineAnswer: "Focus Timeout создан как Progressive Web App (PWA). После первой загрузки он работает полностью без интернета. Все данные хранятся в вашем браузере.",
    },
  },

  en: {
    // Header & Navigation
    home: "Home",
    statistics: "Statistics",
    settings: "Settings",
    help: "Help",
    about: "About",

    // Help banner
    helpBanner: {
      newTo: "New user?",
      learnHow: "Learn how it works",
    },

    // Timer Card
    timer: {
      focusSession: "Focus Session",
      focus: "Focus",
      timeout: "Timeout",
      start: "Start",
      pause: "Pause",
      resume: "Resume",
      sessionComplete: "Session complete. Ready for another round.",
      allSessionsComplete: "All {count} sessions complete!",
      quickSettings: "Quick Settings",
      allSettings: "All settings",
      repeat: "Repeat",
      once: "Once",
      loop: "Loop",
      custom: "Custom",
      notificationsEnabled: "Notifications enabled",
      notificationsDenied: "Notifications denied",
      enableNotifications: "Enable notifications",
    },

    // Time picker
    timePicker: {
      setFocusTime: "Set Focus Time",
      setTimeout: "Set Timeout",
      hours: "hours",
      min: "min",
      sec: "sec",
      cancel: "Cancel",
      confirm: "Confirm",
    },

    // Settings page
    settingsPage: {
      title: "Settings",
      description: "Tune your focus duration, timeout ratio, and audio cues.",
      timerConfig: "Timer Configuration",
      focusDuration: "Focus duration",
      tapToChange: "Tap to change",
      timeoutMode: "Timeout mode",
      percentOfFocus: "Percentage of focus",
      fixedDuration: "Fixed duration",
      timeoutPercent: "Timeout percentage",
      timeoutDuration: "Timeout duration",
      repeatSettings: "Repeat Settings",
      repeatMode: "Repeat mode",
      loopInfinite: "Loop (infinite)",
      customCount: "Custom count",
      numberOfSessions: "Number of sessions",
      willRun: "Will run {count} focus + timeout sessions",
      audioCues: "Audio Cues",
      focusStart: "Focus start",
      focusEnd: "Focus end",
      timeoutStart: "Timeout start",
      timeoutEnd: "Timeout end",
      selectSound: "Select sound",
      customSounds: "Custom Sounds",
      uploadDescription: "Upload your own audio files to use as notification sounds.",
      uploadSound: "Upload sound",
      cancelChanges: "Cancel",
      saveSettings: "Save settings",
    },

    // Statistics page
    statsPage: {
      title: "Statistics",
      description: "Track your focus and timeout times.",
      totalFocus: "Total focus",
      totalTimeout: "Total timeout",
      completedSessions: "Completed sessions",
      todayFocus: "Today's focus",
      todayTimeout: "Today's timeout",
      todaySessions: "Today's sessions",
      minutes: "minutes",
      hours: "hours",
      today: "Today",
      thisWeek: "This week",
      allTime: "All time",
      focusMinutes: "Focus Minutes",
      timeoutMinutes: "Timeout Minutes",
      sessions: "Sessions",
    },

    // Quick Stats
    quickStats: {
      title: "Today's Stats",
      focus: "Focus",
      timeout: "Timeout",
      sessions: "Sessions",
    },

    // Help page
    helpPage: {
      title: "Help",
      description: "Quick answers for getting the most out of Focus Timeout.",
      howToUse: "How do I use Focus Timeout?",
      howToUseAnswer: "Set your focus duration and timeout length using the quick settings, then press Start. The timer will guide you through a focus phase followed by a timeout phase. Audio cues play at each transition.",
      repeatOptions: "What are the repeat options?",
      repeatOptionsAnswer: "Choose \"Once\" for a single session, \"Loop\" for continuous cycles, or \"Custom\" to set a specific number of sessions.",
      timerAccuracy: "Why does the timer stay accurate in the background?",
      timerAccuracyAnswer: "The countdown is driven by timestamps, not tab-active intervals, so elapsed time stays precise when the browser goes idle.",
      dataSync: "Is my data synced anywhere?",
      dataSyncAnswer: "No. All settings and statistics live only in your browser via localStorage.",
      howToInstall: "How do I install the app?",
      howToInstallAnswer: "Open the browser menu and choose \"Install Focus Timeout\". Once installed, it works fully offline.",
    },

    // About page
    aboutPage: {
      title: "About",
      description: "Focus Timeout - a simple timer to improve focus and productivity.",
      whatIs: "What is Focus Timeout?",
      whatIsAnswer: "Focus Timeout is a time management app based on the Pomodoro technique. It helps you balance deep work with intentional rest periods.",
      features: "Key Features",
      feature1: "Flexible focus and timeout durations",
      feature2: "Repeating sessions (once, infinite, or custom count)",
      feature3: "Audio notifications at each phase",
      feature4: "Statistics and history tracking",
      feature5: "Fully offline capable (PWA)",
      feature6: "Available in 3 languages: Uzbek, Russian, English",
      howItWorks: "How does it work?",
      howItWorksAnswer: "Set your focus time, press Start and get to work. When time runs out, an audio cue plays and the timeout phase begins. After the break, a new focus session starts automatically.",
      offline: "Offline Mode",
      offlineAnswer: "Focus Timeout is built as a Progressive Web App (PWA). Once loaded, it works completely offline. All your data is stored locally in your browser.",
    },
  },
};

// Helper type to convert literal strings to string type
type DeepStringify<T> = T extends string
  ? string
  : T extends object
    ? { [K in keyof T]: DeepStringify<T[K]> }
    : T;

export type Translations = DeepStringify<typeof translations.uz>;
