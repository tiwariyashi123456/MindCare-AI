const translations = {
    en: {
        language: "Language",
        dashboard: "Dashboard",
        mindCheck: "Mind Check",
        myProgress: "My Progress",
        meditation: "Meditation",
        yoga: "Yoga",
        exercise: "Exercise",
        wellnessTimer: "Wellness Timer",
        myReports: "My Reports",
        mindGames: "Mind Games",
        professionalHelp: "Professional Help",

        welcome: "Welcome to MindCare AI",
        startMindCheck: "Start Mind Check",
        trackMood: "Track your mood and understand your mental well-being.",
        meditationText: "Relax your mind with guided meditation.",
        exerciseText: "Stay active and improve your wellness.",
        yogaText: "Practice yoga for a healthy mind and body.",
        journal: "Journal",
        reports: "Reports",
        aiChat: "AI Chat",

        english: "English",
        hindi: "Hindi"
    },

    hi: {
        language: "भाषा",
        dashboard: "डैशबोर्ड",
        mindCheck: "मानसिक जाँच",
        myProgress: "मेरी प्रगति",
        meditation: "ध्यान",
        yoga: "योग",
        exercise: "व्यायाम",
        wellnessTimer: "वेलनेस टाइमर",
        myReports: "मेरी रिपोर्ट",
        mindGames: "माइंड गेम्स",
        professionalHelp: "विशेषज्ञ सहायता",

        welcome: "MindCare AI में आपका स्वागत है",
        startMindCheck: "मानसिक जाँच शुरू करें",
        trackMood: "अपने मूड को ट्रैक करें और अपने मानसिक स्वास्थ्य को समझें।",
        meditationText: "Guided meditation के साथ अपने मन को शांत करें।",
        exerciseText: "सक्रिय रहें और अपने स्वास्थ्य में सुधार करें।",
        yogaText: "स्वस्थ मन और शरीर के लिए योग करें।",
        journal: "डायरी",
        reports: "रिपोर्ट",
        aiChat: "AI चैट",

        english: "English",
        hindi: "हिंदी"
    }
};


function changeLanguage(language) {

    localStorage.setItem("mindcareLanguage", language);

    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach(function(element) {

        const key = element.getAttribute("data-i18n");

        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }

    });

    const languageSelect = document.getElementById("languageSelect");

    if (languageSelect) {
        languageSelect.value = language;
    }
}


function loadLanguage() {

    const savedLanguage =
        localStorage.getItem("mindcareLanguage") || "en";

    changeLanguage(savedLanguage);
}


document.addEventListener("DOMContentLoaded", function () {

    const languageSelect =
        document.getElementById("languageSelect");

    if (languageSelect) {

        languageSelect.addEventListener("change", function () {

            changeLanguage(this.value);

        });
    }

    loadLanguage();
});