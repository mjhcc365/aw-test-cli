import path from "node:path";
import fs from "node:fs";
import minimist from "minimist";
import { fileURLToPath } from "node:url";

// 不需要选
// pnpm create aw-test-cli my-app
const defaultTargetDir = "aw-test-template";

const cwd = process.cwd();

const argv = minimist(process.argv.slice(2), { string: ["_"] });

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

async function init() {
  // 参数的目录
  const argTargetDir = formatTargetDir(argv._[0]);

  let targetDir = argTargetDir || defaultTargetDir;
  // 参数项目名
  const getProjectName = () =>
    targetDir === "." ? path.basename(path.resolve()) : targetDir;

  // 最终目录
  //   console.log("==>getProjectName", getProjectName());

  // 当前这个模块的路径 => file:// 转换为c:\path
  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../..",
    `${targetDir}`
  );
  console.log("==>templateDir", templateDir);

  const root = path.join(cwd, targetDir);

  console.log("==>root", root);

  const renameFiles: Record<string, string | undefined> = {
    _gitignore: ".gitignore",
  };

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = fs.readdirSync(templateDir);
  for (const file of files.filter((f) => f !== "package.json")) {
    write(file);
  }
  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), "utf-8")
  );
  pkg.name = getProjectName();

  write("package.json", JSON.stringify(pkg, null, 2));
  console.log(`\nDone.\n`);
}

init().catch((error) => {
  console.log(error);
});
