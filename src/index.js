const hx = require("hbuilderx");
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const { minimatch } = require('minimatch');

async function init(e) {
	const filePath = e.fsPath;
	const zip = new AdmZip();
	let ignoreList;
	try {
		ignoreList = readIgnoreFile(filePath);
		console.log(ignoreList);
	} catch (err) {
		console.log('没有该文件：.hbxignore');
		// hx.window.showInformationMessage('没有.hbxignore是否进行创建', ['确定']);
		ignoreList = ['.git/', '.gitignore', '.hbxignore', 'node_modules/', '*.zip'];
	}
	zip.addLocalFolder(filePath);
	// 获取所有条目
	const zipEntries = zip.getEntries();

	// 遍历条目并删除不需要的文件
	zipEntries.forEach(entry => {
		const entryName = entry.entryName;
		if (startsWithAny(entryName, ignoreList)) {
			zip.deleteFile(entry); // 删除匹配的条目
		}
	});

	let { data } = await hx.util.readJSONValue(path.join(filePath, 'package.json'), 'id');

	zip.writeZip(path.join(filePath, data + '.zip'));
	hx.window.showInformationMessage('打包成功');
}

/**
 * 读取忽略规则
 * @param {string} filePath 文件路径
 */
function readIgnoreFile(filePath) {
	return fs.readFileSync(path.join(filePath, '.hbxignore'), 'utf-8')
		// 按行拆分文件内容
		.split(/\r?\n/)
		// 过滤掉空行和注释行
		.filter(line => line.trim() !== '' && !line.startsWith('#'));
}

/**
 * 检查一个字符串是否以数组中的任意一个元素开始。
 * @param {string} str - 要检查的字符串。
 * @param {string[]} prefixes - 包含可能前缀的数组。
 * @returns {boolean} 如果字符串以数组中的任意一个元素开始，则返回true，否则返回false。
 */
function startsWithAny(str, prefixes) {
	return prefixes.some(prefix => minimatch(str, prefix, { matchBase: true }));
}

module.exports = {
	init
}