import React from "react";
import { useTranslation } from "react-i18next";


const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div style={{ margin: "1rem", textAlign: "right" }}>
            🌐
            <select
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language}
            >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="bn">Bengali</option>
                <option value="gu">Gujarati</option>
                <option value="mr">Marathi</option>
                <option value="pa">Punjabi</option>
                <option value="ur">Urdu</option>
                <option value="kn">Kannada</option>
            </select>
        </div>
    );
};

export default LanguageSelector;
