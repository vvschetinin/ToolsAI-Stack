// postcss.config.js

import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
// Возвращаемся к вашему первоначальному импорту, так как он более корректен для ESM.
// Иногда пакет экспортирует себя как объект { default: [функция] }
import purgecss from '@fullhuman/postcss-purgecss';

// Небольшая проверка, чтобы убедиться, что мы используем именно функцию.
// Это защищает от различий в экспорте между версиями пакета.
const purgeCSSPlugin = purgecss.default || purgecss;

export default (ctx) => ({
  plugins: [
    autoprefixer(),
    ctx.env === 'production' ? cssnano({ preset: 'default' }) : false,
    ctx.env === 'production'
      ? // Теперь вызываем purgeCSSPlugin, который точно является функцией
        purgeCSSPlugin({
          content: [
            './**/*.html',
            './src/**/*.{vue,js,ts,jsx,tsx}',
          ],
          safelist: {
            standard: [/-(leave|enter|appear)(|-(to|from|active))$/],
            deep: [/-(leave|enter|appear)(|-(to|from|active))$/],
          },
          defaultExtractor: content => content.match(/[\w-/:%]+(?<!:)/g) || [],
        })
      : false,
  ],
});
