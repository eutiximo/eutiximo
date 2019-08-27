const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// Funcion para crear los archivos HTML de manera automatica usando ".pug"
function MultifilesHTMLWebpackPlugin(templateDir) {
    const templateFile = fs.readdirSync(path.resolve(__dirname, templateDir));
    const filterFiles = templateFile.filter(file => { return /\.(pug|html)$/.test(file); });
    
    return filterFiles.map(file => {
        const parts = file.split('.');
        const name = parts[0];
        const extension = parts[1];

        return new HTMLWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            }
        });
    });
}

// Objeto para iniciar la configuracion de Webpack.
var WebpackConfig = {};

    // -> Configurar entrada y salida.
WebpackConfig.entry = './project.dev/index.js';
WebpackConfig.output = {
    path: path.resolve(__dirname, '../project.dist'),
    filename: 'scripts/main.js'
};

    // -> Configurar servidor
WebpackConfig.devServer = {
    port: 4000,
    open: true
};

    // -> Configurar optimizacion y minificacion de archivos
WebpackConfig.optimization = {
    minimizer: [
        new OptimizeCssAssetsPlugin()
    ]
};

    // -> Configurar modulos (loaders)
WebpackConfig.module = {
    rules: [
        {
            test: /\.pug$/,
            loader: 'pug-loader',
            options: {
                pretty: true
            }
        },
        {
            test: /\.(css|scss)$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        autoprefixer: {
                            browser: ['last 2 versions']
                        },
                        plugins: () => [autoprefixer]
                    }
                },
                'sass-loader'
            ]
        },
        {
            test: /\.(jpg|png|gif|svg|jpeg)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'media/',
                        useRelativePath: true
                    }
                },
                {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true, quality: 65
                        },
                        optipng: {
                            enabled: false
                        },
                        pngquant: {
                            quality: '65-90', speed: 4
                        },
                        gifsicle: {
                            interlanced: false
                        },
                        webp: {
                            quality: 75
                        }
                    }
                }
            ]
        }
    ]
};

    // -> Configuracion de plugins
WebpackConfig.plugins = [
    new MiniCssExtractPlugin({
        filename: "styles/[name].css"
    })
].concat(MultifilesHTMLWebpackPlugin('../project.dev'));

    // -> Exportar Modulo con la configuracion de Webpapck.
module.exports = WebpackConfig;