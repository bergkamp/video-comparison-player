//https://segmentfault.com/a/1190000015008808
import Vue from 'vue'
import VueI18n from 'vue-i18n'
const app = require('electron').remote.app;

import eleLang from 'element-ui/lib/locale/lang/en'
import eleLocale from 'element-ui/lib/locale'


Vue.use(VueI18n)


const messages = {
    'zh': {
        AppName: "视频对比播放器",
        OpenFile: "选取视频或图片",
        Play: "播放",
        Pause: "暂停",
        Replay: "重播",
        Overlap: "重叠",
        Split: "分离",

        
    },
    'en': {
        AppName: "Video Comparison Player",
        OpenFile: "Open video",
        Play: "Play ",
        Pause: "Pause",
        Replay: "Replay",
        Overlap: "Overlap",
        Split: "Split ",
    },
};
const DEFAULT_LANG = 'en'

const i18n = new VueI18n({
    locale: DEFAULT_LANG,
    messages: messages,
    silentFallbackWarn:true//https://kazupon.github.io/vue-i18n/zh/guide/fallback.html#%E5%9B%9E%E9%80%80%E6%8F%92%E5%80%BC
})

export const setup = lang => {
    if (lang === undefined) {
        lang = DEFAULT_LANG;
    }
    i18n.locale = lang

    //设置element语言
    console.log("==lang==",lang);
    if(lang != 'zh-CN'){
        eleLocale.use(eleLang);
    }
    //   if (lang === undefined) {
    //     lang = window.localStorage.getItem(LOCALE_KEY)
    //     if (locales[lang] === undefined) {
    //       lang = DEFAULT_LANG
    //     }
    //   }
    //   window.localStorage.setItem(LOCALE_KEY, lang)

    //   Object.keys(locales).forEach(lang => {
    //     document.body.classList.remove(`lang-${lang}`)
    //   })
    //   document.body.classList.add(`lang-${lang}`)
    //   document.body.setAttribute('lang', lang)

    //   Vue.config.lang = lang

}
console.log(app.getLocale());
setup(app.getLocale());
export default i18n