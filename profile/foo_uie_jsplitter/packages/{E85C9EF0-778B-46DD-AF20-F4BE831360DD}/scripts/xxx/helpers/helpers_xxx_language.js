'use strict';
//03/12/25

/* exported Language */

// Helpers for language handling
const Language = Object.freeze({
	// Data validation
	data: Object.seal({ lastOutput: null, lastInput: null }),
	helpers: Object.freeze({
		greek: Object.freeze({
			table: Object.freeze({ 'Α': 'A', 'Χ': 'C', 'Δ': 'D', 'Ε': 'E', 'Φ': 'F', 'Γ': 'G', 'Η': 'h', 'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ο': 'O', 'Ω': 'o', 'Π': 'P', 'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'U', 'Ξ': 'X', 'Ζ': 'Z', 'α': 'a', 'β': 'b', 'χ': 'c', 'δ': 'd', 'ε': 'e', 'φ': 'f', 'γ': 'g', 'η': 'h', 'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ο': 'o', 'ω': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's', 'τ': 't', 'θ': 't', 'υ': 'u', 'ξ': 'x', 'ζ': 'z' })
		}),
		russian: Object.freeze({
			table: Object.freeze({ 'Ё': 'YO', 'Й': 'I', 'Ц': 'TS', 'У': 'U', 'К': 'K', 'Е': 'E', 'Н': 'N', 'Г': 'G', 'Ш': 'SH', 'Щ': 'SCH', 'З': 'Z', 'Х': 'H', 'Ъ': '\'', 'ё': 'yo', 'й': 'i', 'ц': 'ts', 'у': 'u', 'к': 'k', 'е': 'e', 'н': 'n', 'г': 'g', 'ш': 'sh', 'щ': 'sch', 'з': 'z', 'х': 'h', 'ъ': '\'', 'Ф': 'F', 'Ы': 'I', 'В': 'V', 'А': 'A', 'П': 'P', 'Р': 'R', 'О': 'O', 'Л': 'L', 'Д': 'D', 'Ж': 'ZH', 'Э': 'E', 'ф': 'f', 'ы': 'i', 'в': 'v', 'а': 'a', 'п': 'p', 'р': 'r', 'о': 'o', 'л': 'l', 'д': 'd', 'ж': 'zh', 'э': 'e', 'Я': 'Ya', 'Ч': 'CH', 'С': 'S', 'М': 'M', 'И': 'I', 'Т': 'T', 'Ь': '\'', 'Б': 'B', 'Ю': 'YU', 'я': 'ya', 'ч': 'ch', 'с': 's', 'м': 'm', 'и': 'i', 'т': 't', 'ь': '\'', 'б': 'b', 'ю': 'yu' })
		}),
		japanese: Object.freeze({
			table: Object.freeze({ 'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o', 'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko', 'さ': 'sa', 'し': 'si', 'す': 'su', 'せ': 'se', 'そ': 'so', 'た': 'ta', 'ち': 'ti', 'つ': 'tu', 'て': 'te', 'と': 'to', 'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no', 'は': 'ha', 'ひ': 'hi', 'ふ': 'hu', 'へ': 'he', 'ほ': 'ho', 'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo', 'や': 'ya', 'ゆ': 'yu', 'よ': 'yo', 'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro', 'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'n', 'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go', 'ざ': 'za', 'じ': 'zi', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo', 'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do', 'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo', 'ゔ': 'vu', 'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po', 'きゃ': 'kya', 'きゅ': 'kyu', 'きぇ': 'kye', 'きょ': 'kyo', 'しゃ': 'sya', 'しゅ': 'syu', 'しぇ': 'sye', 'しょ': 'syo', 'ちゃ': 'tya', 'ちゅ': 'tyu', 'ちぇ': 'tye', 'ちょ': 'tyo', 'にゃ': 'nya', 'にゅ': 'nyu', 'にぇ': 'nye', 'にょ': 'nyo', 'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひぇ': 'hye', 'ひょ': 'hyo', 'みゃ': 'mya', 'みゅ': 'my', 'みぇ': 'mye', 'みょ': 'myo', 'りゃ': 'rya', 'りゅ': 'ryu', 'りぇ': 'rye', 'りょ': 'ryo', 'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎぇ': 'gye', 'ぎょ': 'gyo', 'じゃ': 'zya', 'じゅ': 'zyu', 'じぇ': 'zye', 'じょ': 'zyo', 'ぢゃ': 'dya', 'ぢゅ': 'dyu', 'ぢぇ': 'dye', 'ぢょ': 'dyo', 'びゃ': 'bya', 'びゅ': 'byu', 'びぇ': 'bye', 'びょ': 'byo', 'ゔぁ': 'va', 'ゔぃ': 'vi', 'ゔぇ': 've', 'ゔぉ': 'vo', 'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴぇ': 'pye', 'ぴょ': 'pyo', 'いぃ': 'yi', 'いぇ': 'ye', 'うぁ': 'wa', 'うぃ': 'wi', 'うぅ': 'wu', 'うぇ': 'we', 'うぉ': 'wo', 'うゅ': 'wyu', 'ゔゃ': 'vya', 'ゔゅ': 'vyu', 'ゔょ': 'vyo', 'くぁ': 'kwa', 'くぃ': 'kwi', 'くぅ': 'kwu', 'くぇ': 'kwe', 'くぉ': 'kwo', 'くゎ': 'kwa', 'ぐぁ': 'gwa', 'ぐぃ': 'gwi', 'ぐぅ': 'gwu', 'ぐぇ': 'gwe', 'ぐぉ': 'gwo', 'ぐゎ': 'gwa', 'すぃ': 'si', 'ずぃ': 'zi', 'つぁ': 'tua', 'つぃ': 'tui', 'つぇ': 'tue', 'つぉ': 'tuo', 'つゅ': 'tuyu', 'づぁ': 'dua', 'づぃ': 'dui', 'づぇ': 'due', 'づぉ': 'duo', 'てゃ': 'tea', 'てぃ': 'tei', 'てゅ': 'teu', 'てぇ': 'tee', 'てょ': 'teo', 'とぅ': 'tou', 'でゃ': 'dea', 'でぃ': 'dei', 'でゅ': 'deu', 'でぇ': 'dee', 'でょ': 'deo', 'どぅ': 'dou', 'ふぁ': 'hua', 'ふぃ': 'hui', 'ふぇ': 'hue', 'ふぉ': 'huo', 'ふゃ': 'huya', 'ふゅ': 'huyu', 'ふょ': 'huyo', 'ほぅ': 'hu', 'ら゚': 'la', 'り゚': 'li', 'る゚': 'lu', 'れ゚': 'le', 'ろ゚': 'lo', 'わ゙': 'va', 'ゐ゙': 'vi', 'ゑ゙': 've', 'を゙': 'vo', 'ぁ': 'a', 'ぃ': 'i', 'ぅ': 'u', 'ぇ': 'e', 'ぉ': 'o', 'ゃ': 'ya', 'ゅ': 'yu', 'ょ': 'yo', 'っ': 'tu', 'ゎ': 'wa', 'ヵ': 'ka', 'ヶ': 'ke' }),
			punctuation: Object.freeze({ '。': '.', '、': ',', '・': '-', '－': '-', '「': '“', '」': '”', '（': '(', '）': ')', '　': ' ', ' ': ' ' }),
			specialHiraganization: Object.freeze({ 'ヿ': 'こと', '𪜈': 'とも', '𪜈゙': 'ども', 'ヷ': 'わ゙', 'ヸ': 'ゐ゙', 'ヹ': 'ゑ゙', 'ヺ': 'を゙', '𛀀': 'え', 'ㇰ': 'く', 'ㇱ': 'し', 'ㇲ': 'す', 'ㇳ': 'と', 'ㇴ': 'ぬ', 'ㇵ': 'は', 'ㇶ': 'ひ', 'ㇷ': 'ふ', 'ㇸ': 'へ', 'ㇹ': 'ほ', 'ㇺ': 'む', 'ㇻ': 'ら', 'ㇼ': 'り', 'ㇽ': 'る', 'ㇾ': 'れ', 'ㇿ': 'ろ' }),
			katakanaRe: new RegExp('(' + '[' + '\\u30a1-\\u30f4' + // ァ～ヴ
				'\\u30f7-\\u30fa' + // ヷ～ヺ
				'\\u30fd-\\u30ff' + // ヽ～ヿ
				'\\u31f0-\\u31ff' + // ㇰ～ㇿ
				']' + '|' + '\\ud869\\udf08\\u3099' + // 𪜈゙
				'|' + '\\ud869\\udf08' + // 𪜈
				'|' + '\\ud82c\\udc00' + // 𛀀
				')', 'g'),
			romanizationConfigs: Object.freeze({
				default: Object.freeze({ 'し': 'shi', 'ち': 'chi', 'つ': 'tsu', 'ふ': 'fu', 'じ': 'ji', 'ぢ': 'ji', 'づ': 'zu', 'ああ': 'aa', 'いい': 'ii', 'うう': 'ū', 'ええ': 'ee', 'おお': 'ō', 'あー': 'ā', 'えい': 'ei', 'おう': 'ō', 'んあ': 'n\'a', 'んば': 'nba', 'っち': 'tchi', 'ゐ': 'i', 'を': 'o', punctuation: true }),
				'traditional hepburn': Object.freeze({ 'を': 'wo', 'んあ': 'n-a', 'んば': 'mba' }),
				'modified hepburn': Object.freeze({ 'ああ': 'ā', 'いい': 'ii', 'うう': 'ū', 'ええ': 'ē', 'おお': 'ō' }),
				kunrei: Object.freeze({ 'し': 'si', 'ち': 'ti', 'つ': 'tu', 'ふ': 'hu', 'じ': 'zi', 'ぢ': 'zi', 'づ': 'zu', 'ああ': 'â', 'いい': 'î', 'うう': 'û', 'ええ': 'ê', 'おお': 'ô', 'あー': 'â', 'おう': 'ô', 'っち': 'tti' }),
				nihon: Object.freeze({ 'し': 'si', 'ち': 'ti', 'つ': 'tu', 'ふ': 'hu', 'じ': 'zi', 'ぢ': 'di', 'づ': 'du', 'ああ': 'ā', 'いい': 'ī', 'うう': 'ū', 'ええ': 'ē', 'おお': 'ō', 'あー': 'ā', 'おう': 'ō', 'っち': 'tti', 'ゐ': 'wi', 'を': 'wo' }),
			}),
			hiraganize: function (string) {
				return string.replace(this.katakanaRe, function (katakana) {
					if (katakana.match(/^[\u30a1-\u30f4\u30fd\u30fe]$/)) {
						return String.fromCharCode(katakana.charCodeAt(0) - 'ァ'.charCodeAt(0) + 'ぁ'.charCodeAt(0));
					} else if (this.specialHiraganization[katakana]) {
						return this.specialHiraganization[katakana];
					}
				});
			},
			applyConfigs: function (table, config) {
				const merge = (target, source) => { for (let key in source) { target[key] = source[key]; } };
				if (config['し'] === 'shi') {
					merge(table, { 'し': 'shi', 'しゃ': 'sha', 'しゅ': 'shu', 'しぇ': 'she', 'しょ': 'sho' });
				}
				if (config['ち'] === 'chi') {
					merge(table, {
						'ち': 'chi', 'ちゃ': 'cha', 'ちゅ': 'chu', 'ちぇ': 'che', 'ちょ': 'cho', 'てぃ': 'ti', 'てゅ': 'tyu',
					});
				}
				if (config['つ'] === 'tsu') {
					merge(table, {
						'つ': 'tsu', 'つぁ': 'tsa', 'つぃ': 'tsi', 'つぇ': 'tse', 'つぉ': 'tso', 'つゅ': 'tsyu', 'とぅ': 'tu',
					});
				}
				if (config['ふ'] === 'fu') {
					merge(table, {
						'ふ': 'fu', 'ふぁ': 'fa', 'ふぃ': 'fi', 'ふぇ': 'fe', 'ふぉ': 'fo', 'ふゃ': 'fya', 'ふゅ': 'fyu', 'ふょ': 'fyo',
					});
				}
				if (config['じ'] === 'ji') {
					merge(table, {
						'じ': 'ji', 'じゃ': 'ja', 'じゅ': 'ju', 'じぇ': 'je', 'じょ': 'jo',
					});
				}
				if (config['ぢ'] === 'ji') {
					merge(table, {
						'ぢ': 'ji', 'ぢゃ': 'ja', 'ぢゅ': 'ju', 'ぢぇ': 'je', 'ぢょ': 'jo', 'でぃ': 'di', 'でゅ': 'dyu',
					});
				}
				if (config['ぢ'] === 'zi') {
					merge(table, {
						'ぢ': 'zi', 'ぢゃ': 'zya', 'ぢゅ': 'zyu', 'ぢぇ': 'zye', 'ぢょ': 'zyo', 'でぃ': 'di', 'でゅ': 'dyu',
					});
				}
				if (config['ぢ'] === 'dji') {
					merge(table, {
						'ぢ': 'dji', 'ぢゃ': 'dja', 'ぢゅ': 'dju', 'ぢぇ': 'dje', 'ぢょ': 'djo', 'でぃ': 'di', 'でゅ': 'dyu',
					});
				}
				if (config['ぢ'] === 'dzi') {
					merge(table, {
						'ぢ': 'dzi', 'ぢゃ': 'dzya', 'ぢゅ': 'dzyu', 'ぢぇ': 'dzye', 'ぢょ': 'dzyo', 'でぃ': 'di', 'でゅ': 'dyu',
					});
				}
				if (config['づ'] === 'zu') {
					merge(table, {
						'づ': 'zu', 'づぁ': 'zua', 'づぃ': 'zui', 'づぇ': 'zue', 'づぉ': 'zuo', 'どぅ': 'du',
					});
				}
				if (config['づ'] === 'dsu') {
					merge(table, {
						'づ': 'dsu', 'づぁ': 'dsua', 'づぃ': 'dsui', 'づぇ': 'dsue', 'づぉ': 'dsuo', 'どぅ': 'du',
					});
				}
				if (config['づ'] === 'dzu') {
					merge(table, {
						'づ': 'dzu', 'づぁ': 'dzua', 'づぃ': 'dzui', 'づぇ': 'dzue', 'づぉ': 'dzuo', 'どぅ': 'du',
					});
				}
				if (config['ゐ'] === 'i') {
					merge(table, {
						'ゐ': 'i', 'ゑ': 'e',
					});
				}
				if (config['を'] === 'o') {
					merge(table, {
						'を': 'o',
					});
				}
				return table;
			}
		}),
	}),
	/**
	 * Checks if last input is equal to the last output value
	 *
	 * @method
	 * @name (get) isLastEqual
	 * @kind property
	 * @memberof Input
	 * @returns {boolean}
	*/
	get isLastEqual() {
		return this.data.lastOutput === this.data.lastInput;
	},
	/**
	 * Retrieves last output value
	 *
	 * @method
	 * @name (get) lastOutput
	 * @kind property
	 * @memberof Language
	 * @returns {string}
	*/
	get lastOutput() {
		return this.data.lastOutput;
	},
	/**
	 * Retrieves last input value
	 *
	 * @method
	 * @name (get) lastInput
	 * @kind property
	 * @memberof Language
	 * @returns {any}
	*/
	get lastInput() {
		return this.data.lastInput;
	},
	// Output methods
	/**
	 * Transliterates a string from Japanese, Greek and Cyrilic into latin
	 *
	 * @property
	 * @name transliterate
	 * @kind method
	 * @memberof Language
	 * @param {string} value
	 * @returns {string}
	 */
	transliterate(string) {
		if (this.data.lastInput === string) { return this.lastOutput; }
		this.data.lastInput = string;
		return this.data.lastOutput = this.romanize(string.replace(/./gui, a => this.helpers.greek.table[a] || this.helpers.russian.table[a] || a), void (0), false);
	},
	/**
	 * Transliterates a string from Japanese into latin
	 *
	 * @property
	 * @name romanize
	 * @kind method
	 * @memberof Language
	 * @param {string} string
	 * @param {object|'traditional hepburn'|'modified hepburn'|'kunrei'|'nihon'} config - Mapping of characters.
	 * @returns {string}
	 */
	romanize(string, config, bSaveInput = true) {
		if (bSaveInput) {
			if (this.data.lastInput === string) { return this.lastOutput; }
			this.data.lastInput = string;
		}
		config = typeof config === 'string'
			? { ...this.helpers.japanese.romanizationConfigs.default, ...(this.helpers.japanese.romanizationConfigs[config] || {}) }
			: !config
				? { ...this.helpers.japanese.romanizationConfigs.default }
				: config;
		if (typeof config === 'undefined' || typeof config !== 'object') { throw new ReferenceError('Romanization method "' + config + '" is undefined or non valid'); }

		const table = this.helpers.japanese.applyConfigs({ ...this.helpers.japanese.table }, config);

		string = this.helpers.japanese.hiraganize(string);

		let dest = '';
		let previousToken = '';
		let prevJapanese = false;

		while (string.length > 0) {
			let token = '';

			// assuming we have only one or two letter token in table
			if (table[string.slice(0, 2)]) {
				token = string.slice(0, 2);
				string = string.slice(2);
			} else {
				token = string[0];
				string = string.slice(1);
			}

			// handle small tsu
			if (token === 'っ') {
				previousToken = token;
				prevJapanese = true;
				continue;
			}

			let tokenDest = table[token] || '';
			let tokenDestFallBack = !tokenDest.length ? token : null;

			// small tsu
			if (previousToken === 'っ') {
				if (tokenDest.match(/^[^aiueo]/)) {
					if (token[0] === 'ち') {
						if (config['っち'] === 'tchi') {
							tokenDest = {
								'ち': 'tchi',
								'ちゃ': 'tcha',
								'ちゅ': 'tchu',
								'ちぇ': 'tche',
								'ちょ': 'tcho',
							}[token];
						} else if (config['っち'] === 'cchi') {
							tokenDest = {
								'ち': 'cchi',
								'ちゃ': 'ccha',
								'ちゅ': 'cchu',
								'ちぇ': 'cche',
								'ちょ': 'ccho',
							}[token];
						} else { // normally 'tti'
							tokenDest = {
								'ち': 'tti',
								'ちゃ': 'ttya',
								'ちゅ': 'ttyu',
								'ちぇ': 'ttye',
								'ちょ': 'ttyo',
							}[token];
						}
					} else {
						tokenDest = tokenDest[0] + tokenDest;
					}
				} else {
					/*
					 * Some article claims that "ローマ字教育の指針(文部科学省)" defines that
					 * strings ending with "っ" must be represented with trailing apostrophe
					 * though I couldn't confirm.
					 */
					dest += '\'';
				}
			}

			// long vowel
			if (token === 'ー') {
				if (dest.match(/[aiueo]$/)) {
					if (config['あー'] === 'a') {
						// nope
					} else if (config['あー'] === 'ah') {
						dest += 'h';
					} else if (config['あー'] === 'a-') {
						dest += '-';
					} else if (config['あー'] === 'aa') {
						dest = dest.slice(0, -1) + {
							'a': 'aa',
							'i': 'ii',
							'u': 'uu',
							'e': 'ee',
							'o': 'oo',
						}[dest.slice(-1)];
					} else if (config['あー'] === 'â') {
						dest = dest.slice(0, -1) + {
							'a': 'â',
							'i': 'î',
							'u': 'û',
							'e': 'ê',
							'o': 'ô',
						}[dest.slice(-1)];
					} else if (config['あー'] === 'ā') {
						dest = dest.slice(0, -1) + {
							'a': 'ā',
							'i': 'ī',
							'u': 'ū',
							'e': 'ē',
							'o': 'ō',
						}[dest.slice(-1)];
					}

					tokenDest = '';
				} else {
					tokenDest = '-';
				}
			} else if (prevJapanese && dest.slice(-1) === 'e' && tokenDest[0] === 'i') {
				tokenDest = tokenDest.slice(1);

				if (config['えい'] === 'ei') {
					dest += 'i';
				} else if (config['えい'] === 'ee') {
					dest += 'e';
				} else if (config['えい'] === 'eh') {
					dest += 'h';
				} else if (config['えい'] === 'ê') {
					dest = dest.slice(0, -1) + 'ê';
				} else if (config['えい'] === 'ē') {
					dest = dest.slice(0, -1) + 'ē';
				} else if (config['えい'] === 'e') {
					// nope
				}
			} else if (prevJapanese && dest.slice(-1) === 'o' && tokenDest[0] === 'u') {
				tokenDest = tokenDest.slice(1);

				if (config['おう'] === 'ou') {
					dest += 'u';
				} else if (config['おう'] === 'oo') {
					dest += 'o';
				} else if (config['おう'] === 'oh') {
					dest += 'h';
				} else if (config['おう'] === 'ô') {
					dest = dest.slice(0, -1) + 'ô';
				} else if (config['おう'] === 'ō') {
					dest = dest.slice(0, -1) + 'ō';
				} else if (config['おう'] === 'o') {
					// nope
				}
			} else if (prevJapanese && dest.match(/[aiueo]$/) && dest.slice(-1) === tokenDest[0] && token !== 'を') {
				tokenDest = tokenDest.slice(1);

				dest = dest.slice(0, -1) + config[{
					'a': 'ああ',
					'i': 'いい',
					'u': 'うう',
					'e': 'ええ',
					'o': 'おお',
				}[dest.slice(-1)]];
			}

			// んば
			if (tokenDest.match(/^[bpm]/) && previousToken === 'ん') {
				if (config['んば'] === 'nba') {
					// nope
				} else if (config['んば'] === 'mba') {
					dest = dest.slice(0, -1) + 'm';
				}
			}

			// んあ
			if (tokenDest.match(/^[aiueoy]/) && previousToken === 'ん') {
				if (config['んあ'] === 'na') {
					// nope
				} else if (config['んあ'] === 'n\'a') {
					tokenDest = '\'' + tokenDest;
				} else if (config['んあ'] === 'n-a') {
					tokenDest = '-' + tokenDest;
				}
			}

			if (config.punctuation && this.helpers.japanese.punctuation[token]) {
				tokenDest = this.helpers.japanese.punctuation[token];
			}

			dest += (tokenDest || tokenDestFallBack || '');

			prevJapanese = tokenDestFallBack ? false : true;

			previousToken = token;
		}

		if (previousToken === 'っ') {
			dest += '\'';
		}
		if (bSaveInput) { this.data.lastOutput = dest; }
		return dest;
	}
});