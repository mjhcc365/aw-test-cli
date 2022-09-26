#! /usr/bin/env node
// #! 符号的名称叫 Shebang，用于指定脚本的解释程序

import chalk from "chalk";
import { program } from "commander";
import download from "download-git-repo";

//version 版本号
//name 新项目名称
program
  .version("1.0.0", "-v, --version")
  .command("init <templateName> <projectName>")
  .action((templateName, projectName) => {
    if (templateName === "vue") {
      console.log("clone template ...");
      download(
        "github:junkaicool/jkc-cli-vue-src",
        projectName,
        function (err) {
          console.log(err ? "Error" : "Success");
        }
      );
    } else if (templateName === "react") {
      console.log("clone template ...");
      download(
        "github:junkaicool/jkc-cli-react-src",
        projectName,
        function (err) {
          console.log(err ? "Error" : "Success");
        }
      );
    } else {
      //   console.error("A template name that does not exist");
      console.log(chalk.blue("A template name that does not exist"));
    }
  });
program.parse(process.argv);
