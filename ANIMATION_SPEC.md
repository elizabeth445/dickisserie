# Motion specification

| Сцена | Триггер | Реализация и ограничение |
| --- | --- | --- |
| Заголовки Hero | Mount, около 1.1с | Scoped GSAP: буквы yPercent со stagger 18ms, раскрытие слогана и CTA. Reduce: сразу видимы |
| Вафли и лепестки | Открытие Hero, 7.9с | Новый переданный H.264-ролик 3840×2160, один проход, muted/playsInline. Последние 2с удалены. Desktop 4K, меньшие экраны Full HD, медленная сеть 720p |
| Финал вступления | Video ended, 350ms | Видео уступает место детальной статичной фотографии. Кнопка Replay. Нет автоматического повторения |
| Пауза | Пользователь, уход Hero за viewport, скрытая вкладка | Native video pause/play, IntersectionObserver и visibilitychange с cleanup. Ручная пауза не отменяется при возвращении |
| Выход Hero | Desktop от 1101px, scroll без pin | ScrollTrigger scrub .6: общий контейнер фото и видео y24, scale1.015. Неподвижная маска соединяет сцену с общим бархатом |
| Смена продукта | Выбор продукта, 300–360ms | Scoped GSAP, revertOnUpdate. Reduce: мгновенно |
| Интерьер | Проход секции | Фото внутри контейнера с запасом высоты, yPercent −5…5, scrub .8. Без движения на mobile/reduce |
| Панели и кнопки | Открытие и нажатия | Native dialog, CSS, keyboard focus containment, Escape и focus return |

При reduced-motion и Save-Data видео не запрашивается. Reduced-motion учитывается в реальном времени. Autoplay failure и media error оставляют рабочую статичную композицию. GSAP и video не конкурируют за один transform: native video декодирует кадры, GSAP двигает общий контейнер. Нет дополнительных RAF-циклов, WebGL, SVG-жидкостей, фоновой музыки, scroll hijacking и бесконечных loops.

Исходники, файлы, поведение и замеры: [HERO_VIDEO.md](docs/HERO_VIDEO.md).
