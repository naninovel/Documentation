module.exports = {
    title: 'Naninovel',
    description: 'A full-featured, writer-friendly and completely customizable visual novel extension for Unity game engine.',
    contentLoading: true,
    head: [
        ['link', {rel: 'icon', href: '/assets/img/nani-logo.svg'}],
        ['meta', {name: 'og:image', content: '/assets/img/og.jpg'}],
        ['meta', {name: 'twitter:card', content: 'summary_large_image'}],
        ['meta', {name: 'google-site-verification', content: 'cdvgJ2XFFbaGErDKJtTbFj9u9frfReZ9rzUnsf9F6nI'}]
    ],
    themeConfig: {
        editLinks: false,
        smoothScroll: false,
        algolia: {
            apiKey: '20269a916e878ffcef4392d31af4f4d2',
            indexName: 'naninovel',
            algoliaOptions: {
                hitsPerPage: 6,
            }
        },
        locales: {
            '/': {
                selectText: 'Language',
                ariaLabel: 'Language',
                label: 'English',
                nav: [
                    {text: 'FAQ', link: '/faq/'},
                    {text: 'Guide', link: '/guide/'},
                    {text: 'Commands', link: '/api/'},
                    {text: 'Support', link: '/support/'}
                ],
                sidebar: {
                    '/guide/': getGuideSidebar('Guide', 'Advanced', 'Extensions')
                },
                lastUpdated: 'Last Updated'
            },
            '/ja/': {
                selectText: '言語',
                ariaLabel: '言語',
                label: '日本語',
                nav: [
                    {text: 'FAQ', link: '/ja/faq/'},
                    {text: 'ガイド', link: '/ja/guide/'},
                    {text: 'コマンド', link: '/ja/api/'},
                    {text: 'サポート', link: '/ja/support/'}
                ],
                sidebar: {
                    '/ja/guide/': getGuideSidebar('ガイド', 'アドバンスド', 'エクステンション')
                },
                lastUpdated: '最終更新 日'
            },
            '/zh/': {
                selectText: '语言',
                ariaLabel: '语言',
                label: '中文',
                nav: [
                    {text: '常见问题', link: '/zh/faq/'},
                    {text: '指南', link: '/zh/guide/'},
                    {text: '指令', link: '/zh/api/'},
                    {text: '技术支持', link: '/zh/support/'}
                ],
                sidebar: {
                    '/zh/guide/': getGuideSidebar('指南', '高级', '扩展')
                },
                lastUpdated: '最近更新时间'
            },
            '/ru/': {
                selectText: 'Язык',
                ariaLabel: 'Язык',
                label: 'Русский',
                nav: [
                    {text: 'FAQ', link: '/ru/faq/'},
                    {text: 'Руководство', link: '/ru/guide/'},
                    {text: 'Команды', link: '/ru/api/'},
                    {text: 'Поддержка', link: '/ru/support/'}
                ],
                sidebar: {
                    '/ru/guide/': getGuideSidebar('Руководство', 'Программирование', 'Расширения')
                },
                lastUpdated: 'Обновлено'
            }
        }
    },
    plugins: [
        ['@vuepress/google-analytics', {ga: 'UA-62903242-4'}],
        ['@vuepress/last-updated', {dateOptions: {year: 'numeric', month: 'long', day: 'numeric'}}],
        ['vuepress-plugin-container', {type: 'note', defaultTitle: {'/':'NOTICE', '/ja/':'通知', '/zh/':'注意', '/ru/':'ПРИМЕЧАНИЕ'}}],
        ['vuepress-plugin-container', {type: 'example', defaultTitle: {'/':'EXAMPLE', '/ja/':'例', '/zh/':'例', '/ru/':'ПРИМЕР'}}],
        ['vuepress-plugin-container', {type: 'warn', defaultTitle: {'/':'WARNING', '/ja/':'警告', '/zh/':'警告', '/ru/':'ВНИМАНИЕ'}}]
    ],
    markdown: {
        extendMarkdown: md => {
            md.use(require('markdown-it-regexp')(/\[@(\w+?)]/, function(match, utils) {
                let url = `/api/#${match[1].toLowerCase()}`;
                if (md.$data["links"] !== undefined) { // Prepend lang tag to the URL when under non-default locale.
                    let route = md.$data["links"][0];
                    if (route.startsWith("/ja/")) url = "/ja" + url;
                    else if (route.startsWith("/zh/")) url = "/zh" + url;
                    else if (route.startsWith("/ru/")) url = "/ru" + url;
                }
                return `<a href="${url}" class="" target="_blank"><code>@${match[1]}</code></a>`;
            }));
            md.use(require('markdown-it-regexp')(/\[!(\w+?)]/, function(match, utils) {
                return `<video class="video" loop autoplay muted><source src="https://i.gyazo.com/${match[1]}.mp4" type="video/mp4"></video>`; }));
            md.use(require('markdown-it-regexp')(/\[!!(.+?)]/, function(match, utils) {
                return `<div class="video-container"><iframe src="https://www.youtube-nocookie.com/embed/${match[1]}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`; }));
        }
    },
    locales: {
        '/': {
            lang: 'en-US',
            title: 'Naninovel',
            description: 'A full-featured, writer-friendly and completely customizable visual novel extension for Unity game engine.'
        },
        '/ja/': {
            lang: 'ja-JP',
            title: 'Naninovel',
            description: 'Unityゲームエンジン用のフル機能を備えた、ライター向けで完全にカスタマイズ可能なビジュアルノベル拡張。'
        },
        '/zh/': {
            lang: 'zh-CN',
            title: 'Naninovel',
            description: '功能齐全、易于编写且完全可自定义的Unity游戏引擎视觉小说插件。'
        },
        '/ru/': {
            lang: 'ru-RU',
            title: 'Naninovel',
            description: 'Расширение игрового движка Unity для создания визуальных новелл.'
        }
    }
};

function getGuideSidebar (groupA, groupB, groupC) {
    return [
        {
            title: groupA,
            collapsable: true,
            children: [
                '',
                'compatibility',
                'getting-started',
                'configuration',
                'naninovel-scripts',
                'ide-extension',
                'text-printers',
                'characters',
                'backgrounds',
                'transition-effects',
                'special-effects',
                'audio',
                'voicing',
                'movies',
                'choices',
                'user-interface',
                'save-load-system',
                'game-settings',
                'input-processing',
                'unlockable-items',
                'custom-variables',
                'script-expressions',
                'managed-text',
                'localization',
                'resource-providers',
                'community-modding',
                'development-console'
            ]
        },
        {
            title: groupB,
            collapsable: true,
            children: [
                'engine-architecture',
                'engine-services',
                'custom-commands',
                'custom-configuration',
                'custom-actor-implementations',
                'custom-actor-shader',
                `custom-parser`,
                'state-management',
                'integration-options',
                'render-pipelines',
                'custom-build-environment'
            ]
        },
        {
            title: groupC,
            collapsable: true,
            children: [
                'fountain',
                'playmaker',
                'visual-scripting',
                'adventure-creator',
                'inventory',
                'spreadsheet',
                'unitask'
            ]
        }
    ]
}
