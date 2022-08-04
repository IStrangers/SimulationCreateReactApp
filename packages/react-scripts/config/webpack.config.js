const paths = require("./paths")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = function(webpackEnv) {
 const isEnvDevelopment = webpackEnv === "development"
 const isEnvProduction = webpackEnv === "production"
 return {
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    entry: paths.appIndexJs,
    output: {
        path: paths.appBuild
    },
    module: {
        rules: [
            {
                test: /.\(js|jsx|ts|tsx)$/,
                include: paths.appSrc,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            proesets: ["@babel/preset-react"]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml
        })
    ]
 }
}