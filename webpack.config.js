module.exports = {
  entry: "./src/app.js",
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules:false,
            },
          },
          'less-loader',
        ],
      }
    ]
  },
  mode: 'development',
};
