# Исследование инструментов

README, лицензии и соответствующие SKILL.md рассмотрены 22 ноября 2026. Публичные документы загружались только для чтения. Непроверенные install scripts не запускались. Даты ниже — GitHub pushed_at, а не дата релиза.

| Репозиторий | Последний push UTC | Лицензия | Решение |
|---|---|---|---|
| [Moddingflow/better-design](https://github.com/Moddingflow/better-design) | 2026-10-27 | MIT | Установлен проектно. Арт-дирекция, реальный browser review, layout/motion diagnostics. |
| [0xlukem/design-pro](https://github.com/0xlukem/design-pro) | 2026-10-20 | MIT | Рассмотрен как дополнительный checklist; существующий референс не заменялся новым стилем. |
| [educlopez/ui-craft](https://github.com/educlopez/ui-craft) | 2026-11-20 | MIT | Рассмотрены типографика, адаптация и audit/critique подход; без установки дублирующего набора. |
| [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | 2026-07-29 | MIT | Использованы профильные официальные Skills из пользовательского каталога. |
| [greensock/GSAP](https://github.com/greensock/GSAP) | 2026-11-04 | GSAP Standard no-charge (README/package) | Установлен 3.15.0: timeline, ScrollTrigger, MorphSVG, @gsap/react. Standard no-charge license из README/package. |
| [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) | 2026-11-19 | MIT | Не установлен: нативный scroll достаточен, отдельный RAF не нужен. |
| [codrops/TextCharacterAnimations](https://github.com/codrops/TextCharacterAnimations) | 2026-11-03 | MIT | Референс последовательного раскрытия букв; демонстрация и её assets не копировались. |
| [codrops/OnScrollSVGFilterText](https://github.com/codrops/OnScrollSVGFilterText) | 2024-08-22 | MIT | Рассмотрен; фильтры текста не применены для сохранения читаемости. |
| [codrops/ImageExpansionTypography](https://github.com/codrops/ImageExpansionTypography) | 2024-04-02 | MIT | Рассмотрен принцип перехода типографики и изображения; тяжёлое расширение не понадобилось. |
| [theatre-js/theatre](https://github.com/theatre-js/theatre) | 2024-08-14 | Apache-2.0 | Не установлен: существующая GSAP timeline покрывает короткую сцену. |
| [14islands/r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig) | 2025-12-17 | MIT | Не установлен: DOM/SVG достаточны, 3D не требуется. |
| [ItsAnhReal/ui-audit](https://github.com/ItsAnhReal/ui-audit) | 2026-10-19 | MIT | Рассмотрен; эквивалентные проверки реализованы проектным Playwright без второй CLI-зависимости. |
| [LyraZeta/layoutscope](https://github.com/LyraZeta/layoutscope) | 2026-08-14 | MIT | Рассмотрен; не установлен, чтобы не дублировать Playwright/axe и geometry scan. |
| [microsoft/playwright](https://github.com/microsoft/playwright) | 2026-11-21 | Apache-2.0 | Установлен @playwright/test; проверка с установленным Chrome. |

Дополнительно: [GSAP MorphSVG](https://gsap.com/docs/v3/Plugins/MorphSVGPlugin/), [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing), [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Эти источники использованы для технической проверки. 21st CLI отсутствует в локальном окружении; платные AI-вызовы, API-ключи и публикация через 21st не использовались.
