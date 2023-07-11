import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const config = {
  entry: './client/src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|ico)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/images',
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          allowTsInNodeModules: true,
          transpileOnly: true
        }
      },
      {
        test: /\.(mp3)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '[path][name].[ext]',
            fallback: 'file-loader',
          },
        },
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'co-lab',
      templateContent: ({ htmlWebpackPlugin }) => `
      <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${htmlWebpackPlugin.options.title}</title>
          <link rel='icon' type='image/x-icon' href='assets/images/favicon.ico'>
          <style>
            * {
              scrollbar-width: thin;
              scrollbar-color: #F5C968 transparent;
            }

            *::-webkit-scrollbar {
              width: 3px;
            }

            *::-webkit-scrollbar-track {
              background: transparent;
            }

            *::-webkit-scrollbar-thumb {
              background-color: #F5C968;
              border-radius: 12px;
              border: 3px solid transparent;
            }
          </style>
        </head>
        <body>
          <div id="app"></div>
        </body>
        </html>`,
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ],
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js',
      '.jsx'
    ]
  }
};

export default config;
