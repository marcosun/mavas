const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  // click on the name of the option to get to the detailed documentation
  // click on the items with arrows to show more examples / advanced options

  entry: "./app/index.js", // string | object | array
  // Here the application starts executing
  // and webpack starts bundling

  output: {
    // options related to how webpack emits results

    path: path.resolve(__dirname, "public"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)

    filename: "bundle.js", // string
    // the filename template for entry chunks

    publicPath: "/", // string
    // the url to the output directory resolved relative to the HTML page

    /* Advanced output configuration (click to show) */
  },

  module: {
    // configuration regarding modules

    rules: [
      // rules for modules (configure loaders, parser options, etc.)

      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "node_modules/")
        ],
        
        /*
        // these are matching conditions, each accepting a regular expression or string
        // test and include have the same behavior, both must be matched
        // exclude must not be matched (takes preferrence over test and include)
        // Best practices:
        // - Use RegExp only in test and for filename matching
        // - Use arrays of absolute paths in include and exclude
        // - Try to avoid exclude and prefer include

        issuer: { test, include, exclude },
        // conditions for the issuer (the origin of the import)

        enforce: "pre",
        enforce: "post",
        // flags to apply these rules, even if they are overridden (advanced option)
        */
        
        loader: "babel-loader",
        
        
        // the loader which should be applied, it'll be resolved relative to the context
        // -loader suffix is no longer optional in webpack2 for clarity reasons
        // see webpack 1 upgrade guide

        options: {
          presets: ["es2015", "react", "stage-0"]
        },
        // options for the loader
        
        
      },
      
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                camelCase: true,
                modules: true,
                importLoaders: 1,
                sourceMap: true,
                localIdentName: "[name]__[local]__[hash:base64:5]",
              },
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: "inline",
                plugins: function() {
                  return [
                    require("autoprefixer")
                  ];
                },
              },
            },
          ],
        }),
      },
      
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
        },
      }
    ],

    /* Advanced module configuration (click to show) */
  },

  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)

    modules: [
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    // directories where to look for modules

    extensions: [".js", ".json", ".jsx", ".css"],
    // extensions that are used

    alias: {
      // a list of module name aliases

      "module": "new-module",
      // alias "module" -> "new-module" and "module/path/file" -> "new-module/path/file"

      "only-module$": "new-module",
      // alias "only-module" -> "new-module", but not "module/path/file" -> "new-module/path/file"

      "module": path.resolve(__dirname, "app/third/module.js"),
      // alias "module" -> "./app/third/module.js" and "module/file" results in error
      // modules aliases are imported relative to the current context
    },
    /* alternative alias syntax (click to show) */

    /* Advanced resolve configuration (click to show) */
  },

  performance: {
    hints: "warning", // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter: function(assetFilename) { 
      // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },

  devtool: "source-map", // enum
  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed.

  context: __dirname, // string (absolute path!)
  // the home directory for webpack
  // the entry and module.rules.loader option
  //   is resolved relative to this directory

  plugins: [
    new ExtractTextPlugin("styles.css"),
  ],
  
  devServer: {
    disableHostCheck: true
  },

  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
      __API_ROOT__: (() => {
        //config root path of api
        switch(process.env.NODE_ENV) {
          case 'dev':
            return JSON.stringify('http://10.85.1.171:8080');
            break;
          case 'aliyun':
            return JSON.stringify('http://101.37.105.67:54000');
            break;
          case 'prod':
            return JSON.stringify('http://10.88.0.230:8082/test/admin');
            break;
          default:
            return JSON.stringify('http://10.88.0.230:8082/test/admin');
            break;
        }
      })(),
    }),
  ],
}